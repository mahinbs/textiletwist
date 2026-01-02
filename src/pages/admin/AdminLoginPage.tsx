import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminLoginPage = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            // In a real app, perform validation and Auth token storage here
            navigate('/admin');
        }, 1500);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 md:px-8 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/5 rounded-bl-full blur-3xl transform translate-x-1/4 -translate-y-1/4" />
                <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-secondary/5 rounded-tr-full blur-3xl transform -translate-x-1/4 translate-y-1/4" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-md"
            >
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 p-8 md:p-10">
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                            <Lock size={32} />
                        </div>
                        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Admin Portal</h1>
                        <p className="text-gray-500 text-sm">Secure access for Textile Twist administrators</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                                Admin Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@textiletwist.com"
                                required
                                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-300"
                            />
                        </div>

                        <div className="relative">
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                                Password
                            </label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-300"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-primary/20 ${loading ? 'opacity-80 cursor-wait' : ''}`}
                        >
                            {loading ? (
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Access Dashboard
                                    <ArrowRight size={20} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-xs text-gray-400">
                            Protected by Admin Security Protocols.
                            <br />
                            IP Address Logged for security.
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminLoginPage;
