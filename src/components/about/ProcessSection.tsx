import { Filter, Layers, CheckSquare } from 'lucide-react';

const steps = [
    { icon: Filter, title: "01. Ethical Sourcing", desc: "We select only the finest long-staple cotton." },
    { icon: Layers, title: "02. Precision Weaving", desc: "Our 'Quality-Thread' looms create fabric with 300+ thread counts without compromising breathability." },
    { icon: CheckSquare, title: "03. Quality Control", desc: "Each yard undergoes a 4-point inspection system before shipping." },
];

const ProcessSection = () => {
    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <span className="text-secondary font-bold tracking-widest uppercase text-sm">How We Work</span>
                    <h2 className="text-4xl font-serif font-bold text-primary mt-2">From Farm to Fabric</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-[60px] left-0 w-full h-0.5 bg-gray-100 z-0" />

                    {steps.map((step, index) => (
                        <div key={index} className="relative z-10 text-center bg-white p-6">
                            <div className="w-20 h-20 mx-auto bg-white border-4 border-gray-50 rounded-full flex items-center justify-center mb-6 shadow-sm">
                                <step.icon className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">{step.title}</h3>
                            <p className="text-gray-600 leading-relaxed font-light">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProcessSection;
