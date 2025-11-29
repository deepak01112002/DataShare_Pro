import type { VercelRequest, VercelResponse } from '@vercel/node';
import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || '';
const DB_NAME = process.env.DB_NAME || 'rowshare';
const COLLECTION_NAME = 'data';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).json({}).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    if (!MONGODB_URI) {
      return res.status(200).json({ tables: [] });
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

      const { showAll } = req.query;

      // Get all uploads - filter by 30 days unless showAll is true
      let query: any = {};
      if (showAll !== 'true') {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        query.uploadDate = { $gte: thirtyDaysAgo };
      }
      
      const uploads = await collection.find(query).sort({ uploadDate: -1 }).toArray();

      // Map uploads to tables
      const tables = uploads.map((upload, index) => {
        // Use tableName if available, otherwise try filename, otherwise default
        let name = upload.tableName;
        if (!name && upload.filename) {
          name = upload.filename.replace(/\.(xlsx|xls)$/i, '').trim();
        }
        if (!name) {
          name = `Table ${uploads.length - index}`;
        }
        
        return {
          id: upload.uploadId || upload._id?.toString() || `table_${index}`,
          name: name,
          uploadDate: upload.uploadDate || upload.createdAt,
          rowCount: upload.data?.length || 0,
          columnCount: upload.columns?.length || 0,
        };
      });

      return res.status(200).json({ tables });
    } finally {
      if (client) {
        await client.close();
      }
    }
  } catch (error: any) {
    console.error('Get tables error:', error);
    const errorMessage = error.message || 'Unknown error';
    const isSSLerror = errorMessage.includes('SSL') || errorMessage.includes('TLS') || errorMessage.includes('tlsv1');
    
    if (isSSLerror) {
      return res.status(500).json({
        error: 'MongoDB connection error',
        message: 'SSL/TLS connection failed. Please check your MONGODB_URI connection string format.',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
        tables: [],
      });
    }
    
    return res.status(200).json({ tables: [] });
  }
}

