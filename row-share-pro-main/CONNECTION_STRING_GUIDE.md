# MongoDB Connection String Guide

## 🔴 Common SSL/TLS Error

If you're seeing this error:
```
error:0A000438:SSL routines:ssl3_read_bytes:tlsv1 alert internal error
```

## ✅ Solution: Check Your Connection String

### Step 1: Get Your MongoDB Atlas Connection String

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Click **Connect** on your cluster
3. Choose **Connect your application**
4. Copy the connection string

### Step 2: Format the Connection String Correctly

**Format:**
```
mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/?retryWrites=true&w=majority
```

**Important:**
- ✅ Use `mongodb+srv://` (not `mongodb://`)
- ✅ Replace `<password>` with your actual password
- ✅ Replace `<username>` with your database username
- ✅ Replace `<dbname>` is optional (can be set later)
- ✅ Keep `?retryWrites=true&w=majority` at the end

### Step 3: URL Encode Special Characters in Password

If your password contains special characters, you **MUST** URL encode them:

**Common Characters to Encode:**
- `@` → `%40`
- `#` → `%23`
- `$` → `%24`
- `%` → `%25`
- `/` → `%2F`
- `?` → `%3F`
- `&` → `%26`
- `=` → `%3D`
- `+` → `%2B`
- ` ` (space) → `%20`

**Example:**
- Password: `my@pass#123`
- Encoded: `my%40pass%23123`
- Final: `mongodb+srv://user:my%40pass%23123@cluster.mongodb.net/?retryWrites=true&w=majority`

**URL Encoder Tool:**
- Online: https://www.urlencoder.org/
- Just paste your password and click encode

### Step 4: Set in Vercel Environment Variables

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add new variable:
   - **Key:** `MONGODB_URI`
   - **Value:** Your complete connection string (with encoded password)
3. Click **Save**
4. **Redeploy** your project

### Step 5: Verify MongoDB Atlas Network Access

1. Go to MongoDB Atlas → **Network Access**
2. Click **Add IP Address**
3. Click **Allow Access from Anywhere** (0.0.0.0/0)
4. Click **Confirm**

This allows Vercel to connect to your database.

## 🧪 Testing Your Connection String

Before deploying, test your connection string:

### Option 1: MongoDB Compass
1. Download [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Paste your connection string
3. Click Connect
4. If it connects, your string is correct!

### Option 2: Node.js Script
```javascript
const { MongoClient } = require('mongodb');

const uri = 'YOUR_CONNECTION_STRING_HERE';

async function test() {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    console.log('✅ Connected successfully!');
    await client.close();
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  }
}

test();
```

## 📝 Complete Example

**Before (Incorrect):**
```
mongodb+srv://admin:my@pass123@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority
```
❌ Password `my@pass123` contains `@` which breaks the connection string

**After (Correct):**
```
mongodb+srv://admin:my%40pass123@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority
```
✅ Password `my@pass123` is encoded as `my%40pass123`

## 🔍 Troubleshooting

### Still Getting SSL Error?

1. **Double-check password encoding:**
   - Use online encoder to verify
   - Make sure all special characters are encoded

2. **Verify connection string format:**
   - Starts with `mongodb+srv://`
   - Has username and password before `@`
   - Has cluster name after `@`
   - Ends with `?retryWrites=true&w=majority`

3. **Check MongoDB Atlas:**
   - Cluster is running
   - Network access allows 0.0.0.0/0
   - Database user exists and has correct password

4. **Check Vercel Environment Variables:**
   - Variable name is exactly `MONGODB_URI`
   - Value is the complete connection string
   - No extra quotes or spaces

5. **Redeploy after changes:**
   - Environment variables require redeploy to take effect
   - Go to Deployments → Redeploy

---

**After fixing the connection string and redeploying, the SSL error should be resolved!** ✅


