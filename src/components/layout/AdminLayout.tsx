import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../admin/AdminSidebar';
import AdminHeader from '../admin/AdminHeader';
import ProtectedAdminRoute from '../admin/ProtectedAdminRoute';

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <ProtectedAdminRoute>
            <div className="min-h-screen bg-gray-50 flex">
                <AdminSidebar
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                />

                <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
                    <AdminHeader onMenuClick={() => setSidebarOpen(true)} />

                    <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
                        <Outlet />
                    </main>
                </div>
            </div>
        </ProtectedAdminRoute>
    );
};

export default AdminLayout;
