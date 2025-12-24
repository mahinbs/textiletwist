import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const AuthPage = () => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="min-h-screen pt-32 pb-20 px-4 md:px-8 bg-gray-50 flex items-center justify-center">
            {/* ... background elements ... */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <div className="absolute -top-[20%] -right-[10%] w-[70vw] h-[70vw] rounded-full bg-secondary/5 blur-3xl" />
                <div className="absolute top-[40%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-primary/5 blur-3xl" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
            >
                {/* Header / Tabs */}
                <div className="flex border-b border-gray-100">
                    <button
                        onClick={() => setIsLogin(true)}
                        className={`flex-1 py-4 text-center text-sm font-semibold tracking-wide transition-colors duration-300 ${isLogin ? 'bg-primary text-white' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                            }`}
                    >
                        LOGIN
                    </button>
                    <button
                        onClick={() => setIsLogin(false)}
                        className={`flex-1 py-4 text-center text-sm font-semibold tracking-wide transition-colors duration-300 ${!isLogin ? 'bg-primary text-white' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                            }`}
                    >
                        SIGN UP
                    </button>
                </div>

                <div className="p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-serif font-bold text-primary mb-2">
                            {isLogin ? 'Welcome Back' : 'Join the Luxury'}
                        </h2>
                        <p className="text-gray-500 text-sm">
                            {isLogin
                                ? 'Enter your details to access your account'
                                : 'Create an account to start your journey'
                            }
                        </p>
                    </div>

                    <form className="space-y-5" onSubmit={(e) => {
                        e.preventDefault();
                        if (isLogin) {
                            // Dummy login success
                            navigate('/profile');
                        } else {
                            // Dummy signup success
                            navigate('/profile');
                        }
                    }}>
                        <AnimatePresence initial={false}>
                            {!isLogin && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                                    animate={{ opacity: 1, height: 'auto', marginBottom: 20 }}
                                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                    className="overflow-hidden"
                                >
                                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        placeholder="John Doe"
                                        required
                                        className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all"
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div>
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Email Address</label>
                            <input
                                type="email"
                                placeholder="name@example.com"
                                required
                                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all"
                            />
                        </div>

                        <div className="relative">
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Password</label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                required
                                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        {isLogin && (
                            <div className="text-right">
                                <Link to="#" className="text-xs text-secondary hover:text-secondary/80 font-medium">
                                    Forgot Password?
                                </Link>
                            </div>
                        )}

                        <button type="submit" className="w-full py-3 bg-secondary text-primary font-bold rounded-lg hover:bg-secondary/90 transition-all duration-300 flex items-center justify-center gap-2 mt-4">
                            {isLogin ? 'Sign In' : 'Create Account'}
                            <ArrowRight size={20} />
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-gray-400 text-xs">
                            By continuing, you agree to our{' '}
                            <Link to="#" className="underline hover:text-primary">Terms of Service</Link>{' '}
                            and{' '}
                            <Link to="#" className="underline hover:text-primary">Privacy Policy</Link>.
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AuthPage;
