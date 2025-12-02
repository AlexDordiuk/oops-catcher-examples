# 🪰 Oops Catcher Examples

Live examples and interactive demos for [Oops Catcher](https://github.com/AlexDordiuk/oops-catcher) SDK.

**[📺 View Live Demos](https://alexdordiuk.github.io/oops-catcher-examples/)** | **[💻 Main Repository](https://github.com/AlexDordiuk/oops-catcher)**

## 🚀 Quick Start

Simply open any HTML file in your browser - no build required!

## 📋 Examples

### 1. [Quick Start Demo](./vanilla-demo.html)

Simple demonstration for rapid prototyping:
- 🐛 Bug reporting with custom fields
- 💬 Feedback/questions reporting
- 💻 System info collection
- 📝 Console error capture
- 🎯 Smart data collection (system info only for bugs)

**[View Demo](https://alexdordiuk.github.io/oops-catcher-examples/vanilla-demo.html)**

### 2. [Privacy-First Demo](./vanilla-demo-with-consent.html)

Production-ready demonstration with full consent management:
- ✅ **Consent Banner** - User must grant permission before data collection
- 🎛️ **Granular Permissions** - Users choose which data to share
- 📊 **Required vs Optional Fields**:
  - **Required** (always collected): userAgent, platform, screenResolution, viewport, online, cookiesEnabled, pixelRatio
  - **Optional** (user choice): language, timezone, memory, cores, touchSupport, colorDepth
- 💾 **Persistent Storage** - Consent preferences saved in localStorage
- ❌ **Revocable** - Users can revoke consent at any time

**[View Demo](https://alexdordiuk.github.io/oops-catcher-examples/vanilla-demo-with-consent.html)**

### 3. [Custom Fields Example](./custom-fields-example.ts)

TypeScript code examples showing how to use custom fields:
- E-commerce checkout tracking
- Feature requests with user context
- Bug reports with reproduction steps
- Payment failures with transaction details

## 🎮 Features Demonstrated

### Bug Reporting
```javascript
await Oops.report({
  message: 'Button not working',
  description: 'The submit button does not respond to clicks',
  category: 'bug',
  severity: 'high',
  custom: {
    orderId: 'ORD-123',
    paymentMethod: 'stripe'
  }
})
```

### Feedback/Questions
```javascript
await Oops.report({
  message: 'Love the new design!',
  category: 'feedback'
})
```

### Consent Management
```javascript
// Grant consent with all optional fields
Oops.consent.grantConsent()

// Grant consent with specific preferences
Oops.consent.grantConsent({
  language: true,
  timezone: false,  // Don't share timezone
  memory: false     // Don't share memory info
})

// Check consent status
if (Oops.hasConsent()) {
  const systemInfo = Oops.getSystemInfo()
}

// Revoke consent
Oops.revokeConsent()
```

## 📦 Using with Real SDK

To use these examples with the actual built SDK, replace the simulated classes with:

```html
<script type="module">
  import Oops from 'oops-catcher'

  Oops.init({
    endpoint: 'https://your-api.com/feedback',
    apiKey: 'your-api-key',
    captureConsole: true
  })

  // Grant consent first
  Oops.consent.grantConsent()

  // Rest of your code...
</script>
```

### Installation

```bash
npm install oops-catcher
# or
bun add oops-catcher
```

## 🔒 Privacy & GDPR Compliance

The consent management system helps you comply with privacy regulations:

- ✅ **Explicit Consent** - Users must actively grant permission
- ✅ **Granular Control** - Users choose what data to share
- ✅ **Required Fields Only** - Minimal data collection by default
- ✅ **Revocable** - Users can withdraw consent anytime
- ✅ **Persistent** - Consent preferences saved and remembered
- ✅ **Transparent** - Users can see exactly what data is collected

## 🌐 Browser Compatibility

These examples work in all modern browsers that support:
- ES6 Modules
- localStorage
- Fetch API
- Modern JavaScript features

Tested on:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## 🚀 GitHub Pages Deployment

This repository is deployed to GitHub Pages automatically. The live demos are available at:
**https://alexdordiuk.github.io/oops-catcher-examples/**

To set up GitHub Pages for your fork:

1. Go to **Settings** → **Pages**
2. Under **Source**, select **Deploy from a branch**
3. Select **main** branch and **/ (root)** folder
4. Click **Save**

GitHub will automatically deploy your changes within a few minutes.

## 📚 Documentation

For full documentation, API reference, and more examples, see the [main repository](https://github.com/AlexDordiuk/oops-catcher).

## 📝 License

MIT - see [LICENSE](https://github.com/AlexDordiuk/oops-catcher/blob/main/LICENSE)
