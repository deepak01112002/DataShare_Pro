# Fix for Vercel Build Error

## Problem
Error: `sh: line 1: vite: command not found`

## Solution

Vercel needs explicit build configuration. Follow these steps:

### Option 1: Configure in Vercel Dashboard (Recommended)

When deploying/editing your project in Vercel:

1. Go to **Project Settings** → **General** → **Build & Development Settings**

2. Set these values:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install` (or leave empty for default)

3. Save and redeploy

### Option 2: Update vercel.json

The `vercel.json` file has been updated with build configuration, but you may also need to set it in the Vercel dashboard if it doesn't work automatically.

### Verification

After setting the build command:
- Vercel should run `npm install` first
- Then run `npm run build` which executes `vite build`
- Output will be in `dist/` folder
- API functions in `/api` folder will be automatically detected

## Alternative: If still having issues

If you're still getting the error, try moving `vite` from `devDependencies` to `dependencies` in `package.json`:

```bash
npm install vite --save
```

Then update your package.json to move vite from devDependencies to dependencies.

---

**Next Steps:**
1. Update Vercel dashboard settings (Option 1 above)
2. Commit and push the updated `vercel.json`
3. Redeploy

