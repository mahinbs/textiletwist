import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, Star, ShoppingCart, Truck, Shield, Loader2, Heart, MessageSquare } from 'lucide-react';
import { productsApi, cartApi, wishlistApi, reviewsApi, authApi, productSizesApi, productDetailsApi } from '../lib/api';

const ProductDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [addingToCart, setAddingToCart] = useState(false);
    const [inWishlist, setInWishlist] = useState(false);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [productSizes, setProductSizes] = useState<any[]>([]);
    const [loadingSizes, setLoadingSizes] = useState(false);
    const [productDetails, setProductDetails] = useState<any[]>([]);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [reviews, setReviews] = useState<any[]>([]);
    const [totalReviews, setTotalReviews] = useState(0);
    const [averageRating, setAverageRating] = useState(0);
    const [loadingReviews, setLoadingReviews] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);
    const [userReview, setUserReview] = useState<any>(null);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) return;
            setLoading(true);
            const response = await productsApi.getById(id);
            if (response.data) {
                const productData = response.data.product;
                setProduct(productData);
                
                // Fetch product sizes if sizes are enabled
                if (productData.sizes_enabled) {
                    setLoadingSizes(true);
                    const sizesResponse = await productSizesApi.getByProduct(id);
                    if (sizesResponse.data) {
                        setProductSizes(sizesResponse.data.sizes || []);
                        // Set first available size as selected
                        const availableSizes = sizesResponse.data.sizes.filter((s: any) => s.quantity > 0);
                        if (availableSizes.length > 0) {
                            setSelectedSize(availableSizes[0].size_name);
                        }
                    }
                    setLoadingSizes(false);
                } else {
                    setProductSizes([]);
                    setSelectedSize(null);
                }
                
                // Fetch product details
                setLoadingDetails(true);
                const detailsResponse = await productDetailsApi.getByProduct(id);
                if (detailsResponse.data) {
                    setProductDetails(detailsResponse.data.details || []);
                } else {
                    setProductDetails([]);
                }
                setLoadingDetails(false);
            }
            setLoading(false);
        };
        fetchProduct();
    }, [id]);

    useEffect(() => {
        const checkWishlist = async () => {
            if (!id) return;
            const response = await wishlistApi.check(id);
            if (response.data) {
                setInWishlist(response.data.inWishlist);
            }
        };
        checkWishlist();
    }, [id]);

    // Check if user is logged in
    useEffect(() => {
        const checkAuth = async () => {
            const response = await authApi.getCurrentUser();
            setIsLoggedIn(!!response.data?.user);
        };
        checkAuth();
    }, []);

    // Fetch reviews
    useEffect(() => {
        const fetchReviews = async () => {
            if (!id) return;
            setLoadingReviews(true);
            const response = await reviewsApi.getByProduct(id);
            if (response.data) {
                setReviews(response.data.reviews || []);
                setTotalReviews(response.data.totalReviews || 0);
                setAverageRating(response.data.averageRating || 0);
                
                // Check if user has already reviewed
                const authResponse = await authApi.getCurrentUser();
                if (authResponse.data && authResponse.data.user) {
                    const userReview = response.data.reviews.find((r: any) => r.user_id === authResponse.data!.user.id);
                    if (userReview) {
                        setUserReview(userReview);
                        setReviewRating(userReview.rating);
                        setReviewComment(userReview.comment || '');
                    }
                }
            }
            setLoadingReviews(false);
        };
        fetchReviews();
    }, [id]);

    const handleAddToCart = async () => {
        if (!product) return;
        
        // Check stock based on sizes
        if (product.sizes_enabled) {
            if (!selectedSize) {
                alert('Please select a size');
                return;
            }
            const selectedSizeData = productSizes.find(s => s.size_name === selectedSize);
            if (!selectedSizeData || selectedSizeData.quantity === 0) {
                alert('Selected size is out of stock');
                return;
            }
        } else {
            if (product.quantity === 0) {
                alert('Product is out of stock');
                return;
            }
        }
        
        setAddingToCart(true);
        const response = await cartApi.add(product.id, 1, selectedSize || undefined);
        if (response.error) {
            alert(response.error);
        } else {
            alert('Added to cart!');
        }
        setAddingToCart(false);
    };

    const handleAddToWishlist = async () => {
        if (!product) return;
        if (inWishlist) {
            const response = await wishlistApi.remove(product.id);
            if (!response.error) {
                setInWishlist(false);
            }
        } else {
            const response = await wishlistApi.add(product.id);
            if (!response.error) {
                setInWishlist(true);
            }
        }
    };

    const handleBuyNow = async () => {
        await handleAddToCart();
        navigate('/cart');
    };

    const handleSubmitReview = async () => {
        if (!id || !isLoggedIn) {
            alert('Please login to leave a review');
            navigate('/auth');
            return;
        }

        if (!reviewRating) {
            alert('Please select a rating');
            return;
        }

        setSubmittingReview(true);
        const response = await reviewsApi.create(id, reviewRating, reviewComment);
        if (response.error) {
            alert(response.error);
        } else {
            alert('Review submitted successfully!');
            setShowReviewForm(false);
            // Refresh reviews
            const reviewsResponse = await reviewsApi.getByProduct(id);
            if (reviewsResponse.data) {
                setReviews(reviewsResponse.data.reviews || []);
                setTotalReviews(reviewsResponse.data.totalReviews || 0);
                setAverageRating(reviewsResponse.data.averageRating || 0);
                const authResponse = await authApi.getCurrentUser();
                if (authResponse.data && authResponse.data.user) {
                    const userReview = reviewsResponse.data.reviews.find((r: any) => r.user_id === authResponse.data!.user.id);
                    if (userReview) {
                        setUserReview(userReview);
                    }
                }
            }
        }
        setSubmittingReview(false);
    };

    const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
        const sizeClass = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5';
        return (
            <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        className={`${sizeClass} ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                    />
                ))}
            </div>
        );
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    if (loading) {
        return (
            <div className="pt-24 pb-20 container mx-auto px-6 flex justify-center items-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="pt-24 pb-20 container mx-auto px-6">
                <Link to="/products" className="inline-flex items-center text-gray-600 hover:text-primary mb-8 transition-colors">
                    <ArrowLeft className="w-5 h-5 mr-2" /> Back to Collection
                </Link>
                <div className="text-center py-20">
                    <p className="text-xl text-gray-500">Product not found</p>
                </div>
            </div>
        );
    }

    const discountedPrice = product.price * (1 - (product.discount_percentage || 0) / 100);
    const hasDiscount = product.discount_percentage > 0;

    return (
        <div className="pt-24 pb-20 container mx-auto px-6">
            <Link to="/products" className="inline-flex items-center text-gray-600 hover:text-primary mb-8 transition-colors">
                <ArrowLeft className="w-5 h-5 mr-2" /> Back to Collection
            </Link>

            <div className="flex flex-col lg:flex-row gap-16 mb-20">
                <div className="lg:w-1/2">
                    <img
                        src={product.image_url || product.images?.[0] || "/images/bed-linen.png"}
                        alt={product.name}
                        className="w-full rounded-2xl shadow-xl hover:scale-[1.02] transition-transform duration-500"
                    />
                </div>
                <div className="lg:w-1/2">
                    <div className="mb-8">
                        <span className="text-secondary font-bold uppercase tracking-wider text-sm">
                            {product.category?.name || 'Uncategorized'}
                        </span>
                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mt-3 mb-4">{product.name}</h1>
                        <div className="flex items-center gap-2">
                            {loadingReviews ? (
                                <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                            ) : (
                                <>
                                    {renderStars(Math.round(averageRating))}
                                    <span className="text-gray-500 text-sm ml-2">
                                        {averageRating > 0 ? averageRating.toFixed(1) : '0.0'} ({totalReviews} {totalReviews === 1 ? 'Review' : 'Reviews'})
                                    </span>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="mb-6">
                        {hasDiscount ? (
                            <div className="flex items-center gap-4">
                                <p className="text-3xl font-bold text-gray-900">₹{Math.round(discountedPrice).toLocaleString()}</p>
                                <p className="text-xl text-gray-400 line-through">₹{product.price.toLocaleString()}</p>
                                <span className="bg-secondary text-primary px-3 py-1 rounded text-sm font-bold">
                                    {product.discount_percentage}% OFF
                                </span>
                            </div>
                        ) : (
                            <p className="text-3xl font-bold text-gray-900">₹{product.price.toLocaleString()}</p>
                        )}
                    </div>

                    {product.quantity === 0 && (
                        <p className="text-red-500 font-medium mb-4">Out of Stock</p>
                    )}

                    <p className="text-gray-600 leading-relaxed text-lg mb-8 border-l-4 border-secondary pl-4 bg-gray-50 py-2">
                        {product.description || 'No description available.'}
                    </p>

                    {/* Sizes - Only show if sizes are enabled */}
                    {product.sizes_enabled && (
                        <div className="mb-8">
                            <h3 className="font-bold text-gray-800 mb-3">Select Size</h3>
                            {loadingSizes ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                                    <span className="text-gray-500 text-sm">Loading sizes...</span>
                                </div>
                            ) : productSizes.length > 0 ? (
                                <div className="flex flex-wrap gap-3">
                                    {productSizes.map((size: any) => {
                                        const isOutOfStock = size.quantity === 0;
                                        const isSelected = selectedSize === size.size_name;
                                        return (
                                            <button
                                                key={size.id || size.size_name}
                                                onClick={() => !isOutOfStock && setSelectedSize(size.size_name)}
                                                disabled={isOutOfStock}
                                                className={`px-6 py-2 rounded-md border font-medium transition-all ${
                                                    isOutOfStock
                                                        ? 'border-gray-200 text-gray-300 cursor-not-allowed opacity-50'
                                                        : isSelected
                                                        ? 'border-secondary bg-secondary text-white shadow-md'
                                                        : 'border-gray-200 text-gray-600 hover:border-secondary hover:text-secondary'
                                                }`}
                                                title={isOutOfStock ? 'Out of stock' : `${size.quantity} available`}
                                            >
                                                {size.size_name}
                                                {!isOutOfStock && (
                                                    <span className="ml-2 text-xs opacity-75">({size.quantity})</span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-sm">No sizes available</p>
                            )}
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4 mb-10">
                        <button
                            onClick={handleAddToCart}
                            disabled={addingToCart || (product.sizes_enabled ? !selectedSize : product.quantity === 0)}
                            className="flex-1 bg-primary text-secondary py-4 font-bold text-lg rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl translate-y-0 hover:-translate-y-1 transform disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {addingToCart ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" /> Adding...
                                </>
                            ) : (
                                <>
                                    <ShoppingCart className="w-5 h-5" /> Add to Cart
                                </>
                            )}
                        </button>
                        <button
                            onClick={handleBuyNow}
                            disabled={product.quantity === 0}
                            className="flex-1 border-2 border-primary text-primary py-4 font-bold text-lg rounded-xl hover:bg-primary hover:text-secondary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Buy Now
                        </button>
                        <button
                            onClick={handleAddToWishlist}
                            className={`p-4 border-2 rounded-xl transition-all ${inWishlist
                                ? 'border-red-500 text-red-500 bg-red-50'
                                : 'border-gray-200 text-gray-600 hover:border-secondary hover:text-secondary'
                                }`}
                        >
                            <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
                        </button>
                    </div>

                    {/* Product Details - Dynamic */}
                    {productDetails.length > 0 && (
                        <div className="border-t border-gray-200 py-6 space-y-4">
                            <h3 className="font-bold text-xl text-primary font-serif">Product Details</h3>
                            {loadingDetails ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                                    <span className="text-gray-500 text-sm">Loading details...</span>
                                </div>
                            ) : (
                                <ul className="list-disc pl-5 text-gray-600 space-y-2">
                                    {productDetails.map((detail: any) => (
                                        <li key={detail.id || detail.heading}>
                                            <strong>{detail.heading}:</strong> {detail.value}
                                        </li>
                                    ))}
                                    <li><strong>Stock:</strong> {product.quantity} available</li>
                                </ul>
                            )}
                        </div>
                    )}

                    {/* Payment Details */}
                    {(product.shipping_info || product.return_policy) && (
                        <div className="border-t border-gray-200 py-6">
                            <h3 className="font-bold text-gray-800 mb-4">Payment & Delivery</h3>
                            <div className="flex gap-4 mb-4 grayscale opacity-70">
                                <div className="h-8 w-12 bg-gray-200 rounded flex items-center justify-center text-xs font-bold">VISA</div>
                                <div className="h-8 w-12 bg-gray-200 rounded flex items-center justify-center text-xs font-bold">MC</div>
                                <div className="h-8 w-12 bg-gray-200 rounded flex items-center justify-center text-xs font-bold">UPI</div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                                {product.shipping_info && (
                                    <div className="flex items-center gap-2">
                                        <Truck className="w-5 h-5 text-secondary" /> {product.shipping_info}
                                    </div>
                                )}
                                {product.return_policy && (
                                    <div className="flex items-center gap-2">
                                        <Shield className="w-5 h-5 text-secondary" /> {product.return_policy}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Reviews Section */}
            <div className="mt-20 border-t border-gray-200 pt-12">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-serif font-bold text-primary mb-2">Customer Reviews</h2>
                        {!loadingReviews && (
                            <p className="text-gray-600">
                                {totalReviews > 0 ? (
                                    <>
                                        {averageRating.toFixed(1)} out of 5 stars ({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})
                                    </>
                                ) : (
                                    'No reviews yet. Be the first to review!'
                                )}
                            </p>
                        )}
                    </div>
                    {isLoggedIn && !userReview ? (
                        <button
                            onClick={() => setShowReviewForm(!showReviewForm)}
                            className="px-6 py-3 bg-primary text-secondary font-bold rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                        >
                            <MessageSquare size={20} />
                            Write a Review
                        </button>
                    ) : !isLoggedIn ? (
                        <Link
                            to="/auth"
                            className="px-6 py-3 bg-primary text-secondary font-bold rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                        >
                            <MessageSquare size={20} />
                            Login to Write a Review
                        </Link>
                    ) : null}
                </div>

                {/* Review Form - Only show if logged in */}
                {isLoggedIn && showReviewForm && !userReview && (
                    <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-200">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Write Your Review</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Rating *</label>
                                <div className="flex items-center gap-2">
                                    {[1, 2, 3, 4, 5].map((rating) => (
                                        <button
                                            key={rating}
                                            type="button"
                                            onClick={() => isLoggedIn && setReviewRating(rating)}
                                            disabled={!isLoggedIn}
                                            className={`focus:outline-none ${!isLoggedIn ? 'cursor-not-allowed opacity-50' : ''}`}
                                        >
                                            <Star
                                                className={`w-8 h-8 transition-colors ${
                                                    rating <= reviewRating
                                                        ? 'fill-yellow-400 text-yellow-400'
                                                        : 'text-gray-300 hover:text-yellow-300'
                                                }`}
                                            />
                                        </button>
                                    ))}
                                    <span className="ml-2 text-sm text-gray-600">{reviewRating} out of 5</span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Comment (Optional)</label>
                                <textarea
                                    value={reviewComment}
                                    onChange={(e) => isLoggedIn && setReviewComment(e.target.value)}
                                    disabled={!isLoggedIn}
                                    rows={4}
                                    className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${!isLoggedIn ? 'cursor-not-allowed opacity-50' : ''}`}
                                    placeholder="Share your experience with this product..."
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={handleSubmitReview}
                                    disabled={submittingReview}
                                    className="px-6 py-2 bg-primary text-secondary font-bold rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {submittingReview ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        'Submit Review'
                                    )}
                                </button>
                                <button
                                    onClick={() => {
                                        setShowReviewForm(false);
                                        setReviewComment('');
                                        setReviewRating(5);
                                    }}
                                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* User's Existing Review */}
                {userReview && (
                    <div className="bg-blue-50 rounded-xl p-6 mb-8 border border-blue-200">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="font-bold text-gray-800 mb-1">Your Review</h3>
                                <div className="flex items-center gap-2 mb-2">
                                    {renderStars(userReview.rating)}
                                    <span className="text-sm text-gray-600">{formatDate(userReview.created_at)}</span>
                                </div>
                            </div>
                            <button
                                onClick={async () => {
                                    if (confirm('Are you sure you want to delete your review?')) {
                                        const response = await reviewsApi.delete(userReview.id);
                                        if (!response.error) {
                                            setUserReview(null);
                                            setReviewComment('');
                                            setReviewRating(5);
                                            // Refresh reviews
                                            const reviewsResponse = await reviewsApi.getByProduct(id!);
                                            if (reviewsResponse.data) {
                                                setReviews(reviewsResponse.data.reviews || []);
                                                setTotalReviews(reviewsResponse.data.totalReviews || 0);
                                                setAverageRating(reviewsResponse.data.averageRating || 0);
                                            }
                                        }
                                    }
                                }}
                                className="text-red-600 hover:text-red-700 text-sm"
                            >
                                Delete
                            </button>
                        </div>
                        {userReview.comment && (
                            <p className="text-gray-700">{userReview.comment}</p>
                        )}
                    </div>
                )}

                {/* Reviews List */}
                {loadingReviews ? (
                    <div className="text-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                    </div>
                ) : reviews.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>No reviews yet. Be the first to review this product!</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {reviews.map((review) => (
                            <div key={review.id} className="bg-white rounded-xl p-6 border border-gray-200">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-10 h-10 rounded-full bg-primary text-secondary flex items-center justify-center font-bold">
                                                {review.user?.full_name?.charAt(0).toUpperCase() || 'U'}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-800">
                                                    {review.user?.full_name || 'Anonymous User'}
                                                </p>
                                                <p className="text-xs text-gray-500">{formatDate(review.created_at)}</p>
                                            </div>
                                        </div>
                                        <div className="mb-2">
                                            {renderStars(review.rating, 'sm')}
                                        </div>
                                    </div>
                                </div>
                                {review.comment && (
                                    <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetailsPage;
