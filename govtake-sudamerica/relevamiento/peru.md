---
country: peru
fiscal_regime_type: concession (license)
regulatory_authority: "PERUPETRO S.A. (empresa estatal de derecho privado) + Ministerio de Energía y Minas"
last_updated: 2026-05-11
data_retrieval_date: 2026-05-11
confidence: high
fiscal_components:
  - type: royalty
    rate: "5% a 20% según escala de producción o metodología R-factor (RRE)"
    methodology: "El contratista elige entre dos metodologías al momento de la Declaración de Descubrimiento Comercial: (a) Escala de Producción Fiscalizada, o (b) Resultado Económico (RRE). No puede cambiar después."
    legal_basis:
      - law: "Ley 26221 (Ley Orgánica de Hidrocarburos)"
        year: 1993
        article: "Art. 45-46"
        status: vigente
      - law: "Decreto Supremo 017-2003-EM"
        year: 2003
      - law: "Decreto Supremo 049-93-EM"
        year: 1993
    royalty_production_scale:
      - range: "< 5 MBC (miles barriles/día calendario)"
        rate: "5%"
      - range: "5 - 100 MBC"
        rate: "5% - 20% (interpolación lineal)"
      - range: "> 100 MBC"
        rate: "20%"
    royalty_rre:
      - fixed: "5% (fija)"
      - variable: "Hasta 20% según R-factor (ingresos acumulados / inversiones acumuladas)"
  - type: income_tax
    rate: "29.5% (régimen general). 30% con estabilidad tributaria (+2pp como contraprestación)."
    legal_basis:
      - law: "Ley del Impuesto a la Renta"
        status: vigente
      - law: "Ley 26221, Art. 48-63"
        year: 1993
  - type: dividend_withholding
    rate: "5% para no residentes"
    legal_basis:
      - law: "Ley del Impuesto a la Renta"
        status: vigente
  - type: royalty_withholding
    rate: "30% para regalías pagadas a no residentes (puede reducirse por CDI)"
    legal_basis:
      - law: "Ley del Impuesto a la Renta"
        status: vigente
  - type: iva
    rate: "18% (IGV 16% + IPM 2%). Devolución definitiva durante fase de exploración (Ley 27624)."
    legal_basis:
      - law: "Ley 27624"
        year: 2002
      - law: "Decreto Supremo 083-2002-EF"
        year: 2002
  - type: surface_fee
    rate: "Variable según contrato. PERUPETRO cobra por área retenida."
stability_guarantees:
  - mechanism: "Estabilidad tributaria contractual (Art. 63, Ley 26221)"
    duration_years: "Vigencia del contrato"
    coverage: "El Estado garantiza que los regímenes cambiarios y tributarios vigentes a la fecha de suscripción permanecerán inalterables durante la vigencia del contrato."
    cost: "La tasa del impuesto a la renta se incrementa en 2pp (30% en vez de 29.5%) como contraprestación por la estabilidad."
    legal_basis:
      - law: "Ley 26221, Art. 63"
        year: 1993
      - law: "Ley 27343"
        year: 2000
  - mechanism: "Convenios de Estabilidad Jurídica (inversión extranjera)"
    minimum_investment_usd: "10M (hidrocarburos y minería) / 5M (otros sectores)"
    duration_years: 10
    coverage: "Estabilidad del régimen del impuesto a la renta, protección contra trato discriminatorio, libre remesa de utilidades, dividendos y regalías"
    legal_basis:
      - law: "Decreto Legislativo 662"
        year: 1991
      - law: "Decreto Legislativo 757"
        year: 1991
contract_types:
  - "Contrato de Licencia: el contratista es dueño de los hidrocarburos extraídos y paga regalía"
  - "Contrato de Servicios: el contratista recibe retribución por servicios de producción"
  - "Convenio de Evaluación Técnica (TEA): áreas con poca información técnica"
transfer_of_title: "Hidrocarburos in situ son propiedad del Estado. PERUPETRO transfiere la propiedad al contratista en la Fecha de Suscripción del Contrato de Licencia (Art. 8, Ley 26221)."
nOC_participation: "Petroperú no tiene derecho especial de participación en upstream (a diferencia de YPFB o Petrobras). Excepciones: Bloque 64 (25%) y Bloque 192 (mandato legal)."
repatriation: "Sin restricciones. Libre remesa de utilidades, dividendos, intereses y regalías. Libre disponibilidad de divisas."
uncertainty_notes:
  - "Varios Contratos de Licencia están finalizando entre 2023-2025. Esto abre oportunidad para renegociación de términos."
  - "Petroperú ha sido autorizada a usar mecanismo de Obras por Impuestos (OxI) para proyectos de responsabilidad social."
  - "Producción petrolera en declinación — gobierno busca atraer nueva inversión."
references:
  - title: "Ley 26221 — Ley Orgánica de Hidrocarburos (TUO, Decreto Supremo 042-2005-EM)"
    url: "https://faolex.fao.org/docs/pdf/per62154.pdf"
    retrieved: 2026-05-11
  - title: "PERUPETRO — Aspectos Tributarios"
    url: "https://www.perupetro.com.pe/wps/portal/corporativo/inversionista/MARCO%20LEGAL/Aspectos%20tributarios/"
    retrieved: 2026-05-11
  - title: "PERUPETRO — Contratos de Exploración y Explotación (2024)"
    url: "https://www.perupetro.com.pe/wps/portal/corporativo/PerupetroSite/negociacion%20y%20contratacion/en%20fase%20de%20explotaci%C3%B3n/"
    retrieved: 2026-05-11
  - title: "KPMG — Oil & Gas Investment Guide 2024-2025, Peru"
    url: "https://kpmg.com/pe/es/home/insights/2024/02/oil-and-gas-investment-guide-2024-2025.html"
    retrieved: 2026-05-11
  - title: "EY — Peru's Energy Investment Guide 2024/2025"
    url: "https://www.ey.com/content/dam/ey-unified-site/ey-com/es-pe/insights/energy-resources/documents/ey-perus-energy-investment-guide-2024-2025-vs2.pdf"
    retrieved: 2026-05-11
  - title: "Cuatrecasas — Doing Business in Peru 2025"
    url: "https://www.cuatrecasas.com/resources/doing-business-in-peru-2025-edition-txt-eng-6901dfdd573d260519345.pdf"
    retrieved: 2026-05-11
---

# Perú — Régimen Fiscal de Hidrocarburos

## Jerarquía normativa

1. **Constitución Política** (1993) — Art. 66: recursos naturales son patrimonio de la Nación
2. **Ley 26221** (1993) — Ley Orgánica de Hidrocarburos
3. **Decreto Supremo 049-93-EM** — Reglamento de regalías (mínimo 15% original, modificado)
4. **Decreto Supremo 017-2003-EM** — Nuevas metodologías de regalías (mínimo 5%)
5. **Decreto Supremo 32-95-EF** — Garantía de Estabilidad Tributaria
6. **Ley 27624** (2002) — Devolución del IGV para exploración
7. **Ley 27377** (2000) — Actualización en Hidrocarburos

## Estructura del régimen fiscal

### Orden de aplicación

```
Valor de producción (precio de referencia × volumen fiscalizado)
  ↓
1. Regalía (5-20% según metodología elegida)
  ↓
Ingreso bruto del contratista
  ↓
2. Costos operativos deducibles
3. Depreciación y amortización de inversiones
  ↓
Renta neta imponible
  ↓
4. Impuesto a la Renta: 29.5% (o 30% con estabilidad)
  ↓
Utilidad neta
  ↓
5. Dividendos: 5% withholding a no residentes
```

### Metodologías de regalía

| Metodología | Regalía fija | Regalía variable | Mejor para |
|---|---|---|---|
| Escala de Producción | Varía según MBC | — | Campos de alta productividad conocida |
| Resultado Económico (RRE) | 5% | Hasta 20% según R-factor | Campos con alta inversión inicial |

**Escala de Producción Fiscalizada:**
- < 5 MBC → 5%
- 5-100 MBC → interpolación lineal 5-20%
- \> 100 MBC → 20%

**RRE (R-factor):**
- R = Ingresos acumulados / Inversiones acumuladas
- A mayor R (más retorno sobre inversión), mayor regalía variable
- Se calcula 2 veces por año (enero y julio)

### Estabilidad tributaria (Art. 63)

- Garantizada por ley desde la suscripción del contrato
- Cubre régimen cambiario y tributario
- Costo: 2pp adicionales en la tasa de income tax (30% vs 29.5%)
- Vigencia: duración del contrato (típicamente 30-40 años para explotación)

### Régimen de inversión extranjera

- Sin discriminación entre capital nacional y extranjero
- Sin restricciones a la repatriación de utilidades, dividendos o regalías
- Libre disponibilidad de divisas
- Convenios de Estabilidad Jurídica: 10 años de estabilidad para inversiones > USD 10M

## Carga fiscal total estimada

| Componente | Tasa | Base |
|---|---|---|
| Regalía | 5-20% | Valor de producción |
| Impuesto a la Renta | 29.5-30% | Renta neta |
| Dividendos (no residentes) | 5% | Distribución |
| IGV | 18% | Devolución en exploración |
| **Government Take efectivo** | **~35-55%** | Depende de regalía y rentabilidad |

## Notas para el modelo DCF

- Perú es consistentemente rankeado como uno de los regímenes más competitivos de la región (junto con Colombia pre-Petro).
- La elección de metodología de regalía (producción vs RRE) es una decisión estratégica del contratista que afecta significativamente el contractor take.
- La estabilidad tributaria contractual es una ventaja comparativa ENORME vs países con riesgo de cambio regulatorio (Colombia, Bolivia, Ecuador).
- Sin restricciones cambiarias = libre repatriación desde el día 1 (ventaja sobre Argentina sin RIGI).
- La devolución del IGV en exploración reduce el CAPEX efectivo en 18%.
