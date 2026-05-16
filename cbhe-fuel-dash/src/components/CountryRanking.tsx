import { useMemo } from 'react';
import { getRegionalComparison } from '../hooks/useDashboardData';
import { formatUSD } from '../utils/format';
import type { RegionalPrice } from '../hooks/useDashboardData';

interface CountryRankingProps {
  productGroup: string;
  selectedYear: number | null;
  regionalData: RegionalPrice[];
  comparison?: ReturnType<typeof getRegionalComparison>;
}

export default function CountryRanking({
  productGroup,
  selectedYear,
  regionalData,
  comparison: externalComparison,
}: CountryRankingProps) {
  // Use pre-filtered comparison if provided, otherwise compute
  const comparison = useMemo(() => {
    if (externalComparison) return externalComparison;
    if (!regionalData.length) return [];
    let result = getRegionalComparison(regionalData, productGroup);

    if (selectedYear !== null) {
      result = result.filter((item) => {
        const entry = regionalData.find(
          (d) => d.pais === item.pais && d.producto === item.producto
        );
        return entry && new Date(entry.fecha).getFullYear() === selectedYear;
      });
    }

    return result;
  }, [externalComparison, regionalData, productGroup, selectedYear]);

  // Sort by USD/L descending (highest first)
  const sorted = useMemo(
    () => [...comparison].sort((a, b) => b.precio_usd - a.precio_usd),
    [comparison]
  );

  const isGLP = productGroup === 'GLP';

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-base font-bold text-gray-900 mb-1">
        Ranking por País
      </h3>
      <p className="text-xs text-gray-500 mb-4">
        Precio USD/L — {productGroup}
        {selectedYear ? ` · ${selectedYear}` : ' · Último disponible'}
      </p>

      {sorted.length === 0 ? (
        <div className="text-center py-8 text-gray-400 text-sm">
          Sin datos disponibles para {productGroup}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                  #
                </th>
                <th className="text-left py-2 pr-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                  País
                </th>
                <th className="text-right py-2 pr-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Local
                </th>
                <th className="text-right py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
                  USD/L
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((item, idx) => {
                const isBolivia = item.pais === 'Bolivia';
                return (
                  <tr
                    key={item.pais}
                    className={`border-b border-gray-100 ${
                      isBolivia ? 'bg-red-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <td className="py-2 pr-3 text-gray-400 font-mono">
                      {idx + 1}
                    </td>
                    <td className="py-2 pr-3">
                      <span
                        className={`font-medium ${
                          isBolivia
                            ? 'text-red-700'
                            : 'text-gray-900'
                        }`}
                      >
                        {item.pais}
                      </span>
                      {isBolivia && (
                        <span className="ml-1.5 text-[10px] text-red-500 font-medium">
                          ●
                        </span>
                      )}
                    </td>
                    <td className="py-2 pr-3 text-right text-gray-600">
                      {item.precio_local.toFixed(2)} {item.moneda}
                    </td>
                    <td className="py-2 text-right font-semibold text-gray-900">
                      {formatUSD(item.precio_usd)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {isGLP && (
        <p className="mt-3 text-xs text-amber-600">
          GLP disponible solo para Bolivia.
        </p>
      )}
    </div>
  );
}
