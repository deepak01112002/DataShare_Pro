import { useState } from 'react';
import { Upload, FileSpreadsheet, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useDataStore } from '@/store/dataStore';
import { uploadFile } from '@/services/api';

export const FileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const { setData, loadTables } = useDataStore();
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Only allow Excel files
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      toast({
        title: "Invalid file format",
        description: 'Please upload Excel files (.xlsx or .xls) only.',
        variant: "destructive",
      });
      event.target.value = '';
      return;
    }

    setUploading(true);
    
    try {
      const response = await uploadFile(file);
      
      // Reload tables from API
      await loadTables();
      // Get the latest tables and select the newest one
      const { tables: updatedTables, setSelectedTable } = useDataStore.getState();
      if (updatedTables.length > 0) {
        // Select the first table (most recent)
        setSelectedTable(updatedTables[0].id);
      } else {
        await loadFromAPI();
      }
      
      toast({
        title: "File uploaded successfully",
        description: response.message || `Added ${response.count || 0} rows with ${response.columns || 0} columns. Data has been appended.`,
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : 'Failed to upload file',
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  return (
    <Card className="p-6 sm:p-8 border-2 border-dashed border-border hover:border-primary transition-all duration-300 hover:shadow-lg">
      <div className="flex flex-col items-center justify-center gap-4 sm:gap-6">
        <div className="p-4 sm:p-5 bg-primary/10 rounded-full animate-pulse">
          <Upload className="h-10 w-10 sm:h-12 sm:w-12 text-primary" />
        </div>
        
        <div className="text-center space-y-2">
          <h3 className="text-lg sm:text-xl font-semibold">Upload Your Data File</h3>
          <p className="text-sm sm:text-base text-muted-foreground">
            Upload Excel files to store and manage your data
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-muted-foreground">
          <FileSpreadsheet className="h-4 w-4 sm:h-5 sm:w-5" />
          <span>Excel files (.xlsx, .xls)</span>
        </div>

        <Button 
          disabled={uploading} 
          onClick={() => document.getElementById('file-upload')?.click()}
          className="min-w-[140px] sm:min-w-[160px]"
          size="lg"
        >
          {uploading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Choose File
            </>
          )}
        </Button>
        <input
          id="file-upload"
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>
    </Card>
  );
};
