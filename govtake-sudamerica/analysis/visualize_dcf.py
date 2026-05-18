"""
Visualization: Government Take DCF Results
Generates 4 publication-quality charts from the DCF model output
"""
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.ticker as mticker
import numpy as np

# ═══════════════════════════════════════════════════════════
# DATA — from DCF v2 model run
# ═══════════════════════════════════════════════════════════
# Format: (country, {price: {contractor_pct, npv_mm, govt_pct, revenue, govt_mm, ncf_mm}})
# P50 = $5.50/MMbtu, P90 = $3.50, P10 = $8.00

data = {
    "Argentina\n(RIGI)":       {"P90": (55.0, -424, 45.0, 3898, 1415, 1732), "P50": (58.6,  119, 41.4, 6125, 2224, 3150), "P10": (60.4,  798, 39.6, 8909, 3234, 4923)},
    "Argentina\n(sin RIGI)":   {"P90": (42.0, -580, 58.0, 3898, 1824, 1323), "P50": (46.7, -127, 53.3, 6125, 2866, 2508), "P10": (48.9,  440, 51.1, 8909, 4169, 3988)},
    "Bolivia":                 {"P90": (15.9, -896, 84.1, 3898, 2647,  499), "P50": (22.6, -622, 77.4, 6125, 4160, 1213), "P10": (25.8, -280, 74.2, 8909, 6052, 2106)},
    "Brasil\n(Concessão)":     {"P90": (42.4, -576, 57.6, 3898, 1814, 1333), "P50": (47.0, -120, 53.0, 6125, 2850, 2524), "P10": (49.2,  449, 50.8, 8909, 4146, 4012)},
    "Brasil\n(PSC Pré-Sal)":   {"P90": (40.3, -526, 59.7, 3898, 1878, 1268), "P50": (41.0, -149, 59.0, 6125, 3168, 2205), "P10": (41.4,  311, 58.6, 8909, 4781, 3377)},
    "Colombia":                {"P90": (31.9, -702, 68.1, 3898, 2143, 1003), "P50": (29.2, -451, 70.8, 6125, 3806, 1568), "P10": (25.0, -207, 75.0, 8909, 6120, 2038)},
    "Ecuador":                 {"P90": (17.5, -876, 82.5, 3898, 2596,  550), "P50": (24.1, -591, 75.9, 6125, 4080, 1293), "P10": (27.2, -236, 72.8, 8909, 5935, 2223)},
    "Guyana\n(PSA 2016)":      {"P90": (48.8, -416, 51.2, 3898, 1612, 1534), "P50": (48.9,   17, 51.1, 6125, 2748, 2626), "P10": (48.9,  549, 51.1, 8909, 4168, 3990)},
    "México\n(post-2025)":     {"P90": (48.4, -503, 51.6, 3898, 1622, 1524), "P50": (52.6,   -6, 47.4, 6125, 2549, 2824), "P10": (54.5,  616, 45.5, 8909, 3708, 4449)},
    "Perú":                    {"P90": (52.5, -455, 47.5, 3898, 1496, 1651), "P50": (56.3,   71, 43.7, 6125, 2350, 3023), "P10": (58.1,  727, 41.9, 8909, 3419, 4739)},
    "Trinidad\n(Concesión)":   {"P90": (24.9, -786, 75.1, 3898, 2362,  784), "P50": (30.9, -451, 69.1, 6125, 3712, 1661), "P10": (33.8,  -31, 66.2, 8909, 5400, 2757)},
    "Trinidad\n(PSC)":         {"P90": (40.0, -521, 60.0, 3898, 1888, 1259), "P50": (40.0, -157, 60.0, 6125, 3224, 2150), "P10": (40.0,  284, 60.0, 8909, 4895, 3263)},
}

countries = list(data.keys())
n = len(countries)
p50_ct = [data[c]["P50"][0] for c in countries]

# Sort by P50 contractor take
sorted_idx = np.argsort(p50_ct)
sorted_countries = [countries[i] for i in sorted_idx]
sorted_ct = [p50_ct[i] for i in sorted_idx]
sorted_npv = [data[c]["P50"][1] for c in sorted_countries]

# Color gradient: green (high take) to red (low take)
colors = plt.cm.RdYlGn(np.linspace(0.15, 0.95, n))[np.argsort(sorted_idx)]

plt.rcParams.update({
    'font.family': 'sans-serif',
    'font.size': 10,
    'axes.titlesize': 13,
    'axes.labelsize': 10,
    'figure.dpi': 150,
})


# ═══════════════════════════════════════════════════════════
# CHART 1: Contractor Take at P50 — Horizontal Bar
# ═══════════════════════════════════════════════════════════
fig, ax = plt.subplots(figsize=(10, 6))
bars = ax.barh(range(n), sorted_ct, color=colors, edgecolor='white', linewidth=0.5)
ax.set_yticks(range(n))
ax.set_yticklabels(sorted_countries, fontsize=9)
ax.set_xlabel('Contractor Take (% of profit)', fontsize=10)
ax.set_title(f'Government Take Benchmark — Gas Field, P50 (${5.50}/MMbtu)', fontsize=13, fontweight='bold')
ax.axvline(x=50, color='gray', linestyle='--', alpha=0.5, label='50% split')
ax.set_xlim(0, 70)
ax.xaxis.set_major_formatter(mticker.PercentFormatter())
# Value labels
for i, (ct, npv_val) in enumerate(zip(sorted_ct, sorted_npv)):
    color = 'white' if ct < 35 else '#333'
    npv_text = f'NPV ${npv_val:.0f}M' if npv_val >= 0 else f'NPV -${abs(npv_val):.0f}M'
    ax.text(ct + 0.5, i, f'{ct:.1f}%  ({npv_text})', va='center', fontsize=8, color=color if ct > 40 else '#333')
ax.legend(loc='lower right', fontsize=9)
plt.tight_layout()
fig.savefig('govtake-sudamerica/analysis/chart1_contractor_take.png', bbox_inches='tight')
plt.close()
print("✅ Chart 1: Contractor Take bar chart")


# ═══════════════════════════════════════════════════════════
# CHART 2: Sensitivity — Contractor Take at 3 Price Scenarios
# ═══════════════════════════════════════════════════════════
fig, ax = plt.subplots(figsize=(12, 6))
price_labels = ['$3.50\n(P90 low)', '$5.50\n(P50 base)', '$8.00\n(P10 high)']
x_positions = [0, 1, 2]
offsets = np.linspace(-0.25, 0.25, n)

for i, country in enumerate(countries):
    ct_values = [data[country][k][0] for k in ["P90", "P50", "P10"]]
    label = country.replace('\n', ' ')
    ax.plot(x_positions, ct_values, 'o-', linewidth=1.2, markersize=5, label=label, alpha=0.8)

ax.set_xticks(x_positions)
ax.set_xticklabels(price_labels, fontsize=9)
ax.set_ylabel('Contractor Take (%)', fontsize=10)
ax.set_title('Sensitivity: Contractor Take vs. Gas Price', fontsize=13, fontweight='bold')
ax.set_ylim(0, 70)
ax.yaxis.set_major_formatter(mticker.PercentFormatter())
ax.grid(axis='y', alpha=0.3)
# Highlight extremes
for i, country in enumerate(countries):
    ct_values = [data[country][k][0] for k in ["P90", "P50", "P10"]]
    label = country.replace('\n', ' ')
    if label in ['Perú', 'Argentina (RIGI)', 'Bolivia', 'Colombia']:
        ax.annotate(label, (x_positions[-1], ct_values[-1]), textcoords="offset points",
                    xytext=(5, 0), fontsize=8, fontweight='bold', alpha=0.9)
plt.tight_layout()
fig.savefig('govtake-sudamerica/analysis/chart2_sensitivity.png', bbox_inches='tight')
plt.close()
print("✅ Chart 2: Sensitivity to gas price")


# ═══════════════════════════════════════════════════════════
# CHART 3: NPV vs Contractor Take — Investability Matrix
# ═══════════════════════════════════════════════════════════
fig, ax = plt.subplots(figsize=(10, 7))
npv_values = [data[c]["P50"][1] for c in countries]
ct_values = [data[c]["P50"][0] for c in countries]
sizes = [data[c]["P50"][5] / 20 for c in countries]  # contractor NCF size

for i, country in enumerate(countries):
    label = country.replace('\n', ' ')
    ax.scatter(ct_values[i], npv_values[i], s=sizes[i], alpha=0.8, edgecolors='#333', linewidth=0.5)
    offset_y = 25 if npv_values[i] >= 0 else -45
    ax.annotate(label, (ct_values[i], npv_values[i]), textcoords="offset points",
                xytext=(0, offset_y), fontsize=8, ha='center', alpha=0.9)

ax.axhline(y=0, color='gray', linestyle='--', alpha=0.5)
ax.axvline(x=50, color='gray', linestyle='--', alpha=0.5)
# Quadrant labels
ax.text(60, 350, 'INVERTIBLE\nAlto retorno', ha='center', fontsize=9, alpha=0.3, fontweight='bold')
ax.text(35, 350, 'Solo a\nprecio alto', ha='center', fontsize=9, alpha=0.3, fontweight='bold')
ax.text(60, -300, 'Marginal\n(a precio bajo)', ha='center', fontsize=9, alpha=0.3, fontweight='bold')
ax.text(35, -300, 'INVIABLE\na P50', ha='center', fontsize=9, alpha=0.3, fontweight='bold')

ax.set_xlabel('Contractor Take (% of profit)', fontsize=10)
ax.set_ylabel('NPV @ 10% (USD millones)', fontsize=10)
ax.set_title('Investability Matrix: NPV vs Contractor Take (P50)', fontsize=13, fontweight='bold')
ax.xaxis.set_major_formatter(mticker.PercentFormatter())
ax.yaxis.set_major_formatter(mticker.FuncFormatter(lambda x, _: f'${x:.0f}M'))
ax.grid(alpha=0.2)
plt.tight_layout()
fig.savefig('govtake-sudamerica/analysis/chart3_npv_matrix.png', bbox_inches='tight')
plt.close()
print("✅ Chart 3: NPV investability matrix")


# ═══════════════════════════════════════════════════════════
# CHART 4: Waterfall — Where does $100 of revenue go?
# ═══════════════════════════════════════════════════════════
top3 = ['Perú', 'Argentina\n(RIGI)', 'Guyana\n(PSA 2016)']
bottom3 = ['Bolivia', 'Ecuador', 'Colombia']
selected = top3 + bottom3

fig, axes = plt.subplots(2, 3, figsize=(14, 8))
axes = axes.flatten()

for idx, country in enumerate(selected):
    ax = axes[idx]
    d = data[country]["P50"]
    revenue = d[3]  # total revenue
    govt_mm = d[4]
    ncf_mm = d[5]
    costs = revenue - govt_mm - ncf_mm

    # Stacked bar: costs, government, contractor
    bar_width = 0.5
    ax.bar(0, costs, bar_width, color='#cbd5e1', label='Costs (CAPEX+OPEX)')
    ax.bar(0, govt_mm, bar_width, bottom=costs, color='#ef4444', alpha=0.85, label='Government Take')
    ax.bar(0, ncf_mm, bar_width, bottom=costs+govt_mm, color='#22c55e', alpha=0.85, label='Contractor NCF')

    # Percentage labels
    total = costs + govt_mm + ncf_mm
    pct_govt = govt_mm / total * 100
    pct_ct = ncf_mm / total * 100
    ax.text(0, costs/2, f'Costs', ha='center', fontsize=8, color='#475569', fontweight='bold')
    ax.text(0, costs + govt_mm/2, f'Govt\n{pct_govt:.0f}%', ha='center', fontsize=9, color='white', fontweight='bold')
    ax.text(0, costs + govt_mm + ncf_mm/2, f'NCF\n{pct_ct:.0f}%', ha='center', fontsize=9, color='white', fontweight='bold')

    ax.set_title(country.replace('\n', ' '), fontsize=10, fontweight='bold')
    ax.set_xticks([])
    ax.set_ylim(0, total * 1.05)
    if idx == 0:
        ax.legend(loc='upper right', fontsize=7)

fig.suptitle('Where Does $1 of Revenue Go? — P50 ($5.50/MMbtu)', fontsize=13, fontweight='bold', y=1.01)
plt.tight_layout()
fig.savefig('govtake-sudamerica/analysis/chart4_waterfall.png', bbox_inches='tight')
plt.close()
print("✅ Chart 4: Revenue waterfall")


print("\n🎨 All 4 charts saved to govtake-sudamerica/analysis/")
