import { useMemo } from 'react';
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { subMonths } from 'date-fns';
import { useDashboardFilters } from '../context/DashboardFilter';
import { useAllGlobalData, useAllRegionalData, getMonthlyGlobalData } from '../hooks/useDashboardData';
import { PRODUCT_GROUPS, COLORS, COUNTRIES, PERIODS } from '../lib/constants';

interface MergedPoint {
  fecha: Date;
  wti: number | null;
  brent: number | null;
  localPrice: number | null;
  localMoneda: string | null;
}

export default function TrendChart() {
  const { selectedCountry, selectedProduct, selectedPeriod } = useDashboardFilters();
  const { data: globalData } = useAllGlobalData();
  const { data: regionalData } = useAllRegionalData();

  const countryInfo = COUNTRIES.find((c) => c.name === selectedCountry);
  const periodInfo = PERIODS.find((p) => p.value === selectedPeriod);

  // Monthly global data (downsampled from daily)
  const monthlyGlobal = useMemo(() => {
    if (!globalData) return [];
    return getMonthlyGlobalData(globalData);
  }, [globalData]);

  // Filter regional data for selected country
  const countryRegional = useMemo(() => {
    if (!regionalData || !countryInfo?.hasData) return [];
    return regionalData.filter((d) => d.pais === selectedCountry);
  }, [regionalData, selectedCountry, countryInfo?.hasData]);

  // Filter by product group and period, then merge into chart data
  const chartData = useMemo(() => {
    const dataMap = new Map<string, MergedPoint>();

    // Determine period start date
    const now = new Date();
    const startDate = periodInfo?.months ? subMonths(now, periodInfo.months) : null;

    // Add global monthly data
    for (const point of monthlyGlobal) {
      if (startDate && point.fecha < startDate) continue;
      const key = point.fecha.toISOString().slice(0, 7); // YYYY-MM
      const existing = dataMap.get(key) || {
        fecha: point.fecha,
        wti: null as number | null,
        brent: null as number | null,
        localPrice: null as number | null,
        localMoneda: null as string | null,
      };
      if (point.wti !== null) existing.wti = point.wti;
      if (point.brent !== null) existing.brent = point.brent;
      dataMap.set(key, existing);
    }

    // Add regional data for selected products
    const productNames = selectedProduct === 'all'
      ? Object.values(PRODUCT_GROUPS).flat()
      : (PRODUCT_GROUPS[selectedProduct] || [selectedProduct]);

    // For each month, take the first matching product's price
    for (const d of countryRegional) {
      if (!productNames.includes(d.producto)) continue;
      if (d.precio_usd === null) continue;
      const dDate = new Date(d.fecha);
      if (startDate && dDate < startDate) continue;
      const key = dDate.toISOString().slice(0, 7);
      const existing = dataMap.get(key);
      if (existing && existing.localPrice === null) {
        existing.localPrice = d.precio_usd;
        existing.localMoneda = d.moneda;
      }
    }

    return Array.from(dataMap.values()).sort((a, b) => a.fecha.getTime() - b.fecha.getTime());
  }, [monthlyGlobal, countryRegional, selectedProduct, periodInfo]);

  const hasLocalData = countryInfo?.hasData && chartData.some((d) => d.localPrice !== null);

  const countryLabel = selectedCountry;
  const productLabel = selectedProduct === 'all' ? 'Combustible' : selectedProduct;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-1">
        Tendencia Histórica — {countryLabel}
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        {productLabel} vs. referencias internacionales (WTI · Brent)
      </p>

      {!hasLocalData && countryInfo?.hasData && (
        <div className="mb-4 px-3 py-2 bg-amber-50 border border-amber-200 rounded-md text-sm text-amber-800">
          No hay datos disponibles para {countryLabel} con el producto/período seleccionado.
        </div>
      )}
      {!countryInfo?.hasData && (
        <div className="mb-4 px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-600">
          {countryLabel}: datos de fuente ANH pendientes de integración. Se muestran solo los benchmarks internacionales.
        </div>
      )}

      <ResponsiveContainer width="100%" height={420}>
        <ComposedChart data={chartData} margin={{ top: 10, right: hasLocalData ? 60 : 30, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="fecha"
            tickFormatter={(value: Date) =>
              value.toLocaleDateString('es-BO', { month: 'short', year: '2-digit' })
            }
            tick={{ fontSize: 12 }}
          />
          {/* Left Y-axis: USD/barril (WTI/Brent) */}
          <YAxis
            yAxisId="left"
            tickFormatter={(value: number) => `$${value}`}
            tick={{ fontSize: 12 }}
            label={{
              value: 'USD/barril',
              angle: -90,
              position: 'insideLeft',
              offset: -5,
              style: { fontSize: 11, fill: '#6B7280' },
            }}
          />
          {/* Right Y-axis: USD/L (local prices) */}
          {hasLocalData && (
            <YAxis
              yAxisId="right"
              orientation="right"
              tickFormatter={(value: number) => `$${value}`}
              tick={{ fontSize: 12 }}
              label={{
                value: 'USD/L',
                angle: 90,
                position: 'insideRight',
                offset: -5,
                style: { fontSize: 11, fill: '#6B7280' },
              }}
            />
          )}
          <Tooltip
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            labelFormatter={(value: any) => {
              try {
                return new Date(value).toLocaleDateString('es-BO', { year: 'numeric', month: 'long' });
              } catch {
                return String(value);
              }
            }}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter={(value: any, name: any) => {
              if (value === null || value === undefined) return ['—', String(name)];
              const num = Number(value);
              if (isNaN(num)) return [String(value), String(name)];
              return [`$${num.toFixed(2)}`, String(name)];
            }}
          />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="wti"
            stroke={COLORS.wti}
            strokeWidth={2}
            dot={false}
            name="WTI"
            connectNulls={false}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="brent"
            stroke={COLORS.brent}
            strokeWidth={2}
            dot={false}
            name="Brent"
            connectNulls={false}
          />
          {hasLocalData && (
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="localPrice"
              stroke={COLORS.gasolinaRegular}
              strokeWidth={3}
              dot={{ r: 3 }}
              name={productLabel}
              connectNulls={true}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>

      <div className="mt-4 flex items-center gap-4 text-xs text-gray-400">
        <span>WTI/Brent: promedio mensual</span>
        {hasLocalData && <span>{productLabel}: precio mensual promedio</span>}
        <span>· Fuente: EIA, datos gubernamentales</span>
      </div>
    </div>
  );
}