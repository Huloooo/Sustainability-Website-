export interface SustainabilityData {
  [key: string]: string | number;
}

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
}

export interface SortState {
  column: string;
  direction: 'asc' | 'desc' | null;
}

export interface FilterState {
  column: string;
  value: string;
}

export interface ChartData {
  name: string;
  [key: string]: string | number;
}

export interface PieChartData {
  name: string;
  value: number;
}

export interface FileUploadState {
  isLoading: boolean;
  error: string | null;
  data: SustainabilityData[] | null;
  columns: TableColumn[] | null;
}

export interface ApiResponse {
  data: SustainabilityData[];
  total: number;
  page: number;
  limit: number;
} 