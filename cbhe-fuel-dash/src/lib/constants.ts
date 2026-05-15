// Tipo de cambio referencial del Banco Central de Bolivia
// Actualizar manualmente — fuente: bcb.gob.bo
export const BCB_EXCHANGE_RATE = {
  rate: 10.25,
  date: '2026-05-15',
  source: 'Banco Central de Bolivia',
};

// Países con datos disponibles en la DB
export const COUNTRIES = [
  { name: 'Bolivia', code: 'BO', hasData: true },
  { name: 'Argentina', code: 'AR', hasData: true },
  { name: 'Brasil', code: 'BR', hasData: true },
  { name: 'Chile', code: 'CL', hasData: true },
  { name: 'Colombia', code: 'CO', hasData: true },
  { name: 'Ecuador', code: 'EC', hasData: true },
  { name: 'México', code: 'MX', hasData: true },
  { name: 'Perú', code: 'PE', hasData: true },
  { name: 'Venezuela', code: 'VE', hasData: true },
] as const;

// Mapa de productos: categoría → nombres locales por país
export const PRODUCT_GROUPS: Record<string, string[]> = {
  'Gasolina Regular': ['Gasolina Regular', 'Gasolina Comum', 'Magna', 'Gasolina 93'],
  'Gasolina Premium': ['Gasolina Premium', 'Gasolina Aditivada', 'Premium', 'Gasolina 97'],
  'Diésel': ['Diésel', 'Diésel S10'],
  'Kerosene': ['Kerosene'],
  'GLP': ['GLP'],
  'GNV': ['GNV'],
};

export const ALL_PRODUCTS = Object.keys(PRODUCT_GROUPS);

// Períodos de tiempo
export const PERIODS = [
  { value: '1M', label: '1 mes', months: 1 },
  { value: '3M', label: '3 meses', months: 3 },
  { value: '6M', label: '6 meses', months: 6 },
  { value: '1A', label: '1 año', months: 12 },
  { value: 'TODO', label: 'Todo', months: null },
] as const;

// Colores del chart
export const COLORS = {
  wti: '#6366F1',
  brent: '#10B981',
  gasolinaRegular: '#3B82F6',
  gasolinaPremium: '#8B5CF6',
  diesel: '#F59E0B',
  kerosene: '#EC4899',
} as const;

export const COUNTRY_COLORS: Record<string, string> = {
  Argentina: '#3B82F6',
  Brasil: '#10B981',
  Chile: '#EF4444',
  Colombia: '#F59E0B',
  Ecuador: '#8B5CF6',
  México: '#14B8A6',
  Perú: '#F97316',
  Venezuela: '#6366F1',
  Bolivia: '#DC2626',
};

// Nombre de producto para mostrar en UI dado el nombre de la DB
export function getDisplayProductName(rawProductName: string): string {
  for (const [group, members] of Object.entries(PRODUCT_GROUPS)) {
    if (members.includes(rawProductName)) return group;
  }
  return rawProductName;
}