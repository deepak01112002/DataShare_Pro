import type { VercelRequest, VercelResponse } from '@vercel/node';
import { MongoClient } from 'mongodb';

const DB_NAME = process.env.DB_NAME || 'rowshare';
const COLLECTION_NAME = 'data';

// Normalize MongoDB connection string
function normalizeMongoURI(uri: string): string {
  if (!uri) return uri;
  
  // If it already has query parameters
  if (uri.includes('?')) {
    const [base, query] = uri.split('?');
    const params = new URLSearchParams(query);
    
    // Remove problematic parameters
    params.delete('appName');
    
    // Add required parameters if missing
    if (!params.has('retryWrites')) {
      params.set('retryWrites', 'true');
    }
    if (!params.has('w')) {
      params.set('w', 'majority');
    }
    
    return `${base}?${params.toString()}`;
  }
  
  // No query parameters, add them
  return `${uri}?retryWrites=true&w=majority`;
}

const MONGODB_URI = normalizeMongoURI(process.env.MONGODB_URI || '');

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

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    if (!MONGODB_URI) {
      console.warn('MongoDB URI not configured, returning empty data');
      return res.status(200).json({
        data: [],
        columns: [],
        uploadDate: null,
        tableName: null,
      });
    }

    let client: MongoClient | null = null;
    try {
      // MongoDB Atlas mongodb+srv:// automatically uses TLS
      // Only set connection options, don't override TLS settings
      client = new MongoClient(MONGODB_URI, {
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000,
      });
      await client.connect();

      const db = client.db(DB_NAME);
      const collection = db.collection(COLLECTION_NAME);

      const { tableId, showAll } = req.query;

      // Get all uploads - filter by 30 days unless showAll is true
      let uploads;
      
      if (tableId && tableId !== 'all') {
        // Get specific table
        const query: any = { uploadId: tableId };
        if (showAll !== 'true') {
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          query.uploadDate = { $gte: thirtyDaysAgo };
        }
        uploads = await collection.find(query).sort({ uploadDate: -1 }).toArray();
      } else {
        // Get all tables (merged)
        const query: any = {};
        if (showAll !== 'true') {
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          query.uploadDate = { $gte: thirtyDaysAgo };
        }
        uploads = await collection.find(query).sort({ uploadDate: -1 }).toArray();
      }

      if (uploads.length === 0) {
        return res.status(200).json({
          data: [],
          columns: [],
          uploadDate: null,
          tableName: null,
        });
      }

      // If specific table requested, return only that table's data
      if (tableId && tableId !== 'all' && uploads.length > 0) {
        const upload = uploads[0];
        return res.status(200).json({
          data: upload.data || [],
          columns: upload.columns || [],
          uploadDate: upload.uploadDate || upload.createdAt || null,
          tableName: upload.tableName || null,
        });
      }

      // Merge all data from all valid uploads (when tableId is 'all' or not provided)
      let allData: any[] = [];
      let allColumns: Set<string> = new Set();
      let latestUploadDate: Date | null = null;

      for (const upload of uploads) {
        if (upload.data && Array.isArray(upload.data)) {
          allData = allData.concat(upload.data);
        }
        if (upload.columns && Array.isArray(upload.columns)) {
          upload.columns.forEach((col: string) => allColumns.add(col));
        }
        if (upload.uploadDate) {
          const uploadDate = new Date(upload.uploadDate);
          if (!latestUploadDate || uploadDate > latestUploadDate) {
            latestUploadDate = uploadDate;
          }
        }
      }

      // Get the most recent columns structure (use the latest upload's columns as primary)
      const latestUpload = uploads[0];
      const primaryColumns = latestUpload.columns || Array.from(allColumns);

      return res.status(200).json({
        data: allData,
        columns: primaryColumns,
        uploadDate: latestUploadDate ? latestUploadDate.toISOString() : null,
        tableName: 'All Tables',
      });
    } finally {
      if (client) {
        await client.close();
      }
    }
  } catch (error: any) {
    console.error('Get data error:', error);
    const errorMessage = error.message || 'Unknown error';
    const isSSLerror = errorMessage.includes('SSL') || errorMessage.includes('TLS') || errorMessage.includes('tlsv1') || errorMessage.includes('0A000438');
    
    // Log connection string info (without password) for debugging
    const uriForLog = MONGODB_URI ? MONGODB_URI.replace(/:([^:@]+)@/, ':****@') : 'not set';
    console.error('Connection string (masked):', uriForLog);
    
    if (isSSLerror) {
      return res.status(500).json({
        error: 'MongoDB SSL/TLS connection error',
        message: 'Unable to establish secure connection to MongoDB Atlas.',
        troubleshooting: [
          '1. Verify your MONGODB_URI in Vercel environment variables',
          '2. Ensure connection string format: mongodb+srv://user:pass@cluster.mongodb.net/?retryWrites=true&w=majority',
          '3. Check MongoDB Atlas Network Access allows 0.0.0.0/0',
          '4. Verify database user credentials are correct',
          '5. Ensure cluster is running in MongoDB Atlas'
        ],
        connectionStringFormat: 'mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/?retryWrites=true&w=majority',
      });
    }
    
    // Return empty data on other errors to prevent frontend crashes
    return res.status(200).json({
      data: [],
      columns: [],
      uploadDate: null,
      tableName: null,
      error: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
    });
  }
}

