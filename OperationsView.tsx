
import React, { useState, useMemo } from 'react';
import { useI18n } from '../../contexts/I18nContext';
import { Product, Supplier } from '../../types';
import { DeliveryIcon, QualityIcon, SearchIcon, PlusIcon, TrashIcon } from '../lib/Icons';

interface OperationsViewProps {
    onBack: () => void;
    products: Product[];
    onUpdateProduct: (p: Product) => Promise<Product | null>;
}

const MOCK_SUPPLIERS: Supplier[] = [
    { id: 'sup1', name: 'مزارع القصيم النموذجية', contact: '0501234567', country: 'السعودية', rating: 4.8 },
    { id: 'sup2', name: 'Global Fruits Ltd', contact: '+201000000', country: 'مصر', rating: 4.5 },
];

export const OperationsView: React.FC<OperationsViewProps> = ({ onBack, products, onUpdateProduct }) => {
    const { t, language } = useI18n();
    const [activeTab, setActiveTab] = useState<'inventory' | 'suppliers' | 'quality'>('inventory');
    const [suppliers, setSuppliers] = useState<Supplier[]>(MOCK_SUPPLIERS);

    // --- Inventory Logic ---
    const lowStockProducts = useMemo(() => products.filter(p => p.stock_quantity < 20), [products]);
    
    const handleStockUpdate = async (product: Product, newQty: number) => {
        const updated = { ...product, stock_quantity: newQty };
        await onUpdateProduct(updated);
    };

    return (
        <div className="bg-white rounded-lg shadow-lg min-h-[600px]">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b flex-wrap gap-4">
                <div>
                    <button onClick={onBack} className="mb-2 text-gray-500 font-bold hover:text-primary">&larr; {t('dashboard.back')}</button>
                    <h2 className="text-3xl font-black text-primary">{t('dashboard.sections.operations.title')}</h2>
                </div>
                <div className="flex gap-2 flex-wrap">
                    <button onClick={() => setActiveTab('inventory')} className={`px-4 py-2 rounded-lg font-bold ${activeTab === 'inventory' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}>{t('dashboard.operations.tabs.inventory')}</button>
                    <button onClick={() => setActiveTab('suppliers')} className={`px-4 py-2 rounded-lg font-bold ${activeTab === 'suppliers' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}>{t('dashboard.operations.tabs.suppliers')}</button>
                    <button onClick={() => setActiveTab('quality')} className={`px-4 py-2 rounded-lg font-bold ${activeTab === 'quality' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}>{t('dashboard.operations.tabs.quality')}</button>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                {activeTab === 'inventory' && (
                    <div className="space-y-6">
                         {/* Alerts */}
                         {lowStockProducts.length > 0 && (
                             <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                                 <div className="flex items-center">
                                     <div className="flex-shrink-0 text-red-500">⚠</div>
                                     <div className="ms-3">
                                         <p className="text-sm text-red-700 font-bold">{t('dashboard.operations.lowStockAlert', { count: lowStockProducts.length })}</p>
                                     </div>
                                 </div>
                             </div>
                         )}
                         
                         <div className="overflow-x-auto">
                            <table className="w-full text-right text-black">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="p-3 font-extrabold text-start">{t('dashboard.accounts.invoices.item')}</th>
                                        <th className="p-3 font-extrabold text-start">{t('dashboard.reports.category')}</th>
                                        <th className="p-3 font-extrabold text-start">{t('dashboard.operations.tabs.inventory')}</th>
                                        <th className="p-3 font-extrabold text-center">{t('dashboard.operations.updateStock')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map(p => (
                                        <tr key={p.id} className={`border-b hover:bg-gray-50 ${p.stock_quantity < 20 ? 'bg-red-50' : ''}`}>
                                            <td className="p-3 font-bold flex items-center gap-2">
                                                <img src={p.image} className="w-10 h-10 rounded object-cover" />
                                                {language === 'ar' ? p.name_ar : p.name_en}
                                            </td>
                                            <td className="p-3">{t(`categories.${p.category}`)}</td>
                                            <td className="p-3 font-black text-lg">{p.stock_quantity} <span className="text-xs font-normal">{language === 'ar' ? p.unit_ar : p.unit_en}</span></td>
                                            <td className="p-3 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button onClick={() => handleStockUpdate(p, p.stock_quantity - 10)} className="bg-red-100 text-red-600 px-2 rounded font-bold hover:bg-red-200">-10</button>
                                                    <button onClick={() => handleStockUpdate(p, p.stock_quantity + 10)} className="bg-green-100 text-green-600 px-2 rounded font-bold hover:bg-green-200">+10</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                         </div>
                    </div>
                )}

                {activeTab === 'suppliers' && (
                    <div>
                        <div className="flex justify-between mb-4">
                            <h3 className="text-xl font-bold">{t('dashboard.operations.suppliersRecord')}</h3>
                            <button className="bg-primary text-white px-4 py-2 rounded font-bold">{t('dashboard.operations.addSupplier')}</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {suppliers.map(s => (
                                <div key={s.id} className="border p-4 rounded-lg hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-black text-lg">{s.name}</h4>
                                            <p className="text-gray-600 text-sm">{s.country}</p>
                                            <p className="text-gray-600 text-sm font-mono mt-1">{s.contact}</p>
                                        </div>
                                        <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded font-bold">
                                            ★ {s.rating}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'quality' && (
                    <div className="text-center py-10">
                        <QualityIcon />
                        <h3 className="text-xl font-bold mt-4">{t('dashboard.operations.qualityCheck')}</h3>
                        <p className="text-gray-600 mb-6">{t('dashboard.sections.operations.desc')}</p>
                        <button className="bg-secondary text-white px-6 py-3 rounded-lg font-bold">{t('dashboard.operations.startCheck')}</button>
                    </div>
                )}
            </div>
        </div>
    );
};
