
import React, { useState, useEffect } from 'react';
import { ShoppingCartIcon, UserIcon, MenuIcon, XIcon, LogoutIcon, LogoIcon, HeartIcon, SparklesIcon } from './Icons';
import { User, Page, Product } from '../../types';
import { useI18n, Currency } from '../../contexts/I18nContext';
import { useSettings } from '../../contexts/SettingsContext';

interface HeaderProps {
  setPage: (page: Page, productId?: number) => void;
  cartItemCount: number;
  wishlistItemCount: number;
  user: User | null;
  onLogout: () => void;
  onToggleAiAssistant: () => void;
  currentPage: Page;
  products: Product[];
  selectedProductId: number | null;
}

const DateDisplay = () => {
    const { language } = useI18n();
    const [dates, setDates] = useState({ gregorian: '', hijri: '' });

    useEffect(() => {
        const now = new Date();
        const gregorianFormatter = new Intl.DateTimeFormat(language === 'ar' ? 'ar-SA' : 'en-US', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
        });
        const hijriFormatter = new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
        });

        setDates({
            gregorian: gregorianFormatter.format(now),
            hijri: hijriFormatter.format(now),
        });
    }, [language]);

    return (
        <div className="text-center md:text-right text-xs text-white font-extrabold">
            {language === 'ar' ? <p>{dates.hijri}</p> : <p>{dates.gregorian}</p>}
        </div>
    );
}

const CurrencySwitcher: React.FC = () => {
    const { currency, setCurrency, t } = useI18n();
    const currencies: { code: Currency, label: string }[] = [
        { code: 'sar', label: 'SAR (ر.س)' },
        { code: 'usd', label: 'USD ($)' },
        { code: 'eur', label: 'EUR (€)' },
    ];
    
    return (
        <div className="relative">
            <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
                className="bg-primary text-white font-black border-2 border-transparent hover:border-white rounded-md p-2 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-secondary"
                aria-label={t('header.selectCurrency')}
            >
                {currencies.map(c => (
                    <option key={c.code} value={c.code} className="bg-primary-dark text-white font-bold">
                        {c.label}
                    </option>
                ))}
            </select>
        </div>
    )
}

export const Header: React.FC<HeaderProps> = ({ 
  setPage, 
  cartItemCount, 
  user, 
  onLogout, 
  wishlistItemCount, 
  onToggleAiAssistant,
  currentPage,
  products,
  selectedProductId
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t, language, setLanguage } = useI18n();
  const { settings } = useSettings();

  const toggleLanguage = () => {
    const newLang = language === 'ar' ? 'en' : 'ar';
    setLanguage(newLang);
  };
  
  const navLinkTranslations = t('header.navLinks', { returnObjects: true });
  
  const navLinks = [
    { label: navLinkTranslations.home, page: 'home' as const },
    { label: navLinkTranslations.products, page: 'products' as const },
    { label: navLinkTranslations.showroom, page: 'showroom' as const },
    { label: navLinkTranslations.wishlist, page: 'wishlist' as const },
    ...(user && user.type === 'admin' ? [{ label: navLinkTranslations.dashboard, page: 'dashboard' as const }] : []),
  ];

  const getBreadcrumbs = () => {
    const breadcrumbs = [{ label: t('header.home'), page: 'home' as Page, clickable: true }];

    switch (currentPage) {
      case 'products':
        breadcrumbs.push({ label: t('header.products'), page: 'products' as Page, clickable: false });
        break;
      case 'productDetail':
        breadcrumbs.push({ label: t('header.products'), page: 'products' as Page, clickable: true });
        if (selectedProductId) {
            const product = products.find(p => p.id === selectedProductId);
            if (product) {
                const name = language === 'ar' ? product.name_ar : product.name_en;
                breadcrumbs.push({ label: name, page: 'productDetail' as Page, clickable: false });
            }
        }
        break;
      case 'cart':
        breadcrumbs.push({ label: t('cart.title'), page: 'cart' as Page, clickable: false });
        break;
      case 'wishlist':
        breadcrumbs.push({ label: t('wishlist.title'), page: 'wishlist' as Page, clickable: false });
        break;
      case 'showroom':
        breadcrumbs.push({ label: t('showroom.title'), page: 'showroom' as Page, clickable: false });
        break;
      case 'login':
        breadcrumbs.push({ label: t('login.title'), page: 'login' as Page, clickable: false });
        break;
      case 'dashboard':
        breadcrumbs.push({ label: t('dashboard.title'), page: 'dashboard' as Page, clickable: false });
        break;
      case 'vipLogin':
         breadcrumbs.push({ label: t('vip.login.title'), page: 'vipLogin' as Page, clickable: false });
         break;
      case 'vipDashboard':
         breadcrumbs.push({ label: t('vip.dashboard.title'), page: 'vipDashboard' as Page, clickable: false });
         break;
      case 'privacy':
        breadcrumbs.push({ label: t('footer.privacy'), page: 'privacy' as Page, clickable: false });
        break;
      case 'terms':
        breadcrumbs.push({ label: t('footer.terms'), page: 'terms' as Page, clickable: false });
        break;
    }
    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="bg-primary shadow-lg sticky top-0 z-50">
      <div className="bg-primary-dark py-2">
         <div className="container mx-auto px-4 flex justify-between items-center">
            <DateDisplay />
            <div className="text-sm text-white font-extrabold">{settings.company.name || t('header.storeTitle')}</div>
         </div>
      </div>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-2">
          <div className="flex items-center" dir="ltr">
            <button onClick={() => setPage('home')} className="flex items-center gap-3">
              <img src={settings.company.logoUrl} alt="Logo" className="w-14 h-14 object-contain" />
              <h1 className="text-white text-3xl font-black hidden sm:block">{settings.company.name}</h1>
            </button>
          </div>

          <nav className="hidden lg:flex items-center space-x-6">
            {navLinks.map(link => (
                <button 
                  key={link.page} 
                  onClick={() => setPage(link.page)} 
                  className={`hover:text-secondary transition-colors duration-200 text-lg font-black ${currentPage === link.page ? 'text-secondary border-b-4 border-secondary' : 'text-white'}`}
                >
                  {link.label}
                </button>
            ))}
          </nav>

          <div className="flex items-center space-x-4" dir="ltr">
            <CurrencySwitcher />
            <button onClick={toggleLanguage} className="text-white hover:text-secondary transition-colors font-black px-2 py-1 rounded-md border-2 border-transparent hover:border-white">
              {language === 'ar' ? 'EN' : 'AR'}
            </button>
             <button onClick={onToggleAiAssistant} className="text-white hover:text-secondary transition-colors" title={t('aiAssistant.open')}>
              <SparklesIcon className="w-6 h-6" />
            </button>
            {user ? (
              <button onClick={onLogout} className="text-white hover:text-secondary transition-colors" title={t('header.logout')}>
                <LogoutIcon />
              </button>
            ) : (
              <button onClick={() => setPage('login')} className="text-white hover:text-secondary transition-colors" title={t('header.login')}>
                <UserIcon />
              </button>
            )}
            <button onClick={() => setPage('wishlist')} className="relative text-white hover:text-secondary transition-colors" title={t('header.wishlist')}>
              <HeartIcon filled={wishlistItemCount > 0} className="w-6 h-6" />
              {wishlistItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs font-black rounded-full h-5 w-5 flex items-center justify-center">
                  {wishlistItemCount}
                </span>
              )}
            </button>
            <button onClick={() => setPage('cart')} className="relative text-white hover:text-secondary transition-colors">
              <ShoppingCartIcon />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs font-black rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
            <button className="lg:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <XIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>
       {isMenuOpen && (
        <div className="lg:hidden bg-primary-dark">
          <nav className="flex flex-col items-center py-4">
             {navLinks.map(link => (
                <button 
                  key={link.page} 
                  onClick={() => { setPage(link.page); setIsMenuOpen(false); }} 
                  className="text-white py-2 w-full text-center hover:bg-primary-light transition-colors duration-200 font-black"
                >
                  {link.label}
                </button>
            ))}
          </nav>
        </div>
      )}
      
      {currentPage !== 'home' && (
         <div className="bg-gray-100 py-2 shadow-inner border-t border-gray-200">
            <div className="container mx-auto px-4">
                <nav className="flex" aria-label="Breadcrumb">
                    <ol className="inline-flex items-center space-x-1 md:space-x-3 rtl:space-x-reverse flex-wrap">
                        {breadcrumbs.map((crumb, index) => (
                            <li key={index} className="inline-flex items-center">
                                {index > 0 && (
                                     <svg className="w-3 h-3 text-gray-600 mx-1 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                                    </svg>
                                )}
                                {crumb.clickable ? (
                                    <button onClick={() => setPage(crumb.page)} className="inline-flex items-center text-sm font-extrabold text-gray-700 hover:text-primary">
                                        {crumb.label}
                                    </button>
                                ) : (
                                    <span className="ml-1 text-sm font-extrabold text-gray-600 md:ml-2 truncate max-w-[150px] md:max-w-none">{crumb.label}</span>
                                )}
                            </li>
                        ))}
                    </ol>
                </nav>
            </div>
        </div>
      )}
    </header>
  );
};
