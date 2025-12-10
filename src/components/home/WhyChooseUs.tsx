import { motion } from 'framer-motion';
import { Truck, CheckCircle, Clock, Globe } from 'lucide-react';

const benefits = [
    { icon: Globe, title: "Global Reach", desc: "Exporting to over 30 countries with reliable logistics." },
    { icon: CheckCircle, title: "Certified Quality", desc: "Oeko-Tex Standard 100 certified fabrics." },
    { icon: Truck, title: "Bulk Efficiency", desc: "Optimized for large-scale B2B orders." },
    { icon: Clock, title: "On-Time Delivery", desc: "99.8% timely delivery rate for the last 5 years." },
];

const WhyChooseUs = () => {
    return (
        <section className="py-24 bg-gray-50">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-serif font-bold text-primary mb-4">Why Partner With Us?</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Beyond just manufacturing, we provide end-to-end textile solutions tailored for hospitality and retail brands.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {benefits.map((benefit, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ y: -10 }}
                            className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300"
                        >
                            <div className="w-14 h-14 bg-primary/5 rounded-full flex items-center justify-center mb-6 mx-auto">
                                <benefit.icon className="w-7 h-7 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">{benefit.title}</h3>
                            <p className="text-gray-600 text-center text-sm leading-relaxed">{benefit.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;
