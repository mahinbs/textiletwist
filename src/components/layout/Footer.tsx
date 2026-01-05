
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin, Plus, Minus } from 'lucide-react';

const Footer = () => {
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        products: false,
        apparels: false
    });

    const toggleSection = (section: string) => {
        setOpenSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    return (
        <footer className="bg-primary text-white pt-16 pb-8">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                    {/* Brand Info */}
                    <div className="space-y-4">
                        <h3 className="text-3xl font-serif font-bold text-secondary">Textile Twist</h3>
                        <p className="text-gray-300 leading-relaxed">
                            Crafting premium cotton home textiles with precision and passion.
                            Elevating living spaces with our "Quality-Thread fabric" innovation.
                        </p>
                        <div className="flex space-x-4 pt-2">
                            <a href="#" className="text-gold hover:text-white transition-colors"><Facebook className="w-5 h-5" /></a>
                            <a href="#" className="text-gold hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>
                            <a href="#" className="text-gold hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
                            <a href="#" className="text-gold hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></a>
                        </div>
                    </div>

                    {/* Quick Links, Products, Apparels Combined */}
                    <div className="space-y-3">
                        {/* Quick Links */}
                        <div>
                            <h4 className="text-xl font-bold mb-6 text-secondary">Quick Links</h4>
                            <ul className="space-y-3">
                                <li><Link to="/" className="text-gray-300 hover:text-secondary transition-colors">Home</Link></li>
                                <li><Link to="/about" className="text-gray-300 hover:text-secondary transition-colors">About Us</Link></li>
                                <li><Link to="/products" className="text-gray-300 hover:text-secondary transition-colors">Our Collection</Link></li>
                                <li><Link to="/contact" className="text-gray-300 hover:text-secondary transition-colors">Contact Us</Link></li>
                            </ul>
                        </div>

                        {/* Products */}
                        <div>
                            <button
                                onClick={() => toggleSection('products')}
                                className="flex items-center justify-between w-full lg:w-auto group"
                            >
                                <h4 className="text-gray-300 hover:text-secondary transition-colors font-sans">Products</h4>
                                <div>
                                    {openSections['products'] ? <Minus className="w-4 h-4 text-secondary cursor-pointer" /> : <Plus className="w-4 h-4 text-secondary cursor-pointer" />}
                                </div>
                            </button>
                            <ul className={`space-y-3 overflow-hidden transition-all duration-300 ${openSections['products'] ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
                                <li><Link to="/products?category=bed-sheets" className="text-gray-300 hover:text-secondary transition-colors">Bed Sheets</Link></li>
                                <li><Link to="/products?category=table-linen" className="text-gray-300 hover:text-secondary transition-colors">Table Linen</Link></li>
                                <li><Link to="/products?category=cushion-covers" className="text-gray-300 hover:text-secondary transition-colors">Cushion Covers</Link></li>
                                <li><Link to="/products?category=bath-linen" className="text-gray-300 hover:text-secondary transition-colors">Bath Linen</Link></li>
                                <li><Link to="/products?category=royal-collection" className="text-gray-300 hover:text-secondary transition-colors">Royal Collection</Link></li>
                            </ul>
                        </div>

                        {/* Apparels */}
                        <div>
                            <button
                                onClick={() => toggleSection('apparels')}
                                className="flex items-center justify-between w-full lg:w-auto group"
                            >
                                <h4 className="text-gray-300 hover:text-secondary transition-colors font-sans">Apparels</h4>
                                <div>
                                    {openSections['apparels'] ? <Minus className="w-4 h-4 text-secondary cursor-pointer" /> : <Plus className="w-4 h-4 text-secondary cursor-pointer" />}
                                </div>
                            </button>
                            <ul className={`space-y-3 overflow-hidden transition-all duration-300 ${openSections['apparels'] ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
                                <li><Link to="/products?category=apparels-men" className="text-gray-300 hover:text-secondary transition-colors">Men</Link></li>
                                <li><Link to="/products?category=apparels-women" className="text-gray-300 hover:text-secondary transition-colors">Women</Link></li>
                                <li><Link to="/products?category=apparels-kids" className="text-gray-300 hover:text-secondary transition-colors">Kids</Link></li>
                            </ul>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-xl font-bold mb-6 text-secondary">Contact Us</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start space-x-3">
                                <MapPin className="w-5 h-5 text-secondary mt-1 shrink-0" />
                                <span className="text-gray-300">574, 2nd Floor Pocket 4 Omaxe New Chandigarh </span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Phone className="w-5 h-5 text-secondary shrink-0" />
                                <span className="text-gray-300">+91 9463583983</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Mail className="w-5 h-5 text-secondary shrink-0" />
                                <span className="text-gray-300">whyanita30@gmail.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 mt-12 pt-8 text-center text-gray-400 text-sm">
                    <p>&copy; {new Date().getFullYear()} Textile Twist John's. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
