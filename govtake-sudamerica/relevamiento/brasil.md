---
country: brasil
fiscal_regime_type: mixed (concession + production_sharing)
regulatory_authority: "ANP (Agência Nacional do Petróleo, Gás Natural e Biocombustíveis) + PPSA (Pré-Sal Petróleo S.A.) + CNPE (Conselho Nacional de Política Energética)"
last_updated: 2026-05-11
data_retrieval_date: 2026-05-11
confidence: high
fiscal_components:
  - type: royalty_concession
    rate: "5% a 15% (típicamente 10%), definido por ANP según riesgo geológico y productividad. Resolución ANP 853/2021 permite reducción a 5% para pequeñas empresas."
    legal_basis:
      - law: "Lei 9.478/1997 (Lei do Petróleo)"
        year: 1997
        article: "Art. 45-51"
        status: vigente
  - type: royalty_psc
    rate: "15% sobre valor de la producción"
    legal_basis:
      - law: "Lei 12.351/2010 (Lei do Pré-Sal)"
        year: 2010
        article: "Art. 42"
        status: vigente
  - type: special_participation
    rate: "0% a 40% sobre receita líquida trimestral (campos de grande volume). Deducciones: regalías, investimentos exploratórios, custos operacionais, depreciação, tributos."
    legal_basis:
      - law: "Lei 9.478/1997"
        year: 1997
        article: "Art. 50"
        status: vigente
      - law: "Decreto 2.705/1998"
        year: 1998
  - type: signature_bonus
    rate: "Valor fixo por bloco, definido no edital de licitação"
    legal_basis:
      - law: "Lei 9.478/1997"
        year: 1997
      - law: "Lei 12.351/2010"
        year: 2010
        article: "Art. 42"
  - type: profit_oil_share
    rate: "Determinado por licitação — vence quem oferece maior % de excedente em óleo para a União"
    legal_basis:
      - law: "Lei 12.351/2010"
        year: 2010
        article: "Art. 2(III), 18, 29(VII)"
        status: vigente
  - type: irpj
    rate: "25% (15% IRPJ + 10% adicional sobre lucro > R$240mil/ano)"
    legal_basis:
      - law: "Lei 9.249/1995"
        year: 1995
  - type: csll
    rate: "9% sobre lucro líquido"
    legal_basis:
      - law: "Lei 7.689/1988"
        year: 1988
  - type: withholding_tax
    rate: "15% (remessas ao exterior); 0% (dividendos a residentes)"
    legal_basis:
      - law: "Lei 9.249/1995"
        year: 1995
  - type: repetro_sped
    rate: "Suspensão/isencão de tributos federais (II, IPI, PIS, COFINS) e redução de ICMS estadual na importação/admissão temporária de bens para E&P"
    legal_basis:
      - law: "Lei 13.586/2017"
        year: 2017
      - law: "Decreto 9.128/2017"
        year: 2017
  - type: surface_fee
    rate: "Taxa de ocupação/retenção de área (blocos onshore)"
    legal_basis:
      - law: "Lei 9.478/1997"
        year: 1997
  - type: landowner_payment
    rate: "0.5% a 1% da produção (onshore)"
    legal_basis:
      - law: "Lei 9.478/1997"
        year: 1997
        note: "Pagamento a proprietários de terra"
stability_guarantees:
  - mechanism: "Cláusulas contratuais de estabilidade"
    coverage: "Contratos de concessão e partilha têm força de lei entre as partes"
  - mechanism: "REPETRO-SPED"
    coverage: "Suspensão de tributos na importação de equipamentos para E&P. Fundamental para viabilidade econômica de projetos offshore."
contract_types:
  - "Concessão (Concession): Lei 9.478/1997 — contratação via ANP, critério: maior bônus de assinatura"
  - "Partilha de Produção (PSC): Lei 12.351/2010 — Pré-Sal e áreas estratégicas, critério: maior % de excedente em óleo para União"
  - "Cessão Onerosa (Transfer of Rights): Lei 12.276/2010 — contratação direta Petrobras, até 5 bilhões BOE"
transfer_of_title: "Concessão: contratista é dono do petróleo extraído. PSC: propriedade compartilhada entre contratista e União."
nOC_participation: "Petrobras: mínimo 30% nos consórcios de PSC, preferência para operar. PPSA representa União nos consórcios (non-operating partner)."
cost_recovery_psc: "Cost Oil: contratista recupera CAPEX, OPEX e DECEX. Créditos fiscais não utilizáveis são reconhecidos como Cost in Oil (Cláusula 8.2 do modelo PSC 2025)."
uncertainty_notes:
  - "Modelo de PSC atualizado em maio 2025 (ANP Open Acreage). Royalty fixo em 15%, sem alteração relevante."
  - "Petrobras preferência de operador no Pré-Sal é garantida por lei, mas pode declinar (CNPE decide se faz licitação ou contratação direta)."
  - "Decommissioning: PSC exige fundo de descomissionamento com aportes definitivos (não reembolsáveis se gasto real for menor). Concessão: provisão contábil, dedutível só no desembolso."
  - "Profit oil share varia por licitação — referência histórica: 18-25% para União em rodadas recentes."
references:
  - title: "Lei 9.478/1997 — Lei do Petróleo"
    url: "https://www.planalto.gov.br/ccivil_03/leis/l9478.htm"
    retrieved: 2026-05-11
  - title: "Lei 12.351/2010 — Lei do Pré-Sal (Produção Sharing)"
    url: "https://www.planalto.gov.br/ccivil_03/_ato2007-2010/2010/lei/l12351.htm"
    retrieved: 2026-05-11
  - title: "ANP — Modelo de Contrato de Partilha de Produção (maio 2025)"
    url: "https://www.gov.br/anp/en/rounds-anp/open-acreage/oaps/opp-edital-e-contratos-em-ingles/contrato-opp-com-br-ingles.pdf"
    retrieved: 2026-05-11
  - title: "ANP — Tender Protocol Open Acreage PSC (out 2025)"
    url: "https://www.gov.br/anp/en/rounds-anp/open-acreage/oaps/tender-protocol"
    retrieved: 2026-05-11
  - title: "Legal 500 — Brazil Energy Oil & Gas Country Comparative Guide (2025)"
    url: "https://www.legal500.com/guides/chapter/brazil-energy-oil-gas"
    retrieved: 2026-05-11
  - title: "Chambers — Brazil Oil & Gas Practice Guide (2025)"
    url: "https://practiceguides.chambers.com/practice-guides/comparison/908/16771/"
    retrieved: 2026-05-11
  - title: "Petrobras 20-F SEC Filing (2024) — Government take detail"
    url: "https://www.sec.gov/Archives/edgar/data/1119639/000129281425003317/ex2-01.htm"
    retrieved: 2026-05-11
---

# Brasil — Régimen Fiscal de Hidrocarburos

## Jerarquía normativa

1. **Constituição Federal** (1988) — Art. 20, 176-177: União é proprietária dos recursos
2. **Lei 9.478/1997** (Lei do Petróleo) — Regime de concessão, criação ANP e CNPE
3. **Lei 12.351/2010** (Lei do Pré-Sal) — Regime de partilha de produção, criação PPSA
4. **Lei 12.276/2010** — Cessão Onerosa (Transfer of Rights) para Petrobras
5. **Lei 13.586/2017** — REPETRO-SPED (regime aduaneiro e tributário especial)
6. **Resolução ANP 969/2024** — Procedimentos para licitações de concessão e partilha

## Dois regimes em operação

### Regime de Concessão (Lei 9.478/1997)

Aplicável a áreas onshore e offshore fora do Polígono do Pré-Sal.

**Estrutura de government take:**
```
Receita bruta (preço de referência ANP × volume)
  ↓
1. Royalties: 5-15% (média 10%)
  ↓
2. Participação Especial (campos de grande volume):
   Base = Receita líquida trimestral
   Deduções: royalties + investimentos exploratórios + custos operacionais
            + depreciação + tributos
   Alíquota progressiva: 0-40% (varia por localização, anos de produção, volume)
  ↓
3. Taxa de ocupação/retenção de área
  ↓
4. IRPJ (25%) + CSLL (9%) = 34% sobre lucro tributável
```

### Regime de Partilha de Produção (Lei 12.351/2010)

Aplicável ao Polígono do Pré-Sal e áreas estratégicas definidas pelo CNPE.

**Estrutura do PSC:**
```
Produção total
  ↓
1. Royalties: 15% (fixo)
  ↓
2. Cost Oil: Recuperação de custos (CAPEX + OPEX + DECEX)
   - Sem limite explícito de % (o edital é que define)
   - Créditos fiscais não utilizáveis → reconhecidos como Cost Oil (Cláusula 8.2)
  ↓
3. Profit Oil = Produção - Royalties - Cost Oil
   - Compartilhado entre União (PPSA) e Consórcio
   - % definido por licitação (vence maior oferta para União)
  ↓
4. IRPJ (25%) + CSLL (9%) = 34% sobre participação do contratista
```

## Componentes fiscais detalhados

### Royalties
| Regime | Alíquota | Observação |
|---|---|---|
| Concessão | 5-15% | ANP define por campo. Res. 853/2021: 5% pequenas, 7.5% médias empresas |
| Partilha | 15% | Fixo para todos os contratos de PSC |

### Participação Especial (apenas Concessão)
- Aplica-se a campos com grande volume de produção
- Alíquota progressiva: 0% (produção baixa) → 40% (produção muito alta)
- Base trimestral: receita líquida - deduções (royalties, custos, depreciação, tributos)
- ~12 campos da Petrobras pagaram PE em 2024 (Barracuda, Jubarte, Marlim, Tupi, etc.)

### REPETRO-SPED
- Suspensão de tributos federais (II, IPI, PIS, COFINS) na importação temporária de equipamentos E&P
- Redução de ICMS estadual
- Essencial para viabilidade de projetos offshore de alto CAPEX

### Bônus de Assinatura
- Concessão: maior bônus vence a licitação
- PSC: bônus fixo definido em edital (ex: Libra/2013: R$15 bilhões)

## Carga fiscal total

| Componente | Concessão | Partilha (PSC) |
|---|---|---|
| Royalties | 5-15% | 15% |
| Participação Especial | 0-40% | N/A |
| Profit Oil para União | N/A | ~18-25% (licitação) |
| IRPJ + CSLL | 34% | 34% |
| **Government Take efetivo estimado** | **40-65%** | **55-75%** |

## Notas para o modelo DCF

- Modelar concessão e PSC como cenários separados — estruturas radicalmente diferentes
- PSC: o % de profit oil para a União é determinado em licitação e varia. Usar 18-25% como range.
- REPETRO-SPED reduz significativamente o CAPEX efetivo. Sem ele, projetos offshore seriam inviáveis.
- Cost Oil no PSC: sem limite explícito de %, mas sujeito a auditoria da ANP/PPSA.
- Petrobras tem preferência de operador e mínimo 30% de participação no PSC — isso dá controle operacional ao Estado.
- O "surplus" da Cessão Onerosa (Atapu, Búzios, Itapu, Sépia) já foi licitado sob PSC em 2019.
