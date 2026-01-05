import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Loader2, Upload, X } from 'lucide-react';
import { categoriesApi } from '../../lib/api';
import Modal from '../../components/common/Modal';
import { fileToBase64, validateImageFile } from '../../lib/fileUtils';
import { uploadApi } from '../../lib/api';

interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
    image_url?: string;
    is_active: boolean;
    is_featured?: boolean;
    featured_order?: number | null;
    created_at: string;
}

const AdminCategoriesPage = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
    const [formData, setFormData] = useState<Partial<Category>>({
        name: '',
        slug: '',
        description: '',
        image_url: '',
        is_active: true,
        is_featured: false,
        featured_order: null,
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageError, setImageError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        const response = await categoriesApi.getAll();
        if (response.data) {
            setCategories(response.data.categories || []);
        }
        setLoading(false);
    };

    const handleOpenModal = (category?: Category) => {
        if (category) {
            setCurrentCategory(category);
            setFormData({
                name: category.name,
                slug: category.slug,
                description: category.description || '',
                image_url: category.image_url || '',
                is_active: category.is_active,
                is_featured: category.is_featured || false,
                featured_order: category.featured_order || null,
            });
            setImageFile(null);
            setImagePreview(category.image_url || null);
            setImageError(null);
        } else {
            setCurrentCategory(null);
            setFormData({
                name: '',
                slug: '',
                description: '',
                image_url: '',
                is_active: true,
                is_featured: false,
                featured_order: null,
            });
            setImageFile(null);
            setImagePreview(null);
            setImageError(null);
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentCategory(null);
        setFormData({
            name: '',
            slug: '',
            description: '',
            image_url: '',
            is_active: true,
        });
        setImageFile(null);
        setImagePreview(null);
        setImageError(null);
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const validation = validateImageFile(file);
        if (!validation.valid) {
            setImageError(validation.error || 'Invalid image file');
            return;
        }

        setImageError(null);
        setImageFile(file);

        try {
            const base64 = await fileToBase64(file);
            setImagePreview(base64);
        } catch (error) {
            setImageError('Failed to process image');
            console.error(error);
        }
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        setImagePreview(null);
        setFormData({ ...formData, image_url: '' });
    };

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    };

    const handleNameChange = (name: string) => {
        setFormData({
            ...formData,
            name,
            slug: formData.slug || generateSlug(name),
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        // Upload image file to Supabase Storage if a new file was selected
        let imageUrl = formData.image_url;
        if (imageFile) {
            try {
                const uploadResponse = await uploadApi.uploadCategoryImage(imageFile);
                if (uploadResponse.error || !uploadResponse.data) {
                    setImageError(uploadResponse.error || 'Failed to upload image');
                    setSaving(false);
                    return;
                }
                imageUrl = uploadResponse.data.url;
            } catch (error) {
                setImageError('Failed to upload image');
                setSaving(false);
                return;
            }
        }

        try {
            // Validate featured order - Apparels cannot be featured
            const isApparels = formData.slug?.startsWith('apparels-') || formData.slug === 'apparels';
            if (isApparels && formData.is_featured) {
                alert('Apparels categories cannot be featured. Please uncheck "Show in Curated Collections".');
                setSaving(false);
                return;
            }

            let featuredOrder = null;
            if (formData.is_featured && !isApparels) {
                if (!formData.featured_order || formData.featured_order < 1 || formData.featured_order > 3) {
                    alert('Please select a featured order (1, 2, or 3)');
                    setSaving(false);
                    return;
                }
                featuredOrder = formData.featured_order;
            }

            const categoryData = {
                name: formData.name!,
                slug: formData.slug!,
                description: formData.description || null,
                image_url: imageUrl || null,
                is_active: formData.is_active !== false,
                is_featured: formData.is_featured || false,
                featured_order: featuredOrder,
            };

            if (currentCategory) {
                // Update existing category
                const response = await categoriesApi.update(currentCategory.id, categoryData);
                if (response.error) {
                    alert(response.error);
                } else {
                    await fetchCategories();
                    handleCloseModal();
                }
            } else {
                // Create new category
                if (!categoryData.slug) {
                    categoryData.slug = generateSlug(categoryData.name);
                }
                const response = await categoriesApi.create(categoryData);
                if (response.error) {
                    alert(response.error);
                } else {
                    await fetchCategories();
                    handleCloseModal();
                }
            }
        } catch (error) {
            alert('An error occurred');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteClick = (category: Category) => {
        setCurrentCategory(category);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!currentCategory) return;
        setDeleting(true);
        const response = await categoriesApi.delete(currentCategory.id);
        if (response.error) {
            alert(response.error);
        } else {
            await fetchCategories();
            setIsDeleteModalOpen(false);
            setCurrentCategory(null);
        }
        setDeleting(false);
    };

    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Separate regular categories from Apparels
    const regularCategories = filteredCategories.filter(cat => 
        !cat.slug?.startsWith('apparels-') && cat.slug !== 'apparels'
    );
    const apparelsCategories = filteredCategories.filter(cat => 
        cat.slug?.startsWith('apparels-') || cat.slug === 'apparels'
    );

    return (
        <div>
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 font-serif">Categories</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage product categories</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="px-4 py-2 bg-primary text-secondary font-bold rounded-lg hover:bg-primary/90 flex items-center gap-2 transition-colors"
                >
                    <Plus size={20} />
                    Add Category
                </button>
            </div>

            {/* Search */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search categories..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                </div>
            </div>

            {/* Categories Grid */}
            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : (
                <div className="space-y-8">
                    {/* Regular Product Categories */}
                    {regularCategories.length > 0 && (
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Product Categories</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {regularCategories.map((category) => (
                        <div key={category.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-800 text-lg mb-1">{category.name}</h3>
                                    <p className="text-sm text-gray-500 mb-2">/{category.slug}</p>
                                    {category.description && (
                                        <p className="text-sm text-gray-600 line-clamp-2">{category.description}</p>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 ml-4">
                                    <button
                                        onClick={() => handleOpenModal(category)}
                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                        title="Edit"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(category)}
                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                <div className="flex items-center gap-2">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                                        category.is_active
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-gray-100 text-gray-700'
                                    }`}>
                                        {category.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                    {category.is_featured && (
                                        <span className="px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-700">
                                            Featured #{category.featured_order}
                                        </span>
                                    )}
                                </div>
                                {category.image_url && (
                                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                                        <img src={category.image_url} alt={category.name} className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                            </div>
                        </div>
                    )}
                    
                    {/* Apparels Categories */}
                    {apparelsCategories.length > 0 && (
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Apparels</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {apparelsCategories.map((category: Category) => (
                                    <div key={category.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <h3 className="font-bold text-gray-800 text-lg mb-1">{category.name}</h3>
                                                <p className="text-sm text-gray-500 mb-2">/{category.slug}</p>
                                                {category.description && (
                                                    <p className="text-sm text-gray-600 line-clamp-2">{category.description}</p>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 ml-4">
                                                <button
                                                    onClick={() => handleOpenModal(category)}
                                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(category)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                            <div className="flex items-center gap-2">
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                    category.is_active
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-gray-100 text-gray-700'
                                                }`}>
                                                    {category.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                                {category.is_featured && (
                                                    <span className="px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-700">
                                                        Featured #{category.featured_order}
                                                    </span>
                                                )}
                                            </div>
                                            {category.image_url && (
                                                <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                                                    <img src={category.image_url} alt={category.name} className="w-full h-full object-cover" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {!loading && regularCategories.length === 0 && apparelsCategories.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    {searchTerm ? `No categories found matching "${searchTerm}"` : 'No categories found'}
                </div>
            )}

            {/* Add/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={currentCategory ? 'Edit Category' : 'Add New Category'}
                footer={
                    <>
                        <button
                            onClick={handleCloseModal}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={saving || !formData.name}
                            className="px-4 py-2 bg-primary text-secondary font-bold rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {saving ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Plus size={18} />
                                    {currentCategory ? 'Update' : 'Create'}
                                </>
                            )}
                        </button>
                    </>
                }
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category Name *</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleNameChange(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                            placeholder="e.g., Bed Linens"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
                        <input
                            type="text"
                            value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                            placeholder="e.g., bed-linens"
                        />
                        <p className="text-xs text-gray-500 mt-1">URL-friendly identifier</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                            placeholder="Category description..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category Image</label>
                        {imagePreview ? (
                            <div className="relative">
                                <div className="w-full h-48 rounded-lg overflow-hidden border border-gray-300 bg-gray-50">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={handleRemoveImage}
                                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ) : (
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Upload className="w-8 h-8 mb-2 text-gray-400" />
                                    <p className="mb-2 text-sm text-gray-500">
                                        <span className="font-semibold">Click to upload</span> or drag and drop
                                    </p>
                                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                                </div>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </label>
                        )}
                        {imageError && (
                            <p className="mt-1 text-sm text-red-600">{imageError}</p>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="is_active"
                            checked={formData.is_active}
                            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                            className="w-4 h-4 text-primary rounded focus:ring-primary"
                        />
                        <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                            Active (visible to customers)
                        </label>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setCurrentCategory(null);
                }}
                title="Delete Category"
                footer={
                    <>
                        <button
                            onClick={() => {
                                setIsDeleteModalOpen(false);
                                setCurrentCategory(null);
                            }}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={deleting}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {deleting ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <Trash2 size={18} />
                                    Delete
                                </>
                            )}
                        </button>
                    </>
                }
            >
                <div className="text-center py-4">
                    <p className="text-gray-600 mb-4">
                        Are you sure you want to delete <span className="font-bold text-gray-800">{currentCategory?.name}</span>?
                    </p>
                    <p className="text-sm text-gray-500">
                        This action cannot be undone. Products in this category will need to be reassigned.
                    </p>
                </div>
            </Modal>
        </div>
    );
};

export default AdminCategoriesPage;

