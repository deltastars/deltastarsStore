
import React, { useState, useMemo } from 'react';
import { useI18n } from '../../contexts/I18nContext';
import { useSettings } from '../../contexts/SettingsContext';
import { AppSettings, ShowroomItem } from '../../types';
import { AiImageEditor } from '../multimedia/AiImageEditor';
import { PencilIcon, TrashIcon, PlusIcon } from '../lib/Icons';

interface DeveloperToolsProps {
    onBack: () => void;
    showroomItems?: ShowroomItem[];
    onUpdateShowroom?: (items: ShowroomItem[]) => void;
}

const DEFAULT_SHOWROOM_ITEM: ShowroomItem = {
    id: '',
    title_ar: '',
    title_en: '',
    description_ar: '',
    description_en: '',
    image: '',
    section_ar: 'عروض عامة',
    section_en: 'General Offers'
};

export const DeveloperTools: React.FC<DeveloperToolsProps> = ({ onBack, showroomItems = [], onUpdateShowroom }) => {
    const { t, language } = useI18n();
    const { settings, updateCompanyInfo, updateSocialLinks, resetSettings, updateSettings } = useSettings();
    const [activeTab, setActiveTab] = useState<'general' | 'media' | 'social' | 'ai' | 'seo' | 'showroom'>('general');
    
    // Showroom State
    const [editingItem, setEditingItem] = useState<ShowroomItem | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateCompanyInfo({ [e.target.name]: e.target.value });
    };

    const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateSocialLinks({ [e.target.name]: e.target.value });
    };
    
    const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateCompanyInfo({ primaryColor: e.target.value });
    };

    // --- SHOWROOM LOGIC ---
    const handleSaveItem = (e: React.FormEvent) => {
        e.preventDefault();
        if (!onUpdateShowroom || !editingItem) return;

        const newItem = { ...editingItem };
        if (!newItem.id) {
             newItem.id = `item-${Date.now()}`;
             onUpdateShowroom([...showroomItems, newItem]);
        } else {
             const updated = showroomItems.map(item => item.id === newItem.id ? newItem : item);
             onUpdateShowroom(updated);
        }
        setIsModalOpen(false);
        setEditingItem(null);
    };

    const handleDeleteItem = (id: string) => {
        if (!onUpdateShowroom || !window.confirm(t('dashboard.developer.showroom.confirmDelete'))) return;
        onUpdateShowroom(showroomItems.filter(item => item.id !== id));
    };
    
    const handleOpenModal = (item?: ShowroomItem) => {
        setEditingItem(item || { ...DEFAULT_SHOWROOM_ITEM });
        setIsModalOpen(true);
    };

    // Helpers for specific reward types
    const handleAddReward = (type: 'best_customer' | 'best_employee' | 'event') => {
        let template = { ...DEFAULT_SHOWROOM_ITEM };
        if (type === 'best_customer') {
            template.title_ar = 'جائزة العميل المثالي';
            template.title_en = 'Best Customer Award';
            template.section_ar = 'جوائز العملاء';
            template.section_en = 'Customer Rewards';
            template.description_ar = 'نبارك لعميلنا المميز الحصول على مكافأة الولاء.';
            template.description_en = 'Congratulating our special client for loyalty rewards.';
            template.image = 'https://i.imgur.com/medal_placeholder.png'; // Placeholder
        } else if (type === 'best_employee') {
            template.title_ar = 'موظف الشهر';
            template.title_en = 'Employee of the Month';
            template.section_ar = 'تميز الموظفين';
            template.section_en = 'Employee Recognition';
            template.image = 'https://i.imgur.com/employee_placeholder.png';
        } else if (type === 'event') {
             template.title_ar = 'فعالية جديدة';
             template.title_en = 'New Event';
             template.section_ar = 'الفعاليات والمناسبات';
             template.section_en = 'Events & Occasions';
        }
        handleOpenModal(template);
    };

    return (
        <div className="bg-white rounded-lg shadow-lg min-h-[700px] flex flex-col">
             {/* Showroom Edit Modal */}
             {isModalOpen && editingItem && (
                <div className="fixed inset-0 bg-black bg-opacity-70 z-[70] flex justify-center items-center p-4">
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl p-8 max-h-[90vh] overflow-y-auto border-t-8 border-green-700">
                        <h2 className="text-3xl font-black text-green-700 mb-6">{editingItem.id ? t('dashboard.developer.showroom.editTitle') : t('dashboard.developer.showroom.addTitle')}</h2>
                        <form onSubmit={handleSaveItem} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block font-black text-black mb-2">{t('dashboard.developer.showroom.form.title_ar')}</label>
                                    <input value={editingItem.title_ar} onChange={e => setEditingItem({...editingItem, title_ar: e.target.value})} className="w-full p-3 bg-gray-100 text-black font-bold border-2 border-gray-300 rounded" required />
                                </div>
                                <div>
                                    <label className="block font-black text-black mb-2">{t('dashboard.developer.showroom.form.title_en')}</label>
                                    <input value={editingItem.title_en} onChange={e => setEditingItem({...editingItem, title_en: e.target.value})} className="w-full p-3 bg-gray-100 text-black font-bold border-2 border-gray-300 rounded" required />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block font-black text-black mb-2">{t('dashboard.developer.showroom.form.section_ar')}</label>
                                    <input list="sections_ar" value={editingItem.section_ar} onChange={e => setEditingItem({...editingItem, section_ar: e.target.value})} className="w-full p-3 bg-gray-100 text-black font-bold border-2 border-gray-300 rounded" placeholder="مثال: عروض، فعاليات، جوائز" required />
                                    <datalist id="sections_ar">
                                        <option value="عروض عامة" />
                                        <option value="الفعاليات والمناسبات" />
                                        <option value="جوائز العملاء" />
                                        <option value="تميز الموظفين" />
                                    </datalist>
                                </div>
                                <div>
                                    <label className="block font-black text-black mb-2">{t('dashboard.developer.showroom.form.section_en')}</label>
                                    <input list="sections_en" value={editingItem.section_en} onChange={e => setEditingItem({...editingItem, section_en: e.target.value})} className="w-full p-3 bg-gray-100 text-black font-bold border-2 border-gray-300 rounded" placeholder="e.g. Offers, Events, Rewards" required />
                                     <datalist id="sections_en">
                                        <option value="General Offers" />
                                        <option value="Events & Occasions" />
                                        <option value="Customer Rewards" />
                                        <option value="Employee Recognition" />
                                    </datalist>
                                </div>
                            </div>

                            <div>
                                <label className="block font-black text-black mb-2">{t('dashboard.developer.showroom.form.image')}</label>
                                <input value={editingItem.image} onChange={e => setEditingItem({...editingItem, image: e.target.value})} className="w-full p-3 bg-gray-100 text-black font-bold border-2 border-gray-300 rounded" placeholder="https://..." required />
                            </div>
                             <div>
                                <label className="block font-black text-black mb-2">{t('dashboard.developer.showroom.form.videoUrl')}</label>
                                <input value={editingItem.videoUrl || ''} onChange={e => setEditingItem({...editingItem, videoUrl: e.target.value})} className="w-full p-3 bg-gray-100 text-black font-bold border-2 border-gray-300 rounded" placeholder="https://..." />
                            </div>
                            
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block font-black text-black mb-2">{t('dashboard.developer.showroom.form.description_ar')}</label>
                                    <textarea value={editingItem.description_ar} onChange={e => setEditingItem({...editingItem, description_ar: e.target.value})} className="w-full p-3 bg-gray-100 text-black font-bold border-2 border-gray-300 rounded h-24" />
                                </div>
                                <div>
                                    <label className="block font-black text-black mb-2">{t('dashboard.developer.showroom.form.description_en')}</label>
                                    <textarea value={editingItem.description_en} onChange={e => setEditingItem({...editingItem, description_en: e.target.value})} className="w-full p-3 bg-gray-100 text-black font-bold border-2 border-gray-300 rounded h-24" />
                                </div>
                            </div>

                            <div className="flex justify-end gap-4 pt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 bg-gray-300 text-black font-black rounded hover:bg-gray-400 transition-colors">
                                    {t('auth.cancel')}
                                </button>
                                <button type="submit" className="px-6 py-3 bg-green-700 text-white font-black rounded hover:bg-green-600 transition-colors shadow-none border-b-4 border-green-900 active:border-b-0 active:translate-y-1">
                                    {t('dashboard.products.save')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="p-6 border-b bg-gray-50 rounded-t-lg flex justify-between items-center flex-wrap gap-4">
                <div>
                     <button onClick={onBack} className="mb-2 text-gray-500 font-bold hover:text-primary">&larr; {t('dashboard.back')}</button>
                     <h2 className="text-3xl font-black text-gray-800">{t('dashboard.sections.developer.title')}</h2>
                     <p className="text-sm text-gray-500 font-bold">{t('dashboard.sections.developer.desc')}</p>
                </div>
                <button onClick={() => { if(window.confirm('Reset all settings?')) resetSettings(); }} className="bg-red-100 text-red-600 px-4 py-2 rounded font-bold hover:bg-red-200">Reset Defaults</button>
            </div>

            <div className="flex flex-col md:flex-row flex-grow">
                {/* Sidebar */}
                <div className="w-full md:w-64 bg-gray-100 p-4 border-e">
                    <nav className="space-y-2 overflow-x-auto flex md:flex-col gap-2 md:gap-0">
                        <button onClick={() => setActiveTab('general')} className={`w-full text-start px-4 py-3 rounded font-bold whitespace-nowrap ${activeTab === 'general' ? 'bg-white shadow text-primary border-l-4 border-primary' : 'text-gray-600 hover:bg-gray-200'}`}>⚙️ {t('dashboard.sections.developer.tabs.general')}</button>
                        <button onClick={() => setActiveTab('showroom')} className={`w-full text-start px-4 py-3 rounded font-bold whitespace-nowrap ${activeTab === 'showroom' ? 'bg-white shadow text-primary border-l-4 border-primary' : 'text-gray-600 hover:bg-gray-200'}`}>🎪 {t('showroom.title')}</button>
                        <button onClick={() => setActiveTab('media')} className={`w-full text-start px-4 py-3 rounded font-bold whitespace-nowrap ${activeTab === 'media' ? 'bg-white shadow text-primary border-l-4 border-primary' : 'text-gray-600 hover:bg-gray-200'}`}>🖼️ {t('dashboard.sections.developer.tabs.media')}</button>
                        <button onClick={() => setActiveTab('social')} className={`w-full text-start px-4 py-3 rounded font-bold whitespace-nowrap ${activeTab === 'social' ? 'bg-white shadow text-primary border-l-4 border-primary' : 'text-gray-600 hover:bg-gray-200'}`}>🌐 {t('dashboard.sections.developer.tabs.social')}</button>
                        <button onClick={() => setActiveTab('ai')} className={`w-full text-start px-4 py-3 rounded font-bold whitespace-nowrap ${activeTab === 'ai' ? 'bg-white shadow text-primary border-l-4 border-primary' : 'text-gray-600 hover:bg-gray-200'}`}>🤖 {t('dashboard.sections.developer.tabs.ai')}</button>
                        <button onClick={() => setActiveTab('seo')} className={`w-full text-start px-4 py-3 rounded font-bold whitespace-nowrap ${activeTab === 'seo' ? 'bg-white shadow text-primary border-l-4 border-primary' : 'text-gray-600 hover:bg-gray-200'}`}>🚀 {t('dashboard.sections.developer.tabs.seo')}</button>
                    </nav>
                </div>

                {/* Content Area */}
                <div className="flex-grow p-8 overflow-y-auto bg-gray-50">
                    
                    {activeTab === 'showroom' && (
                        <div className="space-y-8">
                            <h3 className="text-2xl font-black text-gray-800 mb-4 border-b-4 border-green-700 pb-2 inline-block">Quick Add Rewards & Events</h3>
                            {/* Action Buttons (Green 3D Style) */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <button onClick={() => handleOpenModal()} className="bg-green-700 text-white p-6 text-center transition-all duration-200 transform border-b-8 border-r-8 border-green-900 hover:border-b-0 hover:border-r-0 hover:border-t-8 hover:border-l-8 hover:bg-green-600 active:scale-95 font-black rounded-lg group">
                                    <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">+</div>
                                    <div>{t('dashboard.developer.showroom.addNew')}</div>
                                </button>
                                <button onClick={() => handleAddReward('best_customer')} className="bg-green-700 text-white p-6 text-center transition-all duration-200 transform border-b-8 border-r-8 border-green-900 hover:border-b-0 hover:border-r-0 hover:border-t-8 hover:border-l-8 hover:bg-green-600 active:scale-95 font-black rounded-lg group">
                                    <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">🏆</div>
                                    <div>Add "Best Customer" Award</div>
                                </button>
                                <button onClick={() => handleAddReward('best_employee')} className="bg-green-700 text-white p-6 text-center transition-all duration-200 transform border-b-8 border-r-8 border-green-900 hover:border-b-0 hover:border-r-0 hover:border-t-8 hover:border-l-8 hover:bg-green-600 active:scale-95 font-black rounded-lg group">
                                    <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">⭐</div>
                                    <div>Add "Employee of Month"</div>
                                </button>
                                <button onClick={() => handleAddReward('event')} className="bg-green-700 text-white p-6 text-center transition-all duration-200 transform border-b-8 border-r-8 border-green-900 hover:border-b-0 hover:border-r-0 hover:border-t-8 hover:border-l-8 hover:bg-green-600 active:scale-95 font-black rounded-lg group">
                                    <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">🎉</div>
                                    <div>Add New Event</div>
                                </button>
                            </div>

                            <div className="mt-8">
                                <h3 className="text-2xl font-black text-gray-800 mb-4 border-b-4 border-green-700 pb-2 inline-block">Current Showroom Items</h3>
                                <div className="overflow-x-auto bg-white rounded-lg shadow-md border border-gray-200">
                                    <table className="w-full text-right text-gray-800">
                                        <thead className="bg-green-100 text-green-900">
                                            <tr>
                                                <th className="p-4 font-black border-b-2 border-green-200">Image</th>
                                                <th className="p-4 font-black border-b-2 border-green-200">Title</th>
                                                <th className="p-4 font-black border-b-2 border-green-200">Section</th>
                                                <th className="p-4 font-black border-b-2 border-green-200 text-center">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {showroomItems.length === 0 ? (
                                                <tr><td colSpan={4} className="p-8 text-center font-bold text-gray-500 text-lg">No items found. Start by adding one above!</td></tr>
                                            ) : (
                                                showroomItems.map(item => (
                                                    <tr key={item.id} className="border-b hover:bg-green-50 transition-colors">
                                                        <td className="p-4">
                                                            {item.videoUrl ? (
                                                                <div className="relative w-16 h-16">
                                                                     <span className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-xs font-bold rounded z-10">Video</span>
                                                                     <div className="w-full h-full bg-gray-800 rounded"></div>
                                                                </div>
                                                            ) : (
                                                                <img src={item.image} alt="thumb" className="w-16 h-16 object-cover rounded-md border-2 border-gray-300" />
                                                            )}
                                                        </td>
                                                        <td className="p-4 font-bold text-lg">{language === 'ar' ? item.title_ar : item.title_en}</td>
                                                        <td className="p-4">
                                                            <span className="bg-green-200 text-green-900 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide">
                                                                {language === 'ar' ? item.section_ar : item.section_en}
                                                            </span>
                                                        </td>
                                                        <td className="p-4 text-center">
                                                            <div className="flex justify-center gap-3">
                                                                <button onClick={() => handleOpenModal(item)} className="text-blue-600 hover:bg-blue-100 p-2 rounded-full transition-colors" title="Edit">
                                                                    <PencilIcon />
                                                                </button>
                                                                <button onClick={() => handleDeleteItem(item.id)} className="text-red-600 hover:bg-red-100 p-2 rounded-full transition-colors" title="Delete">
                                                                    <TrashIcon />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'general' && (
                        <div className="space-y-6 max-w-2xl bg-white p-6 rounded-lg shadow-sm">
                            <h3 className="text-xl font-black border-b pb-2">Store Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div><label className="block font-bold mb-1">Store Name</label><input name="name" value={settings.company.name} onChange={handleCompanyChange} className="w-full p-2 border rounded font-semibold" /></div>
                                <div><label className="block font-bold mb-1">Email</label><input name="email" value={settings.company.email} onChange={handleCompanyChange} className="w-full p-2 border rounded font-semibold" /></div>
                                <div><label className="block font-bold mb-1">Phone</label><input name="phone" value={settings.company.phone} onChange={handleCompanyChange} className="w-full p-2 border rounded font-semibold" /></div>
                                <div><label className="block font-bold mb-1">WhatsApp (Number)</label><input name="whatsappNumber" value={settings.company.whatsappNumber} onChange={handleCompanyChange} className="w-full p-2 border rounded font-semibold" /></div>
                            </div>
                            <div><label className="block font-bold mb-1">Slogan (Arabic)</label><input name="slogan_ar" value={settings.company.slogan_ar} onChange={handleCompanyChange} className="w-full p-2 border rounded font-semibold" /></div>
                            <div><label className="block font-bold mb-1">Address (Arabic)</label><input name="address_ar" value={settings.company.address_ar} onChange={handleCompanyChange} className="w-full p-2 border rounded font-semibold" /></div>
                            <div><label className="block font-bold mb-1">Map URL</label><input name="map_url" value={settings.company.map_url} onChange={handleCompanyChange} className="w-full p-2 border rounded font-semibold" /></div>
                        </div>
                    )}

                    {activeTab === 'media' && (
                        <div className="space-y-6 max-w-2xl bg-white p-6 rounded-lg shadow-sm">
                            <h3 className="text-xl font-black border-b pb-2">Appearance & Branding</h3>
                            
                            <div className="flex items-center gap-4 p-4 border rounded bg-gray-50">
                                <input type="color" value={settings.company.primaryColor} onChange={handleColorChange} className="w-16 h-16 rounded cursor-pointer border-none" />
                                <div>
                                    <h4 className="font-bold">Primary Color (Theme)</h4>
                                    <p className="text-xs text-gray-500">Controls buttons, menus, and accents.</p>
                                </div>
                            </div>

                            <div>
                                <label className="block font-bold mb-1">Logo URL</label>
                                <div className="flex gap-2">
                                    <input name="logoUrl" value={settings.company.logoUrl} onChange={handleCompanyChange} className="w-full p-2 border rounded font-semibold" />
                                    <img src={settings.company.logoUrl} alt="Logo Preview" className="w-12 h-12 object-contain border rounded bg-gray-100" />
                                </div>
                            </div>

                            <div>
                                <label className="block font-bold mb-1">Hero Image URL</label>
                                <input name="heroImage" value={settings.company.heroImage} onChange={handleCompanyChange} className="w-full p-2 border rounded font-semibold mb-2" />
                                <img src={settings.company.heroImage} alt="Hero Preview" className="w-full h-32 object-cover rounded border" />
                            </div>
                            
                             <div>
                                <label className="block font-bold mb-1">Showroom Banner URL</label>
                                <input name="showroomBanner" value={settings.company.showroomBanner} onChange={handleCompanyChange} className="w-full p-2 border rounded font-semibold mb-2" />
                                <img src={settings.company.showroomBanner} alt="Banner Preview" className="w-full h-32 object-cover rounded border" />
                            </div>
                        </div>
                    )}

                    {activeTab === 'social' && (
                        <div className="space-y-6 max-w-2xl bg-white p-6 rounded-lg shadow-sm">
                            <h3 className="text-xl font-black border-b pb-2">Social Media Links</h3>
                            <div className="grid grid-cols-1 gap-4">
                                {Object.keys(settings.social).map((key) => (
                                    <div key={key} className="flex items-center gap-2">
                                        <span className="w-24 font-bold capitalize">{key}</span>
                                        <input 
                                            name={key} 
                                            value={(settings.social as any)[key]} 
                                            onChange={handleSocialChange} 
                                            className="flex-grow p-2 border rounded font-semibold" 
                                            placeholder={`https://${key}.com/...`}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {activeTab === 'ai' && (
                        <div className="space-y-6">
                            <h3 className="text-xl font-black border-b pb-2">AI Tools</h3>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div>
                                    <p className="mb-4 font-bold text-gray-600">Generate image ideas or enhance existing ones.</p>
                                    <AiImageEditor />
                                </div>
                                <div className="bg-blue-50 p-4 rounded border border-blue-200">
                                    <h4 className="font-bold text-blue-800 mb-2">System Status</h4>
                                    <ul className="text-sm space-y-2 font-semibold">
                                        <li>✅ Gemini AI: Connected</li>
                                        <li>✅ Text-to-Image: Mock (Demo)</li>
                                        <li>✅ Image Analysis: Ready</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'seo' && (
                        <div className="space-y-6 max-w-2xl bg-white p-6 rounded-lg shadow-sm">
                            <h3 className="text-xl font-black border-b pb-2">SEO Settings</h3>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block font-bold mb-1">Meta Title</label>
                                    <input 
                                        placeholder="Delta Stars Store"
                                        className="w-full p-2 border rounded font-semibold" 
                                        defaultValue="متجر نجوم دلتا | Delta Stars Store"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold mb-1">Meta Description</label>
                                    <textarea 
                                        placeholder="Store description..."
                                        className="w-full p-2 border rounded font-semibold h-24"
                                        defaultValue="متجر نجوم دلتا للتجارة، مختص باستيراد وتجارة الخضروات والفواكه الطازجة والتمور والبيض في المملكة العربية السعودية."
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold mb-1">Keywords</label>
                                    <input 
                                        placeholder="vegetables, fruits, dates..."
                                        className="w-full p-2 border rounded font-semibold" 
                                        defaultValue="خضروات, فواكه, تمور, بيض, نجوم دلتا, السعودية"
                                    />
                                </div>
                                <button className="bg-green-600 text-white px-4 py-2 rounded font-bold hover:bg-green-700">Save SEO Settings</button>
                            </div>

                            <h3 className="text-xl font-black border-b pb-2 mt-8">Marketing Campaigns</h3>
                            <div className="bg-gray-50 p-4 rounded border">
                                <p className="font-bold mb-2">Promo Link:</p>
                                <code className="block bg-white p-2 rounded border mb-4 text-sm">https://deltastars-ksa.com/?ref=promo_summer2024</code>
                                <button className="bg-blue-600 text-white px-4 py-2 rounded font-bold hover:bg-blue-700">Copy Link</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
