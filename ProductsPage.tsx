
import React, { useState, useMemo, useEffect } from 'react';
import { Product, Page, Review } from '../types';
import { ProductCard } from './ProductCard';
import { useI18n } from '../contexts/I18nContext';
import { StarIcon } from './lib/Icons';

interface ProductsPageProps {
  addToCart: (product: Product) => void;
  products: Product[];
  toggleWishlist: (product: Product) => void;
  isProductInWishlist: (productId: number) => boolean;
  setPage: (page: Page, productId?: number) => void;
  getAverageRating: (productId: number) => { average: number; count: number };
  reviews: Review[];
  onZoom?: (src: string) => void;
}

const ALL_CATEGORIES_KEY = 'all';
const PRODUCTS_PER_PAGE = 12;

const ReviewsModal: React.FC<{
  product: Product;
  reviews: Review[];
  onClose: () => void;
}> = ({ product, reviews, onClose }) => {
  const { t, language } = useI18n();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg relative max-h-[90vh]">
        <button onClick={onClose} className="absolute top-2 end-3 text-gray-400 hover:text-gray-800 text-3xl font-bold">&times;</button>
        <div className="p-6">
          <h2 className="text-2xl font-bold text-primary mb-4">{t('reviews.title')}</h2>
          <h3 className="text-xl font-bold text-black mb-6">{language === 'ar' ? product.name_ar : product.name_en}</h3>
          <div className="space-y-6 overflow-y-auto max-h-[60vh] pr-2">
            {reviews.length > 0 ? (
              reviews.map(review => (
                <div key={review.id} className="bg-gray-50 p-4 rounded-lg border-l-4 border-primary">
                  <div className="flex items-center mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon key={i} className="w-5 h-5" filled={i < review.rating} />
                      ))}
                    </div>
                    <h4 className="font-extrabold text-black ms-3">{review.author}</h4>
                  </div>
                  <p className="text-black font-semibold">{review.comment}</p>
                  <p className="text-xs text-gray-700 mt-2">{new Date(review.date).toLocaleDateString()}</p>
                </div>
              ))
            ) : (
              <p className="text-black text-center py-8 font-semibold">{t('reviews.noReviews')}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


export const ProductsPage: React.FC<ProductsPageProps> = ({ addToCart, products, toggleWishlist, isProductInWishlist, setPage, getAverageRating, reviews, onZoom }) => {
  const { t, language } = useI18n();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORIES_KEY);
  const [sortOption, setSortOption] = useState('default');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProductForReviews, setSelectedProductForReviews] = useState<Product | null>(null);
  
  const uniqueCategories = useMemo(() => {
    const categories = Array.from(new Set(products.map(p => p.category)));
    return [ALL_CATEGORIES_KEY, ...categories];
  }, [products]);

  const sortedAndFilteredProducts = useMemo(() => {
    const filtered = products.filter(product => {
      const matchesCategory = selectedCategory === ALL_CATEGORIES_KEY || product.category === selectedCategory;
      const productName = language === 'ar' ? product.name_ar : product.name_en;
      const matchesSearch = productName.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    const sortableProducts = [...filtered];

    switch (sortOption) {
      case 'priceAsc':
        sortableProducts.sort((a, b) => a.price - b.price);
        break;
      case 'priceDesc':
        sortableProducts.sort((a, b) => b.price - a.price);
        break;
      case 'nameAsc':
        sortableProducts.sort((a, b) => {
          const nameA = language === 'ar' ? a.name_ar : a.name_en;
          const nameB = language === 'ar' ? b.name_ar : b.name_en;
          return nameA.localeCompare(nameB);
        });
        break;
      case 'nameDesc':
        sortableProducts.sort((a, b) => {
          const nameA = language === 'ar' ? a.name_ar : a.name_en;
          const nameB = language === 'ar' ? b.name_ar : b.name_en;
          return nameB.localeCompare(nameA);
        });
        break;
      case 'ratingDesc':
        sortableProducts.sort((a, b) => {
            const ratingA = getAverageRating(a.id).average;
            const ratingB = getAverageRating(b.id).average;
            return ratingB - ratingA;
        });
        break;
      default:
        // 'filter' preserves the original sort order (by ID)
        break;
    }
    
    return sortableProducts;

  }, [searchTerm, selectedCategory, sortOption, language, products, getAverageRating]);

  // Effect to reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, sortOption]);

  // Pagination logic
  const totalPages = Math.ceil(sortedAndFilteredProducts.length / PRODUCTS_PER_PAGE);
  const indexOfLastProduct = currentPage * PRODUCTS_PER_PAGE;
  const indexOfFirstProduct = indexOfLastProduct - PRODUCTS_PER_PAGE;
  const currentProducts = sortedAndFilteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container mx-auto px-4 py-8">
       {selectedProductForReviews && (
            <ReviewsModal
                product={selectedProductForReviews}
                reviews={reviews.filter(r => r.productId === selectedProductForReviews.id)}
                onClose={() => setSelectedProductForReviews(null)}
            />
        )}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-black text-primary">{t('products.title')}</h1>
        <p className="text-lg text-black font-extrabold mt-2">{t('products.subtitle')}</p>
      </div>

      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder={t('products.searchPlaceholder')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-bold"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full md:flex-1 p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-primary focus:border-transparent font-bold"
        >
          {uniqueCategories.map(category => (
            <option key={category} value={category}>
                {category === ALL_CATEGORIES_KEY ? t('products.allCategories') : t(`categories.${category}`)}
            </option>
          ))}
        </select>
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="w-full md:flex-1 p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-primary focus:border-transparent font-bold"
          aria-label={t('products.sortBy')}
        >
          <option value="default">{t('products.sort.default')}</option>
          <option value="priceAsc">{t('products.sort.priceAsc')}</option>
          <option value="priceDesc">{t('products.sort.priceDesc')}</option>
          <option value="nameAsc">{t('products.sort.nameAsc')}</option>
          <option value="nameDesc">{t('products.sort.nameDesc')}</option>
          <option value="ratingDesc">{t('products.sort.ratingDesc')}</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {currentProducts.length > 0 ? (
          currentProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={addToCart}
              toggleWishlist={toggleWishlist}
              isInWishlist={isProductInWishlist(product.id)}
              setPage={setPage}
              rating={getAverageRating(product.id)}
              onViewReviews={() => setSelectedProductForReviews(product)}
              onZoom={onZoom}
            />
          ))
        ) : (
          <p className="col-span-full text-center text-black text-xl py-12 font-bold">
            {t('products.noResults')}
          </p>
        )}
      </div>
      
      {totalPages > 1 && (
        <nav aria-label="Product pagination" className="mt-12 flex justify-center items-center gap-2 flex-wrap">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 font-bold"
              aria-label={t('pagination.previous')}
            >
              {t('pagination.previous')}
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
              <button
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
                className={`px-4 py-2 border rounded-md transition-colors font-bold ${
                  currentPage === pageNumber
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-black border-gray-300 hover:bg-gray-100'
                }`}
                aria-current={currentPage === pageNumber ? 'page' : undefined}
              >
                {pageNumber}
              </button>
            ))}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 font-bold"
              aria-label={t('pagination.next')}
            >
              {t('pagination.next')}
            </button>
        </nav>
      )}

    </div>
  );
};
