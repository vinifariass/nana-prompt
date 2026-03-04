import fitz
import sys

def extract_text(pdf_path, out_path):
    doc = fitz.open(pdf_path)
    text = []
    for page in doc:
        text.append(page.get_text())
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write("\n".join(text))

supermarket_pdf = r"C:\Users\vinic\.gemini\antigravity\brain\0517abd8-0540-4584-a692-1d7ba2f3d535\.tempmediaStorage\1625762aee3e9458.pdf"
guanabara_pdf = r"C:\Users\vinic\.gemini\antigravity\brain\0517abd8-0540-4584-a692-1d7ba2f3d535\.tempmediaStorage\6975963dec0da7d7.pdf"

extract_text(supermarket_pdf, "supermarket_text.txt")
extract_text(guanabara_pdf, "guanabara_text.txt")
print("Extraction complete.")
