import { motion } from 'framer-motion';

const milestones = [
    { year: "2025", title: "The Beginning", desc: "Embarking on a journey to provide premium quality textiles worldwide." }
];

const TimelineSection = () => {
    return (
        <section className="py-20 bg-background overflow-hidden ">
            <div className="container mx-auto px-6">
                <h2 className="text-4xl font-serif font-bold text-center text-primary mb-16">Our Journey</h2>
                <div className="relative border-l-2 border-primary/20 ml-6 md:mx-auto md:w-2/3 space-y-12">
                    {milestones.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            className="relative pl-8 md:pl-12"
                        >
                            <div className="absolute -left-[9px] top-0 w-4 h-4 bg-secondary rounded-full border-4 border-white shadow-sm" />
                            <span className="text-sm font-bold text-secondary uppercase tracking-widest">{item.year}</span>
                            <h3 className="text-2xl font-serif font-bold text-gray-800 mt-1">{item.title}</h3>
                            <p className="text-gray-600 mt-2 font-light">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TimelineSection;
