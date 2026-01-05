import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { categoriesApi } from '../../lib/api';

const FeaturedCollections = () => {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true);
            // Fetch only featured categories, excluding Apparels
            const response = await categoriesApi.getAll({ featured: true });
            if (response.data) {
                // Filter out Apparels categories (Men, Women, Kids)
                const featured = response.data.categories
                    .filter((cat: any) => 
                        !cat.slug?.startsWith('apparels-') && 
                        cat.slug !== 'apparels' &&
                        cat.is_featured &&
                        cat.featured_order
                    )
                    .sort((a: any, b: any) => (a.featured_order || 0) - (b.featured_order || 0))
                    .slice(0, 3); // Max 3 categories
                
                setCategories(featured.map((cat: any) => ({
                    name: cat.name,
                    image: cat.image_url || '/images/bed-linen.png',
                    link: `/products?category=${cat.slug}`,
                })));
            }
            setLoading(false);
        };
        fetchCategories();
    }, []);

    // Fallback categories if API fails or returns empty
    const fallbackCategories = [
        { name: "Bed Linens", image: "/images/bed-linen.png", link: "/products?category=bed-sheets" },
        { name: "Table Aesthetics", image: "/images/table-linen.png", link: "/products?category=table-linen" },
        { name: "Luxury Cushions", image: "/images/cushion.png", link: "/products?category=cushion-covers" },
    ];

    const displayCategories = categories.length > 0 ? categories : fallbackCategories;

    return (
        <section className="py-32 bg-white">
            <div className="container mx-auto px-6">
                <div className="flex justify-between items-end mb-16">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">Curated Collections</h2>
                        <p className="text-gray-500 font-light">Designed for the discerning eye.</p>
                    </div>
                    <Link to="/products" className="hidden md:flex items-center gap-2 text-primary font-bold hover:text-secondary transition-colors">
                        View All Products <ArrowUpRight className="w-5 h-5" />
                    </Link>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {displayCategories.map((cat, index) => (
                            <motion.div
                                key={cat.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.6 }}
                                className="group relative h-[600px] overflow-hidden cursor-pointer"
                            >
                                <Link to={cat.link}>
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors z-10 duration-500" />
                                    <img
                                        src={cat.image}
                                        alt={cat.name}
                                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                    />
                                    <div className="absolute bottom-0 left-0 w-full p-10 z-20">
                                        <div className="border-t border-white/30 pt-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                            <h3 className="text-3xl font-serif text-white mb-2">{cat.name}</h3>
                                            <div className="flex items-center gap-2 text-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-4 group-hover:translate-y-0 delay-100">
                                                <span className="font-bold uppercase tracking-widest text-sm">Explore</span>
                                                <ArrowUpRight className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default FeaturedCollections;
