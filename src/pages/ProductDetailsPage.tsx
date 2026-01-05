import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, Star, ShoppingCart, Truck, Shield, Loader2, Heart } from 'lucide-react';
import { productsApi, cartApi, wishlistApi } from '../lib/api';

const ProductDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [addingToCart, setAddingToCart] = useState(false);
    const [inWishlist, setInWishlist] = useState(false);
    const [selectedSize, setSelectedSize] = useState("Queen");

    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) return;
            setLoading(true);
            const response = await productsApi.getById(id);
            if (response.data) {
                setProduct(response.data.product);
            }
            setLoading(false);
        };
        fetchProduct();
    }, [id]);

    useEffect(() => {
        const checkWishlist = async () => {
            if (!id) return;
            const response = await wishlistApi.check(id);
            if (response.data) {
                setInWishlist(response.data.inWishlist);
            }
        };
        checkWishlist();
    }, [id]);

    const handleAddToCart = async () => {
        if (!product || product.quantity === 0) {
            alert('Product is out of stock');
            return;
        }
        setAddingToCart(true);
        const response = await cartApi.add(product.id, 1);
        if (response.error) {
            alert(response.error);
        } else {
            alert('Added to cart!');
        }
        setAddingToCart(false);
    };

    const handleAddToWishlist = async () => {
        if (!product) return;
        if (inWishlist) {
            const response = await wishlistApi.remove(product.id);
            if (!response.error) {
                setInWishlist(false);
            }
        } else {
            const response = await wishlistApi.add(product.id);
            if (!response.error) {
                setInWishlist(true);
            }
        }
    };

    const handleBuyNow = async () => {
        await handleAddToCart();
        navigate('/cart');
    };

    if (loading) {
        return (
            <div className="pt-24 pb-20 container mx-auto px-6 flex justify-center items-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="pt-24 pb-20 container mx-auto px-6">
                <Link to="/products" className="inline-flex items-center text-gray-600 hover:text-primary mb-8 transition-colors">
                    <ArrowLeft className="w-5 h-5 mr-2" /> Back to Collection
                </Link>
                <div className="text-center py-20">
                    <p className="text-xl text-gray-500">Product not found</p>
                </div>
            </div>
        );
    }

    const discountedPrice = product.price * (1 - (product.discount_percentage || 0) / 100);
    const hasDiscount = product.discount_percentage > 0;

    return (
        <div className="pt-24 pb-20 container mx-auto px-6">
            <Link to="/products" className="inline-flex items-center text-gray-600 hover:text-primary mb-8 transition-colors">
                <ArrowLeft className="w-5 h-5 mr-2" /> Back to Collection
            </Link>

            <div className="flex flex-col lg:flex-row gap-16 mb-20">
                <div className="lg:w-1/2">
                    <img
                        src={product.image_url || product.images?.[0] || "/images/bed-linen.png"}
                        alt={product.name}
                        className="w-full rounded-2xl shadow-xl hover:scale-[1.02] transition-transform duration-500"
                    />
                </div>
                <div className="lg:w-1/2">
                    <div className="mb-8">
                        <span className="text-secondary font-bold uppercase tracking-wider text-sm">
                            {product.category?.name || 'Uncategorized'}
                        </span>
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

                    <div className="mb-6">
                        {hasDiscount ? (
                            <div className="flex items-center gap-4">
                                <p className="text-3xl font-bold text-gray-900">₹{Math.round(discountedPrice).toLocaleString()}</p>
                                <p className="text-xl text-gray-400 line-through">₹{product.price.toLocaleString()}</p>
                                <span className="bg-secondary text-primary px-3 py-1 rounded text-sm font-bold">
                                    {product.discount_percentage}% OFF
                                </span>
                            </div>
                        ) : (
                            <p className="text-3xl font-bold text-gray-900">₹{product.price.toLocaleString()}</p>
                        )}
                    </div>

                    {product.quantity === 0 && (
                        <p className="text-red-500 font-medium mb-4">Out of Stock</p>
                    )}

                    <p className="text-gray-600 leading-relaxed text-lg mb-8 border-l-4 border-secondary pl-4 bg-gray-50 py-2">
                        {product.description || 'No description available.'}
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
                            onClick={handleAddToCart}
                            disabled={addingToCart || product.quantity === 0}
                            className="flex-1 bg-primary text-secondary py-4 font-bold text-lg rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl translate-y-0 hover:-translate-y-1 transform disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {addingToCart ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" /> Adding...
                                </>
                            ) : (
                                <>
                                    <ShoppingCart className="w-5 h-5" /> Add to Cart
                                </>
                            )}
                        </button>
                        <button
                            onClick={handleBuyNow}
                            disabled={product.quantity === 0}
                            className="flex-1 border-2 border-primary text-primary py-4 font-bold text-lg rounded-xl hover:bg-primary hover:text-secondary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Buy Now
                        </button>
                        <button
                            onClick={handleAddToWishlist}
                            className={`p-4 border-2 rounded-xl transition-all ${inWishlist
                                ? 'border-red-500 text-red-500 bg-red-50'
                                : 'border-gray-200 text-gray-600 hover:border-secondary hover:text-secondary'
                                }`}
                        >
                            <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
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
                            <li><strong>Stock:</strong> {product.quantity} available</li>
                        </ul>
                    </div>

                    {/* Payment Details */}
                    <div className="border-t border-gray-200 py-6">
                        <h3 className="font-bold text-gray-800 mb-4">Payment & Delivery</h3>
                        <div className="flex gap-4 mb-4 grayscale opacity-70">
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
        </div>
    );
};

export default ProductDetailsPage;
