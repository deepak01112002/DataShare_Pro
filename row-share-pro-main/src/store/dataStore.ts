import { create } from 'zustand';
import { getData, deleteData as deleteDataApi, getTables, DataRow, Table } from '@/services/api';

interface DataState {
  data: DataRow[];
  columns: string[];
  uploadDate: string | null;
  tableName: string | null;
  selectedTableId: string | null;
  tables: Table[];
  loading: boolean;
  error: string | null;
  setData: (data: DataRow[], columns: string[]) => void;
  setSelectedTable: (tableId: string | null) => void;
  deleteRow: (id: string) => Promise<void>;
  deleteAll: () => Promise<void>;
  loadTables: () => Promise<void>;
  loadFromAPI: (tableId?: string) => Promise<void>;
  checkAutoDelete: () => void;
}

export const useDataStore = create<DataState>((set, get) => ({
  data: [],
  columns: [],
  uploadDate: null,
  tableName: null,
  selectedTableId: null,
  tables: [],
  loading: false,
  error: null,

  setData: (data, columns) => {
    const uploadDate = new Date().toISOString();
    set({ data, columns, uploadDate, error: null });
  },

  setSelectedTable: (tableId) => {
    set({ selectedTableId: tableId });
    get().loadFromAPI(tableId || undefined);
  },

  loadTables: async () => {
    try {
      set({ loading: true, error: null });
      const response = await getTables();
      set({ tables: response.tables || [], loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false, tables: [] });
    }
  },

  deleteRow: async (id) => {
    try {
      set({ loading: true, error: null });
      await deleteDataApi(id);
      const newData = get().data.filter(row => row.id !== id);
      set({ data: newData, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  deleteAll: async () => {
    try {
      set({ loading: true, error: null });
      await deleteDataApi();
      set({ data: [], columns: [], uploadDate: null, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  loadFromAPI: async (tableId?: string) => {
    try {
      set({ loading: true, error: null });
      const response = await getData(tableId);
      set({
        data: response.data || [],
        columns: response.columns || [],
        uploadDate: response.uploadDate || null,
        tableName: response.tableName || null,
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error.message,
        loading: false,
        data: [],
        columns: [],
        uploadDate: null,
        tableName: null,
      });
    }
  },

  checkAutoDelete: async () => {
    // Auto-delete is handled server-side - the API already filters out data older than 30 days
    // This function is kept for backward compatibility and can trigger manual cleanup if needed
    // The /api/data endpoint automatically excludes uploads older than 30 days
    // For scheduled cleanup, use external cron service or manual trigger
  },
}));
