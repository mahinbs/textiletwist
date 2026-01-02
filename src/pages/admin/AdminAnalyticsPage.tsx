import { BarChart3, TrendingUp, Users, ShoppingBag, DollarSign, Calendar } from 'lucide-react';

const AdminAnalyticsPage = () => {
    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800 font-serif">Analytics</h1>
                <p className="text-gray-500 text-sm mt-1">Detailed stats and performance metrics</p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                    { label: 'Total Revenue', value: '₹12,45,000', change: '+12.5%', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
                    { label: 'Total Orders', value: '1,250', change: '+8.2%', icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Avg. Order Value', value: '₹996', change: '+2.1%', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
                    { label: 'New Customers', value: '340', change: '+15.3%', icon: Users, color: 'text-orange-600', bg: 'bg-orange-50' },
                ].map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
                                <stat.icon size={24} />
                            </div>
                            <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                {stat.change}
                            </span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</h3>
                        <p className="text-sm text-gray-500">{stat.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Sales Chart Simulation */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <BarChart3 size={20} className="text-gray-400" />
                            Sales Overview
                        </h2>
                        <select className="text-sm border-gray-200 rounded-lg p-1 bg-gray-50">
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                            <option>This Year</option>
                        </select>
                    </div>
                    {/* CSS Bar Chart Simulation */}
                    <div className="h-64 flex items-end justify-between gap-2 px-2">
                        {[40, 65, 45, 80, 55, 90, 70, 60, 75, 50, 85, 95].map((height, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                <div className="w-full bg-primary/10 rounded-t-sm relative h-full group-hover:bg-primary/20 transition-colors">
                                    <div
                                        className="absolute bottom-0 left-0 right-0 bg-primary/80 rounded-t-sm transition-all duration-500"
                                        style={{ height: `${height}%` }}
                                    ></div>
                                </div>
                                <span className="text-xs text-gray-400 font-medium">{i + 1}d</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Products */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <TrendingUp size={20} className="text-gray-400" />
                        Top Products
                    </h2>
                    <div className="space-y-4">
                        {[
                            { name: 'Classic Silk Saree', sales: 120, revenue: '₹15,00,000' },
                            { name: 'Gold Kurta', sales: 85, revenue: '₹3,82,500' },
                            { name: 'Sherwani Royal', sales: 42, revenue: '₹10,50,000' },
                            { name: 'Cotton Scarf', sales: 210, revenue: '₹2,52,000' },
                            { name: 'Banarasi Dupatta', sales: 65, revenue: '₹2,27,500' },
                        ].map((product, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="font-bold text-gray-800 text-sm">{product.name}</p>
                                    <p className="text-xs text-gray-500">{product.sales} sales</p>
                                </div>
                                <p className="font-bold text-primary text-sm">{product.revenue}</p>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-6 py-2 text-sm text-primary font-medium hover:bg-primary/5 rounded-lg transition-colors">
                        View Detailed Report
                    </button>
                </div>
            </div>

            {/* Recent Activity / Calendar Placeholder */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                    <Calendar size={20} className="text-gray-400" />
                    <h2 className="text-lg font-bold text-gray-800">Recent System Activity</h2>
                </div>
                <div className="space-y-4">
                    {[
                        { action: 'New Order #ORD-7829', user: 'System', time: '2 mins ago', type: 'order' },
                        { action: 'Product Stock Low: Silk Saree', user: 'Inventory Bot', time: '1 hour ago', type: 'alert' },
                        { action: 'New Customer Registration', user: 'System', time: '3 hours ago', type: 'user' },
                        { action: 'Settings Updated', user: 'Admin User', time: '5 hours ago', type: 'admin' },
                    ].map((activity, i) => (
                        <div key={i} className="flex items-start gap-4 pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                            <div className={`w-2 h-2 mt-2 rounded-full ${activity.type === 'alert' ? 'bg-red-500' :
                                    activity.type === 'admin' ? 'bg-purple-500' :
                                        'bg-blue-500'
                                }`}></div>
                            <div>
                                <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                                <p className="text-xs text-gray-500">{activity.user} • {activity.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminAnalyticsPage;
