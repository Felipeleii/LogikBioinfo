import argparse
from pathlib import Path
import fitz  # PyMuPDF

def parse_pages(pages_str: str):
    # Aceita formatos como "6,12,15" ou "6-10,15"
    result = set()
    for part in pages_str.split(','):
        part = part.strip()
        if '-' in part:
            a, b = part.split('-', 1)
            a, b = int(a), int(b)
            if a > b:
                a, b = b, a
            result.update(range(a, b + 1))
        elif part:
            result.add(int(part))
    return sorted(result)

def main():
    parser = argparse.ArgumentParser(description="Exportar páginas específicas de um PDF para PNG (1-based).")
    parser.add_argument("--pdf", required=True, help="Caminho do arquivo PDF de entrada.")
    parser.add_argument("--pages", required=True, help='Páginas 1-based, ex: "6,12,15" ou intervalos "6-10,15".')
    parser.add_argument("--dpi", type=int, default=300, help="Resolução de saída (DPI). Default: 300")
    parser.add_argument("--outdir", default=".", help="Diretório de saída. Default: . (mesma pasta)")
    parser.add_argument("--prefix", default="", help="Prefixo opcional no nome do arquivo de saída.")
    args = parser.parse_args()

    pdf_path = Path(args.pdf).resolve()
    outdir = Path(args.outdir).resolve()
    outdir.mkdir(parents=True, exist_ok=True)

    if not pdf_path.exists():
        print(f"ERRO: PDF não encontrado: {pdf_path}")
        return

    pages = parse_pages(args.pages)
    if not pages:
        print("ERRO: lista de páginas vazia.")
        return

    zoom = args.dpi / 72.0
    mat = fitz.Matrix(zoom, zoom)

    with fitz.open(pdf_path) as doc:
        total = doc.page_count
        ok_count = 0
        for p in pages:
            if p < 1 or p > total:
                print(f"AVISO: página {p} fora do intervalo (1..{total}), ignorando.")
                continue
            idx = p - 1  # PyMuPDF usa 0-based
            page = doc.load_page(idx)
            pix = page.get_pixmap(matrix=mat, alpha=False)

            stem = pdf_path.stem
            prefix = f"{args.prefix}_" if args.prefix else ""
            outname = f"{prefix}{stem}_p{p:02d}.png"
            outpath = outdir / outname
            pix.save(outpath.as_posix())
            print(f"OK: página {p} -> {outpath}")
            ok_count += 1

    print(f"Concluído. {ok_count} página(s) exportada(s). Saída: {outdir}")

if __name__ == "__main__":
    main()