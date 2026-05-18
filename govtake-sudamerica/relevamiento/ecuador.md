---
country: ecuador
fiscal_regime_type: mixed (production_sharing + service_contracts)
regulatory_authority: "Ministerio de Energía y Minas + ARCERNNR (Agencia de Regulación y Control) + SRI (tributario) + EP Petroecuador"
last_updated: 2026-05-11
data_retrieval_date: 2026-05-11
confidence: medium
fiscal_components:
  - type: production_sharing_contract
    rate: "Participación del Estado ≥ participación del contratista (por Constitución). Estado recibe su share + todos los impuestos pagados por el contratista."
    legal_basis:
      - law: "Ley de Hidrocarburos (reformada 2021)"
        year: 1978
        modified_by: "Reforma noviembre 2021 (gobierno Lasso)"
      - law: "Constitución, Art. 408"
        year: 2008
    mechanism: "El contratista recibe un % de la producción como ingreso bruto. De ahí deduce: costos de transporte y comercialización, Ley 40 (Amazonía), 15% participación laboral, 25% income tax, Margen Soberano, e impuesto de remesas."
  - type: service_contract_tariff
    rate: "Tarifa fija por barril neto producido y entregado al Estado en el punto de medición"
    legal_basis:
      - law: "Ley de Hidrocarburos"
        status: vigente
    mechanism: "El Estado se reserva el 25% del ingreso bruto como 'Margen Soberano'. El 75% restante cubre primero costos de transporte y comercialización, luego la tarifa del contratista. Si no alcanza, se acumula como carry forward (no pagado al final del contrato)."
  - type: sovereign_margin
    rate: "Ajuste ex-post: si los beneficios del contratista superan los del Estado, se recalculan las participaciones para restaurar la preeminencia estatal"
    legal_basis:
      - law: "Ley de Hidrocarburos"
        status: vigente
  - type: income_tax
    rate: "25% sobre utilidad neta"
    legal_basis:
      - law: "Ley de Régimen Tributario Interno"
        status: vigente
  - type: labor_profit_sharing
    rate: "15% de utilidades: 3% para empleados directos e indirectos, 12% para el Estado (inversión social en comunidades del área de influencia)"
    legal_basis:
      - law: "Código de Trabajo + Ley de Hidrocarburos"
        status: vigente
  - type: law_40_amazon
    rate: "Contribución sobre transporte de crudo por oleoducto (Amazonía)"
    legal_basis:
      - law: "Ley 40 (Ley Orgánica para la Planificación Integral de la Circunscripción Territorial Especial Amazónica)"
        year: 2018
  - type: vat
    rate: "15% IVA. En PSC: no reembolsable (costo hundido). En Contratos de Servicio: el IVA + tarifa se facturan juntos mensualmente."
    legal_basis:
      - law: "Ley de Régimen Tributario Interno"
        status: vigente
  - type: remittance_tax
    rate: "Variable (aplica a remesas al exterior)"
    legal_basis:
      - law: "Ley de Régimen Tributario Interno"
  - type: non_refundable_contribution
    rate: "1% del pago por servicios (solo Contratos de Servicio, desde inicio de producción) — para investigación y desarrollo tecnológico"
    legal_basis:
      - law: "Ley de Hidrocarburos"
  - type: surface_fees
    rate: "USD 24.000/año (exploración), USD 60.000/año (explotación) — uso de agua y materiales de construcción"
stability_guarantees:
  - mechanism: "Estabilidad tributaria en income tax y otros impuestos directos"
    coverage: "Disponible si se incluye en el contrato o en un convenio de protección de inversiones. Solo aplica a tasas y exenciones vigentes a la fecha de ejecución."
  - mechanism: "ICSID"
    note: "Ecuador readmitió el convenio ICSID en 2021 (gobierno Lasso). Antes (2017) había denunciado todos los BITs."
contract_types:
  - "Contrato de Participación (Production Sharing Contract — PSC modificado)"
  - "Contrato de Servicios Específicos (con EP Petroecuador)"
  - "Contrato de Servicios para Exploración y Explotación (con el Ministerio)"
transfer_of_title: "El Estado es dueño de todos los hidrocarburos (Constitución Art. 408). El contratista recibe participación en producción (PSC) o tarifa (Servicios)."
nOC_participation: "EP Petroecuador tiene derechos preferentes para upstream, midstream y downstream. Puede ceder áreas si no las ejerce. En la práctica, PSCs y Contratos de Servicio se licitan a privados."
ring_fencing: "SÍ. Cada contrato mantiene contabilidad independiente. Las pérdidas de un contrato NO pueden compensarse con ganancias de otro ni con otras actividades de la empresa. Propósito fiscal: cada contrato es una unidad independiente."
uncertainty_notes:
  - "El 'Margen Soberano' es un ajuste ex-post difícil de modelar sin datos específicos de cada contrato. Se calcula anualmente."
  - "IVA no reembolsable en PSC → costo adicional real de ~15% sobre bienes y servicios."
  - "Ring-fencing estricto impide optimización fiscal entre contratos — puede hacer que proyectos marginales sean inviables."
  - "Gobierno actual (Noboa, 2025-2026) ha mostrado interés en atraer inversión. Subasta de bloques prevista para 2026."
  - "Meta oficial: duplicar producción a 1 millón bpd. Requiere ~USD 12 mil millones de inversión."
  - "ICSID readmitido es señal positiva pero la historia de inestabilidad (denuncia de BITs en 2017) pesa en el riesgo-país."
references:
  - title: "Ley de Hidrocarburos (Ecuador)"
    url: "https://www.lexis.com.ec/"
    retrieved: 2026-05-11
  - title: "Chambers — Ecuador Oil & Gas Practice Guide 2025"
    url: "https://practiceguides.chambers.com/practice-guides/oil-gas-and-the-transition-to-renewables-2025/ecuador"
    retrieved: 2026-05-11
  - title: "Lexology — In review: oil and gas exploration and production in Ecuador (2022)"
    url: "https://www.lexology.com/library/detail.aspx?g=1932ac25-0275-434c-b319-1b3ca229cde4"
    retrieved: 2026-05-11
  - title: "Lexology — A general introduction to oil and gas law in Ecuador (2022)"
    url: "https://www.lexology.com/library/detail.aspx?g=fdfe6bde-82a6-49d5-85bf-652bad6ffaa7"
    retrieved: 2026-05-11
  - title: "GlobalData — Ecuador Upstream Fiscal and Regulatory Report"
    url: "https://www.globaldata.com/store/report/ecuador-upstream-fiscal-and-regulatory-report-intracampos-round-to-test-new-psa-terms/"
    retrieved: 2026-05-11
  - title: "Pérez Bustamante & Ponce — New transparency guidelines for royalties and profits (Jul 2025)"
    url: "https://www.pbplaw.com/en/publications/new-transparency-guidelines-for-royalties-and-profits-in-strategic-sectors/"
    retrieved: 2026-05-11
---

# Ecuador — Régimen Fiscal de Hidrocarburos

## Jerarquía normativa

1. **Constitución** (2008) — Art. 408: recursos naturales son propiedad inalienable del Estado
2. **Ley de Hidrocarburos** (1978, reformada en 2010, 2018 y noviembre 2021)
3. **Reglamento a la Ley de Hidrocarburos** (reformado febrero 2022)
4. **Reglamento de Operaciones Hidrocarburíferas** (reformado agosto 2021)
5. **Ley 40** — Planificación Integral de la Amazonía (2018)

## Dos tipos de contrato vigentes

### 1. Contrato de Participación (Production Sharing Contract — PSC)

- **Propiedad**: Estado retiene propiedad. Contratista recibe % de participación en la producción.
- **Riesgo**: 100% del contratista (inversión, costos, operación).
- **Ingreso del contratista**: Participación en producción × precio de referencia × volumen.
- **Deducciones**: Transporte, comercialización, Ley 40, 15% participación laboral, 25% income tax, Margen Soberano, impuesto de remesas.
- **Pago**: En efectivo o en especie (crudo).
- **Ring-fencing**: SÍ. Cada contrato es una unidad fiscal independiente.
- **IVA**: No reembolsable. Costo hundido adicional (~15%).

**Estructura fiscal (PSC):**
```
Valor de producción (precio venta × participación del contratista)
  ↓
Ingreso bruto del contratista
  ↓
(-) Costos de transporte y comercialización
(-) Ley 40 (Amazonía)
(-) 15% Participación laboral (3% empleados + 12% Estado)
  ↓
Utilidad antes de impuestos
  ↓
(-) 25% Income Tax
  ↓
Utilidad neta del contratista
  ↓
(-) Impuesto de remesas (si aplica)
  ↓
Margen Soberano: ajuste ex-post si contratista > Estado
```

### 2. Contrato de Servicios para Exploración y Explotación

- **Tarifa fija** por barril neto producido y entregado al Estado.
- **Margen Soberano**: 25% del ingreso bruto va al Estado automáticamente.
- 75% restante cubre: (1) costos de transporte y comercialización, (2) tarifa del contratista.
- Si no alcanza para cubrir la tarifa: **carry forward** (se acumula). Si al final del contrato no se compensó: NO se paga.
- **Contribución no reembolsable**: 1% del pago por servicios para I+D (desde inicio de producción).
- Algunos contratos ahora permiten pago en especie.

### Contratos Específicos con EP Petroecuador

- Contratos para obras/servicios específicos (no E&P integral).
- El contratista provee tecnología, capital, equipos.
- Recibe pago en efectivo (tarifa por barril).
- Petroecuador mantiene control operacional.

## El Margen Soberano

Mecanismo constitucional que garantiza que el Estado siempre reciba ≥50% de los beneficios totales:

```
Beneficio del Estado = Participación estatal en producción + TODOS los impuestos pagados por el contratista
Beneficio del Contratista = Participación en producción - impuestos

Si Beneficio Contratista > Beneficio Estado:
  → Se recalculan participaciones para restaurar equilibrio.
  → Cálculo anual, año siguiente al desbalance.
```

**Problema para modelar**: es un ajuste ex-post que depende de precios, costos y producción real. Hace que el contractor take sea un rango, no un punto.

## Carga fiscal total estimada

| Componente | PSC | Servicio (Ministerio) | Servicio (Petroecuador) |
|---|---|---|---|
| Participación producción | ~30-49% (contrato) | N/A | N/A |
| Margen Soberano | Ajuste ex-post | 25% automático | N/A |
| Income Tax | 25% | 25% | 25% |
| Participación laboral | 15% | 15% | 15% |
| IVA | 15% no reembolsable | 15% (facturado con tarifa) | Variable |
| **Contractor Take estimado** | **20-40%** | **15-35%** | **Tarifa fija** |

## Notas para el modelo DCF

- Ecuador es inherentemente más complejo de modelar que Perú o Colombia por el Margen Soberano y el ring-fencing.
- Modelar PSC y Contrato de Servicios como escenarios separados — estructuras fundamentalmente distintas.
- El ring-fencing es un factor subestimado: impide compensar pérdidas exploratorias entre bloques. Para una empresa con portafolio, esto aumenta el risk capital efectivo.
- El IVA no reembolsable en PSC es una carga real de ~15% sobre costos que pocos modelos capturan.
- La readmisión al ICSID (2021) y la reforma de 2021 son señales positivas, pero el historial de inestabilidad regulatoria sigue pesando.
- El gobierno actual busca atraer inversión para duplicar producción — puede haber mejores términos en nuevas rondas.
