import { useRef } from 'react';
import { Swiper as SwiperComponent, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperType } from 'swiper';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const testimonials = [
    {
        name: "Elena Rossi",
        role: "Hotel Manager, Venice",
        text: "Textile Twist has completely transformed our guest experience. The durability of the 'Quality-Thread' cotton withstands industrial laundering while maintaining that premium silk-like feel. Outstanding quality."
    },
    {
        name: "David Chen",
        role: "Sourcing Director, LuxeHome",
        text: "We've been importing textiles for 15 years, and this is by far the most reliable partner we've worked with. Their commitment to sustainability combined with impeccable finish is rare."
    },
    {
        name: "Sarah Jenkins",
        role: "Interior Designer, London",
        text: "The customized table linens for our restaurant project were perfection. The gold embroidery was subtle yet incredibly luxurious. My clients were thrilled."
    },
    {
        name: "Marcus Thorne",
        role: "Boutique Owner, New York",
        text: "Finally, a supplier that understands 'luxury' isn't just a marketing term. The bed sheets fly off our shelves. The packaging, the touch, the weave—everything is top tier."
    }
];

const TestimonialSlider = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const prevRef = useRef<HTMLButtonElement>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const nextRef = useRef<HTMLButtonElement>(null);

    return (
        <section className="py-24 bg-background relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <span className="text-secondary font-bold tracking-widest uppercase text-sm">Testimonials</span>
                    <h2 className="text-4xl font-serif font-bold text-primary mt-2">Trusted by Global Brands</h2>
                </div>

                <div className="relative max-w-5xl mx-auto">
                    {/* Custom Navigation Buttons */}
                    <button
                        ref={prevRef}
                        className="absolute top-1/2 -left-12 z-20 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full border border-primary/20 text-primary hover:bg-primary hover:text-white transition-all duration-300 hidden md:flex"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        ref={nextRef}
                        className="absolute top-1/2 -right-12 z-20 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full border border-primary/20 text-primary hover:bg-primary hover:text-white transition-all duration-300 hidden md:flex"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>

                    <SwiperComponent
                        style={{
                            "--swiper-pagination-color": "#500000",
                            "--swiper-pagination-bullet-inactive-color": "#999999",
                            "--swiper-pagination-bullet-inactive-opacity": "0.5",
                        } as React.CSSProperties}
                        modules={[Autoplay, Navigation, Pagination]}
                        spaceBetween={30}
                        centeredSlides={true}
                        autoplay={{
                            delay: 5000,
                            disableOnInteraction: false,
                        }}
                        loop={true}
                        pagination={{
                            clickable: true,
                            dynamicBullets: true,
                        }}
                        navigation={{
                            prevEl: prevRef.current,
                            nextEl: nextRef.current,
                        }}
                        onBeforeInit={(swiper: SwiperType) => {
                            // @ts-expect-error swiper navigation params
                            swiper.params.navigation.prevEl = prevRef.current;
                            // @ts-expect-error swiper navigation params
                            swiper.params.navigation.nextEl = nextRef.current;
                        }}
                        breakpoints={{
                            640: { slidesPerView: 1 },
                            768: { slidesPerView: 1 },
                            1024: { slidesPerView: 1 },
                        }}
                        className="pb-12"
                    >
                        {testimonials.map((item, index) => (
                            <SwiperSlide key={index}>
                                <div className="bg-white p-10 md:p-14 rounded-xl shadow-lg border border-gray-100 text-center mx-4 md:mx-0 relative">
                                    <Quote className="w-12 h-12 text-secondary/20 mx-auto mb-6 fill-current" />
                                    <p className="text-xl md:text-2xl font-serif text-gray-700 leading-relaxed italic mb-8">
                                        "{item.text}"
                                    </p>
                                    <div className="flex flex-col items-center">
                                        <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-serif font-bold text-xl mb-3">
                                            {item.name.charAt(0)}
                                        </div>
                                        <h4 className="font-bold text-primary text-lg">{item.name}</h4>
                                        <p className="text-sm text-secondary uppercase tracking-wider font-medium">{item.role}</p>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </SwiperComponent>
                </div>
            </div>
        </section>
    );
};

export default TestimonialSlider;
