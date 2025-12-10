
import { motion } from 'framer-motion';
import { Award, Feather, History, Leaf } from 'lucide-react';
import TimelineSection from '../components/about/TimelineSection';
import SustainabilitySection from '../components/about/SustainabilitySection';
import ProcessSection from '../components/about/ProcessSection';

const AboutPage = () => {
    return (
        <div className="pt-20">
            {/* Hero Section */}
            <div className="bg-primary text-white py-24 text-center">
                <h1 className="text-5xl font-serif font-bold mb-4">Our Heritage</h1>
                <p className="text-xl max-w-2xl mx-auto font-light text-gray-200">
                    Weaving stories of luxury and tradition into every thread.
                </p>
            </div>

            {/* Story Section */}
            <section className="py-20 container mx-auto px-6">
                <div className="flex flex-col md:flex-row gap-12 items-center">
                    <div className="md:w-1/2">
                        <img
                            src="https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?q=80&w=2009&auto=format&fit=crop"
                            alt="Textile Loom"
                            className="w-full rounded-lg shadow-xl"
                        />
                    </div>
                    <div className="md:w-1/2">
                        <h2 className="text-3xl font-serif font-bold text-primary mb-6">A Legacy of Excellence</h2>
                        <p className="text-gray-700 leading-relaxed mb-6">
                            Textile Twist John’s began with a simple vision: to create fabrics that are not just materials, but experiences.
                            Rooted in the rigorous traditions of cotton craftsmanship, we have evolved into a global manufacturer
                            synonymous with quality and sustainability.
                        </p>
                        <p className="text-gray-700 leading-relaxed">
                            Our "One-Thread Fabric" innovation represents years of research, resulting in textiles that offer
                            unmatched softness, durability, and a flawless finish that defines B2B luxury.
                        </p>
                    </div>
                </div>
            </section>

            <TimelineSection />
            <SustainabilitySection />
            <ProcessSection />

            {/* Values/Features */}
            <section className="py-20 bg-background/50">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-serif font-bold text-center text-primary mb-12">Why Textile Twist?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {[
                            { icon: History, title: "Decades of Trust", desc: "Established reputation in premium cotton markets." },
                            { icon: Leaf, title: "Sustainable", desc: "Eco-friendly processes and ethically sourced cotton." },
                            { icon: Feather, title: "Premium Feel", desc: "Signature one-thread technology for ultra-softness." },
                            { icon: Award, title: "Quality Assured", desc: "Rigorous quality checks at every production stage." }
                        ].map((item, index) => (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                key={index}
                                className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center"
                            >
                                <item.icon className="w-12 h-12 text-secondary mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-primary mb-2">{item.title}</h3>
                                <p className="text-gray-600 font-light">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
