
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { AppSettings } from '../types';
import { COMPANY_INFO, SOCIAL_LINKS } from '../constants';

// Default settings based on constants
const DEFAULT_SETTINGS: AppSettings = {
    company: {
        name: COMPANY_INFO.name,
        slogan_ar: COMPANY_INFO.slogan,
        slogan_en: "Your first partner for high-quality fruits and vegetables.",
        phone: COMPANY_INFO.phone,
        whatsappNumber: COMPANY_INFO.whatsapp,
        email: COMPANY_INFO.email,
        address_ar: COMPANY_INFO.address,
        address_en: COMPANY_INFO.address_en,
        map_url: COMPANY_INFO.map_url,
        logoUrl: "https://lh3.googleusercontent.com/d/1-0qvsPmpVVnWdGJHrlJ4rbtecG-i5n4l",
        heroImage: "https://i.imgur.com/e5FNW3p.jpeg",
        showroomBanner: "https://i.imgur.com/gK2x4gW.jpeg",
        primaryColor: "#2d5c2d",
        fontFamily: "'Cairo', sans-serif",
    },
    social: {
        facebook: SOCIAL_LINKS.facebook,
        instagram: SOCIAL_LINKS.instagram,
        telegram: SOCIAL_LINKS.telegram,
        youtube: SOCIAL_LINKS.youtube,
        snapchat: SOCIAL_LINKS.snapchat,
        tiktok: SOCIAL_LINKS.tiktok,
        whatsapp: SOCIAL_LINKS.whatsapp_community,
        linktree: SOCIAL_LINKS.linktree,
    }
};

interface SettingsContextType {
    settings: AppSettings;
    updateSettings: (newSettings: Partial<AppSettings>) => void;
    updateCompanyInfo: (info: Partial<AppSettings['company']>) => void;
    updateSocialLinks: (links: Partial<AppSettings['social']>) => void;
    resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<AppSettings>(() => {
        try {
            const saved = localStorage.getItem('delta-app-settings');
            return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
        } catch (e) {
            return DEFAULT_SETTINGS;
        }
    });

    useEffect(() => {
        localStorage.setItem('delta-app-settings', JSON.stringify(settings));
        
        // Apply Theme Dynamically
        document.documentElement.style.setProperty('--color-primary-default', settings.company.primaryColor);
        document.documentElement.style.setProperty('--color-primary-light', `${settings.company.primaryColor}bf`);
        document.documentElement.style.setProperty('--color-primary-dark', `${settings.company.primaryColor}e6`);
        document.documentElement.style.setProperty('--font-family-base', settings.company.fontFamily);
        
        // Trigger storage event for cross-tab sync
        window.dispatchEvent(new Event('storage'));
    }, [settings]);

    const updateSettings = (newSettings: Partial<AppSettings>) => {
        setSettings(prev => ({ ...prev, ...newSettings }));
    };

    const updateCompanyInfo = (info: Partial<AppSettings['company']>) => {
        setSettings(prev => ({ ...prev, company: { ...prev.company, ...info } }));
    };

    const updateSocialLinks = (links: Partial<AppSettings['social']>) => {
        setSettings(prev => ({ ...prev, social: { ...prev.social, ...links } }));
    };

    const resetSettings = () => {
        setSettings(DEFAULT_SETTINGS);
    };

    return (
        <SettingsContext.Provider value={{ settings, updateSettings, updateCompanyInfo, updateSocialLinks, resetSettings }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};
