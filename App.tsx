
import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './lib/Header';
import { Footer } from './Footer';
import { Home } from './lib/Home';
import { ProductsPage } from './ProductsPage';
import { CartPage } from './CartPage';
import { LoginPage } from './LoginPage';
import { DashboardPage } from './DashboardPage';
import { VipLoginPage } from './VipLoginPage';
import { VipDashboardPage } from './VipDashboardPage';
import { LoadingSpinner } from './LoadingSpinner';
import { CartItem, Product, User, Page, ShowroomItem, Invoice, Payment, VipClient, VipTransaction, Review } from '../types';
import { I18nProvider, GeminiAiProvider, useI18n } from '../contexts/I18nContext';
import { ToastProvider, useToast } from '../contexts/ToastContext';
import { SettingsProvider, useSettings } from '../contexts/SettingsContext';
import { ToastContainer } from './ToastContainer';
import { mockProducts } from './products';
import { mockInvoices, mockPayments, mockVipClients, mockTransactions } from './accounting';
import { WhatsappIcon } from './lib/Icons';
import { ShowroomPage } from './ShowroomPage';
import { PasswordGuide } from './PasswordGuide';
import { WishlistPage } from './WishlistPage';
import { ProductDetailPage } from './ProductDetailPage';
import api, { ApiError } from './lib/api';
import { ErrorBoundary } from './ErrorBoundary';
import { AiAssistant } from './AiAssistant';
import { PrivacyPolicy } from './PrivacyPolicy';
import { TermsAndConditions } from './TermsAndConditions';
import { MusicPlayer } from './multimedia/MusicPlayer';
import { ImageZoomModal } from './lib/ImageZoomModal';


// --- LOCAL STORAGE HOOK ---
const useLocalStorage = <T,>(key: string, state: T) => {
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.error(`Failed to save ${key} to localStorage:`, error);
    }
  }, [key, state]);
};


const FloatingWhatsAppButton: React.FC = () => {
  const { language, t } = useI18n();
  const { settings } = useSettings();

  return (
    <a
      href={`https://wa.me/${settings.company.whatsappNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed bottom-6 ${language === 'ar' ? 'left-6' : 'right-6'} z-40 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-transform transform hover:scale-110`}
      aria-label={t('footer.whatsappUs')}
    >
      <WhatsappIcon />
    </a>
  );
};


function MainApp() {
  const [currentPage, setCurrentPage] = useState<Page>(() => {
    try {
      const savedPage = localStorage.getItem('delta-page');
      const validPages: Page[] = ['home', 'products', 'cart', 'login', 'dashboard', 'vipLogin', 'vipDashboard', 'wishlist', 'showroom', 'productDetail', 'privacy', 'terms'];
      if (savedPage && validPages.includes(savedPage as Page)) {
          return savedPage as Page;
      }
      return 'home';
    } catch (error) {
      return 'home';
    }
  });
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const savedCart = localStorage.getItem('delta-cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      return [];
    }
  });
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const savedWishlist = localStorage.getItem('delta-wishlist');
      return savedWishlist ? JSON.parse(savedWishlist) : [];
    } catch (error) {
      return [];
    }
  });

   const [browsingHistory, setBrowsingHistory] = useState<Product[]>(() => {
    try {
        const saved = localStorage.getItem('delta-browsing-history');
        return saved ? JSON.parse(saved) : [];
    } catch (error) { 
        return []; 
    }
  });

  const [purchaseHistory, setPurchaseHistory] = useState<CartItem[]>(() => {
      try {
          const saved = localStorage.getItem('delta-purchase-history');
          return saved ? JSON.parse(saved) : [];
      } catch (error) { 
          return []; 
      }
  });

  const [showroomItems, setShowroomItems] = useState<ShowroomItem[]>(() => {
      try {
        const savedItems = localStorage.getItem('delta-showroom-items');
        if (!savedItems || JSON.parse(savedItems).length === 0) {
            return [
                { id: 'default-dates-1', title_ar: 'تشكيلة تمور فاخرة', title_en: 'Premium Dates Collection', description_ar: 'اكتشف مجموعتنا الواسعة من أجود أنواع التمور.', description_en: 'Discover our wide range of the finest dates.', image: 'https://i.imgur.com/kSjYp8x.jpeg' },
                { id: 'default-eid-2', title_ar: 'عيد مبارك!', title_en: 'Eid Mubarak!', description_ar: 'شركة نجوم دلتا تتمنى لكم عيداً سعيداً ومباركاً.', description_en: 'Delta Stars wishes you a happy and blessed Eid.', image: 'https://i.imgur.com/yG2C5F4.jpeg' },
                { id: 'default-video-3', title_ar: 'جولة في مستودعاتنا', title_en: 'A Tour of Our Warehouses', description_ar: 'شاهد كيف نحافظ على جودة منتجاتنا.', description_en: 'See how we maintain the quality of our products.', image: 'https://i.imgur.com/uR25Q38.jpeg', videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4' }
            ];
        }
        return JSON.parse(savedItems);
      } catch (error) {
        return [];
      }
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const savedReviews = localStorage.getItem('delta-reviews');
      return savedReviews ? JSON.parse(savedReviews) : [
        { id: 'rev1', productId: 1, author: 'أحمد', rating: 5, comment: 'تفاح ممتاز وطازج جداً!', date: new Date().toISOString() },
        { id: 'rev2', productId: 1, author: 'Sarah', rating: 4, comment: 'Very juicy and sweet.', date: new Date().toISOString() },
      ];
    } catch (error) {
      return [];
    }
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
     try {
      const savedUser = localStorage.getItem('delta-user');
      if (savedUser) return JSON.parse(savedUser);
      return null;
    } catch (error) {
      return null;
    }
  });
  const { language, t } = useI18n();
  const { settings } = useSettings();
  const { addToast } = useToast();

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUsingMockData, setIsUsingMockData] = useState<boolean>(false);
  const [showPasswordGuide, setShowPasswordGuide] = useState(false);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);


  // --- ACCOUNTING STATE ---
    const [invoices, setInvoices] = useState<Invoice[]>(() => {
        try {
            const saved = localStorage.getItem('delta-invoices');
            return saved ? JSON.parse(saved) : mockInvoices;
        } catch (e) { return mockInvoices; }
    });
    const [payments, setPayments] = useState<Payment[]>(() => {
        try {
            const saved = localStorage.getItem('delta-payments');
            return saved ? JSON.parse(saved) : mockPayments;
        } catch (e) { return mockPayments; }
    });
    const [vipClients, setVipClients] = useState<VipClient[]>(() => {
        try {
            const saved = localStorage.getItem('delta-vip-clients');
            return saved ? JSON.parse(saved) : mockVipClients;
        } catch(e) { return mockVipClients; }
    });
     const [transactions, setTransactions] = useState<VipTransaction[]>(() => {
        try {
            const saved = localStorage.getItem('delta-transactions');
            return saved ? JSON.parse(saved) : mockTransactions;
        } catch(e) { return mockTransactions; }
    });

  // --- THEME STATE IS NOW HANDLED BY SettingsContext ---
   const handleThemeChange = (newTheme: any) => {
       // Legacy support if needed, but DashboardPage now updates SettingsContext directly
   };


  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  // SEO: Dynamic Page Title
  useEffect(() => {
    const pageTitles: Record<Page, string> = {
      home: t('header.home'),
      products: t('header.products'),
      cart: t('cart.title'),
      wishlist: t('wishlist.title'),
      showroom: t('showroom.title'),
      login: t('login.title'),
      vipLogin: t('vip.login.title'),
      dashboard: t('dashboard.title'),
      vipDashboard: t('vip.dashboard.title'),
      productDetail: t('productDetail.title'),
      privacy: t('legal.privacyPolicy.title'),
      terms: t('legal.termsConditions.title'),
    };
    const baseTitle = settings.company.name || t('header.storeName');
    document.title = pageTitles[currentPage] ? `${pageTitles[currentPage]} | ${baseTitle}` : baseTitle;
  }, [currentPage, t, settings.company.name]);

  // Robust state persistence
  useLocalStorage('delta-cart', cart);
  useLocalStorage('delta-wishlist', wishlist);
  useLocalStorage('delta-reviews', reviews);
  useLocalStorage('delta-showroom-items', showroomItems);
  useLocalStorage('delta-user', currentUser);
  useLocalStorage('delta-page', currentPage);
  useLocalStorage('delta-invoices', invoices);
  useLocalStorage('delta-payments', payments);
  useLocalStorage('delta-vip-clients', vipClients);
  useLocalStorage('delta-transactions', transactions);
  useLocalStorage('delta-browsing-history', browsingHistory);
  useLocalStorage('delta-purchase-history', purchaseHistory);
  

  const getProducts = useCallback(async () => {
      try {
        const data = await api.get('/products/');
        setProducts(prev => {
            if (JSON.stringify(prev) !== JSON.stringify(data)) {
                return data;
            }
            return prev;
        });
        setIsUsingMockData(false);
      } catch (error) {
        if (products.length === 0) {
             setProducts(mockProducts);
             setIsUsingMockData(true);
        }
      } finally {
        setIsLoading(false);
      }
    }, [products]);

  useEffect(() => {
    getProducts();
  }, []);

  // --- AUTOMATIC UPDATE SYSTEM ---
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent | Event) => {
       getProducts();
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [getProducts]);
  
  const addToHistory = useCallback((product: Product) => {
    setBrowsingHistory(prev => {
      const history = prev.filter(p => p.id !== product.id);
      return [product, ...history].slice(0, 10); 
    });
  }, []);

  const setPage = useCallback((page: Page, productId?: number) => {
    if (page === 'productDetail' && productId) {
        const product = products.find(p => p.id === productId);
        if (product) {
            addToHistory(product);
        }
        setSelectedProductId(productId);
    } else {
        setSelectedProductId(null);
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [products, addToHistory]);

  // Helper to extract user-friendly message from ApiError
  const getApiErrorMessage = useCallback((error: any, defaultMessage: string) => {
      if (error instanceof ApiError) {
          if (error.status === 0) {
              return t('errors.networkError');
          }
          if (error.status === 401) {
              return t('errors.unauthorized');
          }
          if (error.status === 403) {
              return t('errors.forbidden');
          }
          if (error.status >= 500) {
              return t('errors.unknownApiError');
          }
          // Use the message from api.ts which is formatted nicely for 400 errors
          return error.message || defaultMessage;
      }
      return defaultMessage;
  }, [t]);

  const handleAdminLogin = async (credentials: {email: string, password: string}): Promise<{success: boolean, error?: string}> => {
    try {
        const response = await api.post('/auth/token/', { username: credentials.email, password: credentials.password });
        localStorage.setItem('delta-auth-token', response.access);
        const user: User = { type: 'admin', email: credentials.email };
        setCurrentUser(user);
        setCurrentPage('dashboard');
        return { success: true };
    } catch (error: any) {
        const message = getApiErrorMessage(error, t('login.error'));
        return { success: false, error: message };
    }
  };
  
  const handleVipLogin = async (credentials: {phone: string, password: string}): Promise<{success: boolean, error?: string}> => {
     try {
        const response = await api.post('/auth/vip/token/', { phone: credentials.phone, password: credentials.password });
        localStorage.setItem('delta-auth-token', response.access);
        const user: User = { type: 'vip', phone: credentials.phone, name: response.name || 'VIP Client' };
        setCurrentUser(user);
        setCurrentPage('vipDashboard');
        return { success: true };
    } catch (error: any) {
        const message = getApiErrorMessage(error, t('vip.login.error'));
        return { success: false, error: message };
    }
  };

  const handleLogout = useCallback(() => {
    if (window.confirm(t('auth.logoutConfirmation'))) {
        localStorage.removeItem('delta-auth-token');
        setCurrentUser(null);
        setCurrentPage('home');
    }
  }, [t]);

    const handleAdminPasswordChange = async (passwords: { current: string; new: string }): Promise<boolean> => {
        try {
            await api.post('/auth/admin/change-password/', { current_password: passwords.current, new_password: passwords.new });
            addToast(t('dashboard.security.changeSuccess'), 'success');
            return true;
        } catch (error: any) {
            const message = getApiErrorMessage(error, t('dashboard.security.changeError'));
            addToast(message, 'error');
            return false;
        }
    };

    const handleVipPasswordChange = async (passwords: { current: string; new: string }): Promise<boolean> => {
        if (currentUser?.type !== 'vip') return false;
        try {
            await api.post('/auth/vip/change-password/', { phone: currentUser.phone, current_password: passwords.current, new_password: passwords.new });
            addToast(t('dashboard.security.changeSuccess'), 'success');
            return true;
        } catch (error: any) {
            const message = getApiErrorMessage(error, t('dashboard.security.changeError'));
            addToast(message, 'error');
            return false;
        }
    };


  const addToCart = useCallback((product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  }, []);
  
  const updateQuantity = useCallback((productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);
  
  const addPurchaseHistory = useCallback((items: CartItem[]) => {
    setPurchaseHistory(prev => {
        const newHistory = [...prev];
        items.forEach(cartItem => {
            const existingItemIndex = newHistory.findIndex(item => item.id === cartItem.id);
            if (existingItemIndex > -1) {
                newHistory[existingItemIndex].quantity += cartItem.quantity;
            } else {
                newHistory.push({ ...cartItem });
            }
        });
        return newHistory.sort((a, b) => b.quantity - a.quantity).slice(0, 20);
    });
  }, []);


  const toggleWishlist = useCallback((product: Product) => {
    setWishlist((prev) => {
      if (prev.some((item) => item.id === product.id)) {
        return prev.filter((item) => item.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  }, []);

  const removeFromWishlist = useCallback((productId: number) => {
    setWishlist((prev) => prev.filter((item) => item.id !== productId));
  }, []);

  const isProductInWishlist = useCallback((productId: number): boolean => {
    return wishlist.some(item => item.id === productId);
  }, [wishlist]);

  const handleAddReview = (newReview: Omit<Review, 'id' | 'date'>) => {
      setReviews(prev => [
          ...prev, 
          { ...newReview, id: `rev-${Date.now()}`, date: new Date().toISOString() }
      ]);
  };

  const getAverageRating = useCallback((productId: number) => {
      const productReviews = reviews.filter(r => r.productId === productId);
      if (productReviews.length === 0) return { average: 0, count: 0 };
      const totalRating = productReviews.reduce((sum, r) => sum + r.rating, 0);
      return {
          average: totalRating / productReviews.length,
          count: productReviews.length
      };
  }, [reviews]);


  const handleSetShowroomItems = useCallback((items: ShowroomItem[]) => {
    setShowroomItems(items);
  }, []);

  const handleAddProduct = async (newProductData: Omit<Product, 'id'>): Promise<Product | null> => {
    try {
        const newProduct = await api.post('/products/', newProductData);
        setProducts(currentProducts => [...currentProducts, newProduct].sort((a,b) => a.id - b.id));
        addToast(t('dashboard.products.addSuccess'), 'success');
        return newProduct;
    } catch (error) {
        const message = getApiErrorMessage(error, t('dashboard.products.addError'));
        addToast(message, 'error');
        return null;
    }
  };

  const handleUpdateProduct = async (updatedProduct: Product): Promise<Product | null> => {
      try {
        const changedProduct = await api.put(`/products/${updatedProduct.id}/`, updatedProduct);
        setProducts(currentProducts =>
              currentProducts.map(p => p.id === changedProduct.id ? changedProduct : p)
        );
        addToast(t('dashboard.products.updateSuccess'), 'success');
        return changedProduct;
      } catch (error) {
        const message = getApiErrorMessage(error, t('dashboard.products.updateError'));
        addToast(message, 'error');
        return null;
      }
  };

  const handleDeleteProduct = async (productId: number): Promise<boolean> => {
      try {
        await api.delete(`/products/${productId}/`);
        setProducts(currentProducts => currentProducts.filter(p => p.id !== productId));
        addToast(t('dashboard.products.deleteSuccess'), 'success');
        return true;
      } catch(error) {
        const message = getApiErrorMessage(error, t('dashboard.products.deleteError'));
        addToast(message, 'error');
        return false;
      }
  };
  
  const handleSeedDatabase = async () => {
    addToast("This functionality is disabled in production mode.", 'info');
  };
  
    const handleAddPayment = (payment: Payment) => {
        setPayments(prev => [...prev, payment]);
        setInvoices(prev => prev.map(inv => inv.id === payment.invoiceId ? { ...inv, status: 'Paid', status_ar: 'مدفوع' } : inv));
        addToast(t('dashboard.accounts.payments.success'), 'success');
    };
    
    // --- VIP CLIENT HANDLERS ---
    const handleAddVipClient = (client: VipClient): Promise<VipClient> => {
        setVipClients(prev => [...prev, client].sort((a,b) => a.companyName.localeCompare(b.companyName)));
        addToast(t('dashboard.accounts.clients.addSuccess'), 'success');
        return Promise.resolve(client);
    };

    const handleUpdateVipClient = (updatedClient: VipClient): Promise<VipClient> => {
        setVipClients(prev => prev.map(c => c.id === updatedClient.id ? updatedClient : c));
        addToast(t('dashboard.accounts.clients.updateSuccess'), 'success');
        return Promise.resolve(updatedClient);
    };

    const handleDeleteVipClient = (clientId: string): Promise<boolean> => {
        setVipClients(prev => prev.filter(c => c.id !== clientId));
        addToast(t('dashboard.accounts.clients.deleteSuccess'), 'success');
        return Promise.resolve(true);
    };

    const handleZoom = useCallback((src: string) => {
        setZoomedImage(src);
    }, []);

    const renderPage = () => {
        const dashboardProps = { 
              user: currentUser, 
              products: products,
              onAddProduct: handleAddProduct,
              onUpdateProduct: handleUpdateProduct,
              onDeleteProduct: handleDeleteProduct,
              onThemeChange: handleThemeChange,
              currentTheme: { primaryColor: settings.company.primaryColor, heroImage: settings.company.heroImage }, // Passed but controlled by context now
              isUsingMockData: isUsingMockData,
              onSeedDatabase: handleSeedDatabase,
              showroomItems: showroomItems,
              onSetShowroomItems: handleSetShowroomItems,
              invoices: invoices,
              payments: payments,
              vipClients: vipClients,
              transactions: transactions,
              onAddPayment: handleAddPayment,
              onAddVipClient: handleAddVipClient,
              onUpdateVipClient: handleUpdateVipClient,
              onDeleteVipClient: handleDeleteVipClient,
              onShowPasswordGuide: () => setShowPasswordGuide(true),
              onAdminPasswordChange: handleAdminPasswordChange,
              setPage: setPage,
        };
        const vipDashboardProps = {
             user: currentUser, 
             onLogout: handleLogout, 
             products: products, 
             addToCart: addToCart, 
             toggleWishlist: toggleWishlist, 
             isProductInWishlist: isProductInWishlist, 
             invoices: invoices, 
             transactions: transactions,
             onVipPasswordChange: handleVipPasswordChange,
             setPage: setPage,
             onZoom: handleZoom
        };
        
        if (currentPage === 'dashboard' && currentUser?.type !== 'admin') {
            return <LoginPage onLogin={handleAdminLogin} setPage={setPage} />;
        }
        if (currentPage === 'vipDashboard' && currentUser?.type !== 'vip') {
            return <VipLoginPage onLogin={handleVipLogin} setPage={setPage} />;
        }
        
        if (currentPage === 'login' && currentUser?.type === 'admin') {
            return <DashboardPage {...dashboardProps} />;
        }
        if (currentPage === 'vipLogin' && currentUser?.type === 'vip') {
            return <VipDashboardPage {...vipDashboardProps} />;
        }
    
        if (currentPage === 'productDetail' && selectedProductId) {
            const product = products.find(p => p.id === selectedProductId);
            if (product) {
                return <ProductDetailPage 
                            product={product} 
                            setPage={setPage}
                            reviews={reviews.filter(r => r.productId === product.id)}
                            onAddReview={handleAddReview}
                            addToCart={addToCart}
                            averageRating={getAverageRating(product.id)}
                            onZoom={handleZoom}
                        />;
            }
        }
    
        switch (currentPage) {
            case 'home':
                return <Home setPage={setPage} addToCart={addToCart} products={products} heroImage={settings.company.heroImage} toggleWishlist={toggleWishlist} isProductInWishlist={isProductInWishlist} onZoom={handleZoom} />;
            case 'products':
                return <ProductsPage setPage={setPage} addToCart={addToCart} products={products} toggleWishlist={toggleWishlist} isProductInWishlist={isProductInWishlist} getAverageRating={getAverageRating} reviews={reviews} onZoom={handleZoom} />;
            case 'cart':
                return <CartPage cart={cart} removeFromCart={removeFromCart} updateQuantity={updateQuantity} clearCart={clearCart} setPage={setPage} addPurchaseHistory={addPurchaseHistory} />;
            case 'wishlist':
                return <WishlistPage wishlist={wishlist} removeFromWishlist={removeFromWishlist} addToCart={addToCart} setPage={setPage} />;
            case 'showroom':
                return <ShowroomPage items={showroomItems} showroomBanner={settings.company.showroomBanner} />;
            case 'login':
                return <LoginPage onLogin={handleAdminLogin} setPage={setPage} />;
            case 'vipLogin':
                return <VipLoginPage onLogin={handleVipLogin} setPage={setPage} />;
            case 'dashboard':
                return <DashboardPage {...dashboardProps} />;
            case 'vipDashboard':
                return <VipDashboardPage {...vipDashboardProps} />;
            case 'privacy':
                return <PrivacyPolicy setPage={setPage} />;
            case 'terms':
                return <TermsAndConditions setPage={setPage} />;
            default:
                return <Home setPage={setPage} addToCart={addToCart} products={products} heroImage={settings.company.heroImage} toggleWishlist={toggleWishlist} isProductInWishlist={isProductInWishlist} onZoom={handleZoom} />;
        }
    };
  
  const renderPageContent = () => {
    if (isLoading && products.length === 0) {
      return <LoadingSpinner />;
    }
    return renderPage();
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {showPasswordGuide && <PasswordGuide onClose={() => setShowPasswordGuide(false)} />}
      {zoomedImage && <ImageZoomModal src={zoomedImage} alt="Zoomed Product" onClose={() => setZoomedImage(null)} />}
      <Header 
        setPage={setPage} 
        cartItemCount={cart.reduce((sum, item) => sum + item.quantity, 0)} 
        wishlistItemCount={wishlist.length}
        user={currentUser}
        onLogout={handleLogout}
        onToggleAiAssistant={() => setIsAiAssistantOpen(!isAiAssistantOpen)}
        currentPage={currentPage}
        products={products}
        selectedProductId={selectedProductId}
      />
      <main className="flex-grow">
        {renderPageContent()}
      </main>
      <Footer setPage={setPage} />
      <FloatingWhatsAppButton />
      <MusicPlayer />
      {isAiAssistantOpen && <AiAssistant 
        products={products} 
        onClose={() => setIsAiAssistantOpen(false)}
        browsingHistory={browsingHistory}
        purchaseHistory={purchaseHistory}
      />}
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <I18nProvider>
        <SettingsProvider>
            <ToastProvider>
            <GeminiAiProvider>
                <MainApp />
                <ToastContainer />
            </GeminiAiProvider>
            </ToastProvider>
        </SettingsProvider>
      </I18nProvider>
    </ErrorBoundary>
  );
}

export default App;
