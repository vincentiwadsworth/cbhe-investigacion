"""Download and parse contract PDFs from ResourceContracts.org"""
import fitz  # PyMuPDF
import urllib.request
import os

contracts = {
    "colombia_lla141": "https://resourcecontracts.org/contract/ocds-591adf-3237738886/download/pdf",
    "colombia_parex_lla111": "https://resourcecontracts.org/contract/ocds-591adf-5291593449/download/pdf",
    "trinidad_deep_onshore": "https://resourcecontracts.org/contract/ocds-591adf-4370005060/download/pdf",
}

os.makedirs("govtake-sudamerica/refs/contratos", exist_ok=True)

for name, url in contracts.items():
    pdf_path = f"govtake-sudamerica/refs/contratos/{name}.pdf"
    print(f"Downloading {name}...")
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
        
        print(f"  OK: {len(text)} chars, {len(text.splitlines())} lines")
    except Exception as e:
        print(f"  FAIL: {e}")
