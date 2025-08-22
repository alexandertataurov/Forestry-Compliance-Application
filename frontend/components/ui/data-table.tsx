import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, Search, Filter, SortAsc, SortDesc } from 'lucide-react';

interface DataTableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  width?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  title?: string;
  searchable?: boolean;
  pagination?: boolean;
  itemsPerPage?: number;
  onRowClick?: (row: T) => void;
  className?: string;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  title,
  searchable = true,
  pagination = true,
  itemsPerPage = 10,
  onRowClick,
  className = '',
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<Record<string, string>>({});

  // Filter data based on search term and filters
  const filteredData = useMemo(() => {
    return data.filter(row => {
      // Search term filtering
      if (searchTerm) {
        const searchMatch = columns.some(column => {
          const value = row[column.key];
          if (value == null) return false;
          return String(value).toLowerCase().includes(searchTerm.toLowerCase());
        });
        if (!searchMatch) return false;
      }

      // Column filters
      for (const [columnKey, filterValue] of Object.entries(filters)) {
        if (filterValue) {
          const value = row[columnKey];
          if (value == null || !String(value).toLowerCase().includes(filterValue.toLowerCase())) {
            return false;
          }
        }
      }

      return true;
    });
  }, [data, searchTerm, filters, columns]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortColumn) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      let comparison = 0;
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      } else {
        comparison = String(aValue).localeCompare(String(bValue));
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredData, sortColumn, sortDirection]);

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, pagination, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Handle sorting
  const handleSort = (column: DataTableColumn<T>) => {
    if (!column.sortable) return;

    if (sortColumn === column.key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column.key);
      setSortDirection('asc');
    }
  };

  // Handle filtering
  const handleFilterChange = (columnKey: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [columnKey]: value,
    }));
    setCurrentPage(1);
  };

  // Render sort indicator
  const renderSortIndicator = (column: DataTableColumn<T>) => {
    if (!column.sortable) return null;
    if (sortColumn !== column.key) return <SortAsc className="w-4 h-4 text-surface-onVariant" />;
    return sortDirection === 'asc' ? (
      <ChevronUp className="w-4 h-4 text-brand-primary" />
    ) : (
      <ChevronDown className="w-4 h-4 text-brand-primary" />
    );
  };

  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-surface-border ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-surface-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {title && (
            <h3 className="text-title font-semibold text-surface-onSurface">{title}</h3>
          )}
          {searchable && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-surface-onVariant" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-surface-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
              />
            </div>
          )}
        </div>

        {/* Column Filters */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-4">
          {columns.map(column => 
            column.filterable ? (
              <div key={String(column.key)} className="relative">
                <Filter className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-surface-onVariant" />
                <input
                  type="text"
                  placeholder={column.label}
                  value={filters[String(column.key)] || ''}
                  onChange={(e) => handleFilterChange(String(column.key), e.target.value)}
                  className="pl-7 pr-2 py-1 text-sm border border-surface-border rounded-md focus:outline-none focus:ring-1 focus:ring-brand-primary"
                />
              </div>
            ) : null
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-surface-bgVariant">
            <tr>
              {columns.map(column => (
                <th
                  key={String(column.key)}
                  className={`px-6 py-3 text-left text-label font-semibold text-surface-onSurface border-b border-surface-border ${
                    column.sortable ? 'cursor-pointer hover:bg-surface-border transition-colors' : ''
                  }`}
                  style={{ width: column.width }}
                  onClick={() => handleSort(column)}
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {renderSortIndicator(column)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, index) => (
              <tr
                key={index}
                className={`border-b border-surface-border hover:bg-surface-bgVariant transition-colors ${
                  onRowClick ? 'cursor-pointer' : ''
                }`}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map(column => (
                  <td key={String(column.key)} className="px-6 py-4 text-body text-surface-onSurface">
                    {column.render ? column.render(row[column.key], row) : String(row[column.key] || '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="px-6 py-4 border-t border-surface-border">
          <div className="flex items-center justify-between">
            <div className="text-bodySmall text-surface-onVariant">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} entries
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-surface-border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-bgVariant"
              >
                Previous
              </button>
              <span className="px-3 py-1 text-sm text-surface-onSurface">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border border-surface-border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-bgVariant"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredData.length === 0 && (
        <div className="p-12 text-center">
          <div className="text-body text-surface-onVariant">No data found</div>
        </div>
      )}
    </div>
  );
}
