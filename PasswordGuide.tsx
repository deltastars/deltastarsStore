import React from 'react';
import { useI18n } from '../contexts/I18nContext';

interface PasswordGuideProps {
  onClose: () => void;
}

export const PasswordGuide: React.FC<PasswordGuideProps> = ({ onClose }) => {
  const { t } = useI18n();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg relative p-6">
        <button onClick={onClose} className="absolute top-2 end-3 text-gray-400 hover:text-gray-800 text-3xl font-bold">&times;</button>
        <h2 className="text-2xl font-bold text-primary mb-4 text-center">{t('passwordGuide.title')}</h2>
        <p className="text-center text-black font-medium mb-6">{t('passwordGuide.intro')}</p>

        <div className="space-y-4 text-black">
          {/* Admin */}
          <div className="bg-gray-50 p-4 rounded-md border">
            <h3 className="font-bold text-lg">{t('passwordGuide.admin.title')}</h3>
            <p><strong>{t('passwordGuide.admin.email')}:</strong> <span>deltastars777@gmail.com</span></p>
            <p><strong>{t('passwordGuide.admin.password')}:</strong> <span className="font-mono bg-gray-200 px-2 py-1 rounded">Admin123!</span></p>
          </div>

          {/* VIP */}
          <div className="bg-gray-50 p-4 rounded-md border">
            <h3 className="font-bold text-lg">{t('passwordGuide.vip.title')}</h3>
            <p><strong>{t('passwordGuide.vip.phone')}:</strong> <span dir="ltr">966558828009</span></p>
            <p><strong>{t('passwordGuide.vip.password')}:</strong> <span className="font-mono bg-gray-200 px-2 py-1 rounded">vip</span></p>
          </div>

          {/* Internal Sections */}
          <div className="bg-gray-50 p-4 rounded-md border">
            <h3 className="font-bold text-lg">{t('passwordGuide.sections.title')}</h3>
            <p>{t('passwordGuide.sections.desc')}</p>
            <p><strong>{t('passwordGuide.sections.password')}:</strong> <span className="font-mono bg-gray-200 px-2 py-1 rounded">12345</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};
