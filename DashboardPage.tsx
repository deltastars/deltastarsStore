
import React, { useState, useMemo } from 'react';
import { User, Product, ShowroomItem, Invoice, Payment, VipClient, VipTransaction, Page } from '../types';
import { useI18n } from '../contexts/I18nContext';
import { AccountsView } from './AccountsView';
import { DeveloperTools } from './dashboard/DeveloperTools';
import { OperationsView } from './dashboard/OperationsView';
import { SectionAuthModal } from './SectionAuthModal';
import { ShoppingCartIcon, UserIcon, StarIcon, SearchIcon, PlusIcon, TrashIcon, PencilIcon } from './lib/Icons';

export interface DashboardPageProps {
  user: User | null;
  products: Product[];
  onAddProduct: (product: Omit<Product, 'id'>) => Promise<Product | null>;
  onUpdateProduct: (product: Product) => Promise<Product | null>;
  onDeleteProduct: (productId: number) => Promise<boolean>;
  onThemeChange: (theme: { primaryColor: string; heroImage: string }) => void;
  currentTheme: { primaryColor: string; heroImage: string };
  isUsingMockData: boolean;
  onSeedDatabase: () => void;
  showroomItems: ShowroomItem[];
  onSetShowroomItems: (items: ShowroomItem[]) => void;
  invoices: Invoice[];
  payments: Payment[];
  vipClients: VipClient[];
  transactions: VipTransaction[];
  onAddPayment: (payment: Payment) => void;
  onAddVipClient: (client: VipClient) => Promise<VipClient>;
  onUpdateVipClient: (client: VipClient) => Promise<VipClient>;
  onDeleteVipClient: (clientId: string) => Promise<boolean>;
  onShowPasswordGuide: () => void;
  onAdminPasswordChange: (passwords: { current: string; new: string }) => Promise<boolean>;
  setPage: (page: Page) => void;
}

type View = 'menu' | 'products' | 'operations' | 'accounts' | 'developer' | 'gm.portal' | 'reports' | 'offers' | 'security';

// --- GM Portal Specific Sub-Component ---
const GeneralManagerPortal: React.FC<{
    invoices: Invoice[];
    products: Product[];
    vipClients: VipClient[];
    onNavigate: (view: View) => void;
}> = ({ invoices, products, vipClients, onNavigate }) => {
    const { t, formatCurrency } = useI18n();
    
    // Aggregated Stats
    const totalRevenue = invoices.reduce((sum, inv) => sum + inv.total, 0);
    const pendingRevenue = invoices.filter(i => i.status !== 'Paid').reduce((sum, inv) => sum + inv.total, 0);
    const lowStockCount = products.filter(p => p.stock_quantity < 20).length;
    const activeClients = vipClients.length;

    return (
        <div className="space-y-6">
             {/* Status Bar */}
             <div className="bg-gray-800 text-white p-4 rounded-lg shadow-md flex justify-between items-center border-b-4 border-gray-900">
                 <div className="flex gap-4">
                     <div className="text-center">
                         <p className="text-xs text-gray-400 font-bold">{t('dashboard.metrics.revenue')}</p>
                         <p className="text-xl font-black text-green-400">{formatCurrency(totalRevenue)}</p>
                     </div>
                     <div className="w-px bg-gray-600"></div>
                     <div className="text-center">
                         <p className="text-xs text-gray-400 font-bold">{t('dashboard.metrics.pendingInvoices')}</p>
                         <p className="text-xl font-black text-yellow-400">{formatCurrency(pendingRevenue)}</p>
                     </div>
                     <div className="w-px bg-gray-600"></div>
                     <div className="text-center">
                         <p className="text-xs text-gray-400 font-bold">{t('dashboard.metrics.lowStock')}</p>
                         <p className="text-xl font-black text-red-400">{lowStockCount}</p>
                     </div>
                 </div>
                 <div className="text-sm font-light">
                    {t('dashboard.systemStatus')}: <span className="text-green-400 font-black">{t('dashboard.online')}</span>
                 </div>
             </div>

             {/* Quick Links Grid */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <button onClick={() => onNavigate('reports')} className="bg-white p-6 rounded-lg border-2 border-gray-200 border-b-4 hover:border-blue-500 transition-all text-center group">
                     <div className="text-4xl mb-2 transform group-hover:scale-110 transition-transform">📈</div>
                     <h3 className="font-black text-lg text-gray-800">{t('dashboard.sections.reports.title')}</h3>
                     <p className="text-sm text-gray-500 font-bold">{t('dashboard.sections.reports.desc')}</p>
                 </button>
                 <button onClick={() => onNavigate('offers')} className="bg-white p-6 rounded-lg border-2 border-gray-200 border-b-4 hover:border-purple-500 transition-all text-center group">
                     <div className="text-4xl mb-2 transform group-hover:scale-110 transition-transform">🏷️</div>
                     <h3 className="font-black text-lg text-gray-800">{t('dashboard.sections.offers.title')}</h3>
                     <p className="text-sm text-gray-500 font-bold">{t('dashboard.sections.offers.desc')}</p>
                 </button>
                 <button onClick={() => onNavigate('security')} className="bg-white p-6 rounded-lg border-2 border-gray-200 border-b-4 hover:border-red-500 transition-all text-center group">
                     <div className="text-4xl mb-2 transform group-hover:scale-110 transition-transform">🛡️</div>
                     <h3 className="font-black text-lg text-gray-800">{t('dashboard.sections.security.title')}</h3>
                     <p className="text-sm text-gray-500 font-bold">{t('dashboard.sections.security.desc')}</p>
                 </button>
             </div>
        </div>
    );
};

// ... (ProductFormModal and ProductsManager)
// Included minimally to keep file valid, assuming existing components are preserved if not modified here, 
// but I need to return full file content.

const ProductFormModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    product?: Product | null;
    onSave: (p: any) => Promise<void>;
}> = ({ isOpen, onClose, product, onSave }) => {
    const { t } = useI18n();
    const [formData, setFormData] = useState<Partial<Product>>({});
    
    useMemo(() => {
        setFormData(product || { 
            name_ar: '', name_en: '', price: 0, category: 'fruits', 
            unit_ar: 'كيلو', unit_en: 'kg', stock_quantity: 0, image: '' 
        });
    }, [product, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSave(formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto border-4 border-green-700">
                <h2 className="text-2xl font-black text-green-800 mb-4">{product ? t('dashboard.products.editTitle') : t('dashboard.products.addTitle')}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <input className="border-2 border-gray-300 p-2 rounded w-full font-bold" placeholder="Name (Arabic)" value={formData.name_ar} onChange={e => setFormData({...formData, name_ar: e.target.value})} required />
                        <input className="border-2 border-gray-300 p-2 rounded w-full font-bold" placeholder="Name (English)" value={formData.name_en} onChange={e => setFormData({...formData, name_en: e.target.value})} required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <input className="border-2 border-gray-300 p-2 rounded w-full font-bold" type="number" placeholder="Price" value={formData.price} onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})} required />
                        <input className="border-2 border-gray-300 p-2 rounded w-full font-bold" type="number" placeholder="Original Price (Optional)" value={formData.original_price || ''} onChange={e => setFormData({...formData, original_price: parseFloat(e.target.value)})} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <select className="border-2 border-gray-300 p-2 rounded w-full bg-white font-bold" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as any})}>
                            <option value="fruits">{t('categories.fruits')}</option>
                            <option value="vegetables">{t('categories.vegetables')}</option>
                            <option value="dates">{t('categories.dates')}</option>
                            <option value="eggs">{t('categories.eggs')}</option>
                            <option value="herbs">{t('categories.herbs')}</option>
                            <option value="organic">{t('categories.organic')}</option>
                            <option value="seasonal">{t('categories.seasonal')}</option>
                        </select>
                        <input className="border-2 border-gray-300 p-2 rounded w-full font-bold" type="number" placeholder="Stock" value={formData.stock_quantity} onChange={e => setFormData({...formData, stock_quantity: parseInt(e.target.value)})} required />
                    </div>
                    <input className="border-2 border-gray-300 p-2 rounded w-full font-bold" placeholder="Image URL" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} required />
                     <div className="grid grid-cols-2 gap-4">
                        <input className="border-2 border-gray-300 p-2 rounded w-full font-bold" placeholder="Unit (AR)" value={formData.unit_ar} onChange={e => setFormData({...formData, unit_ar: e.target.value})} required />
                        <input className="border-2 border-gray-300 p-2 rounded w-full font-bold" placeholder="Unit (EN)" value={formData.unit_en} onChange={e => setFormData({...formData, unit_en: e.target.value})} required />
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 font-black text-black">{t('dashboard.products.cancel')}</button>
                        <button type="submit" className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800 font-black">{t('dashboard.products.save')}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const ProductsManager: React.FC<DashboardPageProps> = (props) => {
    const { t, language, formatCurrency } = useI18n();
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const filteredProducts = props.products.filter(p => 
        (language === 'ar' ? p.name_ar : p.name_en).toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSave = async (data: any) => {
        if (editingProduct) {
            await props.onUpdateProduct({ ...editingProduct, ...data });
        } else {
            await props.onAddProduct(data);
        }
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    return (
        <div className="bg-white rounded-lg shadow p-6 border-2 border-green-100">
            <ProductFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} product={editingProduct} onSave={handleSave} />
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black text-primary">{t('dashboard.products.title')}</h2>
                <div className="flex gap-4">
                    <button onClick={() => { setEditingProduct(null); setIsModalOpen(true); }} className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 font-bold shadow-md transition-transform hover:scale-105"><PlusIcon /> {t('dashboard.products.addNew')}</button>
                </div>
            </div>
            
            <div className="mb-4 relative">
                <input 
                    type="text" 
                    placeholder={t('dashboard.products.usingMockDataNotice.title') === 'Notice' ? 'Search...' : 'بحث...'} 
                    value={searchTerm} 
                    onChange={e => setSearchTerm(e.target.value)} 
                    className="w-full p-3 border-2 border-gray-300 rounded-lg pl-10 font-bold" 
                />
                <SearchIcon className="absolute top-4 left-3 text-gray-400 w-5 h-5" />
            </div>

            {props.isUsingMockData && (
                <div className="bg-yellow-50 border-l-8 border-yellow-400 p-4 mb-4 flex justify-between items-center">
                     <div className="text-yellow-800">
                         <p className="font-black text-lg">{t('dashboard.products.usingMockDataNotice.title')}</p>
                         <p className="text-sm font-bold">{t('dashboard.products.usingMockDataNotice.body')}</p>
                     </div>
                     <button onClick={props.onSeedDatabase} className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 shadow-md font-black">{t('dashboard.products.seedDatabaseButton')}</button>
                </div>
            )}

            <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full text-right border-collapse">
                    <thead>
                        <tr className="bg-green-50 text-green-900">
                            <th className="p-3 border-b border-green-100 font-black">{t('dashboard.accounts.invoices.item')}</th>
                            <th className="p-3 border-b border-green-100 font-black">{t('dashboard.reports.category')}</th>
                            <th className="p-3 border-b border-green-100 font-black">{t('dashboard.accounts.invoices.price')}</th>
                            <th className="p-3 border-b border-green-100 text-center font-black">{t('dashboard.operations.tabs.inventory')}</th>
                            <th className="p-3 border-b border-green-100 text-center font-black">{t('dashboard.accounts.invoices.actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map(p => (
                            <tr key={p.id} className="hover:bg-green-50 transition-colors">
                                <td className="p-3 border-b flex items-center gap-3">
                                    <img src={p.image} className="w-12 h-12 rounded-md object-cover border border-gray-200" />
                                    <span className="font-black text-gray-800">{language === 'ar' ? p.name_ar : p.name_en}</span>
                                </td>
                                <td className="p-3 border-b font-bold text-gray-600">{t(`categories.${p.category}`)}</td>
                                <td className="p-3 border-b font-black text-green-700">{formatCurrency(p.price)}</td>
                                <td className="p-3 border-b text-center">
                                    <span className={`px-3 py-1 rounded-full text-sm font-black ${p.stock_quantity < 20 ? 'bg-red-200 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                        {p.stock_quantity}
                                    </span>
                                </td>
                                <td className="p-3 border-b text-center">
                                    <div className="flex justify-center gap-2">
                                        <button onClick={() => { setEditingProduct(p); setIsModalOpen(true); }} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"><PencilIcon /></button>
                                        <button onClick={() => { if(window.confirm(t('dashboard.products.confirmDelete'))) props.onDeleteProduct(p.id); }} className="p-2 text-red-600 hover:bg-red-100 rounded-lg"><TrashIcon /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredProducts.length === 0 && <p className="text-center p-8 text-gray-500 font-bold">{t('dashboard.products.noProducts')}</p>}
            </div>
        </div>
    );
};

const SecurityView: React.FC<{ onBack: () => void, onAdminPasswordChange: (p: {current: string, new: string}) => Promise<boolean> }> = ({ onBack, onAdminPasswordChange }) => {
    const { t } = useI18n();
    const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwords.new !== passwords.confirm) return alert(t('auth.passwordMismatch'));
        await onAdminPasswordChange({ current: passwords.current, new: passwords.new });
        setPasswords({ current: '', new: '', confirm: '' });
    };
    return (
        <div className="bg-white rounded-lg shadow p-6 max-w-md mx-auto border-t-4 border-red-500">
            <button onClick={onBack} className="mb-4 text-gray-500 hover:text-primary font-bold">&larr; {t('dashboard.back')}</button>
            <h2 className="text-2xl font-black text-red-600 mb-6">{t('dashboard.sections.security.title')}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="password" placeholder={t('dashboard.security.currentPassword')} className="w-full p-3 border rounded font-bold" value={passwords.current} onChange={e => setPasswords({...passwords, current: e.target.value})} required />
                <input type="password" placeholder={t('auth.newPassword')} className="w-full p-3 border rounded font-bold" value={passwords.new} onChange={e => setPasswords({...passwords, new: e.target.value})} required />
                <input type="password" placeholder={t('auth.confirmPassword')} className="w-full p-3 border rounded font-bold" value={passwords.confirm} onChange={e => setPasswords({...passwords, confirm: e.target.value})} required />
                <button type="submit" className="w-full bg-red-600 text-white py-3 rounded font-black hover:bg-red-700 shadow-lg">{t('dashboard.security.changePasswordButton')}</button>
            </form>
        </div>
    );
};

const OffersManager: React.FC<{onBack: () => void}> = ({ onBack }) => {
    const { t } = useI18n();
    return <div className="bg-white p-6 rounded shadow border-t-4 border-purple-500"><button onClick={onBack} className="font-bold text-gray-500">&larr; {t('dashboard.back')}</button><h2 className="text-2xl font-black mt-4 text-purple-700">{t('dashboard.sections.offers.title')}</h2><p className="text-gray-500 mt-2 font-bold">Offers management module placeholder.</p></div>;
};
const ReportsView: React.FC<{onBack: () => void}> = ({ onBack }) => {
    const { t } = useI18n();
    return <div className="bg-white p-6 rounded shadow border-t-4 border-blue-500"><button onClick={onBack} className="font-bold text-gray-500">&larr; {t('dashboard.back')}</button><h2 className="text-2xl font-black mt-4 text-blue-700">{t('dashboard.sections.reports.title')}</h2><p className="text-gray-500 mt-2 font-bold">Advanced reporting module placeholder.</p></div>;
};

export const DashboardPage: React.FC<DashboardPageProps> = (props) => {
  const { t } = useI18n();
  const [currentView, setCurrentView] = useState<View>('menu');
  const [authSection, setAuthSection] = useState<'developer' | 'gm.portal' | 'accounts' | null>(null);
  const [unlockedSections, setUnlockedSections] = useState<string[]>([]);

  const handleNavigate = (view: View) => {
    if (view === 'developer' || view === 'gm.portal' || view === 'accounts') {
      if (unlockedSections.includes(view)) {
          setCurrentView(view);
      } else {
          setAuthSection(view);
      }
    } else {
      setCurrentView(view);
    }
  };

  const handleAuthSuccess = () => {
    if (authSection) {
      setUnlockedSections(prev => [...prev, authSection]);
      setCurrentView(authSection as View);
      setAuthSection(null);
    }
  };

  const renderView = () => {
    switch (currentView) {
      case 'products':
        return <div className="space-y-4">
            <button onClick={() => setCurrentView('menu')} className="text-gray-500 hover:text-primary font-black mb-4 block">&larr; {t('dashboard.back')}</button>
            <ProductsManager {...props} />
        </div>;
      case 'operations':
        return <OperationsView onBack={() => setCurrentView('menu')} products={props.products} onUpdateProduct={props.onUpdateProduct} />;
      case 'accounts':
        return <AccountsView onBack={() => setCurrentView('menu')} {...props} />;
      case 'developer':
        return <DeveloperTools 
                  onBack={() => setCurrentView('menu')} 
                  showroomItems={props.showroomItems} 
                  onUpdateShowroom={props.onSetShowroomItems} 
               />;
      case 'gm.portal':
        return (
            <div className="bg-white p-6 rounded-lg shadow border-t-4 border-primary">
                <button onClick={() => setCurrentView('menu')} className="mb-4 text-gray-500 hover:text-primary font-black">&larr; {t('dashboard.back')}</button>
                <h2 className="text-3xl font-black text-primary mb-6">{t('dashboard.sections.gm.portal.title')}</h2>
                <GeneralManagerPortal invoices={props.invoices} products={props.products} vipClients={props.vipClients} onNavigate={setCurrentView} />
            </div>
        );
      case 'security':
        return <SecurityView onBack={() => setCurrentView('menu')} onAdminPasswordChange={props.onAdminPasswordChange} />;
      case 'offers':
        return <OffersManager onBack={() => setCurrentView('menu')} />;
      case 'reports':
        return <ReportsView onBack={() => setCurrentView('menu')} />;
      default:
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                {[
                    { id: 'products', icon: '🍎' },
                    { id: 'operations', icon: '⚙️' },
                    { id: 'accounts', icon: '💰' },
                    { id: 'gm.portal', icon: '👔' },
                    { id: 'developer', icon: '👨‍💻' },
                    { id: 'security', icon: '🔒' }
                ].map(section => (
                    <button 
                        key={section.id} 
                        onClick={() => handleNavigate(section.id as View)}
                        className="
                            bg-green-700 
                            text-white 
                            p-8 
                            text-center 
                            transition-all 
                            duration-150 
                            transform 
                            border-b-8 border-r-8 border-green-900 
                            hover:border-b-0 hover:border-r-0 hover:border-t-8 hover:border-l-8 hover:bg-green-600
                            active:border-b-0 active:border-r-0 active:border-t-8 active:border-l-8 active:bg-green-700 active:translate-y-2
                            rounded-lg
                            group
                            relative
                            overflow-hidden
                            shadow-none
                        "
                        style={{
                            textShadow: 'none' // Explicitly requested no shadow
                        }}
                    >
                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                        <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-200 drop-shadow-none">{section.icon}</div>
                        <h3 className="text-2xl font-black mb-2 tracking-wide drop-shadow-none">{t(`dashboard.sections.${section.id}.title`)}</h3>
                        <p className="text-green-100 font-bold text-sm opacity-90 group-hover:opacity-100 drop-shadow-none">{t(`dashboard.sections.${section.id}.desc`)}</p>
                    </button>
                ))}
            </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
        {authSection && <SectionAuthModal section={authSection} onUnlock={handleAuthSuccess} onClose={() => setAuthSection(null)} />}
        <div className="container mx-auto">
            {currentView === 'menu' && (
                <div className="flex justify-between items-end mb-8 border-b-4 border-gray-300 pb-6">
                    <div>
                        <h1 className="text-5xl font-black text-green-800 drop-shadow-sm">{t('dashboard.title')}</h1>
                        <p className="text-gray-600 mt-2 text-xl font-bold" dangerouslySetInnerHTML={{ __html: t('dashboard.welcome', { email: props.user?.type === 'admin' ? props.user.email : 'Admin' }) }}></p>
                    </div>
                    <div className="flex gap-4">
                        <button onClick={props.onShowPasswordGuide} className="bg-yellow-400 text-yellow-900 px-6 py-3 rounded-lg font-black hover:bg-yellow-500 transition-colors shadow-md border-b-4 border-yellow-600 active:border-b-0 active:translate-y-1">🔑 {t('dashboard.passwordGuide')}</button>
                        <button onClick={() => handleNavigate('security')} className="bg-red-600 text-white px-6 py-3 rounded-lg font-black hover:bg-red-700 transition-colors shadow-md border-b-4 border-red-800 active:border-b-0 active:translate-y-1">🔒 {t('dashboard.sections.security.title')}</button>
                    </div>
                </div>
            )}
            {renderView()}
        </div>
    </div>
  );
};
