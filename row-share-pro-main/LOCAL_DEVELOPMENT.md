# Local Development Guide

## Quick Start

### For Full Functionality (Frontend + API)

1. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Create a `.env` file in the root directory:
   ```
   MONGODB_URI=your_mongodb_connection_string
   DB_NAME=rowshare
   CRON_SECRET=your-random-secret-key
   ```

3. **Login to Vercel CLI** (first time only):
   ```bash
   npx vercel login
   ```

4. **Start the full development server**:
   ```bash
   npm run dev:full
   ```

5. **Access the application**:
   - Open http://localhost:3000
   - API endpoints will work at http://localhost:3000/api/*

### For Frontend-Only Development

If you only want to work on the UI and don't need API functionality:

```bash
npm run dev
```

- Frontend: http://localhost:8080
- **Note:** API calls will return 404 errors in this mode

## Troubleshooting

### "API server not running" error

This means you're using `npm run dev` (frontend-only). Switch to `npm run dev:full` for full functionality.

### Vercel CLI not found

Make sure you've run `npm install` to install all dependencies including Vercel CLI.

### MongoDB connection errors

1. Check your `.env` file has the correct `MONGODB_URI`
2. Verify your MongoDB Atlas cluster is running
3. Ensure your IP is whitelisted in MongoDB Atlas

### Port already in use

If port 3000 is already in use:
- Vercel CLI will automatically use the next available port
- Check the terminal output for the actual port number

## Development Modes Comparison

| Mode | Command | Frontend | API | Use Case |
|------|---------|----------|-----|----------|
| Full Stack | `npm run dev:full` | ✅ | ✅ | Complete development |
| Frontend Only | `npm run dev` | ✅ | ❌ | UI-only work |

## Environment Variables

For local development, create a `.env` file with:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
DB_NAME=rowshare
CRON_SECRET=your-random-secret-key-here
```

**Important:** Never commit your `.env` file to Git!


