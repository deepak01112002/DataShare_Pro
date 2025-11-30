# ⚡ Quick Fix for Your SSL Error

## 🔴 Problem

Your connection string is missing required parameters for MongoDB Atlas.

**Current (Incorrect):**
```
mongodb+srv://deepak:deepak@cluster0.6ujugy9.mongodb.net/?appName=Cluster0
```

## ✅ Solution - Copy This Exact String

**Correct Connection String:**
```
mongodb+srv://deepak:deepak@cluster0.6ujugy9.mongodb.net/?retryWrites=true&w=majority
```

## 📝 Steps to Fix (2 Minutes)

### 1. Go to Vercel Dashboard
- Visit: https://vercel.com/dashboard
- Select your project

### 2. Update Environment Variable
- Click: **Settings** → **Environment Variables**
- Find or add: `MONGODB_URI`
- **Delete the old value**
- **Paste this new value:**

```
mongodb+srv://deepak:deepak@cluster0.6ujugy9.mongodb.net/?retryWrites=true&w=majority
```

- Click **Save**

### 3. Redeploy
- Go to **Deployments** tab
- Click **⋯** (three dots) on latest deployment
- Click **Redeploy**
- Wait 1-2 minutes

### 4. Test
Visit: `https://data-share-pro-iufb.vercel.app/api/data`

Should return JSON (not SSL error).

## 🔍 What Changed?

- ❌ Removed: `?appName=Cluster0`
- ✅ Added: `?retryWrites=true&w=majority`

These parameters are **required** for MongoDB Atlas connections.

## ⚠️ Also Check MongoDB Atlas

1. **Network Access:**
   - Go to: https://cloud.mongodb.com → Network Access
   - Ensure `0.0.0.0/0` is in the list (allows all IPs)

2. **Verify Credentials:**
   - Username: `deepak`
   - Password: `deepak`
   - Make sure these are correct in MongoDB Atlas

---

**That's it! After redeploying, your SSL error will be fixed.** ✅


