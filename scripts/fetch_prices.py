"""Fetch financial prices: BCB USD/BOB + yfinance commodities."""
import json
import re
import sys
from datetime import datetime, timezone

import httpx
import yfinance as yf
from bs4 import BeautifulSoup

BCB_URL = "https://www.bcb.gob.bo/"
COMMODITIES = {
    "WTI": {"ticker": "CL=F", "unit": "USD/barril", "label": "WTI Crudo"},
    "BRENT": {"ticker": "BZ=F", "unit": "USD/barril", "label": "Brent Crudo"},
    "HENRY_HUB": {"ticker": "NG=F", "unit": "USD/MMBtu", "label": "Henry Hub"},
    "TTF": {"ticker": "TTF=F", "unit": "EUR/MWh", "label": "TTF Gas Europeo"},
}


def fetch_usd_bob() -> dict[str, float]:
    text = httpx.get(BCB_URL, timeout=30).text
    soup = BeautifulSoup(text, "html.parser")
    body = soup.get_text()

    buy = sell = None
    lines = [ln.strip() for ln in body.splitlines() if ln.strip()]

    in_referential = False
    for i, line in enumerate(lines):
        if "Valor referencial del d" in line:
            in_referential = True
            continue
        if not in_referential:
            continue
        if line == "Compra" and i + 1 < len(lines):
            buy = float(lines[i + 1].replace(",", "."))
        elif line == "Venta" and i + 1 < len(lines):
            sell = float(lines[i + 1].replace(",", "."))
            break

    if buy is None or sell is None:
        raise ValueError(f"No se pudo parsear USD/BOB de {BCB_URL}. buy={buy} sell={sell}")

    return {"buy": buy, "sell": sell}


def fetch_commodities() -> dict[str, dict]:
    result = {}
    for key, info in COMMODITIES.items():
        t = yf.Ticker(info["ticker"])
        hist = t.history(period="1d")
        if hist.empty:
            raise ValueError(f"No data from yfinance for {info['ticker']}")
        price = round(float(hist["Close"].iloc[-1]), 4)
        result[key] = {"price": price, "unit": info["unit"], "label": info["label"]}
    return result


def main() -> None:
    output_path = "data/prices.json"

    try:
        usd_bob = fetch_usd_bob()
    except Exception as exc:
        print(f"[BCB ERROR] {exc}", file=sys.stderr)
        try:
            with open(output_path, encoding="utf-8") as f:
                prev = json.load(f)
            usd_bob = prev["usd_bob"]
            print("[BCB] Using cached USD/BOB values", file=sys.stderr)
        except Exception:
            print("[BCB] No cached values — aborting", file=sys.stderr)
            sys.exit(1)

    try:
        commodities = fetch_commodities()
    except Exception as exc:
        print(f"[YFINANCE ERROR] {exc}", file=sys.stderr)
        try:
            with open(output_path, encoding="utf-8") as f:
                prev = json.load(f)
            commodities = prev["commodities"]
            print("[YFINANCE] Using cached commodity values", file=sys.stderr)
        except Exception:
            print("[YFINANCE] No cached values — aborting", file=sys.stderr)
            sys.exit(1)

    data = {
        "updated": datetime.now(timezone.utc).isoformat(),
        "usd_bob": usd_bob,
        "commodities": commodities,
    }

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write("\n")

    print(json.dumps(data, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
