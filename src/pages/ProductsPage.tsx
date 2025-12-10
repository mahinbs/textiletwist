import { useState } from 'react';
import { Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

const categories = ["All", "Bed Sheets", "Table Linen", "Cushion Covers", "Bath Linen"];

const products = [
    { id: 1, name: "Royal Satin Bed Sheet", category: "Bed Sheets", price: "₹ 1,500", image: "/images/bed-linen.png" },
    { id: 2, name: "Embroidered Cushion Cover", category: "Cushion Covers", price: "₹ 450", image: "/images/cushion.png" },
    { id: 3, name: "Vintage Table Runner", category: "Table Linen", price: "₹ 890", image: "/images/table-linen.png" },
    { id: 4, name: "Cotton Duvet Set", category: "Bed Sheets", price: "₹ 2,200", image: "/images/bed-linen.png" },
    { id: 5, name: "Floral Table Cloth", category: "Table Linen", price: "₹ 1,200", image: "/images/table-linen.png" },
    { id: 6, name: "Velvet Cushion Set", category: "Cushion Covers", price: "₹ 1,800", image: "/images/cushion.png" },
];

const ProductsPage = () => {
    const [selectedCategory, setSelectedCategory] = useState("All");

    const filteredProducts = selectedCategory === "All"
        ? products
        : products.filter(p => p.category === selectedCategory);

    return (
        <div className="pt-24 pb-20 container mx-auto px-6">
            <h1 className="text-4xl font-serif font-bold text-center text-primary mb-12">Our Collection</h1>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Filters Sidebar */}
                <div className="w-full md:w-1/4">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 sticky top-24">
                        <div className="flex items-center gap-2 mb-4">
                            <Filter className="w-5 h-5 text-secondary" />
                            <h3 className="font-bold text-lg">Filters</h3>
                        </div>
                        <div className="space-y-2">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`block w-full text-left px-4 py-2 rounded-md transition-colors ${selectedCategory === cat
                                        ? 'bg-primary text-white'
                                        : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Product Grid */}
                <div className="w-full md:w-3/4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredProducts.map(product => (
                            <div key={product.id} className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
                                <div className="relative overflow-hidden aspect-[4/5]">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        <Link to={`/products/${product.id}`} className="bg-white text-primary px-6 py-2 rounded-full font-medium hover:bg-secondary hover:text-white transition-colors">
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <p className="text-xs text-secondary font-bold uppercase tracking-wider mb-2">{product.category}</p>
                                    <h3 className="text-xl font-serif text-gray-800 mb-2">{product.name}</h3>
                                    <p className="text-primary font-bold text-lg">{product.price}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductsPage;
