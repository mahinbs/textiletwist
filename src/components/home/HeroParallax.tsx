import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const HeroParallax = () => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });

    const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const textY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

    return (
        <div ref={ref} className="relative h-screen overflow-hidden flex items-center justify-center">
            <motion.div
                className="absolute inset-0 z-0"
                style={{ y: backgroundY }}
            >
                <div className="absolute inset-0 bg-black/40 z-10" />
                <img
                    src="/images/hero-bg.png"
                    alt="Luxury Abstract Fabric"
                    className="w-full h-full object-cover"
                />
            </motion.div>

            <motion.div
                className="relative z-20 text-center text-white px-6 w-full max-w-5xl pt-6"
                style={{ y: textY }}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
            >
                <motion.p
                    className="text-secondary tracking-[0.3em] font-medium mb-4 uppercase text-sm md:text-base"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                >
                    Textile Twist John's
                </motion.p>
                <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif font-bold mb-8 leading-tight">
                    One Thread <br />
                    <span className="italic font-light text-secondary">Infinite Luxury</span>
                </h1>
                <p className="max-w-xl mx-auto text-gray-200 text-lg md:text-xl font-light mb-10 leading-relaxed">
                    Redefining premium cotton home textiles. Experience the purity of craftsmanship in every weave.
                </p>

                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                    <button className="px-10 py-4 bg-secondary text-primary font-bold text-lg rounded-none hover:bg-white transition-colors duration-300 flex items-center gap-2">
                        Explore Collection <ArrowRight className="w-5 h-5" />
                    </button>
                    <button className="px-10 py-4 border border-white text-white font-medium text-lg rounded-none hover:bg-white hover:text-primary transition-colors duration-300">
                        B2B Services
                    </button>
                </div>
            </motion.div>

            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce text-white/50">
                <span className="text-xs uppercase tracking-widest">Scroll to Discover</span>
            </div>
        </div>
    );
};

export default HeroParallax;
