
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useI18n } from '../contexts/I18nContext';
import { useToast } from '../contexts/ToastContext';
import { User, VipOrder, Product, VipTransaction, VipOrderItem, Invoice, Page } from '../types';
import { ProductCard } from './ProductCard';
import { COMPANY_INFO } from '../constants';
import { PrintIcon, WhatsappIcon, EyeIcon, EyeOffIcon } from './lib/Icons';


// --- UTILS ---
const formatInvoiceForWhatsapp = (invoice: Invoice, t: Function, lang: string, formatCurrency: (price: number) => string): string => {
    let text = `*${t('vip.dashboard.orders.detailsTitle')} #${invoice.id}*\n\n`;
    text += `*${t('vip.dashboard.orders.date')}:* ${invoice.date}\n`;
    text += `*${t('vip.dashboard.orders.status')}:* ${lang === 'ar' ? invoice.status_ar : invoice.status}\n`;
    text += `*${t('vip.dashboard.orders.total')}:* ${formatCurrency(invoice.total)}\n\n`;
    text += `*${t('vip.dashboard.orders.items')}:*\n`;
    invoice.items.forEach(item => {
        text += `- ${lang === 'ar' ? item.name_ar : item.name_en}: ${item.quantity} x ${formatCurrency(item.price)}\n`;
    });
    return encodeURIComponent(text);
};

// --- VIEWS & COMPONENTS ---
type View = 'menu' | 'orders' | 'account' | 'offers' | 'quick-order' | 'financials' | 'trackOrder' | 'security';
interface ViewProps { onBack: () => void; }

const OrderDetailsModal: React.FC<{ invoice: Invoice, onClose: () => void }> = ({ invoice, onClose }) => {
    const { t, language, formatCurrency } = useI18n();
    const handlePrint = () => window.print();
    const handleShare = () => {
        const text = formatInvoiceForWhatsapp(invoice, t, language, formatCurrency);
        window.open(`https://wa.me/${COMPANY_INFO.whatsapp}?text=${text}`, '_blank');
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 print:p-0 print:bg-white">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto print:shadow-none print:max-h-full">
                <div className="p-6 relative printable-area">
                    <div className="no-print absolute top-4 end-4 flex gap-2">
                       <button onClick={onClose} className="text-gray-400 hover:text-gray-800 text-3xl font-bold">&times;</button>
                    </div>
                    <h2 className="text-2xl font-extrabold text-primary mb-4">{t('vip.dashboard.orders.detailsTitle')} #{invoice.id}</h2>
                    <div className="space-y-2 mb-4 text-black font-semibold">
                        <p><strong>{t('vip.dashboard.orders.date')}:</strong> {invoice.date}</p>
                        <p><strong>{t('vip.dashboard.orders.status')}:</strong> {language === 'ar' ? invoice.status_ar : invoice.status}</p>
                        <p><strong>{t('vip.dashboard.orders.total')}:</strong> {formatCurrency(invoice.total)}</p>
                    </div>
                    <h3 className="text-xl font-extrabold text-primary border-t pt-4 mb-2">{t('vip.dashboard.orders.items')}</h3>
                    <ul className="divide-y divide-gray-200">
                        {invoice.items.map(item => (
                            <li key={item.productId} className="py-2 flex justify-between items-center text-black font-semibold">
                                <span>{language === 'ar' ? item.name_ar : item.name_en}</span>
                                <span className="text-gray-800">{item.quantity} x {formatCurrency(item.price)}</span>
                            </li>
                        ))}
                    </ul>
                     <div className="mt-6 flex justify-end gap-3 no-print">
                        <button onClick={handlePrint} className="flex items-center gap-2 bg-gray-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-700"><PrintIcon /> {t('vip.dashboard.print')}</button>
                        <button onClick={handleShare} className="flex items-center gap-2 bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700"><WhatsappIcon /> {t('vip.dashboard.share')}</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const MyOrdersView: React.FC<ViewProps & { invoices: Invoice[], onSelectOrder: (invoice: Invoice) => void }> = ({ onBack, invoices, onSelectOrder }) => {
    const { t, language, formatCurrency } = useI18n();
    const getStatusClass = (status: Invoice['status']) => {
        switch (status) {
            case 'Paid': return 'bg-green-100 text-green-800';
            case 'Pending Payment': return 'bg-yellow-100 text-yellow-800';
            case 'Overdue': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800'
        }
    };
    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <button onClick={onBack} className="mb-4 bg-secondary text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 no-print">&larr; {t('dashboard.back')}</button>
            <h2 className="text-3xl font-extrabold text-primary mb-6">{t('vip.dashboard.orders.title')}</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-right text-black">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3 font-extrabold">{t('vip.dashboard.orders.id')}</th>
                            <th className="p-3 font-extrabold">{t('vip.dashboard.orders.date')}</th>
                            <th className="p-3 font-extrabold">{t('vip.dashboard.orders.status')}</th>
                            <th className="p-3 font-extrabold">{t('vip.dashboard.orders.total')}</th>
                            <th className="p-3 no-print"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoices.map(invoice => (
                            <tr key={invoice.id} className="border-b hover:bg-gray-50">
                                <td className="p-3 font-bold">{invoice.id}</td>
                                <td className="p-3 font-semibold">{invoice.date}</td>
                                <td className="p-3">
                                    <span className={`px-2 py-1 text-sm font-bold rounded-full ${getStatusClass(invoice.status)}`}>
                                        {language === 'ar' ? invoice.status_ar : invoice.status}
                                    </span>
                                </td>
                                <td className="p-3 font-bold">{formatCurrency(invoice.total)}</td>
                                <td className="p-3 no-print">
                                    <button onClick={() => onSelectOrder(invoice)} className="text-primary hover:underline font-bold">{t('vip.dashboard.view')}</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const OrderTrackingView: React.FC<ViewProps> = ({ onBack }) => {
    const { t, language } = useI18n();
    const [destination, setDestination] = useState<{ lat: number; lng: number } | null>(null);
    const [driverLocation, setDriverLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [status, setStatus] = useState<'loading' | 'tracking' | 'delivered' | 'error'>('loading');
    const [error, setError] = useState('');

    const warehouseLocation = { lat: 21.552439, lng: 39.2201384 };
    const intervalRef = useRef<number | null>(null);

    const lerp = (start: number, end: number, amt: number) => (1 - amt) * start + amt * end;

    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    useEffect(() => {
        if (!navigator.geolocation) {
            setStatus('error');
            setError(t('vip.dashboard.trackOrder.unavailable'));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                setDestination(userLocation);
                setDriverLocation(warehouseLocation);
                setStatus('tracking');
            },
            (err) => {
                setStatus('error');
                if (err.code === err.PERMISSION_DENIED) {
                    setError(t('vip.dashboard.trackOrder.permissionDenied'));
                } else {
                    setError(t('vip.dashboard.trackOrder.error'));
                }
            }
        );
    }, [t]);

    useEffect(() => {
        if (status === 'tracking' && destination) {
            const totalDuration = 30000; // 30 seconds simulation
            const intervalDuration = 2000; // Update every 2 seconds
            const startTime = Date.now();

            intervalRef.current = window.setInterval(() => {
                const elapsedTime = Date.now() - startTime;
                const progress = Math.min(elapsedTime / totalDuration, 1);

                const newLat = lerp(warehouseLocation.lat, destination.lat, progress);
                const newLng = lerp(warehouseLocation.lng, destination.lng, progress);
                setDriverLocation({ lat: newLat, lng: newLng });

                if (progress >= 1) {
                    setStatus('delivered');
                    if (intervalRef.current) clearInterval(intervalRef.current);
                }
            }, intervalDuration);
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [status, destination]);

    const renderContent = () => {
        switch (status) {
            case 'loading':
                return (
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-primary font-bold">{t('vip.dashboard.trackOrder.loading')}</p>
                    </div>
                );
            case 'error':
                return <p className="text-center text-red-600 font-extrabold">{error}</p>;
            case 'tracking':
            case 'delivered':
                if (driverLocation) {
                    const mapSrc = `https://maps.google.com/maps?q=${driverLocation.lat},${driverLocation.lng}&hl=${language || 'ar'}&z=14&output=embed`;
                    return (
                        <>
                            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden border-2 border-primary-light shadow-lg">
                                <iframe
                                    src={mapSrc}
                                    width="100%"
                                    height="450"
                                    style={{ border: 0 }}
                                    allowFullScreen={false}
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Order Location"
                                ></iframe>
                            </div>
                            <div className={`mt-4 border-l-4 p-4 rounded-md ${status === 'delivered' ? 'bg-green-100 border-green-500 text-green-800' : 'bg-blue-100 border-blue-500 text-blue-800'}`} role="alert">
                                <p className="font-extrabold">
                                    {status === 'delivered' ? t('vip.dashboard.trackOrder.delivered') : t('vip.dashboard.trackOrder.inProgress')}
                                </p>
                            </div>
                        </>
                    );
                }
                return null;
        }
    };
    
    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <button onClick={onBack} className="mb-4 bg-secondary text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90">&larr; {t('dashboard.back')}</button>
            <h2 className="text-3xl font-extrabold text-primary mb-6 text-center">{t('vip.dashboard.trackOrder.title')}</h2>
            {renderContent()}
        </div>
    );
};

const AccountDetailsView: React.FC<ViewProps & { user: User | null }> = ({ onBack, user }) => {
    const { t } = useI18n();
    const { addToast } = useToast();
    const [formData, setFormData] = useState({ contactPerson: 'مدير المشتريات', address: 'شارع الأمير سلطان، جدة' });
    if (user?.type !== 'vip') return null;
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleSubmit = (e: React.FormEvent) => { 
        e.preventDefault(); 
        addToast(t('vip.dashboard.account.saveSuccess'), 'success');
    };
    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <button onClick={onBack} className="mb-4 bg-secondary text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90">&larr; {t('dashboard.back')}</button>
            <h2 className="text-3xl font-extrabold text-primary mb-6">{t('vip.dashboard.account.title')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-black">
                <div className="space-y-4 font-semibold">
                    <h3 className="text-xl font-extrabold">{t('vip.dashboard.account.companyInfo')}</h3>
                    <p><strong>{t('vip.dashboard.account.companyName')}:</strong> {user.name}</p>
                    <p><strong>{t('vip.login.phone')}:</strong> {user.phone}</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                     <h3 className="text-xl font-extrabold">{t('vip.dashboard.account.editInfo')}</h3>
                     <div><label htmlFor="contactPerson" className="block font-bold mb-1">{t('vip.dashboard.account.contactPerson')}</label><input type="text" id="contactPerson" name="contactPerson" value={formData.contactPerson} onChange={handleChange} className="w-full p-2 border rounded font-semibold"/></div>
                     <div><label htmlFor="address" className="block font-bold mb-1">{t('vip.dashboard.account.address')}</label><input type="text" id="address" name="address" value={formData.address} onChange={handleChange} className="w-full p-2 border rounded font-semibold"/></div>
                     <button type="submit" className="w-full bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-light transition-colors">{t('dashboard.products.save')}</button>
                </form>
            </div>
        </div>
    );
};

const ExclusiveOffersView: React.FC<ViewProps & { offers: Product[], addToCart: (product: Product) => void, toggleWishlist: (p:Product)=>void, isProductInWishlist: (id:number)=>boolean, setPage: (page: Page, productId?: number) => void, onZoom?: (src: string) => void }> = ({ onBack, offers, addToCart, toggleWishlist, isProductInWishlist, setPage, onZoom }) => {
    const { t } = useI18n();
    return (
        <div>
            <button onClick={onBack} className="mb-4 bg-secondary text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90">&larr; {t('dashboard.back')}</button>
            <h2 className="text-3xl font-extrabold text-primary mb-6 text-center">{t('vip.dashboard.offers.title')}</h2>
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {offers.map(product => (
                    <ProductCard key={product.id} product={product} onAddToCart={addToCart} toggleWishlist={toggleWishlist} isInWishlist={isProductInWishlist(product.id)} setPage={setPage} onZoom={onZoom} />
                ))}
            </div>
        </div>
    );
};

const QuickOrderView: React.FC<ViewProps & { products: Product[], user: User | null }> = ({ onBack, products, user }) => {
    const { t, language } = useI18n();
    const { addToast } = useToast();
    const frequentItems = products.filter(p => [77, 62, 87, 7, 1, 91].includes(p.id));
    const [quantities, setQuantities] = useState<{[key: number]: number}>({});
    const handleQuantityChange = (productId: number, quantity: string) => {
        const num = parseInt(quantity, 10);
        setQuantities(prev => ({...prev, [productId]: isNaN(num) || num < 0 ? 0 : num}));
    };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addToast(t('vip.dashboard.quick-order.submitSuccess'), 'success');
        setQuantities({});
    };
    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <button onClick={onBack} className="mb-4 bg-secondary text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90">&larr; {t('dashboard.back')}</button>
            <h2 className="text-3xl font-extrabold text-primary mb-2">{t('vip.dashboard.quick-order.title')}</h2>
            <p className="text-black font-bold mb-6">{t('vip.dashboard.quick-order.desc')}</p>
            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    {frequentItems.map(item => (
                        <div key={item.id} className="flex flex-col sm:flex-row items-center justify-between p-3 border rounded-md hover:bg-gray-50">
                            <div className="flex items-center gap-4"><img src={item.image} alt="" className="w-12 h-12 object-cover rounded"/><span className="font-extrabold text-black">{language === 'ar' ? item.name_ar : item.name_en}</span></div>
                            <div className="flex items-center gap-2 mt-2 sm:mt-0"><label htmlFor={`qty-${item.id}`} className="text-sm font-bold text-black">{t('vip.dashboard.quick-order.quantity')}</label><input type="number" id={`qty-${item.id}`} min="0" value={quantities[item.id] || ''} onChange={e => handleQuantityChange(item.id, e.target.value)} className="w-24 p-2 border rounded text-center font-semibold"/><span className="text-sm text-black font-semibold">{language === 'ar' ? item.unit_ar : item.unit_en}</span></div>
                        </div>
                    ))}
                </div>
                <div className="mt-8 text-end"><button type="submit" className="bg-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-primary-light transition-colors">{t('vip.dashboard.quick-order.submitButton')}</button></div>
            </form>
        </div>
    );
};

const AccountStatementView: React.FC<ViewProps & {transactions: VipTransaction[]}> = ({ onBack, transactions }) => { 
    const { t, language, formatCurrency } = useI18n();
    const totalDebit = transactions.reduce((sum, t) => sum + t.debit, 0);
    const totalCredit = transactions.reduce((sum, t) => sum + t.credit, 0);
    const finalBalance = totalCredit - totalDebit;
    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <button onClick={onBack} className="mb-4 bg-secondary text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90">&larr; {t('dashboard.back')}</button>
            <h2 className="text-3xl font-extrabold text-primary mb-6">{t('vip.dashboard.financials.title')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-center"><div className="bg-red-50 p-4 rounded-lg"><h4 className="font-extrabold text-red-700">{t('vip.dashboard.financials.totalDebit')}</h4><p className="text-2xl font-extrabold text-red-600">{formatCurrency(totalDebit)}</p></div><div className="bg-green-50 p-4 rounded-lg"><h4 className="font-extrabold text-green-700">{t('vip.dashboard.financials.totalCredit')}</h4><p className="text-2xl font-extrabold text-green-600">{formatCurrency(totalCredit)}</p></div><div className={`p-4 rounded-lg ${finalBalance >= 0 ? 'bg-blue-50' : 'bg-orange-50'}`}><h4 className={`font-extrabold ${finalBalance >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>{t('vip.dashboard.financials.currentBalance')}</h4><p className={`text-2xl font-extrabold ${finalBalance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>{formatCurrency(finalBalance)}</p></div></div>
            <div className="overflow-x-auto"><table className="w-full text-right text-black"><thead className="bg-gray-100"><tr><th className="p-3 font-extrabold">{t('vip.dashboard.financials.date')}</th><th className="p-3 font-extrabold">{t('vip.dashboard.financials.description')}</th><th className="p-3 text-red-600 font-extrabold">{t('vip.dashboard.financials.debit')}</th><th className="p-3 text-green-600 font-extrabold">{t('vip.dashboard.financials.credit')}</th><th className="p-3 font-extrabold">{t('vip.dashboard.financials.balance')}</th></tr></thead><tbody>{transactions.map(tr => (<tr key={tr.id} className="border-b hover:bg-gray-50"><td className="p-3 font-semibold">{tr.date}</td><td className="p-3 font-bold">{language === 'ar' ? tr.description_ar : tr.description_en}</td><td className="p-3 text-red-600 font-semibold">{tr.debit > 0 ? formatCurrency(tr.debit) : '-'}</td><td className="p-3 text-green-600 font-semibold">{tr.credit > 0 ? formatCurrency(tr.credit) : '-'}</td><td className={`p-3 font-extrabold ${tr.balance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>{formatCurrency(tr.balance)}</td></tr>))}</tbody></table></div>
        </div>
    );
};

const VipSecurityView: React.FC<ViewProps & { onVipPasswordChange: (passwords: { current: string; new: string }) => Promise<boolean> }> = ({ onBack, onVipPasswordChange }) => {
    const { t } = useI18n();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (newPassword !== confirmPassword) {
            setError(t('auth.passwordMismatch'));
            return;
        }
        if (newPassword.length < 6) {
            setError(t('auth.passwordLengthError'));
            return;
        }
        setIsLoading(true);
        const success = await onVipPasswordChange({ current: currentPassword, new: newPassword });
        setIsLoading(false);
        if (success) {
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } else {
            setError(t('dashboard.security.changeError'));
        }
    };

    return (
        <div className="max-w-xl mx-auto">
            <button onClick={onBack} className="mb-4 bg-secondary text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90">&larr; {t('dashboard.back')}</button>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-3xl font-black text-primary mb-6">{t('vip.dashboard.security.title')}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative"><label className="sr-only">{t('dashboard.security.currentPassword')}</label><input type={showCurrent ? 'text' : 'password'} value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder={t('dashboard.security.currentPassword')} required className="w-full p-3 border rounded font-semibold" /><button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute inset-y-0 end-0 flex items-center px-3 text-gray-600">{showCurrent ? <EyeOffIcon /> : <EyeIcon />}</button></div>
                    <div className="relative"><label className="sr-only">{t('auth.newPassword')}</label><input type={showNew ? 'text' : 'password'} value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder={t('auth.newPassword')} required className="w-full p-3 border rounded font-semibold" /><button type="button" onClick={() => setShowNew(!showNew)} className="absolute inset-y-0 end-0 flex items-center px-3 text-gray-600">{showNew ? <EyeOffIcon /> : <EyeIcon />}</button></div>
                    <div><label className="sr-only">{t('auth.confirmPassword')}</label><input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder={t('auth.confirmPassword')} required className="w-full p-3 border rounded font-semibold" /></div>
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <button type="submit" disabled={isLoading} className="w-full bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-light disabled:bg-primary-light">{isLoading ? '...' : t('dashboard.security.changePasswordButton')}</button>
                </form>
            </div>
        </div>
    );
};

const VipDashboardMenu: React.FC<{ onViewChange: (view: View) => void }> = ({ onViewChange }) => {
    const { t } = useI18n();
    const sections = [
        { key: 'orders', icon: '📝', onClick: () => onViewChange('orders') },
        { key: 'financials', icon: '📊', onClick: () => onViewChange('financials') },
        { key: 'trackOrder', icon: '🛰️', onClick: () => onViewChange('trackOrder') },
        { key: 'security', icon: '🛡️', onClick: () => onViewChange('security') },
        { key: 'account', icon: '👤', onClick: () => onViewChange('account') },
        { key: 'offers', icon: '⭐', onClick: () => onViewChange('offers') },
        { key: 'quick-order', icon: '⚡', onClick: () => onViewChange('quick-order') },
    ];
    
    return (
        <div className="space-y-8">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sections.map(section => (
                    <div key={section.key} onClick={section.onClick} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer text-center">
                        <div className="text-4xl mb-4">{section.icon}</div>
                        <h3 className="text-xl font-black text-primary mb-2">{t(`vip.dashboard.${section.key}.title`)}</h3>
                        <p className="text-black font-extrabold">{t(`vip.dashboard.${section.key}.desc`)}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

interface VipDashboardPageProps {
    user: User | null;
    onLogout: () => void;
    products: Product[];
    addToCart: (product: Product) => void;
    toggleWishlist: (product: Product) => void;
    isProductInWishlist: (productId: number) => boolean;
    invoices: Invoice[];
    transactions: VipTransaction[];
    onVipPasswordChange: (passwords: { current: string; new: string }) => Promise<boolean>;
    setPage: (page: Page, productId?: number) => void;
    onZoom?: (src: string) => void;
}

export const VipDashboardPage: React.FC<VipDashboardPageProps> = (props) => {
    const { user, onLogout, products, addToCart, toggleWishlist, isProductInWishlist, invoices, transactions, onVipPasswordChange, setPage, onZoom } = props;
    const { t } = useI18n();
    const [view, setView] = useState<View>('menu');
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

    const userInvoices = useMemo(() => {
        if (user?.type !== 'vip') return [];
        return invoices.filter(inv => inv.clientId === user.phone);
    }, [invoices, user]);

    const userTransactions = useMemo(() => {
        if (user?.type !== 'vip') return [];
        return transactions.filter(tx => tx.clientId === user.phone);
    }, [transactions, user]);
    
    const specialOffers = useMemo(() => products.filter(p => p.original_price).slice(0, 4), [products]);

    const renderView = () => {
        switch (view) {
            case 'orders': return <MyOrdersView onBack={() => setView('menu')} invoices={userInvoices} onSelectOrder={setSelectedInvoice} />;
            case 'account': return <AccountDetailsView onBack={() => setView('menu')} user={user} />;
            case 'offers': return <ExclusiveOffersView onBack={() => setView('menu')} offers={specialOffers} addToCart={addToCart} toggleWishlist={toggleWishlist} isProductInWishlist={isProductInWishlist} setPage={setPage} onZoom={onZoom} />;
            case 'quick-order': return <QuickOrderView onBack={() => setView('menu')} products={products} user={user} />;
            case 'financials': return <AccountStatementView onBack={() => setView('menu')} transactions={userTransactions} />;
            case 'trackOrder': return <OrderTrackingView onBack={() => setView('menu')} />;
            case 'security': return <VipSecurityView onBack={() => setView('menu')} onVipPasswordChange={onVipPasswordChange} />;
            default: return <VipDashboardMenu onViewChange={setView} />;
        }
    };

    if (!user || user.type !== 'vip') {
        return <div className="text-center p-8 text-red-500 font-bold">{t('dashboard.unauthorized.title')}</div>;
    }

    return (
        <div className="bg-gray-100 min-h-screen">
            {selectedInvoice && <OrderDetailsModal invoice={selectedInvoice} onClose={() => setSelectedInvoice(null)} />}
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8 p-6 bg-white rounded-lg shadow-md flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-black text-primary">{t('vip.dashboard.title')}</h1>
                        <p className="mt-2 text-black font-extrabold">{t('vip.dashboard.welcome', { name: user.name })}</p>
                    </div>
                    <button onClick={onLogout} className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700">{t('vip.dashboard.logout')}</button>
                </div>
                {renderView()}
            </div>
        </div>
    );
};
