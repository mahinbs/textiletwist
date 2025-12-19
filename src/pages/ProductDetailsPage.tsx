import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, ShoppingCart, Truck, Shield } from 'lucide-react';

// Mock data (in a real app, fetch from API/Context)
const products = [
    { id: 1, name: "Royal Satin Bed Sheet", category: "Bed Sheets", price: "₹ 1,500", image: "/images/bed-linen.png", description: "Experience the ultimate luxury with our Royal Satin Bed Sheet. 400 Thread count, 100% Egyptian Cotton." },
    { id: 2, name: "Embroidered Cushion Cover", category: "Cushion Covers", price: "₹ 450", image: "/images/cushion.png", description: "Hand-embroidered cushion cover with intricate patterns. Adds a touch of elegance to any living room." },
    { id: 3, name: "Vintage Table Runner", category: "Table Linen", price: "₹ 890", image: "/images/table-linen.png", description: "Classic design with modern durability. Perfect for family gatherings." },
    { id: 4, name: "Cotton Duvet Set", category: "Bed Sheets", price: "₹ 2,200", image: "/images/bed-linen.png", description: "Complete bedding solution. Includes duvet cover and two pillowcases." },
    { id: 5, name: "Floral Table Cloth", category: "Table Linen", price: "₹ 1,200", image: "/images/table-linen.png", description: "Bring spring to your dining room. High quality print on premium cotton." },
    { id: 6, name: "Velvet Cushion Set", category: "Cushion Covers", price: "₹ 1,800", image: "/images/cushion.png", description: "Set of 3 luxury velvet cushions. Soft touch and deep colors." }
];

const ProductDetailsPage = () => {
    const { id } = useParams();
    const product = products.find(p => p.id === Number(id)) || {
        name: "Product Not Found",
        category: "N/A",
        price: "-",
        image: "https://placehold.co/600x600?text=No+Image",
        description: "The product you are looking for does not exist."
    };

    return (
        <div className="pt-24 pb-20 container mx-auto px-6">
            <Link to="/products" className="inline-flex items-center text-gray-600 hover:text-primary mb-8 transition-colors">
                <ArrowLeft className="w-5 h-5 mr-2" /> Back to Collection
            </Link>

            <div className="flex flex-col md:flex-row gap-12">
                <div className="md:w-1/2">
                    <img src={product.image} alt={product.name} className="w-full rounded-lg shadow-lg" />
                </div>
                <div className="md:w-1/2">
                    <div className="mb-6">
                        <span className="text-secondary font-bold uppercase tracking-wider">{product.category}</span>
                        <h1 className="text-4xl font-serif font-bold text-primary mt-2">{product.name}</h1>
                        <div className="flex items-center gap-2 mt-4 text-secondary">
                            <Star className="w-5 h-5 fill-current" />
                            <Star className="w-5 h-5 fill-current" />
                            <Star className="w-5 h-5 fill-current" />
                            <Star className="w-5 h-5 fill-current" />
                            <Star className="w-5 h-5 fill-current" />
                            <span className="text-gray-400 text-sm ml-2">(24 Reviews)</span>
                        </div>
                    </div>

                    <p className="text-3xl font-bold text-gray-800 mb-6">{product.price}</p>
                    <p className="text-gray-600 leading-relaxed mb-8">{product.description}</p>

                    <div className="flex gap-4 mb-10">
                        <button
                            onClick={() => alert(`Added ${product.name} to cart!`)}
                            className="flex-1 bg-primary text-secondary py-4 font-bold text-lg rounded-sm hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg"
                        >
                            <ShoppingCart className="w-5 h-5" /> Add to Cart
                        </button>
                        <button
                            onClick={() => alert('Proceeding to checkout...')}
                            className="flex-1 border-2 border-primary text-primary py-4 font-bold text-lg rounded-sm hover:bg-primary hover:text-secondary transition-all"
                        >
                            Buy Now
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                            <Truck className="w-5 h-5 text-secondary" /> Free Shipping
                        </div>
                        <div className="flex items-center gap-2">
                            <Shield className="w-5 h-5 text-secondary" /> Quality Guarantee
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsPage;
