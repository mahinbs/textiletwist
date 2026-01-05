import { useState, useEffect } from 'react';
import { Search, Mail, Phone, MapPin, Eye, Ban, Loader2 } from 'lucide-react';
import Modal from '../../components/common/Modal';
import { ordersApi } from '../../lib/api';

interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
    location: string;
    totalOrders: number;
    totalSpent: number;
    joinDate: string;
    status: 'Active' | 'Blocked';
    orders: any[];
}

const AdminCustomersPage = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal State
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
    const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        setLoading(true);
        const response = await ordersApi.getAll();
        if (response.data) {
            const orders = response.data.orders || [];
            
            // Aggregate customers from orders
            const customerMap = new Map<string, Customer>();
            
            orders.forEach((order: any) => {
                const email = order.customer_email;
                if (!customerMap.has(email)) {
                    customerMap.set(email, {
                        id: order.user_id || email,
                        name: order.customer_name,
                        email: order.customer_email,
                        phone: order.customer_phone,
                        location: `${order.shipping_city || ''}, ${order.shipping_state || ''}`.trim() || 'Not specified',
                        totalOrders: 0,
                        totalSpent: 0,
                        joinDate: new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }),
                        status: 'Active' as const,
                        orders: [],
                    });
                }
                
                const customer = customerMap.get(email)!;
                customer.totalOrders += 1;
                customer.totalSpent += parseFloat(order.total_amount || 0);
                customer.orders.push(order);
            });
            
            // Convert map to array and sort by total spent
            const customersArray = Array.from(customerMap.values())
                .sort((a, b) => b.totalSpent - a.totalSpent);
            
            setCustomers(customersArray);
        }
        setLoading(false);
    };

    const filteredCustomers = customers.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleViewHistory = (customer: Customer) => {
        setCurrentCustomer(customer);
        setIsHistoryModalOpen(true);
    };

    const handleBlockClick = (customer: Customer) => {
        setCurrentCustomer(customer);
        setIsBlockModalOpen(true);
    };

    const handleConfirmBlock = () => {
        if (currentCustomer) {
            const newStatus = currentCustomer.status === 'Active' ? 'Blocked' : 'Active';
            setCustomers(customers.map(c => c.email === currentCustomer.email ? { ...c, status: newStatus } : c));
            setIsBlockModalOpen(false);
            setCurrentCustomer(null);
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
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800 font-serif">Customers</h1>
                <p className="text-gray-500 text-sm mt-1">Manage your customer base</p>
            </div>

            {/* Search */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search customers by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                </div>
            </div>

            {/* Customers Grid */}
            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCustomers.map((customer) => (
                        <div key={customer.email} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow relative">
                            {/* Actions */}
                            <div className="absolute top-6 right-6 flex items-center gap-2">
                                <button
                                    onClick={() => handleViewHistory(customer)}
                                    className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-colors"
                                    title="View History"
                                >
                                    <Eye size={18} />
                                </button>
                                <button
                                    onClick={() => handleBlockClick(customer)}
                                    className={`p-2 rounded-full transition-colors ${customer.status === 'Active'
                                            ? 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                                            : 'text-red-600 bg-red-50 hover:bg-red-100'
                                        }`}
                                    title={customer.status === 'Active' ? "Block Customer" : "Unblock Customer"}
                                >
                                    <Ban size={18} />
                                </button>
                            </div>

                            <div className="flex items-start justify-between mb-4 pr-24">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                                        {customer.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-800">{customer.name}</h3>
                                        <span className={`inline-block px-2 py-0.5 text-xs rounded-full ${customer.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {customer.status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <Mail size={16} className="text-gray-400" />
                                    <span className="truncate max-w-[180px]" title={customer.email}>{customer.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <Phone size={16} className="text-gray-400" />
                                    <span>{customer.phone}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <MapPin size={16} className="text-gray-400" />
                                    <span className="truncate max-w-[180px]" title={customer.location}>{customer.location}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                                <div>
                                    <p className="text-xs text-gray-500">Total Orders</p>
                                    <p className="font-bold text-gray-800">{customer.totalOrders}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Total Spent</p>
                                    <p className="font-bold text-primary">₹{Math.round(customer.totalSpent).toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!loading && filteredCustomers.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    {searchTerm ? `No customers found matching "${searchTerm}"` : 'No customers found'}
                </div>
            )}

            {/* View History Modal */}
            <Modal
                isOpen={isHistoryModalOpen}
                onClose={() => setIsHistoryModalOpen(false)}
                title="Customer History"
                footer={
                    <button
                        onClick={() => setIsHistoryModalOpen(false)}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                    >
                        Close
                    </button>
                }
            >
                {currentCustomer && (
                    <div>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl">
                                {currentCustomer.name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">{currentCustomer.name}</h3>
                                <p className="text-gray-500">{currentCustomer.email}</p>
                                <p className="text-sm text-gray-400">Joined {currentCustomer.joinDate}</p>
                            </div>
                        </div>

                        <h4 className="font-bold text-gray-800 mb-3">Recent Activity</h4>
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                            {currentCustomer.orders.slice(0, 10).map((order: any) => (
                                <div key={order.id} className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
                                    <div>
                                        <p className="font-medium text-gray-800">{order.order_number}</p>
                                        <p className="text-xs text-gray-500">{formatDate(order.created_at)}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-gray-800">₹{Math.round(order.total_amount).toLocaleString()}</p>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                                            order.status === 'delivered' ? 'bg-green-100 text-green-600' :
                                            order.status === 'pending' ? 'bg-orange-100 text-orange-600' :
                                            order.status === 'shipped' ? 'bg-blue-100 text-blue-600' :
                                            'bg-gray-100 text-gray-600'
                                        }`}>
                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {currentCustomer.orders.length === 0 && (
                                <p className="text-gray-500 text-center py-4">No orders yet</p>
                            )}
                        </div>
                    </div>
                )}
            </Modal>

            {/* Block/Unblock Confirmation Modal */}
            <Modal
                isOpen={isBlockModalOpen}
                onClose={() => setIsBlockModalOpen(false)}
                title={currentCustomer?.status === 'Active' ? "Block Customer" : "Unblock Customer"}
                footer={
                    <>
                        <button
                            onClick={() => setIsBlockModalOpen(false)}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirmBlock}
                            className={`px-4 py-2 text-white rounded-lg font-medium ${currentCustomer?.status === 'Active'
                                    ? 'bg-red-600 hover:bg-red-700'
                                    : 'bg-green-600 hover:bg-green-700'
                                }`}
                        >
                            {currentCustomer?.status === 'Active' ? 'Block Customer' : 'Unblock Customer'}
                        </button>
                    </>
                }
            >
                <div className="text-center py-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${currentCustomer?.status === 'Active' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                        }`}>
                        <Ban size={24} />
                    </div>
                    <p className="text-gray-600">
                        Are you sure you want to {currentCustomer?.status === 'Active' ? 'block' : 'unblock'} <span className="font-bold text-gray-800">{currentCustomer?.name}</span>?
                        {currentCustomer?.status === 'Active' && (
                            <><br />They will no longer be able to place orders.</>
                        )}
                    </p>
                </div>
            </Modal>
        </div>
    );
};

export default AdminCustomersPage;
