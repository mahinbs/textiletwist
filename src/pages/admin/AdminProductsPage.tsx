import { useState, useRef, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Filter, Bold, Italic, List, Type, Loader2, Upload, X } from 'lucide-react';
import Modal from '../../components/common/Modal';
import { productsApi, categoriesApi } from '../../lib/api';
import { fileToBase64, validateImageFile } from '../../lib/fileUtils';
import { uploadApi } from '../../lib/api';

interface Product {
    id: string;
    name: string;
    category_id: string | null;
    price: number;
    quantity: number;
    discount_percentage: number;
    image_url: string | null;
    images: string[];
    description: string;
    is_active: boolean;
    category?: {
        id: string;
        name: string;
    };
}

const AdminProductsPage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    // Editor Ref
    const editorRef = useRef<HTMLTextAreaElement>(null);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
    const [formData, setFormData] = useState<Partial<Product>>({});
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [imageError, setImageError] = useState<string | null>(null);

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        const response = await productsApi.getAll();
        if (response.data) {
            setProducts(response.data.products || []);
        }
        setLoading(false);
    };

    const fetchCategories = async () => {
        const response = await categoriesApi.getAll();
        if (response.data) {
            setCategories(response.data.categories || []);
        }
    };

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !selectedCategory || product.category_id === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleOpenModal = (product?: Product) => {
        if (product) {
            setCurrentProduct(product);
            setFormData({
                name: product.name,
                category_id: product.category_id || '',
                price: product.price,
                quantity: product.quantity,
                discount_percentage: product.discount_percentage || 0,
                image_url: product.image_url || '',
                images: product.images || [],
                description: product.description || '',
                is_active: product.is_active,
            });
            setImageFiles([]);
            setImagePreviews(product.images && product.images.length > 0 ? product.images : (product.image_url ? [product.image_url] : []));
            setImageError(null);
        } else {
            setCurrentProduct(null);
            setFormData({
                name: '',
                category_id: categories[0]?.id || '',
                price: 0,
                quantity: 0,
                discount_percentage: 0,
                image_url: '',
                images: [],
                description: '',
                is_active: true,
            });
            setImageFiles([]);
            setImagePreviews([]);
            setImageError(null);
        }
        setIsModalOpen(true);
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        // Validate all files
        for (const file of files) {
            const validation = validateImageFile(file);
            if (!validation.valid) {
                setImageError(validation.error || 'Invalid image file');
                return;
            }
        }

        setImageError(null);
        const newFiles = [...imageFiles, ...files];
        setImageFiles(newFiles);

        try {
            // Create previews using base64 (for display only)
            const base64Images = await Promise.all(files.map(file => fileToBase64(file)));
            setImagePreviews([...imagePreviews, ...base64Images]);
        } catch (error) {
            setImageError('Failed to process images');
            console.error(error);
        }
    };

    const handleRemoveImage = (index: number) => {
        const newPreviews = imagePreviews.filter((_preview, i) => i !== index);
        setImagePreviews(newPreviews);
        
        // If it was a new file, remove from imageFiles
        if (index < imageFiles.length) {
            const newFiles = imageFiles.filter((_file, i) => i !== index);
            setImageFiles(newFiles);
        }
    };

    const handleSaveProduct = async () => {
        if (!formData.name || formData.price === undefined) {
            alert('Name and price are required');
            return;
        }

        // Upload new image files to Supabase Storage
        let images = formData.images || [];
        if (imageFiles.length > 0) {
            try {
                const uploadResponse = await uploadApi.uploadProductImages(imageFiles);
                if (uploadResponse.error || !uploadResponse.data) {
                    setImageError(uploadResponse.error || 'Failed to upload images');
                    return;
                }
                // Combine existing images (from previews that are URLs) with newly uploaded images
                const existingImages = imagePreviews.filter((_preview, index) => index >= imageFiles.length);
                images = [...existingImages, ...uploadResponse.data.urls];
            } catch (error) {
                setImageError('Failed to upload images');
                return;
            }
        } else if (imagePreviews.length > 0) {
            // Use existing previews if no new files (these are already URLs)
            images = imagePreviews;
        }

        const productData = {
            ...formData,
            images: images.length > 0 ? images : [],
            image_url: images.length > 0 ? images[0] : null, // First image as primary
        };

        if (currentProduct) {
            // Edit
            const response = await productsApi.update(currentProduct.id, productData);
            if (response.error) {
                alert(response.error);
            } else {
                await fetchProducts();
                setIsModalOpen(false);
                setImageFiles([]);
                setImagePreviews([]);
            }
        } else {
            // Add
            const response = await productsApi.create(productData);
            if (response.error) {
                alert(response.error);
            } else {
                await fetchProducts();
                setIsModalOpen(false);
                setImageFiles([]);
                setImagePreviews([]);
            }
        }
    };

    const handleDeleteClick = (product: Product) => {
        setCurrentProduct(product);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (currentProduct) {
            const response = await productsApi.delete(currentProduct.id);
            if (response.error) {
                alert(response.error);
            } else {
                await fetchProducts();
                setIsDeleteModalOpen(false);
                setCurrentProduct(null);
            }
        }
    };

    const insertTag = (tagOpen: string, tagClose: string = '') => {
        if (editorRef.current) {
            const start = editorRef.current.selectionStart;
            const end = editorRef.current.selectionEnd;
            const text = formData.description || '';
            const before = text.substring(0, start);
            const selection = text.substring(start, end);
            const after = text.substring(end);

            const newText = before + tagOpen + selection + tagClose + after;
            setFormData({ ...formData, description: newText });

            // Simple restore focus logic
            setTimeout(() => {
                if (editorRef.current) {
                    editorRef.current.focus();
                }
            }, 0);
        }
    };

    return (
        <div>
            {/* Header Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 font-serif">Products</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage your product catalog</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <Plus size={20} />
                    <span>Add Product</span>
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                </div>
                <div className="relative w-full md:w-48">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
                    >
                        <option value="">All Categories</option>
                        <optgroup label="Product Categories">
                            {categories
                                .filter(cat => !cat.slug?.startsWith('apparels-') && cat.slug !== 'apparels')
                                .map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                        </optgroup>
                        <optgroup label="Apparels">
                            {categories
                                .filter(cat => cat.slug?.startsWith('apparels-') || cat.slug === 'apparels')
                                .map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                        </optgroup>
                    </select>
                </div>
            </div>

            {/* Product List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center">
                        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold">
                                <tr>
                                    <th className="px-6 py-4">Product</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4">Price</th>
                                    <th className="px-6 py-4">Stock</th>
                                    <th className="px-6 py-4">Discount</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredProducts.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100">
                                                    <img
                                                        src={product.image_url || product.images?.[0] || '/images/bed-linen.png'}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <span className="font-medium text-gray-800">{product.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">{product.category?.name || 'Uncategorized'}</td>
                                        <td className="px-6 py-4 font-medium text-gray-800">₹{product.price.toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-md text-xs font-medium ${product.quantity > 10 ? 'bg-green-100 text-green-700' :
                                                product.quantity > 0 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                {product.quantity} in stock
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {product.discount_percentage > 0 ? `${product.discount_percentage}%` : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleOpenModal(product)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(product)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {!loading && filteredProducts.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                        No products found matching your search.
                    </div>
                )}
            </div>

            {/* Add/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={currentProduct ? 'Edit Product' : 'Add New Product'}
                footer={
                    <>
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSaveProduct}
                            className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90"
                        >
                            Save Product
                        </button>
                    </>
                }
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                        <input
                            type="text"
                            value={formData.name || ''}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                            placeholder="e.g. Silk Saree"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select
                                value={formData.category_id || ''}
                                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                            >
                                <option value="">Select Category</option>
                                <optgroup label="Product Categories">
                                    {categories
                                        .filter(cat => !cat.slug?.startsWith('apparels-') && cat.slug !== 'apparels')
                                        .map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                </optgroup>
                                <optgroup label="Apparels">
                                    {categories
                                        .filter(cat => cat.slug?.startsWith('apparels-') || cat.slug === 'apparels')
                                        .map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                </optgroup>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.price || 0}
                                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                            <input
                                type="number"
                                value={formData.quantity || 0}
                                onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                max="100"
                                value={formData.discount_percentage || 0}
                                onChange={(e) => setFormData({ ...formData, discount_percentage: Number(e.target.value) })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Images</label>
                        {imagePreviews.length > 0 && (
                            <div className="grid grid-cols-3 gap-3 mb-3">
                                {imagePreviews.map((preview: string, index: number) => (
                                    <div key={index} className="relative group">
                                        <div className="w-full h-32 rounded-lg overflow-hidden border border-gray-300 bg-gray-50">
                                            <img
                                                src={preview}
                                                alt={`Preview ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage(index)}
                                            className="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <X size={14} />
                                        </button>
                                        {index === 0 && (
                                            <span className="absolute bottom-1 left-1 px-2 py-0.5 bg-primary text-white text-xs rounded">
                                                Primary
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-8 h-8 mb-2 text-gray-400" />
                                <p className="mb-2 text-sm text-gray-500">
                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB (multiple images allowed)</p>
                            </div>
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                multiple
                                onChange={handleImageChange}
                            />
                        </label>
                        {imageError && (
                            <p className="mt-1 text-sm text-red-600">{imageError}</p>
                        )}
                        <p className="mt-1 text-xs text-gray-500">First image will be used as the primary product image.</p>
                    </div>
                    <div>
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={formData.is_active !== false}
                                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                className="rounded"
                            />
                            <span className="text-sm font-medium text-gray-700">Active</span>
                        </label>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description (HTML Supported)</label>
                        <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary">
                            <div className="bg-gray-50 border-b border-gray-200 px-3 py-2 flex items-center gap-2">
                                <button type="button" onClick={() => insertTag('<strong>', '</strong>')} className="p-1 hover:bg-gray-200 rounded text-gray-600" title="Bold">
                                    <Bold size={16} />
                                </button>
                                <button type="button" onClick={() => insertTag('<em>', '</em>')} className="p-1 hover:bg-gray-200 rounded text-gray-600" title="Italic">
                                    <Italic size={16} />
                                </button>
                                <div className="w-px h-4 bg-gray-300 mx-1"></div>
                                <button type="button" onClick={() => insertTag('<ul><li>', '</li></ul>')} className="p-1 hover:bg-gray-200 rounded text-gray-600" title="Bulleted List">
                                    <List size={16} />
                                </button>
                                <button type="button" onClick={() => insertTag('<h3>', '</h3>')} className="p-1 hover:bg-gray-200 rounded text-gray-600" title="Heading">
                                    <Type size={16} />
                                </button>
                            </div>
                            <textarea
                                ref={editorRef}
                                value={formData.description || ''}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-4 py-3 bg-white focus:outline-none text-sm font-mono text-gray-700 resize-none h-48"
                                placeholder="Enter product description here..."
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Use the toolbar to add formatting.</p>
                    </div>
                </div>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Delete Product"
                footer={
                    <>
                        <button
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirmDelete}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700"
                        >
                            Delete
                        </button>
                    </>
                }
            >
                <div className="text-center py-4">
                    <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Trash2 size={24} />
                    </div>
                    <p className="text-gray-600">
                        Are you sure you want to delete <span className="font-bold text-gray-800">{currentProduct?.name}</span>?
                        <br />This action cannot be undone.
                    </p>
                </div>
            </Modal>
        </div>
    );
};

export default AdminProductsPage;
