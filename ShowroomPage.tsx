
import React, { useMemo } from 'react';
import { useI18n } from '../contexts/I18nContext';
import { ShowroomItem } from '../types';
import { COMPANY_INFO } from '../constants';

interface ShowroomPageProps {
  items: ShowroomItem[];
  showroomBanner: string;
}

export const ShowroomPage: React.FC<ShowroomPageProps> = ({ items, showroomBanner }) => {
  const { t, language } = useI18n();

  const groupedItems = useMemo(() => {
    return items.reduce((acc: Record<string, ShowroomItem[]>, item: ShowroomItem) => {
      const sectionKey = (language === 'ar' ? item.section_ar : item.section_en) || t('showroom.generalSection');
      if (!acc[sectionKey]) {
        acc[sectionKey] = [];
      }
      acc[sectionKey].push(item);
      return acc;
    }, {});
  }, [items, language, t]);


  return (
    <div className="bg-gray-50">
      {/* Banner Section */}
      <section className="relative text-white text-center py-20 px-4">
        <div
          className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url('${showroomBanner}')` }}
          role="img"
          aria-label={t('showroom.title')}
        ></div>
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 z-10"></div>
        <div className="container mx-auto relative z-20">
            <h1 className="text-5xl md:text-6xl font-black mb-4 text-white">{t('showroom.title')}</h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto font-black text-white">{t('showroom.subtitle')}</p>
        </div>
      </section>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12">
        {items.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-2xl text-black font-black">{t('showroom.noItems')}</p>
          </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(groupedItems).map(([section, sectionItems]: [string, ShowroomItem[]]) => (
              <section key={section}>
                <h2 className="text-3xl font-black text-primary mb-6 border-b-2 border-secondary pb-2">{section}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {sectionItems.map((item: ShowroomItem) => (
                    <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col group transform hover:-translate-y-2 transition-transform duration-300">
                      {item.videoUrl ? (
                        <video
                          src={item.videoUrl}
                          className="w-full h-56 object-cover bg-black"
                          autoPlay
                          loop
                          muted
                          playsInline
                          aria-label={language === 'ar' ? item.title_ar : item.title_en}
                        />
                      ) : (
                        <img src={item.image} alt={language === 'ar' ? item.title_ar : item.title_en} className="w-full h-56 object-cover" />
                      )}
                      <div className="p-4 sm:p-6 flex flex-col flex-grow">
                        <h3 className="text-2xl font-black text-primary mb-3">{language === 'ar' ? item.title_ar : item.title_en}</h3>
                        <p className="text-black font-extrabold text-base flex-grow mb-4">{language === 'ar' ? item.description_ar : item.description_en}</p>
                        
                        <div className="mt-auto flex items-center gap-4">
                            <a 
                                href={`https://wa.me/${COMPANY_INFO.whatsapp}?text=${encodeURIComponent(t('showroom.inquiryMessage', { title: language === 'ar' ? item.title_ar : item.title_en }))}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-green-500 text-white font-black py-2 px-4 rounded-full self-start hover:bg-green-600 transition-colors"
                            >
                                {t('showroom.inquireNow')}
                            </a>
                            {item.link && (
                              <a
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-secondary text-white font-black py-2 px-4 rounded-full self-start hover:bg-opacity-90 transition-colors"
                              >
                                {language === 'ar' ? (item.linkText_ar || 'اعرف المزيد') : (item.linkText_en || 'Learn More')}
                              </a>
                            )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
