import * as XLSX from 'xlsx';
import * as pdfjsLib from 'pdfjs-dist';
import { DataRow } from '@/store/dataStore';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export const parseExcel = async (file: File): Promise<{ data: DataRow[]; columns: string[] }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

        if (jsonData.length === 0) {
          reject(new Error('No data found in file'));
          return;
        }

        // First row as columns
        const columns = jsonData[0].map(col => String(col || '').trim());
        
        // Rest as data rows with unique IDs
        const dataRows: DataRow[] = jsonData.slice(1).map((row, index) => {
          const rowData: DataRow = { id: `row_${Date.now()}_${index}` };
          columns.forEach((col, colIndex) => {
            rowData[col] = row[colIndex] !== undefined ? row[colIndex] : '';
          });
          return rowData;
        }).filter(row => {
          // Filter out completely empty rows
          return Object.keys(row).some(key => key !== 'id' && row[key] !== '');
        });

        resolve({ data: dataRows, columns });
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsBinaryString(file);
  });
};

export const parsePDF = async (file: File): Promise<{ data: DataRow[]; columns: string[] }> => {
  return new Promise(async (resolve, reject) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      let allText = '';
      
      // Extract text from all pages
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        allText += pageText + '\n';
      }

      // Try to parse as table (simple heuristic: lines with consistent separators)
      const lines = allText.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        reject(new Error('PDF does not contain tabular data'));
        return;
      }

      // Attempt to detect columns from first line
      // This is a simple implementation - real PDF table extraction is complex
      const firstLine = lines[0];
      const possibleDelimiters = ['\t', '|', ',', '  '];
      
      let delimiter = possibleDelimiters.find(d => firstLine.includes(d)) || '  ';
      const columns = firstLine.split(delimiter).map(col => col.trim()).filter(col => col);

      const dataRows: DataRow[] = lines.slice(1).map((line, index) => {
        const values = line.split(delimiter).map(val => val.trim());
        const rowData: DataRow = { id: `row_${Date.now()}_${index}` };
        
        columns.forEach((col, colIndex) => {
          rowData[col] = values[colIndex] || '';
        });
        
        return rowData;
      }).filter(row => {
        return Object.keys(row).some(key => key !== 'id' && row[key] !== '');
      });

      if (dataRows.length === 0) {
        reject(new Error('Could not parse table structure from PDF'));
        return;
      }

      resolve({ data: dataRows, columns });
    } catch (error) {
      reject(error);
    }
  });
};
