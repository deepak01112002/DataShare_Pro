# Deployment Guide for Shree Aadesh Enterprise

This guide will help you deploy the application to Vercel with MongoDB Atlas.

## Prerequisites

1. A Vercel account (free tier available)
2. A MongoDB Atlas account (free tier available)
3. Node.js installed locally (for testing)

## Step 1: Set up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account or sign in
3. Create a new cluster (choose the free M0 tier)
4. Create a database user:
   - Go to Database Access
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create a username and password (save these!)
5. Whitelist IP addresses:
   - Go to Network Access
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0) for Vercel deployment
6. Get your connection string:
   - Go to Clusters
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `rowshare` (or your preferred database name)

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Configure environment variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `DB_NAME`: `rowshare` (or your preferred name)
   - `CRON_SECRET`: A random secret string (e.g., generate with `openssl rand -hex 32`)
6. Click "Deploy"

### Option B: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. Set environment variables:
   ```bash
   vercel env add MONGODB_URI
   vercel env add DB_NAME
   vercel env add CRON_SECRET
   ```

5. Redeploy with environment variables:
   ```bash
   vercel --prod
   ```

## Step 3: Configure Cron Job

The auto-delete cron job is configured in `vercel.json` to run daily at midnight UTC.

To manually trigger it or test:
1. Go to your Vercel project settings
2. Navigate to "Cron Jobs"
3. The cron job should be automatically detected from `vercel.json`

## Step 4: Test the Application

1. Visit your deployed URL
2. Go to `/admin-login`
3. Login with:
   - Email: `test@gmail.com`
   - Password: `test@123`
4. Upload an Excel file
5. Check the User panel to see the data
6. Test WhatsApp sharing

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `DB_NAME` | Database name | No (defaults to 'rowshare') |
| `CRON_SECRET` | Secret for cron endpoint security | Yes |
| `VITE_API_URL` | API base URL (for development) | No |

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

3. Fill in your environment variables

4. Run the development server:
   ```bash
   npm run dev
   ```

5. The API will be available at `http://localhost:8080/api`

## Troubleshooting

### API endpoints return 500 errors
- Check that `MONGODB_URI` is correctly set in Vercel
- Verify your MongoDB cluster is running
- Check Vercel function logs for detailed error messages

### Cron job not running
- Verify `CRON_SECRET` is set in Vercel
- Check Vercel cron job logs
- Ensure the cron schedule in `vercel.json` is correct

### Data not persisting
- Verify MongoDB connection string is correct
- Check that your IP is whitelisted in MongoDB Atlas
- Verify database user has read/write permissions

## Security Notes

- Change the default admin credentials in production
- Use a strong `CRON_SECRET`
- Consider implementing rate limiting
- Use MongoDB Atlas IP whitelisting for additional security

## Support

For issues or questions, check:
- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)


