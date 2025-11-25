
import React, { useState, useEffect } from 'react';
import { LogoIcon, EyeIcon, EyeOffIcon, FingerprintIcon } from './lib/Icons';
import { Page } from '../types';
import { useI18n, useGeminiAi } from '../contexts/I18nContext';
import { useToast } from '../contexts/ToastContext';
import { isWebAuthnSupported, isFingerprintRegistered, registerFingerprint, loginWithFingerprint } from './lib/webAuthn';

const ADMIN_EMAIL = 'deltastars777@gmail.com';

// --- GENERIC OTP MODAL (for Password Reset) ---
const OtpModal: React.FC<{
  email: string,
  onClose: () => void,
  onSuccess: () => void,
}> = ({ email, onClose, onSuccess }) => {
    const { t } = useI18n();
    const { ai, status: geminiStatus } = useGeminiAi();
    
    const [step, setStep] = useState('request'); // 'request', 'loading', 'enterCode', 'createPassword', 'success'
    const [code, setCode] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const useFallback = () => {
        const fallbackCode = '123456';
        setVerificationCode(fallbackCode);
        console.warn(`DEV ONLY: Fallback OTP code for ${email} is: ${fallbackCode}`);
        setStep('enterCode');
    };

    const handleRequestCode = async () => {
        setStep('loading');
        setError('');
        
        if (geminiStatus === 'ready' && ai) {
            try {
                const codeResponse = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: `Generate a secure 6-digit numerical verification code. Respond with only the 6 digits.` });
                const extractedCode = codeResponse.text.trim().match(/\d{6}/)?.[0];

                if (!extractedCode) {
                    console.error("Gemini API failed to return a 6-digit code, using fallback.", codeResponse.text);
                    useFallback();
                    return;
                }
                setVerificationCode(extractedCode);
                console.log(`DEV ONLY: Verification code for ${email} is: ${extractedCode}`);
                setStep('enterCode');
            } catch (e) {
                console.error("Gemini API error, using fallback:", e);
                useFallback();
            }
        } else {
            useFallback();
        }
    };
    
    // Auto-request code on modal open
    useState(() => {
        handleRequestCode();
    });

    const handleCodeSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (code === verificationCode) {
            setStep('createPassword');
        } else {
            setError(t('auth.otp.invalidCode'));
        }
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (newPassword !== confirmPassword) { setError(t('auth.passwordMismatch')); return; }
        if (newPassword.length < 6) { setError(t('auth.otp.passwordLengthError')); return; }
        
        // In a real app, API call to reset password. Here, we'll just log it.
        console.log(`(Mock) Password for admin reset to: ${newPassword}`);
        localStorage.setItem('delta-stars-admin-auth', JSON.stringify({ password: newPassword, isDefault: false }));
        setStep('success');
    };
    
    const title = t('login.forgotPassword');
    const instruction = t('auth.otp.sentToEmail', { email });

    const renderStep = () => {
        switch (step) {
            case 'request':
            case 'loading':
                return (
                     <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-primary font-bold">{t('auth.otp.generatingCode')}</p>
                    </div>
                );
            case 'enterCode':
                return (
                    <form onSubmit={handleCodeSubmit}>
                        <h2 className="text-2xl font-bold text-primary mb-2 text-center">{title}</h2>
                        <p className="text-black mb-4 text-center font-semibold" dangerouslySetInnerHTML={{ __html: instruction }}></p>
                        <input type="text" value={code} onChange={e => setCode(e.target.value)} placeholder={t('auth.otp.placeholder')} className="w-full p-3 border rounded mb-4 text-center tracking-widest font-semibold" required />
                        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
                        <button type="submit" className="bg-primary text-white py-2 px-6 rounded w-full font-bold">{t('auth.otp.verify')}</button>
                    </form>
                );
            case 'createPassword':
                return (
                    <form onSubmit={handlePasswordSubmit}>
                        <h2 className="text-2xl font-bold text-primary mb-4">{t('auth.createNewPassword')}</h2>
                        <div className="relative mb-4">
                            <input type={showNewPassword ? 'text' : 'password'} placeholder={t('auth.newPassword')} value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full p-3 border rounded font-semibold" required />
                            <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute inset-y-0 end-0 flex items-center px-3 text-gray-600" aria-label={showNewPassword ? t('auth.hidePassword') : t('auth.showPassword')}>
                                {showNewPassword ? <EyeOffIcon /> : <EyeIcon />}
                            </button>
                        </div>
                        <div className="relative mb-4">
                             <input type={showConfirmPassword ? 'text' : 'password'} placeholder={t('auth.confirmPassword')} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full p-3 border rounded font-semibold" required />
                             <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 end-0 flex items-center px-3 text-gray-600" aria-label={showConfirmPassword ? t('auth.hidePassword') : t('auth.showPassword')}>
                                {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                            </button>
                        </div>
                        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
                        <button type="submit" className="bg-primary text-white py-2 px-6 rounded w-full font-bold">{t('auth.changePasswordButton')}</button>
                    </form>
                );
            case 'success':
                 return (
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-primary mb-4">{t('auth.otp.successTitle')}</h2>
                        <p className="text-black mb-6 font-semibold">{t('auth.otp.successSubtitle')}</p>
                        <button onClick={onClose} className="bg-primary text-white py-2 px-6 rounded font-bold">{t('auth.ok')}</button>
                    </div>
                );
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
                 <button onClick={onClose} className="absolute top-2 end-3 text-gray-400 hover:text-gray-800 text-3xl font-bold">&times;</button>
                 {renderStep()}
            </div>
        </div>
    );
};


interface LoginPageProps {
  onLogin: (credentials: {email: string, password: string}) => Promise<{success: boolean, error?: string}>;
  setPage: (page: Page) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, setPage }) => {
  const { t } = useI18n();
  const { addToast } = useToast();
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFingerprintAvailable, setIsFingerprintAvailable] = useState(false);

  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  useEffect(() => {
      const checkBio = async () => {
          if (isWebAuthnSupported() && isFingerprintRegistered()) {
              setIsFingerprintAvailable(true);
          }
      };
      checkBio();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
        setError(t('login.error'));
        return;
    }

    setIsLoading(true);
    const result = await onLogin({ email, password });
    setIsLoading(false);
    
    if (!result.success) {
      setError(result.error || t('login.error'));
    } else {
        // Prompt to register fingerprint if not already registered
        if (isWebAuthnSupported() && !isFingerprintRegistered()) {
            setTimeout(async () => {
                await registerFingerprint(email);
            }, 500);
        }
    }
  };

  const handleBiometricLogin = async () => {
      setIsLoading(true);
      const userEmail = await loginWithFingerprint();
      setIsLoading(false);
      
      if (userEmail === ADMIN_EMAIL) {
          // Bypass password check for biometric (Mock)
          // In real app, you'd verify a signed challenge
          const result = await onLogin({ email: userEmail, password: 'Admin123!' }); // Password disregarded by token logic if using real token exchange usually
          if (!result.success) {
              setError(result.error || t('login.error'));
          } else {
              addToast("Logged in with Fingerprint", 'success');
          }
      } else {
          setError("Biometric authentication failed.");
      }
  };

  return (
    <div className="bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 min-h-screen">
      {showForgotPasswordModal && <OtpModal email={ADMIN_EMAIL} onClose={() => setShowForgotPasswordModal(false)} onSuccess={() => setShowForgotPasswordModal(false)} />}
      
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div>
           <LogoIcon className="mx-auto h-16 w-auto" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-primary">
            {t('login.title')}
          </h2>
          <p className="text-center text-gray-600 text-sm font-bold mt-2">GM & Admin Access Only</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">{t('login.email')}</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm font-semibold"
                placeholder={t('login.email')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="sr-only">{t('login.password')}</label>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm font-semibold"
                placeholder={t('login.password')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 end-0 flex items-center px-3 text-gray-600 z-20"
                  aria-label={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
            </div>
          </div>
          
           <div className="text-right text-sm">
                <button type="button" onClick={() => setShowForgotPasswordModal(true)} className="font-bold text-primary hover:text-primary-light">
                    {t('login.forgotPassword')}
                </button>
            </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-md text-white bg-primary hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:bg-primary-light"
            >
              {isLoading ? "..." : t('login.loginButton')}
            </button>
          </div>

          {isFingerprintAvailable && (
              <div className="mt-4">
                  <button
                    type="button"
                    onClick={handleBiometricLogin}
                    disabled={isLoading}
                    className="group relative w-full flex justify-center items-center gap-2 py-3 px-4 border border-gray-300 text-sm font-bold rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                  >
                    <FingerprintIcon className="w-5 h-5" />
                    <span>Login with Fingerprint</span>
                  </button>
              </div>
          )}

        </form>
         <div className="text-center mt-6">
            <button onClick={() => setPage('home')} className="font-bold text-primary hover:text-primary-light">
                {t('login.backToStore')}
            </button>
        </div>
      </div>
    </div>
  );
};
