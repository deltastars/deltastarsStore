
import React from 'react';
import { Product, Page } from '../types';
import { ShoppingCartIcon, HeartIcon, StarIcon } from './lib/Icons';
import { useI18n } from '../contexts/I18nContext';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: boolean;
  setPage: (page: Page, productId?: number) => void;
  rating?: { average: number; count: number };
  onViewReviews?: () => void;
  onZoom?: (src: string) => void;
}

// Using React.memo to prevent re-renders of all cards when only one changes or parent state updates
export const ProductCard: React.FC<ProductCardProps> = React.memo(({ product, onAddToCart, toggleWishlist, isInWishlist, setPage, rating, onViewReviews, onZoom }) => {
  const { t, language, formatCurrency } = useI18n();

  const productName = language === 'ar' ? product.name_ar : product.name_en;
  const productUnit = language === 'ar' ? product.unit_ar : product.unit_en;
  
  const handleCardClick = () => {
    setPage('productDetail', product.id);
  };

  const handleImageClick = (e: React.MouseEvent) => {
      if (onZoom) {
          e.stopPropagation();
          onZoom(product.image);
      } else {
          handleCardClick();
      }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col group">
      <div className="relative overflow-hidden cursor-pointer" onClick={handleCardClick}>
        <img 
          src={product.image} 
          alt={productName} 
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300 bg-gray-100" 
          loading="lazy" // Lazy load for performance
          onClick={handleImageClick}
        />
        {product.original_price && (
           <div className="absolute top-2 left-2 bg-secondary text-white text-xs font-black px-2 py-1 rounded-md">
             {t('product.discount')}
           </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <span className="text-xs text-black font-black mb-1">{t(`categories.${product.category}`)}</span>
        <h3 className="text-lg font-black text-black mb-2 flex-grow cursor-pointer" onClick={handleCardClick}>{productName}</h3>
        
        {rating && rating.count > 0 && (
          <div 
            className="flex items-center gap-1 mb-2 cursor-pointer group/rating" 
            onClick={onViewReviews}
            title={t('reviews.view')}
          >
            {[...Array(5)].map((_, i) => (
              <StarIcon key={i} className="w-4 h-4" filled={i < rating.average} />
            ))}
            <span className="text-xs text-black font-bold group-hover/rating:underline">
              {t('reviews.reviewsCount', { count: rating.count })}
            </span>
          </div>
        )}
        
        <p className="text-base text-black font-extrabold mb-4">{productUnit}</p>
        
        <div className="flex justify-between items-center mt-auto">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-black text-primary">{formatCurrency(product.price)}</span>
            {product.original_price && (
              <span className="text-sm text-gray-800 line-through font-black">{formatCurrency(product.original_price)}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleWishlist(product)}
              className={`p-2 rounded-full transition-colors duration-200 ${
                isInWishlist ? 'text-red-500 bg-red-100' : 'text-gray-400 hover:text-red-500 hover:bg-red-100'
              }`}
              aria-label={isInWishlist ? t('product.removeFromWishlist') : t('product.addToWishlist')}
            >
              <HeartIcon filled={isInWishlist} />
            </button>
            <button 
              onClick={() => onAddToCart(product)}
              className="bg-primary text-white p-2 rounded-full hover:bg-primary-light transition-colors duration-200 shadow-sm hover:shadow-md"
              aria-label={`${t('product.addToCart')} ${productName}`}
            >
              <ShoppingCartIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});
