



import React, { useState } from 'react';
import { CartItem, Page } from '../types';
import { COMPANY_INFO } from '../constants';
import { TrashIcon } from './lib/Icons';
import { useI18n } from '../contexts/I18nContext';

interface CartPageProps {
  cart: CartItem[];
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, newQuantity: number) => void;
  clearCart: () => void;
  setPage: (page: Page) => void;
  addPurchaseHistory: (items: CartItem[]) => void;
}

export const CartPage: React.FC<CartPageProps> = ({ cart, removeFromCart, updateQuantity, clearCart, setPage, addPurchaseHistory }) => {
  const [checkoutStep, setCheckoutStep] = useState(false);
  const { t, language, formatCurrency } = useI18n();
  
  const [orderId, setOrderId] = useState('');
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleProceedToCheckout = () => {
      // Log the current cart as a "purchase" for personalization
      addPurchaseHistory(cart);

      // Generate a simple, unique-enough order ID for this session
      const newOrderId = `DS-${Date.now().toString().slice(-6)}`;
      setOrderId(newOrderId);
      setCheckoutStep(true);
  };


  if(checkoutStep) {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-black text-center text-primary mb-6">{t('cart.checkout.title')}</h1>
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto text-center text-black">
                <svg className="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <h2 className="text-2xl font-black mt-4 mb-2">{t('cart.checkout.successTitle')}</h2>
                <p className="mb-6 text-black font-extrabold">{t('cart.checkout.successSubtitle')}</p>
                
                <div className="text-right border-t pt-6">
                    <h3 className="text-xl font-black text-primary mb-4">{t('cart.checkout.codTitle')}</h3>
                    <div className="bg-gray-100 p-4 rounded-md mb-6 border border-gray-200">
                        <p className="font-black text-lg text-black">{t('cart.checkout.orderId')}: <span className="font-mono text-primary-dark">{orderId}</span></p>
                    </div>
                    
                    <a href={`https://wa.me/${COMPANY_INFO.whatsapp}?text=${encodeURIComponent(t('cart.checkout.whatsappConfirmationMessage', { orderId: orderId, formattedTotal: formatCurrency(subtotal) }))}`} target="_blank" rel="noopener noreferrer" className="block w-full text-center bg-green-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-600 transition-colors mb-6">
                       {t('cart.checkout.whatsappConfirmation')}
                    </a>
                    
                    <p className="mb-6 text-black font-extrabold">{t('cart.checkout.codDesc')}</p>

                    <h3 className="text-xl font-black text-primary mb-4">{t('cart.checkout.transferTitle')}</h3>
                    <p className="mb-2 text-black font-extrabold">{t('cart.checkout.transferDesc1')} <strong className="text-primary-dark">{formatCurrency(subtotal)}</strong> {t('cart.checkout.transferDesc2')}</p>
                    <div className="bg-gray-100 p-4 rounded-md space-y-2 my-4 border border-gray-200 text-black font-extrabold">
                        <p><strong>{t('cart.checkout.bankName')}:</strong> {language === 'ar' ? COMPANY_INFO.bank.name : COMPANY_INFO.bank.name_en}</p>
                        <p><strong>{t('cart.checkout.beneficiary')}:</strong> {language === 'ar' ? COMPANY_INFO.bank.account_name : COMPANY_INFO.bank.account_name_en}</p>
                        <p><strong>{t('cart.checkout.accountNumber')}:</strong> {COMPANY_INFO.bank.account_number}</p>
                        <p><strong>{t('cart.checkout.iban')}:</strong> {COMPANY_INFO.bank.iban}</p>
                    </div>
                    <p className="text-red-600 font-extrabold">{t('cart.checkout.note')} <a href={`https://wa.me/${COMPANY_INFO.whatsapp}`} target="_blank" rel="noopener noreferrer" className="font-black text-primary underline">{COMPANY_INFO.whatsapp}</a> {t('cart.checkout.note2')}</p>
                </div>

                <button onClick={() => { clearCart(); setCheckoutStep(false); setPage('home'); }} className="mt-8 w-full bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-light transition-colors">
                    {t('cart.checkout.backToStore')}
                </button>
            </div>
        </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-extrabold text-black">{t('cart.title')}</h1>
        {cart.length > 0 && (
          <button onClick={clearCart} className="text-sm font-bold text-red-600 hover:underline">
            {t('cart.clear')}
          </button>
        )}
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-black font-extrabold">{t('cart.empty')}</p>
          <button onClick={() => setPage('products')} className="mt-4 bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-light transition-colors">
            {t('cart.continueShopping')}
          </button>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <ul className="divide-y divide-gray-200">
            {cart.map((item) => (
              <li key={item.id} className="flex flex-col sm:flex-row items-center justify-between py-6 gap-4">
                <div className="flex items-center gap-4 w-full sm:w-auto flex-grow">
                    <img src={item.image} alt={language === 'ar' ? item.name_ar : item.name_en} className="w-24 h-24 object-cover rounded-lg bg-gray-100" />
                    <div className="flex-grow">
                        <h3 className="font-black text-xl text-black">{language === 'ar' ? item.name_ar : item.name_en}</h3>
                        <p className="text-gray-600 font-semibold">{formatCurrency(item.price)} / {language === 'ar' ? item.unit_ar : item.unit_en}</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                    {/* Quantity Adjuster */}
                    <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-3 py-1.5 text-xl font-bold text-gray-700 hover:bg-gray-100 rounded-s-lg focus:outline-none"
                            aria-label={`Decrease quantity of ${language === 'ar' ? item.name_ar : item.name_en}`}
                        >
                            -
                        </button>
                        <span className="px-4 py-1.5 font-bold text-center w-12 text-lg" aria-live="polite">
                            {item.quantity}
                        </span>
                        <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-3 py-1.5 text-xl font-bold text-gray-700 hover:bg-gray-100 rounded-e-lg focus:outline-none"
                            aria-label={`Increase quantity of ${language === 'ar' ? item.name_ar : item.name_en}`}
                        >
                            +
                        </button>
                    </div>
                    
                    {/* Subtotal */}
                    <p className="font-black text-lg w-28 text-right">{formatCurrency(item.price * item.quantity)}</p>

                    {/* Remove Button */}
                    <button 
                      onClick={() => removeFromCart(item.id)} 
                      className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50"
                      aria-label={`Remove ${language === 'ar' ? item.name_ar : item.name_en} from cart`}
                    >
                        <TrashIcon />
                    </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="border-t pt-6 mt-6 space-y-4">
            <div className="flex justify-end items-center">
                <div className="text-2xl font-black">
                    <span className="text-gray-600 me-4">{t('cart.total')}:</span>
                    <span className="text-primary">{formatCurrency(subtotal)}</span>
                </div>
            </div>
            <div className="flex flex-col-reverse sm:flex-row gap-4 justify-end">
                <button onClick={() => setPage('products')} className="bg-gray-200 text-black font-bold py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors">
                    {t('cart.continueShopping')}
                </button>
                <button onClick={handleProceedToCheckout} className="bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-light transition-colors">
                    {t('cart.checkoutButton')}
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};