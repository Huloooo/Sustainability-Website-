'use client';

import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import { FileUploadState, SustainabilityData, TableColumn } from '@/types';
import { useStore } from '../store/useStore';
import { apiService } from '../services/api.service';

interface FileUploadProps {
  onDataLoaded: (data: SustainabilityData[], columns: TableColumn[]) => void;
}

export default function FileUpload({ onDataLoaded }: FileUploadProps) {
  const { isDarkMode, setLoading, setError, isLoading, error } = useStore();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      // First upload the file to the server
      const uploadResult = await apiService.uploadFile(file);
      
      // Then parse the file locally to display the preview
      Papa.parse(file, {
        complete: (results) => {
          const { data, errors } = results;
          
          if (errors.length > 0) {
            setLoading(false);
            setError('Error parsing CSV file');
            return;
          }

          if (data.length < 2) {
            setLoading(false);
            setError('File is empty or invalid');
            return;
          }

          const headers = data[0] as string[];
          const columns: TableColumn[] = headers.map(header => ({
            key: header,
            label: header,
            sortable: true,
          }));

          const parsedData: SustainabilityData[] = data.slice(1).map((row: any) => {
            const item: SustainabilityData = {};
            headers.forEach((header, index) => {
              item[header] = row[index];
            });
            return item;
          });

          setLoading(false);
          onDataLoaded(parsedData, columns);
        },
        error: (error) => {
          setLoading(false);
          setError('Error reading file');
        },
        header: false,
        skipEmptyLines: true,
      });
    } catch (error) {
      setLoading(false);
      setError('Error uploading file to server');
    }
  }, [onDataLoaded, setLoading, setError]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
    },
    multiple: false,
  });

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-gray-300 dark:border-dark-border hover:border-gray-400 dark:hover:border-gray-500'}`}
      >
        <input {...getInputProps()} />
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div>
            <p className="text-gray-600 dark:text-gray-300">
              {isDragActive
                ? 'Drop the CSV file here'
                : 'Drag and drop a CSV file here, or click to select'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Only CSV files are supported</p>
          </div>
        )}
      </div>
      
      {error && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
} 