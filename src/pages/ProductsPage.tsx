import { useState, useEffect } from 'react';
import { Filter, ArrowUpDown, Loader2 } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { productsApi, categoriesApi } from '../lib/api';

interface Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    category_id: string | null;
    price: number;
    discount_percentage: number;
    quantity: number;
    image_url: string | null;
    images: string[];
    is_active: boolean;
    category?: {
        id: string;
        name: string;
        slug: string;
    };
}

const ProductsPage = () => {
    const [searchParams] = useSearchParams();
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [sortBy, setSortBy] = useState("featured");
    const [searchTerm, setSearchTerm] = useState("");

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            const response = await categoriesApi.getAll();
            if (response.data) {
                setCategories(response.data.categories);
            }
        };
        fetchCategories();
    }, []);

    // Handle category from URL params
    useEffect(() => {
        const categoryParam = searchParams.get('category');
        if (categoryParam) {
            // Find category by slug
            const category = categories.find(cat => cat.slug === categoryParam);
            if (category) {
                setSelectedCategory(category.id);
            }
        } else {
            setSelectedCategory("");
        }
    }, [searchParams, categories]);

    // Fetch products
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            const response = await productsApi.getAll({
                category_id: selectedCategory || undefined,
                is_active: true,
                search: searchTerm || undefined,
            });
            if (response.data) {
                setProducts(response.data.products);
            }
            setLoading(false);
        };
        fetchProducts();
    }, [selectedCategory, searchTerm]);

    // Calculate discounted price
    const getDiscountedPrice = (product: Product) => {
        const discount = product.discount_percentage || 0;
        return product.price * (1 - discount / 100);
    };

    // Sort products
    const sortedProducts = [...products].sort((a, b) => {
        const priceA = getDiscountedPrice(a);
        const priceB = getDiscountedPrice(b);

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
                        Showing <span className="font-bold text-primary">{sortedProducts.length}</span> results
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        {/* Search */}
                        <div className="relative min-w-[200px]">
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-4 pr-4 py-2.5 bg-gray-50 border-0 ring-1 ring-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:bg-white transition-all text-gray-700 font-medium"
                            />
                        </div>

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
                                <option value="">All Categories</option>
                                {categories
                                    .filter(cat => !cat.slug?.startsWith('apparels-') && cat.slug !== 'apparels')
                                    .map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
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
            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : sortedProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 md:grid-cols-3 gap-8">
                    {sortedProducts.map(product => {
                        const discountedPrice = getDiscountedPrice(product);
                        const originalPrice = product.price;
                        const hasDiscount = product.discount_percentage > 0;

                        return (
                            <div key={product.id} className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:-translate-y-1">
                                <div className="relative overflow-hidden aspect-[4/5]">
                                    <img
                                        src={product.image_url || product.images?.[0] || "/images/bed-linen.png"}
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
                                        {hasDiscount ? (
                                            <div>
                                                <span className="line-through text-gray-400 text-xs mr-1">₹{originalPrice.toLocaleString()}</span>
                                                <span>₹{Math.round(discountedPrice).toLocaleString()}</span>
                                            </div>
                                        ) : (
                                            <span>₹{originalPrice.toLocaleString()}</span>
                                        )}
                                    </div>
                                    {hasDiscount && (
                                        <div className="absolute top-4 left-4 bg-secondary text-primary px-2 py-1 rounded text-xs font-bold">
                                            {product.discount_percentage}% OFF
                                        </div>
                                    )}
                                </div>
                                <div className="p-5">
                                    <p className="text-xs text-secondary font-bold uppercase tracking-wider mb-2">
                                        {product.category?.name || 'Uncategorized'}
                                    </p>
                                    <h3 className="text-lg font-serif text-gray-800 mb-2 group-hover:text-primary transition-colors line-clamp-1">{product.name}</h3>
                                    {product.quantity === 0 && (
                                        <p className="text-xs text-red-500 font-medium">Out of Stock</p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-20">
                    <p className="text-gray-500 text-lg">No products found</p>
                </div>
            )}
        </div>
    );
};

export default ProductsPage;
