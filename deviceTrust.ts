const TRUSTED_DEVICES_KEY = 'delta-stars-trusted-devices';

/**
 * Retrieves the trusted devices map from localStorage.
 */
const getTrustedDevices = (): { [identifier: string]: boolean } => {
  try {
    const data = localStorage.getItem(TRUSTED_DEVICES_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error("Failed to parse trusted devices from localStorage", error);
    return {};
  }
};

/**
 * Saves the trusted devices map to localStorage.
 */
const saveTrustedDevices = (devices: { [identifier: string]: boolean }): void => {
  localStorage.setItem(TRUSTED_DEVICES_KEY, JSON.stringify(devices));
};

/**
 * Checks if a device is trusted for a given identifier (email or phone).
 */
export const isDeviceTrusted = (identifier: string): boolean => {
  if (!identifier) return false;
  const devices = getTrustedDevices();
  return !!devices[identifier.toLowerCase()];
};

/**
 * Marks the current device as trusted for a given identifier.
 */
export const trustDevice = (identifier: string): void => {
  if (!identifier) return;
  const devices = getTrustedDevices();
  devices[identifier.toLowerCase()] = true;
  saveTrustedDevices(devices);
};

/**
 * Forgets a trusted device for a given identifier.
 * Useful for logout or security actions.
 */
export const forgetDevice = (identifier: string): void => {
  if (!identifier) return;
  const devices = getTrustedDevices();
  delete devices[identifier.toLowerCase()];
  saveTrustedDevices(devices);
};
