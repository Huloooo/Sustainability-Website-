'use client';

import React, { useEffect, useState } from 'react';
import FileUpload from './components/FileUpload';
import DataTable from './components/DataTable';
import DataChart from './components/DataChart';
import { useStore } from './store/useStore';
import { SustainabilityData, TableColumn, SortState } from '@/types';
import { apiService } from './services/api.service';

export default function Home() {
  const {
    data,
    columns,
    filteredData,
    filter,
    setData,
    setColumns,
    setFilteredData,
    setFilter,
    setSortState,
    isLoading,
    setLoading,
    error,
    setError,
  } = useStore();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await apiService.getData(currentPage, itemsPerPage);
      
      if (response.data && response.data.length > 0) {
        const columns: TableColumn[] = Object.keys(response.data[0]).map(key => ({
          key,
          label: key,
          sortable: true,
        }));
        
        setData(response.data);
        setColumns(columns);
        setFilteredData(response.data);
        setTotalPages(Math.ceil(response.total / itemsPerPage));
      }
    } catch (error) {
      setError('Error fetching data from server');
    } finally {
      setLoading(false);
    }
  };

  const handleDataLoaded = (newData: SustainabilityData[], newColumns: TableColumn[]) => {
    setData(newData);
    setColumns(newColumns);
    setFilteredData(newData);
    fetchData(); // Refresh the data from the server after upload
  };

  const handleSort = (sortState: SortState) => {
    if (!sortState.direction) {
      setFilteredData(data);
      return;
    }

    const sortedData = [...filteredData].sort((a: SustainabilityData, b: SustainabilityData) => {
      const aValue = a[sortState.column];
      const bValue = b[sortState.column];

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortState.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      const aString = String(aValue).toLowerCase();
      const bString = String(bValue).toLowerCase();
      return sortState.direction === 'asc'
        ? aString.localeCompare(bString)
        : bString.localeCompare(aString);
    });

    setFilteredData(sortedData);
    setSortState(sortState);
  };

  const handleFilter = (column: string, value: string) => {
    setFilter({ column, value });
    if (!value) {
      setFilteredData(data);
      return;
    }

    const filtered = data.filter((row: SustainabilityData) => {
      const cellValue = String(row[column]).toLowerCase();
      return cellValue.includes(value.toLowerCase());
    });

    setFilteredData(filtered);
  };

  return (
    <main className="min-h-screen bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-text py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Sustainability Dashboard
        </h1>

        <FileUpload onDataLoaded={handleDataLoaded} />

        {isLoading ? (
          <div className="flex justify-center items-center mt-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="mt-8 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg">
            {error}
          </div>
        ) : data.length > 0 ? (
          <div className="mt-8 space-y-8">
            <div className="bg-white dark:bg-dark-card rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Data Preview</h2>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Filter data..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-dark-border rounded-md 
                    focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-dark-card 
                    text-gray-900 dark:text-dark-text"
                  value={filter.value}
                  onChange={(e) => handleFilter(filter.column, e.target.value)}
                />
              </div>
              <DataTable
                data={filteredData}
                columns={columns}
                onSort={handleSort}
              />
              
              {/* Pagination */}
              <div className="mt-4 flex justify-center space-x-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border rounded-md disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border rounded-md disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-dark-card rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-6">Data Visualization</h2>
              <div className="space-y-8">
                <DataChart data={filteredData} columns={columns.map((col: TableColumn) => col.key)} />
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-8 text-center text-gray-500 dark:text-gray-400">
            No data available. Please upload a CSV file to get started.
          </div>
        )}
      </div>
    </main>
  );
} 