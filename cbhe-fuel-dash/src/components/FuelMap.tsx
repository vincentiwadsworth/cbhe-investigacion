import { useMemo, useState } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from '@vnedyalk0v/react19-simple-maps';
import { useDashboardFilters } from '../context/DashboardFilter';
import {
  useAllRegionalData,
  getRegionalComparison,
} from '../hooks/useDashboardData';

// Local TopoJSON — avoids CDN fetch + library security validation issues
import worldAtlas from '../../public/world-atlas-110m.json';

// Branded coordinate types from react19-simple-maps
type Longitude = number & { __brand: 'longitude' };
type Latitude = number & { __brand: 'latitude' };
const lon = (v: number) => v as Longitude;
const lat = (v: number) => v as Latitude;

// ISO 3166-1 numeric → country name (matching our DB)
const ISO_TO_COUNTRY: Record<string, string> = {
  '068': 'Bolivia',
  '032': 'Argentina',
  '076': 'Brasil',
  '152': 'Chile',
  '170': 'Colombia',
  '218': 'Ecuador',
  '484': 'México',
  '604': 'Perú',
  '862': 'Venezuela',
};

// Countries we have data for
const TRACKED_IDS = new Set(Object.keys(ISO_TO_COUNTRY));

// Color scale: low price → green, high price → red
function getColor(price: number, min: number, max: number): string {
  if (max === min) return '#3B82F6'; // single data point → blue
  const ratio = (price - min) / (max - min);
  // Interpolate from teal (#14B8A6) to orange-red (#F97316)
  const r = Math.round(20 + ratio * 229);
  const g = Math.round(184 - ratio * 69);
  const b = Math.round(166 - ratio * 144);
  return `rgb(${r},${g},${b})`;
}

// Map projection centered on South America
const MAP_CENTER: [Longitude, Latitude] = [lon(-58), lat(-15)];
const PROJECTION_CONFIG = {
  center: MAP_CENTER,
  scale: 450,
};

interface TooltipData {
  country: string;
  price: number;
  localPrice: number;
  currency: string;
  product: string;
}

export default function FuelMap() {
  const { selectedProduct, setCountry } = useDashboardFilters();
  const { data: regionalData, isLoading } = useAllRegionalData();
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const productGroup =
    selectedProduct === 'all' ? 'Gasolina Regular' : selectedProduct;

  // Build price map: country name → price data
  const priceMap = useMemo(() => {
    if (!regionalData) return new Map<string, { price: number; local: number; currency: string; product: string }>();
    const comparison = getRegionalComparison(regionalData, productGroup);
    const map = new Map<string, { price: number; local: number; currency: string; product: string }>();
    for (const item of comparison) {
      map.set(item.pais, {
        price: item.precio_usd,
        local: item.precio_local,
        currency: item.moneda,
        product: item.producto,
      });
    }
    return map;
  }, [regionalData, productGroup]);

  // Calculate min/max for color scale (only tracked countries with data)
  const { minPrice, maxPrice } = useMemo(() => {
    const prices = Array.from(priceMap.values())
      .map((v) => v.price)
      .filter((p) => p > 0);
    if (prices.length === 0) return { minPrice: 0, maxPrice: 1 };
    return {
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices),
    };
  }, [priceMap]);

  const handleMouseEnter = (
    geo: { id: string; properties: { name: string } },
    event: React.MouseEvent
  ) => {
    const countryName = ISO_TO_COUNTRY[geo.id];
    if (!countryName) {
      setTooltip(null);
      return;
    }
    const data = priceMap.get(countryName);
    if (data && data.price > 0) {
      setTooltip({
        country: countryName,
        price: data.price,
        localPrice: data.local,
        currency: data.currency,
        product: data.product,
      });
      setTooltipPos({ x: event.clientX, y: event.clientY });
    } else {
      setTooltip({
        country: countryName,
        price: 0,
        localPrice: 0,
        currency: '-',
        product: '-',
      });
      setTooltipPos({ x: event.clientX, y: event.clientY });
    }
  };

  const handleMouseLeave = () => {
    setTooltip(null);
  };

  const handleClick = (geo: { id: string }) => {
    const countryName = ISO_TO_COUNTRY[geo.id];
    if (countryName) {
      setCountry(countryName);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-5 bg-gray-200 rounded w-48" />
          <div className="h-[400px] bg-gray-100 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Mapa de Precios</h2>
          <p className="text-sm text-gray-500">
            USD por litro — {productGroup} · Hacé clic en un país para ver detalles
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <div
            className="w-4 h-3 rounded-sm"
            style={{ backgroundColor: getColor(minPrice, minPrice, maxPrice) }}
          />
          <span>${minPrice.toFixed(2)}</span>
          <div className="w-16 h-3 rounded-sm" style={{
            background: `linear-gradient(to right, ${getColor(minPrice, minPrice, maxPrice)}, ${getColor(maxPrice, minPrice, maxPrice)})`,
          }} />
          <span>${maxPrice.toFixed(2)}</span>
        </div>
      </div>

      <div className="relative">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={PROJECTION_CONFIG}
          width={700}
          height={450}
        >
          <ZoomableGroup
            center={MAP_CENTER}
            zoom={1}
            minZoom={0.5}
            maxZoom={5}
          >
            <Geographies geography={worldAtlas}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const isTracked = TRACKED_IDS.has(geo.id);
                  const countryName = ISO_TO_COUNTRY[geo.id];
                  const data = countryName ? priceMap.get(countryName) : null;
                  const hasPrice = data && data.price > 0;

                  return (
                    <Geography
                      key={geo.id}
                      geography={geo}
                      onMouseEnter={(event) => handleMouseEnter(geo, event as unknown as React.MouseEvent)}
                      onMouseLeave={handleMouseLeave}
                      onClick={() => handleClick(geo)}
                      style={{
                        default: {
                          fill: hasPrice
                            ? getColor(data.price, minPrice, maxPrice)
                            : isTracked
                              ? '#D1D5DB' // tracked but no data
                              : '#F3F4F6', // not tracked
                          stroke: '#FFFFFF',
                          strokeWidth: 0.5,
                          outline: 'none',
                          cursor: isTracked ? 'pointer' : 'default',
                        },
                        hover: {
                          fill: hasPrice
                            ? getColor(data.price, minPrice, maxPrice)
                            : isTracked
                              ? '#9CA3AF'
                              : '#E5E7EB',
                          stroke: '#374151',
                          strokeWidth: 1,
                          outline: 'none',
                          cursor: isTracked ? 'pointer' : 'default',
                        },
                        pressed: {
                          fill: hasPrice
                            ? getColor(data.price, minPrice, maxPrice)
                            : '#9CA3AF',
                          stroke: '#1F2937',
                          strokeWidth: 1.5,
                          outline: 'none',
                        },
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>

        {/* Tooltip */}
        {tooltip && (
          <div
            className="fixed z-50 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg pointer-events-none"
            style={{
              left: tooltipPos.x + 12,
              top: tooltipPos.y - 10,
            }}
          >
            <p className="font-bold text-sm">{tooltip.country}</p>
            {tooltip.price > 0 ? (
              <>
                <p>${tooltip.price.toFixed(2)} USD/L</p>
                <p className="text-gray-300">
                  {tooltip.localPrice.toFixed(2)} {tooltip.currency}
                </p>
              </>
            ) : (
              <p className="text-gray-400">Sin dato disponible</p>
            )}
          </div>
        )}
      </div>

      <div className="mt-3 text-xs text-gray-400">
        Los países en gris no tienen datos disponibles · Usá scroll para zoom · Arrastrá para mover
      </div>
    </div>
  );
}
