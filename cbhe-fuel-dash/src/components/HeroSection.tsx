import { useMemo } from 'react';
import {
  useAllRegionalData,
  getLatestPricesByCountry,
  getPriceChangesByCountry,
} from '../hooks/useDashboardData';
import { BCB_EXCHANGE_RATE, COUNTRIES } from '../lib/constants';

interface SecondaryItem {
  label: string;
  value: string | null;
  unit: string;
  trend?: 'up' | 'down' | 'flat' | null;
  trendPercent?: number | null;
}

interface HeroSectionProps {
  // No props — component self-fetches Bolivia data via hooks
}

export default function HeroSection(_props: HeroSectionProps) {
  const { data: regionalData } = useAllRegionalData();

  const latestPrices = useMemo(() => {
    if (!regionalData) return new Map();
    return getLatestPricesByCountry(regionalData, 'Bolivia');
  }, [regionalData]);

  const priceChanges = useMemo(() => {
    if (!regionalData) return new Map();
    return getPriceChangesByCountry(regionalData, 'Bolivia');
  }, [regionalData]);

  const boliviaInfo = COUNTRIES.find((c) => c.name === 'Bolivia');
  const hasBoliviaData = boliviaInfo?.hasData && latestPrices.size > 0;

  const gasolinaReg = latestPrices.get('Gasolina Regular');
  const gasolinaPrem = latestPrices.get('Gasolina Premium');
  const diesel = latestPrices.get('Diésel');

  const gasolinaRegChange = priceChanges.get('Gasolina Regular');
  const gasolinaPremChange = priceChanges.get('Gasolina Premium');
  const dieselChange = priceChanges.get('Diésel');

  // Format BOB price with comma decimal (es-BO style)
  const formatBOB = (value: number | null | undefined): string | null => {
    if (value === null || value === undefined) return null;
    // Use Bs prefix, comma decimal, no thousand separator for fuel prices
    return `Bs\u00a0${value.toFixed(2).replace('.', ',')}`;
  };

  // Format USD price
  const formatUSD = (value: number | null | undefined): string | null => {
    if (value === null || value === undefined) return null;
    return `≈\u00a0USD\u00a0${value.toFixed(2).replace('.', ',')}`;
  };

  // Compute USD from BOB when precio_usd is null, using BCB rate
  const computeUSD = (priceLocal: number | null, priceUsd: number | null): number | null => {
    if (priceUsd !== null && priceUsd !== undefined) return priceUsd;
    if (priceLocal !== null && priceLocal !== undefined && BCB_EXCHANGE_RATE.rate > 0) {
      return parseFloat((priceLocal / BCB_EXCHANGE_RATE.rate).toFixed(2));
    }
    return null;
  };

  // Determine trend direction
  const getTrend = (changePercent: number | null): { direction: 'up' | 'down' | 'flat'; percent: number | null } | null => {
    if (changePercent === null) return null;
    return {
      direction: changePercent > 0.5 ? 'up' : changePercent < -0.5 ? 'down' : 'flat',
      percent: changePercent,
    };
  };

  const primaryTrend = getTrend(gasolinaRegChange?.changePercent ?? null);

  // Get the latest Bolivia entry date for "Actualizado"
  const lastUpdated = useMemo(() => {
    if (!regionalData) return null;
    const boliviaEntries = regionalData
      .filter((d) => d.pais === 'Bolivia')
      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
    return boliviaEntries[0]?.fecha ?? null;
  }, [regionalData]);

  // Build secondary items
  const secondaryItems: SecondaryItem[] = useMemo(() => {
    const items: SecondaryItem[] = [];

    const premTrend = getTrend(gasolinaPremChange?.changePercent ?? null);

    items.push({
      label: 'Gasolina Premium',
      value: gasolinaPrem
        ? formatBOB(gasolinaPrem.price_local)
        : null,
      unit: 'BOB/L',
      trend: premTrend?.direction ?? null,
      trendPercent: premTrend?.percent ?? null,
    });

    const dieselTrend = getTrend(dieselChange?.changePercent ?? null);

    items.push({
      label: 'Diésel',
      value: diesel
        ? formatBOB(diesel.price_local)
        : null,
      unit: 'BOB/L',
      trend: dieselTrend?.direction ?? null,
      trendPercent: dieselTrend?.percent ?? null,
    });

    items.push({
      label: 'Tipo de Cambio BCB',
      value: `1\u00a0USD\u00a0=\u00a0${BCB_EXCHANGE_RATE.rate}\u00a0BOB`,
      unit: '',
      trend: null,
      trendPercent: null,
    });

    return items;
  }, [gasolinaPrem, diesel, gasolinaPremChange, dieselChange]);

  // Trend arrow component
  const TrendArrow = ({ direction }: { direction: 'up' | 'down' | 'flat' | null }) => {
    if (!direction) return null;
    const color =
      direction === 'up'
        ? 'text-green-600'
        : direction === 'down'
        ? 'text-red-600'
        : 'text-gray-400';
    const arrow = direction === 'up' ? '↑' : direction === 'down' ? '↓' : '→';
    return <span className={`${color} text-sm ml-1`}>{arrow}</span>;
  };

  // --- No data state ---
  if (!hasBoliviaData) {
    return (
      <section className="bg-gradient-to-b from-slate-800 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-10 md:py-16">
          {/* Big number "Sin dato" */}
          <div className="text-center md:text-left">
            <p className="text-sm text-slate-300 mb-2 uppercase tracking-wider">
              Gasolina Regular · Bolivia
            </p>
            <div className="transition-all duration-300 ease-in-out">
              <p className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white">
                Sin dato
              </p>
              <p className="text-base md:text-lg text-slate-300 mt-2">
                Fuente: ANH (pendiente de integración)
              </p>
            </div>
          </div>

          {/* Secondary row */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 sm:gap-8">
            {secondaryItems.slice(0, 2).map((item) => (
              <div key={item.label} className="bg-slate-800/50 rounded-lg px-4 py-3 flex-1">
                <p className="text-xs text-slate-400 uppercase tracking-wide">{item.label}</p>
                <p className="text-lg font-semibold text-slate-300 mt-1">Sin dato</p>
              </div>
            ))}
            <div className="bg-slate-800/50 rounded-lg px-4 py-3 flex-1">
              <p className="text-xs text-slate-400 uppercase tracking-wide">
                Tipo de Cambio BCB
              </p>
              <p className="text-lg font-semibold text-amber-400 mt-1">
                1 USD = {BCB_EXCHANGE_RATE.rate} BOB
              </p>
            </div>
          </div>

          {/* Institutional statement */}
          <div className="mt-8 text-center md:text-left border-t border-slate-700 pt-6">
            <p className="text-sm text-slate-400">
              Observatorio de Precios de Combustibles — CBHE
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Datos de fuente ANH pendientes de integración
            </p>
          </div>
        </div>
      </section>
    );
  }

  // --- Has data state ---
  const primaryUSD = gasolinaReg
    ? computeUSD(gasolinaReg.price_local, gasolinaReg.price_usd)
    : null;

  const formattedLastUpdated = lastUpdated
    ? new Date(lastUpdated).toLocaleDateString('es-BO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <section className="bg-gradient-to-b from-slate-800 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-10 md:py-16">
        {/* Big number: Gasolina Regular Bolivia */}
        <div className="text-center md:text-left">
          <p className="text-sm text-slate-300 mb-2 uppercase tracking-wider">
            Gasolina Regular · Bolivia
          </p>
          <div className="transition-all duration-300 ease-in-out">
            <p className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white">
              {formatBOB(gasolinaReg?.price_local ?? null) ?? 'Sin dato'}<span className="text-2xl md:text-3xl lg:text-4xl font-normal text-slate-300">/L</span>
            </p>
            {primaryUSD !== null && (
              <p className="text-base md:text-lg text-slate-300 mt-2 flex items-center justify-center md:justify-start gap-2">
                {formatUSD(primaryUSD)}/L
                <TrendArrow direction={primaryTrend?.direction ?? null} />
              </p>
            )}
          </div>
        </div>

        {/* Secondary row */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {secondaryItems.map((item) => {
            const isBCB = item.label === 'Tipo de Cambio BCB';
            return (
              <div
                key={item.label}
                className="bg-slate-800/50 rounded-lg px-4 py-3 flex flex-col"
              >
                <p className="text-xs text-slate-400 uppercase tracking-wide">
                  {item.label}
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                  <p
                    className={`text-lg font-semibold ${
                      isBCB ? 'text-amber-400' : 'text-white'
                    }`}
                  >
                    {item.value ?? 'Sin dato'}
                  </p>
                  {item.unit && !isBCB && item.value !== null && (
                    <span className="text-xs text-slate-400">{item.unit}</span>
                  )}
                </div>
                <div className="flex items-center mt-1">
                  <TrendArrow direction={item.trend ?? null} />
                  {item.trendPercent !== null && item.trendPercent !== undefined && (
                    <span
                      className={`text-xs ${
                        item.trend === 'up'
                          ? 'text-green-400'
                          : item.trend === 'down'
                          ? 'text-red-400'
                          : 'text-slate-400'
                      }`}
                    >
                      {Math.abs(item.trendPercent).toFixed(1)}% vs mes anterior
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Institutional statement */}
        <div className="mt-8 text-center md:text-left border-t border-slate-700 pt-6">
          <p className="text-sm text-slate-400">
            Observatorio de Precios de Combustibles — CBHE
          </p>
          {formattedLastUpdated && (
            <p className="text-xs text-slate-500 mt-1">
              Actualizado: {formattedLastUpdated}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
