import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Package, Truck, CheckCircle, Clock, XCircle, Loader2 } from 'lucide-react';
import { ordersApi } from '../lib/api';

const TrackOrderPage = () => {
    const [orderNumber, setOrderNumber] = useState('');
    const [email, setEmail] = useState('');
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setOrder(null);

        if (!orderNumber.trim()) {
            setError('Please enter order number');
            return;
        }

        setLoading(true);

        // Track order by order number (public API - no auth required)
        const response = await ordersApi.trackByNumber(orderNumber.trim(), email.trim() || undefined);
        
        if (response.data && response.data.order) {
            setOrder(response.data.order);
        } else {
            setError(response.error || 'Order not found. Please check your order number and email.');
        }

        setLoading(false);
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending':
                return <Clock className="w-12 h-12 text-yellow-500" />;
            case 'processing':
                return <Package className="w-12 h-12 text-blue-500" />;
            case 'confirmed':
                return <CheckCircle className="w-12 h-12 text-green-500" />;
            case 'shipped':
                return <Truck className="w-12 h-12 text-blue-600" />;
            case 'delivered':
                return <CheckCircle className="w-12 h-12 text-green-600" />;
            case 'cancelled':
                return <XCircle className="w-12 h-12 text-red-500" />;
            default:
                return <Package className="w-12 h-12 text-gray-500" />;
        }
    };

    const getStatusSteps = (currentStatus: string) => {
        const steps = [
            { key: 'pending', label: 'Order Received' },
            { key: 'processing', label: 'Processing' },
            { key: 'confirmed', label: 'Confirmed' },
            { key: 'shipped', label: 'Shipped' },
            { key: 'delivered', label: 'Delivered' },
        ];

        const statusOrder = ['pending', 'processing', 'confirmed', 'shipped', 'delivered'];
        const currentIndex = statusOrder.indexOf(currentStatus);

        return steps.map((step, index) => ({
            ...step,
            completed: index <= currentIndex,
            active: index === currentIndex,
        }));
    };

    return (
        <div className="min-h-screen pt-32 pb-20 px-4 md:px-8 bg-gray-50">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">Track Your Order</h1>
                    <p className="text-gray-600">Enter your order number to track your delivery status</p>
                </div>

                {/* Track Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-lg p-8 mb-8"
                >
                    <form onSubmit={handleTrack} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Order Number *
                            </label>
                            <input
                                type="text"
                                value={orderNumber}
                                onChange={(e) => setOrderNumber(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                placeholder="ORD-XXXXX-XXXX"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email (Optional)
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                placeholder="your@email.com"
                            />
                            <p className="text-sm text-gray-500 mt-1">For additional verification</p>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full px-6 py-4 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Tracking...
                                </>
                            ) : (
                                <>
                                    <Search className="w-5 h-5" />
                                    Track Order
                                </>
                            )}
                        </button>
                    </form>
                </motion.div>

                {/* Order Status Display */}
                {order && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        {/* Status Card */}
                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            <div className="flex items-center gap-4 mb-6">
                                {getStatusIcon(order.status)}
                                <div>
                                    <p className="text-sm text-gray-600">Order #{order.order_number}</p>
                                    <h3 className="text-2xl font-bold text-primary capitalize">{order.status}</h3>
                                </div>
                            </div>

                            {/* Status Timeline */}
                            <div className="relative">
                                {getStatusSteps(order.status).map((step, index) => (
                                    <div key={step.key} className="flex items-center mb-4 last:mb-0">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                            step.completed ? 'bg-green-500' : 'bg-gray-300'
                                        }`}>
                                            {step.completed && <CheckCircle className="w-5 h-5 text-white" />}
                                        </div>
                                        <div className="ml-4">
                                            <p className={`font-semibold ${step.completed ? 'text-primary' : 'text-gray-500'}`}>
                                                {step.label}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Order Details */}
                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            <h3 className="text-2xl font-bold text-primary mb-6">Order Details</h3>
                            
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Order Date</span>
                                    <span className="font-semibold">{new Date(order.created_at).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Total Amount</span>
                                    <span className="font-bold text-primary">₹{Math.round(order.total_amount).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Payment Method</span>
                                    <span className="font-semibold">{order.payment_method === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Payment Status</span>
                                    <span className={`font-semibold ${order.payment_status === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                                        {order.payment_status === 'paid' ? 'Paid' : 'Pending'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Delivery Address */}
                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            <h3 className="text-2xl font-bold text-primary mb-6">Delivery Address</h3>
                            <p className="font-semibold text-primary">{order.customer_name}</p>
                            <p className="text-gray-700">{order.shipping_address}</p>
                            <p className="text-gray-700">
                                {order.shipping_city}, {order.shipping_state} {order.shipping_postal_code}
                            </p>
                            <p className="text-gray-700">{order.shipping_country}</p>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default TrackOrderPage;
