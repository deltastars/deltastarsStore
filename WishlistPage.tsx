
import React from 'react';
import { Product, Page } from '../types';
import { useI18n } from '../contexts/I18nContext';
import { ShoppingCartIcon, TrashIcon } from './icons/Icons';

interface WishlistPageProps {
  wishlist: Product[];
  removeFromWishlist: (productId: number) => void;
  addToCart: (product: Product) => void;
  setPage: (page: Page, productId?: number) => void;
}

export const WishlistPage: React.FC<WishlistPageProps> = ({ wishlist, removeFromWishlist, addToCart, setPage }) => {
  const { t, language, formatCurrency } = useI18n();

  const handleMoveToCart = (product: Product) => {
    addToCart(product);
    removeFromWishlist(product.id);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-extrabold text-center text-black mb-6">{t('wishlist.title')}</h1>
      {wishlist.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-black font-bold">{t('wishlist.empty')}</p>
          <button onClick={() => setPage('products')} className="mt-4 bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-light transition-colors">
            {t('home.hero.button')}
          </button>
        </div>
      ) : (
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map(product => (
            <div key={product.id} className="bg-white rounded-lg shadow-md p-4 flex flex-col items-start group transition-shadow hover:shadow-xl">
               <img 
                 src={product.image} 
                 alt={language === 'ar' ? product.name_ar : product.name_en} 
                 className="w-full h-40 object-cover rounded-md mb-4 cursor-pointer transform group-hover:scale-105 transition-transform" 
                 onClick={() => setPage('productDetail', product.id)} 
                 aria-label={`View details for ${language === 'ar' ? product.name_ar : product.name_en}`}
               />
                <h3 className="text-lg font-extrabold text-black flex-grow mb-2">{language === 'ar' ? product.name_ar : product.name_en}</h3>
                <p className="text-primary font-black text-xl">{formatCurrency(product.price)}</p>
                <div className="flex gap-2 mt-4 w-full">
                    <button 
                      onClick={() => handleMoveToCart(product)} 
                      className="flex-1 flex items-center justify-center gap-2 bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-light transition-colors text-sm"
                      aria-label={`${t('wishlist.moveToCart')} - ${language==='ar' ? product.name_ar : product.name_en}`}
                    >
                        <ShoppingCartIcon />
                        <span>{t('wishlist.moveToCart')}</span>
                    </button>
                    <button 
                      onClick={() => removeFromWishlist(product.id)} 
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                      aria-label={`${t('wishlist.remove')} - ${language==='ar' ? product.name_ar : product.name_en}`}
                    >
                        <TrashIcon />
                    </button>
                </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
