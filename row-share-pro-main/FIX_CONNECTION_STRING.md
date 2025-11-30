# Fix Your MongoDB Connection String

## 🔴 Current Connection String (Incorrect)

```
mongodb+srv://deepak:deepak@cluster0.6ujugy9.mongodb.net/?appName=Cluster0
```

## ✅ Correct Connection String Format

Your connection string is missing important parameters. Use this format:

```
mongodb+srv://deepak:deepak@cluster0.6ujugy9.mongodb.net/?retryWrites=true&w=majority
```

**Or with database name:**

```
mongodb+srv://deepak:deepak@cluster0.6ujugy9.mongodb.net/rowshare?retryWrites=true&w=majority
```

## 🔧 Changes Needed

1. **Remove:** `?appName=Cluster0`
2. **Add:** `?retryWrites=true&w=majority`
3. **Optional:** Add database name before `?` (e.g., `/rowshare?`)

## 📝 Steps to Fix

### Step 1: Update Connection String in Vercel

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Find `MONGODB_URI`
3. Update the value to:

```
mongodb+srv://deepak:deepak@cluster0.6ujugy9.mongodb.net/?retryWrites=true&w=majority
```

**Or if you want to specify the database:**

```
mongodb+srv://deepak:deepak@cluster0.6ujugy9.mongodb.net/rowshare?retryWrites=true&w=majority
```

### Step 2: Verify MongoDB Atlas Settings

1. **Network Access:**
   - Go to MongoDB Atlas → Network Access
   - Make sure `0.0.0.0/0` is in the whitelist (allows all IPs)

2. **Database User:**
   - Go to Database Access
   - Verify user `deepak` exists
   - Check password is correct

### Step 3: Redeploy

After updating the environment variable:
1. Go to Deployments tab
2. Click "Redeploy" on the latest deployment
3. Wait for deployment to complete

## 🔍 What Each Parameter Does

- `retryWrites=true` - Allows retrying write operations on failure
- `w=majority` - Waits for majority of nodes to acknowledge writes
- These are **required** for MongoDB Atlas connections

## ⚠️ Important Notes

1. **Don't include** `appName` parameter - it's not needed
2. **Always include** `retryWrites=true&w=majority` for Atlas
3. Database name can be specified in connection string OR in code (via `DB_NAME` env var)

---

**After updating to the correct connection string format, the SSL error should be resolved!** ✅


