import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { FileUpload } from '@/components/FileUpload';
import { DataTable } from '@/components/DataTable';
import { TableSelector } from '@/components/TableSelector';
import { useDataStore } from '@/store/dataStore';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar, Loader2 } from 'lucide-react';

const Admin = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { loadFromAPI, checkAutoDelete, uploadDate, loading, selectedTableId, loadTables } = useDataStore();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin-login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      loadTables();
      loadFromAPI(selectedTableId || undefined);
      checkAutoDelete();
    }
  }, [isAuthenticated, selectedTableId]);

  const getDaysRemaining = () => {
    if (!uploadDate) return null;
    
    const uploadTime = new Date(uploadDate).getTime();
    const currentTime = new Date().getTime();
    const daysPassed = (currentTime - uploadTime) / (1000 * 60 * 60 * 24);
    const daysRemaining = Math.max(0, Math.ceil(30 - daysPassed));
    
    return daysRemaining;
  };

  const daysRemaining = getDaysRemaining();

  return (
    <Layout>
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Admin Panel</h2>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
              Upload and manage your data files
            </p>
          </div>
        </div>

        {daysRemaining !== null && daysRemaining > 0 && (
          <Alert className="border-primary/20 bg-primary/5">
            <Calendar className="h-4 w-4" />
            <AlertDescription className="text-sm sm:text-base">
              Data will auto-delete in <strong>{daysRemaining} {daysRemaining === 1 ? 'day' : 'days'}</strong> (uploaded on{' '}
              {new Date(uploadDate!).toLocaleDateString()})
            </AlertDescription>
          </Alert>
        )}

        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        <FileUpload />
        <TableSelector />
        <DataTable />
      </div>
    </Layout>
  );
};

export default Admin;
