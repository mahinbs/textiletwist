import { motion } from 'framer-motion';

const brandValues = [
    "Premium Cotton", "Sustainable Luxury", "Global Shipping", "One-Thread Tech", "Hotel Grade Durability", "Artisan Craftsmanship"
];

const BrandMarquee = () => {
    return (
        <div className="bg-primary py-8 overflow-hidden whitespace-nowrap border-y-4 border-secondary text-secondary relative z-20">
            <div className="flex select-none">
                <motion.div
                    className="flex gap-20"
                    animate={{ x: "-100%" }}
                    transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
                >
                    {[...brandValues, ...brandValues, ...brandValues, ...brandValues].map((text, i) => (
                        <div key={i} className="flex items-center gap-20">
                            <span className="text-2xl md:text-4xl font-serif font-light md:font-medium tracking-wide uppercase">
                                {text}
                            </span>
                            <span className="w-3 h-3 bg-secondary rounded-full" />
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default BrandMarquee;
