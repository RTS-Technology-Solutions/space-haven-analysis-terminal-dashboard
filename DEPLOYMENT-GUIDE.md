# Quick Deployment Guide - Beta Launch

## 🚀 One-Command Deployment

```powershell
.\deploy-beta.ps1
```

This script will:
1. Clean previous build
2. Verify `/dev-dash` exclusion is configured
3. Build production bundle
4. (Optional) Preview locally
5. Deploy to Firebase Hosting

---

## ✅ Pre-Flight Checklist

Before deploying, ensure:
- [ ] All TypeScript compiles without errors
- [ ] Beta Dashboard displays all 5 hierarchy levels
- [ ] Storage/inventory visualizations work
- [ ] Hull construction details display
- [ ] Crew vitals show progress bars
- [ ] Coming Soon page (/dash) is ready

---

## 🎯 What Gets Deployed

### ✅ Included in Production
- `/` - Homepage
- `/dash` - Coming Soon page
- `/beta-dash` - **NEW Beta Wireframe** 
- `/data` - Data dictionary

### ❌ Excluded from Production
- `/dev-dash` - Development only (local access only)

---

## 🧪 Testing After Deployment

1. **Test Beta Dashboard:**
   ```
   https://space-haven-analysis-terminal-dashboard.web.app/beta-dash
   ```
   - Navigate through all 5 levels
   - Check tooltips work
   - Verify dropdowns populate

2. **Verify Dev Exclusion:**
   ```
   https://space-haven-analysis-terminal-dashboard.web.app/dev-dash
   ```
   - Should return 404 or redirect to home

3. **Check Analytics:**
   - Visit Firebase Console
   - Monitor real-time events
   - Verify page view tracking

---

## 🔧 Manual Deployment (If Script Fails)

```powershell
# 1. Clean and build
Remove-Item -Recurse -Force dist
npm run build

# 2. Preview (optional)
npm run preview
# Visit http://localhost:4173/beta-dash

# 3. Deploy
firebase deploy --only hosting
```

---

## 🚨 Rollback (If Needed)

If critical issues are found:

```powershell
# Quick fix and redeploy
npm run build
firebase deploy --only hosting
```

---

## 📊 Success Criteria

After deployment, verify:
- ✅ `/beta-dash` loads without errors
- ✅ All 5 hierarchy levels accessible
- ✅ Mock data displays correctly
- ✅ Progress bars and visualizations work
- ✅ `/dev-dash` returns 404 in production
- ✅ Analytics events firing
- ✅ No console errors

---

## 📝 Post-Deployment

1. Update GitHub Release notes (v0.9)
2. Monitor Firebase Analytics
3. Check for feedback submissions
4. Triage any issues as GitHub Issues
5. Begin Phase 0 work (#31-33)

---

**Deployment Target:** https://space-haven-analysis-terminal-dashboard.web.app  
**Hosting Project:** rts-labs-f3981  
**Target Name:** space-haven-analysis-terminal
