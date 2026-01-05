import { useState, useEffect } from 'react';
import { Search, Eye, CheckCircle, Clock, Truck, Package, Loader2 } from 'lucide-react';
import Modal from '../../components/common/Modal';
import { ordersApi } from '../../lib/api';

const AdminOrdersPage = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        const response = await ordersApi.getAll();
        if (response.data) {
            setOrders(response.data.orders || []);
        }
        setLoading(false);
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customer_email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || order.status === statusFilter.toLowerCase();
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status: string) => {
        const s = status.toLowerCase();
        switch (s) {
            case 'pending': return 'bg-orange-100 text-orange-700';
            case 'processing': return 'bg-purple-100 text-purple-700';
            case 'confirmed': return 'bg-blue-100 text-blue-700';
            case 'shipped': return 'bg-blue-100 text-blue-700';
            case 'delivered': return 'bg-green-100 text-green-700';
            case 'cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getStatusIcon = (status: string) => {
        const s = status.toLowerCase();
        switch (s) {
            case 'pending': return <Clock size={16} />;
            case 'processing': case 'confirmed': return <Package size={16} />;
            case 'shipped': return <Truck size={16} />;
            case 'delivered': return <CheckCircle size={16} />;
            default: return <Clock size={16} />;
        }
    };

    const handleStatusChange = async (orderId: string, newStatus: string) => {
        setUpdating(true);
        const response = await ordersApi.updateStatus(orderId, newStatus);
        if (response.error) {
            alert(response.error);
        } else {
            await fetchOrders();
            if (selectedOrder && selectedOrder.id === orderId) {
                setSelectedOrder({ ...selectedOrder, status: newStatus });
            }
        }
        setUpdating(false);
    };

    const handleViewDetails = (order: any) => {
        setSelectedOrder(order);
        setIsDetailsOpen(true);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800 font-serif">Orders</h1>
                <p className="text-gray-500 text-sm mt-1">Manage and track customer orders</p>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by Order ID or Customer..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0">
                    {['All', 'pending', 'processing', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${statusFilter === status
                                ? 'bg-primary text-white'
                                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center">
                        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold">
                                <tr>
                                    <th className="px-6 py-4">Order ID</th>
                                    <th className="px-6 py-4">Customer</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Total</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-800">{order.order_number}</td>
                                        <td className="px-6 py-4 text-gray-600">{order.customer_name}</td>
                                        <td className="px-6 py-4 text-gray-500">{formatDate(order.created_at)}</td>
                                        <td className="px-6 py-4 font-medium text-gray-800">₹{Math.round(order.total_amount).toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                                {getStatusIcon(order.status)}
                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleViewDetails(order)}
                                                className="text-gray-400 hover:text-primary transition-colors"
                                            >
                                                <Eye size={20} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {!loading && filteredOrders.length === 0 && (
                    <div className="p-8 text-center text-gray-500">No orders found</div>
                )}
            </div>

            {/* Order Details Modal */}
            <Modal
                isOpen={isDetailsOpen}
                onClose={() => setIsDetailsOpen(false)}
                title="Order Details"
                footer={
                    <button
                        onClick={() => setIsDetailsOpen(false)}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                    >
                        Close
                    </button>
                }
            >
                {selectedOrder && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="text-xl font-bold text-gray-800">{selectedOrder.order_number}</h4>
                                <p className="text-sm text-gray-500">{formatDate(selectedOrder.created_at)}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                                {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                            </span>
                        </div>

                        <div className="border-t border-b border-gray-100 py-4 grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Customer</p>
                                <p className="text-gray-800 font-medium">{selectedOrder.customer_name}</p>
                                <p className="text-sm text-gray-500">{selectedOrder.customer_email}</p>
                                <p className="text-sm text-gray-500">{selectedOrder.customer_phone}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Shipping Address</p>
                                <p className="text-sm text-gray-600">
                                    {selectedOrder.shipping_address}<br />
                                    {selectedOrder.shipping_city && `${selectedOrder.shipping_city}, `}
                                    {selectedOrder.shipping_state && `${selectedOrder.shipping_state} `}
                                    {selectedOrder.shipping_postal_code}<br />
                                    {selectedOrder.shipping_country}
                                </p>
                            </div>
                        </div>

                        <div>
                            <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Update Status</p>
                            <div className="flex flex-wrap gap-2">
                                {['pending', 'processing', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => handleStatusChange(selectedOrder.id, status)}
                                        disabled={updating || selectedOrder.status === status}
                                        className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${selectedOrder.status === status
                                            ? 'bg-gray-800 text-white border-gray-800 cursor-default'
                                            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 disabled:opacity-50'
                                            }`}
                                    >
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <p className="text-xs text-gray-500 uppercase font-semibold mb-3">Order Items</p>
                            <div className="space-y-3">
                                {selectedOrder.order_items?.map((item: any, i: number) => (
                                    <div key={i} className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg">
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-800">{item.product_name}</p>
                                            <p className="text-xs text-gray-500">Qty: {item.quantity} • ₹{Math.round(item.product_price).toLocaleString()} each</p>
                                        </div>
                                        <p className="text-sm font-bold text-gray-800">₹{Math.round(item.subtotal).toLocaleString()}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                                <span className="font-bold text-gray-800">Total Amount</span>
                                <span className="text-xl font-bold text-primary">₹{Math.round(selectedOrder.total_amount).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default AdminOrdersPage;
