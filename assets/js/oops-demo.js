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

// src/oops-demo.ts
class OopsDemo {
  config;
  consent;
  consoleErrors = [];
  maxConsoleErrors;
  constructor(config) {
    this.config = config;
    this.maxConsoleErrors = config.maxConsoleErrors || 20;
    this.consent = new ConsentManager;
    if (config.captureConsole) {
      this.setupConsoleCapture();
    }
  }
  setupConsoleCapture() {
    const originalError = console.error;
    const self = this;
    console.error = function(...args) {
      originalError.apply(console, args);
      const message = args.map((arg) => typeof arg === "object" ? JSON.stringify(arg) : String(arg)).join(" ");
      self.consoleErrors.push({
        message,
        timestamp: new Date().toISOString(),
        type: "error",
        url: window.location.href
      });
      if (self.consoleErrors.length > self.maxConsoleErrors) {
        self.consoleErrors.shift();
      }
    };
  }
  getSystemInfo() {
    if (!this.consent.hasConsent()) {
      throw new Error("User consent required. Call grantConsent() first.");
    }
    const ua = navigator.userAgent;
    const isAppleSilicon = ua.includes("Mac") && navigator.maxTouchPoints > 0;
    let platformInfo = navigator.platform;
    if (isAppleSilicon) {
      platformInfo = "macOS (Apple Silicon)";
    }
    const systemInfo = {
      userAgent: ua,
      platform: platformInfo,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      online: navigator.onLine,
      cookiesEnabled: navigator.cookieEnabled,
      pixelRatio: window.devicePixelRatio
    };
    if (this.consent.isFieldAllowed("language")) {
      systemInfo.language = navigator.language;
    }
    if (this.consent.isFieldAllowed("timezone")) {
      systemInfo.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    }
    if (this.consent.isFieldAllowed("memory")) {
      const memory = navigator.deviceMemory;
      if (memory)
        systemInfo.memory = `${memory} GB`;
    }
    if (this.consent.isFieldAllowed("cores")) {
      systemInfo.cores = navigator.hardwareConcurrency;
    }
    if (this.consent.isFieldAllowed("touchSupport")) {
      systemInfo.touchSupport = navigator.maxTouchPoints > 0;
    }
    if (this.consent.isFieldAllowed("colorDepth")) {
      systemInfo.colorDepth = `${window.screen.colorDepth}-bit`;
    }
    return systemInfo;
  }
  catch(error) {
    const errorMessage = typeof error === "string" ? error : error.message;
    const errorStack = typeof error === "string" ? undefined : error.stack;
    this.consoleErrors.push({
      message: errorMessage,
      stack: errorStack,
      timestamp: new Date().toISOString(),
      type: "error",
      url: window.location.href
    });
    if (this.consoleErrors.length > this.maxConsoleErrors) {
      this.consoleErrors.shift();
    }
    return this.generateReport();
  }
  generateReport() {
    return {
      systemInfo: this.consent.hasConsent() ? this.getSystemInfo() : null,
      consoleErrors: this.consoleErrors,
      userId: this.config.userId,
      userEmail: this.config.userEmail,
      metadata: this.config.metadata,
      timestamp: new Date().toISOString()
    };
  }
  async report(userReport) {
    const isBugReport = userReport.category === "bug" || userReport.severity !== undefined;
    const report = {
      userReport,
      systemInfo: isBugReport && this.consent.hasConsent() ? this.getSystemInfo() : null,
      consoleErrors: isBugReport ? this.consoleErrors : undefined,
      userId: this.config.userId,
      userEmail: this.config.userEmail,
      metadata: this.config.metadata,
      timestamp: new Date().toISOString()
    };
    console.group("\uD83D\uDCE6 Oops.report() - Submission");
    console.log("Report:", report);
    console.groupEnd();
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      success: true,
      message: "Report submitted successfully",
      id: "demo-" + Date.now()
    };
  }
  getConsoleErrors() {
    return this.consoleErrors;
  }
}
function initOops(config) {
  return new OopsDemo(config);
}
export {
  initOops,
  OopsDemo
};
