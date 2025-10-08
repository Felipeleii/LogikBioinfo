import argparse
from pathlib import Path
import fitz  # PyMuPDF

def pdf_to_png(pdf_path: Path, out_path: Path, dpi: int = 300, all_pages: bool = False):
    zoom = dpi / 72.0  # 72 dpi é o baseline do PDF
    mat = fitz.Matrix(zoom, zoom)

    with fitz.open(pdf_path) as doc:
        pages = range(len(doc)) if all_pages else range(1)  # 0 = primeira página
        for i in pages:
            pix = doc.load_page(i).get_pixmap(matrix=mat, alpha=False)
            if all_pages:
                stem = f"{pdf_path.stem}-{i+1}"
                out_file = out_path.with_name(f"{stem}.png")
            else:
                out_file = out_path.with_suffix(".png")
            out_file.parent.mkdir(parents=True, exist_ok=True)
            pix.save(out_file.as_posix())

def main():
    parser = argparse.ArgumentParser(description="Converter PDFs em PNG")
    parser.add_argument("--dir", default=".", help="Diretório com os PDFs (default: .)")
    parser.add_argument("--dpi", type=int, default=300, help="Resolução de saída em DPI (default: 300)")
    parser.add_argument("--all-pages", action="store_true", help="Converter todas as páginas (gera vários PNGs)")
    parser.add_argument("--outdir", default=".", help="Diretório de saída (default: mesmo diretório)")
    args = parser.parse_args()

    base_dir = Path(args.dir).resolve()
    out_dir = Path(args.outdir).resolve()

    pdfs = sorted(base_dir.glob("*.pdf"))
    if not pdfs:
        print(f"Nenhum PDF encontrado em: {base_dir}")
        return

    print(f"Convertendo {len(pdfs)} PDF(s) de {base_dir} para PNG em {out_dir} @ {args.dpi} DPI ...")
    for pdf in pdfs:
        out_png = (out_dir / pdf.name).with_suffix(".png")
        try:
            pdf_to_png(pdf, out_png, dpi=args.dpi, all_pages=args.all_pages)
            print(f"OK: {pdf.name} -> {out_png.name if not args.all_pages else out_png.parent}")
        except Exception as e:
            print(f"ERRO: {pdf.name} -> {e}")

if __name__ == "__main__":
    main()