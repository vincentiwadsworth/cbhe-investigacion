import { useDashboardFilters } from '../context/DashboardFilter';
import { PERIODS } from '../lib/constants';

interface ProductOption {
  value: string;
  label: string;
}

const PRODUCTS: ProductOption[] = [
  { value: 'all', label: 'Todos' },
  { value: 'Gasolina Regular', label: 'Gasolina Regular' },
  { value: 'Gasolina Premium', label: 'Gasolina Premium' },
  { value: 'Diésel', label: 'Diésel' },
];

export default function QuickFilters() {
  const { selectedProduct, selectedPeriod, setProduct, setPeriod } =
    useDashboardFilters();

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 px-4 py-3 bg-white border-b border-gray-200">
      {/* Product pills */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm font-medium text-gray-600 mr-1">Producto</span>
        {PRODUCTS.map((p) => (
          <button
            key={p.value}
            onClick={() => setProduct(p.value)}
            className={`px-3 py-1.5 text-sm rounded-full font-medium transition-colors ${
              selectedProduct === p.value
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Separator on desktop */}
      <div className="hidden sm:block w-px h-6 bg-gray-300" />

      {/* Period segmented buttons */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-600 mr-1">Período</span>
        <div className="flex rounded-md overflow-hidden border border-gray-300">
          {PERIODS.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                selectedPeriod === p.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
