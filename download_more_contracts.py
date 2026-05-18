"""Download and parse the 10 most important remaining contracts"""
import fitz
import urllib.request
import os

contracts = {
    # 1. Guyana PSA 2016 - el más importante del paper
    "guyana_psa_2016_stabroek": "https://resourcecontracts.org/contract/ocds-591adf-1399550295/download/pdf",
    # 2. Guyana PSA 2023 - evolución del modelo  
    "guyana_psa_2023": "https://resourcecontracts.org/contract/ocds-591adf-2388489707/download/pdf",
    # 3. Peru Block XIX - licencia PERUPETRO
    "peru_block_xix_bpz": "https://resourcecontracts.org/contract/ocds-591adf-4109359446/download/pdf",
    # 4. Brazil ANP Concession model
    "brazil_anp_concession": "https://resourcecontracts.org/contract/ocds-591adf-2290683076/download/pdf",
    # 5. Mexico Shell-PEMEX PSC 2018 (era apertura)
    "mexico_shell_pemex_psc_2018": "https://resourcecontracts.org/contract/ocds-591adf-7565412350/download/pdf",
    # 6. Mexico Schlumberger service contract 2011
    "mexico_schlumberger_service_2011": "https://resourcecontracts.org/contract/ocds-591adf-1773665671/download/pdf",
    # 7. Bolivia Surubi - Repsol-YPFB 2006
    "bolivia_surubi_repsol_2006": "https://resourcecontracts.org/contract/ocds-591adf-6141206684/download/pdf",
    # 8. Bolivia Margarita - Repsol-BG-PAE-YPFB 2006
    "bolivia_margarita_2006": "https://resourcecontracts.org/contract/ocds-591adf-7590925822/download/pdf",
    # 9. Ecuador service contract (Repsol ampliacion 2010)
    "ecuador_repsol_block16_2010": "https://resourcecontracts.org/contract/ocds-591adf-5357825509/download/pdf",
    # 10. Trinidad MEEI Deepwater Model PSC (de energy.gov.tt)
    "trinidad_deepwater_psc_mee": "https://www.energy.gov.tt/wp-content/uploads/2013/11/Deep_Water_Depth_PSC.pdf",
}

os.makedirs("govtake-sudamerica/refs/contratos", exist_ok=True)

results = []
for name, url in contracts.items():
    pdf_path = f"govtake-sudamerica/refs/contratos/{name}.pdf"
    print(f"Downloading {name}...", end=" ")
    try:
        urllib.request.urlretrieve(url, pdf_path)
        doc = fitz.open(pdf_path)
        text = ""
        for page in doc:
            text += page.get_text()
        doc.close()
        
        txt_path = f"govtake-sudamerica/refs/contratos/{name}.txt"
        with open(txt_path, "w", encoding="utf-8") as f:
            f.write(text)
        
        lines = len(text.splitlines())
        print(f"OK: {len(text):,} chars, {lines:,} lines")
        results.append((name, "OK", lines))
    except Exception as e:
        print(f"FAIL: {e}")
        results.append((name, "FAIL", str(e)))

print("\n\n=== RESUMEN ===")
for name, status, detail in results:
    print(f"  {'✅' if status=='OK' else '❌'} {name}: {detail}")
