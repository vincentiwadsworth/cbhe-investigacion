import { useState, useMemo } from 'react';
import { useAllRegionalData, getRegionalComparison } from '../hooks/useDashboardData';
import FuelMap from './FuelMap';
import CountryRanking from './CountryRanking';

export type ProductTab = 'Gasolina Regular' | 'Diésel' | 'GLP';

const PRODUCT_TABS: { key: ProductTab; label: string }[] = [
  { key: 'Gasolina Regular', label: 'Gasolina' },
  { key: 'Diésel', label: 'Diésel' },
  { key: 'GLP', label: 'GLP' },
];

export default function MapSection() {
  const [productTab, setProductTab] = useState<ProductTab>('Gasolina Regular');
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const { data: regionalData, isLoading } = useAllRegionalData();

  // Extract available years from regional data for the dropdown
  const availableYears = useMemo(() => {
    if (!regionalData) return [];
    const yearSet = new Set<number>();
    for (const d of regionalData) {
      yearSet.add(new Date(d.fecha).getFullYear());
    }
    return Array.from(yearSet).sort((a, b) => b - a);
  }, [regionalData]);

  // Filtered regional comparison for current product tab and year
  const filteredComparison = useMemo(() => {
    if (!regionalData) return [];
    let data = regionalData;

    // Apply year filter first
    if (selectedYear !== null) {
      data = data.filter((d) => new Date(d.fecha).getFullYear() === selectedYear);
    }

    return getRegionalComparison(data, productTab);
  }, [regionalData, productTab, selectedYear]);

  return (
    <section className="max-w-7xl w-full mx-auto px-4 py-6">
      {/* Section header + inline controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Precios Regionales</h2>
          <p className="text-sm text-gray-500">
            Comparación USD/L por país — {productTab}
          </p>
        </div>

        {/* Inline product tabs */}
        <div className="flex items-center gap-2">
          <div className="flex bg-gray-100 rounded-lg p-1">
            {PRODUCT_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setProductTab(tab.key)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  productTab === tab.key
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Year selector dropdown */}
          <select
            value={selectedYear ?? ''}
            onChange={(e) =>
              setSelectedYear(e.target.value ? Number(e.target.value) : null)
            }
            className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Último</option>
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* CSS Grid: map + ranking side-by-side */}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-5 bg-gray-200 rounded w-48" />
              <div className="h-[400px] bg-gray-100 rounded" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="animate-pulse space-y-3">
              <div className="h-5 bg-gray-200 rounded w-32" />
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-10 bg-gray-100 rounded" />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FuelMap
            productGroup={productTab}
            selectedYear={selectedYear}
            regionalData={regionalData ?? []}
          />
          <CountryRanking
            productGroup={productTab}
            selectedYear={selectedYear}
            regionalData={regionalData ?? []}
            comparison={filteredComparison}
          />
        </div>
      )}

      {/* GLP-only note */}
      {productTab === 'GLP' && (
        <p className="mt-3 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
          GLP disponible solo para Bolivia. Los demás países no reportan datos de GLP en la base actual.
        </p>
      )}
    </section>
  );
}
