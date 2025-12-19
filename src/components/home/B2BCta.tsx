import { motion } from 'framer-motion';
import { ArrowRight, Palette, Ruler, Scissors } from 'lucide-react';
import { Link } from 'react-router-dom';
import swatchBookImg from '../../assets/images/swatch-book.png';

const features = [
    { icon: Palette, text: "Custom Color Matching" },
    { icon: Ruler, text: "Bespoke Sizing" },
    { icon: Scissors, text: "Logo Embroidery" }
];

const B2BCta = () => {
    return (
        <section className="py-24 bg-white relative overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="bg-primary rounded-3xl p-10 md:p-20 relative overflow-hidden flex flex-col md:flex-row items-center gap-16">

                    {/* Background Graphic */}
                    <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
                        <div className="absolute -top-24 -right-24 w-96 h-96 bg-secondary rounded-full blur-3xl" />
                        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary rounded-full blur-3xl" />
                    </div>

                    <div className="md:w-1/2 relative z-10">
                        <span className="text-secondary font-bold tracking-widest uppercase text-sm mb-4 block">For Hospitality & Retail</span>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6 leading-tight">
                            Tailored to Your <br />
                            <span className="text-secondary italic">Exact Vision</span>
                        </h2>
                        <p className="text-gray-200 text-lg mb-10 leading-relaxed font-light">
                            Need a specific thread count or a custom Pantone shade? Our bespoke manufacturing service allows you to create exclusive textile collections that perfectly align with your brand identity.
                        </p>

                        <div className="flex flex-wrap gap-4 mb-10">
                            {features.map((item, index) => (
                                <div key={index} className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm text-gray-100 backdrop-blur-sm">
                                    <item.icon className="w-4 h-4 text-secondary" />
                                    {item.text}
                                </div>
                            ))}
                        </div>

                        <Link to="/contact" className="inline-flex bg-secondary text-primary font-bold px-8 py-4 rounded-none hover:bg-white transition-all duration-300 items-center gap-2 group w-fit">
                            Request Sample Kit <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="md:w-1/2 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                            className="relative"
                        >
                            <div className="absolute -inset-4 border-2 border-secondary/30 rounded-lg transform rotate-3" />
                            <img
                                src={swatchBookImg}
                                alt="Luxury Fabric Swatch Book"
                                className="rounded-lg shadow-2xl w-full transform -rotate-3 hover:rotate-0 transition-transform duration-500"
                            />
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default B2BCta;
