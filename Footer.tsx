
import React from 'react';
import { FacebookIcon, InstagramIcon, TelegramIcon, YoutubeIcon, SnapchatIcon, TiktokIcon, WhatsappIcon, LinktreeIcon, PhoneIcon, MailIcon, LocationMarkerIcon } from './lib/Icons';
import { useI18n } from '../contexts/I18nContext';
import { useSettings } from '../contexts/SettingsContext';
import { Page } from '../types';

interface FooterProps {
  setPage: (page: Page) => void;
}

export const Footer: React.FC<FooterProps> = ({ setPage }) => {
  const { t, language } = useI18n();
  const { settings } = useSettings();

  return (
    <footer className="bg-primary-dark text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          <div className="space-y-4">
            <h3 className="text-xl font-black border-b-2 border-secondary pb-2">{t('footer.about')}</h3>
            <div className="flex items-center gap-2">
               <img src={settings.company.logoUrl} alt="Logo" className="w-12 h-12 object-contain" />
              <h1 className="text-white text-xl font-black">{settings.company.name}</h1>
            </div>
            <p className="text-white leading-relaxed font-extrabold">{language === 'ar' ? settings.company.slogan_ar : settings.company.slogan_en}</p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-black border-b-2 border-secondary pb-2">{t('footer.contact')}</h3>
            <a href={`tel:${settings.company.phone}`} aria-label={t('footer.callUs')} className="flex items-center gap-3 text-white hover:text-secondary transition-colors group">
                <div className="flex-shrink-0 p-2 rounded-full bg-white/10 group-hover:bg-secondary/20 transition-colors">
                    <PhoneIcon className="w-5 h-5"/>
                </div>
                <div className="flex flex-col">
                    <span className="text-sm text-gray-300 font-bold">{t('footer.phone')}</span>
                    <span className="font-black" dir="ltr">{settings.company.phone}</span>
                </div>
            </a>
            <a href={`https://wa.me/${settings.company.whatsappNumber}`} aria-label={t('footer.whatsappUs')} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-white hover:text-secondary transition-colors group">
                <div className="flex-shrink-0 p-2 rounded-full bg-white/10 group-hover:bg-secondary/20 transition-colors">
                    <WhatsappIcon className="w-5 h-5"/>
                </div>
                <div className="flex flex-col">
                    <span className="text-sm text-gray-300 font-bold">{t('footer.whatsapp')}</span>
                    <span className="font-black" dir="ltr">{settings.company.whatsappNumber}</span>
                </div>
            </a>
            <a href={`mailto:${settings.company.email}`} aria-label={t('footer.emailUs')} className="flex items-center gap-3 text-white hover:text-secondary transition-colors group">
                <div className="flex-shrink-0 p-2 rounded-full bg-white/10 group-hover:bg-secondary/20 transition-colors">
                    <MailIcon className="w-5 h-5"/>
                </div>
                <div className="flex flex-col">
                    <span className="text-sm text-gray-300 font-bold">{t('footer.email')}</span>
                    <span className="font-black">{settings.company.email}</span>
                </div>
            </a>
            <div className="flex items-start gap-3 text-white">
                <div className="flex-shrink-0 p-2 rounded-full bg-white/10 mt-1">
                    <LocationMarkerIcon className="w-5 h-5"/>
                </div>
                <div className="flex flex-col">
                    <span className="text-sm text-gray-300 font-bold">{t('footer.address')}</span>
                    <span className="font-black">{language === 'ar' ? settings.company.address_ar: settings.company.address_en}</span>
                </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-black border-b-2 border-secondary pb-2">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2 font-extrabold">
              <li><button onClick={() => setPage('home')} className="hover:text-secondary transition-colors">{t('header.home')}</button></li>
              <li><button onClick={() => setPage('products')} className="hover:text-secondary transition-colors">{t('header.products')}</button></li>
              <li><button onClick={() => setPage('privacy')} className="hover:text-secondary transition-colors">{t('footer.privacy')}</button></li>
              <li><button onClick={() => setPage('terms')} className="hover:text-secondary transition-colors">{t('footer.terms')}</button></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-xl font-black border-b-2 border-secondary pb-2">{t('footer.location')}</h3>
            <div className="overflow-hidden rounded-lg border-2 border-primary-light">
              <iframe
                src={`https://www.google.com/maps?q=${encodeURIComponent(settings.company.address_en)}&output=embed`}
                width="100%"
                height="150"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/20 pt-6 mt-8 text-center">
            <div className="flex justify-center items-center gap-4 mb-4 flex-wrap">
                {settings.social.facebook && <a href={settings.social.facebook} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full text-white bg-white/10 hover:bg-[#3b5998] transition-all duration-300 transform hover:scale-110"><FacebookIcon /></a>}
                {settings.social.instagram && <a href={settings.social.instagram} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full text-white bg-white/10 hover:bg-[#E1306C] transition-all duration-300 transform hover:scale-110"><InstagramIcon /></a>}
                {settings.social.telegram && <a href={settings.social.telegram} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full text-white bg-white/10 hover:bg-[#0088cc] transition-all duration-300 transform hover:scale-110"><TelegramIcon /></a>}
                {settings.social.youtube && <a href={settings.social.youtube} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full text-white bg-white/10 hover:bg-[#FF0000] transition-all duration-300 transform hover:scale-110"><YoutubeIcon /></a>}
                {settings.social.snapchat && <a href={settings.social.snapchat} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full text-white bg-white/10 hover:bg-[#FFFC00] hover:text-black transition-all duration-300 transform hover:scale-110"><SnapchatIcon /></a>}
                {settings.social.tiktok && <a href={settings.social.tiktok} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full text-white bg-white/10 hover:bg-[#000000] transition-all duration-300 transform hover:scale-110"><TiktokIcon /></a>}
                {settings.social.whatsapp && <a href={settings.social.whatsapp} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full text-white bg-white/10 hover:bg-[#25D366] transition-all duration-300 transform hover:scale-110"><WhatsappIcon /></a>}
                {settings.social.linktree && <a href={settings.social.linktree} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full text-white bg-white/10 hover:bg-[#43E660] transition-all duration-300 transform hover:scale-110"><LinktreeIcon /></a>}
            </div>
            <p className="text-white font-black">&copy; {new Date().getFullYear()} {t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
};
