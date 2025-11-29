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
      client = new MongoClient(MONGODB_URI);
      await client.connect();

      const db = client.db(DB_NAME);
      const collection = db.collection(COLLECTION_NAME);

      const { tableId } = req.query;

      // Get all uploads that are within 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      let uploads;
      
      if (tableId && tableId !== 'all') {
        // Get specific table
        uploads = await collection.find({
          uploadId: tableId,
          uploadDate: { $gte: thirtyDaysAgo }
        }).sort({ uploadDate: -1 }).toArray();
      } else {
        // Get all tables (merged)
        uploads = await collection.find({
          uploadDate: { $gte: thirtyDaysAgo }
        }).sort({ uploadDate: -1 }).toArray();
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
    // Return empty data on error instead of failing
    return res.status(200).json({
      data: [],
      columns: [],
      uploadDate: null,
      tableName: null,
    });
  }
}

