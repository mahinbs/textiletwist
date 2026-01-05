import { useState, useEffect } from 'react';
import DashboardStats from '../../components/admin/DashboardStats';
import { Eye, ArrowRight, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { ordersApi } from '../../lib/api';

const AdminDashboardPage = () => {
    const navigate = useNavigate();
    const [recentOrders, setRecentOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRecentOrders();
    }, []);

    const fetchRecentOrders = async () => {
        setLoading(true);
        const response = await ordersApi.getAll();
        if (response.data) {
            const orders = response.data.orders || [];
            setRecentOrders(orders.slice(0, 5)); // Get 5 most recent
        }
        setLoading(false);
    };

    const getStatusColor = (status: string) => {
        const s = status.toLowerCase();
        switch (s) {
            case 'pending': return 'bg-orange-100 text-orange-700';
            case 'shipped': return 'bg-blue-100 text-blue-700';
            case 'delivered': return 'bg-green-100 text-green-700';
            case 'processing': case 'confirmed': return 'bg-purple-100 text-purple-700';
            default: return 'bg-gray-100 text-gray-700';
        }
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
                <h1 className="text-2xl font-bold text-gray-800 font-serif">Dashboard Overview</h1>
                <p className="text-gray-500 mt-1">Welcome back, here's what's happening clearly.</p>
            </div>

            <DashboardStats />

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-800">Recent Orders</h2>
                    <Link to="/admin/orders" className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1">
                        View All <ArrowRight size={16} />
                    </Link>
                </div>
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
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {recentOrders.length > 0 ? (
                                    recentOrders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-gray-800">{order.order_number}</td>
                                            <td className="px-6 py-4 text-gray-600">{order.customer_name}</td>
                                            <td className="px-6 py-4 text-gray-500">{formatDate(order.created_at)}</td>
                                            <td className="px-6 py-4 text-gray-800 font-medium">₹{Math.round(order.total_amount).toLocaleString()}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => navigate('/admin/orders')}
                                                    className="text-gray-400 hover:text-primary transition-colors"
                                                    title="View Order Details"
                                                >
                                                    <Eye size={20} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                            No orders yet
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboardPage;
