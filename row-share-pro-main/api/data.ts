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
    // Return error details for debugging
    const errorMessage = error.message || 'Unknown error';
    const isSSLerror = errorMessage.includes('SSL') || errorMessage.includes('TLS') || errorMessage.includes('tlsv1');
    
    if (isSSLerror) {
      return res.status(500).json({
        error: 'MongoDB connection error',
        message: 'SSL/TLS connection failed. Please check your MONGODB_URI connection string format and ensure MongoDB Atlas network access is configured correctly.',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
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

