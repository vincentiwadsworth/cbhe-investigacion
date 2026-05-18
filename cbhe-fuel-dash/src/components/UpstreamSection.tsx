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
  BarChart,
  Bar,
  Cell,
} from 'recharts';
import {
  useReservesData,
  useProductionData,
  useDrillingData,
  filterByCountry,
} from '../hooks/useDashboardData';
import { COUNTRY_COLORS } from '../lib/constants';

function formatNumber(value: number | null | undefined, decimals = 1): string {
  if (value === null || value === undefined) return '—';
  return value.toFixed(decimals);
}

interface MetricCardProps {
  label: string;
  value: string;
  unit: string;
  subtitle?: string;
}

function MetricCard({ label, value, unit, subtitle }: MetricCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
        {label}
      </p>
      <div className="flex items-baseline gap-1 mt-1">
        <span className="text-2xl font-bold text-gray-900">{value}</span>
        <span className="text-sm text-gray-400">{unit}</span>
      </div>
      {subtitle && (
        <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
      )}
    </div>
  );
}

export default function UpstreamSection() {
  const { data: reservesData, isLoading: reservesLoading } = useReservesData();
  const { data: productionData, isLoading: productionLoading } = useProductionData();
  const { data: drillingData, isLoading: drillingLoading } = useDrillingData();

  const isLoading = reservesLoading || productionLoading || drillingLoading;

  const boliviaReserves = useMemo(
    () => (reservesData ? filterByCountry(reservesData, 'Bolivia') : []),
    [reservesData]
  );

  const boliviaProduction = useMemo(
    () => (productionData ? filterByCountry(productionData, 'Bolivia') : []),
    [productionData]
  );

  const boliviaDrilling = useMemo(
    () => (drillingData ? filterByCountry(drillingData, 'Bolivia') : []),
    [drillingData]
  );

  // Latest records per entity for Bolivia
  const latestProduction =
    boliviaProduction.length > 0
      ? boliviaProduction[boliviaProduction.length - 1]
      : null;
  const latestDrilling =
    boliviaDrilling.length > 0
      ? boliviaDrilling[boliviaDrilling.length - 1]
      : null;

  // For reserves, find the most recent year with actual certified data (not null)
  const latestCertifiedBolivia = boliviaReserves
    .slice()
    .reverse()
    .find((r) => r.reservas_gas_tcf !== null);
  const latestCertifiedPetroleoBolivia = boliviaReserves
    .slice()
    .reverse()
    .find((r) => r.reservas_petroleo_bbl !== null);

  const prevProduction =
    boliviaProduction.length >= 2
      ? boliviaProduction[boliviaProduction.length - 2]
      : null;

  // Latest year across all entities for the section header
  const latestYear =
    Math.max(
      latestProduction?.anio ?? 0,
      latestDrilling?.anio ?? 0,
      latestCertifiedBolivia?.anio ?? 0,
      latestCertifiedPetroleoBolivia?.anio ?? 0
    ) || null;

  const chartCountries = [
    'Argentina', 'Bolivia', 'Brasil', 'Colombia',
    'Ecuador', 'México', 'Perú', 'Venezuela',
  ];

  // Gas production timeline (2019-2024)
  const gasProdChart = useMemo(() => {
    if (!productionData) return [];
    const years = [2019, 2020, 2021, 2022, 2023, 2024];
    return years.map((year) => {
      const point: Record<string, unknown> = { year };
      for (const country of chartCountries) {
        const row = productionData.find(
          (d) => d.pais === country && d.anio === year
        );
        point[country] = row?.produccion_gas_bcm ?? null;
      }
      return point;
    });
  }, [productionData]);

  // Rigs timeline (2013-2024)
  const rigsChart = useMemo(() => {
    if (!drillingData) return [];
    const years = [];
    for (let y = 2013; y <= 2024; y++) years.push(y);
    return years.map((year) => {
      const point: Record<string, unknown> = { year };
      for (const country of chartCountries) {
        const row = drillingData.find(
          (d) => d.pais === country && d.anio === year
        );
        point[country] = row?.rigs_activos_prom ?? null;
      }
      return point;
    });
  }, [drillingData]);

  // Oil production bar chart (latest year = 2024)
  const oilProdBar = useMemo(() => {
    if (!productionData) return [];
    return chartCountries
      .map((country) => {
        const row = productionData.find(
          (d) => d.pais === country && d.anio === 2024
        );
        return {
          country,
          produccion: row?.produccion_petroleo_kbbld ?? 0,
          fill: COUNTRY_COLORS[country] ?? '#6B7280',
        };
      })
      .filter((d) => d.produccion > 0)
      .sort((a, b) => b.produccion - a.produccion);
  }, [productionData]);

  const yoyGasChange =
    latestProduction && prevProduction &&
    latestProduction.produccion_gas_bcm !== null &&
    prevProduction.produccion_gas_bcm !== null &&
    prevProduction.produccion_gas_bcm > 0
      ? ((latestProduction.produccion_gas_bcm - prevProduction.produccion_gas_bcm) /
          prevProduction.produccion_gas_bcm) *
        100
      : null;

  if (isLoading) {
    return (
      <section className="max-w-7xl w-full mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="animate-pulse space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 bg-gray-100 rounded-lg" />
              ))}
            </div>
            <div className="h-[300px] bg-gray-100 rounded" />
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
          Exploración y producción
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Reservas, producción y actividad de perforación en América Latina
        </p>

        {/* ── Bolivia key metrics ── */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Bolivia — {latestYear ?? '—'}{latestCertifiedBolivia && latestCertifiedBolivia.anio !== latestYear ? ` (reservas certificadas al ${latestCertifiedBolivia.anio})` : ''}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <MetricCard
              label="Prod. Gas"
              value={formatNumber(latestProduction?.produccion_gas_bcm, 1)}
              unit="BCM/año"
              subtitle={
                yoyGasChange !== null
                  ? `${yoyGasChange > 0 ? '+' : ''}${yoyGasChange.toFixed(1)}% vs año anterior`
                  : undefined
              }
            />
            <MetricCard
              label="Prod. Petróleo"
              value={formatNumber(latestProduction?.produccion_petroleo_kbbld, 0)}
              unit="kbbl/d"
            />
            <MetricCard
              label="Reservas Gas (certif.)"
              value={formatNumber(latestCertifiedBolivia?.reservas_gas_tcf, 2)}
              unit="TCF"
              subtitle={latestCertifiedBolivia ? `Certificación al ${latestCertifiedBolivia.anio}` : undefined}
            />
            <MetricCard
              label="Reservas Petróleo (certif.)"
              value={formatNumber(latestCertifiedPetroleoBolivia?.reservas_petroleo_bbl, 1)}
              unit="MM bbl"
              subtitle={latestCertifiedPetroleoBolivia ? `Certificación al ${latestCertifiedPetroleoBolivia.anio}` : undefined}
            />
            <MetricCard
              label="Rigs Activos"
              value={formatNumber(latestDrilling?.rigs_activos_prom, 1)}
              unit="equipos"
            />
          </div>
        </div>

        {/* ── Regional gas production chart ── */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Producción de Gas Natural — Regional (BCM/año)
          </h3>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart
              data={gasProdChart}
              margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="year"
                tick={{ fontSize: 12 }}
                tickFormatter={(v: number) => String(v)}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                label={{
                  value: 'BCM/año',
                  angle: -90,
                  position: 'insideLeft',
                  offset: -5,
                  style: { fontSize: 11, fill: '#6B7280' },
                }}
              />
              <Tooltip
                formatter={(value: unknown, name: unknown) => {
                  if (value === null || value === undefined) return ['—', String(name)];
                  return [`${Number(value).toFixed(1)} BCM`, String(name)];
                }}
              />
              <Legend />
              {chartCountries.map((country) => (
                <Line
                  key={country}
                  type="monotone"
                  dataKey={country}
                  stroke={COUNTRY_COLORS[country] ?? '#6B7280'}
                  strokeWidth={country === 'Bolivia' ? 2.5 : 1.5}
                  dot={country === 'Bolivia'}
                  name={country}
                  connectNulls={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
          <p className="text-xs text-gray-400 mt-2">
            Bolivia en declive desde 2014 (21.7 BCM). Argentina y Brasil creciendo con Vaca Muerta y Pre-sal.
          </p>
        </div>

        {/* ── Rigs timeline ── */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Rigs Activos — Indicador Líder de Inversión Upstream
          </h3>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart
              data={rigsChart}
              margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="year"
                tick={{ fontSize: 12 }}
                tickFormatter={(v: number) => String(v)}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                label={{
                  value: 'Equipos',
                  angle: -90,
                  position: 'insideLeft',
                  offset: -5,
                  style: { fontSize: 11, fill: '#6B7280' },
                }}
              />
              <Tooltip
                formatter={(value: unknown, name: unknown) => {
                  if (value === null || value === undefined) return ['—', String(name)];
                  return [`${Number(value).toFixed(1)}`, String(name)];
                }}
              />
              <Legend />
              {chartCountries.map((country) => (
                <Line
                  key={country}
                  type="monotone"
                  dataKey={country}
                  stroke={COUNTRY_COLORS[country] ?? '#6B7280'}
                  strokeWidth={country === 'Bolivia' ? 2.5 : 1.5}
                  dot={false}
                  name={country}
                  connectNulls={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
          <p className="text-xs text-gray-400 mt-2">
            Colapso generalizado en 2015-2016. México el único con recuperación sostenida desde 2018. Venezuela, Bolivia y Perú con mínimos históricos.
          </p>
        </div>

        {/* ── Oil production bar chart ── */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Producción de Petróleo (2024) — kbbl/día
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={oilProdBar}
              margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis
                type="category"
                dataKey="country"
                tick={{ fontSize: 12 }}
                width={80}
              />
              <Tooltip
                formatter={(value: unknown) => {
                  return [`${Number(value).toFixed(0)} kbbl/d`, 'Producción'];
                }}
              />
              <Bar dataKey="produccion" radius={[0, 4, 4, 0]}>
                {oilProdBar.map((entry) => (
                  <Cell key={entry.country} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

        </div>

        <div className="mt-6 text-xs text-gray-400 border-t border-gray-100 pt-4">
          Fuentes: Baker Hughes International Rig Count · BP Statistical Review · OPEC ASB · OGJ Survey · YPFB · ANH · ENAP · ANP · Pemex · Perupetro · Rystad
        </div>
      </div>
    </section>
  );
}
