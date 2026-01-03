import { useState, useEffect } from 'react';
import { Filter, ArrowUpDown } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

const categories = ["All", "Bed Sheets", "Table Linen", "Cushion Covers", "Bath Linen", "Apparels", "Royal collection for furnishing and wall hangings"];

const products = [
    { id: 1, name: "Royal Satin Bed Sheet", category: "Bed Sheets", price: "₹ 1,500", image: "/images/bed-linen.png" },
    { id: 2, name: "Embroidered Cushion Cover", category: "Cushion Covers", price: "₹ 450", image: "/images/cushion.png" },
    { id: 3, name: "Vintage Table Runner", category: "Table Linen", price: "₹ 890", image: "/images/table-linen.png" },
    { id: 4, name: "Cotton Duvet Set", category: "Bed Sheets", price: "₹ 2,200", image: "/images/bed-linen.png" },
    { id: 5, name: "Floral Table Cloth", category: "Table Linen", price: "₹ 1,200", image: "/images/table-linen.png" },
    { id: 6, name: "Velvet Cushion Set", category: "Cushion Covers", price: "₹ 1,800", image: "/images/cushion.png" },
    { id: 7, name: "Cotton Lounge Set", category: "Apparels", price: "₹ 2,500", image: "/images/bed-linen.png" },
    { id: 8, name: "Silk Kimono Robe", category: "Apparels", price: "₹ 4,500", image: "/images/bed-linen.png" },
];

const ProductsPage = () => {
    const [searchParams] = useSearchParams();
    const [selectedCategory, setSelectedCategory] = useState("All");

    useEffect(() => {
        const categoryParam = searchParams.get('category');
        if (categoryParam) {
            const mappedCategory = {
                'bed-sheets': 'Bed Sheets',
                'table-linen': 'Table Linen',
                'cushion-covers': 'Cushion Covers',
                'bath-linen': 'Bath Linen',
                'apparels': 'Apparels'
            }[categoryParam] || "All";
            setSelectedCategory(mappedCategory);
        }
    }, [searchParams]);

    const [sortBy, setSortBy] = useState("featured");

    const filteredProducts = products
        .filter(p => selectedCategory === "All" || p.category === selectedCategory)
        .sort((a, b) => {
            const priceA = parseInt(a.price.replace(/[^0-9]/g, ''));
            const priceB = parseInt(b.price.replace(/[^0-9]/g, ''));

            if (sortBy === 'price-low-high') return priceA - priceB;
            if (sortBy === 'price-high-low') return priceB - priceA;
            if (sortBy === 'name-a-z') return a.name.localeCompare(b.name);
            return 0;
        });

    return (
        <div className="pt-28 pb-20 container mx-auto px-6">
            <h1 className="text-4xl font-serif font-bold text-center text-primary mb-12">Our Collection</h1>

            {/* Premium Control Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 sticky top-24 z-30 mb-8 mx-auto max-w-7xl">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-secondary font-medium text-sm">
                        Showing <span className="font-bold text-primary">{filteredProducts.length}</span> results
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        {/* Filter Dropdown */}
                        <div className="relative min-w-[200px]">
                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                <Filter className="w-4 h-4 text-gray-400" />
                            </div>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border-0 ring-1 ring-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:bg-white transition-all cursor-pointer appearance-none text-gray-700 font-medium"
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                </svg>
                            </div>
                        </div>

                        {/* Sort Dropdown */}
                        <div className="relative min-w-[200px]">
                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                <ArrowUpDown className="w-4 h-4 text-gray-400" />
                            </div>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border-0 ring-1 ring-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:bg-white transition-all cursor-pointer appearance-none text-gray-700 font-medium"
                            >
                                <option value="featured">Featured</option>
                                <option value="price-low-high">Price: Low to High</option>
                                <option value="price-high-low">Price: High to Low</option>
                                <option value="name-a-z">Name: A-Z</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 md:grid-cols-3 gap-8">
                {filteredProducts.map(product => (
                    <div key={product.id} className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:-translate-y-1">
                        <div className="relative overflow-hidden aspect-[4/5]">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                                <Link to={`/products/${product.id}`} className="bg-white text-primary px-8 py-3 rounded-full font-bold shadow-lg hover:bg-secondary hover:text-white transition-all transform hover:scale-105 active:scale-95">
                                    View Details
                                </Link>
                            </div>
                            {/* Price Tag Overlay */}
                            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-primary font-bold shadow-sm translate-y-[200%] group-hover:translate-y-0 transition-transform duration-300">
                                {product.price}
                            </div>
                        </div>
                        <div className="p-5">
                            <p className="text-xs text-secondary font-bold uppercase tracking-wider mb-2">{product.category}</p>
                            <h3 className="text-lg font-serif text-gray-800 mb-2 group-hover:text-primary transition-colors line-clamp-1">{product.name}</h3>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductsPage;
