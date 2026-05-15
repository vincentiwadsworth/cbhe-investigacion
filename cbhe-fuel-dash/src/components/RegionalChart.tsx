import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from 'recharts';
import { useDashboardFilters } from '../context/DashboardFilter';
import { useAllRegionalData, getRegionalComparison } from '../hooks/useDashboardData';
import { COUNTRY_COLORS, BCB_EXCHANGE_RATE, COUNTRIES } from '../lib/constants';

export default function RegionalChart() {
  const { selectedCountry, selectedProduct, setCountry } = useDashboardFilters();
  const { data: regionalData, isLoading } = useAllRegionalData();

  const productGroup = selectedProduct === 'all' ? 'Gasolina Regular' : selectedProduct;
  const data = useMemo(() => {
    if (!regionalData) return [];
    const comparison = getRegionalComparison(regionalData, productGroup);

    // Add Bolivia as placeholder if not present
    const hasBolivia = comparison.some((d) => d.pais === 'Bolivia');
    if (!hasBolivia) {
      comparison.push({
        pais: 'Bolivia',
        precio_usd: 0,
        precio_local: BCB_EXCHANGE_RATE.rate * 0.98, // placeholder
        moneda: 'BOB',
        fuente: 'Pendiente',
        producto: 'N/A',
      });
    }

    return comparison;
  }, [regionalData, productGroup]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-5 bg-gray-200 rounded w-48" />
          <div className="h-[300px] bg-gray-100 rounded" />
        </div>
      </div>
    );
  }

  const maxPrice = Math.max(...data.filter((d) => d.precio_usd > 0).map((d) => d.precio_usd), 2);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* Country selector + section label */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Comparación Regional</h2>
          <p className="text-sm text-gray-500">
            Precio por litro en USD — {productGroup}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="country-select-regional" className="text-sm font-medium text-gray-600">
            País
          </label>
          <select
            id="country-select-regional"
            value={selectedCountry}
            onChange={(e) => setCountry(e.target.value)}
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={340}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="pais"
            tick={{ fontSize: 12 }}
          />
          <YAxis
            tickFormatter={(value: number) => `$${value.toFixed(2)}`}
            tick={{ fontSize: 12 }}
            domain={[0, maxPrice * 1.15]}
          />
          <Tooltip
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter={(value: any, _name: any, props: any) => {
              if (props?.payload?.fuente === 'Pendiente') {
                return ['Dato pendiente', props.payload.pais];
              }
              const numVal = Number(value);
              if (isNaN(numVal)) return [String(value), ''];
              return [
                `$${numVal.toFixed(2)}/L — ${props?.payload?.precio_local?.toFixed(2) ?? '—'} ${props?.payload?.moneda ?? ''}`,
                props?.payload?.pais ?? '',
              ];
            }}
            labelFormatter={() => ''}
          />
          <Bar dataKey="precio_usd" radius={[4, 4, 0, 0]} name="USD/L">
            {data.map((entry) => {
              const isPending = entry.fuente === 'Pendiente';
              return (
                <Cell
                  key={entry.pais}
                  fill={isPending ? '#D1D5DB' : (COUNTRY_COLORS[entry.pais] || '#6B7280')}
                  opacity={isPending ? 0.5 : 1}
                  stroke={isPending ? '#9CA3AF' : 'none'}
                  strokeWidth={isPending ? 2 : 0}
                  strokeDasharray={isPending ? '4 2' : 'none'}
                />
              );
            })}
            <LabelList
              dataKey="precio_usd"
              position="top"
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(value: any) => {
                const num = Number(value);
                return num > 0 ? `$${num.toFixed(2)}` : 'S/D';
              }}
              style={{ fontSize: 11, fill: '#6B7280' }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-4 text-xs text-gray-400">
        S/D = Sin dato · Barras grises = fuente pendiente de integración · Fuente: datos gubernamentales de cada país
      </div>
    </div>
  );
}
