import { useState, useEffect } from 'react';
import { Package, User, CreditCard, MapPin, Lock, LogOut, ChevronRight, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { authApi, ordersApi } from '../lib/api';

const ProfilePage = () => {
    const [activeTab, setActiveTab] = useState('orders');
    const [user, setUser] = useState<any>(null);
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserData();
        fetchOrders();
    }, []);

    const fetchUserData = async () => {
        const response = await authApi.getCurrentUser();
        if (response.data) {
            setUser(response.data.user);
        }
        setLoading(false);
    };

    const fetchOrders = async () => {
        const response = await ordersApi.getAll();
        if (response.data) {
            setOrders(response.data.orders || []);
        }
    };

    const handleSignOut = async () => {
        try {
            // Call logout API to clear cookies
            await authApi.logout();
            
            // Clear any local storage
            localStorage.clear();
            sessionStorage.clear();
            
            // Force a full page reload to clear all state
            window.location.href = '/auth';
        } catch (error) {
            console.error('Logout error:', error);
            // Even if API fails, clear local storage and redirect
            localStorage.clear();
            sessionStorage.clear();
            window.location.href = '/auth';
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'orders':
                return <MyOrders orders={orders} loading={loading} />;
            case 'personal-info':
                return <PersonalInfo user={user} onUpdate={fetchUserData} />;
            case 'billing':
                return <BillingAddress user={user} />;
            case 'delivery':
                return <DeliveryAddress user={user} />;
            case 'password':
                return <ChangePassword />;
            default:
                return <MyOrders orders={orders} loading={loading} />;
        }
    };

    if (loading) {
        return (
            <div className="pt-28 pb-20 container mx-auto px-6 flex justify-center items-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    const userName = user?.full_name || user?.email?.split('@')[0] || 'User';
    const userInitials = userName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

    return (
        <div className="pt-28 pb-20 container mx-auto px-6 h-screen overflow-hidden flex flex-col">
            <h1 className="text-4xl font-serif font-bold text-primary mb-8 px-4 md:px-0">My Account</h1>

            <div className="flex flex-col md:flex-row gap-8 h-full">
                {/* Sidebar Navigation */}
                <div className="w-full md:w-1/4 bg-white rounded-xl shadow-sm border border-gray-100 p-4 h-fit">
                    <div className="flex items-center gap-4 mb-8 p-2">
                        <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center text-secondary font-bold text-xl">
                            {userInitials}
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-800">{userName}</h3>
                            <p className="text-xs text-gray-500">{user?.email || 'No email'}</p>
                        </div>
                    </div>

                    <nav className="space-y-1">
                        <NavButton icon={Package} label="My Orders" active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} />
                        <NavButton icon={User} label="Personal Information" active={activeTab === 'personal-info'} onClick={() => setActiveTab('personal-info')} />
                        <NavButton icon={CreditCard} label="Billing Address" active={activeTab === 'billing'} onClick={() => setActiveTab('billing')} />
                        <NavButton icon={MapPin} label="Delivery Address" active={activeTab === 'delivery'} onClick={() => setActiveTab('delivery')} />
                        <NavButton icon={Lock} label="Change Password" active={activeTab === 'password'} onClick={() => setActiveTab('password')} />
                        <div className="pt-4 mt-4 border-t border-gray-100">
                            <button
                                onClick={handleSignOut}
                                className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
                            >
                                <LogOut className="w-4 h-4" />
                                Sign Out
                            </button>
                        </div>
                    </nav>
                </div>

                {/* Main Content Area */}
                <div className="w-full md:w-3/4 bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 overflow-y-auto custom-scrollbar">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

const NavButton = ({ icon: Icon, label, active, onClick }: any) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors text-sm font-medium ${active ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50'
            }`}
    >
        <div className="flex items-center gap-3">
            <Icon className={`w-4 h-4 ${active ? 'text-secondary' : 'text-gray-400'}`} />
            {label}
        </div>
        {active && <ChevronRight className="w-4 h-4 text-secondary" />}
    </button>
);

// Sub-components for sections
const MyOrders = ({ orders, loading }: { orders: any[]; loading: boolean }) => {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const getStatusColor = (status: string) => {
        const s = status.toLowerCase();
        if (s === 'delivered') return 'bg-green-100 text-green-800';
        if (s === 'pending') return 'bg-orange-100 text-orange-800';
        if (s === 'shipped') return 'bg-blue-100 text-blue-800';
        return 'bg-gray-100 text-gray-800';
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">My Orders</h2>
            {orders.length > 0 ? (
                orders.map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex flex-wrap justify-between items-start gap-4 mb-4 pb-4 border-b border-gray-100">
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Order ID</p>
                                <p className="font-bold text-primary">{order.order_number}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Date</p>
                                <p className="font-medium text-gray-700">{formatDate(order.created_at)}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Status</p>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </span>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Total Amount</p>
                                <p className="font-bold text-primary">₹{Math.round(order.total_amount).toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            {order.order_items?.slice(0, 3).map((item: any, idx: number) => (
                                <div key={idx} className="flex gap-4 items-center">
                                    <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                        {item.product_image_url ? (
                                            <img src={item.product_image_url} alt={item.product_name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                                                {item.quantity}x
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-gray-800">{item.product_name}</h4>
                                        <p className="text-sm text-gray-500">₹{Math.round(item.product_price).toLocaleString()} each × {item.quantity}</p>
                                    </div>
                                    <p className="font-bold text-gray-800">₹{Math.round(item.subtotal).toLocaleString()}</p>
                                </div>
                            ))}
                            {order.order_items && order.order_items.length > 3 && (
                                <p className="text-sm text-gray-500 text-center pt-2">
                                    +{order.order_items.length - 3} more item(s)
                                </p>
                            )}
                        </div>
                        {order.shipping_address && (
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Shipping Address</p>
                                <p className="text-sm text-gray-700">
                                    {order.shipping_address}, {order.shipping_city}, {order.shipping_state} {order.shipping_pincode}
                                </p>
                            </div>
                        )}
                    </div>
                ))
            ) : (
                <div className="text-center py-12 text-gray-500">
                    <Package className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                    <p>No orders yet</p>
                </div>
            )}
        </div>
    );
};

const PersonalInfo = ({ user, onUpdate }: { user: any; onUpdate: () => void }) => {
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);
        
        // TODO: Implement user profile update API
        setTimeout(() => {
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setSaving(false);
            onUpdate();
        }, 1000);
    };

    return (
        <div className="max-w-xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Personal Information</h2>
            {message && (
                <div className={`mb-4 p-3 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {message.text}
                </div>
            )}
            <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Full Name</label>
                        <input 
                            type="text" 
                            defaultValue={user?.full_name || user?.user_metadata?.full_name || ''} 
                            name="fullName"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-secondary focus:border-secondary" 
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Phone</label>
                        <input 
                            type="tel" 
                            name="phone"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-secondary focus:border-secondary" 
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Email Address</label>
                    <input 
                        type="email" 
                        defaultValue={user?.email || ''} 
                        disabled
                        className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500" 
                    />
                    <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                </div>
                <button 
                    type="submit"
                    disabled={saving}
                    className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {saving ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                        </>
                    ) : (
                        'Save Changes'
                    )}
                </button>
            </form>
        </div>
    );
};

const BillingAddress = ({ user: _user }: { user: any }) => {
    return (
        <div className="max-w-xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Billing Address</h2>
            <p className="text-gray-500 mb-4">Billing address is collected during checkout for each order.</p>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600">Your billing address will be saved from your most recent order.</p>
            </div>
        </div>
    );
};

const DeliveryAddress = ({ user: _user }: { user: any }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="max-w-xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Delivery Address</h2>
            <p className="text-gray-500 mb-4">Delivery address is collected during checkout for each order.</p>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
                <p className="text-sm text-gray-600">Your delivery address will be saved from your most recent order.</p>
            </div>
            <button
                onClick={() => setIsModalOpen(true)}
                className="text-primary font-bold hover:underline"
            >
                + Add New Address
            </button>

            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden"
                        >
                            <div className="flex justify-between items-center p-6 border-b border-gray-100">
                                <h3 className="text-xl font-bold text-gray-800">Add New Address</h3>
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <div className="p-6 overflow-y-auto max-h-[80vh]">
                                <p className="text-gray-500 text-sm mb-4">
                                    Addresses are saved during checkout. You can add a new address when placing your next order.
                                </p>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                                >
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMessage(null);

        if (newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match' });
            return;
        }

        if (newPassword.length < 6) {
            setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
            return;
        }

        setSaving(true);
        const response = await authApi.changePassword(currentPassword, newPassword);
        
        if (response.error) {
            setMessage({ type: 'error', text: response.error });
        } else {
            setMessage({ type: 'success', text: 'Password updated successfully!' });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        }
        setSaving(false);
    };

    return (
        <div className="max-w-xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Change Password</h2>
            {message && (
                <div className={`mb-4 p-3 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {message.text}
                </div>
            )}
            <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Current Password</label>
                    <input 
                        type="password" 
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••" 
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-secondary focus:border-secondary" 
                    />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">New Password</label>
                    <input 
                        type="password" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••" 
                        required
                        minLength={6}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-secondary focus:border-secondary" 
                    />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Confirm New Password</label>
                    <input 
                        type="password" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••" 
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-secondary focus:border-secondary" 
                    />
                </div>
                <button 
                    type="submit"
                    disabled={saving}
                    className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {saving ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" /> Updating...
                        </>
                    ) : (
                        'Update Password'
                    )}
                </button>
            </form>
        </div>
    );
};

export default ProfilePage;
