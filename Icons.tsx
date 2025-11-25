
import React from 'react';

// Company Logo
export const LogoIcon: React.FC<{ className?: string }> = ({ className }) => (
  <img src="https://lh3.googleusercontent.com/d/1-0qvsPmpVVnWdGJHrlJ4rbtecG-i5n4l" alt="Delta Stars Logo" className={className} />
);

// UI Icons
export const ShoppingCartIcon: React.FC = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
  </svg>
);
export const UserIcon: React.FC = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
  </svg>
);
export const MenuIcon: React.FC = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
);
export const XIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className || "w-6 h-6"} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
);
export const SearchIcon: React.FC<{className?: string}> = ({className}) => (
    <svg className={className || "w-6 h-6"} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
);
export const QualityIcon: React.FC = () => (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
);
export const DeliveryIcon: React.FC = () => (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h8a1 1 0 001-1zM3 11h10"></path></svg>
);
export const SupportIcon: React.FC = () => (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
);
export const TrashIcon: React.FC = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
  </svg>
);
export const LogoutIcon: React.FC = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
  </svg>
);
export const FingerprintIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className || "w-6 h-6"} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c.08 0 .17.01.25.01A4.99 4.99 0 0117 15.75V19a1 1 0 01-1 1H8a1 1 0 01-1-1v-3.25A4.99 4.99 0 0111.75 11c.08 0 .17 0 .25-.01zM12 11V7a2 2 0 00-2-2H8m4 6V5a2 2 0 012-2h2M7 11V5a2 2 0 012-2h2m4 6V5a2 2 0 00-2-2h-2"></path></svg>
);
export const PencilIcon: React.FC = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z"></path></svg>
);
export const PlusIcon: React.FC<{className?: string}> = ({className}) => (
    <svg className={className || "w-6 h-6"} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
);
export const MailIcon: React.FC<{className?: string}> = ({className}) => (
    <svg className={className || "w-6 h-6"} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
);
export const PrintIcon: React.FC = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm7-8V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
    </svg>
);
export const PhoneIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className || "w-6 h-6"} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
);

export const LocationMarkerIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className || "w-6 h-6"} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"></path></svg>
);
export const HeartIcon: React.FC<{className?: string, filled?: boolean}> = ({ className, filled }) => (
  <svg className={className || "w-6 h-6"} fill={filled ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z"></path>
  </svg>
);
export const StarIcon: React.FC<{className?: string, filled?: boolean}> = ({ className, filled }) => (
  <svg className={className || "w-5 h-5"} fill={filled ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" color={filled ? "#ffc107" : "#e0e0e0"}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);

export const ChevronLeftIcon: React.FC<{onClick?: () => void}> = ({onClick}) => (
    <svg onClick={onClick} className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
);

export const ChevronRightIcon: React.FC<{onClick?: () => void}> = ({onClick}) => (
    <svg onClick={onClick} className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
);

export const SparklesIcon: React.FC<{className?: string}> = ({className}) => (
    <svg className={className || "w-6 h-6"} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" d="M9.315 7.585a.75.75 0 011.06 0l1.06 1.06a.75.75 0 001.06 0l1.06-1.06a.75.75 0 111.06 1.06l-1.06 1.06a.75.75 0 000 1.06l1.06 1.06a.75.75 0 11-1.06 1.06l-1.06-1.06a.75.75 0 00-1.06 0l-1.06 1.06a.75.75 0 11-1.06-1.06l1.06-1.06a.75.75 0 000-1.06l-1.06-1.06a.75.75 0 010-1.06zM5.25 7.5A.75.75 0 016 6.75h.75a.75.75 0 010 1.5H6a.75.75 0 01-.75-.75zM8.25 4.5A.75.75 0 019 3.75h.75a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75zM5.25 10.5A.75.75 0 016 9.75h.75a.75.75 0 010 1.5H6a.75.75 0 01-.75-.75zM12.75 4.5A.75.75 0 0113.5 3.75h.75a.75.75 0 010 1.5h-.75a.75.75 0 01-.75-.75zM12 7.5a.75.75 0 01.75-.75h.75a.75.75 0 010 1.5h-.75A.75.75 0 0112 7.5zM12 10.5a.75.75 0 01.75-.75h.75a.75.75 0 010 1.5h-.75a.75.75 0 01-.75-.75z" clipRule="evenodd" />
    </svg>
);


export const ChartBarIcon: React.FC<{className?: string}> = ({className}) => (
    <svg className={className || "w-6 h-6"} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
);

export const EyeIcon: React.FC<{className?: string}> = ({className}) => (
    <svg className={className || "w-5 h-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
);

export const EyeOffIcon: React.FC<{className?: string}> = ({className}) => (
    <svg className={className || "w-5 h-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7 .946-3.11 3.522-5.44 6.696-6.15M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c1.13 0 2.21.188 3.22.524M21.542 12c-1.274 4.057-5.064 7-9.542 7a10.02 10.02 0 01-1.42-.125M18.364 18.364L5.636 5.636"></path></svg>
);

export const DocumentTextIcon: React.FC = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
);

export const DocumentDownloadIcon: React.FC<{className?: string}> = ({className}) => (
    <svg className={className || "w-6 h-6"} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
);

// Social Icons
export const FacebookIcon: React.FC = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
);
export const InstagramIcon: React.FC = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808.06s-2.784-.012-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808c.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 016.08 2.525c.636-.247 1.363-.416 2.427-.465C9.53 2.013 9.884 2 12.315 2zM12 7a5 5 0 100 10 5 5 0 000-10zm0 8a3 3 0 110-6 3 3 0 010 6zm5.25-9.75a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5z" clipRule="evenodd" /></svg>
);
export const TelegramIcon: React.FC = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22 2L2 9l6 3 3 7 5-5-10-8 16-3z"/></svg>
);
export const YoutubeIcon: React.FC = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M10 15l5-3-5-3v6zm12-4a5 5 0 00-5-5H7a5 5 0 00-5 5v4a5 5 0 005 5h10a5 5 0 005-5v-4z"/></svg>
);
export const SnapchatIcon: React.FC = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-4-4h8v-2h-8v2zm0-4h8v-2h-8v2z"/></svg>
);
export const TiktokIcon: React.FC = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-2.43.03-4.83-.95-6.43-2.88-1.62-1.95-2.2-4.42-1.8-6.83.31-1.9.95-3.69 1.92-5.25.07-.1.14-.19.22-.28.01-.01.01-.02.02-.03.01-.01.01-.01.01-.02.02-.02.03-.04.05-.05.02-.02.05-.04.07-.06.01-.01.01-.01.02-.02l.09-.09c.18-.18.36-.36.55-.52 1.12-1.02 2.4-1.74 3.79-2.22v3.45c-1.36.43-2.62 1.16-3.66 2.14a4.34 4.34 0 00-1.14 3.44c.04 1.34.56 2.64 1.42 3.65.91 1.06 2.25 1.76 3.7 1.72 1.39-.03 2.7-.63 3.6-1.62.91-1 .99-2.37.95-3.71-.01-2.92-.01-5.84-.01-8.75z"/></svg>
);
export const WhatsappIcon: React.FC<{className?: string}> = ({className}) => (
    <svg className={className || "w-6 h-6"} fill="currentColor" viewBox="0 0 24 24"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.38 1.25 4.81L2 22l5.42-1.38c1.37.71 2.93 1.12 4.62 1.12h.01c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zM9.53 7.8c.2-.23.44-.38.7-.38.22 0 .42.02.58.05.28.05.42.33.58.73.18.42.68 1.65.75 1.78.07.13.1.28.01.44-.09.16-.18.23-.36.38-.18.15-.38.23-.55.33-.2.08-.43.16-.68.08-.7-.2-1.29-.48-1.78-.9-1.1-1.05-1.52-2.33-1.6-2.65-.08-.32.08-.48.23-.63zm4.28 5.92c-.22-.12-.82-.4-1.02-.45-.2-.05-.33-.08-.48.08-.15.16-.38.45-.48.55-.08.1-.18.12-.33.05-.15-.08-.63-.23-1.2-.73-.83-.73-1.38-1.63-1.48-1.83-.08-.2.08-.3.23-.42.13-.1.28-.23.4-.35.13-.12.16-.2.23-.33.08-.13.05-.25 0-.33-.05-.08-.48-1.13-.65-1.55-.18-.4-.35-.33-.48-.33h-.4c-.15 0-.38.05-.55.23-.18.18-.68.65-.68 1.58 0 .93.7 1.83.8 1.95.1.13 1.38 2.1 3.35 2.93.48.2.85.33 1.15.43.5.16.95.13 1.3.08.4-.05.82-.2 1.02-.38.2-.18.2-.35.13-.45-.07-.1-.22-.16-.45-.28z"/></svg>
);
export const LinktreeIcon: React.FC = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22 19v-2h-8v2h8zm0-6v-2h-8v2h8zm0-6V5h-8v2h8zM4 19v-2H2v2h2zm0-6v-2H2v2h2zm0-6V5H2v2h2z"/></svg>
);
export const DotsVerticalIcon: React.FC = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path></svg>
);
