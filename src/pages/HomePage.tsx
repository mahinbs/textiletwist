
import HeroParallax from '../components/home/HeroParallax';
import FabricShowcase from '../components/home/FabricShowcase';
import FeaturedCollections from '../components/home/FeaturedCollections';
import BrandMarquee from '../components/home/BrandMarquee';
import TestimonialSlider from '../components/home/TestimonialSlider';
import WhyChooseUs from '../components/home/WhyChooseUs';
import B2BCta from '../components/home/B2BCta';

const HomePage = () => {
    return (
        <div className="w-full bg-background overflow-hidden">
            <HeroParallax />
            <FabricShowcase />
            <FeaturedCollections />
            <BrandMarquee />
            <WhyChooseUs />
            <B2BCta />
            <TestimonialSlider />
        </div>
    );
};

export default HomePage;
