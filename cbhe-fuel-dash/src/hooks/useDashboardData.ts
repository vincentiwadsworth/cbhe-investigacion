import { useQuery } from '@tanstack/react-query';
import { insforge } from '../lib/client';
import { PRODUCT_GROUPS } from '../lib/constants';

export interface GlobalPrice {
  id: number;
  fecha: string;
  tipo: string;
  precio_usd: number;
  fuente: string;
  data_source: string | null;
  quality_score: number;
  last_fetched_at: string | null;
  created_at: string;
}

export interface RegionalPrice {
  id: number;
  fecha: string;
  pais: string;
  producto: string;
  precio_local: number;
  precio_usd: number | null;
  moneda: string;
  fuente: string;
  data_source: string | null;
  quality_score: number;
  last_fetched_at: string | null;
  created_at: string;
  frecuencia: string | null;
}

/** Fetches all global price data (WTI + Brent). Cached 24h. */
export function useAllGlobalData() {
  return useQuery<GlobalPrice[]>({
    queryKey: ['allGlobalPrices'],
    queryFn: async () => {
      const { data, error } = await insforge.database
        .from('crude_benchmarks')
        .select('*')
        .order('fecha', { ascending: false })
        .limit(10000);

      if (error) throw error;
      return data || [];
    },
    staleTime: 24 * 60 * 60 * 1000,
  });
}

/** Fetches all regional price data. Cached 24h. */
export function useAllRegionalData() {
  return useQuery<RegionalPrice[]>({
    queryKey: ['allRegionalPrices'],
    queryFn: async () => {
      const { data, error } = await insforge.database
        .from('fuel_prices_regional')
        .select('*')
        .order('fecha', { ascending: false })
        .limit(10000);

      if (error) throw error;
      return data || [];
    },
    staleTime: 24 * 60 * 60 * 1000,
  });
}

/**
 * Gets the latest price for each product group in a given country.
 * Returns Map<productGroup, { price_usd, price_local, moneda, fecha, rawProductName }>
 */
export function getLatestPricesByCountry(
  data: RegionalPrice[],
  country: string
): Map<string, {
  price_usd: number | null;
  price_local: number;
  moneda: string;
  fecha: string;
  rawProductName: string;
}> {
  const result = new Map<string, {
    price_usd: number | null;
    price_local: number;
    moneda: string;
    fecha: string;
    rawProductName: string;
  }>();

  const countryData = data
    .filter((d) => d.pais === country)
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

  for (const [group, members] of Object.entries(PRODUCT_GROUPS)) {
    const match = countryData.find((d) => members.includes(d.producto));
    if (match) {
      result.set(group, {
        price_usd: match.precio_usd,
        price_local: match.precio_local,
        moneda: match.moneda,
        fecha: match.fecha,
        rawProductName: match.producto,
      });
    }
  }

  return result;
}

/**
 * Gets monthly change (%) for each product group in a given country.
 * Returns Map<productGroup, { current, previous, changePercent }>
 */
export function getPriceChangesByCountry(
  data: RegionalPrice[],
  country: string
): Map<string, {
  current: number | null;
  previous: number | null;
  changePercent: number | null;
}> {
  const result = new Map<string, {
    current: number | null;
    previous: number | null;
    changePercent: number | null;
  }>();

  const countryData = data
    .filter((d) => d.pais === country)
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

  for (const [group, members] of Object.entries(PRODUCT_GROUPS)) {
    const matches = countryData.filter((d) => members.includes(d.producto));
    const latest = matches[0];
    const previous = matches[1];

    if (latest && previous) {
      const current = latest.precio_usd;
      const prev = previous.precio_usd;
      const changePercent =
        current !== null && prev !== null && prev !== 0
          ? ((current - prev) / prev) * 100
          : null;
      result.set(group, { current, previous: prev, changePercent });
    } else if (latest) {
      result.set(group, { current: latest.precio_usd, previous: null, changePercent: null });
    }
  }

  return result;
}

/**
 * Aggregates global monthly data: last price per month per type.
 * Returns array of { fecha, wti, brent } sorted by date.
 */
export function getMonthlyGlobalData(data: GlobalPrice[]) {
  const monthMap = new Map<string, { fecha: Date; wti: number | null; brent: number | null }>();

  for (const point of data) {
    const d = new Date(point.fecha);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;

    const existing = monthMap.get(key) || {
      fecha: new Date(d.getFullYear(), d.getMonth(), 1),
      wti: null as number | null,
      brent: null as number | null,
    };

    // Use last price of the month
    if (point.tipo === 'WTI') existing.wti = point.precio_usd;
    if (point.tipo === 'BRENT_CRUDE') existing.brent = point.precio_usd;

    monthMap.set(key, existing);
  }

  return Array.from(monthMap.values()).sort((a, b) => a.fecha.getTime() - b.fecha.getTime());
}

/**
 * Gets latest price per country for a given product group.
 * Used for the regional comparison bar chart.
 */
export function getRegionalComparison(
  data: RegionalPrice[],
  productGroup: string
): { pais: string; precio_usd: number; precio_local: number; moneda: string; fuente: string; producto: string }[] {
  const members = PRODUCT_GROUPS[productGroup] || [productGroup];
  const countryLatest = new Map<string, { pais: string; precio_usd: number; precio_local: number; moneda: string; fuente: string; producto: string; fecha: Date }>();

  for (const d of data) {
    if (!members.includes(d.producto)) continue;

    const existing = countryLatest.get(d.pais);
    const dDate = new Date(d.fecha);

    if (!existing || dDate > existing.fecha) {
      countryLatest.set(d.pais, {
        pais: d.pais,
        precio_usd: Number(d.precio_usd),
        precio_local: d.precio_local,
        moneda: d.moneda,
        fuente: d.fuente,
        producto: d.producto,
        fecha: dDate,
      });
    }
  }

  return Array.from(countryLatest.values()).sort((a, b) => a.precio_usd - b.precio_usd);
}

// ── Upstream (E&P) — Domain-entity hooks ──────────────────────

export interface ReservesRecord {
  id: number;
  pais: string;
  codigo_pais: string;
  anio: number;
  reservas_petroleo_bbl: number | null;
  reservas_gas_tcf: number | null;
  fuente: string | null;
  notas: string | null;
}

export interface ProductionRecord {
  id: number;
  pais: string;
  codigo_pais: string;
  anio: number;
  produccion_petroleo_kbbld: number | null;
  produccion_gas_bcm: number | null;
  fuente: string | null;
  notas: string | null;
}

export interface DrillingRecord {
  id: number;
  pais: string;
  codigo_pais: string;
  anio: number;
  rigs_activos_prom: number | null;
  fuente: string | null;
  notas: string | null;
}

/** Generic constraint: entity rows must have pais + anio for filtering. */
interface HasCountryYear {
  pais: string;
  anio: number;
}

/**
 * Filters data by country and sorts by year ascending.
 * Works with any entity that has pais + anio fields.
 */
export function filterByCountry<T extends HasCountryYear>(
  data: T[],
  country: string
): T[] {
  return data
    .filter((d) => d.pais === country)
    .sort((a, b) => a.anio - b.anio);
}

/**
 * Returns a Map of country → latest (max year) record.
 * Works with any entity that has pais + anio fields.
 */
export function getLatestByCountry<T extends HasCountryYear>(
  data: T[]
): Map<string, T> {
  const latest = new Map<string, T>();
  for (const row of data) {
    const existing = latest.get(row.pais);
    if (!existing || row.anio > existing.anio) {
      latest.set(row.pais, row);
    }
  }
  return latest;
}

/** Fetches hydrocarbon reserves data. Cached 24h. */
export function useReservesData() {
  return useQuery<ReservesRecord[]>({
    queryKey: ['reservesAnnual'],
    queryFn: async () => {
      const { data, error } = await insforge.database
        .from('reserves_annual')
        .select('*')
        .order('anio', { ascending: true })
        .limit(5000);

      if (error) throw error;
      return (data || []) as ReservesRecord[];
    },
    staleTime: 24 * 60 * 60 * 1000,
  });
}

/** Fetches production data. Cached 24h. */
export function useProductionData() {
  return useQuery<ProductionRecord[]>({
    queryKey: ['productionAnnual'],
    queryFn: async () => {
      const { data, error } = await insforge.database
        .from('production_annual')
        .select('*')
        .order('anio', { ascending: true })
        .limit(5000);

      if (error) throw error;
      return (data || []) as ProductionRecord[];
    },
    staleTime: 24 * 60 * 60 * 1000,
  });
}

/** Fetches drilling activity data. Cached 24h. */
export function useDrillingData() {
  return useQuery<DrillingRecord[]>({
    queryKey: ['drillingActivity'],
    queryFn: async () => {
      const { data, error } = await insforge.database
        .from('drilling_activity')
        .select('*')
        .order('anio', { ascending: true })
        .limit(5000);

      if (error) throw error;
      return (data || []) as DrillingRecord[];
    },
    staleTime: 24 * 60 * 60 * 1000,
  });
}