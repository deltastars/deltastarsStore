
import React, { useState } from 'react';
import { Product, Page, Review } from '../types';
import { useI18n } from '../contexts/I18nContext';
import { useToast } from '../contexts/ToastContext';
import { StarIcon, ShoppingCartIcon } from './lib/Icons';

interface ProductDetailPageProps {
    product: Product;
    setPage: (page: Page) => void;
    reviews: Review[];
    onAddReview: (review: Omit<Review, 'id' | 'date'>) => void;
    addToCart: (product: Product) => void;
    averageRating: { average: number; count: number };
    onZoom?: (src: string) => void;
}

const StarRatingInput: React.FC<{ rating: number, setRating: (rating: number) => void }> = ({ rating, setRating }) => {
    const [hoverRating, setHoverRating] = useState(0);
    return (
        <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    className="focus:outline-none"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                >
                    <StarIcon
                        className="w-8 h-8 cursor-pointer"
                        filled={(hoverRating || rating) >= star}
                    />
                </button>
            ))}
        </div>
    );
};

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ product, setPage, reviews, onAddReview, addToCart, averageRating, onZoom }) => {
    const { t, language, formatCurrency } = useI18n();
    const { addToast } = useToast();
    const [author, setAuthor] = useState('');
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [error, setError] = useState('');

    const handleSubmitReview = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!author || rating === 0) {
            setError(t('reviews.formError'));
            return;
        }
        onAddReview({ productId: product.id, author, rating, comment });
        addToast(t('reviews.formSuccess'), 'success');
        setAuthor('');
        setRating(0);
        setComment('');
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <button onClick={() => setPage('products')} className="mb-6 text-primary font-black hover:underline">
                &larr; {t('productDetail.backToProducts')}
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                {/* Product Image */}
                <div className="relative group cursor-zoom-in" onClick={() => onZoom && onZoom(product.image)}>
                    <img 
                        src={product.image} 
                        alt={language === 'ar' ? product.name_ar : product.name_en} 
                        className="w-full rounded-lg shadow-lg object-cover transition-transform duration-300" 
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity rounded-lg flex items-center justify-center pointer-events-none">
                        <span className="bg-white/80 text-black px-3 py-1 rounded-full text-sm font-black opacity-0 group-hover:opacity-100 transition-opacity">🔍 Zoom</span>
                    </div>
                </div>

                {/* Product Info */}
                <div className="text-black">
                    <h1 className="text-4xl font-black text-primary mb-4">{language === 'ar' ? product.name_ar : product.name_en}</h1>
                    
                    {averageRating.count > 0 && (
                        <div className="flex items-center gap-2 mb-4">
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <StarIcon key={i} className="w-5 h-5" filled={i < averageRating.average} />
                                ))}
                            </div>
                            <span className="text-black font-extrabold">{averageRating.average.toFixed(1)} {t('reviews.averageRating')}</span>
                            <span className="text-black font-bold">({t('reviews.reviewsCount', { count: averageRating.count })})</span>
                        </div>
                    )}
                    
                    <p className="text-lg font-extrabold mb-4">{language === 'ar' ? product.unit_ar : product.unit_en}</p>
                    <div className="text-3xl font-black text-primary mb-6">{formatCurrency(product.price)}</div>
                    
                    <button
                        onClick={() => addToCart(product)}
                        className="w-full flex items-center justify-center gap-3 bg-primary text-white font-black py-3 px-6 rounded-lg hover:bg-primary-light transition-colors text-lg"
                    >
                        <ShoppingCartIcon /> {t('product.addToCart')}
                    </button>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="mt-16">
                <h2 className="text-3xl font-black text-primary mb-8 border-b-2 border-secondary pb-2">{t('reviews.title')}</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Existing Reviews */}
                    <div className="space-y-6">
                        {reviews.length > 0 ? (
                            reviews.map(review => (
                                <div key={review.id} className="bg-white p-4 rounded-lg shadow border-l-4 border-primary">
                                    <div className="flex items-center mb-2">
                                        <div className="flex">
                                            {[...Array(5)].map((_, i) => (
                                                <StarIcon key={i} className="w-5 h-5" filled={i < review.rating} />
                                            ))}
                                        </div>
                                        <h4 className="font-black text-black ms-3">{review.author}</h4>
                                    </div>
                                    <p className="text-black font-extrabold">{review.comment}</p>
                                    <p className="text-xs text-gray-800 font-bold mt-2">{new Date(review.date).toLocaleDateString()}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-black font-extrabold">{t('reviews.noReviews')}</p>
                        )}
                    </div>
                    
                    {/* Leave a Review Form */}
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-2xl font-black text-black mb-4">{t('reviews.leaveReview')}</h3>
                        <form onSubmit={handleSubmitReview} className="space-y-4">
                            <div>
                                <label className="block text-black font-black mb-2">{t('reviews.yourName')}</label>
                                <input type="text" value={author} onChange={e => setAuthor(e.target.value)} className="w-full p-2 border rounded font-extrabold text-black" required />
                            </div>
                             <div>
                                <label className="block text-black font-black mb-2">{t('reviews.rating')}</label>
                                <StarRatingInput rating={rating} setRating={setRating} />
                            </div>
                             <div>
                                <label className="block text-black font-black mb-2">{t('reviews.comment')}</label>
                                <textarea value={comment} onChange={e => setComment(e.target.value)} rows={4} className="w-full p-2 border rounded font-extrabold text-black" />
                            </div>
                            {error && <p className="text-red-500 font-bold">{error}</p>}
                            <button type="submit" className="w-full bg-secondary text-white font-black py-3 px-6 rounded-lg hover:bg-opacity-90 transition-colors">
                                {t('reviews.submit')}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};
