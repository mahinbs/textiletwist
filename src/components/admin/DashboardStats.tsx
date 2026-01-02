import { DollarSign, ShoppingBag, Users, Clock } from 'lucide-react';

const DashboardStats = () => {
    const stats = [
        {
            label: 'Total Sales',
            value: '₹1,25,950',
            icon: DollarSign,
            change: '+12.5%',
            positive: true,
            bg: 'bg-green-100',
            color: 'text-green-600',
        },
        {
            label: 'Total Orders',
            value: '156',
            icon: ShoppingBag,
            change: '+8.2%',
            positive: true,
            bg: 'bg-blue-100',
            color: 'text-blue-600',
        },
        {
            label: 'New Customers',
            value: '48',
            icon: Users,
            change: '-2.1%',
            positive: false,
            bg: 'bg-purple-100',
            color: 'text-purple-600',
        },
        {
            label: 'Pending Orders',
            value: '12',
            icon: Clock,
            change: 'Critical',
            positive: false,
            bg: 'bg-orange-100',
            color: 'text-orange-600',
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
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
