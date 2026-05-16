import { useMemo } from 'react';
import {
  useAllRegionalData,
  getLatestPricesByCountry,
  getPriceChangesByCountry,
} from '../hooks/useDashboardData';
import { BCB_EXCHANGE_RATE, PRODUCT_GROUPS } from '../lib/constants';
import { formatBOB, formatUSD, computeUSD, getTrend } from '../utils/format';

// Products to show as cards
const HERO_PRODUCTS = [
  { group: 'Gasolina Regular', label: 'Gasolina Regular', icon: '⛽' },
  { group: 'Diésel', label: 'Diésel', icon: '🛢️' },
  { group: 'GLP', label: 'GLP', icon: '🔥' },
] as const;

interface VariationBadgeProps {
  label: string;
  changePercent: number | null;
}

function VariationBadge({ label, changePercent }: VariationBadgeProps) {
  if (changePercent === null || changePercent === undefined) {
    return (
      <span className="inline-flex items-center text-xs text-slate-500 bg-slate-700/50 rounded px-1.5 py-0.5">
        {label} —
      </span>
    );
  }
  const trend = getTrend(changePercent);
  const colorClass =
    trend?.direction === 'up'
      ? 'text-red-400 bg-red-900/30'
      : trend?.direction === 'down'
        ? 'text-green-400 bg-green-900/30'
        : 'text-slate-400 bg-slate-700/50';
  const arrow = trend?.direction === 'up' ? '↑' : trend?.direction === 'down' ? '↓' : '→';

  return (
    <span className={`inline-flex items-center text-xs rounded px-1.5 py-0.5 ${colorClass}`}>
      {label} {arrow} {Math.abs(changePercent).toFixed(1)}%
    </span>
  );
}

export default function HeroSection() {
  const { data: regionalData } = useAllRegionalData();

  // Latest prices per product group for Bolivia
  const latestPrices = useMemo(() => {
    if (!regionalData) return new Map();
    return getLatestPricesByCountry(regionalData, 'Bolivia');
  }, [regionalData]);

  // MoM changes (consecutive entries)
  const momChanges = useMemo(() => {
    if (!regionalData) return new Map();
    return getPriceChangesByCountry(regionalData, 'Bolivia');
  }, [regionalData]);

  // YoY changes: compare latest vs entry from ~12 months earlier
  const yoyChanges = useMemo(() => {
    const result = new Map<string, number | null>();

    if (!regionalData) return result;

    const countryData = regionalData
      .filter((d) => d.pais === 'Bolivia')
      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

    for (const [group, members] of Object.entries(PRODUCT_GROUPS)) {
      const matches = countryData.filter((d) => members.includes(d.producto));
      const latest = matches[0];

      if (!latest) {
        result.set(group, null);
        continue;
      }

      const latestDate = new Date(latest.fecha);
      const oneYearAgo = new Date(latestDate);
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

      // Find the closest entry to 12 months before, within ±90 days
      const yearAgoEntry = matches.find((d) => {
        const dDate = new Date(d.fecha);
        const diffDays = Math.abs(dDate.getTime() - oneYearAgo.getTime()) / (1000 * 60 * 60 * 24);
        return diffDays <= 90 && dDate < latestDate;
      });

      if (
        yearAgoEntry &&
        latest.precio_usd !== null &&
        yearAgoEntry.precio_usd !== null &&
        yearAgoEntry.precio_usd !== 0
      ) {
        const yoyPercent = ((latest.precio_usd - yearAgoEntry.precio_usd) / yearAgoEntry.precio_usd) * 100;
        result.set(group, yoyPercent);
      } else {
        result.set(group, null);
      }
    }

    return result;
  }, [regionalData]);

  // Last updated date
  const lastUpdated = useMemo(() => {
    if (!regionalData) return null;
    const boliviaEntries = regionalData
      .filter((d) => d.pais === 'Bolivia')
      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
    return boliviaEntries[0]?.fecha ?? null;
  }, [regionalData]);

  const formattedLastUpdated = lastUpdated
    ? new Date(lastUpdated).toLocaleDateString('es-BO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  // BCB date formatted
  const bcbDateFormatted = new Date(BCB_EXCHANGE_RATE.date).toLocaleDateString('es-BO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    <section className="bg-gradient-to-b from-slate-800 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Header line */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-white">
              Precios de Combustibles — Bolivia
            </h1>
            {formattedLastUpdated && (
              <p className="text-xs text-slate-400 mt-1">
                Actualizado: {formattedLastUpdated}
              </p>
            )}
          </div>
          <div className="text-sm text-amber-400 font-medium bg-slate-800/60 rounded-lg px-3 py-1.5">
            Tipo de cambio: Bs {BCB_EXCHANGE_RATE.rate.toFixed(2)}/$us ({bcbDateFormatted})
          </div>
        </div>

        {/* 3 Price cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {HERO_PRODUCTS.map(({ group, label, icon }) => {
            const priceData = latestPrices.get(group);
            const momData = momChanges.get(group);
            const yoyPercent = yoyChanges.get(group) ?? null;

            const priceBOB = priceData?.price_local ?? null;
            const priceUSD = priceData
              ? computeUSD(priceData.price_local, priceData.price_usd)
              : null;

            return (
              <div
                key={group}
                className="bg-slate-800/60 rounded-xl p-5 border border-slate-700/50"
              >
                {/* Product name */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">{icon}</span>
                  <span className="text-sm font-medium text-slate-300 uppercase tracking-wide">
                    {label}
                  </span>
                </div>

                {/* Main price: BOB/L */}
                <div className="mb-1">
                  <span className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                    {formatBOB(priceBOB) ?? 'Sin dato'}
                  </span>
                  <span className="text-base font-normal text-slate-400 ml-1">/L</span>
                </div>

                {/* Secondary price: USD/L */}
                <p className="text-sm text-slate-400 mb-3">
                  {priceUSD !== null ? `${formatUSD(priceUSD)}/L` : '—'}
                </p>

                {/* Variation badges */}
                <div className="flex flex-wrap gap-2">
                  <VariationBadge label="YoY" changePercent={yoyPercent} />
                  <VariationBadge label="MoM" changePercent={momData?.changePercent ?? null} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer line */}
        <div className="mt-6 text-center md:text-left border-t border-slate-700/50 pt-4">
          <p className="text-xs text-slate-500">
            Observatorio de Precios de Combustibles — CBHE
          </p>
        </div>
      </div>
    </section>
  );
}
