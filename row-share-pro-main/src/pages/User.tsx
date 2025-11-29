import { useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { UserDataView } from '@/components/UserDataView';
import { TableSelector } from '@/components/TableSelector';
import { useDataStore } from '@/store/dataStore';

const User = () => {
  const { loadFromAPI, checkAutoDelete, selectedTableId, loadTables } = useDataStore();

  useEffect(() => {
    loadTables();
    loadFromAPI(selectedTableId || undefined);
    checkAutoDelete();
    
    // Refresh data every 30 seconds
    const interval = setInterval(() => {
      loadTables();
      loadFromAPI(selectedTableId || undefined);
    }, 30000);

    return () => clearInterval(interval);
  }, [selectedTableId]);

  return (
    <Layout>
      <div className="space-y-4 sm:space-y-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">User Panel</h2>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            Search, filter, and share data via WhatsApp
          </p>
        </div>

        <TableSelector />
        <UserDataView />
      </div>
    </Layout>
  );
};

export default User;
