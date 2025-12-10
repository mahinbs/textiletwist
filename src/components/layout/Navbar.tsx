import { useState, useEffect } from 'react';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'About Us', path: '/about' },
        { name: 'Products', path: '/products' },
        { name: 'Contact', path: '/contact' },
    ];

    return (
        <nav className="fixed top-5 left-0 right-0 z-50 flex justify-center px-4">
            <div
                className={cn(
                    "flex items-center justify-between transition-all duration-500 ease-in-out",
                    "backdrop-blur-md border border-white/10 shadow-lg",
                    scrolled
                        ? "bg-primary/80 py-3 px-8 rounded-full w-full max-w-5xl"
                        : "bg-white/5 py-4 px-10 rounded-full w-full max-w-6xl"
                )}
            >
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <img src="/logo.png" alt="Textile Twist" className="w-12 h-auto" />
                    {/* <span className={cn("text-2xl font-serif font-bold text-white group-hover:text-secondary transition-colors")}>
                        Textile Twist
                    </span> */}
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8 bg-black/20 px-8 py-2 rounded-full border border-white/5">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={cn(
                                "text-sm font-medium tracking-wide transition-all duration-300 relative group",
                                location.pathname === link.path
                                    ? 'text-secondary'
                                    : 'text-white/80 hover:text-white'
                            )}
                        >
                            {link.name}
                            <span className={cn(
                                "absolute -bottom-1 left-0 w-0 h-0.5 bg-secondary transition-all duration-300 group-hover:w-full",
                                location.pathname === link.path ? "w-full" : ""
                            )} />
                        </Link>
                    ))}
                </div>

                {/* Mobile Menu & Cart */}
                <div className="flex items-center gap-4">
                    <button className="text-white hover:text-secondary transition-colors relative">
                        <ShoppingBag className="w-6 h-6" />
                        {/* <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary"></span>
                        </span> */}
                    </button>

                    <button
                        className="md:hidden text-white hover:text-secondary transition-colors"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Nav Overlay */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-4 mx-4 p-6 bg-primary/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 md:hidden flex flex-col gap-4 text-center">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className="text-white text-lg font-medium hover:text-secondary transition-colors py-2 border-b border-white/5 last:border-0"
                            onClick={() => setIsOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
