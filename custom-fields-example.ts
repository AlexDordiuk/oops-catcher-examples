import { Oops } from 'oops-catcher'

// Initialize
const oops = Oops.init({
  endpoint: '/api/feedback'
})

// Example 1: E-commerce checkout error with custom fields
async function handleCheckoutError(orderId: string, cart: any) {
  await oops.report({
    message: "Payment processing failed",
    category: "bug",
    severity: "critical",
    custom: {
      orderId,
      cartValue: cart.total,
      itemCount: cart.items.length,
      paymentMethod: cart.paymentMethod,
      currency: cart.currency,
      userId: cart.userId,
      timestamp: new Date().toISOString()
    }
  })
}

// Example 2: Feature request with user context
async function reportFeatureRequest(feature: string, user: any) {
  await oops.report({
    message: `Request for ${feature}`,
    category: "feedback",
    custom: {
      userPlan: user.plan,
      userSegment: user.segment,
      accountAge: user.accountAge,
      requestedFeature: feature,
      urgency: "medium"
    }
  })
}

// Example 3: Bug report with reproduction steps
async function reportBug(error: Error, context: any) {
  await oops.report({
    message: error.message,
    description: error.stack,
    category: "bug",
    severity: "high",
    custom: {
      component: context.component,
      action: context.action,
      state: JSON.stringify(context.state),
      browserInfo: navigator.userAgent,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      lastActions: context.userActions,
      sessionDuration: context.sessionDuration,
      pageLoadTime: context.pageLoadTime
    }
  })
}

// Example 4: Export/Import errors with file info
async function reportExportError(errorMsg: string, exportConfig: any) {
  await oops.report({
    message: errorMsg,
    category: "bug",
    custom: {
      exportFormat: exportConfig.format,
      recordCount: exportConfig.recordCount,
      fileSize: exportConfig.estimatedSize,
      filters: JSON.stringify(exportConfig.filters),
      dateRange: exportConfig.dateRange
    }
  })
}

// Usage examples
await handleCheckoutError("ORD-12345", {
  total: 249.99,
  items: [1, 2, 3],
  paymentMethod: "stripe",
  currency: "USD",
  userId: "user_123"
})

await reportFeatureRequest("dark-mode", {
  plan: "pro",
  segment: "power-user",
  accountAge: "6 months"
})
