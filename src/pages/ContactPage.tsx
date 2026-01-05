import { useState } from 'react';
import { Mail, MapPin, Phone, Send, Loader2 } from 'lucide-react';
import { enquiriesApi } from '../lib/api';

const ContactPage = () => {
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage(null);

        const formData = new FormData(e.currentTarget);
        const enquiry = {
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            subject: formData.get('subject') as string,
            message: formData.get('message') as string,
        };

        const response = await enquiriesApi.create(enquiry);
        
        if (response.error) {
            setMessage({ type: 'error', text: response.error });
        } else {
            setMessage({ type: 'success', text: 'Message sent successfully! We will get back to you soon.' });
            e.currentTarget.reset();
        }
        
        setSubmitting(false);
    };

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
                                <p className="text-gray-200">Address 574 2nd Floor <br />Pocket 4 Omaxe New Chandigarh</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <Phone className="w-6 h-6 text-secondary flex-shrink-0" />
                            <div>
                                <h3 className="font-bold text-secondary mb-1">Call Us</h3>
                                <p className="text-gray-200">+91 9463583983</p>
                                <p className="text-gray-400 text-sm">Mon - Sat, 9am - 7pm</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <Mail className="w-6 h-6 text-secondary flex-shrink-0" />
                            <div>
                                <h3 className="font-bold text-secondary mb-1">Email Us</h3>
                                <p className="text-gray-200">whyanita30@gmail.com</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="bg-white p-10 rounded-lg shadow-lg border border-gray-100">
                    <h2 className="text-2xl font-serif font-bold text-primary mb-6">Send a Message</h2>
                    {message && (
                        <div className={`mb-4 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            {message.text}
                        </div>
                    )}
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                                <input
                                    name="name"
                                    required
                                    type="text"
                                    className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                <input
                                    name="email"
                                    required
                                    type="email"
                                    className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all"
                                    placeholder="john@example.com"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                            <input
                                name="subject"
                                required
                                type="text"
                                className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all"
                                placeholder="Inquiry about bulk orders"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                            <textarea
                                name="message"
                                required
                                rows={4}
                                className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all"
                                placeholder="Tell us more about your requirements..."
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-primary text-secondary font-bold py-4 rounded-md hover:bg-primary/90 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" /> Sending...
                                </>
                            ) : (
                                <>
                                    Send Message <Send className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
