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
                // First check localStorage for immediate auth state
                const cachedUser = localStorage.getItem('user');
                if (cachedUser) {
                    try {
                        const user = JSON.parse(cachedUser);
                        if (user.role === 'admin') {
                            setIsAdmin(true);
                            // Still verify with backend, but don't block
                            authApi.getCurrentUser().then((response) => {
                                if (response.data?.user) {
                                    localStorage.setItem('user', JSON.stringify(response.data.user));
                                } else {
                                    // If backend says not authenticated, clear cache
                                    localStorage.removeItem('user');
                                    setIsAdmin(false);
                                    window.location.href = '/auth';
                                }
                            }).catch(() => {
                                // If backend check fails, keep using cached user for now
                            });
                            setLoading(false);
                            return;
                        }
                    } catch (e) {
                        // Invalid cache, clear it
                        localStorage.removeItem('user');
                    }
                }
                
                // No cached user or not admin, check with backend
                const response = await authApi.getCurrentUser();
                if (response.data?.user) {
                    const userRole = response.data.user.role || 'user';
                    setIsAdmin(userRole === 'admin');
                    // Cache the user
                    localStorage.setItem('user', JSON.stringify(response.data.user));
                } else {
                    setIsAdmin(false);
                    localStorage.removeItem('user');
                }
            } catch (error) {
                setIsAdmin(false);
                localStorage.removeItem('user');
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

