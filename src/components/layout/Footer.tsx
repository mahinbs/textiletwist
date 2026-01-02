
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-primary text-white pt-16 pb-8">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    {/* Brand Info */}
                    <div className="space-y-4">
                        <h3 className="text-3xl font-serif font-bold text-secondary">Textile Twist</h3>
                        <p className="text-gray-300 leading-relaxed">
                            Crafting premium cotton home textiles with precision and passion.
                            Elevating living spaces with our "one-thread fabric" innovation.
                        </p>
                        <div className="flex space-x-4 pt-2">
                            <a href="#" className="text-gold hover:text-white transition-colors"><Facebook className="w-5 h-5" /></a>
                            <a href="#" className="text-gold hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>
                            <a href="#" className="text-gold hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
                            <a href="#" className="text-gold hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-xl font-serif font-bold mb-6 text-secondary">Quick Links</h4>
                        <ul className="space-y-3">
                            <li><Link to="/" className="text-gray-300 hover:text-secondary transition-colors">Home</Link></li>
                            <li><Link to="/about" className="text-gray-300 hover:text-secondary transition-colors">About Us</Link></li>
                            <li><Link to="/products" className="text-gray-300 hover:text-secondary transition-colors">Our Collection</Link></li>
                            <li><Link to="/contact" className="text-gray-300 hover:text-secondary transition-colors">Contact Us</Link></li>
                        </ul>
                    </div>

                    {/* Products */}
                    <div>
                        <h4 className="text-xl font-serif font-bold mb-6 text-secondary">Products</h4>
                        <ul className="space-y-3">
                            <li><Link to="/products?category=bed-sheets" className="text-gray-300 hover:text-secondary transition-colors">Bed Sheets</Link></li>
                            <li><Link to="/products?category=table-linen" className="text-gray-300 hover:text-secondary transition-colors">Table Linen</Link></li>
                            <li><Link to="/products?category=cushion-covers" className="text-gray-300 hover:text-secondary transition-colors">Cushion Covers</Link></li>
                            <li><Link to="/products?category=new-arrivals" className="text-gray-300 hover:text-secondary transition-colors">New Arrivals</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-xl font-serif font-bold mb-6 text-secondary">Contact Us</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start space-x-3">
                                <MapPin className="w-5 h-5 text-secondary mt-1 flex-shrink-0" />
                                <span className="text-gray-300">Address 574 2nd Floor Pocket 4 Omaxe New Chandigarh </span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Phone className="w-5 h-5 text-secondary flex-shrink-0" />
                                <span className="text-gray-300">+91 9463583983</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Mail className="w-5 h-5 text-secondary flex-shrink-0" />
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
