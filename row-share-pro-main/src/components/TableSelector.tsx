import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useDataStore } from '@/store/dataStore';
import { Loader2, Table2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export const TableSelector = () => {
  const { tables, selectedTableId, setSelectedTable, loadTables, loading } = useDataStore();

  useEffect(() => {
    loadTables();
  }, []);

  if (loading && tables.length === 0) {
    return (
      <Card className="p-4">
        <div className="flex items-center justify-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm text-muted-foreground">Loading tables...</span>
        </div>
      </Card>
    );
  }

  if (tables.length === 0) {
    return null;
  }

  return (
    <Card className="p-4">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Table2 className="h-4 w-4" />
          <span>Select Table:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {tables.map((table) => (
            <Button
              key={table.id}
              variant={selectedTableId === table.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTable(table.id)}
              className={cn(
                'transition-all',
                selectedTableId === table.id && 'shadow-md'
              )}
            >
              {table.name}
              <span className="ml-2 text-xs opacity-70">
                ({table.rowCount})
              </span>
            </Button>
          ))}
          {tables.length > 0 && (
            <Button
              variant={selectedTableId === null ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTable(null)}
              className={cn(
                'transition-all',
                selectedTableId === null && 'shadow-md'
              )}
            >
              All Tables
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

