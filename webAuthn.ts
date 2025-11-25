
// This file simulates the Web Authentication API (WebAuthn) flow.
// In a real-world application, this would involve server-side challenges
// and the `navigator.credentials` API to interact with device authenticators.
// For this project, we use localStorage to mock the registration of a device.

const ADMIN_FINGERPRINT_KEY = 'delta-stars-fingerprint-user';
const VIP_FINGERPRINT_KEY = 'delta-stars-vip-fingerprints';

/**
 * Checks if the browser supports the Web Authentication API.
 */
export const isWebAuthnSupported = (): boolean => {
  return typeof window.PublicKeyCredential !== 'undefined';
};

// --- ADMIN FINGERPRINT ---

export const isFingerprintRegistered = (): boolean => {
  return localStorage.getItem(ADMIN_FINGERPRINT_KEY) !== null;
};

export const registerFingerprint = (email: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const consent = window.confirm(`Do you want to enable fingerprint login for ${email} on this device?`);
    if (consent) {
      localStorage.setItem(ADMIN_FINGERPRINT_KEY, email);
      alert('Fingerprint login has been enabled for this device.');
      resolve(true);
    } else {
      resolve(false);
    }
  });
};

export const loginWithFingerprint = (): Promise<string | null> => {
   return new Promise((resolve) => {
    setTimeout(() => {
        const userEmail = localStorage.getItem(ADMIN_FINGERPRINT_KEY);
        resolve(userEmail);
    }, 500);
  });
};

export const removeFingerprint = (): void => {
  localStorage.removeItem(ADMIN_FINGERPRINT_KEY);
};


// --- VIP FINGERPRINT (Multi-user Mock) ---

const getVipFingerprints = (): { [phone: string]: boolean } => {
  try {
    const data = localStorage.getItem(VIP_FINGERPRINT_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error("Failed to parse VIP fingerprints from localStorage", error);
    return {};
  }
};

const saveVipFingerprints = (fingerprints: { [phone: string]: boolean }): void => {
  localStorage.setItem(VIP_FINGERPRINT_KEY, JSON.stringify(fingerprints));
};

/**
 * Checks if a fingerprint is registered for a specific VIP phone number.
 */
export const isVipFingerprintRegistered = (phone: string): boolean => {
  if (!phone) return false;
  const fingerprints = getVipFingerprints();
  return !!fingerprints[phone];
};

/**
 * Simulates registering a fingerprint for a VIP user.
 */
export const registerVipFingerprint = (phone: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const consent = window.confirm(`Do you want to enable fingerprint login for ${phone} on this device?`);
    if (consent) {
      const fingerprints = getVipFingerprints();
      fingerprints[phone] = true;
      saveVipFingerprints(fingerprints);
      alert('Fingerprint login has been enabled for this account on this device.');
      resolve(true);
    } else {
      resolve(false);
    }
  });
};

/**
 * Simulates logging in with a fingerprint for a specific VIP user.
 * This mock requires the phone number to be provided first.
 */
export const loginWithVipFingerprint = (phone: string): Promise<string | null> => {
   return new Promise((resolve) => {
    setTimeout(() => {
        const isRegistered = isVipFingerprintRegistered(phone);
        resolve(isRegistered ? phone : null);
    }, 500);
  });
};

/**
 * Removes fingerprint registration for a specific VIP user.
 */
export const removeVipFingerprint = (phone: string): void => {
  const fingerprints = getVipFingerprints();
  delete fingerprints[phone];
  saveVipFingerprints(fingerprints);
};
