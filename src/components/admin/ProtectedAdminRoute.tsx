import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { authApi } from '../../lib/api';

interface ProtectedAdminRouteProps {
    children: React.ReactNode;
}

const ProtectedAdminRoute = ({ children }: ProtectedAdminRouteProps) => {
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const response = await authApi.getCurrentUser();
                if (response.data?.user) {
                    const userRole = response.data.user.role || 'user';
                    setIsAdmin(userRole === 'admin');
                } else {
                    setIsAdmin(false);
                }
            } catch (error) {
                setIsAdmin(false);
            } finally {
                setLoading(false);
            }
        };
        checkAdmin();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!isAdmin) {
        return <Navigate to="/auth" replace />;
    }

    return <>{children}</>;
};

export default ProtectedAdminRoute;

