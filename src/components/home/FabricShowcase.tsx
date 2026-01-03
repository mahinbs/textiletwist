
import { motion } from 'framer-motion';

const FabricShowcase = () => {
    return (
        <section className="py-32 bg-background relative overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row items-center gap-20">
                    {/* <div className="md:w-1/2">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative"
                        >
                            <div className="absolute -top-10 -left-10 w-20 h-20 border-t-2 border-l-2 border-primary/20" />
                            <div className="absolute -bottom-10 -right-10 w-20 h-20 border-b-2 border-r-2 border-primary/20" />
                            <img
                                src="/images/fabric-macro.png"
                                alt="Macro view of fabric"
                                className="w-full h-[600px] object-cover grayscale hover:grayscale-0 transition-all duration-700 ease-in-out shadow-2xl"
                            />
                        </motion.div>
                    </div> */}

                    <div className="md:w-1/2 text-center mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <h2 className="text-sm font-bold tracking-widest text-secondary uppercase mb-4">Innovation</h2>
                            <h3 className="text-5xl md:text-6xl font-serif font-bold text-primary mb-8 leading-tight">
                                The Quality-Thread <br /> Revolution
                            </h3>
                            <p className="text-gray-600 text-lg leading-relaxed mb-8 font-light">
                                Unlike conventional textiles, our signature "Quality-Thread Fabric" technology ensures that every inch of fabric is woven from a continuous, unbroken strand of premium cotton.
                                This results in a surface so smooth, it feels like liquid silk against the skin, while maintaining the durability of heavy-duty canvas.
                            </p>
                            <p className="text-gray-600 text-lg leading-relaxed mb-12 font-light">
                                Designed for the modern luxury home, our fabrics breathe, adapt, and endure, setting a new standard for B2B excellence.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FabricShowcase;
