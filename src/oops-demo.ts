/**
 * Oops Demo - Simulated SDK for demonstrations
 * This simulates the actual Oops Catcher SDK for live demos
 */

import { ConsentManager } from './consent-manager'

export interface OopsConfig {
  endpoint: string
  apiKey?: string
  captureConsole?: boolean
  maxConsoleErrors?: number
  userId?: string
  userEmail?: string
  metadata?: Record<string, any>
}

export interface UserReport {
  message: string
  description?: string
  category?: 'bug' | 'feedback' | 'question' | 'other'
  severity?: 'low' | 'medium' | 'high' | 'critical'
  screenshot?: string
  attachments?: Array<{
    name: string
    url: string
  }>
  custom?: Record<string, any>
}

export interface SystemInfo {
  userAgent: string
  platform: string
  screenResolution: string
  viewport: string
  online: boolean
  cookiesEnabled: boolean
  pixelRatio: number
  language?: string
  timezone?: string
  memory?: string
  cores?: number
  touchSupport?: boolean
  colorDepth?: string
}

export interface ConsoleError {
  message: string
  stack?: string
  timestamp: string
  type: string
  url?: string
}

export interface OopsReport {
  userReport?: UserReport
  systemInfo: SystemInfo | null
  consoleErrors?: ConsoleError[]
  userId?: string
  userEmail?: string
  metadata?: Record<string, any>
  timestamp: string
}

export interface OopsResponse {
  success: boolean
  message: string
  id: string
}

export class OopsDemo {
  private config: OopsConfig
  public consent: ConsentManager
  private consoleErrors: ConsoleError[] = []
  private maxConsoleErrors: number

  constructor(config: OopsConfig) {
    this.config = config
    this.maxConsoleErrors = config.maxConsoleErrors || 20
    this.consent = new ConsentManager()

    if (config.captureConsole) {
      this.setupConsoleCapture()
    }
  }

  private setupConsoleCapture(): void {
    const originalError = console.error
    const self = this

    console.error = function(...args: any[]) {
      originalError.apply(console, args)

      const message = args.map(arg =>
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      ).join(' ')

      self.consoleErrors.push({
        message,
        timestamp: new Date().toISOString(),
        type: 'error',
        url: window.location.href
      })

      // Limit array size
      if (self.consoleErrors.length > self.maxConsoleErrors) {
        self.consoleErrors.shift()
      }
    }
  }

  private getSystemInfo(): SystemInfo {
    if (!this.consent.hasConsent()) {
      throw new Error('User consent required. Call grantConsent() first.')
    }

    const ua = navigator.userAgent
    const isAppleSilicon = ua.includes('Mac') && navigator.maxTouchPoints > 0
    let platformInfo = navigator.platform
    if (isAppleSilicon) {
      platformInfo = 'macOS (Apple Silicon)'
    }

    const systemInfo: SystemInfo = {
      userAgent: ua,
      platform: platformInfo,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      online: navigator.onLine,
      cookiesEnabled: navigator.cookieEnabled,
      pixelRatio: window.devicePixelRatio
    }

    if (this.consent.isFieldAllowed('language')) {
      systemInfo.language = navigator.language
    }

    if (this.consent.isFieldAllowed('timezone')) {
      systemInfo.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    }

    if (this.consent.isFieldAllowed('memory')) {
      const memory = (navigator as any).deviceMemory
      if (memory) systemInfo.memory = `${memory} GB`
    }

    if (this.consent.isFieldAllowed('cores')) {
      systemInfo.cores = navigator.hardwareConcurrency
    }

    if (this.consent.isFieldAllowed('touchSupport')) {
      systemInfo.touchSupport = navigator.maxTouchPoints > 0
    }

    if (this.consent.isFieldAllowed('colorDepth')) {
      systemInfo.colorDepth = `${window.screen.colorDepth}-bit`
    }

    return systemInfo
  }

  public catch(error: Error | string): OopsReport {
    const errorMessage = typeof error === 'string' ? error : error.message
    const errorStack = typeof error === 'string' ? undefined : error.stack

    this.consoleErrors.push({
      message: errorMessage,
      stack: errorStack,
      timestamp: new Date().toISOString(),
      type: 'error',
      url: window.location.href
    })

    if (this.consoleErrors.length > this.maxConsoleErrors) {
      this.consoleErrors.shift()
    }

    return this.generateReport()
  }

  private generateReport(): OopsReport {
    return {
      systemInfo: this.consent.hasConsent() ? this.getSystemInfo() : null,
      consoleErrors: this.consoleErrors,
      userId: this.config.userId,
      userEmail: this.config.userEmail,
      metadata: this.config.metadata,
      timestamp: new Date().toISOString()
    }
  }

  public async report(userReport: UserReport): Promise<OopsResponse> {
    // Smart data collection - only include system info for bug reports
    const isBugReport = userReport.category === 'bug' || userReport.severity !== undefined

    const report: OopsReport = {
      userReport,
      systemInfo: isBugReport && this.consent.hasConsent() ? this.getSystemInfo() : null,
      consoleErrors: isBugReport ? this.consoleErrors : undefined,
      userId: this.config.userId,
      userEmail: this.config.userEmail,
      metadata: this.config.metadata,
      timestamp: new Date().toISOString()
    }

    // Log for demo purposes
    console.group('📦 Oops.report() - Submission')
    console.log('Report:', report)
    console.groupEnd()

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))

    return {
      success: true,
      message: 'Report submitted successfully',
      id: 'demo-' + Date.now()
    }
  }

  public getConsoleErrors(): ConsoleError[] {
    return this.consoleErrors
  }
}

// Export factory function for easy initialization
export function initOops(config: OopsConfig): OopsDemo {
  return new OopsDemo(config)
}
