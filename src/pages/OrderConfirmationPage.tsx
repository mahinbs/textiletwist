import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Package, Truck, Clock, MapPin, Mail, Phone, CreditCard } from 'lucide-react';
import { ordersApi } from '../lib/api';

const OrderConfirmationPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const orderId = searchParams.get('order_id');
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!orderId) {
            navigate('/');
            return;
        }

        const fetchOrder = async () => {
            setLoading(true);
            const response = await ordersApi.getById(orderId);
            if (response.data) {
                setOrder(response.data.order);
            } else {
                // If can't fetch order, still show success message
                setOrder({ order_number: 'Processing...' });
            }
            setLoading(false);
        };

        fetchOrder();
    }, [orderId, navigate]);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending':
                return <Clock className="w-8 h-8 text-yellow-500" />;
            case 'processing':
                return <Package className="w-8 h-8 text-blue-500" />;
            case 'confirmed':
                return <CheckCircle className="w-8 h-8 text-green-500" />;
            case 'shipped':
                return <Truck className="w-8 h-8 text-blue-600" />;
            case 'delivered':
                return <CheckCircle className="w-8 h-8 text-green-600" />;
            default:
                return <Package className="w-8 h-8 text-gray-500" />;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'pending':
                return 'Order Received';
            case 'processing':
                return 'Processing';
            case 'confirmed':
                return 'Confirmed';
            case 'shipped':
                return 'Shipped';
            case 'delivered':
                return 'Delivered';
            case 'cancelled':
                return 'Cancelled';
            default:
                return status;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-32 pb-20 px-4 md:px-8 bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-20 px-4 md:px-8 bg-gray-50">
            <div className="max-w-4xl mx-auto">
                {/* Success Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-lg p-8 mb-8 text-center"
                >
                    <div className="flex justify-center mb-4">
                        <CheckCircle className="w-20 h-20 text-green-500" />
                    </div>
                    <h1 className="text-4xl font-serif font-bold text-primary mb-2">Order Placed Successfully!</h1>
                    <p className="text-gray-600 mb-6">Thank you for your order. We've received it and will process it soon.</p>
                    
                    {order && (
                        <div className="bg-primary/5 rounded-xl p-6 border-2 border-primary/20">
                            <p className="text-sm text-gray-600 mb-2">Your Order Number</p>
                            <h2 className="text-3xl font-bold text-primary mb-4">{order.order_number}</h2>
                            <p className="text-sm text-gray-600">Please save this number for tracking your order</p>
                        </div>
                    )}
                </motion.div>

                {order && (
                    <>
                        {/* Order Status */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-2xl shadow-lg p-8 mb-8"
                        >
                            <h3 className="text-2xl font-bold text-primary mb-6">Order Status</h3>
                            <div className="flex items-center gap-4 bg-gray-50 p-6 rounded-xl">
                                {getStatusIcon(order.status)}
                                <div>
                                    <p className="text-sm text-gray-600">Current Status</p>
                                    <p className="text-xl font-bold text-primary">{getStatusText(order.status)}</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Order Details */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-2xl shadow-lg p-8 mb-8"
                        >
                            <h3 className="text-2xl font-bold text-primary mb-6">Order Summary</h3>
                            
                            <div className="space-y-4">
                                {/* Items */}
                                {order.order_items && order.order_items.length > 0 && (
                                    <div>
                                        <p className="text-sm text-gray-600 mb-2">Items Ordered</p>
                                        <div className="space-y-2">
                                            {order.order_items.map((item: any, index: number) => (
                                                <div key={index} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                                                    <div>
                                                        <p className="font-semibold text-primary">{item.product_name}</p>
                                                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                                    </div>
                                                    <p className="font-bold text-primary">₹{Math.round(item.subtotal).toLocaleString()}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Pricing */}
                                <div className="border-t pt-4">
                                    <div className="flex justify-between mb-2">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="font-semibold">₹{Math.round(order.subtotal).toLocaleString()}</span>
                                    </div>
                                    {order.discount_amount > 0 && (
                                        <div className="flex justify-between mb-2 text-green-600">
                                            <span>Discount</span>
                                            <span className="font-semibold">-₹{Math.round(order.discount_amount).toLocaleString()}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between mb-2">
                                        <span className="text-gray-600">Shipping</span>
                                        <span className="font-semibold">
                                            {order.shipping_cost === 0 ? 'Free' : `₹${order.shipping_cost}`}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-xl font-bold text-primary border-t pt-2 mt-2">
                                        <span>Total</span>
                                        <span>₹{Math.round(order.total_amount).toLocaleString()}</span>
                                    </div>
                                </div>

                                {/* Payment Method */}
                                <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
                                    <CreditCard className="w-5 h-5 text-primary" />
                                    <div>
                                        <p className="text-sm text-gray-600">Payment Method</p>
                                        <p className="font-semibold text-primary">
                                            {order.payment_method === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Status: <span className={order.payment_status === 'paid' ? 'text-green-600' : 'text-yellow-600'}>
                                                {order.payment_status === 'paid' ? 'Paid' : 'Pending'}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Shipping Details */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-2xl shadow-lg p-8 mb-8"
                        >
                            <h3 className="text-2xl font-bold text-primary mb-6">Delivery Information</h3>
                            
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <MapPin className="w-5 h-5 text-primary mt-1" />
                                    <div>
                                        <p className="text-sm text-gray-600">Shipping Address</p>
                                        <p className="font-semibold text-primary">{order.customer_name}</p>
                                        <p className="text-gray-700">{order.shipping_address}</p>
                                        <p className="text-gray-700">
                                            {order.shipping_city}, {order.shipping_state} {order.shipping_postal_code}
                                        </p>
                                        <p className="text-gray-700">{order.shipping_country}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Mail className="w-5 h-5 text-primary" />
                                    <div>
                                        <p className="text-sm text-gray-600">Email</p>
                                        <p className="font-semibold text-primary">{order.customer_email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Phone className="w-5 h-5 text-primary" />
                                    <div>
                                        <p className="text-sm text-gray-600">Phone</p>
                                        <p className="font-semibold text-primary">{order.customer_phone}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                    <button
                        onClick={() => navigate('/track-order')}
                        className="px-8 py-4 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-all"
                    >
                        Track Your Order
                    </button>
                    <button
                        onClick={() => navigate('/products')}
                        className="px-8 py-4 bg-white text-primary border-2 border-primary font-bold rounded-lg hover:bg-primary/5 transition-all"
                    >
                        Continue Shopping
                    </button>
                </motion.div>

                {/* Email Confirmation Note */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center mt-8 text-gray-600"
                >
                    <p>📧 A confirmation email has been sent to <strong>{order?.customer_email}</strong></p>
                    <p className="text-sm mt-2">If you have any questions, please contact us at support@textiletwist.com</p>
                </motion.div>
            </div>
        </div>
    );
};

export default OrderConfirmationPage;
