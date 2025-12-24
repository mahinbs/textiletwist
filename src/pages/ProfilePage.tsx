import { useState } from 'react';
import { Package, User, CreditCard, MapPin, Lock, LogOut, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('orders');

    const handleSignOut = () => {
        // Clear auth logic here if needed
        navigate('/auth');
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'orders':
                return <MyOrders />;
            case 'personal-info':
                return <PersonalInfo />;
            case 'billing':
                return <BillingAddress />;
            case 'delivery':
                return <DeliveryAddress />;
            case 'password':
                return <ChangePassword />;
            default:
                return <MyOrders />;
        }
    };

    return (
        <div className="pt-28 pb-20 container mx-auto px-6 h-screen overflow-hidden flex flex-col">
            <h1 className="text-4xl font-serif font-bold text-primary mb-8 px-4 md:px-0">My Account</h1>

            <div className="flex flex-col md:flex-row gap-8 h-full">
                {/* Sidebar Navigation */}
                <div className="w-full md:w-1/4 bg-white rounded-xl shadow-sm border border-gray-100 p-4 h-fit">
                    <div className="flex items-center gap-4 mb-8 p-2">
                        <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center text-secondary font-bold text-xl">
                            JD
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-800">John Doe</h3>
                            <p className="text-xs text-gray-500">john.doe@example.com</p>
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
const MyOrders = () => (
    <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">My Orders</h2>
        {[1, 2].map((order) => (
            <div key={order} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-wrap justify-between items-start gap-4 mb-4 pb-4 border-b border-gray-100">
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Order ID</p>
                        <p className="font-bold text-primary">#ORD-2024-{1000 + order}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Date</p>
                        <p className="font-medium text-gray-700">Dec {20 + order}, 2024</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Status</p>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Delivered
                        </span>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Total Amount</p>
                        <p className="font-bold text-primary">₹ 2,490</p>
                    </div>
                </div>
                <div className="flex gap-4 items-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
                        <img src="/images/bed-linen.png" alt="Product" className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-800">Royal Satin Bed Sheet</h4>
                        <p className="text-sm text-gray-500">Queen Size x 1</p>
                    </div>
                    <button className="ml-auto text-sm text-secondary font-bold hover:underline">View Details</button>
                </div>
            </div>
        ))}
    </div>
);

const PersonalInfo = () => (
    <div className="max-w-xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Personal Information</h2>
        <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">First Name</label>
                    <input type="text" defaultValue="John" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-secondary focus:border-secondary" />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Last Name</label>
                    <input type="text" defaultValue="Doe" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-secondary focus:border-secondary" />
                </div>
            </div>
            <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Email Address</label>
                <input type="email" defaultValue="john.doe@example.com" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-secondary focus:border-secondary" />
            </div>
            <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Phone Number</label>
                <input type="tel" defaultValue="+91 98765 43210" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-secondary focus:border-secondary" />
            </div>
            <button className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 mt-4">Save Changes</button>
        </form>
    </div>
);

const BillingAddress = () => (
    <div className="max-w-xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Billing Address</h2>
        <form className="space-y-4">
            <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Street Address</label>
                <input type="text" defaultValue="123 Luxury Lane, Silk Road" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-secondary focus:border-secondary" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">City</label>
                    <input type="text" defaultValue="Mumbai" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-secondary focus:border-secondary" />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">State</label>
                    <input type="text" defaultValue="Maharashtra" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-secondary focus:border-secondary" />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Zip Code</label>
                    <input type="text" defaultValue="400001" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-secondary focus:border-secondary" />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Country</label>
                    <input type="text" defaultValue="India" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-secondary focus:border-secondary" />
                </div>
            </div>
            <button className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 mt-4">Update Address</button>
        </form>
    </div>
);

const DeliveryAddress = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="max-w-xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Delivery Address</h2>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 mb-6 flex justify-between items-center">
                <div>
                    <p className="font-bold text-gray-800">Home</p>
                    <p className="text-sm text-gray-600">123 Luxury Lane, Silk Road, Mumbai, 400001</p>
                </div>
                <span className="text-xs bg-secondary text-white px-2 py-1 rounded">Default</span>
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
                                <form className="space-y-4" onSubmit={(e) => {
                                    e.preventDefault();
                                    alert("Address Added!");
                                    setIsModalOpen(false);
                                }}>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Address Label (e.g., Office)</label>
                                        <input type="text" placeholder="Office, Home, etc." className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-secondary focus:border-secondary" required />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Street Address</label>
                                        <input type="text" placeholder="House no, Street name" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-secondary focus:border-secondary" required />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">City</label>
                                            <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-secondary focus:border-secondary" required />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">State</label>
                                            <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-secondary focus:border-secondary" required />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Zip Code</label>
                                            <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-secondary focus:border-secondary" required />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Country</label>
                                            <input type="text" defaultValue="India" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-secondary focus:border-secondary" required />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 mt-2">
                                        <input type="checkbox" id="default-address" className="rounded text-secondary focus:ring-secondary" />
                                        <label htmlFor="default-address" className="text-sm text-gray-600">Make this my default address</label>
                                    </div>
                                    <div className="pt-4 flex gap-3">
                                        <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium">Cancel</button>
                                        <button type="submit" className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 font-medium">Save Address</button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

const ChangePassword = () => (
    <div className="max-w-xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Change Password</h2>
        <form className="space-y-4">
            <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Current Password</label>
                <input type="password" placeholder="••••••••" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-secondary focus:border-secondary" />
            </div>
            <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">New Password</label>
                <input type="password" placeholder="••••••••" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-secondary focus:border-secondary" />
            </div>
            <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Confirm New Password</label>
                <input type="password" placeholder="••••••••" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-secondary focus:border-secondary" />
            </div>
            <button className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 mt-4">Update Password</button>
        </form>
    </div>
);

export default ProfilePage;
