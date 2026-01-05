import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, ShoppingBag, DollarSign, Calendar, Loader2 } from 'lucide-react';
import { ordersApi } from '../../lib/api';

const AdminAnalyticsPage = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        avgOrderValue: 0,
        newCustomers: 0,
    });
    const [topProducts, setTopProducts] = useState<any[]>([]);
    const [recentActivity, setRecentActivity] = useState<any[]>([]);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            // Fetch orders
            const ordersResponse = await ordersApi.getAll();
            const orders = ordersResponse.data?.orders || [];

            // Calculate stats
            const totalRevenue = orders.reduce((sum: number, order: any) => sum + parseFloat(order.total_amount || 0), 0);
            const totalOrders = orders.length;
            const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

            // Count unique customers from last 30 days
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            const recentOrders = orders.filter((order: any) => new Date(order.created_at) >= thirtyDaysAgo);
            const uniqueCustomers = new Set(recentOrders.map((order: any) => order.customer_email));
            const newCustomers = uniqueCustomers.size;

            setStats({
                totalRevenue,
                totalOrders,
                avgOrderValue,
                newCustomers,
            });

            // Calculate top products from order items
            const productSales = new Map<string, { name: string; sales: number; revenue: number }>();
            
            orders.forEach((order: any) => {
                order.order_items?.forEach((item: any) => {
                    const key = item.product_name;
                    if (!productSales.has(key)) {
                        productSales.set(key, { name: key, sales: 0, revenue: 0 });
                    }
                    const product = productSales.get(key)!;
                    product.sales += item.quantity;
                    product.revenue += parseFloat(item.subtotal || 0);
                });
            });

            const topProductsArray = Array.from(productSales.values())
                .sort((a, b) => b.revenue - a.revenue)
                .slice(0, 5);

            setTopProducts(topProductsArray);

            // Recent activity from orders
            const activity = orders
                .slice(0, 10)
                .map((order: any) => ({
                    action: `New Order ${order.order_number}`,
                    user: order.customer_name,
                    time: getTimeAgo(order.created_at),
                    type: 'order',
                }));

            setRecentActivity(activity);
        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const getTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
        
        if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} mins ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        return `${Math.floor(diffInSeconds / 86400)} days ago`;
    };

    // Generate chart data (last 12 days)
    const chartData = Array.from({ length: 12 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (11 - i));
        return {
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            value: Math.floor(Math.random() * 100), // TODO: Calculate from actual orders
        };
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800 font-serif">Analytics</h1>
                <p className="text-gray-500 text-sm mt-1">Detailed stats and performance metrics</p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                    { 
                        label: 'Total Revenue', 
                        value: `₹${Math.round(stats.totalRevenue).toLocaleString()}`, 
                        change: '+12.5%', 
                        icon: DollarSign, 
                        color: 'text-green-600', 
                        bg: 'bg-green-50' 
                    },
                    { 
                        label: 'Total Orders', 
                        value: stats.totalOrders.toString(), 
                        change: '+8.2%', 
                        icon: ShoppingBag, 
                        color: 'text-blue-600', 
                        bg: 'bg-blue-50' 
                    },
                    { 
                        label: 'Avg. Order Value', 
                        value: `₹${Math.round(stats.avgOrderValue).toLocaleString()}`, 
                        change: '+2.1%', 
                        icon: TrendingUp, 
                        color: 'text-purple-600', 
                        bg: 'bg-purple-50' 
                    },
                    { 
                        label: 'New Customers', 
                        value: stats.newCustomers.toString(), 
                        change: '+15.3%', 
                        icon: Users, 
                        color: 'text-orange-600', 
                        bg: 'bg-orange-50' 
                    },
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
                    {/* CSS Bar Chart */}
                    <div className="h-64 flex items-end justify-between gap-2 px-2">
                        {chartData.map((data, i) => {
                            const height = Math.min(100, Math.max(20, data.value));
                            return (
                                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                    <div className="w-full bg-primary/10 rounded-t-sm relative h-full group-hover:bg-primary/20 transition-colors">
                                        <div
                                            className="absolute bottom-0 left-0 right-0 bg-primary/80 rounded-t-sm transition-all duration-500"
                                            style={{ height: `${height}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-xs text-gray-400 font-medium">{data.date}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Top Products */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <TrendingUp size={20} className="text-gray-400" />
                        Top Products
                    </h2>
                    <div className="space-y-4">
                        {topProducts.length > 0 ? (
                            topProducts.map((product, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="font-bold text-gray-800 text-sm">{product.name}</p>
                                        <p className="text-xs text-gray-500">{product.sales} sales</p>
                                    </div>
                                    <p className="font-bold text-primary text-sm">₹{Math.round(product.revenue).toLocaleString()}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center py-4 text-sm">No product sales data yet</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                    <Calendar size={20} className="text-gray-400" />
                    <h2 className="text-lg font-bold text-gray-800">Recent System Activity</h2>
                </div>
                <div className="space-y-4">
                    {recentActivity.length > 0 ? (
                        recentActivity.map((activity, i) => (
                            <div key={i} className="flex items-start gap-4 pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                                <div className={`w-2 h-2 mt-2 rounded-full ${
                                    activity.type === 'alert' ? 'bg-red-500' :
                                    activity.type === 'admin' ? 'bg-purple-500' :
                                    'bg-blue-500'
                                }`}></div>
                                <div>
                                    <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                                    <p className="text-xs text-gray-500">{activity.user} • {activity.time}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center py-4">No recent activity</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminAnalyticsPage;
