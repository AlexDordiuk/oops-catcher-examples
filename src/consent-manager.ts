/**
 * Consent Manager - Privacy-first consent management
 * Simulates the consent system from Oops Catcher SDK
 */

export interface ConsentPreferences {
  // Required fields - always collected
  userAgent: boolean
  platform: boolean
  screenResolution: boolean
  viewport: boolean
  online: boolean
  cookiesEnabled: boolean
  pixelRatio: boolean

  // Optional fields - user can opt in/out
  language?: boolean
  timezone?: boolean
  memory?: boolean
  cores?: boolean
  touchSupport?: boolean
  colorDepth?: boolean
}

export interface ConsentState {
  granted: boolean
  timestamp: string
  preferences: ConsentPreferences
}

export class ConsentManager {
  private storageKey = 'oops-catcher-consent'
  private consentState: ConsentState | null = null

  constructor() {
    this.loadConsent()
  }

  private loadConsent(): void {
    try {
      const stored = localStorage.getItem(this.storageKey)
      this.consentState = stored ? JSON.parse(stored) : null
    } catch (e) {
      console.warn('Failed to load consent:', e)
      this.consentState = null
    }
  }

  private saveConsent(): void {
    if (!this.consentState) return

    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.consentState))
    } catch (e) {
      console.warn('Failed to save consent:', e)
    }
  }

  grantConsent(preferences: Partial<Omit<ConsentPreferences, 'userAgent' | 'platform' | 'screenResolution' | 'viewport' | 'online' | 'cookiesEnabled' | 'pixelRatio'>> = {}): void {
    this.consentState = {
      granted: true,
      timestamp: new Date().toISOString(),
      preferences: {
        // Required fields - always true
        userAgent: true,
        platform: true,
        screenResolution: true,
        viewport: true,
        online: true,
        cookiesEnabled: true,
        pixelRatio: true,
        // Optional fields - default to true unless explicitly set
        language: preferences.language ?? true,
        timezone: preferences.timezone ?? true,
        memory: preferences.memory ?? true,
        cores: preferences.cores ?? true,
        touchSupport: preferences.touchSupport ?? true,
        colorDepth: preferences.colorDepth ?? true
      }
    }

    this.saveConsent()
  }

  revokeConsent(): void {
    this.consentState = null
    try {
      localStorage.removeItem(this.storageKey)
    } catch (e) {
      console.warn('Failed to remove consent:', e)
    }
  }

  hasConsent(): boolean {
    return this.consentState?.granted ?? false
  }

  getConsentState(): ConsentState | null {
    return this.consentState
  }

  isFieldAllowed(field: keyof ConsentPreferences): boolean {
    if (!this.hasConsent()) return false

    const preferences = this.consentState?.preferences
    if (!preferences) return false

    // Required fields are always allowed
    const requiredFields: (keyof ConsentPreferences)[] = [
      'userAgent', 'platform', 'screenResolution',
      'viewport', 'online', 'cookiesEnabled', 'pixelRatio'
    ]

    if (requiredFields.includes(field)) return true

    // Optional fields - check preference
    return preferences[field] ?? false
  }
}
