'use client';

import * as React from 'react';
import { cn } from '../lib/utils';
import { ArrowUpDown, ChevronDown, ChevronUp } from 'lucide-react';

export interface DataTableColumn<T> {
  id: string;
  header: string;
  accessorKey?: keyof T;
  cell?: (row: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  className?: string;
  /** Function to derive a stable React key from each row. Falls back to row.id, then index. */
  rowKey?: (row: T, index: number) => string | number;
  /** Enable row selection */
  selectable?: boolean;
  /** Currently selected row indices */
  selectedRows?: Set<number>;
  /** Called when selection changes */
  onSelectionChange?: (selected: Set<number>) => void;
  /** Rows per page (0 = no pagination) */
  pageSize?: number;
}

function DataTableInner<T extends Record<string, unknown>>(
  {
    columns,
    data,
    className,
    rowKey,
    selectable = false,
    selectedRows: controlledSelected,
    onSelectionChange,
    pageSize = 0,
  }: DataTableProps<T>,
  // No ref needed since this is a generic component
) {
  const [sortColumn, setSortColumn] = React.useState<string | null>(null);
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');
  const [page, setPage] = React.useState(0);
  const [internalSelected, setInternalSelected] = React.useState<Set<number>>(new Set());

  const selected = controlledSelected ?? internalSelected;
  const setSelected = onSelectionChange ?? setInternalSelected;

  // Sort data
  const sortedData = React.useMemo(() => {
    if (!sortColumn) return data;
    const col = columns.find((c) => c.id === sortColumn);
    if (!col || !col.accessorKey) return data;
    const key = col.accessorKey;
    return [...data].sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      const cmp = String(aVal).localeCompare(String(bVal), undefined, { numeric: true });
      return sortDirection === 'asc' ? cmp : -cmp;
    });
  }, [data, sortColumn, sortDirection, columns]);

  // Paginate
  const paginatedData = pageSize > 0
    ? sortedData.slice(page * pageSize, (page + 1) * pageSize)
    : sortedData;
  const totalPages = pageSize > 0 ? Math.ceil(sortedData.length / pageSize) : 1;

  const toggleSort = (colId: string) => {
    if (sortColumn === colId) {
      setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(colId);
      setSortDirection('asc');
    }
  };

  const toggleRow = (index: number) => {
    const next = new Set(selected);
    if (next.has(index)) {
      next.delete(index);
    } else {
      next.add(index);
    }
    setSelected(next);
  };

  const toggleAll = () => {
    if (selected.size === sortedData.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(sortedData.map((_, i) => i)));
    }
  };

  const getCellValue = (row: T, col: DataTableColumn<T>) => {
    if (col.cell) return col.cell(row);
    if (col.accessorKey) return String(row[col.accessorKey] ?? '');
    return '';
  };

  return (
    <div className={cn('w-full', className)}>
      <div className="relative w-full overflow-auto">
        <table className="w-full caption-bottom [font-size:var(--component-data-table-font-size)]">
          <thead className="[&_tr]:border-b">
            <tr className="border-b border-[var(--color-border-default)] transition-colors">
              {selectable && (
                <th className="h-12 w-12 px-4 align-middle">
                  <input
                    type="checkbox"
                    checked={selected.size === sortedData.length && sortedData.length > 0}
                    onChange={toggleAll}
                    className="h-4 w-4"
                    aria-label="Select all rows"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.id}
                  className={cn(
                    'h-12 px-4 text-left align-middle [font-weight:var(--component-data-table-header-font-weight)] text-[var(--color-text-tertiary)]',
                    col.sortable && 'cursor-pointer select-none',
                    col.className
                  )}
                  onClick={() => col.sortable && toggleSort(col.id)}
                >
                  <div className="flex items-center gap-2">
                    {col.header}
                    {col.sortable && (
                      <span className="inline-flex flex-col">
                        {sortColumn === col.id ? (
                          sortDirection === 'asc' ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )
                        ) : (
                          <ArrowUpDown className="h-4 w-4 opacity-50" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0)} className="h-24 text-center text-[var(--color-text-tertiary)]">
                  No results.
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIndex) => {
                const actualIndex = pageSize > 0 ? page * pageSize + rowIndex : rowIndex;
                const key = rowKey ? rowKey(row, actualIndex) : (row as Record<string, unknown>).id as string | number ?? actualIndex;
                return (
                  <tr
                    key={key}
                    className={cn(
                      'border-b border-[var(--color-border-default)] transition-colors hover:bg-[var(--color-background-secondary)]/50',
                      selected.has(actualIndex) && 'bg-[var(--color-background-secondary)]'
                    )}
                    data-state={selected.has(actualIndex) ? 'selected' : undefined}
                  >
                    {selectable && (
                      <td className="p-4 align-middle">
                        <input
                          type="checkbox"
                          checked={selected.has(actualIndex)}
                          onChange={() => toggleRow(actualIndex)}
                          className="h-4 w-4"
                          aria-label={`Select row ${actualIndex + 1}`}
                        />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td key={col.id} className={cn('p-4 align-middle', col.className)}>
                        {getCellValue(row, col)}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pageSize > 0 && totalPages > 1 && (
        <div className="flex items-center justify-between px-2 py-4">
          <div className="[font-size:var(--component-data-table-font-size)] text-[var(--color-text-tertiary)]">
            {selectable && `${selected.size} of ${sortedData.length} row(s) selected. `}
            Page {page + 1} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
              className="inline-flex h-8 items-center justify-center rounded-[var(--component-data-table-border-radius)] border border-[var(--color-border-default)] px-3 [font-size:var(--component-data-table-font-size)] hover:bg-[var(--color-background-secondary)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
              className="inline-flex h-8 items-center justify-center rounded-[var(--component-data-table-border-radius)] border border-[var(--color-border-default)] px-3 [font-size:var(--component-data-table-font-size)] hover:bg-[var(--color-background-secondary)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Export with displayName
const DataTable = DataTableInner as typeof DataTableInner & { displayName: string };
DataTable.displayName = 'DataTable';

export { DataTable };
