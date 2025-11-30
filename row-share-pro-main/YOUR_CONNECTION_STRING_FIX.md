# 🔧 Fix Your MongoDB Connection String

## ❌ Your Current Connection String (Has Issues):

```
mongodb+srv://deepak:deepak@cluster0.6ujugy9.mongodb.net/?appName=Cluster0
```

## ✅ Correct Connection String Format:

```
mongodb+srv://deepak:deepak@cluster0.6ujugy9.mongodb.net/?retryWrites=true&w=majority
```

### Or with database name specified:

```
mongodb+srv://deepak:deepak@cluster0.6ujugy9.mongodb.net/rowshare?retryWrites=true&w=majority
```

## 🔍 What's Wrong?

1. **Missing required parameters:** `retryWrites=true&w=majority`
2. **Unnecessary parameter:** `appName=Cluster0` (not needed and may cause issues)

## 📝 How to Fix:

### Step 1: Update in Vercel Dashboard

1. Go to: https://vercel.com/dashboard
2. Select your project
3. Go to: **Settings** → **Environment Variables**
4. Find: `MONGODB_URI`
5. Click **Edit** (or add if it doesn't exist)
6. **Paste this exact string:**

```
mongodb+srv://deepak:deepak@cluster0.6ujugy9.mongodb.net/?retryWrites=true&w=majority
```

7. Click **Save**

### Step 2: Verify MongoDB Atlas

1. **Network Access:**
   - Go to: https://cloud.mongodb.com → Network Access
   - Make sure `0.0.0.0/0` is whitelisted (allows Vercel to connect)

2. **Database User:**
   - Go to: Database Access
   - Verify user `deepak` exists
   - Check password is `deepak`

### Step 3: Redeploy

1. Go to: **Deployments** tab
2. Click **⋯** (three dots) on latest deployment
3. Click **Redeploy**
4. Wait for deployment to complete

## 🧪 Test After Fix

After redeploying, test the API:
```
https://data-share-pro-iufb.vercel.app/api/data
```

Should return JSON (even if empty):
```json
{
  "data": [],
  "columns": [],
  "uploadDate": null,
  "tableName": null
}
```

## ⚠️ Important Notes:

- ✅ Connection string format: `mongodb+srv://USERNAME:PASSWORD@CLUSTER/?retryWrites=true&w=majority`
- ✅ Database name can be set in `DB_NAME` environment variable (defaults to `rowshare`)
- ❌ Don't include `appName` parameter
- ✅ Always include `retryWrites=true&w=majority` for MongoDB Atlas

---

**After updating the connection string and redeploying, the SSL error should be fixed!** ✅


