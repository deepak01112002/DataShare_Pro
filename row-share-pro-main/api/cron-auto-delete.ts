import type { VercelRequest, VercelResponse } from '@vercel/node';
import { MongoClient } from 'mongodb';

// Normalize MongoDB connection string
function normalizeMongoURI(uri: string): string {
  if (!uri) return uri;
  if (uri.includes('?')) {
    const [base, query] = uri.split('?');
    const params = new URLSearchParams(query);
    params.delete('appName');
    if (!params.has('retryWrites')) params.set('retryWrites', 'true');
    if (!params.has('w')) params.set('w', 'majority');
    return `${base}?${params.toString()}`;
  }
  return `${uri}?retryWrites=true&w=majority`;
}

const MONGODB_URI = normalizeMongoURI(process.env.MONGODB_URI || '');
const DB_NAME = process.env.DB_NAME || 'rowshare';
const COLLECTION_NAME = 'data';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Verify cron secret for security
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    if (!MONGODB_URI) {
      return res.status(500).json({ error: 'MongoDB URI not configured' });
    }

    let client: MongoClient | null = null;
    try {
      // MongoDB Atlas mongodb+srv:// automatically uses TLS
      client = new MongoClient(MONGODB_URI, {
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000,
      });
      await client.connect();

      const db = client.db(DB_NAME);
      const collection = db.collection(COLLECTION_NAME);

      // Delete all uploads older than 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const deleteResult = await collection.deleteMany({
        uploadDate: { $lt: thirtyDaysAgo }
      });

      if (deleteResult.deletedCount > 0) {
        return res.status(200).json({
          success: true,
          message: `Deleted ${deleteResult.deletedCount} upload(s) older than 30 days`,
          deletedCount: deleteResult.deletedCount,
        });
      }

      return res.status(200).json({
        success: true,
        message: 'No data older than 30 days found, no deletion needed',
        deletedCount: 0,
      });
    } finally {
      if (client) {
        await client.close();
      }
    }
  } catch (error: any) {
    console.error('Auto-delete error:', error);
    return res.status(500).json({ error: error.message || 'Failed to check auto-delete' });
  }
}

