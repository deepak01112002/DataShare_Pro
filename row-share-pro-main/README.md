# Shree Aadesh Enterprise

A modern web application for uploading, managing, and sharing Excel data with WhatsApp integration. Built with React, TypeScript, and deployed on Vercel with MongoDB Atlas.

## Features

- 📊 **Excel File Upload**: Upload and parse Excel files (.xlsx, .xls)
- 🔐 **Admin Panel**: Secure admin login to upload and manage data
- 👥 **User Panel**: Public interface to view, search, and filter data
- 📱 **WhatsApp Sharing**: Share data rows directly via WhatsApp with formatted messages
- 🗑️ **Auto-Delete**: Automatic data cleanup after 30 days
- 📱 **Responsive Design**: Works seamlessly on all screen sizes
- 🎨 **Modern UI**: Beautiful, intuitive interface built with shadcn/ui

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: shadcn/ui, Tailwind CSS
- **State Management**: Zustand
- **Backend**: Vercel Serverless Functions
- **Database**: MongoDB Atlas
- **Deployment**: Vercel

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas account (free tier available)
- Vercel account (free tier available)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd row-share-pro-main
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your MongoDB connection string:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
   DB_NAME=rowshare
   CRON_SECRET=your-random-secret-key
   ```

4. **Start development server**

   **Option A: Full Stack Development (Recommended)**
   ```bash
   npm run dev:full
   ```
   This uses Vercel CLI to run both frontend and API serverless functions locally.
   - Frontend: http://localhost:3000
   - API endpoints will work at http://localhost:3000/api/*
   - Requires Vercel CLI (installed automatically with dependencies)

   **Option B: Frontend Only**
   ```bash
   npm run dev
   ```
   This runs only the Vite dev server (frontend only).
   - Frontend: http://localhost:8080
   - API endpoints will NOT work (404 errors)
   - Use this for UI-only development

5. **Access the application**
   - Home/User Panel: http://localhost:3000 (or :8080 for frontend-only)
   - Admin Login: http://localhost:3000/admin-login (or :8080/admin-login)
     - Email: `test@gmail.com`
     - Password: `test@123`

**Note:** For full functionality (upload, data management), use `npm run dev:full`. The regular `npm run dev` is for frontend-only development.

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions to Vercel.

### Quick Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `MONGODB_URI`
   - `DB_NAME` (optional)
   - `CRON_SECRET`
4. Deploy!

## Project Structure

```
├── api/                    # Vercel serverless functions
│   ├── upload.ts          # Excel file upload endpoint
│   ├── data.ts            # Get data endpoint
│   ├── delete.ts          # Delete data endpoint
│   └── cron-auto-delete.ts # Auto-delete cron job
├── src/
│   ├── components/        # React components
│   ├── pages/            # Page components
│   ├── services/         # API service layer
│   ├── store/            # Zustand state management
│   └── contexts/         # React contexts
└── vercel.json           # Vercel configuration
```

## API Endpoints

- `POST /api/upload` - Upload Excel file
- `GET /api/data` - Get all data
- `DELETE /api/delete?id=all` - Delete all data
- `DELETE /api/delete?id=<row_id>` - Delete specific row
- `GET /api/cron-auto-delete` - Cron job for auto-deletion (runs daily)

## Features in Detail

### Admin Panel
- Secure login system
- Excel file upload with validation
- View all uploaded data in a table
- Delete individual rows or all data
- See days remaining until auto-deletion

### User Panel
- Search across all columns
- Filter by specific column values
- View detailed row information
- Share data via WhatsApp with one click
- Real-time data updates

### Auto-Delete
- Data automatically deleted after 30 days
- Daily cron job checks and cleans up old data
- Configurable via Vercel cron jobs

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `DB_NAME` | Database name | No (defaults to 'rowshare') |
| `CRON_SECRET` | Secret for cron endpoint | Yes |
| `VITE_API_URL` | API base URL | No |

## Security

- Admin authentication required for uploads
- MongoDB connection secured with credentials
- Cron endpoint protected with secret
- Input validation on file uploads

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License

## Support

For deployment help, see [DEPLOYMENT.md](./DEPLOYMENT.md)

For issues or questions, please open an issue on GitHub.
