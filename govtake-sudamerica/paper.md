# Government Take en Upstream de Hidrocarburos: Benchmark de Regímenes Fiscales en Nueve Países de América Latina (2024–2026)

> **Nota metodológica**: Durante la preparación de este documento se utilizó DeepSeek-V4 (OpenCode) para la búsqueda, recuperación y síntesis de fuentes legales, académicas y periodísticas. Todo dato numérico y referencia legal fue verificado contra la fuente original. El autor asume la responsabilidad total por el contenido.

## Abstract

Este estudio presenta un benchmark comparativo de los regímenes fiscales aplicables a la exploración y producción (E&P) de petróleo y gas natural en nueve países de América Latina: Argentina, Bolivia, Brasil, Colombia, Ecuador, Guyana, México, Perú y Trinidad y Tobago. Se recolectó y sistematizó la legislación fiscal vigente a mayo de 2026 para cada jurisdicción, identificando sus componentes (regalías, impuesto a la renta, participaciones especiales, impuestos a la exportación y mecanismos de estabilidad) y el orden de aplicación en el flujo de caja del contratista. Los resultados muestran una dispersión considerable en el *contractor take* estimado: desde aproximadamente 15% en Colombia bajo condiciones adversas hasta más de 85% en Guyana bajo el PSA 2016. Sin embargo, el indicador de *percentage take* —frecuentemente utilizado en comparaciones fiscales— presenta limitaciones metodológicas documentadas (Al-Harthy, 2010; Rapp et al., 1999). Este trabajo prioriza reportar la estructura fiscal completa de cada régimen, los rangos de *contractor take* bajo distintos escenarios de precio, y las fuentes de incertidumbre que impiden una estimación puntual precisa sin modelamiento de flujo de caja descontado. Se identifican los componentes fiscales que explican las mayores diferencias entre países y se documentan los mecanismos de estabilidad —o su ausencia— como factor determinante del riesgo regulatorio.

**Palabras clave**: government take, contractor take, regímenes fiscales, upstream, hidrocarburos, América Latina, regalías, producción compartida.

---

## Resumen Ejecutivo

Se relevó la legislación fiscal vigente a mayo de 2026 para la exploración y producción de petróleo y gas natural en nueve países. La tabla siguiente presenta el porcentaje del flujo de caja que retiene una empresa internacional después de pagar todos los gravámenes aplicables (regalías, impuesto a la renta, participaciones especiales y otros). Los valores son rangos estimados para un proyecto *onshore* convencional típico a precios de crudo de USD 70 por barril. La columna de «estabilidad» refleja si el marco fiscal está protegido contra cambios unilaterales del Estado durante la vida del proyecto.

| # | País | Contratista se queda con | Estabilidad fiscal | ¿Puede invertir un privado? |
|---|---|---|---|---|
| 1 | Guyana (PSA 2016) | ~85% | ✅ Blindada (Art. 32) | ✅ |
| 2 | Perú | 45–65% | ✅ Garantizada por ley | ✅ |
| 3 | Argentina (RIGI) | 55–65% | ✅ 30 años | ✅ (proyectos >USD 200M) |
| 4 | Argentina (sin RIGI) | 35–50% | ⚠️ Limitada | ✅ |
| 5 | Brasil (Concesión) | 40–60% | ✅ Contrato blindado | ✅ |
| 6 | Bolivia | 20–45%* | ⚠️ Nueva ley en debate | ✅ (CSP con YPFB) |
| 7 | Trinidad y Tobago | 20–40% | ✅ PSC blindado | ✅ |
| 8 | Brasil (PSC Pré-Sal) | 28–50% | ✅ Contrato blindado | ✅ (consorcio con Petrobras ≥30%) |
| 9 | Ecuador | 20–40% | ⚠️ Débil (Margen Soberano) | ✅ |
| 10 | Colombia | 15–35% | ❌ Sin garantías | ⚠️ Sin nuevas licencias desde 2022 |
| 11 | México | — | ❌ Cerrado a privados | ❌ Solo si PEMEX no quiere el área |

> \* El dato de Bolivia es el de menor certidumbre del estudio: los costos recuperables y las tablas de participación de YPFB no son públicos.

**Lectura de la tabla**:

- **Guyana** es un caso atípico —el contrato más favorable al inversor firmado en la región— y no es reproducible (el nuevo modelo PSA 2023 redujo el *contractor take* a ~55–70%).
- **Perú** y **Argentina con RIGI** son los destinos más competitivos para nueva inversión en 2026: combinan *contractor take* atractivo con estabilidad jurídica.
- **Colombia** es actualmente el país más hostil al inversor: sin nuevas licencias, con la tasa efectiva más alta de la región, y con reglas cambiadas por decreto de emergencia.
- **México** está efectivamente cerrado a la inversión privada en upstream tras la reforma de marzo de 2025.
- **Bolivia** es el país con mayor opacidad fiscal: la estructura de costos recuperables y la participación de YPFB no se publican de manera desagregada, lo que impide estimar el *contractor take* con precisión.

Los rangos reportados deben interpretarse con cautela. Un mismo país puede arrojar resultados muy distintos según el tipo de hidrocarburo (petróleo vs. gas), la ubicación (*onshore* vs. *offshore*), el volumen de producción y el precio internacional. La sección de Resultados (§3) desglosa estos factores para cada jurisdicción.

---

## 1. Introducción

La competencia por inversión en exploración y producción de hidrocarburos se ha intensificado en América Latina. Entre 2019 y 2025, al menos 72 países modificaron sus marcos fiscales petroleros, 62 de ellos en dirección pro-inversión (GeoExpro, 2025). En la región, Argentina implementó en 2024 el Régimen de Incentivo para Grandes Inversiones (RIGI) con estabilidad fiscal a 30 años; México revirtió en 2025 la apertura de 2013 y centralizó el sector en PEMEX; Colombia bajo el gobierno Petro congeló nuevas licencias exploratorias y elevó la carga tributaria efectiva al entorno del 50%; y Bolivia prepara una nueva ley de hidrocarburos cuyo contenido fiscal aún se desconoce.

En este contexto, la Cámara Boliviana de Hidrocarburos y Energía (CBHE) requiere un benchmark actualizado que permita comparar la competitividad fiscal de Bolivia frente a sus pares regionales desde la perspectiva del inversor internacional: ¿qué porcentaje del flujo de caja del proyecto queda en manos de la empresa después de todos los gravámenes?

La pregunta, aunque intuitiva, es metodológicamente compleja. La literatura especializada ha documentado que el *percentage take* —el indicador más difundido— no captura adecuadamente la sensibilidad a los precios del crudo, el tamaño del flujo de caja, ni la estructura temporal de los pagos al Estado (Al-Harthy, 2010). Rapp et al. (1999) propusieron el concepto de *discounted government take* para incorporar el efecto del *timing* de los pagos, y Smith (1987) introdujo el *True Government Take* (TGT) como indicador normalizador. Sin embargo, la producción de estas métricas requiere modelamiento de flujo de caja descontado con un campo hipotético único —ejercicio que excede el alcance del presente relevamiento.

Este documento ofrece, en cambio, un insumo previo y necesario: la sistematización estructurada de los componentes fiscales vigentes en cada país, los rangos estimados de *contractor take* que emergen de dicha estructura, y la identificación explícita de las fuentes de incertidumbre que limitan cualquier estimación puntual.

## 2. Metodología

### 2.1 Países incluidos

Se seleccionaron nueve países con actividad relevante de E&P en América Latina y el Caribe: Argentina, Bolivia, Brasil, Colombia, Ecuador, Guyana, México, Perú y Trinidad y Tobago. Venezuela fue excluida por la opacidad de su régimen fiscal bajo sanciones internacionales. Chile y Uruguay fueron excluidos por no tener producción comercial significativa de hidrocarburos.

### 2.2 Recolección de datos

Para cada país se relevaron las siguientes fuentes, en orden jerárquico:

1. Constitución Política (disposiciones sobre propiedad de recursos naturales)
2. Ley de Hidrocarburos o equivalente (régimen contractual, regalías, participación estatal)
3. Legislación tributaria (impuesto a la renta, sobretasas, retenciones, IVA)
4. Decretos reglamentarios y resoluciones administrativas
5. Modelos de contrato publicados por las agencias reguladoras
6. Guías legales de firmas internacionales (Chambers, Legal 500, Lexology)
7. Reportes financieros de operadores (SEC 20-F, reportes anuales)

8. **Contratos originales**: texto completo de *production sharing agreements*, concesiones y contratos de servicios depositados en ResourceContracts.org, repositorio del Natural Resource Governance Institute (NRGI), Columbia Center on Sustainable Investment (CCSI) y el Banco Mundial. Se consultaron 3.335 documentos de 107 países (ResourceContracts.org, 2026). Los países con mayor disponibilidad de contratos en la muestra son Guyana (36 documentos, incluyendo la serie completa de PSAs 1999-2025), Colombia (23+ PSAs de 2022), Ecuador (20+ documentos entre Contratos de Servicio y Licencias), y México (6 contratos de la era de apertura 2011-2018). Bolivia solo tiene contratos pre-2009; ningún CSP post-Constitución está depositado.

Cada referencia legal fue registrada con su número de norma, año, artículo pertinente, URL de consulta y fecha de recuperación, siguiendo el protocolo de reproducibilidad de Peng (2011).

### 2.3 Métricas reportadas

Para cada país se reportan:

- **Estructura fiscal**: lista completa de gravámenes con su tasa, base imponible, orden de aplicación y norma legal de respaldo.
- **Rango de *contractor take***: estimación del porcentaje del flujo de caja neto que retiene el contratista, calculado como `1 − (pagos totales al Estado / (ingresos brutos − costos totales))`. Se reporta como rango (mínimo-máximo) bajo escenarios de precio de crudo de USD 50, 70 y 90 por barril.
- **Mecanismos de estabilidad**: existencia, duración y cobertura de garantías de estabilidad fiscal, cambiaria y regulatoria.
- **Fuentes de incertidumbre**: limitaciones en los datos disponibles que impiden una estimación puntual precisa.

Las tasas del impuesto a la renta reportadas son las nominales. Las tasas efectivas pueden diferir debido a regímenes de depreciación acelerada, *tax credits*, limitaciones a la deducibilidad de regalías, precios de transferencia y *ring-fencing*. Estos factores se documentan cualitativamente en las notas de cada país.

### 2.4 Limitaciones

Este relevamiento no incluye modelamiento de flujo de caja descontado. Las estimaciones de *contractor take* son rangos informados por la estructura fiscal, no resultados de un modelo DCF con campo hipotético normalizado. La comparabilidad entre países está limitada por:

1. **Regalías ad valorem vs. regalías sobre utilidad**: un régimen con regalía del 12% sobre producción bruta y otro con regalía del 12% sobre utilidad neta no son equivalentes.
2. **Impuestos sobre producción bruta**: el IDH boliviano (32% sobre producción) y el Derecho Petrolero para el Bienestar mexicano (30% sobre valor bruto) son estructuralmente más gravosos que impuestos de tasa similar aplicados sobre utilidad.
3. ***Ring-fencing***: en Ecuador, cada contrato es una unidad fiscal independiente que no permite compensar pérdidas entre bloques. En Perú, Trinidad y Tobago, y Brasil, el *ring-fencing* es más laxo o inexistente.
4. **Tratados de doble imposición**: pueden reducir significativamente el *withholding tax* sobre dividendos y regalías. No fueron modelados individualmente.
5. **RIGI y regímenes especiales**: en Argentina, el RIGI aplica solo a proyectos que superen umbrales de inversión de USD 200–600 millones, excluyendo a operadores pequeños y medianos.

6. **Disponibilidad asimétrica de contratos**: mientras Guyana, Colombia, Brasil y Perú tienen contratos vigentes depositados en ResourceContracts.org, otros países —notablemente Bolivia y México— no han publicado sus contratos post-reforma en repositorios internacionales de transparencia. Esta asimetría introduce un sesgo de verificabilidad en los datos.

## 3. Resultados por país

### 3.1 Argentina

**Régimen**: Concesión. Propiedad del hidrocarburo extraído: contratista.

| Componente | Tasa | Base |
|---|---|---|
| Regalías | 12% | Producción en boca de pozo |
| Impuesto a las Ganancias | 25% (RIGI) / 35% (general) | Utilidad neta |
| Dividendos | 3.5% (RIGI, post-7 años) / 7% (general) | Distribución a no residentes |
| Derechos de exportación | 0% (RIGI, post-3er año) / 8% (general) | Valor FOB |
| IVA | 21% (crédito fiscal para exportación) | — |
| Débitos y créditos | 1.2% (100% deducible bajo RIGI) | Movimientos en cuenta |

**Estabilidad**: RIGI ofrece 30 años de estabilidad tributaria, aduanera y cambiaria, con arbitraje internacional (PCA, ICC o ICSID). Aplica a proyectos con inversión mínima de USD 200 millones (offshore), USD 600 millones (onshore nuevo desarrollo) o USD 300 millones (transporte y almacenamiento). Adhesión abierta hasta julio 2027 (Decreto 105/2026).

**Contractor take estimado**:

| Escenario | Precio bajo (USD 50) | Precio medio (USD 70) | Precio alto (USD 90) |
|---|---|---|---|
| Sin RIGI | 35–50% | 40–55% | 42–58% |
| Con RIGI | 55–68% | 58–70% | 55–65% |

**Fuentes**: Ley 27.742 (2024), Decreto 749/2024, Decreto 105/2026, Deloitte (2025), Rystad Energy (2025).

### 3.2 Bolivia

**Régimen**: Contrato de Servicios Petroleros (CSP). Propiedad del hidrocarburo extraído: YPFB (Estado).

| Componente | Tasa | Base |
|---|---|---|
| Regalía Departamental | 11% | Producción fiscalizada |
| Regalía Nacional Compensatoria | 1% | Producción fiscalizada |
| IDH | 32% | Producción fiscalizada |
| Participación YPFB | Variable (Anexo F de cada CSP) | Utilidad después de costos recuperables |
| IUE | 25% | Utilidad neta |

**Estabilidad**: Ley 767 (2015) otorga incentivos sobre regalías e IDH para nuevos proyectos exploratorios. El FPIEEH (12% del IDH) financia exploración. Una nueva Ley de Hidrocarburos se encuentra en fase de revisión del Ejecutivo (abril 2026), con posible impacto en todo el marco fiscal. YPFB es el único comercializador de hidrocarburos, lo que introduce opacidad en el *netback* real al productor.

**Contractor take estimado**: No es posible estimar con precisión. La literatura disponible y los datos públicos no permiten desagregar los costos recuperables por contrato ni las tablas de participación de YPFB. Un rango plausible, basado en la estructura de gravámenes sobre producción (44% entre regalías e IDH antes de costos), situaría el *contractor take* entre 20% y 45% según rentabilidad del campo, pero esta estimación debe tratarse con extrema cautela.

**Fuentes**: Ley 3058 (2005), Ley 767 (2015), Decreto Supremo 2830 (2016), El Deber (10/04/2026), YPFB (2025).

**Nota sobre transparencia contractual**: ResourceContracts.org, el repositorio de contratos extractivos más completo del mundo —administrado por el Natural Resource Governance Institute y la Universidad de Columbia—, contiene ocho contratos de servicios bolivianos firmados el 28 de octubre de 2006 entre YPFB y empresas como Repsol, BG Bolivia, Total E&P, Petrobras y PAE. Sin embargo, estos documentos corresponden al modelo de Contrato de Operación posterior a la nacionalización de 2006, no a los Contratos de Servicios Petroleros (CSP) exigidos por la Constitución de 2009. Ningún CSP vigente está depositado en este repositorio. Esta ausencia es en sí misma un indicador de opacidad fiscal: el principal instrumento de transparencia contractual global no tiene acceso a los contratos que rigen la explotación de hidrocarburos en Bolivia desde hace más de quince años.

### 3.3 Brasil

**Régimen**: Mixto. Concesión (Ley 9.478/1997) para áreas convencionales. Partilha de Produção/PSC (Ley 12.351/2010) para el Polígono do Pré-Sal y áreas estratégicas.

#### Régimen de Concesión

| Componente | Tasa | Base |
|---|---|---|
| Royalties | 5–15% (típico 10%) | Producción (precio de referencia ANP) |
| Participação Especial | 0–40% | Ingreso neto trimestral (campos de alto volumen) |
| IRPJ + CSLL | 25% + 9% = 34% | Lucro tributável |

#### Régimen de Partilha (PSC)

| Componente | Tasa | Base |
|---|---|---|
| Royalties | 15% (fijo) | Producción |
| Cost Oil | Recuperación total | CAPEX + OPEX + DECEX |
| Profit Oil para União | ~18–25% (determinado por licitación) | Producción − Royalties − Cost Oil |
| IRPJ + CSLL | 34% | Participación del contratista en Profit Oil |

**Estabilidad**: Contratos de concesión y partilha tienen fuerza de ley. El régimen REPETRO-SPED (Ley 13.586/2017) suspende tributos federales sobre importación de equipos para E&P. Petrobras tiene preferencia de operador en el Pré-Sal y participación mínima del 30%.

**Contractor take estimado**:

| Régimen | Precio bajo | Precio medio | Precio alto |
|---|---|---|---|
| Concesión | 35–55% | 40–60% | 45–65% |
| PSC Pré-Sal | 25–45% | 28–50% | 30–55% |

**Fuentes**: Lei 9.478/1997, Lei 12.351/2010, ANP Open Acreage PSC Model (2025), ANP Concession Contract Model (ResourceContracts.org, ocds-591adf-2290683076), Petrobras 20-F (2024), Legal 500 (2025).

### 3.4 Colombia

**Régimen**: Concesión (ANH). Propiedad del hidrocarburo: contratista.

**Contexto**: El gobierno de Gustavo Petro (2022–2026) suspendió el otorgamiento de nuevas licencias de exploración y elevó la carga fiscal del sector mediante la Ley 2277/2022 y el Decreto de Emergencia 1474/2025.

| Componente | Tasa | Base |
|---|---|---|
| Regalías | 8–25% (según volumen) | Producción |
| Impuesto a la Renta | 35% | Renta líquida |
| Sobretasa oil & gas | 5–15% (permanente) | Renta líquida > 50.000 UVT |
| Impuesto temporal extracción | 1% (solo 2026) | Valor FOB/venta |
| No deducibilidad de regalías | — (reduce base imponible para 2026) | — |
| Dividendos | 10% | Distribución a no residentes |
| Participación Producción (X%) | Variable (licitación ANH) | Producción |
| Precios Altos (windfall) | 30% del upside sobre precio base Po, activado al superar 5M barriles acumulados | WTI - Po |

**Estabilidad**: No existen garantías de estabilidad fiscal específicas para el sector. El Decreto 1474/2025 implementó por emergencia medidas que el Congreso había rechazado, lo cual fue citado por analistas legales como evidencia de riesgo regulatorio elevado (Castillo & Co, 2026). Los contratos estándar de la ANH (modelo 2022) establecen un período de producción de 24 años, prorrogable por períodos de 10 años; cada prórroga requiere la entrega de un 10% adicional de la producción de hidrocarburos líquidos livianos (o 5% para gas y crudos pesados) después de regalías (Anexo D, Cláusula D3; ANH Contrato LLA 141, ResourceContracts.org, ocds-591adf-3237738886).

El Anexo D del contrato estándar establece cinco componentes de Derechos Económicos: (D1) Valor Económico de Exclusividad (bono de firma); (D2) Canon Superficiario por uso del subsuelo (USD 0,1204/bbl + fees por hectárea); (D3) Participación Adicional en prórroga; (D4) Precios Altos — windfall tax graduado con fórmula Q = [(P−Po)/P] × S, donde S varía de 30% a 50% según el múltiplo del precio WTI sobre el precio base Po (Po ≈ USD 37,80/bbl para crudos >29° API); y (D5) Participación X = 2% de la producción total después de regalías (Anexo D, Cláusulas D1-D5; ANH, ocds-591adf-3237738886).

**Contractor take estimado**:

| Escenario | USD 50/bbl | USD 70/bbl | USD 90/bbl |
|---|---|---|---|
| Regalías deducibles, sin sobretasa plena | 30–45% | 28–42% | 25–40% |
| Regalías NO deducibles (2026), sobretasa 15% | 15–30% | 12–28% | 10–25% |

La ACP (Asociación Colombiana del Petróleo) advirtió en 2024 que la inversión exploratoria había caído un 57% desde la reforma de 2022 y que un aumento adicional de la sobretasa haría "inviable" la exploración (BNamericas, 2024).

**Fuentes**: Ley 2277/2022, Decreto 1474/2025, Castillo & Co (2026), BNamericas (2024), ICLG (2026). Contratos originales: 23 *production sharing agreements* colombianos de 2022 depositados en ResourceContracts.org (Parex Resources, Ecopetrol, Frontera Energy, Lewis Energy).

### 3.5 Ecuador

**Régimen**: Contratos de Participación (PSC) y Contratos de Servicios. Propiedad del hidrocarburo: Estado.

| Componente | Tasa | Base |
|---|---|---|
| Participación producción | ~30–49% (PSC) / Tarifa fija (Servicios) | Volumen × precio |
| Margen Soberano | Ajuste ex-post | Restaura equilibrio si contratista > Estado |
| Impuesto a la Renta | 25% | Utilidad neta |
| Participación laboral | 15% (3% empleados + 12% Estado) | Utilidad |
| IVA | 15% no reembolsable (PSC) | Bienes y servicios |

**Estabilidad**: Estabilidad tributaria disponible si se incluye en el contrato. Ecuador readmitió el ICSID en 2021. El *ring-fencing* es estricto: cada contrato es una unidad fiscal independiente, sin compensación de pérdidas entre bloques.

**Contractor take estimado**:

| Contrato | Precio bajo | Precio medio | Precio alto |
|---|---|---|---|
| PSC | 20–40% | 22–40% | 18–35% |
| Servicios (tarifa fija) | 15–35% | 15–35% | 12–30% |

La amplitud de los rangos se debe al Margen Soberano —un ajuste ex-post que depende de la producción, costos y precios reales— y al *ring-fencing*, que impide la optimización fiscal a nivel portafolio.

**Fuentes**: Ley de Hidrocarburos (reformada 2021), Chambers (2025), Lexology (2022, 2024), GlobalData (2018). Contratos originales: 20+ documentos en ResourceContracts.org, incluyendo Contratos de Servicio (Repsol YPF, Andes Petroleum, Enap Sipetrol, 2010-2012) y Licencias de Explotación/Exploración (PCR Ecuador, Gran Tierra Energy, 2024).

### 3.6 Guyana

**Régimen**: Production Sharing Agreement (PSA). Dos regímenes coexisten: el PSA 2016 para el Bloque Stabroek (ExxonMobil 45%, Hess/Chevron 30%, CNOOC 25%) y el Model PSA 2023 para nuevos bloques.

#### PSA 2016 — Stabroek Block

| Componente | Tasa | Base |
|---|---|---|
| Royalty | 2% | Todo petróleo producido y vendido |
| Cost Recovery | Hasta 75% de la producción | CAPEX + OPEX |
| Profit Oil Split | 50% Gobierno / 50% Contratista | Producción − Royalty − Cost Oil |
| Income Tax | 0% (pagado por el Estado) | — |
| Estabilidad | Art. 32: no renegociable sin consentimiento del contratista | Arbitraje internacional |

**Datos reales 2024**: De USD 17.9 mil millones exportados, USD 13.9 mil millones (77.7%) fueron a recuperación de costos. El Estado recibió USD 2.2 mil millones en *profit oil* y USD 348 millones en regalías. **Contractor take efectivo: 85.5%** (Bank of Guyana, 2025; Kaieteur News, 2026). La Guyana Revenue Authority (2022) confirmó que la regalía del 2% *no es recuperable como Cost Oil*, por lo que el take estatal del 14.5% (2% + 12.5% profit oil) es aditivo y no redundante.

#### Model PSA 2023

| Componente | Tasa |
|---|---|
| Royalty | 10% |
| Profit Oil Split | 50/50 |
| Income Tax | 10% (pagado por contratista) |

El Model PSA 2023 representa una mejora sustancial para el Estado respecto del PSA 2016, pero solo aplica a nuevos bloques. El Bloque S4 (*shallow water*) fue el primer contrato firmado bajo este modelo en noviembre 2025.

**Contractor take estimado**:

| Régimen | Contractor take |
|---|---|
| PSA 2016 (Stabroek, dato real 2024) | ~85% |
| Model PSA 2023 (estimado) | ~55–70% |

**Fuentes**: PSA 2016, Stabroek Block (ResourceContracts.org, ocds-591adf-1399550295; Stabroek News, 2017). PSAs actualizados 2020-2025 (ResourceContracts.org). Model PSA 2023 (Chambers, 2025). Datos de producción y recaudación: Bank of Guyana (2025), Kaieteur News (2026), OGGN (2025).

### 3.7 México

**Régimen**: Asignaciones estatales (PEMEX) + Contratos excepcionales. La reforma energética de marzo 2025 (Ley del Sector Hidrocarburos) revirtió la apertura de 2013.

| Componente | Tasa | Base |
|---|---|---|
| Derecho Petrolero para el Bienestar | 30% (petróleo) / 11.63% (gas no asociado) | Valor bruto extraído, SIN deducciones |
| ISR | 30% | Utilidad fiscal |
| Participación privada | PEMEX ≥40% en Desarrollo Mixto | — |

**Estabilidad/Apertura**: No hay rondas de licitación abiertas desde 2018. La reforma de 2025 limita la participación privada a "casos excepcionales" cuando PEMEX no tenga interés en el área. Los términos fiscales para privados se determinan caso por caso. PEMEX mantiene control operacional en todos los esquemas. La CNH y la CRE fueron extinguidas y reemplazadas por la CNE bajo control de SENER.

**Contractor take**: Para un IOC privado, la entrada al upstream mexicano está efectivamente cerrada. Para PEMEX, el concepto de *contractor take* no es aplicable por tratarse de una empresa 100% estatal que opera a pérdida y recibe financiamiento del presupuesto federal.

**Fuentes**: LSH (2025), LISH reformada (2025), Norton Rose Fulbright (2025), Mondaq (2025), Chambers (2025), GlobalData (2024). Contratos pre-reforma: PSC Shell-PEMEX aguas someras (CNH-R03-L01-G-CS-04/2018, ResourceContracts.org), Contratos de Servicio Schlumberger-PEP (2011), Asignación PEMEX Balam (2017). No existen contratos post-reforma 2025 en el repositorio.

### 3.8 Perú

**Régimen**: Concesión (Contrato de Licencia). Propiedad del hidrocarburo: transferida por PERUPETRO al contratista.

| Componente | Tasa | Base |
|---|---|---|
| Regalía | 5–20% (escala de producción o R-factor) | Producción fiscalizada |
| Impuesto a la Renta | 29.5% (30% con estabilidad) | Renta neta |
| Dividendos | 5% | Distribución a no residentes |
| IGV | 18% (devolución en exploración) | — |

**Estabilidad**: Garantizada contractualmente (Art. 63, Ley 26221). El régimen cambiario y tributario vigente a la fecha de suscripción permanece inalterable durante la vigencia del contrato. Sin restricciones a la repatriación de utilidades. Discriminación nula entre capital nacional y extranjero.

**Contractor take estimado**:

| Regalía baja (5%, campo pequeño) | Regalía alta (20%, campo grande) |
|---|---|
| 55–70% | 35–50% |

Perú es consistentemente identificado como uno de los regímenes más competitivos de la región (EY, 2024; KPMG, 2024; Cuatrecasas, 2025).

**Fuentes**: Ley 26221 (TUO 2005), DS 017-2003-EM, PERUPETRO (2024), EY (2024), Cuatrecasas (2025). Contrato original: Block XIX License Contract, BPZ Energy — PERUPETRO (ResourceContracts.org, ocds-591adf-4109359446).

### 3.9 Trinidad y Tobago

**Régimen**: Concesión (Tax/Royalty) + PSC (Modelo 2010). Propiedad del hidrocarburo: contratista (concesión) / compartida (PSC).

| Componente | Tasa | Base |
|---|---|---|
| Royalty | 12.5% (10–15%) | Valor de mercado del crudo y gas |
| Supplemental Petroleum Tax (SPT) | 0–55% (windfall sobre crudo) | Gross income − Royalty |
| Petroleum Profits Tax (PPT) | 50% (30% deepwater) | Chargeable profits |
| Unemployment Levy (UL) | 5% | Taxable profits |
| Investment Tax Credit | 20% (campos maduros, EOR) | Crédito contra SPT |

**Estabilidad**: El PSC modelo 2010 otorga estabilidad fiscal durante la vigencia del contrato. El Ministerio paga todos los impuestos del contratista (PPT, SPT, UL, royalty) desde su *Profit Petroleum* (Art. 21.5). El modelo PSC utiliza una **matriz de 5 tiers de producción × 4 clases de precio** para distribuir el *Profit Petroleum* entre el Gobierno y el contratista (Art. 18.14). Los parámetros de la matriz difieren según la profundidad del agua. En el modelo **onshore** (ResourceContracts.org, ocds-591adf-4370005060), la Clase D se activa a precios superiores a USD 40/bbl con la fórmula *GS = BR + 80% × [(P − $40)/P] × (1 − BR)*, y las clases de precio de gas son USD 1,50/2,75/4,00 por Mcf. En el modelo **deepwater** (MEEI, 2010), la Clase D se activa recién a USD 100/bbl con *GS = BR + 70% × [(P − $100)/P] × (1 − BR)*, y las clases de precio de gas son USD 4,00/6,50/8,00/9,00 por Mcf. El *cost recovery* ceiling es biddable (el modelo lo deja en blanco); fuentes secundarias reportan valores de 50/55/80% según profundidad (Newsday, 2022). Los costos de desarrollo se recuperan a 40% el primer año y 20% anual por 3 años (Art. 18.8). Government take estimado: 55–60% (Razack, SPE-180790).

**Contractor take estimado**:

| Tipo de proyecto | Precio bajo (USD 50) | Precio medio (USD 70) | Precio alto (USD 90) |
|---|---|---|---|
| Gas (sin SPT) | 40–55% | 40–55% | 40–55% |
| Crudo onshore (con SPT) | 30–45% | 20–35% | 10–25% |
| Crudo deepwater (PSC) * | 35–55% | 30–50% | 25–45% |

\* *Estimación preliminar. La matriz deepwater tiene umbrales de precio más altos (Clase D a partir de USD 100/bbl vs. USD 40/bbl en onshore), lo que sugiere un mayor contractor take a precios medios y altos.*

El SPT —que solo aplica a crudo, no a gas— es el componente de mayor impacto distributivo en el régimen de concesión. A precios de crudo superiores a USD 90/bbl, el SPT más el PPT pueden reducir el *contractor take* onshore a un solo dígito.

**Fuentes**: Petroleum Taxes Act (1974, mod. 2014), MEEI (2025), PwC Budget 2026, IRD (2025), Deloitte (2024). Contratos originales: Deep Onshore Model Production Sharing Contract (2006, ResourceContracts.org, ocds-591adf-4370005060), Deepwater Model PSC (MEEI, energy.gov.tt). Government take: Razack (2016), SPE-180790. Profit share por tier: T&T Gas Master Plan (2015), Newsday (2022).

---

### 3.10 Modelo de Flujo de Caja Descontado — Campo de Gas Natural

Para complementar el análisis cualitativo de estructuras fiscales con una comparación cuantitativa normalizada, se desarrolló un modelo de flujo de caja descontado (DCF) aplicando cada régimen fiscal a un campo hipotético de gas natural idéntico en los nueve países.

**Parámetros del campo hipotético**: 1.07 Tcf de reservas recuperables, producción pico de 200 MMcfd, 3 años de desarrollo, 3 años de rampa, 5 años de meseta y declinación Arps exponencial del 4% anual durante 20 años totales. CAPEX total de USD 750 millones (exploración USD 150M + desarrollo USD 600M). OPEX de USD 0.95 por Mcf. Tasa de descuento: 10% real. El modelo se ejecutó a tres precios de gas: USD 3.50/MMbtu (escenario bajo P90), USD 5.50/MMbtu (caso base P50) y USD 8.00/MMbtu (escenario alto P10).

**Resultados — Caso base P50 (USD 5.50/MMbtu)**:

| # | País | Contr. Take | Govt Take | NPV (USD M) | IRR |
|---|---|---|---|---|---|
| 1 | Argentina (RIGI) | 58.6% | 41.4% | $119 | 11.1% |
| 2 | Perú | 56.3% | 43.7% | $71 | 10.7% |
| 3 | México | 52.6% | 47.4% | −$6 | 9.9% |
| 4 | Guyana (PSA 2016) | 48.9% | 51.1% | $17 | 10.2% |
| 5 | Brasil (Concessão) | 47.0% | 53.0% | −$120 | 8.8% |
| 6 | Argentina (sin RIGI) | 46.7% | 53.3% | −$127 | 8.7% |
| 7 | Brasil (PSC Pré-Sal) | 41.0% | 59.0% | −$149 | 8.3% |
| 8 | Trinidad (PSC) | 40.0% | 60.0% | −$157 | 8.2% |
| 9 | Trinidad (Concesión) | 30.9% | 69.1% | −$451 | 5.1% |
| 10 | Colombia | 29.2% | 70.8% | −$451 | 4.8% |
| 11 | Ecuador | 24.1% | 75.9% | −$591 | 3.2% |
| 12 | Bolivia | 22.6% | 77.4% | −$622 | 2.8% |

**Hallazgos del modelo DCF**:

1. **Solo tres regímenes generan NPV positivo a USD 5.50/MMbtu**: Argentina con RIGI, Perú y Guyana. El campo hipotético no sería comercialmente viable bajo los regímenes de Bolivia, Ecuador, Colombia o Trinidad (Concesión) al precio base.

2. **El RIGI transforma la viabilidad del proyecto en Argentina**: el *contractor take* pasa de 46.7% a 58.6%, el NPV de −USD 127M a +USD 119M. El diferencial de 12 puntos porcentuales en el *contractor take* justifica económicamente los umbrales de inversión del régimen.

3. **Bolivia presenta el peor desempeño**: el IDH (32% sobre producción bruta) combinado con la regalía (11%) captura más del 77% del beneficio económico antes de que el contratista recupere su inversión. El NPV es negativo incluso a USD 8.00/MMbtu.

4. **El régimen de Guyana es más moderado en gas que en petróleo**: el *contractor take* del 48.9% contrasta con el ~85% reportado para petróleo crudo en el PSA 2016 (Sección 3.6). La diferencia se explica porque, a precios de gas más bajos que los del crudo, el *cost recovery* captura una proporción mayor del flujo de caja antes de llegar al *profit split*.

5. **Colombia empeora a precios altos**: a USD 8.00/MMbtu, el *contractor take* colombiano cae a 25.0% (vs. 29.2% a USD 5.50) debido a la activación de los Derechos Económicos por Precios Altos (Anexo D, Cláusula D4).

**Visualizaciones**: La Figura 1 (Contractor Take por país), Figura 2 (Sensibilidad al precio del gas), Figura 3 (Matriz de invertibilidad NPV vs. Contractor Take) y Figura 4 (Distribución del ingreso — waterfall) se presentan en el Anexo de este documento y en los archivos `analysis/chart1-4.png` del repositorio.

**Limitaciones del modelo**: (1) Las tasas de *cost recovery* en los PSC de Trinidad y Guyana son *biddable*: los valores reales dependen de cada licitación y los utilizados aquí (55% y 75% respectivamente) son estimaciones basadas en contratos modelo y fuentes secundarias. (2) La participación de YPFB en los CSP bolivianos no es pública; se estimó en 25% del ingreso neto. (3) El Margen Soberano de Ecuador (ajuste ex-post) no fue modelado dinámicamente. (4) No se incorporó *ring-fencing* por contrato, que en Ecuador y Colombia impediría compensar pérdidas entre bloques. (5) La tasa de descuento única del 10% no refleja el diferencial de riesgo-país entre jurisdicciones; Bolivia, Ecuador y Argentina deberían tener tasas más altas. (6) El OPEX se mantuvo constante en términos reales durante los 20 años del proyecto y no se modeló abandono ni descomisionamiento. Mejoras futuras deberían incorporar simulación de Monte Carlo con distribuciones de precio, *carryforward* de créditos fiscales, y curvas de declinación calibradas por tipo de *play* (convencional vs. no convencional vs. offshore).

---

## 4. Discusión

### 4.1 Dispersión regional

Los nueve países cubren prácticamente todo el espectro posible de *contractor take* en la industria petrolera global. En un extremo, Guyana bajo el PSA 2016 otorga al contratista aproximadamente el 85% del flujo de caja —un régimen que ha sido calificado como "uno de los peores contratos jamás vistos" por el propio gobierno guyanés (DPI, 2025). En el otro extremo, Colombia bajo las políticas del gobierno Petro y México bajo la reforma de 2025 presentan cargas fiscales que, en escenarios adversos, dejan al contratista con menos del 15% del flujo de caja —o directamente impiden su entrada.

### 4.2 El problema del *percentage take*

Los rangos reportados en este estudio ilustran la limitación fundamental del *percentage take* como métrica de comparación. Trinidad y Tobago, con una tasa nominal de PPT+UL del 55%, podría parecer más gravoso que Perú con su 29.5% de impuesto a la renta. Sin embargo, las *capital allowances* trinitarias, el *investment tax credit* del 20%, y la deducibilidad de regalías reducen la carga efectiva de manera sustancial. En contraste, el IDH boliviano del 32% y el Derecho Petrolero para el Bienestar mexicano del 30% se aplican sobre el valor bruto de producción, sin admitir deducciones —lo que los convierte en gravámenes estructuralmente más pesados que impuestos sobre utilidad de tasa nominal superior.

Esto es consistente con la advertencia de Al-Harthy (2010): el *percentage take* no captura la sensibilidad a los precios, el tamaño del flujo de caja, ni la interacción entre componentes fiscales. Dos países pueden tener el mismo *contractor take* nominal y perfiles de riesgo radicalmente diferentes.

### 4.3 Estabilidad como *upside* fiscal implícito

Un hallazgo transversal de este relevamiento es que la estabilidad fiscal —o su ausencia— actúa como un componente implícito del *contractor take*. Regímenes con cargas nominales moderadas pero inestabilidad regulatoria (Ecuador, Colombia) pueden ser menos atractivos que regímenes con cargas más altas pero contractualmente blindadas (Trinidad PSC, Perú, Guyana PSA 2016). El caso argentino es particularmente ilustrativo: el RIGI ofrece una carga fiscal reducida (25% de income tax) *a cambio* de compromisos de inversión de largo plazo y estabilidad de 30 años. Es un modelo de "contrato fiscal" que otros países de la región —incluido Bolivia— podrían considerar como referencia de política pública.

### 4.4 Bolivia en el contexto regional

Bolivia presenta el caso de mayor opacidad fiscal entre los nueve países relevados. Mientras que Brasil publica los modelos de contrato de PSC y concesión en el sitio web de la ANP, Perú detalla las metodologías de regalía en normas de acceso público, y Guyana —a pesar de las críticas— tiene su PSA 2016 disponible para consulta, en Bolivia los Contratos de Servicios Petroleros no publican de manera desagregada los costos recuperables ni las tablas de participación de YPFB (Anexo F de cada contrato). La Ley 3740 de 2007 obliga a YPFB a publicar semestralmente esta información; su cumplimiento es irregular (Energía Bolivia, 2025).

Esta opacidad representa un costo fiscal implícito para el país: un inversor que no puede modelar su *contractor take* con certidumbre razonable exigirá una tasa de retorno más alta —o simplemente invertirá en otra jurisdicción. La nueva Ley de Hidrocarburos en debate (abril 2026) representa una oportunidad para corregir esta deficiencia estructural.

### 4.5 Limitaciones

Este estudio tiene al menos cuatro limitaciones que deben ser explicitadas:

1. **Estimaciones sin modelo DCF**: los rangos de *contractor take* reportados son estimaciones basadas en la estructura fiscal, no resultados de un modelo de flujo de caja descontado con un campo hipotético normalizado. La magnitud de la incertidumbre varía por país: es baja para Guyana (datos reales públicos), media para Perú, Brasil y Trinidad, alta para Argentina (dualidad de regímenes) y Ecuador (Margen Soberano ex-post), y extrema para Bolivia (datos no públicos).

2. **Estructura de costos no modelada**: el *contractor take* depende críticamente de la relación CAPEX/OPEX/ingresos. Campos de alto costo (offshore profundo, no convencional) tienen una distribución diferente de la carga fiscal que campos de bajo costo (onshore convencional). Este estudio no controla por estructura de costos.

3. **Tratados de doble imposición**: las tasas de *withholding tax* sobre dividendos, intereses y regalías pueden reducirse significativamente mediante tratados bilaterales. Estas reducciones no fueron modeladas.

4. **Horizonte temporal**: los datos de este relevamiento corresponden a mayo de 2026. Varios países se encuentran en procesos de reforma legislativa (Bolivia, Colombia ante posible cambio de gobierno, Argentina con la extensión del RIGI). Las conclusiones de este estudio pueden perder vigencia en el corto plazo.

---

## 5. Conclusión

El panorama fiscal del upstream de hidrocarburos en América Latina en 2026 es de dispersión extrema. Perú ofrece el régimen más competitivo y predecible para el inversor, con un *contractor take* estimado del 45–70% y estabilidad contractual garantizada. Guyana bajo el PSA 2016 representa un *outlier* histórico —posiblemente el contrato más favorable al IOC jamás firmado en la región— cuyo *contractor take* real del 85% probablemente no se repetirá bajo el Model PSA 2023. Argentina, con el RIGI, introdujo la innovación fiscal más relevante de la década: un "contrato fiscal" que reduce la carga tributaria a cambio de inversión de largo plazo y estabilidad de 30 años.

En el otro extremo, Colombia y México representan modelos de repliegue estatal. Colombia bajo el gobierno Petro alcanzó una tasa efectiva de tributación cercana al 50% con regalías no deducibles, mientras el congelamiento de nuevas licencias compromete la sostenibilidad de largo plazo del sector. México, con la reforma de 2025, cerró efectivamente el upstream a la inversión privada y consolidó a PEMEX como monopolio estatal de facto.

Bolivia ocupa una posición única —y preocupante— en este panorama: es el único país donde el *contractor take* no puede ser estimado con razonable precisión a partir de fuentes públicas. La combinación de un régimen de CSP con costos recuperables opacos, tablas de participación no públicas, y YPFB como único comercializador, crea un velo de incertidumbre que constituye, en sí mismo, una barrera a la inversión. La nueva Ley de Hidrocarburos en debate ofrece una ventana de oportunidad para transparentar el régimen fiscal y alinearlo con los estándares de comparabilidad regional.

La disponibilidad asimétrica de contratos en repositorios internacionales de transparencia es un hallazgo colateral de este estudio. Mientras Guyana, Colombia, Brasil y Perú han depositado sus contratos petroleros vigentes en ResourceContracts.org, Bolivia no ha publicado un solo CSP post-2009 en este repositorio. La nueva Ley de Hidrocarburos en debate representa una oportunidad para corregir no solo el diseño fiscal, sino también el déficit de transparencia contractual que este benchmark documenta.

Más allá de Bolivia, la matriz de disponibilidad contractual en ResourceContracts.org revela un gradiente de transparencia en la región. Guyana, Colombia, Ecuador y Brasil han depositado contratos vigentes —algunos en serie temporal, permitiendo análisis de evolución contractual— mientras que México solo transparentó durante la breve ventana de apertura 2013-2018 y cesó por completo tras la reforma de 2025. Trinidad y Tobago ha depositado dos documentos contractuales, ambos modelos sin datos de proyecto. Argentina no tiene contratos de la era Vaca Muerta ni del RIGI en el repositorio.

El modelo DCF (Sección 3.10) cuantifica estas diferencias: a USD 5.50/MMbtu, solo tres de los doce regímenes analizados —Argentina con RIGI, Perú y Guyana— generan valor actual neto positivo para el contratista. Los regímenes más gravosos (Bolivia, Ecuador, Trinidad Concesión) destruyen entre USD 450 y USD 620 millones de valor en el mismo campo hipotético. La diferencia entre el régimen más favorable (Argentina RIGI: 58.6% *contractor take*, NPV +USD 119M) y el más oneroso (Bolivia: 22.6% *contractor take*, NPV −USD 622M) es de 36 puntos porcentuales de *contractor take* y USD 741 millones de valor presente neto —magnitudes que determinan si un proyecto avanza o se cancela.

El modelo DCF tiene limitaciones metodológicas significativas detalladas en la Sección 3.10. En particular: las tasas de *cost recovery* en PSCs son biddables y varían por contrato; la participación de YPFB no es pública; el Margen Soberano ecuatoriano y el *ring-fencing* no fueron modelados dinámicamente; y la tasa de descuento única no captura el diferencial de riesgo-país. Estas limitaciones no invalidan la dirección de los resultados pero sí su precisión puntual. Investigación futura deberá incorporar simulación de Monte Carlo, curvas de declinación calibradas por tipo de *play*, y modelamiento del *carryforward* de créditos fiscales y pérdidas tributarias.

Investigación futura deberá incorporar simulación de Monte Carlo con distribuciones de precio, curvas de declinación calibradas por tipo de *play*, *carryforward* de créditos fiscales y pérdidas tributarias, y tasas de descuento diferenciadas por riesgo-país. El código del modelo DCF (Python) y los datos de entrada están disponibles en el repositorio del proyecto (`analysis/dcf_gas_model.py`).

---

## Referencias

Al-Harthy, M. H. (2010). Pitfalls of percentage take metric for assessment of petroleum fiscal regimes. *International Journal of Sustainable Society*, 2(4), 404–419. https://doi.org/10.1504/IJSSOC.2010.036943

BNamericas. (2024, 11 de diciembre). Colombia tax bill 'unviable' for oil sector, industry group warns. https://www.bnamericas.com/en/news/colombia-tax-bill-unviable-for-oil-sector-industry-group-warns

Castillo & Co. (2026, 14 de abril). Oil & Gas Colombia 2026: A Guide for US Energy Multinationals. https://castilloncompany.com/pages/journal-oil-gas-colombia.html

Chambers and Partners. (2025). Oil & Gas Global Practice Guides: Argentina, Brazil, Ecuador, Guyana, Mexico, Peru. https://practiceguides.chambers.com/

Decreto 105/2026. (2026, 19 de febrero). Ampliación del Régimen de Incentivo para Grandes Inversiones. *Boletín Oficial de la República Argentina*.

Decreto Supremo 2830. (2016). Reglamento a la Ley N° 767 de Promoción para la Inversión en Exploración y Explotación Hidrocarburífera. *Gaceta Oficial de Bolivia*.

Deloitte. (2025, 25 de febrero). Argentina oil and gas: Vaca Muerta energy sector boom. *Deloitte Insights*. https://www.deloitte.com/us/en/insights/topics/economy/americas/vaca-muerta-argentina-energy-sector-boom.html

DPI Guyana. (2025, 3 de julio). Playing with fire: The hidden cost of unilaterally renegotiating the 2016 PSA. Department of Public Information, Government of Guyana. https://dpi.gov.gy/playing-with-fire-the-hidden-cost-of-unilaterally-renegotiating-the-2016-psa/

El Deber. (2026, 10 de abril). Nueva ley de hidrocarburos en su fase final se alista para debate legislativo. https://eldeber.com.bo/economia/nueva-ley-hidrocarburos-fase-final-alista-debate-legislativo_1775832764

Energía Bolivia. (2025). Dossier: Contratos de Exploración y Explotación de Hidrocarburos en Bolivia. https://energiabolivia.com/especiales/dossier/14023-contratos-de-exploracion-y-explotacion-de-hidrocarburos-en-bolivia

EY. (2024). Peru's Energy Investment Guide 2024/2025. Ernst & Young. https://www.ey.com/es_pe/insights/energy-resources

GeoExpro. (2025, 25 de agosto). Global trends in petroleum fiscal terms: A race to the top? https://geoexpro.com/global-trends-in-petroleum-fiscal-terms-a-race-to-the-top/

Guyana Revenue Authority. (2022, 22 de septiembre). Royalty Payments to Guyana Government. https://www.gra.gov.gy/royalty-payments-to-guyana-government/

Kaieteur News. (2026, 30 de enero). Exxon gave Guyana 32M of 260M barrels of oil produced in 2025. https://kaieteurnewsonline.com/2026/01/30/exxon-gave-guyana-32m-of-260m-barrels-of-oil-produced-in-2025/

Ley 9.478. (1997). Lei do Petróleo. *Diário Oficial da União*, Brasil.

Ley 12.351. (2010). Lei do Pré-Sal. *Diário Oficial da União*, Brasil.

Ley 27.742. (2024). Ley de Bases y Puntos de Partida para la Libertad de los Argentinos. *Boletín Oficial de la República Argentina*.

Ley 2277. (2022). Reforma Tributaria para la Igualdad y la Justicia Social. *Diario Oficial*, Colombia.

Ley 26221. (1993). Ley Orgánica de Hidrocarburos. *Diario Oficial El Peruano* (texto único ordenado, Decreto Supremo 042-2005-EM).

Ley 3058. (2005). Ley de Hidrocarburos. *Gaceta Oficial de Bolivia*.

Ley 767. (2015). Ley de Promoción para la Inversión en Exploración y Explotación Hidrocarburífera. *Gaceta Oficial de Bolivia*.

Ley del Sector Hidrocarburos. (2025, 18 de marzo). *Diario Oficial de la Federación*, México.

Norton Rose Fulbright. (2025). Energy reform: The new regulation for the Hydrocarbons Sector in Mexico. https://www.nortonrosefulbright.com/en/knowledge/publications/ccce965e/energy-reform-the-new-regulation-for-the-hydrocarbons-sector-in-mexico

Oil & Gas Governance Network. (2025, 14 de junio). The Four-to-One Formula: How Guyana's 50-50 Oil Deal Turns into a Mathematical Impossibility. https://www.oggn.org/2025/06/14/the-four-to-one-formula-how-guyanas-50-50-oil-deal-turns-into-a-mathematical-impossibility/

Peng, R. D. (2011). Reproducible research in computational science. *Science*, 334(6060), 1226–1227. https://doi.org/10.1126/science.1213847

Rapp, W. J., Litvak, B. L., Kokolis, G. P., & Wang, B. (1999). Utilizing Discounted Government Take Analysis for Comparison of International Oil and Gas E&P Fiscal Regimes. *SPE Hydrocarbon Economics and Evaluation Symposium*, SPE-52958. https://doi.org/10.2118/52958-MS

Rystad Energy. (2025). Argentina fiscal scheme creates opportunity for more Vaca Muerta rig activity. https://www.rystadenergy.com/insights/argentina-fiscal-scheme-creates-opportunity-for-more-vaca-muerta-rig-activity

Smith, D. E. (1987). True Government Take (TGT): A Measurement of Fiscal Terms. *SPE Hydrocarbon Economics and Evaluation Symposium*, SPE-16308. https://doi.org/10.2118/16308-MS

Vargas, J. C., & Quintana, S. (2015). Competitive Analysis of Latin American Oil and Gas Fiscal Regimes. *SPE Latin American and Caribbean Petroleum Engineering Conference*, SPE-177173. https://doi.org/10.2118/177173-MS

Wood Mackenzie. (2025). Regional fiscal benchmarking: Latin America Report. https://www.woodmac.com/reports/upstream-oil-and-gas-regional-fiscal-benchmarking-latin-america-150419923/

ResourceContracts.org. (2026). *Online repository of petroleum and mining contracts*. Natural Resource Governance Institute, Columbia Center on Sustainable Investment, World Bank, Open Oil, African Legal Support Facility. https://resourcecontracts.org/

Razack, J. (2016). Trinidad and Tobago's Current Deepwater Campaign: Implications of the Contractual Obligations and Taxation Regime. *SPE Trinidad and Tobago Energy Conference and Exhibition*, SPE-180790. https://doi.org/10.2118/180790-MS

---

*Documento elaborado en mayo de 2026. Las referencias legales corresponden a la normativa vigente a la fecha de consulta. Se recomienda verificar posibles modificaciones posteriores.*
