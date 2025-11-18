# ⚡ Quick Deployment Guide - Netlify

## 🎯 Fastest Way: Netlify Dashboard (5 minutes)

### Step-by-Step:

1. **Go to Netlify**
   ```
   https://app.netlify.com
   ```

2. **Sign in with GitHub**
   - Click "Sign up" (if new)
   - Choose "Sign up with GitHub"
   - Authorize Netlify

3. **Import Project**
   - Click "Add new site" → "Import an existing project"
   - Choose "GitHub"
   - Select `webioo/someeee`
   - Select branch: `claude/civic-complaint-platform-01Tdwo8UJE6ArSUGPVSkPDE8`

4. **Build Settings** (Auto-detected)
   ```
   Build command: npm run build
   Publish directory: dist
   ```

5. **Click "Deploy site"**
   - Wait 2-3 minutes
   - Get your URL: `https://random-name.netlify.app`

6. **Done!** 🎉

---

## 🔗 Your Live App Features

Once deployed, test:
- ✅ **Rural Kiosk**: Voice submission works (needs mic permission)
- ✅ **Officer Portal**: Login with `raj.patil` / `pass123`
- ✅ **Super Admin**: Login with `superadmin` / `admin@2025`
- ✅ **Citizen Portal**: Public access, no login

---

## 🎨 Customize Your URL

After deployment:

1. Go to **Site settings** → **Domain management**
2. Click **"Change site name"**
3. Enter: `civic-complaint-platform` (or your choice)
4. Your new URL: `https://civic-complaint-platform.netlify.app`

---

## 🔄 Auto-Deploy on Git Push

Already configured! Every time you push to GitHub:
- Netlify auto-builds
- Deploys new version
- No manual steps needed

---

## 📱 Share Your Deployed App

Once live, share with:
- Government officials
- Community leaders
- Portfolio/resume
- LinkedIn projects

---

## 🐛 Quick Fixes

### Voice not working?
- ✅ Use Chrome or Edge
- ✅ Grant microphone permission
- ✅ Use HTTPS (Netlify provides this)

### Page refresh shows blank?
- ✅ Already fixed in `netlify.toml`
- ✅ SPA redirects configured

### Build failed?
- ✅ Check Netlify logs
- ✅ Run `npm run build` locally first
- ✅ Clear cache and retry

---

## 📖 Need More Help?

See [DEPLOYMENT.md](./DEPLOYMENT.md) for:
- CLI deployment
- Drag & drop method
- Troubleshooting
- Production security tips

---

**Your app will be live in 5 minutes!** 🚀
