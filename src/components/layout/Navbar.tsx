import { useState, useEffect, useRef } from 'react';
import { Menu, X, ShoppingBag, Heart, User, Plus, Package } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { categoriesApi } from '../../lib/api';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [categories, setCategories] = useState<any[]>([]);
    const location = useLocation();
    const navRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Fetch categories from backend
    useEffect(() => {
        const fetchCategories = async () => {
            const response = await categoriesApi.getAll();
            if (response.data) {
                setCategories(response.data.categories || []);
            }
        };
        fetchCategories();
    }, []);

    // Close mobile menu when route changes
    useEffect(() => {
        setIsOpen(false);
        setActiveDropdown(null);
    }, [location]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (navRef.current && !navRef.current.contains(event.target as Node)) {
                setActiveDropdown(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Build nav links with dynamic categories
    const activeCategories = categories.filter(cat => cat.is_active);
    
    // Separate regular products from Apparels
    const productCategories = activeCategories.filter(cat => 
        !cat.slug?.startsWith('apparels-') && cat.slug !== 'apparels'
    );
    const apparelsCategories = activeCategories.filter(cat => 
        cat.slug?.startsWith('apparels-') || cat.slug === 'apparels'
    );
    
    // Build Apparels submenu (Men, Women, Kids)
    const apparelsSubItems = apparelsCategories.length > 0
        ? apparelsCategories.map(cat => ({
            name: cat.name,
            path: `/products?category=${cat.slug}`,
        }))
        : [
            { name: 'Men', path: '/products?category=apparels-men' },
            { name: 'Women', path: '/products?category=apparels-women' },
            { name: 'Kids', path: '/products?category=apparels-kids' },
        ];
    
    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'About Us', path: '/about' },
        {
            name: 'Products',
            path: '/products',
            subItems: productCategories.length > 0 ? productCategories.map(cat => ({
                name: cat.name,
                path: `/products?category=${cat.slug}`,
            })) : []
        },
        {
            name: 'Apparels',
            path: '/products?category=apparels',
            subItems: apparelsSubItems
        },
        { name: 'Contact', path: '/contact' },
    ];

    const toggleDropdown = (name: string) => {
        if (activeDropdown === name) {
            setActiveDropdown(null);
        } else {
            setActiveDropdown(name);
        }
    };

    return (
        <nav className="fixed top-5 left-0 right-0 z-50 flex justify-center px-4">
            <div
                className={cn(
                    "flex items-center justify-between transition-all duration-500 ease-in-out",
                    "backdrop-blur-md border border-white/10 shadow-lg",
                    scrolled
                        ? "bg-primary/80 py-3 px-8 rounded-full w-full max-w-6xl"
                        : "bg-white/5 py-4 px-10 rounded-full w-full max-w-7xl"
                )}
            >
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <img src="/logo.png" alt="Textile Twist" className="w-14 h-auto" />
                </Link>

                {/* Desktop Nav */}
                <div ref={navRef} className="hidden md:flex items-center gap-8 bg-black/20 px-8 py-2 rounded-full border border-white/5">
                    {navLinks.map((link) => (
                        <div key={link.name} className="relative group/idx">
                            {link.subItems ? (
                                <div className="relative">
                                    <button
                                        onClick={() => toggleDropdown(link.name)}
                                        className={cn(
                                            "flex items-center gap-1 text-sm font-medium tracking-wide transition-all duration-300 relative group cursor-pointer",
                                            location.pathname.includes(link.path) || activeDropdown === link.name
                                                ? 'text-secondary'
                                                : 'text-white/80 hover:text-white'
                                        )}
                                    >
                                        {link.name}
                                        <Plus className={cn("w-3 h-3 transition-transform duration-300", activeDropdown === link.name ? "rotate-45" : "")} />
                                    </button>

                                    {/* Desktop Dropdown */}
                                    <div className={cn(
                                        "absolute top-full left-1/2 -translate-x-1/2 mt-4 w-56 bg-white/95 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 overflow-hidden transition-all duration-300 origin-top",
                                        activeDropdown === link.name
                                            ? "opacity-100 scale-100 visible"
                                            : "opacity-0 scale-95 invisible pointer-events-none"
                                    )}>
                                        <div className="py-2 flex flex-col">
                                            {link.subItems.map((sub) => (
                                                <Link
                                                    key={sub.name}
                                                    to={sub.path}
                                                    onClick={() => setActiveDropdown(null)}
                                                    className="px-5 py-3 text-sm text-gray-700 hover:bg-secondary/10 hover:text-secondary transition-colors text-left"
                                                >
                                                    {sub.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <Link
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
                            )}
                        </div>
                    ))}
                </div>

                {/* Mobile Menu & Cart */}
                <div className="flex items-center gap-6">
                    <Link to="/track-order" className={`${scrolled ? 'text-white' : 'text-secondary'} hover:text-secondary transition-colors relative hidden sm:block`} title="Track Order">
                        <Package className="w-6 h-6" />
                    </Link>

                    <Link to="/wishlist" className={`${scrolled ? 'text-white' : 'text-secondary'} hover:text-secondary transition-colors relative hidden sm:block`} title="Wishlist">
                        <Heart className="w-6 h-6" />
                    </Link>

                    <Link to="/auth" className={`${scrolled ? 'text-white' : 'text-secondary'} hover:text-secondary transition-colors relative`} title="Account">
                        <User className="w-6 h-6" />
                    </Link>

                    <Link to="/cart" className={`${scrolled ? 'text-white' : 'text-secondary'} hover:text-secondary transition-colors relative`} title="Cart">
                        <ShoppingBag className="w-6 h-6" />
                    </Link>

                    <button
                        className={`${scrolled ? 'text-white' : 'text-secondary'} hover:text-secondary transition-colors md:hidden`}
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Nav Overlay */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-4 mx-4 p-6 bg-primary/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 md:hidden flex flex-col gap-2 max-h-[80vh] overflow-y-auto">
                    {navLinks.map((link) => (
                        <div key={link.name} className="border-b border-white/5 last:border-0 pb-2">
                            {link.subItems ? (
                                <div>
                                    <button
                                        onClick={() => toggleDropdown(link.name)}
                                        className="w-full flex items-center justify-between text-white text-lg font-medium hover:text-secondary transition-colors py-2"
                                    >
                                        {link.name}
                                        <Plus className={cn("w-5 h-5 transition-transform duration-300", activeDropdown === link.name ? "rotate-45" : "")} />
                                    </button>

                                    <div className={cn(
                                        "overflow-hidden transition-all duration-300 bg-black/20 rounded-lg",
                                        activeDropdown === link.name ? "max-h-[500px] mt-2 mb-2" : "max-h-0"
                                    )}>
                                        {link.subItems.map((sub) => (
                                            <Link
                                                key={sub.name}
                                                to={sub.path}
                                                className="block w-full text-left px-6 py-3 text-white/80 text-base hover:text-secondary hover:bg-white/5 transition-colors"
                                                onClick={() => setIsOpen(false)}
                                            >
                                                {sub.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <Link
                                    to={link.path}
                                    className="block text-white text-lg font-medium hover:text-secondary transition-colors py-2"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
