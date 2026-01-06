import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, MapPin, User, CreditCard, Truck } from 'lucide-react';

interface CheckoutFormProps {
    cartItems: any[];
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
    onCheckout: (formData: CheckoutFormData) => Promise<void>;
    onCancel: () => void;
    isSubmitting: boolean;
}

export interface CheckoutFormData {
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    shipping_address: string;
    shipping_city: string;
    shipping_state: string;
    shipping_postal_code: string;
    shipping_country: string;
    payment_method: string;
}

const CheckoutForm = ({ cartItems, subtotal, shipping, tax, total, onCheckout, onCancel, isSubmitting }: CheckoutFormProps) => {
    const [formData, setFormData] = useState<CheckoutFormData>({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        shipping_address: '',
        shipping_city: '',
        shipping_state: '',
        shipping_postal_code: '',
        shipping_country: 'India',
        payment_method: 'cod',
    });

    const [errors, setErrors] = useState<Partial<Record<keyof CheckoutFormData, string>>>({});

    const validate = (): boolean => {
        const newErrors: Partial<Record<keyof CheckoutFormData, string>> = {};

        if (!formData.customer_name.trim()) {
            newErrors.customer_name = 'Name is required';
        }

        if (!formData.customer_email.trim()) {
            newErrors.customer_email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customer_email)) {
            newErrors.customer_email = 'Invalid email format';
        }

        if (!formData.customer_phone.trim()) {
            newErrors.customer_phone = 'Phone is required';
        } else if (!/^[0-9]{10}$/.test(formData.customer_phone.replace(/[\s-]/g, ''))) {
            newErrors.customer_phone = 'Invalid phone number (10 digits required)';
        }

        if (!formData.shipping_address.trim()) {
            newErrors.shipping_address = 'Shipping address is required';
        }

        if (!formData.shipping_city.trim()) {
            newErrors.shipping_city = 'City is required';
        }

        if (!formData.shipping_state.trim()) {
            newErrors.shipping_state = 'State is required';
        }

        if (!formData.shipping_postal_code.trim()) {
            newErrors.shipping_postal_code = 'Postal code is required';
        } else if (!/^[0-9]{6}$/.test(formData.shipping_postal_code)) {
            newErrors.shipping_postal_code = 'Invalid postal code (6 digits required)';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            await onCheckout(formData);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={onCancel}
        >
            <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
                <div className="p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-serif font-bold text-primary">Checkout</h2>
                        <button
                            onClick={onCancel}
                            disabled={isSubmitting}
                            className="text-gray-400 hover:text-gray-600 text-2xl font-bold disabled:opacity-50"
                        >
                            ×
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Contact Information */}
                        <div>
                            <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                                <User className="w-5 h-5" />
                                Contact Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.customer_name}
                                        onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                                            errors.customer_name ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="John Doe"
                                    />
                                    {errors.customer_name && (
                                        <p className="text-red-500 text-sm mt-1">{errors.customer_name}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.customer_email}
                                        onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                                            errors.customer_email ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="john@example.com"
                                    />
                                    {errors.customer_email && (
                                        <p className="text-red-500 text-sm mt-1">{errors.customer_email}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Phone Number *
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.customer_phone}
                                        onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                                            errors.customer_phone ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="9876543210"
                                    />
                                    {errors.customer_phone && (
                                        <p className="text-red-500 text-sm mt-1">{errors.customer_phone}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div>
                            <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                                <MapPin className="w-5 h-5" />
                                Shipping Address
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Address *
                                    </label>
                                    <textarea
                                        value={formData.shipping_address}
                                        onChange={(e) => setFormData({ ...formData, shipping_address: e.target.value })}
                                        rows={3}
                                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                                            errors.shipping_address ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="Street address, apartment, suite, etc."
                                    />
                                    {errors.shipping_address && (
                                        <p className="text-red-500 text-sm mt-1">{errors.shipping_address}</p>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            City *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.shipping_city}
                                            onChange={(e) => setFormData({ ...formData, shipping_city: e.target.value })}
                                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                                                errors.shipping_city ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="Mumbai"
                                        />
                                        {errors.shipping_city && (
                                            <p className="text-red-500 text-sm mt-1">{errors.shipping_city}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            State *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.shipping_state}
                                            onChange={(e) => setFormData({ ...formData, shipping_state: e.target.value })}
                                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                                                errors.shipping_state ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="Maharashtra"
                                        />
                                        {errors.shipping_state && (
                                            <p className="text-red-500 text-sm mt-1">{errors.shipping_state}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Postal Code *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.shipping_postal_code}
                                            onChange={(e) => setFormData({ ...formData, shipping_postal_code: e.target.value })}
                                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                                                errors.shipping_postal_code ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="400001"
                                        />
                                        {errors.shipping_postal_code && (
                                            <p className="text-red-500 text-sm mt-1">{errors.shipping_postal_code}</p>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Country
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.shipping_country}
                                        onChange={(e) => setFormData({ ...formData, shipping_country: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        placeholder="India"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div>
                            <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                                <CreditCard className="w-5 h-5" />
                                Payment Method
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <label className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                    formData.payment_method === 'cod' ? 'border-primary bg-primary/5' : 'border-gray-300'
                                }`}>
                                    <input
                                        type="radio"
                                        name="payment_method"
                                        value="cod"
                                        checked={formData.payment_method === 'cod'}
                                        onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                                        className="sr-only"
                                    />
                                    <div className="font-semibold text-primary mb-1">Cash on Delivery</div>
                                    <div className="text-sm text-gray-600">Pay when you receive</div>
                                </label>
                                <label className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                    formData.payment_method === 'online' ? 'border-primary bg-primary/5' : 'border-gray-300'
                                }`}>
                                    <input
                                        type="radio"
                                        name="payment_method"
                                        value="online"
                                        checked={formData.payment_method === 'online'}
                                        onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                                        className="sr-only"
                                    />
                                    <div className="font-semibold text-primary mb-1">Online Payment</div>
                                    <div className="text-sm text-gray-600">Card, UPI, Net Banking</div>
                                </label>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                            <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                                <Truck className="w-5 h-5" />
                                Order Summary
                            </h3>
                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal ({cartItems.length} items)</span>
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
                                <div className="h-px bg-gray-300 my-3" />
                                <div className="flex justify-between text-2xl font-bold text-primary">
                                    <span>Total</span>
                                    <span>₹{Math.round(total).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={onCancel}
                                disabled={isSubmitting}
                                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 px-6 py-3 bg-primary text-secondary font-bold rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Placing Order...
                                    </>
                                ) : (
                                    <>
                                        Place Order
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default CheckoutForm;

