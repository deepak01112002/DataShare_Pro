import { useState, useMemo, useEffect } from 'react';
import { Search, Filter, X, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  Pagination,
  PaginationContent,
  PaginationItem,
} from '@/components/ui/pagination';
import { useDataStore, DataRow } from '@/store/dataStore';
import { WhatsAppIcon } from '@/components/WhatsAppIcon';

const ITEMS_PER_PAGE = 10;

export const UserDataView = () => {
  const { data, columns } = useDataStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterColumn, setFilterColumn] = useState<string>('all');
  const [filterValue, setFilterValue] = useState<string>('all');
  const [selectedRow, setSelectedRow] = useState<DataRow | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Get unique values for selected filter column
  const filterOptions = useMemo(() => {
    if (filterColumn === 'all') return [];
    
    const uniqueValues = new Set(
      data.map(row => String(row[filterColumn] || '').trim()).filter(val => val)
    );
    
    return Array.from(uniqueValues);
  }, [data, filterColumn]);

  // Filter and search data
  const filteredData = useMemo(() => {
    let result = data;

    // Apply column filter
    if (filterColumn !== 'all' && filterValue !== 'all') {
      result = result.filter(row => 
        String(row[filterColumn] || '').trim() === filterValue
      );
    }

    // Apply search
    if (searchQuery) {
      result = result.filter(row =>
        columns.some(col =>
          String(row[col] || '')
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      );
    }

    return result;
  }, [data, columns, searchQuery, filterColumn, filterValue]);

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterColumn, filterValue]);

  // Reset to page 1 if current page exceeds total pages
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const generateWhatsAppMessage = (row: DataRow) => {
    const message = columns
      .map(col => `*${col}:* ${row[col] || 'N/A'}`)
      .join('\n');
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
  };

  const resetFilters = () => {
    setSearchQuery('');
    setFilterColumn('all');
    setFilterValue('all');
  };

  if (columns.length === 0 || data.length === 0) {
    return (
      <Card className="p-12 text-center">
        <div className="max-w-md mx-auto space-y-4">
          <div className="p-4 bg-muted rounded-full w-20 h-20 flex items-center justify-center mx-auto">
            <Search className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold">No Data Available</h3>
          <p className="text-muted-foreground">
            The admin hasn't uploaded any data yet. Please check back later.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="mb-4 sm:mb-6 p-4 sm:p-6 shadow-lg">
        <div className="space-y-4">
          <div className="flex flex-col gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
              <Input
                placeholder="Search across all columns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 sm:pl-10 text-sm sm:text-base"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={filterColumn} onValueChange={(val) => {
                setFilterColumn(val);
                setFilterValue('all');
              }}>
                <SelectTrigger className="w-full sm:w-[200px] text-sm">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by column" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Columns</SelectItem>
                  {columns.map(col => (
                    <SelectItem key={col} value={col}>{col}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {filterColumn !== 'all' && filterOptions.length > 0 && (
                <Select value={filterValue} onValueChange={setFilterValue}>
                  <SelectTrigger className="w-full sm:w-[200px] text-sm">
                    <SelectValue placeholder="Select value" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Values</SelectItem>
                    {filterOptions.map(option => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {(searchQuery || filterColumn !== 'all') && (
                <Button variant="outline" onClick={resetFilters} className="w-full sm:w-auto text-sm">
                  <X className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              )}
            </div>
          </div>

          <div className="text-xs sm:text-sm text-muted-foreground">
            Showing {filteredData.length} of {data.length} rows
            {totalPages > 1 && ` • Page ${currentPage} of ${totalPages}`}
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden shadow-lg">
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
                        onClick={() => generateWhatsAppMessage(row)}
                        className="gap-1 bg-[#25D366] hover:bg-[#20BA5A] text-white text-xs sm:text-sm"
                      >
                        <WhatsAppIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="hidden sm:inline">Share</span>
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
              <Button
                onClick={() => generateWhatsAppMessage(selectedRow)}
                className="w-full gap-2 bg-[#25D366] hover:bg-[#20BA5A] text-white"
              >
                <WhatsAppIcon className="h-5 w-5" />
                Share via WhatsApp
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
