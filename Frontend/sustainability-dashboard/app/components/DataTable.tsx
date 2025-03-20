'use client';

import React, { useState } from 'react';
import { SustainabilityData, TableColumn, SortState } from '@/types';

interface DataTableProps {
  data: SustainabilityData[];
  columns: TableColumn[];
  onSort?: (sortState: SortState) => void;
}

export default function DataTable({ data, columns, onSort }: DataTableProps) {
  const [sortState, setSortState] = useState<SortState>({
    column: '',
    direction: null,
  });

  const handleSort = (column: string) => {
    const newDirection =
      sortState.column === column
        ? sortState.direction === 'asc'
          ? 'desc'
          : sortState.direction === 'desc'
          ? null
          : 'asc'
        : 'asc';

    const newSortState = {
      column,
      direction: newDirection,
    };

    setSortState(newSortState);
    onSort?.(newSortState);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-border">
        <thead className="bg-gray-50 dark:bg-dark-card">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer
                  ${column.sortable ? 'hover:bg-gray-100 dark:hover:bg-gray-700' : ''}`}
                onClick={() => column.sortable && handleSort(column.key)}
              >
                <div className="flex items-center space-x-1">
                  <span>{column.label}</span>
                  {column.sortable && sortState.column === column.key && (
                    <span>
                      {sortState.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-dark-card divide-y divide-gray-200 dark:divide-dark-border">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50 dark:hover:bg-gray-700">
              {columns.map((column) => (
                <td
                  key={column.key}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-dark-text"
                >
                  {row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 