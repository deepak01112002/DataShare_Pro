# Fix for MongoDB SSL/TLS Error and Prior Data Visibility

## 🔴 Error: SSL/TLS Connection Error

```
error:0A000438:SSL routines:ssl3_read_bytes:tlsv1 alert internal error
```

## ✅ Fixes Applied

### 1. Added Proper SSL/TLS Configuration

Updated all MongoDB connections to include:
- `tls: true` - Enable TLS/SSL
- `tlsAllowInvalidCertificates: false` - Require valid certificates
- `retryWrites: true` - Retry writes on failure
- `retryReads: true` - Retry reads on failure
- Increased timeout to 10 seconds

### 2. Connection String Format

Make sure your MongoDB URI in Vercel environment variables is correctly formatted:

**Correct Format:**
```
mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
```

**Important Notes:**
- Use `mongodb+srv://` protocol (not `mongodb://`)
- URL encode special characters in password (e.g., `@` becomes `%40`)
- Include `?retryWrites=true&w=majority` at the end

## 🔧 Common Issues and Solutions

### Issue 1: SSL/TLS Error

**Causes:**
1. Connection string format incorrect
2. MongoDB Atlas network access not configured
3. Password contains special characters not URL encoded

**Solution:**
1. Check connection string format
2. Ensure MongoDB Atlas allows access from 0.0.0.0/0
3. URL encode password special characters

### Issue 2: Prior Data Not Visible

**Cause:** Data filter only shows uploads from last 30 days

**Temporary Solution:** The 30-day filter is working as designed for auto-delete. However, if you need to see all data temporarily, you can modify the query.

**Note:** If you have data older than 30 days and need to see it, we can add a query parameter to show all data temporarily.

## 🚀 Next Steps

### 1. Verify Connection String

Make sure your `MONGODB_URI` environment variable in Vercel is:

1. **Correctly formatted:**
   ```
   mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/?retryWrites=true&w=majority
   ```

2. **Password URL Encoded:**
   - If password is `pass@word123`, use `pass%40word123`
   - Common encodings:
     - `@` → `%40`
     - `#` → `%23`
     - `$` → `%24`
     - `%` → `%25`
     - `/` → `%2F`
     - `?` → `%3F`

3. **Test the connection string:**
   - You can test it in MongoDB Compass or MongoDB shell
   - If it works there, it should work in Vercel

### 2. Check MongoDB Atlas Settings

1. **Network Access:**
   - Go to MongoDB Atlas → Network Access
   - Ensure `0.0.0.0/0` is whitelisted (allows all IPs)

2. **Database User:**
   - Go to Database Access
   - Verify user exists and has correct permissions
   - Reset password if needed

### 3. Redeploy After Changes

After updating environment variables:
1. Go to Vercel → Deployments
2. Click "Redeploy" on latest deployment
3. Wait for deployment to complete

## 📝 Troubleshooting

### If SSL Error Persists:

1. **Check Connection String:**
   ```bash
   # Format should be:
   mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
   ```

2. **URL Encode Password:**
   Use online tool: https://www.urlencoder.org/
   
   Example:
   - Password: `my@pass#123`
   - Encoded: `my%40pass%23123`

3. **Verify MongoDB Atlas:**
   - Cluster is running
   - Network access allows 0.0.0.0/0
   - Database user has read/write permissions

4. **Check Vercel Logs:**
   - Go to Vercel → Deployments → Latest
   - Click "View Function Logs"
   - Look for specific MongoDB errors

### If Prior Data Still Not Visible:

The system is designed to automatically filter out data older than 30 days. If you need to:
- View all data (temporarily)
- Recover old data

We can add a query parameter or admin option to show all data regardless of date.

---

**After fixing the connection string and redeploying, the SSL error should be resolved!** ✅


