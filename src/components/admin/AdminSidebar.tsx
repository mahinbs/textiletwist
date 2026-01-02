import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, Users, X, Settings, BarChart3, MessageSquare } from 'lucide-react';

interface AdminSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const AdminSidebar = ({ isOpen, onClose }: AdminSidebarProps) => {
    const location = useLocation();

    const isActive = (path: string) => {
        if (path === '/admin') {
            return location.pathname === '/admin';
        }
        return location.pathname.startsWith(path);
    };

    const navItems = [
        { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
        { path: '/admin/enquiries', icon: MessageSquare, label: 'Enquiries' },
        { path: '/admin/products', icon: Package, label: 'Products' },
        { path: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
        { path: '/admin/customers', icon: Users, label: 'Customers' },
        { path: '/admin/settings', icon: Settings, label: 'Settings' },
    ];

    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed top-0 left-0 bottom-0 z-50 w-64 bg-primary text-white transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                    <h1 className="text-xl font-serif font-bold text-secondary">Textile Twist</h1>
                    <button onClick={onClose} className="lg:hidden p-1 hover:bg-white/10 rounded">
                        <X size={20} />
                    </button>
                </div>

                <nav className="p-4 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => window.innerWidth < 1024 && onClose()}
                            className={`
                                flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                                ${isActive(item.path)
                                    ? 'bg-secondary text-primary font-medium'
                                    : 'hover:bg-white/10 text-white/80 hover:text-white'}
                            `}
                        >
                            <item.icon size={20} />
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
                    <div className="flex items-center gap-3 px-4 py-3">
                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-primary font-bold">
                            A
                        </div>
                        <div>
                            <p className="text-sm font-medium">Admin User</p>
                            <p className="text-xs text-secondary">admin@textiletwist.com</p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default AdminSidebar;
