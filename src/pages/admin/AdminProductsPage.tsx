import { useState, useRef } from 'react';
import { Plus, Search, Edit2, Trash2, Filter, Bold, Italic, List, Type } from 'lucide-react';
import Modal from '../../components/common/Modal';

interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
    stock: number;
    image: string;
    description: string;
}

const initialProducts: Product[] = [
    { id: 1, name: 'Classic Silk Saree', category: 'Sarees', price: 12500, stock: 15, image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=200&auto=format&fit=crop', description: '<p>A beautiful <strong>Classic Silk Saree</strong> perfect for weddings.</p><ul><li>Pure Silk</li><li>Handwoven</li></ul>' },
    { id: 2, name: 'Gold Embroidered Kurta', category: 'Kurtas', price: 4500, stock: 32, image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=200&auto=format&fit=crop', description: '<p>Elegant Gold Embroidered Kurta.</p>' },
    { id: 3, name: 'Royal Blue Sherwani', category: 'Sherwanis', price: 25000, stock: 8, image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=200&auto=format&fit=crop', description: '<p>Royal look for the special day.</p>' },
    { id: 4, name: 'Cotton Handloom Scarf', category: 'Accessories', price: 1200, stock: 50, image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=200&auto=format&fit=crop', description: '<p>Soft cotton scarf.</p>' },
    { id: 5, name: 'Banarasi Dupatta', category: 'Dupattas', price: 3500, stock: 20, image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=200&auto=format&fit=crop', description: '<p>Rich Banarasi fabric.</p>' },
];

const AdminProductsPage = () => {
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    // Editor Ref
    const editorRef = useRef<HTMLTextAreaElement>(null);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
    const [formData, setFormData] = useState<Partial<Product>>({});

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const categories = ['All', ...new Set(products.map(p => p.category))];

    const handleOpenModal = (product?: Product) => {
        if (product) {
            setCurrentProduct(product);
            setFormData(product);
        } else {
            setCurrentProduct(null);
            setFormData({ name: '', category: 'Sarees', price: 0, stock: 0, image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=200&auto=format&fit=crop', description: '' });
        }
        setIsModalOpen(true);
    };

    const handleSaveProduct = () => {
        if (currentProduct) {
            // Edit
            setProducts(products.map(p => p.id === currentProduct.id ? { ...p, ...formData } as Product : p));
        } else {
            // Add
            const newProduct = { ...formData, id: Date.now() } as Product;
            setProducts([newProduct, ...products]);
        }
        setIsModalOpen(false);
    };

    const handleDeleteClick = (product: Product) => {
        setCurrentProduct(product);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (currentProduct) {
            setProducts(products.filter(p => p.id !== currentProduct.id));
            setIsDeleteModalOpen(false);
            setCurrentProduct(null);
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
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Product List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold">
                            <tr>
                                <th className="px-6 py-4">Product</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Price</th>
                                <th className="px-6 py-4">Stock</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100">
                                                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                            </div>
                                            <span className="font-medium text-gray-800">{product.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{product.category}</td>
                                    <td className="px-6 py-4 font-medium text-gray-800">₹{product.price.toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${product.stock > 10 ? 'bg-green-100 text-green-700' :
                                            product.stock > 0 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {product.stock} in stock
                                        </span>
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
                {filteredProducts.length === 0 && (
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
                            <input
                                type="text"
                                value={formData.category || ''}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                placeholder="e.g. Sarees"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                            <input
                                type="number"
                                value={formData.price || 0}
                                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                        <input
                            type="number"
                            value={formData.stock || 0}
                            onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                        <input
                            type="text"
                            value={formData.image || ''}
                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                            placeholder="https://..."
                        />
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
