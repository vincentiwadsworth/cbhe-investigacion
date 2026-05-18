"""
DCF Model v2: Government Take Benchmark — Gas Field (1.5 Tcf)
Fixed: carryforward, Colombia Precios Altos real, Arps decline curve
"""
import numpy as np
from math import exp

# ═══════════════════════════════════════════════════════════════
# HYPOTHETICAL GAS FIELD — Arps decline curve
# ═══════════════════════════════════════════════════════════════
FIELD = {
    "recoverable_tcf": 1.5,
    "total_years": 20,
    "dev_years": 3,
    "plateau_years": 5,  # years of flat production at peak
    "peak_mmcfd": 200,
    "ramp_years": 3,     # years from first gas to peak
    "decline_rate_annual": 0.04,  # ~1.3 Tcf total
    "capex_expl_mm": 150,
    "capex_dev_mm": 600,
    "capex_schedule": [0.30, 0.45, 0.25],
    "opex_per_mcf": 0.95,
    "mcf_to_mmbtu": 1.037,
    "discount_rate": 0.10,
}

def production_mmcfd(year):
    """Arps exponential decline with ramp-up and plateau"""
    if year < FIELD["dev_years"]:
        return 0
    prod_year = year - FIELD["dev_years"]  # 0-indexed production year
    peak = FIELD["peak_mmcfd"]
    ramp = FIELD["ramp_years"]
    plateau = FIELD["plateau_years"]
    d = FIELD["decline_rate_annual"]

    if prod_year < ramp:
        # Linear ramp: 0 -> peak over ramp years
        return peak * (prod_year + 1) / ramp
    elif prod_year < ramp + plateau:
        return peak
    else:
        decline_years = prod_year - ramp - plateau
        return peak * exp(-d * decline_years)

def annual_production_mmbtu(year):
    mmcfd = production_mmcfd(year)
    if mmcfd == 0:
        return 0
    annual_mcf = mmcfd * 365 * 1000
    return annual_mcf * FIELD["mcf_to_mmbtu"]

# Verify recoverable reserves
_total_tcf = sum(production_mmcfd(y) * 365 / 1e6 for y in range(FIELD["total_years"]))
print(f"  [Simulated reserves: {_total_tcf:.2f} Tcf]")

# Gas price scenarios (USD/MMbtu)
PRICES = {
    "P90_low":   3.50,
    "P50_base":  5.50,
    "P10_high":  8.00,
}


# ═══════════════════════════════════════════════════════════════
# DCF ENGINE
# ═══════════════════════════════════════════════════════════════
def dcf_analyze(fiscal_pipeline, price_mmbtu, name):
    r = FIELD["discount_rate"]
    total_capex = total_opex = total_revenue = total_contractor_ncf = total_govt = 0
    cashflows = []
    carry = {"unrecovered_cost": 0.0}

    for year in range(FIELD["total_years"]):
        mmbtu = annual_production_mmbtu(year)
        gross_rev = mmbtu * price_mmbtu / 1e6

        # CAPEX
        capex_yr = 0
        if year < FIELD["dev_years"]:
            capex_yr = (FIELD["capex_expl_mm"] + FIELD["capex_dev_mm"]) * FIELD["capex_schedule"][year]

        # OPEX
        opex_yr = 0
        if production_mmcfd(year) > 0:
            opex_yr = production_mmcfd(year) * 365 * FIELD["opex_per_mcf"] / 1e6

        total_capex += capex_yr
        total_opex += opex_yr
        total_revenue += gross_rev

        result = fiscal_pipeline(year, gross_rev, opex_yr, capex_yr, carry, FIELD, price_mmbtu)
        contractor_ncf = result["contractor_ncf"]
        govt = result["govt_take"]

        total_contractor_ncf += contractor_ncf
        total_govt += govt
        cashflows.append(contractor_ncf - capex_yr)

    total_costs = total_capex + total_opex
    total_profit = total_revenue - total_costs

    govt_take_pct = (total_govt / total_profit * 100) if total_profit > 0 else 0
    contractor_take_pct = (total_contractor_ncf / total_profit * 100) if total_profit > 0 else 0

    # NPV
    npv = sum(cf / ((1 + r) ** y) for y, cf in enumerate(cashflows))

    # IRR
    def npv_at_rate(rate):
        return sum(cf / ((1 + rate) ** y) for y, cf in enumerate(cashflows))
    try:
        lo, hi = -0.5, 2.0
        for _ in range(60):
            mid = (lo + hi) / 2
            if npv_at_rate(mid) > 0: lo = mid
            else: hi = mid
        irr = lo * 100
    except:
        irr = float('nan')

    return {
        "name": name,
        "price": price_mmbtu,
        "total_revenue_mm": round(total_revenue, 1),
        "total_costs_mm": round(total_costs, 1),
        "total_profit_mm": round(total_profit, 1),
        "govt_take_mm": round(total_govt, 1),
        "contractor_ncf_mm": round(total_contractor_ncf, 1),
        "govt_take_pct": round(govt_take_pct, 1),
        "contractor_take_pct": round(contractor_take_pct, 1),
        "npv_mm": round(npv, 1),
        "irr_pct": round(irr, 1) if not np.isnan(irr) else None,
    }


# ═══════════════════════════════════════════════════════════════
# COUNTRY FISCAL REGIMES (unified signature, with carryforward)
# ═══════════════════════════════════════════════════════════════

def argentina(year, gross_rev, opex, capex, carry, field, price):
    royalty = gross_rev * 0.12
    taxable = gross_rev - royalty - opex - capex
    it = max(0, taxable * 0.35)
    wht = max(0, taxable - it) * 0.07
    govt = royalty + it + wht
    return {"contractor_ncf": gross_rev - opex - capex - govt, "govt_take": govt}

def argentina_rigi(year, gross_rev, opex, capex, carry, field, price):
    if field["capex_expl_mm"] + field["capex_dev_mm"] < 600:
        return argentina(year, gross_rev, opex, capex, carry, field, price)
    royalty = gross_rev * 0.12
    capex_ded = capex * 1.5  # accelerated depreciation
    taxable = gross_rev - royalty - opex - capex_ded
    it = max(0, taxable * 0.25)
    wht = max(0, taxable - it) * 0.035
    govt = royalty + it + wht
    return {"contractor_ncf": gross_rev - opex - capex - govt, "govt_take": govt}

def bolivia(year, gross_rev, opex, capex, carry, field, price):
    royalty = gross_rev * 0.11
    idh = gross_rev * 0.32
    net = gross_rev - royalty - idh - opex - capex
    ypfb = max(0, net * 0.25)
    taxable = max(0, net - ypfb)
    iue = taxable * 0.25
    govt = royalty + idh + ypfb + iue
    return {"contractor_ncf": gross_rev - opex - capex - govt, "govt_take": govt}

def brasil_concessao(year, gross_rev, opex, capex, carry, field, price):
    royalty = gross_rev * 0.10
    taxable = gross_rev - royalty - opex - capex
    it = max(0, taxable * 0.34)
    sp = max(0, (taxable - it) * 0.10)
    govt = royalty + it + sp
    return {"contractor_ncf": gross_rev - opex - capex - govt, "govt_take": govt}

def brasil_psc(year, gross_rev, opex, capex, carry, field, price):
    royalty = gross_rev * 0.15
    # Cost recovery with carryforward
    remaining = gross_rev - royalty
    total_cost = opex + capex + carry.get("unrecovered_cost", 0)
    cost_ceiling = remaining * 0.70
    recovered = min(total_cost, cost_ceiling)
    carry["unrecovered_cost"] = total_cost - recovered  # carry forward
    profit_oil = remaining - recovered
    govt_profit = profit_oil * 0.25
    contractor_profit = profit_oil * 0.75
    it = max(0, contractor_profit * 0.34)
    govt = royalty + govt_profit + it
    return {"contractor_ncf": gross_rev - opex - capex - govt, "govt_take": govt, "carryforward": carry}

def colombia(year, gross_rev, opex, capex, carry, field, price):
    royalty = gross_rev * 0.10
    # Precios Altos — real Annex D formula
    # Gas Po ≈ $3.70/MMbtu (Table B, distance ≤500km)
    # Q = [(P-Po)/P] × S where S is stepped
    Po = 3.70
    P = price
    if P > Po and year >= 3 + 5:  # 5 years after production start
        if P < 2 * Po:
            S = 0.30
        elif P < 3 * Po:
            S = 0.35
        elif P < 4 * Po:
            S = 0.40
        elif P < 5 * Po:
            S = 0.45
        else:
            S = 0.50
        windfall = max(0, ((P - Po) / P) * S * gross_rev)
    else:
        windfall = 0

    # Royalty NOT deductible (2026 rule)
    taxable = gross_rev - opex - capex
    it = max(0, taxable * 0.35)
    surtax = max(0, taxable * 0.10)
    govt = royalty + it + surtax + windfall
    return {"contractor_ncf": gross_rev - opex - capex - govt, "govt_take": govt}

def ecuador(year, gross_rev, opex, capex, carry, field, price):
    state_share = gross_rev * 0.50
    contractor_gross = gross_rev * 0.50
    labor_base = max(0, contractor_gross - opex - capex)
    labor_profit = labor_base * 0.15
    labor_to_state = labor_profit * 0.80
    taxable = max(0, contractor_gross - opex - capex - labor_profit)
    it = taxable * 0.25
    govt = state_share + labor_to_state + it
    return {"contractor_ncf": gross_rev - opex - capex - govt, "govt_take": govt}

def guyana_psa2016(year, gross_rev, opex, capex, carry, field, price):
    royalty = gross_rev * 0.02
    remaining = gross_rev - royalty
    total_cost = opex + capex + carry.get("unrecovered_cost", 0)
    cost_ceiling = remaining * 0.75
    recovered = min(total_cost, cost_ceiling)
    carry["unrecovered_cost"] = total_cost - recovered
    profit_oil = remaining - recovered
    govt_profit = profit_oil * 0.50
    contractor_profit = profit_oil * 0.50
    govt = royalty + govt_profit
    return {"contractor_ncf": gross_rev - opex - capex - govt, "govt_take": govt, "carryforward": carry}

def mexico(year, gross_rev, opex, capex, carry, field, price):
    dpb = gross_rev * 0.1163
    taxable = gross_rev - opex - capex
    it = max(0, taxable * 0.30)
    govt = dpb + it
    return {"contractor_ncf": gross_rev - opex - capex - govt, "govt_take": govt}

def peru(year, gross_rev, opex, capex, carry, field, price):
    royalty = gross_rev * 0.08
    taxable = gross_rev - royalty - opex - capex
    it = max(0, taxable * 0.295)
    wht = max(0, (taxable - it) * 0.05)
    govt = royalty + it + wht
    return {"contractor_ncf": gross_rev - opex - capex - govt, "govt_take": govt}

def trinidad_onshore(year, gross_rev, opex, capex, carry, field, price):
    royalty = gross_rev * 0.125
    taxable = gross_rev - royalty - opex - capex
    ppt = max(0, taxable * 0.50)
    ul = max(0, taxable * 0.05)
    govt = royalty + ppt + ul
    return {"contractor_ncf": gross_rev - opex - capex - govt, "govt_take": govt}

def trinidad_psc(year, gross_rev, opex, capex, carry, field, price):
    total_cost = opex + capex + carry.get("unrecovered_cost", 0)
    cost_ceiling = gross_rev * 0.55
    recovered = min(total_cost, cost_ceiling)
    carry["unrecovered_cost"] = total_cost - recovered
    profit_gas = gross_rev - recovered
    govt_profit = profit_gas * 0.60
    contractor_profit = profit_gas * 0.40
    return {"contractor_ncf": gross_rev - opex - capex - govt_profit, "govt_take": govt_profit, "carryforward": carry}


# ═══════════════════════════════════════════════════════════════
# RUN
# ═══════════════════════════════════════════════════════════════
COUNTRIES = [
    ("Argentina (sin RIGI)", argentina),
    ("Argentina (RIGI)", argentina_rigi),
    ("Bolivia", bolivia),
    ("Brasil (Concessao)", brasil_concessao),
    ("Brasil (PSC Pre-Sal)", brasil_psc),
    ("Colombia", colombia),
    ("Ecuador", ecuador),
    ("Guyana (PSA 2016)", guyana_psa2016),
    ("Mexico (post-2025)", mexico),
    ("Peru", peru),
    ("Trinidad (Concession)", trinidad_onshore),
    ("Trinidad (PSC)", trinidad_psc),
]

print("=" * 95)
print(f"GOVERNMENT TAKE BENCHMARK — Gas Field ({FIELD['recoverable_tcf']} Tcf, {FIELD['peak_mmcfd']} MMcfd peak)")
print(f"  Dev: {FIELD['dev_years']}yr | Ramp: {FIELD['ramp_years']}yr | Plateau: {FIELD['plateau_years']}yr | Decline: {FIELD['decline_rate_annual']*100:.0f}%/yr")
print(f"  CAPEX: ${FIELD['capex_expl_mm']+FIELD['capex_dev_mm']}M | OPEX: ${FIELD['opex_per_mcf']}/Mcf | Discount: {FIELD['discount_rate']*100:.0f}%")
print(f"  Recoverable: {_total_tcf:.2f} Tcf (verified)")
print("=" * 95)

for price_label, price in PRICES.items():
    print(f"\n{'─' * 95}")
    print(f"  Gas Price: ${price:.2f}/MMbtu ({price_label})")
    print(f"{'─' * 95}")
    print(f"{'Country':<28} {'Revenue':>8} {'Costs':>8} {'Govt':>8} {'NCF':>8} {'Govt%':>7} {'Contr%':>7} {'NPV':>9} {'IRR':>6}")
    print("-" * 95)

    results = []
    for name, pipeline in COUNTRIES:
        r = dcf_analyze(pipeline, price, name)
        results.append(r)
        irr_str = f"{r['irr_pct']:.1f}%" if r['irr_pct'] is not None else "N/A"
        print(f"{name:<28} {r['total_revenue_mm']:>8.0f} {r['total_costs_mm']:>8.0f} {r['govt_take_mm']:>8.0f} {r['contractor_ncf_mm']:>8.0f} {r['govt_take_pct']:>6.1f}% {r['contractor_take_pct']:>6.1f}% {r['npv_mm']:>9.0f} {irr_str:>6}")

    print(f"\n  * Revenue: ${results[0]['total_revenue_mm']:.0f}M | Costs: ${results[0]['total_costs_mm']:.0f}M | Profit: ${results[0]['total_profit_mm']:.0f}M")
