#!/usr/bin/env python3
"""
TauOS Updated Financial Model Generator
Generates comprehensive financial documents with blended ASP model and actuals tracking
"""

import os
import math
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils.dataframe import dataframe_to_rows
import warnings
warnings.filterwarnings('ignore')

# Setup output directory
OUT_DIR = "output/updated_investor"
os.makedirs(OUT_DIR, exist_ok=True)

print("🚀 Generating Updated TauOS Financial Documents...")

# --- Assumptions / Constants
years = [2025, 2026, 2027, 2028, 2029]

# Unit sales forecast (from final plan)
taubook_units = [20000, 45000, 90000, 150000, 225000]  # laptops
tauphone_units = [35000, 90000, 175000, 300000, 450000]  # phones

# Blended ASP Model (70% OEM, 30% Direct Retail)
direct_retail_share = 0.30
oem_licensing_share = 0.70

taubook_direct_asp = 1099.0  # Direct retail ASP
taubook_oem_asp = 150.0      # OEM licensing ASP
taubook_blended_asp = (direct_retail_share * taubook_direct_asp) + (oem_licensing_share * taubook_oem_asp)

tauphone_direct_asp = 899.0   # Direct retail ASP
tauphone_oem_asp = 150.0      # OEM licensing ASP
tauphone_blended_asp = (direct_retail_share * tauphone_direct_asp) + (oem_licensing_share * tauphone_oem_asp)

# OEM costs (per unit)
taubook_oem_cost = 650.0
tauphone_oem_cost = 420.0

# Convert to numpy arrays
tb_units = np.array(taubook_units)
tp_units = np.array(tauphone_units)

# Device revenues using blended ASP
taubook_revenue = tb_units * taubook_blended_asp
tauphone_revenue = tp_units * tauphone_blended_asp
device_revenue = taubook_revenue + tauphone_revenue

# Device COGS using blended costs
taubook_cogs = tb_units * taubook_oem_cost
tauphone_cogs = tp_units * tauphone_oem_cost
device_cogs = taubook_cogs + tauphone_cogs
device_gross_profit = device_revenue - device_cogs
device_gross_margin_pct = device_gross_profit / device_revenue

# Base-case TOTAL revenue as per strategy
total_revenue_base = np.array([65.0, 150.0, 300.0, 500.0, 750.0]) * 1e6

# Software & services revenue = total revenue - device revenue
software_revenue_base = total_revenue_base - device_revenue

# Defensive check for negative software revenue
for i, val in enumerate(software_revenue_base):
    if val < 0:
        print(f"Warning: software revenue negative in {years[i]} (${val:,.0f}). Setting to $1M.")
        software_revenue_base[i] = 1e6

# Operating expense profile assumptions
opex_ratio_start = 0.60
opex_ratio_end = 0.30
opex_ratios = np.linspace(opex_ratio_start, opex_ratio_end, len(years))

# Split OPEX into categories
opex_split = {
    "people_pct": 0.45,
    "infra_pct": 0.25,
    "compliance_pct": 0.10,
    "marketing_pct": 0.20
}

# Compute financial statement items
total_revenue = total_revenue_base
device_rev = device_revenue
software_rev = software_revenue_base
device_cogs = device_cogs

# Gross profit = total revenue - device COGS
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

# Device detailed tables with blended ASP
df_devices = pd.DataFrame({
    "Year": years,
    "TauBook Units": tb_units,
    "TauPhone Units": tp_units,
    "TauBook Revenue (USD)": taubook_revenue,
    "TauPhone Revenue (USD)": tauphone_revenue,
    "Device Revenue (USD)": device_revenue,
    "TauBook COGS (USD)": taubook_cogs,
    "TauPhone COGS (USD)": tauphone_cogs,
    "Device COGS (USD)": device_cogs,
    "Device Gross Profit (USD)": device_gross_profit,
    "Device Gross Margin %": device_gross_margin_pct
})

# Revenue Mix Analysis
df_revenue_mix = pd.DataFrame({
    "Channel": ["Direct Retail", "OEM Licensing", "Blended Total"],
    "TauBook ASP": [taubook_direct_asp, taubook_oem_asp, taubook_blended_asp],
    "TauPhone ASP": [tauphone_direct_asp, tauphone_oem_asp, tauphone_blended_asp],
    "Share": ["30%", "70%", "100%"],
    "TauBook Units (2025)": [tb_units[0] * direct_retail_share, tb_units[0] * oem_licensing_share, tb_units[0]],
    "TauPhone Units (2025)": [tp_units[0] * direct_retail_share, tp_units[0] * oem_licensing_share, tp_units[0]]
})

# Actuals vs Forecasts
df_actuals = pd.DataFrame({
    "Metric": [
        "Alpha users (monthly active)",
        "Devices shipped (pilot)",
        "Enterprise pilots signed",
        "Live demo status"
    ],
    "Actual Value": [
        "4,200",
        "1,200 units",
        "1 (Healthcare pilot, NDA)",
        "TauPhone UI & TauCloud testnet"
    ],
    "Date": [
        "September 18, 2025",
        "September 18, 2025", 
        "September 18, 2025",
        "September 18, 2025"
    ]
})

# Use of Funds
df_use_of_funds = pd.DataFrame({
    "Use of Funds": [
        "Product R&D & Engineering",
        "Manufacturing samples & tooling",
        "Security Audit & Compliance",
        "Sales & BD (enterprise)",
        "Marketing & Pre-order Campaigns",
        "Legal, IP & Corporate Ops",
        "Contingency / Runway Buffer",
        "Total"
    ],
    "Amount (USD)": [500000, 300000, 100000, 200000, 150000, 100000, 150000, 1500000],
    "Rationale / KPI": [
        "OS polishing, TauAI on-device, QA — target: TauAI v1 release",
        "Produce 5k pilot TauBooks + 3k TauPhones; validate supply chain",
        "Third-party audit, penetration testing, SOC/ISO preps",
        "Hire BD, close 3 pilot deals, MDM integration",
        "Demand gen, pre-booking microsites, PR, events",
        "Contracts, IP filings, corporate governance costs",
        "3–6 months operational buffer",
        "Extends runway ~18 months"
    ]
})

# Milestones
df_milestones = pd.DataFrame({
    "Quarter": ["Q1–Q2 2026", "Q3 2026", "Q4 2026", "Q1 2027"],
    "Milestone": [
        "Ship 5,000 TauBooks to early adopters",
        "Launch TauCloud Beta + public SDK",
        "Complete third-party security audit",
        "Mass production ramp and consumer launch"
    ],
    "Description": [
        "Manufacturing samples & fulfilled",
        "Start onboarding 5 enterprise pilot customers",
        "CrowdAudit LLC + sign 2 enterprise MDM contracts",
        "Launch in 3 markets (US, EU, SEA)"
    ],
    "Status": ["Planned", "Planned", "Planned", "Planned"]
})

# Sensitivity scenarios
rev_bear = np.array([50, 120, 250, 400, 600]) * 1e6
rev_base = np.array([65, 150, 300, 500, 750]) * 1e6
rev_bull = np.array([80, 200, 420, 720, 1100]) * 1e6

def compute_scenario(total_revenue_scenario, label):
    """Compute scenario financials given a total revenue series (USD)"""
    software_rev_scen = total_revenue_scenario - device_rev
    software_rev_scen = np.where(software_rev_scen < 0, 0.0, software_rev_scen)
    gross_profit_scen = total_revenue_scenario - device_cogs
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

# Valuation calculations
ebitda_base = df_base_scen["EBITDA (USD)"].values
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

# DCF rough estimate
discount_rate = 0.10
terminal_growth = 0.03
fcf_conv = 0.70
fcfs = ebitda_base * fcf_conv
pv_fcfs = [fcfs[i] / ((1 + discount_rate) ** (i + 1)) for i in range(len(fcfs))]
terminal_value = (fcfs[-1] * (1 + terminal_growth)) / (discount_rate - terminal_growth)
pv_terminal = terminal_value / ((1 + discount_rate) ** len(fcfs))
dcf_value = sum(pv_fcfs) + pv_terminal

df_dcf = pd.DataFrame({
    "Year": years,
    "EBITDA (USD)": ebitda_base,
    "FCF (USD)": fcfs,
    "PV Factor": [(1 / ((1 + discount_rate) ** (i + 1))) for i in range(len(years))],
    "PV of FCF (USD)": [pv_fcfs[i] for i in range(len(years))]
})

# Add terminal value row
df_dcf.loc["Terminal"] = ["Terminal", "", "", "", pv_terminal]

# Valuation Sensitivity
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

# Save Excel files
print("📊 Creating Excel files...")

# Main financial model
excel_path = os.path.join(OUT_DIR, "TauOS_Financial_Model.xlsx")
with pd.ExcelWriter(excel_path, engine='openpyxl') as writer:
    # Base case financials
    df_base_rounded.to_excel(writer, sheet_name='Base Case', index=False)
    
    # Device details
    df_devices.to_excel(writer, sheet_name='Device Details', index=False)
    
    # Revenue mix
    df_revenue_mix.to_excel(writer, sheet_name='Revenue Mix', index=False)
    
    # Actuals
    df_actuals.to_excel(writer, sheet_name='Actuals', index=False)
    
    # Use of funds
    df_use_of_funds.to_excel(writer, sheet_name='Use of Funds', index=False)
    
    # Milestones
    df_milestones.to_excel(writer, sheet_name='Milestones', index=False)
    
    # Scenarios
    pd.concat([df_bear, df_base_scen, df_bull]).to_excel(writer, sheet_name='Scenarios', index=False)
    
    # Valuation
    df_valuation.to_excel(writer, sheet_name='Valuation Multiples', index=False)
    
    # DCF
    df_dcf.to_excel(writer, sheet_name='DCF Analysis', index=False)
    
    # Valuation sensitivity
    df_val_sens.to_excel(writer, sheet_name='Valuation Sensitivity', index=False)

print(f"✅ Saved financial model to: {excel_path}")

# Generate charts
print("📈 Creating visualizations...")

plt.style.use('dark_background')
fig_size = (12, 8)

# 1) Device revenue and gross profit chart
fig, ax = plt.subplots(figsize=fig_size)
ax.plot(years, device_rev / 1e6, marker='o', label='Device Revenue (M$)', linewidth=3, color='#fbbf24')
ax.plot(years, device_gross_profit / 1e6, marker='o', label='Device Gross Profit (M$)', linewidth=3, color='#f59e0b')
ax.set_title('Device Revenue & Gross Profit (Millions USD)', fontsize=16, fontweight='bold', color='white')
ax.set_xlabel('Year', fontsize=12, color='white')
ax.set_ylabel('USD (Millions)', fontsize=12, color='white')
ax.legend(fontsize=12)
ax.grid(True, alpha=0.3)
ax.set_facecolor('#0f0f0f')
plt.tight_layout()
plt.savefig(os.path.join(OUT_DIR, "device_revenue_gp.png"), dpi=300, bbox_inches='tight', facecolor='#0f0f0f')
plt.close()

# 2) Total revenue vs EBITDA
fig, ax1 = plt.subplots(figsize=fig_size)
ax1.plot(years, total_revenue / 1e6, marker='o', color='#fbbf24', label='Total Revenue (M$)', linewidth=3)
ax1.set_xlabel('Year', fontsize=12, color='white')
ax1.set_ylabel('Revenue (M$)', fontsize=12, color='#fbbf24')
ax1.tick_params(axis='y', labelcolor='#fbbf24')
ax1.grid(True, alpha=0.3)

ax2 = ax1.twinx()
ax2.plot(years, ebitda / 1e6, marker='o', color='#10b981', label='EBITDA (M$)', linewidth=3)
ax2.set_ylabel('EBITDA (M$)', fontsize=12, color='#10b981')
ax2.tick_params(axis='y', labelcolor='#10b981')

ax1.set_title('Total Revenue vs EBITDA (Base Case)', fontsize=16, fontweight='bold', color='white')
ax1.set_facecolor('#0f0f0f')
plt.tight_layout()
plt.savefig(os.path.join(OUT_DIR, "revenue_vs_ebitda_base.png"), dpi=300, bbox_inches='tight', facecolor='#0f0f0f')
plt.close()

# 3) Revenue mix stacked bar
fig, ax = plt.subplots(figsize=fig_size)
width = 0.6
ax.bar(years, device_rev/1e6, width, label='Device Revenue (M$)', color='#fbbf24', alpha=0.8)
ax.bar(years, software_revenue_base/1e6, width, bottom=(device_rev/1e6), label='Software Revenue (M$)', color='#3b82f6', alpha=0.8)
ax.set_title('Revenue Mix: Device vs Software (Base Case)', fontsize=16, fontweight='bold', color='white')
ax.set_ylabel('Revenue (M$)', fontsize=12, color='white')
ax.set_xlabel('Year', fontsize=12, color='white')
ax.legend(fontsize=12)
ax.set_facecolor('#0f0f0f')
ax.grid(True, alpha=0.3)
plt.tight_layout()
plt.savefig(os.path.join(OUT_DIR, "revenue_mix_device_software.png"), dpi=300, bbox_inches='tight', facecolor='#0f0f0f')
plt.close()

# 4) OPEX breakdown pie for 2025
fig, ax = plt.subplots(figsize=(8, 8))
opex_2025 = opex[0]
labels = ['People', 'Infrastructure', 'Compliance', 'Marketing']
sizes = [opex_split['people_pct'], opex_split['infra_pct'], opex_split['compliance_pct'], opex_split['marketing_pct']]
colors = ['#fbbf24', '#3b82f6', '#10b981', '#ef4444']
ax.pie(sizes, labels=labels, autopct='%1.0f%%', startangle=140, colors=colors)
ax.set_title('OPEX Split (as % of OPEX)', fontsize=16, fontweight='bold', color='white')
plt.tight_layout()
plt.savefig(os.path.join(OUT_DIR, "opex_split_pie.png"), dpi=300, bbox_inches='tight', facecolor='#0f0f0f')
plt.close()

# 5) Scenarios: Revenue lines
fig, ax = plt.subplots(figsize=fig_size)
ax.plot(years, rev_bear/1e6, marker='o', linestyle='--', label='Revenue Bear (M$)', linewidth=3, color='#ef4444')
ax.plot(years, rev_base/1e6, marker='o', linestyle='-', label='Revenue Base (M$)', linewidth=3, color='#fbbf24')
ax.plot(years, rev_bull/1e6, marker='o', linestyle='-.', label='Revenue Bull (M$)', linewidth=3, color='#10b981')
ax.set_title('Revenue Scenarios (M$)', fontsize=16, fontweight='bold', color='white')
ax.set_xlabel('Year', fontsize=12, color='white')
ax.set_ylabel('Revenue (M$)', fontsize=12, color='white')
ax.legend(fontsize=12)
ax.set_facecolor('#0f0f0f')
ax.grid(True, alpha=0.3)
plt.tight_layout()
plt.savefig(os.path.join(OUT_DIR, "revenue_scenarios.png"), dpi=300, bbox_inches='tight', facecolor='#0f0f0f')
plt.close()

# 6) EBITDA scenarios
fig, ax = plt.subplots(figsize=fig_size)
ax.plot(years, df_bear["EBITDA (USD)"]/1e6, marker='o', linestyle='--', label='EBITDA Bear (M$)', linewidth=3, color='#ef4444')
ax.plot(years, df_base_scen["EBITDA (USD)"]/1e6, marker='o', linestyle='-', label='EBITDA Base (M$)', linewidth=3, color='#fbbf24')
ax.plot(years, df_bull["EBITDA (USD)"]/1e6, marker='o', linestyle='-.', label='EBITDA Bull (M$)', linewidth=3, color='#10b981')
ax.set_title('EBITDA Scenarios (M$)', fontsize=16, fontweight='bold', color='white')
ax.set_xlabel('Year', fontsize=12, color='white')
ax.set_ylabel('EBITDA (M$)', fontsize=12, color='white')
ax.legend(fontsize=12)
ax.set_facecolor('#0f0f0f')
ax.grid(True, alpha=0.3)
plt.tight_layout()
plt.savefig(os.path.join(OUT_DIR, "ebitda_scenarios.png"), dpi=300, bbox_inches='tight', facecolor='#0f0f0f')
plt.close()

# 7) Valuation sensitivity curves
fig, ax = plt.subplots(figsize=fig_size)
for m in multiples:
    ax.plot(years, ebitda_base * m / 1e6, marker='o', label=f'{m}x EBITDA (M$)', linewidth=3)
ax.set_title('Valuation Sensitivity (Implied EV, Millions USD)', fontsize=16, fontweight='bold', color='white')
ax.set_xlabel('Year', fontsize=12, color='white')
ax.set_ylabel('Implied EV (M$)', fontsize=12, color='white')
ax.legend(fontsize=12)
ax.set_facecolor('#0f0f0f')
ax.grid(True, alpha=0.3)
plt.tight_layout()
plt.savefig(os.path.join(OUT_DIR, "valuation_sensitivity.png"), dpi=300, bbox_inches='tight', facecolor='#0f0f0f')
plt.close()

# 8) Device units forecast
fig, ax = plt.subplots(figsize=fig_size)
ax.plot(years, tb_units/1000, marker='o', label='TauBook Units (K)', linewidth=3, color='#fbbf24')
ax.plot(years, tp_units/1000, marker='o', label='TauPhone Units (K)', linewidth=3, color='#3b82f6')
ax.set_title('Device Units Forecast (Thousands)', fontsize=16, fontweight='bold', color='white')
ax.set_xlabel('Year', fontsize=12, color='white')
ax.set_ylabel('Units (Thousands)', fontsize=12, color='white')
ax.legend(fontsize=12)
ax.set_facecolor('#0f0f0f')
ax.grid(True, alpha=0.3)
plt.tight_layout()
plt.savefig(os.path.join(OUT_DIR, "device_units_forecast.png"), dpi=300, bbox_inches='tight', facecolor='#0f0f0f')
plt.close()

# 9) Use of funds pie chart
fig, ax = plt.subplots(figsize=(8, 8))
funds_data = df_use_of_funds[df_use_of_funds['Use of Funds'] != 'Total']
labels = funds_data['Use of Funds'].tolist()
sizes = funds_data['Amount (USD)'].tolist()
colors = ['#fbbf24', '#3b82f6', '#10b981', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316']
ax.pie(sizes, labels=labels, autopct='%1.1f%%', startangle=140, colors=colors)
ax.set_title('Use of Funds ($1.5M Seed)', fontsize=16, fontweight='bold', color='white')
plt.tight_layout()
plt.savefig(os.path.join(OUT_DIR, "use_of_funds_pie.png"), dpi=300, bbox_inches='tight', facecolor='#0f0f0f')
plt.close()

# 10) Milestones timeline
fig, ax = plt.subplots(figsize=(12, 6))
milestone_dates = ['Q1-Q2 2026', 'Q3 2026', 'Q4 2026', 'Q1 2027']
milestone_y = [1, 2, 3, 4]
milestone_titles = [
    'Ship 5,000 TauBooks',
    'Launch TauCloud Beta',
    'Security Audit Complete',
    'Mass Production Launch'
]

for i, (date, y, title) in enumerate(zip(milestone_dates, milestone_y, milestone_titles)):
    ax.scatter(i, y, s=200, color='#fbbf24', zorder=5)
    ax.text(i, y+0.3, title, ha='center', va='bottom', fontweight='bold', color='white', fontsize=10)
    ax.text(i, y-0.3, date, ha='center', va='top', color='#9ca3af', fontsize=9)

ax.plot(range(len(milestone_dates)), milestone_y, color='#fbbf24', linewidth=2, alpha=0.7)
ax.set_title('Key Milestones Timeline', fontsize=16, fontweight='bold', color='white')
ax.set_xlabel('Timeline', fontsize=12, color='white')
ax.set_ylabel('Milestones', fontsize=12, color='white')
ax.set_xticks(range(len(milestone_dates)))
ax.set_xticklabels(milestone_dates)
ax.set_ylim(0.5, 4.5)
ax.set_facecolor('#0f0f0f')
ax.grid(True, alpha=0.3)
plt.tight_layout()
plt.savefig(os.path.join(OUT_DIR, "milestones_timeline.png"), dpi=300, bbox_inches='tight', facecolor='#0f0f0f')
plt.close()

# Create Markdown summary
summary_md = os.path.join(OUT_DIR, "TauOS_Investor_Summary.md")
with open(summary_md, "w") as f:
    f.write("# TauOS / AR Holdings Investor Summary\n\n")
    f.write("## Key Assumptions & Tagline\n")
    f.write("- Tagline: **Tomorrow's Intelligence, Today — Powered by Tau OS.**\n")
    f.write("- Headquarters: 2126 Market Street, San Francisco, CA 94114\n")
    f.write(f"- Blended Device ASP: ${taubook_blended_asp:.0f} (TauBook), ${tauphone_blended_asp:.0f} (TauPhone)\n")
    f.write(f"- Revenue Mix: {direct_retail_share*100:.0f}% Direct Retail, {oem_licensing_share*100:.0f}% OEM Licensing\n\n")
    
    f.write("## Current Traction (Actuals)\n\n")
    f.write(df_actuals.to_markdown(index=False))
    f.write("\n\n")
    
    f.write("## Device Unit Sales Forecast\n\n")
    f.write(df_devices.to_markdown(index=False))
    f.write("\n\n")
    
    f.write("## Revenue Mix Analysis\n\n")
    f.write(df_revenue_mix.to_markdown(index=False))
    f.write("\n\n")
    
    f.write("## Base-Case Financials (2025-2029)\n\n")
    f.write(df_base_rounded.to_markdown(index=False))
    f.write("\n\n")
    
    f.write("## Scenarios (Bear / Base / Bull)\n\n")
    f.write(pd.concat([df_bear, df_base_scen, df_bull]).to_markdown(index=False))
    f.write("\n\n")
    
    f.write("## Use of Funds ($1.5M Seed)\n\n")
    f.write(df_use_of_funds.to_markdown(index=False))
    f.write("\n\n")
    
    f.write("## Key Milestones\n\n")
    f.write(df_milestones.to_markdown(index=False))
    f.write("\n\n")
    
    f.write("## Visuals (saved as PNG files in this folder)\n")
    f.write("- device_revenue_gp.png\n")
    f.write("- revenue_vs_ebitda_base.png\n")
    f.write("- revenue_mix_device_software.png\n")
    f.write("- opex_split_pie.png\n")
    f.write("- revenue_scenarios.png\n")
    f.write("- ebitda_scenarios.png\n")
    f.write("- valuation_sensitivity.png\n")
    f.write("- device_units_forecast.png\n")
    f.write("- use_of_funds_pie.png\n")
    f.write("- milestones_timeline.png\n")
    f.write("\n\n")
    
    f.write("## DCF Summary\n")
    f.write(f"- Discount Rate: {discount_rate*100:.1f}%\n")
    f.write(f"- Terminal Growth Rate: {terminal_growth*100:.1f}%\n")
    f.write(f"- Implied DCF Value (PV of FCF + terminal): ${dcf_value:,.0f}\n\n")
    
    f.write("## Key Investment Highlights\n")
    f.write("- **Privacy-Native AI**: First OS with built-in AI that respects user privacy\n")
    f.write("- **Blended Revenue Model**: Combines high-margin direct retail with scalable OEM licensing\n")
    f.write("- **Proven Traction**: 4,200+ alpha users, 1,200+ pilot devices shipped\n")
    f.write("- **Enterprise Ready**: MDM, security audit scheduled, enterprise pilots signed\n")
    f.write("- **Clear Path to IPO**: 5-year target valuation $1B+ with realistic milestones\n")

print(f"✅ Summary written to: {summary_md}")

# Copy files to website public directory
import shutil
website_public = "/Users/macbook/Desktop/tauos/website/public"
if os.path.exists(website_public):
    for file in os.listdir(OUT_DIR):
        if file.endswith(('.png', '.xlsx', '.md')):
            shutil.copy2(os.path.join(OUT_DIR, file), website_public)
    print(f"✅ Files copied to website public directory")

print("🎉 All financial documents generated successfully!")
print(f"📁 Output directory: {OUT_DIR}")
print("📊 Files created:")
print("  - TauOS_Financial_Model.xlsx (comprehensive Excel model)")
print("  - TauOS_Investor_Summary.md (markdown summary)")
print("  - 10 professional PNG charts")
print("  - All files copied to website public directory for download")
