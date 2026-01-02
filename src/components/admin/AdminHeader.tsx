import { useState, useRef, useEffect } from 'react';
import { Menu, Bell, X, LogOut, Settings } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface AdminHeaderProps {
    onMenuClick: () => void;
}

const AdminHeader = ({ onMenuClick }: AdminHeaderProps) => {
    const navigate = useNavigate();
    const [showNotifications, setShowNotifications] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);

    // Refs for click outside
    const notificationRef = useRef<HTMLDivElement>(null);
    const userMenuRef = useRef<HTMLDivElement>(null);

    const notifications = [
        { id: 1, title: 'New Order #ORD-7829', time: '2 mins ago', unread: true },
        { id: 2, title: 'Low Stock: Classic Silk Saree', time: '1 hour ago', unread: true },
        { id: 3, title: 'New Customer Registered', time: '3 hours ago', unread: false },
    ];

    const unreadCount = notifications.filter(n => n.unread).length;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setShowUserMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        // Logic to logout
        navigate('/');
    };

    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                >
                    <Menu size={24} />
                </button>
            </div>

            <div className="flex items-center gap-4">
                {/* Notifications */}
                <div className="relative" ref={notificationRef}>
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="p-2 hover:bg-gray-100 rounded-full text-gray-600 relative transition-colors"
                    >
                        <Bell size={20} />
                        {unreadCount > 0 && (
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                        )}
                    </button>

                    {showNotifications && (
                        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                            <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="font-semibold text-gray-800">Notifications</h3>
                                <button onClick={() => setShowNotifications(false)} className="text-gray-400 hover:text-gray-600">
                                    <X size={16} />
                                </button>
                            </div>
                            <div className="max-h-96 overflow-y-auto">
                                {notifications.map(notification => (
                                    <div key={notification.id} className={`px-4 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-0 cursor-pointer ${notification.unread ? 'bg-blue-50/30' : ''}`}>
                                        <p className="text-sm font-medium text-gray-800">{notification.title}</p>
                                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="px-4 py-2 border-t border-gray-100 text-center">
                                <button className="text-xs font-medium text-primary hover:text-primary/80">
                                    View All Notifications
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* User Menu */}
                <div className="relative" ref={userMenuRef}>
                    <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-primary font-bold hover:ring-2 hover:ring-primary/20 transition-all"
                    >
                        A
                    </button>

                    {showUserMenu && (
                        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50 animate-in fade-in slide-in-from-top-2">
                            <div className="px-4 py-3 border-b border-gray-100">
                                <p className="text-sm font-bold text-gray-800">Admin User</p>
                                <p className="text-xs text-gray-500 truncate">admin@textiletwist.com</p>
                            </div>
                            <Link
                                to="/admin/settings"
                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                onClick={() => setShowUserMenu(false)}
                            >
                                <Settings size={16} />
                                <span>Settings</span>
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left"
                            >
                                <LogOut size={16} />
                                <span>Sign Out</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;
