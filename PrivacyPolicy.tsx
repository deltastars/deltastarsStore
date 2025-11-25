
import React from 'react';
import { useI18n } from '../contexts/I18nContext';
import { Page } from '../types';

interface PrivacyPolicyProps {
  setPage: (page: Page) => void;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ setPage }) => {
  const { t } = useI18n();
  const content = t('legal.privacyPolicy', { returnObjects: true }) as any;

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <button onClick={() => setPage('home')} className="mb-8 text-primary font-bold hover:underline">
         &larr; {t('productDetail.backToProducts')}
      </button>
      
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-black text-primary mb-2">{content.title}</h1>
        <p className="text-sm text-gray-500 mb-6 font-bold">{content.lastUpdated}</p>
        
        <p className="mb-6 font-bold text-gray-800 leading-relaxed">{content.intro}</p>
        
        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-extrabold text-black mb-2">{content.collection.title}</h2>
            <p className="text-gray-700 leading-relaxed font-semibold">{content.collection.content}</p>
          </section>
          
          <section>
            <h2 className="text-xl font-extrabold text-black mb-2">{content.use.title}</h2>
            <p className="text-gray-700 leading-relaxed font-semibold">{content.use.content}</p>
          </section>
          
          <section>
            <h2 className="text-xl font-extrabold text-black mb-2">{content.sharing.title}</h2>
            <p className="text-gray-700 leading-relaxed font-semibold">{content.sharing.content}</p>
          </section>
          
          <section>
            <h2 className="text-xl font-extrabold text-black mb-2">{content.security.title}</h2>
            <p className="text-gray-700 leading-relaxed font-semibold">{content.security.content}</p>
          </section>

          <section>
            <h2 className="text-xl font-extrabold text-black mb-2">{content.rights.title}</h2>
            <p className="text-gray-700 leading-relaxed font-semibold">{content.rights.content}</p>
          </section>
        </div>
      </div>
    </div>
  );
};
