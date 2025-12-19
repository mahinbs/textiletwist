import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X } from 'lucide-react';

const WishlistPage = () => {
    // Mock Data with reliable local images
    const [wishlistItems, setWishlistItems] = useState([
        {
            id: 1,
            name: "Silk Embroidery Set",
            price: 8999,
            image: "/images/bed-linen.png"
        },
        {
            id: 2,
            name: "Linen Table Runner",
            price: 1599,
            image: "/images/table-linen.png"
        },
        {
            id: 3,
            name: "Artisan Bath Towels",
            price: 2499,
            image: "/images/fabric-macro.png"
        }
    ]);

    const removeFromWishlist = (id: number) => {
        setWishlistItems(prev => prev.filter(item => item.id !== id));
    };

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
                            {wishlistItems.map((item, index) => (
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
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <button
                                            onClick={() => removeFromWishlist(item.id)}
                                            className="absolute top-4 right-4 p-2 bg-white/10 backdrop-blur-md text-white rounded-full hover:bg-white hover:text-red-500 transition-colors"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-serif font-bold text-primary mb-2">{item.name}</h3>
                                        <p className="text-lg text-gray-500 font-medium mb-6">₹{item.price.toLocaleString()}</p>

                                        <button className="w-full py-3 border border-secondary text-secondary font-bold rounded-lg hover:bg-secondary hover:text-primary transition-all duration-300 flex items-center justify-center gap-2">
                                            <ShoppingBag size={20} /> Add to Cart
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <p className="text-xl text-gray-400 font-serif mb-8">Your wishlist is currently empty.</p>
                        <a href="/products" className="px-8 py-3 bg-primary text-secondary font-bold rounded-lg hover:bg-black transition-colors inline-block">
                            Browse Collection
                        </a>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default WishlistPage;
