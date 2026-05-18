---
country: trinidad_tobago
fiscal_regime_type: mixed (concession_tax_royalty + production_sharing)
regulatory_authority: "Ministry of Energy and Energy Industries (MEEI) + Ministry of Finance + Inland Revenue Division"
last_updated: 2026-05-11
data_retrieval_date: 2026-05-11
confidence: high
fiscal_components:
  - type: royalty
    rate: "12.5% del valor justo de mercado (fair market value) del crudo y gas natural won and saved. Varía según licencia: típicamente 10-15%."
    legal_basis:
      - law: "Petroleum Act (Chap. 62:01)"
        status: vigente
      - law: "Petroleum Regulations"
        note: "Royalty pagadero en efectivo o en especie. Deducible para PPT."
  - type: petroleum_profits_tax
    rate: "50% sobre chargeable profits (operaciones petroleras). 30% para deepwater blocks."
    legal_basis:
      - law: "Petroleum Taxes Act (Act 22 of 1974), Part I"
        year: 1974
        status: vigente
    deductions: "Gastos operativos, capital allowances, royalties, SPT, Petroleum Levy/Impost, decommissioning costs, management fees (max 2% de gastos a no residentes). Dry holes, workovers, sidetracks calificados, heavy oil, y exploration costs (2014-2017) tienen allowances especiales."
    loss_relief: "75% relief. Losses pueden arrastrarse indefinidamente."
  - type: unemployment_levy
    rate: "5% sobre taxable profits de compañías petroleras. Base: taxable profits + previous year loss que fue deducido."
    legal_basis:
      - law: "Income Tax Act"
        status: vigente
  - type: supplemental_petroleum_tax
    rate: "0% a 55% sobre gross income de la disposición de crudo (menos royalty y overriding royalty). Tasa depende de precio del crudo y clasificación del campo."
    legal_basis:
      - law: "Petroleum Taxes Act, Part II"
        year: 1981
        status: vigente
    rate_structure:
      - price_range: "≤ USD 50/bbl"
        rate: "0%"
      - price_range: "USD 50 - 90/bbl"
        rate: "Tasa fija (según campo)"
      - price_range: "USD 90 - 200/bbl"
        rate: "Fórmula sliding scale"
      - price_range: "> USD 200/bbl"
        rate: "Capped: Marine pre-1988 64%, Marine post-1988 55%, Land/Deepwater 40%"
    field_classification:
      - "Marine operations (licencia pre-1988): 0-45% (hasta 64% a precios >USD 200)"
      - "Marine operations (licencia post-1988): 0-36%"
      - "Land operations (pre-1988): 0-38%"
      - "Land operations (post-1988): 0-21%"
  - type: petroleum_production_levy
    rate: "4% sobre gross income de crudo (productores de >3,500 bpd), o su participación proporcional en el subsidio local de petróleo, lo que sea menor."
  - type: petroleum_impost
    rate: "Determinado anualmente por el Ministerio de Energía. Cubre costos administrativos del ministerio."
    legal_basis:
      - law: "Petroleum Act"
  - type: green_fund_levy
    rate: "0.1% sobre gross sales o receipts"
  - type: withholding_tax_royalties
    rate: "15% para pagos a no residentes (salvo tratado)"
  - type: investment_tax_credit
    rate: "20% del gasto en desarrollo de campos maduros y proyectos EOR como crédito contra SPT. Solo usable en el año en que se incurre (desde 2014, carry forward 1 año)."
    legal_basis:
      - law: "Finance Act No. 4, 2014"
        year: 2014
stability_guarantees:
  - mechanism: "Production Sharing Contract (Modelo 2010 'taxable PSC')"
    coverage: "Estabilidad fiscal durante la vigencia del contrato. El Government share of Profit Petroleum cubre la obligación del contratista por PPT, UL, SPT, Royalty, Oil Impost, Petroleum Production Levy y Green Fund. Excepciones: Withholding Taxes y Stamp Duty (paga el contratista directamente)."
    note: "Modelo PSC introducido tras review fiscal de 2005. Permite consolidación por tipo de PSC (deep water o land/shallow marine). Incluye mecanismo de windfall profits."
contract_types:
  - "Exploration and Production Licence (E&P) — régimen de concesión tax/royalty, predominante antes de 1990s"
  - "Production Sharing Contract (PSC) — modelo 'taxable PSC' de 2010, principal para nuevos desarrollos"
transfer_of_title: "Concesión: contratista es dueño de los hidrocarburos. PSC: compartido Estado-Contratista."
cost_recovery_psc: "Cost oil recovery según términos del PSC. El Government share of Profit Petroleum cubre la mayoría de los impuestos del contratista."
uncertainty_notes:
  - "SPT varía por campo (pre/post 1988, marine/land/deepwater) — modelar requiere segmentar."
  - "Las allowances generosas (investment tax credit 20%, capital allowances, uplift en CAPEX) reducen significativamente la carga efectiva vs la nominal."
  - "Budget 2026: sin cambios al marco fiscal oil & gas. Oil price assumption USD 73.25/bbl (bajó de USD 77.80 en 2025)."
  - "En discusión: incentivos para estimular exploración (accelerated capital allowances, uplift en CAPEX)."
  - "Transfer pricing legislation en desarrollo (basada en OECD Guidelines)."
  - "Objetivo: que el 100% de los impuestos del sector energético se paguen en USD (actualmente solo 50%)."
references:
  - title: "PwC — Trinidad and Tobago National Budget 2026"
    url: "https://www.pwc.com/tt/en/publications/assets/trinidad-and-tobago-national-budget-2026.pdf"
    retrieved: 2026-05-11
  - title: "PwC — Trinidad and Tobago National Budget 2025"
    url: "https://www.pwc.com/tt/en/publications/assets/trinidad-and-tobago-national-budget-2025.pdf"
    retrieved: 2026-05-11
  - title: "Ministry of Energy — Current Fiscal Measures"
    url: "https://www.energy.gov.tt/for-investors/fiscal-regime/petroleum-fiscal-incentives-2014/"
    retrieved: 2026-05-11
  - title: "IRD (Inland Revenue Division) — For Petroleum Companies"
    url: "https://www.ird.gov.tt/for-petroleum-companies"
    retrieved: 2026-05-11
  - title: "Deloitte — Trinidad and Tobago Highlights 2024"
    url: "https://www2.deloitte.com/content/dam/Deloitte/global/Documents/Tax/dttl-tax-trinidadandtobagohighlights-2024.pdf"
    retrieved: 2026-05-11
  - title: "Ministry of Energy — Tax Laws"
    url: "https://www.energy.gov.tt/for-investors/fiscal-regime/tax-laws/"
    retrieved: 2026-05-11
---

# Trinidad & Tobago — Régimen Fiscal de Hidrocarburos

## Jerarquía normativa

1. **Petroleum Act (Chap. 62:01)** — Régimen de licencias, regalías, PSCs
2. **Petroleum Taxes Act (Act 22/1974)** — PPT (Part I) + SPT (Part II)
3. **Income Tax Act** — Impuesto corporativo general, Unemployment Levy
4. **Finance Acts** (anuales) — Modificaciones a incentivos, allowances, tax credits
5. **Petroleum Regulations** — Regalías, impost, producción

## Dos regímenes coexistentes

### 1. Régimen de Concesión (Tax/Royalty — E&P Licence)

Aplica a licencias anteriores a la introducción del modelo PSC 2010.

**Estructura fiscal:**
```
Gross income (crudo + gas)
  ↓
1. Royalty: 12.5% (deducible para PPT)
  ↓
2. Supplemental Petroleum Tax (SPT): 0-55% sobre gross income - royalty
   (aplica solo a crudo, no a gas natural)
  ↓
3. Deducciones operativas
4. Capital allowances (generosas)
5. Otras allowances (dry holes, workovers, sidetracks, etc.)
  ↓
Taxable profits
  ↓
6. Petroleum Profits Tax (PPT): 50% (30% deepwater)
7. Unemployment Levy (UL): 5%
  ↓
8. Petroleum Production Levy: 4% (o share del subsidio)
9. Green Fund Levy: 0.1%
```

### 2. Production Sharing Contract (Modelo 2010 "Taxable PSC")

Introducido tras la revisión fiscal de 2005.

**Características:**
- El Government share of Profit Petroleum cubre: PPT, UL, SPT, Royalty, Impost, Levy, Green Fund.
- El contratista paga directamente: Withholding Taxes, Stamp Duty.
- Mecanismo de **windfall profits**: a mayor precio del petróleo, mayor share para el Gobierno.
- **Consolidación permitida**: por tipo de PSC (deep water o land/shallow marine).
- **Estabilidad fiscal**: durante la vigencia del contrato.

## Supplemental Petroleum Tax (SPT) — El componente más complejo

El SPT es un windfall tax sobre crudo (no aplica a gas natural). Su tasa varía por:

1. **Precio del crudo**: 0% a ≤USD 50/bbl, subiendo progresivamente
2. **Clasificación del campo**: pre/post 1988, marine/land/deepwater
3. **Allowances**: investment tax credit (20%), capital uplift

### Tasas máximas por clasificación

| Clasificación | Rango normal | Cap a >USD 200/bbl |
|---|---|---|
| Marine pre-1988 | 0-45% | 64% |
| Marine post-1988 | 0-36% | 55% |
| Land pre-1988 | 0-38% | 40% |
| Land post-1988 | 0-21% | 40% |
| Deepwater | 0% a precios bajos | 40% |

### Investment Tax Credit (ITC)
- **20%** del gasto en desarrollo de campos maduros y EOR
- Crédito contra SPT (no PPT)
- Usable solo en el año fiscal incurrido (carry forward 1 año desde 2014)

## Carga fiscal total estimada

| Precio del crudo | SPT | PPT + UL | Royalty | Contractor take estimado |
|---|---|---|---|---|
| USD 50/bbl | 0% | 55% | 12.5% | **30-40%** |
| USD 75/bbl | 10-25% | 55% | 12.5% | **20-35%** |
| USD 100/bbl | 25-45% | 55% | 12.5% | **10-25%** |

*Nota: Las capital allowances y el ITC pueden mejorar significativamente estos números.*

## Datos de producción (2025-2026)

- Crudo: 55,257 bpd (agosto 2025), recuperándose de 52,357 bpd (abril 2025)
- Gas natural: 2.73 bcf/d (mayo 2025), proyección >3.2 bcf/d para 2027
- Principales operadores: bpTT, EOG Resources, Heritage Petroleum
- Proyectos: Mento (EOG+bpTT 50/50), Cypre Phase 1 (bpTT)
- FDI upstream: USD 2.2B (2025), USD 2.5B (2026 proyectado)
- 2025 Deepwater Competitive Bid Round: 4 ofertas (3 de CNOOC, 1 de STIT Energy)

## Notas para el modelo DCF

- La carga nominal (PPT 50% + UL 5% = 55%) es la más alta de la muestra. Pero las allowances y tax credits la reducen significativamente en la práctica.
- El SPT es el componente más distorsivo: es un impuesto sobre ingreso bruto (no utilidad) que solo aplica a crudo. Esto crea un sesgo pro-gas.
- Para un proyecto gasífero (sin SPT), Trinidad es más competitivo.
- Para un proyecto de crudo a precios altos, el SPT puede llevarse casi todo el upside.
- El modelo PSC 2010 es más predecible que la concesión porque da estabilidad fiscal.
- Budget 2026: sin cambios impositivos. Discusión en curso sobre incentivos exploratorios.
- Transfer pricing legislation en desarrollo — puede afectar a multinacionales.
