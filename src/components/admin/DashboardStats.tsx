import { useState, useEffect } from 'react';
import { DollarSign, ShoppingBag, Users, Clock, Loader2 } from 'lucide-react';
import { ordersApi } from '../../lib/api';

const DashboardStats = () => {
    const [stats, setStats] = useState({
        totalSales: 0,
        totalOrders: 0,
        newCustomers: 0,
        pendingOrders: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        setLoading(true);
        try {
            // Fetch orders
            const ordersResponse = await ordersApi.getAll();
            const orders = ordersResponse.data?.orders || [];

            // Calculate stats
            const totalSales = orders.reduce((sum: number, order: any) => sum + parseFloat(order.total_amount || 0), 0);
            const totalOrders = orders.length;
            
            // Count unique customers (by email) from last 30 days
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            const recentOrders = orders.filter((order: any) => new Date(order.created_at) >= thirtyDaysAgo);
            const uniqueCustomers = new Set(recentOrders.map((order: any) => order.customer_email));
            const newCustomers = uniqueCustomers.size;

            // Count pending orders
            const pendingOrders = orders.filter((order: any) => 
                ['pending', 'processing', 'confirmed'].includes(order.status?.toLowerCase())
            ).length;

            setStats({
                totalSales,
                totalOrders,
                newCustomers,
                pendingOrders,
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const statsData = [
        {
            label: 'Total Sales',
            value: `₹${Math.round(stats.totalSales).toLocaleString()}`,
            icon: DollarSign,
            change: '+12.5%', // TODO: Calculate from previous period
            positive: true,
            bg: 'bg-green-100',
            color: 'text-green-600',
        },
        {
            label: 'Total Orders',
            value: stats.totalOrders.toString(),
            icon: ShoppingBag,
            change: '+8.2%', // TODO: Calculate from previous period
            positive: true,
            bg: 'bg-blue-100',
            color: 'text-blue-600',
        },
        {
            label: 'New Customers',
            value: stats.newCustomers.toString(),
            icon: Users,
            change: '-2.1%', // TODO: Calculate from previous period
            positive: false,
            bg: 'bg-purple-100',
            color: 'text-purple-600',
        },
        {
            label: 'Pending Orders',
            value: stats.pendingOrders.toString(),
            icon: Clock,
            change: stats.pendingOrders > 10 ? 'Critical' : 'Normal',
            positive: stats.pendingOrders <= 10,
            bg: 'bg-orange-100',
            color: 'text-orange-600',
        },
    ];

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-center h-32">
                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsData.map((stat, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
                            <stat.icon size={24} />
                        </div>
                        <span className={`text-sm font-medium ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
                            {stat.change}
                        </span>
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
                        <h3 className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</h3>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DashboardStats;
