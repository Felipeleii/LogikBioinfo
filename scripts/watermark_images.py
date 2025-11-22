import argparse
from pathlib import Path
from typing import Iterable, Optional, Tuple

from PIL import Image, ImageDraw, ImageFont, PngImagePlugin

# piexif é usado para EXIF em JPEG/TIFF; não se aplica a PNG.
try:
    import piexif
except Exception:
    piexif = None


SUPPORTED_EXTS = {".png", ".jpg", ".jpeg", ".tif", ".tiff"}


def load_font(font_path: Optional[str], base_size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    if font_path:
        try:
            return ImageFont.truetype(font_path, base_size)
        except Exception:
            pass
    # Fallback
    try:
        # Tenta uma fonte comum do Windows
        return ImageFont.truetype("C:\\Windows\\Fonts\\arial.ttf", base_size)
    except Exception:
        return ImageFont.load_default()


def add_visible_watermark(
    im: Image.Image,
    text: str,
    mode: str = "diagonal",
    opacity: float = 0.2,
    scale: float = 0.06,
    margin: int = 24,
    font_path: Optional[str] = None,
) -> Image.Image:
    """
    Aplica marca d'água visível:
      - mode: "diagonal" (centro, girado ~30°) ou "corner" (inferior-direito)
      - opacity: 0..1
      - scale: fração da largura para definir o tamanho da fonte (~0.06 = 6% da largura)
    """
    if im.mode != "RGBA":
        base = im.convert("RGBA")
    else:
        base = im.copy()

    W, H = base.size
    font_size = max(14, int(W * scale))
    font = load_font(font_path, font_size)

    # Camada de watermark
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    # Cor branca com alpha conforme opacidade
    fill = (255, 255, 255, int(255 * max(0.0, min(1.0, opacity))))

    if mode == "corner":
        # Tamanho do texto
        text_bbox = draw.textbbox((0, 0), text, font=font)
        tw = text_bbox[2] - text_bbox[0]
        th = text_bbox[3] - text_bbox[1]
        x = W - tw - margin
        y = H - th - margin

        # Sombra sutil (preta transparente) + texto
        shadow_fill = (0, 0, 0, int(255 * opacity * 0.8))
        draw.text((x + 2, y + 2), text, font=font, fill=shadow_fill)
        draw.text((x, y), text, font=font, fill=fill)

    else:
        # "diagonal": renderiza em uma camada separada e gira
        tmp = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        tmp_draw = ImageDraw.Draw(tmp)

        # Texto no centro
        text_bbox = tmp_draw.textbbox((0, 0), text, font=font)
        tw = text_bbox[2] - text_bbox[0]
        th = text_bbox[3] - text_bbox[1]
        center = (W // 2 - tw // 2, H // 2 - th // 2)

        # Sombra leve
        shadow_fill = (0, 0, 0, int(255 * opacity * 0.6))
        tmp_draw.text((center[0] + 3, center[1] + 3), text, font=font, fill=shadow_fill)
        tmp_draw.text(center, text, font=font, fill=fill)

        # Rotaciona ~30 graus
        tmp = tmp.rotate(30, resample=Image.BICUBIC, expand=False)
        overlay = Image.alpha_composite(overlay, tmp)

    watermarked = Image.alpha_composite(base, overlay)
    return watermarked


def save_with_metadata(
    img: Image.Image,
    out_path: Path,
    author: Optional[str],
    copyright_text: Optional[str],
    url: Optional[str],
    license_text: Optional[str],
    source_ext: str,
):
    """
    Salva a imagem com metadados:
      - PNG: tEXt chunks (Copyright, Author, URL, License)
      - JPEG: EXIF Artist/ Copyright (via piexif)
      - TIFF: converte para PNG (com tEXt) por compatibilidade com web
    """
    out_ext = out_path.suffix.lower()

    if out_ext == ".png":
        pnginfo = PngImagePlugin.PngInfo()
        if copyright_text:
            pnginfo.add_text("Copyright", copyright_text)
        if author:
            pnginfo.add_text("Author", author)
        if url:
            pnginfo.add_text("URL", url)
        if license_text:
            pnginfo.add_text("License", license_text)

        # Para PNG, manter RGBA
        img.save(out_path.as_posix(), pnginfo=pnginfo, optimize=True)

    elif out_ext in {".jpg", ".jpeg"}:
        # JPEG não tem alpha
        rgb = img.convert("RGB")
        exif_bytes = None
        if piexif is not None:
            exif_dict = {"0th": {}, "Exif": {}, "GPS": {}, "1st": {}, "thumbnail": None}
            if author:
                exif_dict["0th"][piexif.ImageIFD.Artist] = author.encode("utf-8", "ignore")
            if copyright_text:
                exif_dict["0th"][piexif.ImageIFD.Copyright] = copyright_text.encode("utf-8", "ignore")
            # Opcional: XPAuthor (Windows) como UTF-16-LE
            if author:
                exif_dict["0th"][piexif.ImageIFD.XPAuthor] = author.encode("utf-16le")
            exif_bytes = piexif.dump(exif_dict)
        if exif_bytes:
            rgb.save(out_path.as_posix(), quality=90, subsampling=2, exif=exif_bytes, optimize=True)
        else:
            rgb.save(out_path.as_posix(), quality=90, subsampling=2, optimize=True)

    elif out_ext in {".tif", ".tiff"}:
        # Para web e metadados simples, melhor converter TIFF -> PNG
        out_png = out_path.with_suffix(".png")
        pnginfo = PngImagePlugin.PngInfo()
        if copyright_text:
            pnginfo.add_text("Copyright", copyright_text)
        if author:
            pnginfo.add_text("Author", author)
        if url:
            pnginfo.add_text("URL", url)
        if license_text:
            pnginfo.add_text("License", license_text)
        img.save(out_png.as_posix(), pnginfo=pnginfo, optimize=True)
    else:
        # Fallback: salva como PNG
        out_png = out_path.with_suffix(".png")
        img.save(out_png.as_posix(), optimize=True)


def process_images(
    in_dir: Path,
    out_dir: Path,
    include_exts: Optional[Iterable[str]],
    mode: str,
    opacity: float,
    scale: float,
    text: str,
    author: Optional[str],
    url: Optional[str],
    license_text: Optional[str],
    font: Optional[str],
    keep_ext: bool,
):
    out_dir.mkdir(parents=True, exist_ok=True)
    include = {e.lower().strip().lstrip(".") for e in include_exts} if include_exts else None

    files = sorted(p for p in in_dir.iterdir() if p.is_file() and p.suffix.lower() in SUPPORTED_EXTS)
    if not files:
        print(f"Nenhuma imagem suportada encontrada em: {in_dir}")
        return

    print(f"Processando {len(files)} arquivo(s) de {in_dir} -> {out_dir}")
    for src in files:
        stem = src.stem
        ext = src.suffix.lower().lstrip(".")
        if include and ext not in include:
            continue
        if stem.endswith("_wm"):
            # Evita reprocessar
            continue

        try:
            with Image.open(src) as im:
                wm = add_visible_watermark(
                    im,
                    text=text,
                    mode=mode,
                    opacity=opacity,
                    scale=scale,
                    font_path=font,
                )
                # Define extensão de saída
                if keep_ext and src.suffix.lower() in {".png", ".jpg", ".jpeg"}:
                    out_path = (out_dir / f"{stem}_wm").with_suffix(src.suffix.lower())
                else:
                    # Normaliza para PNG
                    out_path = (out_dir / f"{stem}_wm").with_suffix(".png")

                copyright_text = text  # Pode personalizar diferente do texto da marca
                save_with_metadata(
                    wm,
                    out_path,
                    author=author,
                    copyright_text=copyright_text,
                    url=url,
                    license_text=license_text,
                    source_ext=src.suffix.lower(),
                )
                print(f"OK: {src.name} -> {out_path.name}")
        except Exception as e:
            print(f"ERRO: {src.name} -> {e}")


def main():
    parser = argparse.ArgumentParser(description="Aplicar marca d'água e metadados de direitos autorais em lote.")
    parser.add_argument("--dir", required=True, help="Diretório de entrada com as imagens.")
    parser.add_argument("--outdir", required=True, help="Diretório de saída para salvar as imagens com marca d'água.")
    parser.add_argument("--include", nargs="*", help="Filtrar por extensões (ex.: png jpg). Default: todas suportadas.")
    parser.add_argument("--mode", choices=["diagonal", "corner"], default="diagonal", help="Tipo de marca d'água.")
    parser.add_argument("--opacity", type=float, default=0.2, help="Opacidade da marca (0..1).")
    parser.add_argument("--scale", type=float, default=0.06, help="Tamanho do texto como fração da largura (ex.: 0.06).")
    parser.add_argument("--text", default="© 2025 Felipe Alberto Lei | Logik Bioinfo", help="Texto da marca d'água e Copyright.")
    parser.add_argument("--author", default="Felipe Alberto Lei", help="Autor para metadados.")
    parser.add_argument("--url", default="https://felipeleii.github.io/LogikBioinfo/", help="URL para metadados.")
    parser.add_argument("--license", default="Todos os direitos reservados.", help="Licença para metadados.")
    parser.add_argument("--font", help="Caminho para uma fonte .ttf (opcional). Ex.: C:\\Windows\\Fonts\\arial.ttf")
    parser.add_argument("--keep-ext", action="store_true", help="Tentar manter a extensão (aplica-se a PNG/JPEG).")
    args = parser.parse_args()

    in_dir = Path(args.dir).resolve()
    out_dir = Path(args.outdir).resolve()
    if not in_dir.exists():
        print(f"ERRO: diretório de entrada não existe: {in_dir}")
        return

    process_images(
        in_dir=in_dir,
        out_dir=out_dir,
        include_exts=args.include,
        mode=args.mode,
        opacity=args.opacity,
        scale=args.scale,
        text=args.text,
        author=args.author,
        url=args.url,
        license_text=args.license,
        font=args.font,
        keep_ext=args.keep-ext if hasattr(args, "keep-ext") else False,
    )


if __name__ == "__main__":
    main()