import type { VercelRequest, VercelResponse } from '@vercel/node';
import { MongoClient } from 'mongodb';
import * as XLSX from 'xlsx';

const MONGODB_URI = process.env.MONGODB_URI || '';
const DB_NAME = process.env.DB_NAME || 'rowshare';
const COLLECTION_NAME = 'data';

interface DataRow {
  id: string;
  [key: string]: any;
}

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

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    if (!MONGODB_URI) {
      return res.status(500).json({ error: 'MongoDB URI not configured. Please set MONGODB_URI environment variable.' });
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

      // Get file from request - can be base64 string or FormData
      let fileBuffer: Buffer;
      let filename: string = '';
      
      if (req.body.file) {
        // Base64 encoded file
        fileBuffer = Buffer.from(req.body.file, 'base64');
        filename = req.body.filename || 'untitled';
      } else if (req.body.data) {
        // Direct buffer data
        fileBuffer = Buffer.from(req.body.data, 'base64');
        filename = req.body.filename || 'untitled';
      } else {
        return res.status(400).json({ error: 'No file provided' });
      }

      // Extract table name from filename (remove extension)
      const tableName = filename
        .replace(/\.(xlsx|xls)$/i, '')
        .trim()
        || 'untitled';

      // Parse Excel file
      const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

      if (jsonData.length === 0) {
        return res.status(400).json({ error: 'No data found in file' });
      }

      // First row as columns
      const columns = jsonData[0].map(col => String(col || '').trim()).filter(col => col);
      
      if (columns.length === 0) {
        return res.status(400).json({ error: 'No columns found in file' });
      }
      
      // Rest as data rows with unique IDs
      const dataRows: DataRow[] = jsonData.slice(1)
        .map((row, index) => {
          const rowData: DataRow = { id: `row_${Date.now()}_${Math.random()}_${index}` };
          columns.forEach((col, colIndex) => {
            rowData[col] = row[colIndex] !== undefined ? row[colIndex] : '';
          });
          return rowData;
        })
        .filter(row => {
          return Object.keys(row).some(key => key !== 'id' && row[key] !== '');
        });

      // Append new data instead of replacing
      // Each upload is stored as a separate document with its own upload date
      const uploadDate = new Date();
      
      // Check if table name already exists (for same filename within 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const existingTable = await collection.findOne({
        tableName: tableName,
        uploadDate: { $gte: thirtyDaysAgo }
      });
      
      // If table name exists, append a number to make it unique
      let finalTableName = tableName;
      if (existingTable) {
        let counter = 2;
        let uniqueName = `${tableName} (${counter})`;
        while (await collection.findOne({ tableName: uniqueName, uploadDate: { $gte: thirtyDaysAgo } })) {
          counter++;
          uniqueName = `${tableName} (${counter})`;
        }
        finalTableName = uniqueName;
      }
      
      const uploadId = `upload_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      
      await collection.insertOne({
        uploadId,
        tableName: finalTableName,
        filename: filename,
        data: dataRows,
        columns,
        uploadDate,
        createdAt: uploadDate,
      });

      return res.status(200).json({
        success: true,
        message: `Uploaded "${finalTableName}" with ${dataRows.length} rows and ${columns.length} columns.`,
        count: dataRows.length,
        columns: columns.length,
        tableName: finalTableName,
      });
    } finally {
      if (client) {
        await client.close();
      }
    }
  } catch (error: any) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: error.message || 'Failed to upload file' });
  }
}

