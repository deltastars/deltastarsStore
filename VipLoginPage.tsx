
import React, { useState, useEffect } from 'react';
import { useI18n, useGeminiAi } from '../contexts/I18nContext';
import { useToast } from '../contexts/ToastContext';
import { LogoIcon, EyeIcon, EyeOffIcon, FingerprintIcon } from './lib/Icons';
import { Page } from '../types';
import api, { ApiError } from './lib/api';
import { isWebAuthnSupported, isVipFingerprintRegistered, registerVipFingerprint, loginWithVipFingerprint } from './lib/webAuthn';

// Helper to extract user-friendly message from ApiError for local use
const getErrorMessage = (err: any, defaultMsg: string, t: Function) => {
     if (err instanceof ApiError) {
         if (err.status === 0) return t('errors.networkError');
         if (err.status === 401) return t('errors.unauthorized');
         if (err.status === 403) return t('errors.forbidden');
         if (err.status >= 500) return t('errors.unknownApiError');
         return err.message || defaultMsg;
     }
     return defaultMsg;
};

// --- GENERIC OTP MODAL (for Password Reset) ---
const OtpModal: React.FC<{
  phone: string,
  onClose: () => void,
  onSuccess: () => void,
}> = ({ phone, onClose, onSuccess }) => {
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
        const fallbackCode = '123123';
        setVerificationCode(fallbackCode);
        console.warn(`DEV ONLY: Fallback OTP code for ${phone} is: ${fallbackCode}`);
        setStep('enterCode');
    };

    const handleRequestCode = async () => {
        setStep('loading');
        setError('');
        
        if (geminiStatus === 'ready' && ai) {
            try {
                const codeResponse = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: `Generate a secure 6-digit numerical verification code. Respond with only the 6 digits.` });
                const extractedCode = codeResponse.text.trim().match(/\d{6}/)?.[0];
                if (!extractedCode) { useFallback(); return; }
                setVerificationCode(extractedCode);
                console.log(`DEV ONLY: Verification code for ${phone} is: ${extractedCode}`);
                setStep('enterCode');
            } catch (e) { useFallback(); }
        } else { useFallback(); }
    };
    
    useState(() => { handleRequestCode(); });

    const handleCodeSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (code === verificationCode) {
            setStep('createPassword');
        } else {
            setError(t('auth.otp.invalidCode'));
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); setError('');
        if (newPassword !== confirmPassword) { setError(t('auth.passwordMismatch')); return; }
        if (newPassword.length < 6) { setError(t('vip.login.password.minLengthError')); return; }
        try {
            await api.post('/auth/vip/reset-password/', { phone, new_password: newPassword });
            setStep('success');
        } catch (err: any) {
            setError(getErrorMessage(err, t('dashboard.security.changeError'), t));
        }
    };
    
    const title = t('vip.login.password.resetTitle');
    const instruction = t('auth.otp.sentToPhone', { phone });

    const renderStep = () => {
        switch (step) {
            case 'loading': return <div className="text-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div><p className="text-primary font-bold">{t('auth.otp.generatingCode')}</p></div>;
            case 'enterCode': return (<form onSubmit={handleCodeSubmit}><h2 className="text-2xl font-bold text-primary mb-2 text-center">{title}</h2><p className="text-black mb-4 text-center font-semibold" dangerouslySetInnerHTML={{ __html: instruction }}></p>
                <input type="text" value={code} onChange={e => setCode(e.target.value)} placeholder={t('auth.otp.placeholder')} className="w-full p-3 border rounded mb-4 text-center tracking-widest font-semibold" required />{error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}<button type="submit" className="bg-primary text-white py-2 px-6 rounded w-full font-bold">{t('auth.otp.verify')}</button></form>);
            case 'createPassword': return (<form onSubmit={handlePasswordSubmit}><h2 className="text-2xl font-bold text-primary mb-4">{t('auth.createNewPassword')}</h2><div className="relative mb-4"><input type={showNewPassword ? 'text' : 'password'} placeholder={t('auth.newPassword')} value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full p-3 border rounded font-semibold" required /><button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute inset-y-0 end-0 flex items-center px-3 text-gray-600" aria-label={showNewPassword ? t('auth.hidePassword') : t('auth.showPassword')}>{showNewPassword ? <EyeOffIcon /> : <EyeIcon />}</button></div><div className="relative mb-4"><input type={showConfirmPassword ? 'text' : 'password'} placeholder={t('auth.confirmPassword')} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full p-3 border rounded font-semibold" required /><button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 end-0 flex items-center px-3 text-gray-600" aria-label={showConfirmPassword ? t('auth.hidePassword') : t('auth.showPassword')}>{showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}</button></div>{error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}<button type="submit" className="bg-primary text-white py-2 px-6 rounded w-full font-bold">{t('auth.changePasswordButton')}</button></form>);
            case 'success': return (<div className="text-center"><h2 className="text-2xl font-bold text-primary mb-4">{t('auth.otp.successTitle')}</h2><p className="text-black mb-6 font-semibold">{t('auth.otp.successSubtitle')}</p><button onClick={onClose} className="bg-primary text-white py-2 px-6 rounded font-bold">{t('auth.ok')}</button></div>);
            default: return null;
        }
    };

    return (<div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4"><div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative"><button onClick={onClose} className="absolute top-2 end-3 text-gray-400 hover:text-gray-800 text-3xl font-bold">&times;</button>{renderStep()}</div></div>);
};

const ForgotPasswordFlow: React.FC<{onClose: () => void}> = ({ onClose }) => {
    const { t } = useI18n();
    const [phone, setPhone] = useState('');
    const [step, setStep] = useState('enterPhone');
    
    if (step === 'enterPhone') {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 text-center">
                <h2 className="text-2xl font-bold text-primary mb-4">{t('vip.login.password.resetTitle')}</h2>
                <form onSubmit={(e) => { e.preventDefault(); setStep('verifyOtp'); }}>
                    <p className="text-black mb-4 font-semibold">{t('vip.login.password.resetSubtitle')}</p>
                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder={t('vip.login.phone')} className="w-full p-3 border rounded mb-4 font-semibold" required />
                    <button type="submit" className="bg-primary text-white py-2 px-6 rounded w-full font-bold">{t('vip.login.password.sendCode')}</button>
                </form>
            </div>
            </div>
        );
    }
    
    return <OtpModal phone={phone} onClose={onClose} onSuccess={onClose} />;
};


// --- REGISTRATION MODAL ---
const VipRegistrationModal: React.FC<{
    phone: string;
    companyName: string;
    onClose: () => void;
    onSuccess: () => void;
}> = ({ phone, companyName, onClose, onSuccess }) => {
    const { t } = useI18n();
    const { ai, status: geminiStatus } = useGeminiAi();

    const [step, setStep] = useState<'enterOtp' | 'createPassword'>('enterOtp');
    const [otp, setOtp] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoadingCode, setIsLoadingCode] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useState(() => {
        const useFallback = () => {
            const fallbackCode = '123123';
            setVerificationCode(fallbackCode);
            console.warn(`DEV ONLY: Fallback registration code for ${phone} is: ${fallbackCode}`);
        };

        const generateCode = async () => {
            setIsLoadingCode(true); setError('');
            if (geminiStatus === 'ready' && ai) {
                try {
                    const codeResponse = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: `Generate a secure 6-digit numerical verification code. Respond with only the 6 digits.` });
                    const extractedCode = codeResponse.text.trim().match(/\d{6}/)?.[0];
                    if (!extractedCode) { useFallback(); } 
                    else {
                        setVerificationCode(extractedCode);
                        console.log(`DEV ONLY: Registration code for ${phone} is: ${extractedCode}`);
                    }
                } catch (e) { useFallback(); }
            } else if (geminiStatus === 'error') { useFallback(); }
            
            if (geminiStatus !== 'loading') setIsLoadingCode(false);
        };
        
        generateCode();
    });


    const handleOtpSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (otp === verificationCode) {
            setError(''); setStep('createPassword');
        } else {
            setError(t('auth.otp.invalidCode'));
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); setError('');
        if (password !== confirmPassword) { setError(t('auth.passwordMismatch')); return; }
        if (password.length < 6) { setError(t('vip.login.password.minLengthError')); return; }
        
        try {
            await api.post('/auth/vip/register/', { phone, company_name: companyName, password });
            onSuccess();
        } catch(err: any) {
            setError(getErrorMessage(err, t('vip.login.registration.phoneExists'), t));
        }
    };

    const renderContent = () => {
        if (isLoadingCode) return <div className="text-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div><p className="text-primary font-bold">{t('auth.otp.generatingCode')}</p></div>;

        switch (step) {
            case 'enterOtp': return (<form onSubmit={handleOtpSubmit} className="text-center"><h2 className="text-2xl font-bold text-primary mb-2">{t('auth.otp.title')}</h2><p className="text-black mb-4 font-semibold" dangerouslySetInnerHTML={{ __html: t('auth.otp.sentToPhone', { phone }) }}></p>
                <input type="text" value={otp} onChange={e => setOtp(e.target.value)} placeholder={t('auth.otp.placeholder')} className="w-full p-3 border rounded mb-4 text-center tracking-widest font-semibold" required />{error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}<button type="submit" className="bg-primary text-white py-2 px-6 rounded w-full font-bold">{t('auth.otp.verify')}</button></form>);
            case 'createPassword': return (<form onSubmit={handlePasswordSubmit}><h2 className="text-2xl font-bold text-primary mb-4 text-center">{t('auth.createNewPassword')}</h2><div className="relative mb-4"><input type={showPassword ? 'text' : 'password'} placeholder={t('auth.newPassword')} value={password} onChange={e => setPassword(e.target.value)} className="w-full p-3 border rounded font-semibold" required /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 end-0 flex items-center px-3 text-gray-600" aria-label={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}>{showPassword ? <EyeOffIcon /> : <EyeIcon />}</button></div><div className="relative mb-4"><input type={showConfirmPassword ? 'text' : 'password'} placeholder={t('auth.confirmPassword')} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full p-3 border rounded font-semibold" required /><button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 end-0 flex items-center px-3 text-gray-600" aria-label={showConfirmPassword ? t('auth.hidePassword') : t('auth.showPassword')}>{showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}</button></div>{error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}<button type="submit" className="bg-primary text-white py-2 px-6 rounded w-full font-bold">{t('auth.createAccount')}</button></form>);
        }
    };

    return (<div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4"><div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative"><button onClick={onClose} className="absolute top-2 end-3 text-gray-400 hover:text-gray-800 text-3xl font-bold">&times;</button>{renderContent()}</div></div>);
};


// --- MAIN COMPONENT ---
interface VipLoginPageProps {
  onLogin: (credentials: {phone: string, password: string}) => Promise<{success: boolean, error?: string}>;
  setPage: (page: Page) => void;
}

export const VipLoginPage: React.FC<VipLoginPageProps> = ({ onLogin, setPage }) => {
  const { t } = useI18n();
  const { addToast } = useToast();
  const [isLoginView, setIsLoginView] = useState(true);
  
  const [loginPhone, setLoginPhone] = useState(() => localStorage.getItem('delta-vip-remember') || '');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => !!localStorage.getItem('delta-vip-remember'));
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [isFingerprintAvailable, setIsFingerprintAvailable] = useState(false);

  const [regPhone, setRegPhone] = useState('');
  const [regCompanyName, setRegCompanyName] = useState('');
  const [regError, setRegError] = useState('');
  const [showRegModal, setShowRegModal] = useState(false);
  
  useEffect(() => {
      // Check if fingerprint is available for this device AND if this specific user has registered one (mocked by localStorage)
      if (isWebAuthnSupported() && loginPhone && isVipFingerprintRegistered(loginPhone)) {
          setIsFingerprintAvailable(true);
      } else {
          setIsFingerprintAvailable(false);
      }
  }, [loginPhone]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (rememberMe) localStorage.setItem('delta-vip-remember', loginPhone);
    else localStorage.removeItem('delta-vip-remember');
    
    setIsLoading(true);
    const result = await onLogin({ phone: loginPhone, password: loginPassword });
    if (!result.success) {
      setLoginError(result.error || t('vip.login.error'));
    } else {
         // Success - prompt for fingerprint registration if not present
         if (isWebAuthnSupported() && !isVipFingerprintRegistered(loginPhone)) {
             setTimeout(async () => {
                await registerVipFingerprint(loginPhone);
             }, 500);
         }
    }
    setIsLoading(false);
  };
  
  const handleBiometricLogin = async () => {
      if (!loginPhone) {
          setLoginError("Please enter your phone number to use fingerprint.");
          return;
      }
      setIsLoading(true);
      const authenticatedPhone = await loginWithVipFingerprint(loginPhone);
      setIsLoading(false);
      
      if (authenticatedPhone) {
           // Mock VIP login via biometric
           // In real app, token exchange happens here
           // We are simulating a password login since we don't have a real backend to verify signature
           // Let's try to login with a "magic" flag or just re-use the onLogin with a bypass
           const result = await onLogin({ phone: authenticatedPhone, password: 'vip' }); // NOTE: This assumes the default 'vip' password for demo purposes.
           if (!result.success) {
               // Fallback if password changed
                const users = JSON.parse(localStorage.getItem('delta-vip-users-db') || '{}');
                if (users[authenticatedPhone]) {
                     await onLogin({ phone: authenticatedPhone, password: users[authenticatedPhone].password });
                } else {
                    setLoginError("Biometric auth successful, but account sync failed.");
                }
           } else {
               addToast("Logged in with Fingerprint", 'success');
           }
      } else {
          setLoginError("Fingerprint not recognized.");
      }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    if (!regPhone.match(/^\+?\d{9,15}$/)) { setRegError(t('vip.login.registration.phoneInvalid')); return; }
    
    try {
        await api.post('/auth/vip/check-phone/', { phone: regPhone });
        setShowRegModal(true);
    } catch(err: any) {
        setRegError(getErrorMessage(err, t('vip.login.registration.phoneExists'), t));
    }
  };

  const handleRegistrationSuccess = () => {
    setShowRegModal(false);
    addToast(t('vip.login.registration.registerSuccess'), 'success');
    setRegPhone(''); setRegCompanyName(''); setIsLoginView(true);
  };

  return (
    <div className="bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {showForgotPasswordModal && <ForgotPasswordFlow onClose={() => setShowForgotPasswordModal(false)} />}
      {showRegModal && <VipRegistrationModal phone={regPhone} companyName={regCompanyName} onClose={() => setShowRegModal(false)} onSuccess={handleRegistrationSuccess} />}
      
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div>
          <LogoIcon className="mx-auto h-16 w-auto" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-primary">{isLoginView ? t('vip.login.title') : t('vip.login.registration.title')}</h2>
          <p className="mt-2 text-center text-sm text-black font-bold">{isLoginView ? t('vip.login.subtitle') : t('vip.login.registration.subtitle')}</p>
        </div>

        {isLoginView ? (
          <>
            <form className="mt-8 space-y-6" onSubmit={handleLoginSubmit}>
              <div className="rounded-md shadow-sm -space-y-px">
                <input type="tel" autoComplete="tel" required placeholder={t('vip.login.phone')} value={loginPhone} onChange={(e) => setLoginPhone(e.target.value)} className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-black rounded-t-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm font-semibold" />
                <div className="relative">
                    <input type={showPassword ? 'text' : 'password'} autoComplete="current-password" required placeholder={t('vip.login.password.current')} value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-black rounded-b-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm font-semibold" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 end-0 flex items-center px-3 text-gray-600 z-20" aria-label={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}>
                        {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                </div>
              </div>
              <div className="flex items-center justify-between"><div className="flex items-center"><input id="remember-me" type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" /><label htmlFor="remember-me" className="ms-2 block text-sm text-black font-semibold">{t('vip.login.rememberMe')}</label></div><div className="text-sm"><button type="button" onClick={() => setShowForgotPasswordModal(true)} className="font-bold text-primary hover:text-primary-light">{t('vip.login.forgotPassword')}</button></div></div>
              {loginError && <p className="text-red-500 text-sm text-center">{loginError}</p>}
              <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-md text-white bg-primary hover:bg-primary-light transition-colors disabled:bg-primary-light">{isLoading ? "..." : t('vip.login.loginButton')}</button>
              
              {isFingerprintAvailable && (
                  <button
                    type="button"
                    onClick={handleBiometricLogin}
                    disabled={isLoading}
                    className="group relative w-full flex justify-center items-center gap-2 py-3 px-4 border border-gray-300 text-sm font-bold rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors mt-2"
                  >
                    <FingerprintIcon className="w-5 h-5" />
                    <span>Login with Fingerprint</span>
                  </button>
              )}
            </form>
            <p className="text-center text-sm font-semibold">{t('vip.login.noAccount')}{' '}<button type="button" onClick={() => setIsLoginView(false)} className="font-bold text-primary hover:text-primary-light">{t('vip.login.registerButton')}</button></p>
          </>
        ) : (
          <>
            <form className="mt-8 space-y-6" onSubmit={handleRegisterSubmit}>
              <div className="rounded-md shadow-sm -space-y-px">
                  <input type="text" required placeholder={t('vip.login.registration.companyName')} value={regCompanyName} onChange={(e) => setRegCompanyName(e.target.value)} className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-black rounded-t-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm font-semibold" />
                  <input type="tel" required placeholder={t('vip.login.phone')} value={regPhone} onChange={(e) => setRegPhone(e.target.value)} className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-black rounded-b-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm font-semibold" />
              </div>
              {regError && <p className="text-red-500 text-sm text-center">{regError}</p>}
              <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-md text-white bg-primary hover:bg-primary-light transition-colors">{t('vip.login.registerButton')}</button>
            </form>
            <p className="text-center text-sm font-semibold">{t('vip.login.haveAccount')}{' '}<button type="button" onClick={() => setIsLoginView(true)} className="font-bold text-primary hover:text-primary-light">{t('vip.login.backToLogin')}</button></p>
          </>
        )}
         <div className="text-center mt-6"><button onClick={() => setPage('home')} className="font-bold text-primary hover:text-primary-light">{t('vip.login.backToMainStore')} &rarr;</button></div>
      </div>
    </div>
  );
};
