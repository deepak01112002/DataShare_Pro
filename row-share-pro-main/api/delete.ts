import type { VercelRequest, VercelResponse } from '@vercel/node';
import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || '';
const DB_NAME = process.env.DB_NAME || 'rowshare';
const COLLECTION_NAME = 'data';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).json({}).end();
  }

  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    if (!MONGODB_URI) {
      return res.status(500).json({ error: 'MongoDB URI not configured' });
    }

    let client: MongoClient | null = null;
    try {
      client = new MongoClient(MONGODB_URI, {
        serverSelectionTimeoutMS: 8000, // 8 second timeout
        connectTimeoutMS: 8000,
      });
      await client.connect();

      const db = client.db(DB_NAME);
      const collection = db.collection(COLLECTION_NAME);

      const { id } = req.query;

      if (id && id !== 'all') {
        // Delete specific row from all uploads
        const uploads = await collection.find({}).toArray();
        
        for (const upload of uploads) {
          if (upload.data && Array.isArray(upload.data)) {
            const updatedData = upload.data.filter((row: any) => row.id !== id);
            if (updatedData.length !== upload.data.length) {
              await collection.updateOne(
                { uploadId: upload.uploadId },
                { $set: { data: updatedData } }
              );
              break; // Found and updated, exit loop
            }
          }
        }
      } else {
        // Delete all data (all uploads)
        await collection.deleteMany({});
      }

      return res.status(200).json({
        success: true,
        message: id === 'all' ? 'All data deleted' : 'Row deleted',
      });
    } finally {
      if (client) {
        await client.close();
      }
    }
  } catch (error: any) {
    console.error('Delete error:', error);
    return res.status(500).json({ error: error.message || 'Failed to delete data' });
  }
}

