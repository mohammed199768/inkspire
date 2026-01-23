# TRACKING SYSTEM

**Last Updated**: 2026-01-23T23:06:00+03:00

---

## 1. System Overview

**PURPOSE**: Privacy-friendly analytics integration using Google Tag Manager (GTM).
**STRATEGY**: "Container Injection Only" – The codebase only installs the GTM container. All actual tracking tags (GA4, etc.) are managed inside the GTM dashboard.

**KEY COMPONENTS**:
- **GTM Container**: ID `GTM-NCFF8CVF` (managed via env vars)
- **GA4 Property**: Configured *inside* GTM (no code changes required)
- **Privacy Approach**: No cookie banner, no consent UI. Relies on GTM/GA4 privacy settings initially.

---

## 2. Integration Points

The GTM container is injected into the application root, loading once for the entire single-page application (SPA).

### Head Snippet (Script Load)
**Location**: `app/layout.tsx` (Lines 105-113)
**Mechanism**: `next/script` with `strategy="afterInteractive"`
**Evidence**:
```tsx
<Script id="gtm-script" strategy="afterInteractive">
    {`(function(w,d,s,l,i){...})(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');`}
</Script>
```

### Body Snippet (NoScript Fallback)
**Location**: `app/layout.tsx` (Lines 116-123)
**Mechanism**: `<noscript><iframe>` immediately after body open
**Evidence**:
```tsx
<noscript>
    <iframe src={`...id=${process.env.NEXT_PUBLIC_GTM_ID}`} ... />
</noscript>
```

### Environment Configuration
**File**: `.env.local` / Vercel Environment Variables
**Variable**: `NEXT_PUBLIC_GTM_ID`
**Current Value**: `GTM-NCFF8CVF`

---

## 3. Configuration & Maintenance

### How to Change the GTM Container ID
1. **Locally**: Edit `.env.local` → `NEXT_PUBLIC_GTM_ID=GTM-NEW-ID`
2. **Production**: Update Vercel Environment Variables → Redeploy
3. **Code**: NO CODE CHANGES REQUIRED.

### How to Add GA4 or Other Pixels
1. **Do NOT touch the code.**
2. Go to [Google Tag Manager Dashboard](https://tagmanager.google.com/).
3. Create a new **Tag**.
4. Select **Google Analytics: GA4 Configuration**.
5. Set your Measurement ID (G-XXXXXXXX).
6. Trigger on **Initialization - All Pages**.
7. Publish the GTM container container.

---

## 4. Verification Guide

### 1. Check Network Request
- Open DevTools → Network
- Filter for: `gtm.js`
- Verify Request URL contains: `id=GTM-NCFF8CVF`
- Status: `200` or `304`

### 2. Verify Data Layer
- Open Console
- Type: `window.dataLayer`
- Expected: Array with at least one event: `{'gtm.start': ..., event: 'gtm.js'}`

### 3. SPA Navigation Test
- Navigate between pages (Home -> Contact)
- Ensure no *new* full page reloads occur (SPA behavior)
- GTM handles history change events automatically if configured in settings (Trigger: History Change).

---

## 5. Privacy & Risk Note

**Risk**: "Privacy/Tracking configuration drift"
**Mitigation**: The code is agnostic. If privacy laws require a banner later, it must be implemented as a new UI component that conditionally gates the GTM script execution.

**Current State**:
- Cookie Banner: **NONE**
- Consent Mode: **Default (Implicit)**
- User responsibility: Ensure GTM tags respect privacy settings.
