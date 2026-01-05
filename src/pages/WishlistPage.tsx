import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { wishlistApi, cartApi } from '../lib/api';

const WishlistPage = () => {
    const [wishlistItems, setWishlistItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [removing, setRemoving] = useState<string | null>(null);
    const [addingToCart, setAddingToCart] = useState<string | null>(null);

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        setLoading(true);
        const response = await wishlistApi.getAll();
        if (response.data) {
            setWishlistItems(response.data.wishlist || []);
        }
        setLoading(false);
    };

    const removeFromWishlist = async (productId: string) => {
        setRemoving(productId);
        const response = await wishlistApi.remove(productId);
        if (!response.error) {
            await fetchWishlist();
        }
        setRemoving(null);
    };

    const handleAddToCart = async (productId: string) => {
        setAddingToCart(productId);
        const response = await cartApi.add(productId, 1);
        if (response.error) {
            alert(response.error);
        } else {
            alert('Added to cart!');
        }
        setAddingToCart(null);
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-32 pb-20 px-4 md:px-8 bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-20 px-4 md:px-8 bg-gray-50">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">Your Wishlist</h1>
                    <p className="text-gray-500">Saved for your future sanctuary</p>
                </div>

                {wishlistItems.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <AnimatePresence>
                            {wishlistItems.map((item, index) => {
                                const product = item.product;
                                if (!product) return null;

                                const price = product.price * (1 - (product.discount_percentage || 0) / 100);
                                const hasDiscount = product.discount_percentage > 0;

                                return (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ delay: index * 0.1 }}
                                        layout
                                        className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
                                    >
                                        <div className="relative h-64 overflow-hidden">
                                            <img
                                                src={product.image_url || product.images?.[0] || "/images/bed-linen.png"}
                                                alt={product.name}
                                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                            />
                                            <button
                                                onClick={() => removeFromWishlist(product.id)}
                                                disabled={removing === product.id}
                                                className="absolute top-4 right-4 p-2 bg-white/10 backdrop-blur-md text-white rounded-full hover:bg-white hover:text-red-500 transition-colors disabled:opacity-50"
                                            >
                                                {removing === product.id ? (
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                ) : (
                                                    <X size={20} />
                                                )}
                                            </button>
                                            {hasDiscount && (
                                                <div className="absolute top-4 left-4 bg-secondary text-primary px-2 py-1 rounded text-xs font-bold">
                                                    {product.discount_percentage}% OFF
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-6">
                                            <Link to={`/products/${product.id}`}>
                                                <h3 className="text-xl font-serif font-bold text-primary mb-2 hover:underline">
                                                    {product.name}
                                                </h3>
                                            </Link>
                                            <div className="mb-6">
                                                {hasDiscount ? (
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-lg text-gray-900 font-medium">
                                                            ₹{Math.round(price).toLocaleString()}
                                                        </p>
                                                        <p className="text-sm text-gray-400 line-through">
                                                            ₹{product.price.toLocaleString()}
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <p className="text-lg text-gray-900 font-medium">
                                                        ₹{product.price.toLocaleString()}
                                                    </p>
                                                )}
                                            </div>

                                            <button
                                                onClick={() => handleAddToCart(product.id)}
                                                disabled={addingToCart === product.id || product.quantity === 0}
                                                className="w-full py-3 border border-secondary text-secondary font-bold rounded-lg hover:bg-secondary hover:text-primary transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {addingToCart === product.id ? (
                                                    <>
                                                        <Loader2 className="w-5 h-5 animate-spin" /> Adding...
                                                    </>
                                                ) : (
                                                    <>
                                                        <ShoppingBag size={20} /> Add to Cart
                                                    </>
                                                )}
                                            </button>
                                            {product.quantity === 0 && (
                                                <p className="text-xs text-red-500 text-center mt-2">Out of Stock</p>
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <p className="text-xl text-gray-400 font-serif mb-8">Your wishlist is currently empty.</p>
                        <Link to="/products" className="px-8 py-3 bg-primary text-secondary font-bold rounded-lg hover:bg-black transition-colors inline-block">
                            Browse Collection
                        </Link>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default WishlistPage;
