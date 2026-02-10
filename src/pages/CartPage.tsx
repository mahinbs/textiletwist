import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { cartApi, ordersApi } from '../lib/api';
import CheckoutForm, { type CheckoutFormData } from '../components/checkout/CheckoutForm';

const CartPage = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState<string | null>(null);
    const [checkingOut, setCheckingOut] = useState(false);
    const [showCheckoutForm, setShowCheckoutForm] = useState(false);

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        setLoading(true);
        const response = await cartApi.getAll();
        if (response.data) {
            setCartItems(response.data.cart || []);
        }
        setLoading(false);
    };

    const updateQuantity = async (id: string, delta: number) => {
        const item = cartItems.find(i => i.id === id);
        if (!item) return;

        const newQuantity = Math.max(1, item.quantity + delta);
        setUpdating(id);
        const response = await cartApi.update(id, newQuantity);
        if (!response.error) {
            await fetchCart();
        }
        setUpdating(null);
    };

    const removeItem = async (id: string) => {
        setUpdating(id);
        const response = await cartApi.remove(id);
        if (!response.error) {
            await fetchCart();
        }
        setUpdating(null);
    };

    const handleCheckout = () => {
        if (cartItems.length === 0) return;
        setShowCheckoutForm(true);
    };

    const handleCheckoutSubmit = async (formData: CheckoutFormData) => {
        setCheckingOut(true);

        // Prepare order data
        const orderData: any = {
            cart_items: cartItems.map(item => ({
                product_id: item.product_id,
                quantity: item.quantity,
                size: item.size || null,
                product: item.product,
            })),
            customer_name: formData.customer_name,
            customer_email: formData.customer_email,
            customer_phone: formData.customer_phone,
            shipping_address: formData.shipping_address,
            shipping_city: formData.shipping_city,
            shipping_state: formData.shipping_state,
            shipping_postal_code: formData.shipping_postal_code,
            shipping_country: formData.shipping_country,
            payment_method: formData.payment_method,
            shipping_cost: subtotal > 5000 ? 0 : 500,
        };

        // Add Razorpay payment details if present
        if (formData.razorpay_order_id) {
            orderData.razorpay_order_id = formData.razorpay_order_id;
        }
        if (formData.razorpay_payment_id) {
            orderData.razorpay_payment_id = formData.razorpay_payment_id;
        }
        if (formData.razorpay_signature) {
            orderData.razorpay_signature = formData.razorpay_signature;
        }

        const response = await ordersApi.create(orderData);
        if (response.error) {
            alert(response.error);
            setCheckingOut(false);
        } else {
            setShowCheckoutForm(false);
            const paymentStatus = formData.payment_method === 'online' ? 'Payment successful!' : 'Order placed successfully!';
            alert(paymentStatus + ' You can track your order in your profile.');
            navigate('/profile');
        }
        setCheckingOut(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-32 pb-20 px-4 md:px-8 bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    const subtotal = cartItems.reduce((sum, item) => {
        const product = item.product;
        if (!product) return sum;
        const price = product.price * (1 - (product.discount_percentage || 0) / 100);
        return sum + (price * item.quantity);
    }, 0);

    const shipping = subtotal > 5000 ? 0 : 500;
    const tax = Math.round(subtotal * 0.18);
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
                                {cartItems.map((item) => {
                                    const product = item.product;
                                    if (!product) return null;

                                    const price = product.price * (1 - (product.discount_percentage || 0) / 100);
                                    const itemTotal = price * item.quantity;

                                    return (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, x: -100 }}
                                            layout
                                            className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 flex gap-6 items-center"
                                        >
                                            <div className="w-24 h-24 sm:w-32 sm:h-32 shrink-0 rounded-xl overflow-hidden bg-gray-100">
                                                <img
                                                    src={product.image_url || product.images?.[0] || "/images/bed-linen.png"}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="text-xl font-serif font-bold text-primary">{product.name}</h3>
                                                    <button
                                                        onClick={() => removeItem(item.id)}
                                                        disabled={updating === item.id}
                                                        className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                                                    >
                                                        {updating === item.id ? (
                                                            <Loader2 className="w-5 h-5 animate-spin" />
                                                        ) : (
                                                            <Trash2 size={20} />
                                                        )}
                                                    </button>
                                                </div>
                                                <p className="text-gray-500 text-sm mb-4">
                                                    ₹{Math.round(price).toLocaleString()} each
                                                </p>
                                                <div className="flex justify-between items-end">
                                                    <div className="flex items-center gap-3 bg-gray-50 rounded-full px-4 py-1.5 border border-gray-200">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, -1)}
                                                            disabled={updating === item.id || item.quantity <= 1}
                                                            className="text-gray-500 hover:text-primary transition-colors disabled:opacity-50"
                                                        >
                                                            <Minus size={16} />
                                                        </button>
                                                        <span className="font-semibold text-primary w-4 text-center">
                                                            {updating === item.id ? (
                                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                            ) : (
                                                                item.quantity
                                                            )}
                                                        </span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, 1)}
                                                            disabled={updating === item.id}
                                                            className="text-gray-500 hover:text-primary transition-colors disabled:opacity-50"
                                                        >
                                                            <Plus size={16} />
                                                        </button>
                                                    </div>
                                                    <p className="text-xl font-bold text-primary">₹{Math.round(itemTotal).toLocaleString()}</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
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
                                    <span className="font-semibold">₹{Math.round(subtotal).toLocaleString()}</span>
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
                                    <span>₹{Math.round(total).toLocaleString()}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                disabled={checkingOut}
                                className="w-full py-4 bg-primary text-secondary font-bold rounded-lg hover:bg-black transition-all duration-300 flex items-center justify-center gap-2 mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {checkingOut ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                                    </>
                                ) : (
                                    <>
                                        Checkout Now <ArrowRight size={20} />
                                    </>
                                )}
                            </button>
                            <p className="text-center text-xs text-gray-400">Secure Encrypted Checkout</p>
                        </motion.div>
                    </div>
                ) : null}

                {showCheckoutForm && (
                    <CheckoutForm
                        cartItems={cartItems}
                        subtotal={subtotal}
                        shipping={shipping}
                        tax={tax}
                        total={total}
                        onCheckout={handleCheckoutSubmit}
                        onCancel={() => {
                            setShowCheckoutForm(false);
                            setCheckingOut(false);
                        }}
                        isSubmitting={checkingOut}
                    />
                )}

                {!loading && cartItems.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <p className="text-xl text-gray-400 font-serif mb-8">Your cart is currently empty.</p>
                        <Link to="/products" className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-secondary transition-colors inline-block">
                            Start Shopping
                        </Link>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default CartPage;
