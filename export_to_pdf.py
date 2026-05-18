"""Convert paper.md to professional academic PDF using fpdf2 (pure Python, always works)"""
import re
from fpdf import FPDF

# Map emoji characters from markdown to ASCII for PDF rendering
EMOJI_MAP = {
    '\u2705': 'Si',      # ✅
    '\u26a0': '!!',       # ⚠️
    '\ufe0f': '',         # variation selector
    '\u274c': 'No',       # ❌
    '\u2013': '--',       # en dash
    '\u2014': '---',      # em dash
    '\u2018': "'",        # left single quote
    '\u2019': "'",        # right single quote
    '\u201c': '"',        # left double quote
    '\u201d': '"',        # right double quote
    '\u2026': '...',      # ellipsis
    '\u2265': '>=',       # greater or equal
}

def sanitize(text):
    for emoji, replacement in EMOJI_MAP.items():
        text = text.replace(emoji, replacement)
    return text

class AcademicPDF(FPDF):
    def __init__(self):
        super().__init__('P', 'mm', 'A4')
        self.set_auto_page_break(True, 25)
        # Arial Unicode as Serif (academic look)
        self.add_font("Serif", "", "C:/Windows/Fonts/arial.ttf")
        self.add_font("Serif", "B", "C:/Windows/Fonts/arialbd.ttf")
        self.add_font("Serif", "I", "C:/Windows/Fonts/ariali.ttf")
        self.add_font("Serif", "BI", "C:/Windows/Fonts/arialbi.ttf")

    def header(self):
        if self.page_no() > 1:
            self.set_font("Serif", "I", 8)
            self.set_text_color(120, 120, 120)
            self.cell(0, 5, "Government Take en Upstream de Hidrocarburos — Benchmark 2024–2026", align="C")
            self.ln(6)

    def footer(self):
        self.set_y(-20)
        self.set_font("Serif", "", 9)
        self.set_text_color(100, 100, 100)
        self.cell(0, 10, str(self.page_no()), align="C")

    def write_body(self, size=11):
        self.set_font("Serif", "", size)
        self.set_text_color(30, 30, 30)

    def write_bold(self, size=11):
        self.set_font("Serif", "B", size)

    def write_italic(self, size=11):
        self.set_font("Serif", "I", size)


pdf = AcademicPDF()
pdf.set_left_margin(25)
pdf.set_right_margin(20)
pdf.add_page()

with open("govtake-sudamerica/paper.md", encoding="utf-8") as f:
    lines = f.readlines()

i = 0
in_table = False
table_data = []
table_align = []

def flush_table():
    global in_table, table_data, table_align
    if not table_data:
        return
    pdf.set_font("Serif", "", 8)
    col_w = (170 - 20) / max(len(r) for r in table_data)
    # Header row
    pdf.set_fill_color(44, 62, 80)
    pdf.set_text_color(255, 255, 255)
    pdf.set_font("Serif", "B", 8)
    for j, cell in enumerate(table_data[0]):
        pdf.cell(col_w, 5, cell.strip(), border=0, fill=True)
    pdf.ln()
    # Data rows
    pdf.set_text_color(30, 30, 30)
    pdf.set_font("Serif", "", 7.5)
    for row in table_data[1:]:
        if all(c.strip() in ("---", ":-:", "---:", ":---") or re.match(r"^[\-\s:]+$", c.strip()) for c in row):
            continue
        pdf.set_fill_color(248, 249, 250) if table_data.index(row) % 2 == 0 else pdf.set_fill_color(255, 255, 255)
        for j, cell in enumerate(row):
            if j < len(table_data[0]):
                pdf.cell(col_w, 4.5, cell.strip(), border=0, fill=True)
        pdf.ln()
    pdf.ln(3)
    in_table = False
    table_data = []
    table_align = []

while i < len(lines):
    line = lines[i].rstrip()
    line = sanitize(line)  # handle emoji/special chars

    # Skip YAML frontmatter delimiters
    if line.strip() == "---":
        i += 1
        continue

    # Quote block
    if line.startswith("> "):
        flush_table()
        pdf.set_font("Serif", "I", 9)
        pdf.set_text_color(80, 80, 80)
        pdf.set_x(25)
        pdf.multi_cell(165, 4.5, line[2:])
        pdf.set_text_color(30, 30, 30)
        i += 1
        continue

    # Table detection
    if "|" in line and line.strip().startswith("|"):
        if not in_table:
            flush_table()
            in_table = True
            table_data = []
        cells = [c.strip() for c in line.strip().split("|")[1:-1]]
        table_data.append(cells)
        i += 1
        continue
    else:
        if in_table:
            flush_table()

    # Headings
    if line.startswith("# ") and not line.startswith("## "):
        pdf.ln(6)
        pdf.set_font("Serif", "B", 16)
        pdf.multi_cell(0, 7, line[2:], align="C")
        pdf.ln(2)
    elif line.startswith("## "):
        pdf.ln(4)
        pdf.set_font("Serif", "B", 12)
        pdf.set_text_color(30, 30, 30)
        pdf.multi_cell(0, 6, line[3:])
        pdf.set_draw_color(50, 50, 50)
        pdf.line(25, pdf.get_y() + 0.5, 190, pdf.get_y() + 0.5)
        pdf.ln(2)
    elif line.startswith("### "):
        pdf.ln(2)
        pdf.set_font("Serif", "B", 11)
        pdf.multi_cell(0, 5.5, line[4:])
        pdf.ln(1)
    elif line.startswith("#### "):
        pdf.ln(1)
        pdf.set_font("Serif", "BI", 10.5)
        pdf.multi_cell(0, 5, line[5:])

    # Bold+italic inline handling for regular text
    elif line.strip():
        pdf.set_font("Serif", "", 10.5)
        pdf.set_text_color(30, 30, 30)

        # Split by inline formatting: **bold**, *italic*, `code`
        parts = re.split(r"(\*\*.*?\*\*|\*[^*].*?\*|`.*?`)", line)
        x_start = pdf.get_x()
        y_start = pdf.get_y()

        # Collect runs for this line
        runs = []
        for part in parts:
            if part.startswith("**") and part.endswith("**"):
                runs.append(("B", part[2:-2]))
            elif part.startswith("*") and part.endswith("*") and not part.startswith("**"):
                runs.append(("I", part[1:-1]))
            elif part.startswith("`") and part.endswith("`"):
                runs.append(("code", part[1:-1]))
            else:
                runs.append(("", part))

        # Write with word wrapping
        pdf.set_x(25)
        current_x = 25
        for style, text in runs:
            if style == "B":
                pdf.set_font("Serif", "B", 10.5)
            elif style == "I":
                pdf.set_font("Serif", "I", 10.5)
            elif style == "code":
                pdf.set_font("Serif", "", 9)
                pdf.set_text_color(80, 80, 80)
            else:
                pdf.set_font("Serif", "", 10.5)
                pdf.set_text_color(30, 30, 30)

            words = text.split(" ")
            for w_idx, word in enumerate(words):
                word_w = pdf.get_string_width(word + (" " if w_idx < len(words) - 1 else ""))
                if current_x + word_w > 190:
                    pdf.ln()
                    current_x = 25
                pdf.set_x(current_x)
                suffix = " " if w_idx < len(words) - 1 else ""
                pdf.cell(word_w, 5, word + suffix)
                current_x += word_w

        pdf.ln(6)
    else:
        pdf.ln(3)

    i += 1

# Flush any remaining table
flush_table()

pdf.output("govtake-sudamerica/paper.pdf")
print("✅ paper.pdf saved (fpdf2, academic formatting)")
