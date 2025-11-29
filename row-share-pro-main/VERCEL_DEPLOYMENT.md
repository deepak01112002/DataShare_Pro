# Vercel Deployment Checklist

## ✅ Pre-Deployment Checklist

### 1. Environment Variables Setup
Make sure to add these environment variables in Vercel Dashboard:

**Required:**
- `MONGODB_URI` - Your MongoDB Atlas connection string
- `CRON_SECRET` - Random secret for cron job security (generate with: `openssl rand -hex 32`)

**Optional:**
- `DB_NAME` - Database name (defaults to `rowshare` if not set)

### 2. MongoDB Atlas Configuration

1. ✅ Create MongoDB Atlas cluster (free M0 tier works)
2. ✅ Create database user
3. ✅ Whitelist IP: `0.0.0.0/0` (allows access from Vercel)
4. ✅ Get connection string and set it as `MONGODB_URI`

### 3. Code Changes for Production

✅ **Already configured:**
- API endpoints use relative paths (`/api/*`) - works automatically on Vercel
- CORS headers are set
- Serverless functions are in `/api` folder
- `vercel.json` configured with cron job
- No localhost references in production code

### 4. Build Configuration

✅ **Already configured:**
- Vite build outputs to `dist/` folder
- API functions automatically detected in `/api` folder
- No changes needed to build process

## 🚀 Deployment Steps

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### Step 2: Deploy on Vercel

**Option A: Via Vercel Dashboard (Recommended)**
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure project:
   - Framework Preset: Vite
   - Root Directory: `./` (or leave default)
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Add Environment Variables:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
   CRON_SECRET=your-random-secret-key-here
   DB_NAME=rowshare
   ```
6. Click "Deploy"

**Option B: Via Vercel CLI**
```bash
npx vercel
# Follow prompts
# Add environment variables when asked
```

### Step 3: Configure Cron Job

After deployment:
1. Go to your project settings in Vercel
2. Navigate to "Cron Jobs"
3. Verify the cron job is automatically detected from `vercel.json`:
   - Path: `/api/cron-auto-delete`
   - Schedule: `0 0 * * *` (daily at midnight UTC)
   - Secret: Use your `CRON_SECRET` value

### Step 4: Test Deployment

1. Visit your deployed URL (e.g., `https://your-project.vercel.app`)
2. Test Home Page (User Panel)
3. Test Admin Login: `/admin-login`
   - Email: `test@gmail.com`
   - Password: `test@123`
4. Test File Upload
5. Test Table Selection
6. Test WhatsApp Sharing

## 🔍 Post-Deployment Verification

- [ ] Home page loads correctly
- [ ] Admin login works
- [ ] File upload works
- [ ] Tables are created with correct names
- [ ] Data is displayed correctly
- [ ] Pagination works
- [ ] Search and filter work
- [ ] WhatsApp sharing works
- [ ] Delete functionality works
- [ ] Cron job is scheduled (check Vercel dashboard)

## 🐛 Troubleshooting

### API Returns 404
- Check that API files are in `/api` folder
- Verify file names match endpoints (e.g., `upload.ts` for `/api/upload`)

### MongoDB Connection Errors
- Verify `MONGODB_URI` is set correctly in Vercel
- Check MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- Verify database user credentials

### Cron Job Not Running
- Check Vercel dashboard → Cron Jobs
- Verify `CRON_SECRET` matches in environment variables and cron configuration
- Check function logs for errors

### Build Fails
- Check Node.js version (Vercel uses 18.x by default)
- Verify all dependencies are in `package.json`
- Check build logs in Vercel dashboard

## 📝 Important Notes

1. **API URLs**: The app uses relative paths (`/api/*`) which automatically work on Vercel
2. **Environment Variables**: Never commit `.env` file - always use Vercel dashboard
3. **Cron Secret**: Keep `CRON_SECRET` secure - use it in Vercel cron job configuration
4. **MongoDB**: Free tier has connection limits - consider upgrading for production
5. **Admin Credentials**: Change default admin credentials in production (edit `AuthContext.tsx`)

## 🔐 Security Recommendations

- [ ] Change default admin password
- [ ] Use strong `CRON_SECRET`
- [ ] Enable MongoDB Atlas authentication
- [ ] Review and restrict CORS if needed
- [ ] Consider adding rate limiting

## 📚 Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Vercel Serverless Functions](https://vercel.com/docs/functions/serverless-functions)

---

**Ready to deploy?** Push your code to GitHub and follow Step 2! 🚀

