import { BCB_EXCHANGE_RATE } from '../lib/constants';

/**
 * Format a price in BOB (Bolivianos) with Bs prefix and comma decimal.
 * Matches es-BO convention: "Bs 6,96"
 */
export function formatBOB(value: number | null | undefined): string | null {
  if (value === null || value === undefined) return null;
  return `Bs\u00a0${value.toFixed(2).replace('.', ',')}`;
}

/**
 * Format a price in USD with $ prefix and comma decimal.
 * Example: "$ 1,02"
 */
export function formatUSD(value: number | null | undefined): string | null {
  if (value === null || value === undefined) return null;
  return `$\u00a0${value.toFixed(2).replace('.', ',')}`;
}

/**
 * Compute USD price from local price when precio_usd is null.
 * Uses the BCB exchange rate from constants.
 */
export function computeUSD(
  priceLocal: number | null | undefined,
  priceUsd: number | null | undefined
): number | null {
  if (priceUsd !== null && priceUsd !== undefined) return priceUsd;
  if (
    priceLocal !== null &&
    priceLocal !== undefined &&
    BCB_EXCHANGE_RATE.rate > 0
  ) {
    return parseFloat((priceLocal / BCB_EXCHANGE_RATE.rate).toFixed(2));
  }
  return null;
}

/**
 * Determine trend direction and percentage from a change value.
 * Returns null if no data available.
 */
export function getTrend(
  changePercent: number | null | undefined
): { direction: 'up' | 'down' | 'flat'; percent: number } | null {
  if (changePercent === null || changePercent === undefined) return null;
  return {
    direction:
      changePercent > 0.5 ? 'up' : changePercent < -0.5 ? 'down' : 'flat',
    percent: changePercent,
  };
}

/**
 * Format a variation percentage with sign and color class.
 * Returns { text, className } or null if no data.
 */
export function formatVariation(
  changePercent: number | null | undefined
): { text: string; className: string } | null {
  if (changePercent === null || changePercent === undefined) return null;
  const sign = changePercent > 0 ? '+' : '';
  const className =
    changePercent > 0
      ? 'text-red-400'
      : changePercent < 0
        ? 'text-green-400'
        : 'text-slate-400';
  return {
    text: `${sign}${changePercent.toFixed(1)}%`,
    className,
  };
}
