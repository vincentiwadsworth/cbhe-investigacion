# Government Take en Sudamérica — Benchmark de Regímenes Fiscales Upstream

**Pregunta de investigación**: ¿Cómo se comparan los regímenes fiscales de upstream de petróleo y gas natural en 9 países de América Latina, medidos a través del contractor take efectivo después de todos los gravámenes, bajo escenarios de precio P50/P10/P90, y qué componentes fiscales explican las mayores diferencias entre países?

## Países incluidos

| # | País | Régimen fiscal | Estado del relevamiento |
|---|---|---|---|
| 1 | Argentina | Concesión + RIGI (Ley 27.742/2024) | 🔍 En curso |
| 2 | Bolivia | Contrato de Servicios (YPFB, Ley 767) | 🔍 En curso |
| 3 | Brasil | Mixto: Concesión + PSC Pre-Sal | 🔍 En curso |
| 4 | Colombia | Concesión (ANH) | 🔍 En curso |
| 5 | Ecuador | PSC + Contratos de Servicio | 🔍 En curso |
| 6 | Guyana | PSC (2016 Stabroek + 2023 Model) | 🔍 En curso |
| 7 | México | Asignaciones PEMEX + Contratos | 🔍 En curso |
| 8 | Perú | Concesión (Perupetro, Ley 26221) | 🔍 En curso |
| 9 | Trinidad & Tobago | Concesión + PSC | 🔍 En curso |

## Fases del proyecto

| Fase | Descripción | Estado |
|---|---|---|
| 0 | Refinamiento de pregunta (FINER) | ✅ |
| 1 | STORM — 5 personas expertas + diálogo multi-perspectiva | ✅ |
| 2 | Búsqueda sistemática de literatura | ✅ |
| 3 | Relevamiento legislativo estructurado | 🔍 En curso |
| 4 | Diseño del modelo DCF con sensibilidad | 🔲 |
| 5 | Protocolo de reproducibilidad | 🔲 |

## Metodología

### Government Take
El contractor take se calcula como el porcentaje del flujo de caja neto del proyecto que queda en manos de la empresa después de todos los pagos al Estado:

```
Contractor Take = Contractor Net Cash Flow / (Gross Revenue - Total Costs)
Government Take = 1 - Contractor Take
```

Se utilizará **Discounted Government Take** (Rapp et al., 1999) para incorporar el efecto del timing de los pagos, y **True Government Take** (Smith, 1987) para normalizar regímenes.

### Componentes fiscales modelados
1. Regalías (royalty)
2. Impuesto a la renta corporativo
3. Participaciones especiales / profit oil split
4. Bonos (signature, discovery, production)
5. Impuestos a las ventas/exportación (VAT, retenciones, withholding)
6. Participación estatal (NOC carry, gobierno como socio)
7. Cánones superficiales y tasas administrativas
8. Estabilidad fiscal (duración, cobertura)

## Referencias clave

- Wood Mackenzie (2025). *Regional Fiscal Benchmarking: Latin America*.
- Vargas, J.C. & Quintana, S. (2015). *Competitive Analysis of Latin American Oil and Gas Fiscal Regimes*. SPE-177173.
- Rapp, W.J. et al. (1999). *Utilizing Discounted Government Take Analysis*. SPE-52958.
- Smith, D.E. (1987). *True Government Take (TGT): A Measurement of Fiscal Terms*. SPE-16308.
- Al-Harthy, M.H. (2010). *Pitfalls of percentage take metric for assessment of petroleum fiscal regimes*. IJSSOC.
- Iledare, O.O. (2004). *Analyzing the Impact of Petroleum Fiscal Arrangements on E&P Economics and the Host Government Take*. SPE-88969.
