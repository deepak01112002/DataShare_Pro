const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export interface DataRow {
  id: string;
  [key: string]: any;
}

export interface ApiResponse {
  success?: boolean;
  data?: DataRow[];
  columns?: string[];
  uploadDate?: string | null;
  tableName?: string | null;
  message?: string;
  error?: string;
  count?: number;
}

export interface Table {
  id: string;
  name: string;
  uploadDate: string;
  rowCount: number;
  columnCount: number;
}

export interface TablesResponse {
  tables: Table[];
}

// Upload Excel file
export const uploadFile = async (file: File): Promise<ApiResponse> => {
  try {
    // Convert file to base64
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Remove data URL prefix
        const base64String = result.split(',')[1];
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        file: base64,
        filename: file.name,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to upload file');
    }

    return await response.json();
  } catch (error: any) {
    throw new Error(error.message || 'Failed to upload file');
  }
};

// Get all tables
export const getTables = async (): Promise<TablesResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/tables`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch tables');
    }

    return await response.json();
  } catch (error: any) {
    return { tables: [] };
  }
};

// Get data for a specific table or all tables
export const getData = async (tableId?: string): Promise<ApiResponse> => {
  try {
    const url = tableId ? `${API_BASE_URL}/data?tableId=${tableId}` : `${API_BASE_URL}/data`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    return await response.json();
  } catch (error: any) {
    // Return empty data on error
    return {
      data: [],
      columns: [],
      uploadDate: null,
      tableName: null,
    };
  }
};

// Delete data
export const deleteData = async (id?: string): Promise<ApiResponse> => {
  try {
    const url = id ? `${API_BASE_URL}/delete?id=${id}` : `${API_BASE_URL}/delete?id=all`;
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete data');
    }

    return await response.json();
  } catch (error: any) {
    throw new Error(error.message || 'Failed to delete data');
  }
};

