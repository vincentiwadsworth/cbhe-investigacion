import { useMemo, useState } from 'react';
import { useDashboardFilters } from '../context/DashboardFilter';
import { useAllRegionalData } from '../hooks/useDashboardData';
import { PRODUCT_GROUPS, COUNTRIES } from '../lib/constants';

type SortKey = 'pais' | 'producto' | 'fecha' | 'precio_usd' | 'precio_local';
type SortDir = 'asc' | 'desc';

export default function DataTable() {
  const { selectedCountry, selectedProduct } = useDashboardFilters();
  const { data: regionalData } = useAllRegionalData();

  const [sortKey, setSortKey] = useState<SortKey>('fecha');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 15;

  const filteredData = useMemo(() => {
    if (!regionalData) return [];

    let filtered = regionalData;

    // Filter by country (only countries with data)
    if (selectedCountry !== 'all') {
      const countryInfo = COUNTRIES.find((c) => c.name === selectedCountry);
      if (countryInfo?.hasData) {
        filtered = filtered.filter((d) => d.pais === selectedCountry);
      } else {
        return []; // Bolivia or other country without data
      }
    }

    // Filter by product group
    if (selectedProduct !== 'all') {
      const members = PRODUCT_GROUPS[selectedProduct] || [selectedProduct];
      filtered = filtered.filter((d) => members.includes(d.producto));
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      let aVal: string | number;
      let bVal: string | number;

      switch (sortKey) {
        case 'pais':
          aVal = a.pais;
          bVal = b.pais;
          break;
        case 'producto':
          aVal = a.producto;
          bVal = b.producto;
          break;
        case 'fecha':
          aVal = new Date(a.fecha).getTime();
          bVal = new Date(b.fecha).getTime();
          break;
        case 'precio_usd':
          aVal = a.precio_usd ?? 0;
          bVal = b.precio_usd ?? 0;
          break;
        case 'precio_local':
          aVal = a.precio_local;
          bVal = b.precio_local;
          break;
        default:
          return 0;
      }

      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [regionalData, selectedCountry, selectedProduct, sortKey, sortDir]);

  const totalPages = Math.ceil(filteredData.length / PAGE_SIZE);
  const pagedData = filteredData.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
    setPage(0);
  };

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortKey !== column) return <span className="text-gray-300 ml-1">↕</span>;
    return <span className="text-blue-500 ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>;
  };

  const countryInfo = COUNTRIES.find((c) => c.name === selectedCountry);
  if (selectedCountry !== 'all' && !countryInfo?.hasData) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Datos Detallados</h2>
        <p className="text-sm text-gray-500">
          {selectedCountry}: datos de fuente pendientes de integración.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Datos Detallados</h2>
          <p className="text-sm text-gray-500">
            {filteredData.length} registros
            {selectedCountry !== 'all' ? ` · ${selectedCountry}` : ' · Todos los países'}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th
                className="text-left py-2 px-3 font-medium text-gray-600 cursor-pointer hover:text-gray-900"
                onClick={() => toggleSort('fecha')}
              >
                Fecha <SortIcon column="fecha" />
              </th>
              <th
                className="text-left py-2 px-3 font-medium text-gray-600 cursor-pointer hover:text-gray-900"
                onClick={() => toggleSort('pais')}
              >
                País <SortIcon column="pais" />
              </th>
              <th
                className="text-left py-2 px-3 font-medium text-gray-600 cursor-pointer hover:text-gray-900"
                onClick={() => toggleSort('producto')}
              >
                Producto <SortIcon column="producto" />
              </th>
              <th
                className="text-right py-2 px-3 font-medium text-gray-600 cursor-pointer hover:text-gray-900"
                onClick={() => toggleSort('precio_local')}
              >
                Precio Local <SortIcon column="precio_local" />
              </th>
              <th
                className="text-right py-2 px-3 font-medium text-gray-600 cursor-pointer hover:text-gray-900"
                onClick={() => toggleSort('precio_usd')}
              >
                USD/L <SortIcon column="precio_usd" />
              </th>
              <th className="text-left py-2 px-3 font-medium text-gray-600">Fuente</th>
            </tr>
          </thead>
          <tbody>
            {pagedData.map((row) => (
              <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-2 px-3 text-gray-700">
                  {new Date(row.fecha).toLocaleDateString('es-BO', { year: 'numeric', month: 'short' })}
                </td>
                <td className="py-2 px-3 text-gray-700">{row.pais}</td>
                <td className="py-2 px-3 text-gray-700">{row.producto}</td>
                <td className="py-2 px-3 text-right text-gray-900 font-medium">
                  {row.precio_local.toFixed(2)} {row.moneda}
                </td>
                <td className="py-2 px-3 text-right text-gray-900 font-medium">
                  {row.precio_usd !== null ? `$${row.precio_usd.toFixed(2)}` : '—'}
                </td>
                <td className="py-2 px-3 text-gray-400 text-xs">{row.fuente}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            Mostrando {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filteredData.length)} de {filteredData.length}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-3 py-1 text-sm rounded border border-gray-300 disabled:opacity-40 hover:bg-gray-50"
            >
              Anterior
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="px-3 py-1 text-sm rounded border border-gray-300 disabled:opacity-40 hover:bg-gray-50"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}