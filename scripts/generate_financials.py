# BEGIN: financials_and_visuals.py
import os
import math
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

# --- Setup output directory
OUT_DIR = "output"
os.makedirs(OUT_DIR, exist_ok=True)

# --- Assumptions / Constants (edit if needed)
years = [2025, 2026, 2027, 2028, 2029]

# Unit sales forecast (from final plan)
taubook_units = [20000, 45000, 90000, 150000, 225000]   # laptops
tauphone_units = [35000, 90000, 175000, 300000, 450000] # phones

# OEM costs & Prices (per unit)
taubook_oem = 650.0   # USD
taubook_price = 1099.0
tauphone_oem = 420.0
tauphone_price = 899.0

# Convert to numpy arrays for vector operations
tb_units = np.array(taubook_units)
tp_units = np.array(tauphone_units)

# Device revenues and COGS
taubook_revenue = tb_units * taubook_price
tauphone_revenue = tp_units * tauphone_price
device_revenue = taubook_revenue + tauphone_revenue

taubook_cogs = tb_units * taubook_oem
tauphone_cogs = tp_units * tauphone_oem
device_cogs = taubook_cogs + tauphone_cogs

device_gross_profit = device_revenue - device_cogs
device_gross_margin_pct = device_gross_profit / device_revenue

# Base-case TOTAL revenue as per strategy (these are the "Total Revenue" targets including device + software)
# Using Base Case totals from the final sensitivity section
total_revenue_base = np.array([65.0, 150.0, 300.0, 500.0, 750.0]) * 1e6  # convert millions to USD

# Convert device revenue arrays to USD (they are already USD) and to same scale
device_revenue_usd = device_revenue * 1.0
device_cogs_usd = device_cogs * 1.0
device_gp_usd = device_gross_profit * 1.0

# Software & services revenue = total revenue - device revenue
software_revenue_base = total_revenue_base - device_revenue_usd

# Defensive check: if software revenue negative (unlikely), set to small positive and warn
for i, val in enumerate(software_revenue_base):
    if val < 0:
        print(f"Warning: software revenue negative in {years[i]} (${val:,.0f}). Setting to $1M.")
        software_revenue_base[i] = 1e6

# Operating expense profile assumptions
# Total OPEX as % of TOTAL REVENUE, improving over time (scale efficiencies)
# Example: starting OPEX ratio 60% in 2025 down to 30% in 2029 (linear)
opex_ratio_start = 0.60
opex_ratio_end = 0.30
opex_ratios = np.linspace(opex_ratio_start, opex_ratio_end, len(years))

# Split OPEX into categories by percentage of OPEX (consistent with earlier cost structure)
opex_split = {
    "people_pct": 0.45,
    "infra_pct": 0.25,
    "compliance_pct": 0.10,
    "marketing_pct": 0.20
}

# Compute financial statement items
total_revenue = total_revenue_base
device_rev = device_revenue_usd
software_rev = software_revenue_base

device_cogs = device_cogs_usd
# Gross profit = total revenue - device COGS (software has near-zero COGS here for simplicity)
gross_profit = total_revenue - device_cogs

opex = opex_ratios * total_revenue
people_cost = opex * opex_split["people_pct"]
infra_cost = opex * opex_split["infra_pct"]
compliance_cost = opex * opex_split["compliance_pct"]
marketing_cost = opex * opex_split["marketing_pct"]

ebitda = gross_profit - opex
ebitda_margin = ebitda / total_revenue

# Create DataFrame for base case
df_base = pd.DataFrame({
    "Year": years,
    "Total Revenue (USD)": total_revenue,
    "Device Revenue (USD)": device_rev,
    "Software Revenue (USD)": software_rev,
    "Device COGS (USD)": device_cogs,
    "Gross Profit (USD)": gross_profit,
    "OPEX (USD)": opex,
    " - People (USD)": people_cost,
    " - Infrastructure (USD)": infra_cost,
    " - Compliance (USD)": compliance_cost,
    " - Marketing (USD)": marketing_cost,
    "EBITDA (USD)": ebitda,
    "EBITDA Margin": ebitda_margin
})

# Round numbers for readability
df_base_rounded = df_base.copy()
for col in df_base_rounded.columns:
    if col != "Year":
        df_base_rounded[col] = df_base_rounded[col].map(lambda x: round(x, 0))

# Save Excel for review
excel_path = os.path.join(OUT_DIR, "TauOS_Financials_Base.xlsx")
df_base.to_excel(excel_path, index=False)
print(f"Saved base-case financials to: {excel_path}")

# --- Device detailed tables (units, revenues, cogs, gross profit)
df_devices = pd.DataFrame({
    "Year": years,
    "TauBook Units": tb_units,
    "TauPhone Units": tp_units,
    "TauBook Revenue (USD)": taubook_revenue,
    "TauPhone Revenue (USD)": tauphone_revenue,
    "Device Revenue (USD)": device_revenue_usd,
    "TauBook COGS (USD)": taubook_cogs,
    "TauPhone COGS (USD)": tauphone_cogs,
    "Device COGS (USD)": device_cogs_usd,
    "Device Gross Profit (USD)": device_gp_usd,
    "Device Gross Margin %": device_gross_margin_pct
})
df_devices.to_excel(os.path.join(OUT_DIR, "TauOS_Devices_Detail.xlsx"), index=False)

# --- Sensitivity scenarios (Bear / Base / Bull) using the revenue table from prompt
rev_bear = np.array([50, 120, 250, 400, 600]) * 1e6
rev_base = np.array([65, 150, 300, 500, 750]) * 1e6
rev_bull = np.array([80, 200, 420, 720, 1100]) * 1e6

def compute_scenario(total_revenue_scenario, label):
    """Compute scenario financials given a total revenue series (USD)"""
    # software revenue = total - device_rev
    software_rev_scen = total_revenue_scenario - device_rev
    # avoid negative software revenue
    software_rev_scen = np.where(software_rev_scen < 0, 0.0, software_rev_scen)
    gross_profit_scen = total_revenue_scenario - device_cogs  # device cogs only
    opex_scen = opex_ratios * total_revenue_scenario
    ebitda_scen = gross_profit_scen - opex_scen
    return pd.DataFrame({
        "Year": years,
        "Scenario": label,
        "Total Revenue (USD)": total_revenue_scenario,
        "Device Revenue (USD)": device_rev,
        "Software Revenue (USD)": software_rev_scen,
        "Device COGS (USD)": device_cogs,
        "Gross Profit (USD)": gross_profit_scen,
        "OPEX (USD)": opex_scen,
        "EBITDA (USD)": ebitda_scen,
        "EBITDA Margin": ebitda_scen / total_revenue_scenario
    })

df_bear = compute_scenario(rev_bear, "Bear")
df_base_scen = compute_scenario(rev_base, "Base")
df_bull = compute_scenario(rev_bull, "Bull")

# Save scenarios
pd.concat([df_bear, df_base_scen, df_bull]).to_excel(os.path.join(OUT_DIR, "TauOS_Scenarios.xlsx"), index=False)
print("Saved scenario workbook.")

# --- Valuation calculations
# Use base-case EBITDA as the primary valuation driver (company prefers IPO multiples)
ebitda_base = df_base_scen["EBITDA (USD)"].values  # array for years
# Multiples to test
multiples = [5, 7, 10]
valuation_table = []
for i, year in enumerate(years):
    for m in multiples:
        valuation_table.append({
            "Year": year,
            "EBITDA (USD)": ebitda_base[i],
            "Multiple": m,
            "Implied EV (USD)": ebitda_base[i] * m
        })
df_valuation = pd.DataFrame(valuation_table)
df_valuation.to_excel(os.path.join(OUT_DIR, "TauOS_Valuation_Multiples.xlsx"), index=False)

# DCF rough estimate (simple) for Base scenario: discount cash flows (EBITDA as proxy for free cashflow * conversion)
discount_rate = 0.10
terminal_growth = 0.03
# Convert EBITDA to Free Cash Flow by applying conversion ratio (assume 70% conversion to FCF)
fcf_conv = 0.70
fcfs = ebitda_base * fcf_conv
# Discount each year's FCF
pv_fcfs = [fcfs[i] / ((1 + discount_rate) ** (i + 1)) for i in range(len(fcfs))]
# Terminal value (year 5) using exit multiple or Gordon growth (use Gordon)
terminal_value = (fcfs[-1] * (1 + terminal_growth)) / (discount_rate - terminal_growth)
pv_terminal = terminal_value / ((1 + discount_rate) ** len(fcfs))
dcf_value = sum(pv_fcfs) + pv_terminal

# Save DCF summary
df_dcf = pd.DataFrame({
    "Year": years,
    "EBITDA (USD)": ebitda_base,
    "FCF (USD)": fcfs,
    "PV Factor": [(1 / ((1 + discount_rate) ** (i + 1))) for i in range(len(years))],
    "PV of FCF (USD)": [pv_fcfs[i] for i in range(len(years))]
})
df_dcf.loc["Terminal"] = ["Terminal", "", "", "", pv_terminal]
df_dcf.to_excel(os.path.join(OUT_DIR, "TauOS_DCF.xlsx"), index=False)

# --- Valuation Sensitivity table (final)
# Use Base EBITDA and show values at multiples 5x/7x/10x for each year
val_sens = []
for i, y in enumerate(years):
    e = ebitda_base[i]
    val_sens.append({
        "Year": y,
        "EBITDA (USD)": e,
        "5x": e * 5,
        "7x": e * 7,
        "10x": e * 10
    })
df_val_sens = pd.DataFrame(val_sens)
df_val_sens.to_excel(os.path.join(OUT_DIR, "TauOS_Valuation_Sensitivity.xlsx"), index=False)

# --- Plots (matplotlib)
plt.style.use('ggplot')

def save_plot(fig, fname):
    path = os.path.join(OUT_DIR, fname)
    fig.savefig(path, bbox_inches='tight', dpi=200)
    print(f"Saved: {path}")

# 1) Device revenue and gross profit chart
fig, ax = plt.subplots(figsize=(10,6))
ax.plot(years, device_rev / 1e6, marker='o', label='Device Revenue (M$)')
ax.plot(years, device_gp_usd / 1e6, marker='o', label='Device Gross Profit (M$)')
ax.set_title('Device Revenue & Gross Profit (Millions USD)')
ax.set_xlabel('Year')
ax.set_ylabel('USD (Millions)')
ax.legend()
save_plot(fig, "device_revenue_gp.png")
plt.close(fig)

# 2) Total revenue vs EBITDA (Base)
fig, ax1 = plt.subplots(figsize=(10,6))
ax1.plot(years, total_revenue / 1e6, marker='o', color='tab:blue', label='Total Revenue (M$)')
ax1.set_xlabel('Year')
ax1.set_ylabel('Revenue (M$)', color='tab:blue')
ax2 = ax1.twinx()
ax2.plot(years, ebitda / 1e6, marker='o', color='tab:green', label='EBITDA (M$)')
ax2.set_ylabel('EBITDA (M$)', color='tab:green')
ax1.set_title('Total Revenue vs EBITDA (Base Case)')
ax1.grid(True)
save_plot(fig, "revenue_vs_ebitda_base.png")
plt.close(fig)

# 3) Revenue mix stacked bar (device vs software) - Base
fig, ax = plt.subplots(figsize=(10,6))
width = 0.6
ax.bar(years, device_rev/1e6, width, label='Device Revenue (M$)')
ax.bar(years, software_revenue_base/1e6, width, bottom=(device_rev/1e6), label='Software Revenue (M$)')
ax.set_title('Revenue Mix: Device vs Software (Base Case)')
ax.set_ylabel('Revenue (M$)')
ax.legend()
save_plot(fig, "revenue_mix_device_software.png")
plt.close(fig)

# 4) OPEX breakdown pie for 2025 (example)
fig, ax = plt.subplots(figsize=(6,6))
opex_2025 = opex[0]
labels = ['People', 'Infrastructure', 'Compliance', 'Marketing']
sizes = [opex_split['people_pct'], opex_split['infra_pct'], opex_split['compliance_pct'], opex_split['marketing_pct']]
ax.pie(sizes, labels=labels, autopct='%1.0f%%', startangle=140)
ax.set_title('OPEX Split (as % of OPEX)')
save_plot(fig, "opex_split_pie.png")
plt.close(fig)

# 5) Scenarios: Revenue and EBITDA lines (Bear/Base/Bull)
fig, ax = plt.subplots(figsize=(10,6))
ax.plot(years, rev_bear/1e6, marker='o', linestyle='--', label='Revenue Bear (M$)')
ax.plot(years, rev_base/1e6, marker='o', linestyle='-', label='Revenue Base (M$)')
ax.plot(years, rev_bull/1e6, marker='o', linestyle='-.', label='Revenue Bull (M$)')
ax.set_title('Revenue Scenarios (M$)')
ax.set_xlabel('Year')
ax.set_ylabel('Revenue (M$)')
ax.legend()
save_plot(fig, "revenue_scenarios.png")
plt.close(fig)

fig, ax = plt.subplots(figsize=(10,6))
ax.plot(years, df_bear["EBITDA (USD)"]/1e6, marker='o', linestyle='--', label='EBITDA Bear (M$)')
ax.plot(years, df_base_scen["EBITDA (USD)"]/1e6, marker='o', linestyle='-', label='EBITDA Base (M$)')
ax.plot(years, df_bull["EBITDA (USD)"]/1e6, marker='o', linestyle='-.', label='EBITDA Bull (M$)')
ax.set_title('EBITDA Scenarios (M$)')
ax.set_xlabel('Year')
ax.set_ylabel('EBITDA (M$)')
ax.legend()
save_plot(fig, "ebitda_scenarios.png")
plt.close(fig)

# 6) Valuation sensitivity curves for multiples (5x,7x,10x) using base EBITDA
fig, ax = plt.subplots(figsize=(10,6))
for m in multiples:
    ax.plot(years, ebitda_base * m / 1e6, marker='o', label=f'{m}x EBITDA (M$)')
ax.set_title('Valuation Sensitivity (Implied EV, Millions USD)')
ax.set_xlabel('Year')
ax.set_ylabel('Implied EV (M$)')
ax.legend()
save_plot(fig, "valuation_sensitivity.png")
plt.close(fig)

# 7) Save a summary markdown file which references images and key tables
summary_md = os.path.join(OUT_DIR, "TauOS_Investor_Summary.md")
with open(summary_md, "w") as f:
    f.write("# TauOS / AR Holdings Investor Summary\n\n")
    f.write("## Key Assumptions & Tagline\n")
    f.write("- Tagline: **Tomorrow's Intelligence, Today — Powered by Tau OS.**\n")
    f.write("- Headquarters: 2126 Market Street, San Francisco, CA 94114\n")
    f.write("\n## Device Unit Sales Forecast\n\n")
    f.write(df_devices.to_markdown(index=False))
    f.write("\n\n## Base-Case Financials (2025-2029)\n\n")
    f.write(df_base_rounded.to_markdown(index=False))
    f.write("\n\n## Scenarios (Bear / Base / Bull)\n\n")
    f.write(pd.concat([df_bear, df_base_scen, df_bull]).to_markdown(index=False))
    f.write("\n\n## Visuals (saved as PNG files in this folder)\n")
    f.write("- device_revenue_gp.png\n")
    f.write("- revenue_vs_ebitda_base.png\n")
    f.write("- revenue_mix_device_software.png\n")
    f.write("- opex_split_pie.png\n")
    f.write("- revenue_scenarios.png\n")
    f.write("- ebitda_scenarios.png\n")
    f.write("- valuation_sensitivity.png\n")
    f.write("\n\n## DCF Summary\n")
    f.write(f"- Discount Rate: {discount_rate*100:.1f}%\n")
    f.write(f"- Terminal Growth Rate: {terminal_growth*100:.1f}%\n")
    f.write(f"- Implied DCF Value (PV of FCF + terminal): ${dcf_value:,.0f}\n\n")

print(f"Summary written to: {summary_md}")
print("All visuals and Excel files saved under the 'output' directory.")
# END: financials_and_visuals.py
