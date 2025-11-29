# Fix for 404 Routing and API Timeout Issues

## 🔴 Issues Found

1. **404 on `/admin-login`** - React Router routes not working
2. **504 Timeout on `/api/data`** - Backend API timing out

## ✅ Fixes Applied

### 1. Fixed React Router Routing (404 Error)

**Problem:** Vercel needs rewrites to handle client-side React Router routes.

**Fix:** Added rewrites to `vercel.json`:
```json
"rewrites": [
  {
    "source": "/api/:path*",
    "destination": "/api/:path*"
  },
  {
    "source": "/(.*)",
    "destination": "/index.html"
  }
]
```

This ensures:
- API routes (`/api/*`) are handled by serverless functions
- All other routes (`/admin-login`, `/admin`, etc.) are handled by React Router

### 2. API Timeout Issue

**Problem:** API endpoints are timing out (504 error).

**Likely Causes:**
1. MongoDB environment variables not set in Vercel
2. MongoDB connection string incorrect
3. MongoDB IP whitelist not configured
4. Cold start timeout

## 🔧 Required Setup

### Step 1: Set Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add these variables:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
DB_NAME=rowshare
CRON_SECRET=your-random-secret-here
```

**Important:** Replace `username`, `password`, and `cluster` with your actual MongoDB Atlas credentials.

### Step 2: Configure MongoDB Atlas

1. **Network Access:**
   - Go to MongoDB Atlas → Network Access
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - This allows Vercel to connect

2. **Database User:**
   - Go to Database Access
   - Create a user with password
   - Use this in your connection string

### Step 3: Verify Environment Variables

After setting environment variables:
1. Go to **Deployments** tab
2. Click the three dots on latest deployment
3. Click **Redeploy**
4. This ensures new env vars are used

## 🧪 Testing

### Test Routes:
- ✅ `/` - Should show User panel
- ✅ `/admin-login` - Should show Admin login page
- ✅ `/admin` - Should show Admin panel (after login)
- ✅ `/api/data` - Should return data or empty array

### Test API:
```bash
curl https://your-domain.vercel.app/api/data
```

Should return:
```json
{
  "data": [],
  "columns": [],
  "uploadDate": null,
  "tableName": null
}
```

## 📝 Next Steps

1. **Commit and push the updated `vercel.json`:**
   ```bash
   git add vercel.json
   git commit -m "Fix: Add rewrites for React Router routing"
   git push origin main
   ```

2. **Set environment variables in Vercel dashboard**

3. **Redeploy the project**

4. **Test all routes**

---

**After these fixes, both routing and API should work correctly!** ✅

