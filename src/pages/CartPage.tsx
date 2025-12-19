import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';

const CartPage = () => {
    // Initial Mock Data with reliable images
    const [cartItems, setCartItems] = useState([
        {
            id: 1,
            name: "Royal Velvet Cushion",
            variant: "Deep Emerald",
            price: 1299,
            quantity: 2,
            image: "/images/cushion.png"
        },
        {
            id: 2,
            name: "Egyptian Cotton Sheets",
            variant: "Ivory / Queen",
            price: 4599,
            quantity: 1,
            image: "/images/bed-linen.png"
        }
    ]);

    const updateQuantity = (id: number, delta: number) => {
        setCartItems(prev => prev.map(item => {
            if (item.id === id) {
                const newQuantity = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQuantity };
            }
            return item;
        }));
    };

    const removeItem = (id: number) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 5000 ? 0 : 500; // Free shipping over 5000
    const tax = Math.round(subtotal * 0.18); // 18% GST
    const total = subtotal + shipping + tax;

    return (
        <div className="min-h-screen pt-32 pb-20 px-4 md:px-8 bg-gray-50">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">Your Shopping Cart</h1>
                    <p className="text-gray-500">Review your premium selections below</p>
                </div>

                {cartItems.length > 0 ? (
                    <div className="flex flex-col lg:flex-row gap-12">
                        {/* Cart Items */}
                        <div className="flex-1 space-y-6">
                            <AnimatePresence>
                                {cartItems.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -100 }}
                                        layout
                                        className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 flex gap-6 items-center"
                                    >
                                        <div className="w-24 h-24 sm:w-32 sm:h-32 shrink-0 rounded-xl overflow-hidden bg-gray-100">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-xl font-serif font-bold text-primary">{item.name}</h3>
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                            <p className="text-gray-500 text-sm mb-4">{item.variant}</p>
                                            <div className="flex justify-between items-end">
                                                <div className="flex items-center gap-3 bg-gray-50 rounded-full px-4 py-1.5 border border-gray-200">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, -1)}
                                                        className="text-gray-500 hover:text-primary transition-colors disabled:opacity-50"
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <Minus size={16} />
                                                    </button>
                                                    <span className="font-semibold text-primary w-4 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, 1)}
                                                        className="text-gray-500 hover:text-primary transition-colors"
                                                    >
                                                        <Plus size={16} />
                                                    </button>
                                                </div>
                                                <p className="text-xl font-bold text-primary">₹{(item.price * item.quantity).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* Order Summary */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="lg:w-96 bg-white p-8 rounded-2xl shadow-lg border border-gray-100 h-fit sticky top-28"
                        >
                            <h3 className="text-2xl font-serif font-bold text-primary mb-6">Order Summary</h3>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span className="font-semibold">₹{subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span className={`font-semibold ${shipping === 0 ? 'text-green-600' : ''}`}>
                                        {shipping === 0 ? 'Free' : `₹${shipping}`}
                                    </span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>GST (18%)</span>
                                    <span className="font-semibold">₹{tax.toLocaleString()}</span>
                                </div>
                                <div className="h-px bg-gray-100 my-4" />
                                <div className="flex justify-between text-xl font-bold text-primary">
                                    <span>Total</span>
                                    <span>₹{total.toLocaleString()}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => alert("Proceeding to checkout...")}
                                className="w-full py-4 bg-primary text-secondary font-bold rounded-lg hover:bg-black transition-all duration-300 flex items-center justify-center gap-2 mb-4"
                            >
                                Checkout Now <ArrowRight size={20} />
                            </button>
                            <p className="text-center text-xs text-gray-400">Secure Encrypted Checkout</p>
                        </motion.div>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <p className="text-xl text-gray-400 font-serif mb-8">Your cart is currently empty.</p>
                        <a href="/products" className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-secondary transition-colors inline-block">
                            Start Shopping
                        </a>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default CartPage;
