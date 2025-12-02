// src/consent-manager.ts
class ConsentManager {
  storageKey = "oops-catcher-consent";
  consentState = null;
  constructor() {
    this.loadConsent();
  }
  loadConsent() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      this.consentState = stored ? JSON.parse(stored) : null;
    } catch (e) {
      console.warn("Failed to load consent:", e);
      this.consentState = null;
    }
  }
  saveConsent() {
    if (!this.consentState)
      return;
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.consentState));
    } catch (e) {
      console.warn("Failed to save consent:", e);
    }
  }
  grantConsent(preferences = {}) {
    this.consentState = {
      granted: true,
      timestamp: new Date().toISOString(),
      preferences: {
        userAgent: true,
        platform: true,
        screenResolution: true,
        viewport: true,
        online: true,
        cookiesEnabled: true,
        pixelRatio: true,
        language: preferences.language ?? true,
        timezone: preferences.timezone ?? true,
        memory: preferences.memory ?? true,
        cores: preferences.cores ?? true,
        touchSupport: preferences.touchSupport ?? true,
        colorDepth: preferences.colorDepth ?? true
      }
    };
    this.saveConsent();
  }
  revokeConsent() {
    this.consentState = null;
    try {
      localStorage.removeItem(this.storageKey);
    } catch (e) {
      console.warn("Failed to remove consent:", e);
    }
  }
  hasConsent() {
    return this.consentState?.granted ?? false;
  }
  getConsentState() {
    return this.consentState;
  }
  isFieldAllowed(field) {
    if (!this.hasConsent())
      return false;
    const preferences = this.consentState?.preferences;
    if (!preferences)
      return false;
    const requiredFields = [
      "userAgent",
      "platform",
      "screenResolution",
      "viewport",
      "online",
      "cookiesEnabled",
      "pixelRatio"
    ];
    if (requiredFields.includes(field))
      return true;
    return preferences[field] ?? false;
  }
}
export {
  ConsentManager
};
