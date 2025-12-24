import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { ArrowLeft, Star, ShoppingCart, Truck, Shield } from 'lucide-react';

// Mock data (in a real app, fetch from API/Context)
const products = [
    { id: 1, name: "Royal Satin Bed Sheet", category: "Bed Sheets", price: "₹ 1,500", image: "/images/bed-linen.png", description: "Experience the ultimate luxury with our Royal Satin Bed Sheet. 400 Thread count, 100% Egyptian Cotton." },
    { id: 2, name: "Embroidered Cushion Cover", category: "Cushion Covers", price: "₹ 450", image: "/images/cushion.png", description: "Hand-embroidered cushion cover with intricate patterns. Adds a touch of elegance to any living room." },
    { id: 3, name: "Vintage Table Runner", category: "Table Linen", price: "₹ 890", image: "/images/table-linen.png", description: "Classic design with modern durability. Perfect for family gatherings." },
    { id: 4, name: "Cotton Duvet Set", category: "Bed Sheets", price: "₹ 2,200", image: "/images/bed-linen.png", description: "Complete bedding solution. Includes duvet cover and two pillowcases." },
    { id: 5, name: "Floral Table Cloth", category: "Table Linen", price: "₹ 1,200", image: "/images/table-linen.png", description: "Bring spring to your dining room. High quality print on premium cotton." },
    { id: 6, name: "Velvet Cushion Set", category: "Cushion Covers", price: "₹ 1,800", image: "/images/cushion.png", description: "Set of 3 luxury velvet cushions. Soft touch and deep colors." }
];

const ProductDetailsPage = () => {
    const { id } = useParams();
    const product = products.find(p => p.id === Number(id)) || {
        name: "Product Not Found",
        category: "N/A",
        price: "-",
        image: "https://placehold.co/600x600?text=No+Image",
        description: "The product you are looking for does not exist."
    };

    const [selectedSize, setSelectedSize] = useState("Queen");

    return (
        <div className="pt-24 pb-20 container mx-auto px-6">
            <Link to="/products" className="inline-flex items-center text-gray-600 hover:text-primary mb-8 transition-colors">
                <ArrowLeft className="w-5 h-5 mr-2" /> Back to Collection
            </Link>

            <div className="flex flex-col lg:flex-row gap-16 mb-20">
                <div className="lg:w-1/2">
                    <img src={product.image} alt={product.name} className="w-full rounded-2xl shadow-xl hover:scale-[1.02] transition-transform duration-500" />
                </div>
                <div className="lg:w-1/2">
                    <div className="mb-8">
                        <span className="text-secondary font-bold uppercase tracking-wider text-sm">{product.category}</span>
                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mt-3 mb-4">{product.name}</h1>
                        <div className="flex items-center gap-2 text-secondary">
                            <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 fill-current" />
                                ))}
                            </div>
                            <span className="text-gray-500 text-sm ml-2">(24 Reviews)</span>
                        </div>
                    </div>

                    <p className="text-3xl font-bold text-gray-900 mb-6">{product.price}</p>
                    <p className="text-gray-600 leading-relaxed text-lg mb-8 border-l-4 border-secondary pl-4 bg-gray-50 py-2">
                        {product.description}
                    </p>

                    {/* Sizes */}
                    <div className="mb-8">
                        <h3 className="font-bold text-gray-800 mb-3">Select Size</h3>
                        <div className="flex gap-3">
                            {["Single", "Queen", "King", "Super King"].map(size => (
                                <button
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    className={`px-6 py-2 rounded-md border font-medium transition-all ${selectedSize === size
                                        ? 'border-secondary bg-secondary text-white shadow-md'
                                        : 'border-gray-200 text-gray-600 hover:border-secondary hover:text-secondary'
                                        }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 mb-10">
                        <button
                            onClick={() => alert(`Added ${product.name} (${selectedSize}) to cart!`)}
                            className="flex-1 bg-primary text-secondary py-4 font-bold text-lg rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl translate-y-0 hover:-translate-y-1 transform"
                        >
                            <ShoppingCart className="w-5 h-5" /> Add to Cart
                        </button>
                        <button
                            onClick={() => alert('Proceeding to checkout...')}
                            className="flex-1 border-2 border-primary text-primary py-4 font-bold text-lg rounded-xl hover:bg-primary hover:text-secondary transition-all"
                        >
                            Buy Now
                        </button>
                    </div>

                    {/* Basics / Details */}
                    <div className="border-t border-gray-200 py-6 space-y-4">
                        <h3 className="font-bold text-xl text-primary font-serif">Basics & Care</h3>
                        <ul className="list-disc pl-5 text-gray-600 space-y-2">
                            <li><strong>Material:</strong> 100% Premium Cotton</li>
                            <li><strong>Thread Count:</strong> 400 TC Satin Weave</li>
                            <li><strong>Care:</strong> Machine wash cold, tumble dry low</li>
                            <li><strong>Origin:</strong> Handcrafted in India</li>
                        </ul>
                    </div>

                    {/* Payment Details */}
                    <div className="border-t border-gray-200 py-6">
                        <h3 className="font-bold text-gray-800 mb-4">Payment & Delivery</h3>
                        <div className="flex gap-4 mb-4 grayscale opacity-70">
                            {/* Simple placeholders for payment icons */}
                            <div className="h-8 w-12 bg-gray-200 rounded flex items-center justify-center text-xs font-bold">VISA</div>
                            <div className="h-8 w-12 bg-gray-200 rounded flex items-center justify-center text-xs font-bold">MC</div>
                            <div className="h-8 w-12 bg-gray-200 rounded flex items-center justify-center text-xs font-bold">UPI</div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                                <Truck className="w-5 h-5 text-secondary" /> Free Shipping over ₹999
                            </div>
                            <div className="flex items-center gap-2">
                                <Shield className="w-5 h-5 text-secondary" /> 30-Day Return Policy
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Accessories / Related Products */}
            <div className="border-t border-gray-200 pt-16">
                <h2 className="text-3xl font-serif font-bold text-center text-primary mb-12">Complete The Look</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.slice(0, 4).map(p => (
                        <Link to={`/products/${p.id}`} key={p.id} className="group block">
                            <div className="relative overflow-hidden rounded-xl aspect-[4/5] mb-4">
                                <img
                                    src={p.image}
                                    alt={p.name}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:scale-110 transition-transform">
                                    <ShoppingCart className="w-4 h-4 text-primary" />
                                </div>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800 group-hover:text-primary transition-colors">{p.name}</h3>
                                <p className="text-secondary">{p.price}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsPage;
