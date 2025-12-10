import { Mail, MapPin, Phone, Send } from 'lucide-react';

const ContactPage = () => {
    return (
        <div className="pt-24 pb-20 container mx-auto px-6">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-serif font-bold text-primary mb-4">Get in Touch</h1>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Whether you're looking for B2B partnerships or have a query about your order, we're here to help.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Contact Info */}
                <div className="bg-primary text-white p-10 rounded-lg shadow-xl">
                    <h2 className="text-2xl font-serif font-bold mb-8">Contact Information</h2>
                    <div className="space-y-8">
                        <div className="flex items-start gap-4">
                            <MapPin className="w-6 h-6 text-secondary flex-shrink-0" />
                            <div>
                                <h3 className="font-bold text-secondary mb-1">Visit Us</h3>
                                <p className="text-gray-200">123 Textile Ave, Fashion District,<br />Mumbai, India - 400001</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <Phone className="w-6 h-6 text-secondary flex-shrink-0" />
                            <div>
                                <h3 className="font-bold text-secondary mb-1">Call Us</h3>
                                <p className="text-gray-200">+91 0000000000</p>
                                <p className="text-gray-400 text-sm">Mon - Sat, 9am - 7pm</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <Mail className="w-6 h-6 text-secondary flex-shrink-0" />
                            <div>
                                <h3 className="font-bold text-secondary mb-1">Email Us</h3>
                                <p className="text-gray-200">info@example.com</p>
                                <p className="text-gray-200">sales@textiletwist.com</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="bg-white p-10 rounded-lg shadow-lg border border-gray-100">
                    <h2 className="text-2xl font-serif font-bold text-primary mb-6">Send a Message</h2>
                    <form className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                                <input type="text" className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all" placeholder="John Doe" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                <input type="email" className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all" placeholder="john@example.com" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                            <input type="text" className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all" placeholder="Inquiry about bulk orders" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                            <textarea rows={4} className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all" placeholder="Tell us more about your requirements..."></textarea>
                        </div>
                        <button type="button" className="w-full bg-primary text-secondary font-bold py-4 rounded-md hover:bg-primary/90 transition-all shadow-lg flex items-center justify-center gap-2">
                            Send Message <Send className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
