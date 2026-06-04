# 🚀 Beta Launch Deployment Plan
**Date:** June 4, 2026  
**Target Launch:** June 5, 2026  
**Version:** v0.9 - Beta Wireframe

---

## 📋 Deployment Overview

### Routes Configuration
| Route | Status | Deployment | Description |
|-------|--------|------------|-------------|
| `/` | ✅ Live | Public | Homepage |
| `/dash` | ✅ Live | Public | Coming Soon page with beta teaser banner |
| `/beta-dash` | 🚀 **NEW** | Public | Hierarchical wireframe with mock data |
| `/dev-dash` | 🔒 Local Only | **NOT DEPLOYED** | Full functional dashboard for development |
| `/data` | ✅ Live | Public | Data dictionary/ID mappings |

---

## 🎯 Deployment Goals

1. **Public Launch `/beta-dash`** - Showcase hierarchical navigation wireframe
2. **Keep `/dash` as Coming Soon** - Main entry with June 20, 2026 countdown
3. **Exclude `/dev-dash` from production** - Development-only route
4. **No Breaking Changes** - Existing pages remain functional

---

## 🛠️ Implementation Steps

### Option 1: Conditional Route Rendering (RECOMMENDED)
Exclude `/dev-dash` route in production builds using environment variables.

#### Step 1: Create `.env.production` file
```env
# Production environment - excludes dev-only features
VITE_ENABLE_DEV_ROUTES=false
```

#### Step 2: Create `.env.development.local` file (for local dev)
```env
# Local development - includes all routes
VITE_ENABLE_DEV_ROUTES=true
```

#### Step 3: Update `src/App.tsx` to conditionally render dev route
```tsx
// At the top of App.tsx
const isDev = import.meta.env.VITE_ENABLE_DEV_ROUTES === 'true' || 
              import.meta.env.DEV // Fallback to Vite's built-in DEV mode

// In Routes section, wrap /dev-dash route:
{isDev && (
  <Route path="/dev-dash" element={
    <>
      <Header onFeedbackClick={() => setIsFeedbackOpen(true)} />
      <main className="main-content">
        <DevDashboard />
      </main>
    </>
  } />
)}
```

**Advantages:**
- ✅ Clean separation of dev/prod routes
- ✅ DevDashboard code still in repo but not accessible in production
- ✅ Easy to enable/disable per environment
- ✅ No build-time exclusions needed

---

### Option 2: Build-Time Code Splitting (Alternative)
Use Vite's code splitting to completely exclude DevDashboard from production builds.

#### Step 1: Use dynamic imports with conditions
```tsx
// Lazy load DevDashboard only in development
const DevDashboard = import.meta.env.DEV 
  ? lazy(() => import('./pages/DevDashboard'))
  : null

// In routes:
{import.meta.env.DEV && DevDashboard && (
  <Route path="/dev-dash" element={
    <Suspense fallback={<div>Loading...</div>}>
      <DevDashboard />
    </Suspense>
  } />
)}
```

**Advantages:**
- ✅ DevDashboard code completely excluded from production bundle
- ✅ Smaller production build size
- ✅ More secure (code not even shipped)

**Disadvantages:**
- ⚠️ Requires Suspense wrapper
- ⚠️ More complex setup

---

## 📦 Deployment Checklist

### Pre-Deployment
- [ ] Verify all TypeScript builds without errors: `npm run build`
- [ ] Test `/dash` route shows Coming Soon page correctly
- [ ] Test `/beta-dash` shows hierarchical wireframe with all 5 levels
- [ ] Verify `/dev-dash` only accessible in local development
- [ ] Check all analytics tracking works (page views, events)
- [ ] Verify responsive design on desktop (1920x1080 target)
- [ ] Test navigation between routes
- [ ] Ensure GitHub and Support links work from header

### Environment Setup
- [ ] Create `.env.production` with `VITE_ENABLE_DEV_ROUTES=false`
- [ ] Create `.env.development.local` with `VITE_ENABLE_DEV_ROUTES=true`
- [ ] Update `src/App.tsx` with conditional /dev-dash route
- [ ] Test build locally: `npm run build && npm run preview`
- [ ] Verify /dev-dash returns 404 in preview build

### Build & Deploy
- [ ] Clean previous build: `rm -rf dist`
- [ ] Build production bundle: `npm run build`
- [ ] Verify build output in `dist/` folder
- [ ] Test locally with preview: `npm run preview`
- [ ] Deploy to Firebase: `firebase deploy --only hosting`
- [ ] Verify deployment success message

### Post-Deployment Verification
- [ ] Visit live `/dash` route - Coming Soon page displays
- [ ] Visit live `/beta-dash` route - Hierarchical wireframe displays
- [ ] Try visiting live `/dev-dash` route - Returns 404 or redirects to home
- [ ] Test all 5 hierarchical levels in `/beta-dash`
- [ ] Verify storage/inventory displays for ships
- [ ] Check crew vitals with progress bars
- [ ] Confirm hull construction details show
- [ ] Test analytics events (check Firebase Console)
- [ ] Check cookie consent banner appears
- [ ] Test feedback modal
- [ ] Verify GitHub link goes to correct repo
- [ ] Verify Support link goes to Stripe page

---

## 🎨 Beta Dashboard Features to Highlight

### Level 1: Game Data
- ✅ Save file metadata
- ✅ Days survived counter
- ✅ Game mode display
- ✅ Tooltips with Why/How/What explanations

### Level 2: Star System
- ✅ System selector dropdown
- ✅ Celestial bodies count
- ✅ Asteroids count
- ✅ Factions present

### Level 3: Sector
- ✅ Sector selector dropdown
- ✅ Ships, objects, debris counts
- ✅ Stations count
- ✅ Faction breakdown

### Level 4: Ship
- ✅ Ship selector dropdown
- ✅ Hull integrity alerts
- ✅ **NEW:** Storage & Inventory with progress bars
- ✅ **NEW:** Hull construction details (operational/damaged/critical)
- ✅ **NEW:** Active breach warnings
- ✅ Condition stats (power, oxygen, food, mood)
- ✅ Crew and systems overview

### Level 5: Crew
- ✅ Crew member selector
- ✅ **NEW:** Vitals with animated progress bars
- ✅ **NEW:** Color-coded health indicators (green/yellow/orange/red)
- ✅ **NEW:** Glow effects on progress bars
- ✅ Skills display (0-10 points, no XP)
- ✅ Traits and conditions
- ✅ Current task indicator

---

## 🚨 Rollback Plan

If issues are discovered post-deployment:

1. **Quick Fix Available:**
   ```bash
   # Make fixes
   npm run build
   firebase deploy --only hosting
   ```

2. **Critical Issue - Rollback:**
   ```bash
   # Find previous working version
   firebase hosting:channel:list
   
   # Deploy previous version (if available)
   firebase hosting:clone SOURCE_SITE:SOURCE_CHANNEL DEST_SITE:live
   ```

3. **Emergency Disable Beta:**
   - Update BetaDashboard.tsx to show "Under Maintenance" message
   - Quick build and deploy

---

## 📊 Success Metrics (Track in Firebase Analytics)

### Day 1 (June 5, 2026)
- [ ] Page views on `/beta-dash` > 50
- [ ] Average time on page > 2 minutes
- [ ] Bounce rate < 60%
- [ ] No console errors reported

### Week 1 (June 5-11, 2026)
- [ ] Unique visitors to `/beta-dash` > 200
- [ ] Click-through rate from `/dash` to `/beta-dash` > 15%
- [ ] Feedback submissions > 10
- [ ] GitHub stars increase by 20+

---

## 📝 Communication Plan

### Pre-Launch (June 4, evening)
- [ ] Update README.md with beta launch announcement
- [ ] Create GitHub Release v0.9 with beta notes
- [ ] Draft social media posts (if applicable)

### Launch Day (June 5)
- [ ] Monitor Firebase Hosting dashboard
- [ ] Monitor Firebase Analytics real-time view
- [ ] Check for error reports in browser console
- [ ] Respond to GitHub issues/feedback quickly

### Post-Launch (June 6)
- [ ] Review analytics data
- [ ] Prioritize feedback for v1.0
- [ ] Update issues for Phase 1 work based on feedback

---

## 🔗 Important URLs

**Production:**
- Homepage: https://space-haven-analysis-terminal-dashboard.web.app/
- Coming Soon: https://space-haven-analysis-terminal-dashboard.web.app/dash
- **Beta Wireframe:** https://space-haven-analysis-terminal-dashboard.web.app/beta-dash
- Data Dictionary: https://space-haven-analysis-terminal-dashboard.web.app/data

**Development:**
- Local Dev Server: http://localhost:5173
- Local Preview (production build): http://localhost:4173

**Management:**
- Firebase Console: https://console.firebase.google.com/project/rts-labs-f3981
- GitHub Repo: https://github.com/RTS-Technology-Solutions/space-haven-analysis-terminal-dashboard
- Analytics: https://analytics.google.com (if configured)

---

## 🎯 Next Steps After Beta Launch

1. **Phase 0 Issues** (Beta Milestone - Due June 6)
   - #31: Complete hierarchical navigation system
   - #32: Implement selection and filtering system
   - #33: Visual accessibility review and improvements

2. **Phase 1 Issues** (Dashboard Launch - Due June 20)
   - #11-14: Core data engine (TypeScript models, XML parser, etc.)
   
3. **Community Feedback**
   - Monitor #28: Verify missing skill/module IDs
   - Collect user feedback via feedback modal
   - Track feature requests in GitHub Issues

---

**Deployment Command:**
```bash
# Production deployment
npm run build && firebase deploy --only hosting
```

**Local Testing Command:**
```bash
# Test production build locally
npm run build && npm run preview
```

---

**Prepared by:** GitHub Copilot  
**Reviewed by:** [Your Name]  
**Approved for deployment:** [ ] YES  [ ] NO
