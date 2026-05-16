import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  useAllGlobalData,
  getMonthlyGlobalData,
} from '../hooks/useDashboardData';
import { formatUSD } from '../utils/format';
import { COLORS } from '../lib/constants';

export default function OilPriceSection() {
  const { data: globalData, isLoading } = useAllGlobalData();

  // Monthly aggregated data for chart
  const monthlyData = useMemo(() => {
    if (!globalData) return [];
    return getMonthlyGlobalData(globalData);
  }, [globalData]);

  // Latest WTI and Brent prices
  const { latestWTI, latestBrent } = useMemo(() => {
    if (!globalData || globalData.length === 0) {
      return { latestWTI: null, latestBrent: null };
    }
    // Sort by date descending to find latest
    const sorted = [...globalData].sort(
      (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
    );
    const latestWTI = sorted.find((d) => d.tipo === 'WTI');
    const latestBrent = sorted.find((d) => d.tipo === 'BRENT_CRUDE');
    return {
      latestWTI: latestWTI?.precio_usd ?? null,
      latestBrent: latestBrent?.precio_usd ?? null,
    };
  }, [globalData]);

  if (isLoading) {
    return (
      <section className="max-w-7xl w-full mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="animate-pulse space-y-4">
            <div className="flex gap-4">
              <div className="h-20 bg-gray-100 rounded-lg flex-1" />
              <div className="h-20 bg-gray-100 rounded-lg flex-1" />
            </div>
            <div className="h-[300px] bg-gray-100 rounded" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl w-full mx-auto px-4 py-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-1">
          Petróleo Crudo — Referencias Internacionales
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          WTI y Brent en USD/barril — evolución mensual
        </p>

        {/* Ticker cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* WTI */}
          <div className="rounded-lg border border-gray-200 p-4">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              WTI
            </p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {latestWTI !== null ? formatUSD(latestWTI) : '—'}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">USD/barril</p>
          </div>
          {/* Brent */}
          <div className="rounded-lg border border-gray-200 p-4">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Brent
            </p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {latestBrent !== null ? formatUSD(latestBrent) : '—'}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">USD/barril</p>
          </div>
        </div>

        {/* Trend chart */}
        {monthlyData.length > 0 && (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={monthlyData}
              margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="fecha"
                tickFormatter={(value: Date) =>
                  value.toLocaleDateString('es-BO', {
                    month: 'short',
                    year: '2-digit',
                  })
                }
                tick={{ fontSize: 12 }}
              />
              <YAxis
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
              <Tooltip
                labelFormatter={(value: unknown) => {
                  try {
                    return new Date(value as string | number).toLocaleDateString('es-BO', {
                      year: 'numeric',
                      month: 'long',
                    });
                  } catch {
                    return String(value);
                  }
                }}
                formatter={(value: unknown, name: unknown) => {
                  if (value === null || value === undefined) return ['—', String(name)];
                  const num = Number(value);
                  if (isNaN(num)) return [String(value), String(name)];
                  return [`$${num.toFixed(2)}`, String(name)];
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="wti"
                stroke={COLORS.wti}
                strokeWidth={2}
                dot={false}
                name="WTI"
                connectNulls={false}
              />
              <Line
                type="monotone"
                dataKey="brent"
                stroke={COLORS.brent}
                strokeWidth={2}
                dot={false}
                name="Brent"
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}

        <div className="mt-3 text-xs text-gray-400">
          Promedio mensual · Fuente: EIA
        </div>
      </div>
    </section>
  );
}
