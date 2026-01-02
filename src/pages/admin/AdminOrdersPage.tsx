import { useState } from 'react';
import { Search, Eye, CheckCircle, Clock, Truck, Package } from 'lucide-react';
import Modal from '../../components/common/Modal';

interface Order {
    id: string;
    customer: string;
    date: string;
    total: number;
    items: number;
    status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
}

const initialOrders: Order[] = [
    { id: '#ORD-7829', customer: 'Sarah Johnson', date: 'Oct 24, 2023', total: 12450, items: 3, status: 'Pending' },
    { id: '#ORD-7828', customer: 'Michael Smith', date: 'Oct 23, 2023', total: 4500, items: 1, status: 'Processing' },
    { id: '#ORD-7827', customer: 'Emma Davis', date: 'Oct 22, 2023', total: 8900, items: 2, status: 'Shipped' },
    { id: '#ORD-7826', customer: 'James Wilson', date: 'Oct 21, 2023', total: 3200, items: 1, status: 'Delivered' },
    { id: '#ORD-7825', customer: 'Olivia Brown', date: 'Oct 20, 2023', total: 15600, items: 4, status: 'Cancelled' },
    { id: '#ORD-7824', customer: 'William Taylor', date: 'Oct 19, 2023', total: 6750, items: 2, status: 'Delivered' },
];

const AdminOrdersPage = () => {
    const [orders, setOrders] = useState<Order[]>(initialOrders);
    const [statusFilter, setStatusFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customer.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Pending': return 'bg-orange-100 text-orange-700';
            case 'Processing': return 'bg-purple-100 text-purple-700';
            case 'Shipped': return 'bg-blue-100 text-blue-700';
            case 'Delivered': return 'bg-green-100 text-green-700';
            case 'Cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Pending': return <Clock size={16} />;
            case 'Processing': return <Package size={16} />;
            case 'Shipped': return <Truck size={16} />;
            case 'Delivered': return <CheckCircle size={16} />;
            default: return <Clock size={16} />;
        }
    };

    const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
        setOrders(orders.map(order =>
            order.id === orderId ? { ...order, status: newStatus } : order
        ));
        if (selectedOrder && selectedOrder.id === orderId) {
            setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
    };

    const handleViewDetails = (order: Order) => {
        setSelectedOrder(order);
        setIsDetailsOpen(true);
    };

    return (
        <div>
            {/* Header */}
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
                    {['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${statusFilter === status
                                ? 'bg-primary text-white'
                                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
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
                                    <td className="px-6 py-4 font-medium text-gray-800">{order.id}</td>
                                    <td className="px-6 py-4 text-gray-600">{order.customer}</td>
                                    <td className="px-6 py-4 text-gray-500">{order.date}</td>
                                    <td className="px-6 py-4 font-medium text-gray-800">₹{order.total.toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                            {getStatusIcon(order.status)}
                                            {order.status}
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
                                <h4 className="text-xl font-bold text-gray-800">{selectedOrder.id}</h4>
                                <p className="text-sm text-gray-500">{selectedOrder.date}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                                {selectedOrder.status}
                            </span>
                        </div>

                        <div className="border-t border-b border-gray-100 py-4 grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Customer</p>
                                <p className="text-gray-800 font-medium">{selectedOrder.customer}</p>
                                <p className="text-sm text-gray-500">customer@example.com</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Shipping Address</p>
                                <p className="text-sm text-gray-600">
                                    123 Fashion Street,<br />
                                    Textile City, TC 560001,<br />
                                    India
                                </p>
                            </div>
                        </div>

                        <div>
                            <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Update Status</p>
                            <div className="flex flex-wrap gap-2">
                                {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => handleStatusChange(selectedOrder.id, status as Order['status'])}
                                        disabled={selectedOrder.status === status}
                                        className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${selectedOrder.status === status
                                            ? 'bg-gray-800 text-white border-gray-800 cursor-default'
                                            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <p className="text-xs text-gray-500 uppercase font-semibold mb-3">Order Items</p>
                            <div className="space-y-3">
                                {[...Array(selectedOrder.items)].map((_, i) => (
                                    <div key={i} className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg">
                                        <div className="w-12 h-12 bg-gray-200 rounded-md"></div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-800">Premium Silk Product</p>
                                            <p className="text-xs text-gray-500">Qty: 1 • ₹{(selectedOrder.total / selectedOrder.items).toLocaleString()}</p>
                                        </div>
                                        <p className="text-sm font-bold text-gray-800">₹{(selectedOrder.total / selectedOrder.items).toLocaleString()}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                                <span className="font-bold text-gray-800">Total Amount</span>
                                <span className="text-xl font-bold text-primary">₹{selectedOrder.total.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default AdminOrdersPage;
