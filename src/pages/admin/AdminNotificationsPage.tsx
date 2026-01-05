import { useState, useEffect } from 'react';
import { Bell, Check, CheckCheck, Trash2, Loader2 } from 'lucide-react';
import { notificationsApi } from '../../lib/api';

interface Notification {
    id: string;
    type: string;
    title: string;
    message?: string;
    data?: any;
    is_read: boolean;
    created_at: string;
}

const AdminNotificationsPage = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'unread'>('all');

    useEffect(() => {
        fetchNotifications();
        // Poll for new notifications every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, [filter]);

    const fetchNotifications = async () => {
        setLoading(true);
        const response = await notificationsApi.getAll({ 
            limit: 100,
            unread_only: filter === 'unread'
        });
        if (response.data) {
            setNotifications(response.data.notifications || []);
        }
        setLoading(false);
    };

    const handleMarkAsRead = async (id: string) => {
        await notificationsApi.markAsRead(id);
        setNotifications(prev => prev.map(n => 
            n.id === id ? { ...n, is_read: true } : n
        ));
    };

    const handleMarkAllAsRead = async () => {
        await notificationsApi.markAllAsRead();
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    };

    const handleDelete = async (id: string) => {
        await notificationsApi.delete(id);
        setNotifications(prev => prev.filter(n => n.id !== id));
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

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'order':
                return '🛒';
            case 'order_status':
                return '📦';
            case 'low_stock':
            case 'stock_warning':
                return '⚠️';
            case 'new_customer':
                return '👤';
            case 'new_enquiry':
                return '📧';
            default:
                return '🔔';
        }
    };

    const unreadCount = notifications.filter(n => !n.is_read).length;

    return (
        <div>
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 font-serif">Notifications</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage your notifications</p>
                </div>
                <div className="flex items-center gap-3">
                    {unreadCount > 0 && (
                        <button
                            onClick={handleMarkAllAsRead}
                            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center gap-2 transition-colors"
                        >
                            <CheckCheck size={18} />
                            Mark All Read
                        </button>
                    )}
                </div>
            </div>

            {/* Filters */}
            <div className="mb-6 flex gap-2">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        filter === 'all'
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    All
                </button>
                <button
                    onClick={() => setFilter('unread')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        filter === 'unread'
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    Unread ({unreadCount})
                </button>
            </div>

            {/* Notifications List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center">
                        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>No notifications found</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`p-4 hover:bg-gray-50 transition-colors ${
                                    !notification.is_read ? 'bg-blue-50/30' : ''
                                }`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className="text-2xl">{getNotificationIcon(notification.type)}</div>
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="font-medium text-gray-800">{notification.title}</h3>
                                                {notification.message && (
                                                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                                                )}
                                                <p className="text-xs text-gray-500 mt-2">{formatTime(notification.created_at)}</p>
                                            </div>
                                            <div className="flex items-center gap-2 ml-4">
                                                {!notification.is_read && (
                                                    <button
                                                        onClick={() => handleMarkAsRead(notification.id)}
                                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                                        title="Mark as read"
                                                    >
                                                        <Check size={18} />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(notification.id)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminNotificationsPage;

