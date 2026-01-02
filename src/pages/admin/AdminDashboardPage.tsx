import DashboardStats from '../../components/admin/DashboardStats';
import { Eye, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const AdminDashboardPage = () => {
    const navigate = useNavigate();
    const recentOrders = [
        { id: '#ORD-001', customer: 'Sarah Johnson', date: '2023-10-25', amount: '₹12,450', status: 'Pending' },
        { id: '#ORD-002', customer: 'Michael Smith', date: '2023-10-24', amount: '₹8,900', status: 'Shipped' },
        { id: '#ORD-003', customer: 'Emma Davis', date: '2023-10-24', amount: '₹3,200', status: 'Delivered' },
        { id: '#ORD-004', customer: 'James Wilson', date: '2023-10-23', amount: '₹15,600', status: 'Processing' },
        { id: '#ORD-005', customer: 'Olivia Brown', date: '2023-10-23', amount: '₹6,750', status: 'Delivered' },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Pending': return 'bg-orange-100 text-orange-700';
            case 'Shipped': return 'bg-blue-100 text-blue-700';
            case 'Delivered': return 'bg-green-100 text-green-700';
            case 'Processing': return 'bg-purple-100 text-purple-700';
            default: return 'bg-gray-100 text-gray-700';
        }
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
                            {recentOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-800">{order.id}</td>
                                    <td className="px-6 py-4 text-gray-600">{order.customer}</td>
                                    <td className="px-6 py-4 text-gray-500">{order.date}</td>
                                    <td className="px-6 py-4 text-gray-800 font-medium">{order.amount}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                            {order.status}
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
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;
