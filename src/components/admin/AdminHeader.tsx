import { useState, useRef, useEffect } from 'react';
import { Menu, Bell, X, LogOut, Settings } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { notificationsApi } from '../../lib/api';

interface AdminHeaderProps {
    onMenuClick: () => void;
}

const AdminHeader = ({ onMenuClick }: AdminHeaderProps) => {
    const navigate = useNavigate();
    const [showNotifications, setShowNotifications] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);

    // Refs for click outside
    const notificationRef = useRef<HTMLDivElement>(null);
    const userMenuRef = useRef<HTMLDivElement>(null);

    // Fetch notifications
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const [notificationsResponse, countResponse] = await Promise.all([
                    notificationsApi.getAll({ limit: 5 }),
                    notificationsApi.getUnreadCount(),
                ]);

                if (notificationsResponse.data) {
                    setNotifications(notificationsResponse.data.notifications || []);
                }
                if (countResponse.data) {
                    setUnreadCount(countResponse.data.count || 0);
                }
            } catch (error) {
                console.error('Failed to fetch notifications:', error);
            }
        };

        fetchNotifications();
        // Poll for new notifications every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    // Fetch notifications when dropdown opens
    useEffect(() => {
        if (showNotifications) {
            const fetchNotifications = async () => {
                setLoading(true);
                const response = await notificationsApi.getAll({ limit: 10 });
                if (response.data) {
                    setNotifications(response.data.notifications || []);
                }
                setLoading(false);
            };
            fetchNotifications();
        }
    }, [showNotifications]);

    const handleNotificationClick = async (notification: any) => {
        if (!notification.is_read) {
            await notificationsApi.markAsRead(notification.id);
            setNotifications(prev => prev.map(n => 
                n.id === notification.id ? { ...n, is_read: true } : n
            ));
            setUnreadCount(prev => Math.max(0, prev - 1));
        }
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? 'min' : 'mins'} ago`;
        if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
        if (diffDays < 7) return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
        return date.toLocaleDateString();
    };

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
                                {loading ? (
                                    <div className="px-4 py-8 text-center text-gray-500 text-sm">Loading...</div>
                                ) : notifications.length === 0 ? (
                                    <div className="px-4 py-8 text-center text-gray-500 text-sm">No notifications</div>
                                ) : (
                                    notifications.map(notification => (
                                        <div 
                                            key={notification.id} 
                                            onClick={() => handleNotificationClick(notification)}
                                            className={`px-4 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-0 cursor-pointer transition-colors ${!notification.is_read ? 'bg-blue-50/30' : ''}`}
                                        >
                                            <p className="text-sm font-medium text-gray-800">{notification.title}</p>
                                            {notification.message && (
                                                <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                                            )}
                                            <p className="text-xs text-gray-500 mt-1">{formatTime(notification.created_at)}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                            <div className="px-4 py-2 border-t border-gray-100 text-center">
                                <Link 
                                    to="/admin/notifications"
                                    onClick={() => setShowNotifications(false)}
                                    className="text-xs font-medium text-primary hover:text-primary/80"
                                >
                                    View All Notifications
                                </Link>
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
