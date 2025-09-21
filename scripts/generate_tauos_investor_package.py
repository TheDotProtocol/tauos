# generate_tauos_investor_package.py
import os, math
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from PIL import Image
from fpdf import FPDF

OUT = "output/tauos_investor_package"
IMG_OUT = os.path.join(OUT, "images")
os.makedirs(IMG_OUT, exist_ok=True)

# Company info (branding)
COMPANY_NAME = "AR Holdings Group Corporation"
SUBSIDIARY = "Tau Foundation / Tau LLC"
ADDRESS = "2126 Market Street, San Francisco, CA 94114, USA"
TAGLINE = "Tomorrow's Intelligence, Today - Powered by TauOS."
LOGO_FILE = "tauos_logo.png"  # must exist in working dir

# Years & base financials (Base case per earlier prompt)
years = [2025, 2026, 2027, 2028, 2029, 2030]
# Unit sales (example)
taubook_units = [20000, 50000, 90000, 150000, 225000, 300000]
tauphone_units = [35000, 100000, 175000, 300000, 450000, 600000]
taubook_oem, taubook_price = 650, 1099
tauphone_oem, tauphone_price = 420, 899

# Device revenues
tb_rev = np.array(taubook_units) * taubook_price
tp_rev = np.array(tauphone_units) * tauphone_price
device_rev = tb_rev + tp_rev
device_cogs = np.array(taubook_units) * taubook_oem + np.array(tauphone_units) * tauphone_oem
device_gp = device_rev - device_cogs

# Total revenue scenarios (simple illustrative)
rev_base = np.array([65, 150, 300, 500, 750, 1000]) * 1e6  # in USD
rev_bear = np.array([50, 120, 250, 400, 600, 800]) * 1e6
rev_bull = np.array([80, 200, 420, 720, 1100, 1500]) * 1e6

# Software rev = total - device_rev
software_base = rev_base - device_rev
software_base = np.where(software_base < 0, 0, software_base)

# Opex ratios improving over time
opex_ratios = np.linspace(0.60, 0.30, len(years))
opex_base = opex_ratios * rev_base
# split
people = opex_base * 0.40
infra = opex_base * 0.25
marketing = opex_base * 0.20
compliance = opex_base * 0.15

# EBITDA = gross profit - opex (gross profit = total rev - device cogs)
gross_profit_base = rev_base - device_cogs
ebitda_base = gross_profit_base - opex_base
ebitda_margin = ebitda_base / rev_base

# Build DataFrames
df_devices = pd.DataFrame({
    "Year": years,
    "TauBook Units": taubook_units,
    "TauPhone Units": tauphone_units,
    "TauBook Revenue (USD)": tb_rev,
    "TauPhone Revenue (USD)": tp_rev,
    "Device Revenue (USD)": device_rev,
    "Device COGS (USD)": device_cogs,
    "Device Gross Profit (USD)": device_gp
})
df_fin = pd.DataFrame({
    "Year": years,
    "Total Revenue (USD)": rev_base,
    "Device Revenue (USD)": device_rev,
    "Software Revenue (USD)": software_base,
    "Device COGS (USD)": device_cogs,
    "Gross Profit (USD)": gross_profit_base,
    "OPEX (USD)": opex_base,
    " - People (USD)": people,
    " - Infra (USD)": infra,
    " - Marketing (USD)": marketing,
    " - Compliance (USD)": compliance,
    "EBITDA (USD)": ebitda_base,
    "EBITDA Margin": ebitda_margin
})

# Save Excel workbook
excel_path = os.path.join(OUT, "TauOS_Financial_Model.xlsx")
with pd.ExcelWriter(excel_path, engine='openpyxl') as writer:
    df_fin.to_excel(writer, sheet_name="Base Case", index=False)
    df_devices.to_excel(writer, sheet_name="Devices", index=False)
    pd.DataFrame({"Bear Revenue": rev_bear, "Base Revenue": rev_base, "Bull Revenue": rev_bull}).to_excel(writer, sheet_name="Scenarios", index=False)
    assumptions = {
        "Blended ASP (device)": ["~$400 (70% OEM @ $150, 30% retail @ $999)"],
        "OPEX ratios start->end": [f"{opex_ratios[0]:.2f} -> {opex_ratios[-1]:.2f}"],
        "Company Address": [ADDRESS]
    }
    pd.DataFrame.from_dict(assumptions, orient='index').to_excel(writer, sheet_name="Assumptions")

print("Excel model saved:", excel_path)

# --- PLOTS
plt.style.use('default')
def save_fig(fig, name):
    path = os.path.join(IMG_OUT, name)
    fig.savefig(path, bbox_inches='tight', dpi=200)
    print("Saved:", path)

# Device revenue & GP
fig, ax = plt.subplots(figsize=(10,6))
ax.plot(years, device_rev/1e6, marker='o', label='Device Revenue (M$)')
ax.plot(years, device_gp/1e6, marker='o', label='Device GP (M$)')
ax.set_title('Device Revenue & Gross Profit (Millions USD)')
ax.set_xlabel('Year'); ax.set_ylabel('USD (Millions)')
ax.legend(); save_fig(fig, "device_revenue_gp.png"); plt.close(fig)

# Revenue vs EBITDA
fig, ax1 = plt.subplots(figsize=(10,6))
ax1.plot(years, rev_base/1e6, marker='o', color='tab:blue', label='Total Revenue (M$)')
ax2 = ax1.twinx()
ax2.plot(years, ebitda_base/1e6, marker='o', color='tab:green', label='EBITDA (M$)')
ax1.set_xlabel('Year'); ax1.set_ylabel('Revenue (M$)', color='tab:blue'); ax2.set_ylabel('EBITDA (M$)', color='tab:green')
ax1.set_title('Total Revenue vs EBITDA (Base Case)')
save_fig(fig, "revenue_vs_ebitda.png"); plt.close(fig)

# Revenue mix stacked
fig, ax = plt.subplots(figsize=(10,6))
ax.bar(years, device_rev/1e6, label='Device Rev (M$)')
ax.bar(years, software_base/1e6, bottom=device_rev/1e6, label='Software Rev (M$)')
ax.set_title('Revenue Mix (Device vs Software)'); ax.set_ylabel('USD (M$)')
ax.legend(); save_fig(fig, "revenue_mix.png"); plt.close(fig)

# OPEX split pie (example)
fig, ax = plt.subplots(figsize=(6,6))
sizes = [0.40, 0.25, 0.20, 0.15]
labels = ['People', 'Infrastructure', 'Marketing', 'Compliance']
ax.pie(sizes, labels=labels, autopct='%1.0f%%', startangle=140)
ax.set_title('OPEX Split (as % of OPEX)')
save_fig(fig, "opex_split.png"); plt.close(fig)

# Device units forecast
fig, ax = plt.subplots(figsize=(10,6))
ax.bar(years, taubook_units, label='TauBook Units')
ax.bar(years, tauphone_units, bottom=taubook_units, label='TauPhone Units')
ax.set_title('Device Unit Sales Forecast'); ax.set_ylabel('Units'); ax.legend()
save_fig(fig, "device_units_forecast.png"); plt.close(fig)

# Valuation sensitivity (using base EBITDA approx)
ebitda_base_vals = ebitda_base
multiples = [5,7,10]
fig, ax = plt.subplots(figsize=(10,6))
for m in multiples:
    ax.plot(years, ebitda_base_vals * m / 1e6, marker='o', label=f'{m}x EBITDA (M$)')
ax.set_title('Valuation Sensitivity (Implied EV, Millions USD)')
ax.legend(); save_fig(fig, "valuation_sensitivity.png"); plt.close(fig)

# Use of Funds pie
uof_labels = ['R&D', 'Manufacturing', 'Security Audit', 'Sales/BD', 'Marketing', 'Legal/Ops', 'Contingency']
uof_vals = [500000,300000,100000,200000,150000,100000,150000]
fig, ax = plt.subplots(figsize=(6,6))
ax.pie(uof_vals, labels=uof_labels, autopct='%1.0f%%', startangle=140)
ax.set_title('Use of Funds (Seed $1.5M)')
save_fig(fig, "use_of_funds_pie.png"); plt.close(fig)

# Create a simple Milestones timeline (PNG)
fig, ax = plt.subplots(figsize=(10,2))
milestones = ["Q1-Q2 2026: 5k TauBooks", "Q3 2026: TauCloud Beta", "Q4 2026: Security Audit", "Q1 2027: Mass Launch"]
x_pos = [1, 2.75, 4.5, 6.25]
for i, (x, m) in enumerate(zip(x_pos, milestones)):
    ax.text(x, 0.5, m, ha='center', va='center', bbox=dict(boxstyle="round", fc="wheat", ec="0.5"))
ax.set_axis_off()
save_fig(fig, "milestones_timeline.png"); plt.close(fig)

# --- Build Branded PDF investor deck (simple multi-page) using FPDF
class PDFDeck(FPDF):
    def header(self):
        if os.path.exists(LOGO_FILE):
            self.image(LOGO_FILE, 10, 8, 30)
        self.set_font("Helvetica", "B", 12)
        self.cell(0, 10, COMPANY_NAME, new_x="LMARGIN", new_y="NEXT", align='R')
        self.ln(5)
    def footer(self):
        self.set_y(-15)
        self.set_font('Helvetica', 'I', 8)
        self.cell(0, 10, f'{COMPANY_NAME} - {ADDRESS}', 0, 0, 'C')

pdf = PDFDeck()
pdf.set_auto_page_break(auto=True, margin=15)

# Cover
pdf.add_page()
pdf.set_font("Helvetica", "B", 20)
pdf.cell(0, 10, "TauOS - Investor Deck", new_x="LMARGIN", new_y="NEXT", align='C')
pdf.ln(5)
pdf.set_font("Helvetica", "", 12)
pdf.multi_cell(0, 8, TAGLINE, align='C')
pdf.ln(10)
# Add intro slide
pdf.add_page()
pdf.set_font("Helvetica", "B", 16); pdf.cell(0,8, "Executive Summary", new_x="LMARGIN", new_y="NEXT")
pdf.set_font("Helvetica", "", 11)
pdf.multi_cell(0,6, "TauOS is an AI-native hybrid operating system combining privacy, devices, and cloud services. We are raising $1.5M to execute pilot shipments, launch TauCloud beta, and onboard enterprise pilots.")
# Add team slide
pdf.add_page()
pdf.set_font("Helvetica", "B", 16); pdf.cell(0,8, "Leadership", new_x="LMARGIN", new_y="NEXT")
pdf.set_font("Helvetica", "", 11)
pdf.multi_cell(0,6, "Saleena Thamani - CEO\nKelsey Morgan - CTO\nRudra Narayanan - Head of Business & Strategy\nTimothy Burton - Chairman")
# Add visuals - embed one or two PNGs
for img in ["revenue_vs_ebitda.png", "device_units_forecast.png", "use_of_funds_pie.png"]:
    img_path = os.path.join(IMG_OUT, img)
    if os.path.exists(img_path):
        pdf.add_page()
        pdf.image(img_path, x=15, y=30, w=180)
# Save PDF
pdf_path = os.path.join(OUT, "TauOS_Investor_Deck.pdf")
pdf.output(pdf_path)
print("PDF Deck saved:", pdf_path)

# One-page snapshot PDF
pdf2 = PDFDeck()
pdf2.add_page()
pdf2.set_font("Helvetica", "B", 16); pdf2.cell(0,8, "TauOS - Investor Snapshot", new_x="LMARGIN", new_y="NEXT")
pdf2.ln(4)
pdf2.set_font("Helvetica", "", 11)
pdf2.multi_cell(0,6, f"Tagline: {TAGLINE}\nRaise: $1.5M Seed\nBlended ASP: ~$400\n2026 Projection: $43M\n5-year Target: $750M revenue")
# embed one image summary
img_path = os.path.join(IMG_OUT, "device_revenue_gp.png")
if os.path.exists(img_path):
    pdf2.image(img_path, x=15, y=60, w=180)
snap_path = os.path.join(OUT, "TauOS_Investor_Snapshot.pdf")
pdf2.output(snap_path)
print("Investor snapshot saved:", snap_path)

# Create a ZIP of the package
import zipfile
zipf = os.path.join(OUT, "tauos_investor_package.zip")
with zipfile.ZipFile(zipf, 'w', zipfile.ZIP_DEFLATED) as z:
    for root, dirs, files in os.walk(OUT):
        for file in files:
            z.write(os.path.join(root, file), arcname=os.path.relpath(os.path.join(root, file), OUT))
print("Zipped package:", zipf)

print("All done. Files available in:", OUT)
