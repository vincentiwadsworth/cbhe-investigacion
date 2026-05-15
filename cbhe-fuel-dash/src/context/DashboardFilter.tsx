import { create } from 'zustand';

interface DashboardFilters {
  selectedCountry: string;
  selectedProduct: string;
  selectedPeriod: string;
  setCountry: (country: string) => void;
  setProduct: (product: string) => void;
  setPeriod: (period: string) => void;
}

export const useDashboardFilters = create<DashboardFilters>((set) => ({
  selectedCountry: 'Bolivia',
  selectedProduct: 'all',
  selectedPeriod: '1A',
  setCountry: (country) => set({ selectedCountry: country }),
  setProduct: (product) => set({ selectedProduct: product }),
  setPeriod: (period) => set({ selectedPeriod: period }),
}));