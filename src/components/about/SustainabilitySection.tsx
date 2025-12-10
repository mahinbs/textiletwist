import { motion } from 'framer-motion';
import { Leaf, Award, Recycle } from 'lucide-react';

const SustainabilitySection = () => {
    return (
        <section className="py-24 bg-primary text-white relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-16">
                <div className="md:w-1/2 ">
                    <motion.div
                        initial={{ opacity: 0, rotate: -5 }}
                        whileInView={{ opacity: 1, rotate: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <img
                            src="/images/cotton-field.png"
                            alt="Organic Cotton Field"
                            className="rounded-lg shadow-2xl border-4 border-white/10"
                        />
                    </motion.div>
                </div>
                <div className="md:w-1/2">
                    <h2 className="text-secondary font-bold tracking-widest uppercase mb-4">Responsibility</h2>
                    <h3 className="text-4xl md:text-5xl font-serif font-bold mb-8">Woven with Conscience</h3>
                    <p className="text-gray-200 text-lg font-light leading-relaxed mb-10">
                        We believe luxury shouldn't cost the earth. That's why 100% of our cotton is ethically sourced,
                        and our manufacturing processes differ from industry standards by using 40% less water.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="flex flex-col items-center text-center p-4 bg-white/5 rounded-lg backdrop-blur-sm">
                            <Leaf className="w-8 h-8 text-secondary mb-3" />
                            <span className="font-bold">Organic</span>
                        </div>
                        <div className="flex flex-col items-center text-center p-4 bg-white/5 rounded-lg backdrop-blur-sm">
                            <Recycle className="w-8 h-8 text-secondary mb-3" />
                            <span className="font-bold">Recyclable</span>
                        </div>
                        <div className="flex flex-col items-center text-center p-4 bg-white/5 rounded-lg backdrop-blur-sm">
                            <Award className="w-8 h-8 text-secondary mb-3" />
                            <span className="font-bold">Fair Trade</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-12 transform translate-x-20" />
        </section>
    );
};

export default SustainabilitySection;
