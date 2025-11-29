import { useState, useMemo } from 'react';
import { Trash2, Eye, X, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from '@/components/ui/pagination';
import { useDataStore, DataRow } from '@/store/dataStore';
import { useToast } from '@/hooks/use-toast';

const ITEMS_PER_PAGE = 10;

export const DataTable = () => {
  const { data, columns, deleteRow, deleteAll, loading, loadFromAPI, tableName } = useDataStore();
  const { toast } = useToast();
  const [selectedRow, setSelectedRow] = useState<DataRow | null>(null);
  const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const handleDeleteRow = async (id: string) => {
    try {
      await deleteRow(id);
      toast({
        title: "Row deleted",
        description: "The row has been removed from the database.",
      });
    } catch (error: any) {
      toast({
        title: "Delete failed",
        description: error.message || "Failed to delete row",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAll = async () => {
    try {
      await deleteAll();
      setShowDeleteAllDialog(false);
      setCurrentPage(1); // Reset to first page
      toast({
        title: "All data deleted",
        description: "The entire dataset has been cleared.",
      });
    } catch (error: any) {
      toast({
        title: "Delete failed",
        description: error.message || "Failed to delete data",
        variant: "destructive",
      });
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage]);

  // Reset to page 1 when data changes
  useMemo(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [data.length, totalPages]);

  if (columns.length === 0 || data.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">No data uploaded yet. Upload a file to get started.</p>
      </Card>
    );
  }

  return (
    <>
      <Card className="overflow-hidden shadow-lg">
        <div className="p-3 sm:p-4 border-b border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-gradient-to-r from-muted/50 to-muted/30">
          <div>
            <h3 className="text-base sm:text-lg font-semibold">
              {tableName || 'Data Overview'}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {data.length} rows • {columns.length} columns
              {totalPages > 1 && ` • Page ${currentPage} of ${totalPages}`}
            </p>
          </div>
          <Button 
            variant="destructive" 
            onClick={() => setShowDeleteAllDialog(true)}
            className="gap-2 w-full sm:w-auto"
            disabled={loading}
            size="sm"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            Delete All
          </Button>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column} className="font-semibold text-xs sm:text-sm whitespace-nowrap">
                    {column}
                  </TableHead>
                ))}
                <TableHead className="text-right text-xs sm:text-sm">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((row) => (
                <TableRow key={row.id} className="hover:bg-muted/50 transition-colors">
                  {columns.map((column) => (
                    <TableCell key={`${row.id}-${column}`} className="text-xs sm:text-sm max-w-[200px] sm:max-w-none truncate sm:truncate-none">
                      {String(row[column] || '')}
                    </TableCell>
                  ))}
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1 sm:gap-2 flex-wrap">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedRow(row)}
                        className="gap-1 text-xs sm:text-sm"
                      >
                        <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="hidden sm:inline">View</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteRow(row.id)}
                        className="gap-1 text-xs sm:text-sm"
                        disabled={loading}
                      >
                        {loading ? (
                          <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                        )}
                        <span className="hidden sm:inline">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {totalPages > 1 && (
          <div className="p-4 border-t border-border">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      if (currentPage > 1) setCurrentPage(currentPage - 1);
                    }}
                    disabled={currentPage === 1}
                    className="h-9 w-9"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Previous</span>
                  </Button>
                </PaginationItem>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  // Show first page, last page, current page, and pages around current
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <PaginationItem key={page}>
                        <Button
                          variant={currentPage === page ? "outline" : "ghost"}
                          size="icon"
                          onClick={() => setCurrentPage(page)}
                          className={`h-9 w-9 ${currentPage === page ? 'pointer-events-none' : ''}`}
                        >
                          {page}
                        </Button>
                      </PaginationItem>
                    );
                  } else if (page === currentPage - 2 || page === currentPage + 2) {
                    return (
                      <PaginationItem key={page}>
                        <span className="px-2">...</span>
                      </PaginationItem>
                    );
                  }
                  return null;
                })}
                
                <PaginationItem>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                    }}
                    disabled={currentPage === totalPages}
                    className="h-9 w-9"
                  >
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">Next</span>
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </Card>

      <Dialog open={!!selectedRow} onOpenChange={() => setSelectedRow(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              Row Details
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedRow(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          {selectedRow && (
            <div className="space-y-4">
              {columns.map((column) => (
                <div key={column} className="border-b border-border pb-3">
                  <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                    {column}
                  </h4>
                  <p className="text-foreground">
                    {String(selectedRow[column] || 'N/A')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteAllDialog} onOpenChange={setShowDeleteAllDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete all data from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAll} className="bg-destructive text-destructive-foreground">
              Delete All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
