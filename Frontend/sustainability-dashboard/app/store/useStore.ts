import { create } from 'zustand';
import { SustainabilityData, TableColumn, SortState, FilterState } from '@/types';

interface DashboardState {
  data: SustainabilityData[];
  columns: TableColumn[];
  filteredData: SustainabilityData[];
  filter: FilterState;
  sortState: SortState;
  isDarkMode: boolean;
  isLoading: boolean;
  error: string | null;
  setData: (data: SustainabilityData[]) => void;
  setColumns: (columns: TableColumn[]) => void;
  setFilteredData: (data: SustainabilityData[]) => void;
  setFilter: (filter: FilterState) => void;
  setSortState: (sort: SortState) => void;
  toggleDarkMode: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useStore = create<DashboardState>((set) => ({
  data: [],
  columns: [],
  filteredData: [],
  filter: { column: '', value: '' },
  sortState: { column: '', direction: null },
  isDarkMode: false,
  isLoading: false,
  error: null,
  setData: (data) => set({ data }),
  setColumns: (columns) => set({ columns }),
  setFilteredData: (filteredData) => set({ filteredData }),
  setFilter: (filter) => set({ filter }),
  setSortState: (sortState) => set({ sortState }),
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
})); 