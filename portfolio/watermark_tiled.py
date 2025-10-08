import argparse
import math
from pathlib import Path
from typing import Optional, Tuple

from PIL import Image, ImageDraw, ImageFont, ImageColor

SUPPORTED_EXTS = {".png", ".jpg", ".jpeg", ".tif", ".tiff"}


def parse_color(color_str: str, alpha: float) -> Tuple[int, int, int, int]:
    """Converte cor em RGBA, aceitando nomes ('white') ou hex ('#FFFFFF')."""
    rgb = ImageColor.getrgb(color_str)
    a = int(255 * max(0.0, min(1.0, alpha)))
    if len(rgb) == 4:
        return (rgb[0], rgb[1], rgb[2], a)
    return (rgb[0], rgb[1], rgb[2], a)


def load_font(font_path: Optional[str], base_size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    """Carrega fonte; tenta fallback no Windows; por fim, default bitmap."""
    if font_path:
        try:
            return ImageFont.truetype(font_path, base_size)
        except Exception:
            pass
    # Tenta uma fonte comum do Windows
    for cand in [
        r"C:\Windows\Fonts\arial.ttf",
        r"C:\Windows\Fonts\calibri.ttf",
        r"C:\Windows\Fonts\seguiemj.ttf",
    ]:
        try:
            return ImageFont.truetype(cand, base_size)
        except Exception:
            continue
    return ImageFont.load_default()


def build_text_tile(
    text: str,
    font: ImageFont.ImageFont,
    fill: Tuple[int, int, int, int],
    stroke_width: int = 0,
    stroke_fill: Optional[Tuple[int, int, int, int]] = None,
    padding: int = 16,
) -> Image.Image:
    """Cria uma pequena imagem transparente contendo o texto com padding, para ser azulejado."""
    # Medidas do texto
    tmp = Image.new("RGBA", (1, 1), (0, 0, 0, 0))
    draw = ImageDraw.Draw(tmp)
    bbox = draw.textbbox((0, 0), text, font=font, stroke_width=stroke_width)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]

    tile_w = tw + 2 * padding
    tile_h = th + 2 * padding
    tile = Image.new("RGBA", (tile_w, tile_h), (0, 0, 0, 0))
    d = ImageDraw.Draw(tile)

    x = padding
    y = padding
    d.text(
        (x, y),
        text,
        font=font,
        fill=fill,
        stroke_width=stroke_width,
        stroke_fill=stroke_fill if stroke_fill else (0, 0, 0, 0),
    )
    return tile


def make_tiled_overlay(
    width: int,
    height: int,
    text_tile: Image.Image,
    spacing_scale: float = 1.0,
    angle_deg: float = 30.0,
    offset: Tuple[int, int] = (0, 0),
) -> Image.Image:
    """
    Gera uma camada RGBA com o padrão repetido:
    - spacing_scale controla a distância entre repetições (1.0 = encosta nas bordas do tile; >1.0 = mais espaço).
    - angle_deg define a rotação final (estilo Shutterstock).
    - offset aplica deslocamento x/y (pixels) para desalinhamento do padrão.
    """
    tw, th = text_tile.size

    # Tamanho maior que a imagem para evitar corte após rotação (usa diagonal)
    diag = int(math.hypot(width, height))
    canvas_w = diag + max(tw, th) * 2
    canvas_h = diag + max(tw, th) * 2
    big = Image.new("RGBA", (canvas_w, canvas_h), (0, 0, 0, 0))

    step_x = max(1, int(tw * spacing_scale))
    step_y = max(1, int(th * spacing_scale))

    # Ponto inicial (um pouco antes) para cobrir tudo
    start_x = -tw + offset[0]
    start_y = -th + offset[1]

    for y in range(start_y, canvas_h + th, step_y):
        for x in range(start_x, canvas_w + tw, step_x):
            big.alpha_composite(text_tile, (x, y))

    # Rotaciona o padrão
    rotated = big.rotate(angle_deg, resample=Image.BICUBIC, expand=False)

    # Recorta o centro no tamanho da imagem original
    left = (canvas_w - width) // 2
    top = (canvas_h - height) // 2
    overlay = rotated.crop((left, top, left + width, top + height))
    return overlay


def apply_tiled_watermark(
    image: Image.Image,
    text: str,
    opacity: float = 0.22,
    angle: float = 30.0,
    scale: float = 0.06,
    spacing: float = 2.2,
    color: str = "#FFFFFF",
    stroke_width: int = 2,
    stroke_color: str = "#000000",
    stroke_opacity: float = 0.5,
    font_path: Optional[str] = None,
    offset_x: int = 0,
    offset_y: int = 0,
) -> Image.Image:
    """
    Aplica o padrão repetido:
    - scale: tamanho do texto como fração da largura (0.06 = 6% da largura).
    - spacing: multiplicador da largura/altura do tile para controlar densidade do padrão.
    - opacity: opacidade do texto (0..1); stroke_opacity idem para contorno.
    """
    if image.mode != "RGBA":
        base = image.convert("RGBA")
    else:
        base = image.copy()

    W, H = base.size
    font_size = max(16, int(W * scale))
    font = load_font(font_path, font_size)

    fill = parse_color(color, opacity)
    stroke_fill = parse_color(stroke_color, stroke_opacity) if stroke_width > 0 else (0, 0, 0, 0)

    tile = build_text_tile(
        text=text,
        font=font,
        fill=fill,
        stroke_width=stroke_width,
        stroke_fill=stroke_fill,
        padding=max(8, font_size // 6),
    )

    overlay = make_tiled_overlay(
        width=W,
        height=H,
        text_tile=tile,
        spacing_scale=max(0.5, spacing),
        angle_deg=angle,
        offset=(offset_x, offset_y),
    )

    out = Image.alpha_composite(base, overlay)
    return out


def process_dir(
    in_dir: Path,
    out_dir: Path,
    text: str,
    opacity: float,
    angle: float,
    scale: float,
    spacing: float,
    color: str,
    stroke_width: int,
    stroke_color: str,
    stroke_opacity: float,
    font_path: Optional[str],
    keep_ext: bool,
):
    out_dir.mkdir(parents=True, exist_ok=True)
    files = sorted(p for p in in_dir.iterdir() if p.is_file() and p.suffix.lower() in SUPPORTED_EXTS)
    if not files:
        print(f"Nenhuma imagem suportada encontrada em: {in_dir}")
        return

    print(f"Processando {len(files)} arquivo(s) de {in_dir} -> {out_dir}")
    for src in files:
        if src.stem.endswith("_wm"):
            continue
        try:
            with Image.open(src) as im:
                out_im = apply_tiled_watermark(
                    im,
                    text=text,
                    opacity=opacity,
                    angle=angle,
                    scale=scale,
                    spacing=spacing,
                    color=color,
                    stroke_width=stroke_width,
                    stroke_color=stroke_color,
                    stroke_opacity=stroke_opacity,
                    font_path=font_path,
                )

                out_path = (out_dir / f"{src.stem}_wm").with_suffix(src.suffix.lower() if keep_ext and src.suffix.lower() in {'.png', '.jpg', '.jpeg'} else ".png")
                # JPEG não suporta alpha: converte para RGB ao salvar
                if out_path.suffix.lower() in {".jpg", ".jpeg"}:
                    out_im.convert("RGB").save(out_path.as_posix(), quality=90, subsampling=2, optimize=True)
                else:
                    out_im.save(out_path.as_posix(), optimize=True)
                print(f"OK: {src.name} -> {out_path.name}")
        except Exception as e:
            print(f"ERRO: {src.name} -> {e}")


def main():
    ap = argparse.ArgumentParser(description="Marca d'água em padrão repetido (estilo Shutterstock).")
    ap.add_argument("--dir", required=True, help="Diretório com imagens de entrada.")
    ap.add_argument("--outdir", required=True, help="Diretório de saída.")
    ap.add_argument("--text", default="© 2025 Felipe Alberto Lei | Logik Bioinfo", help="Texto da marca d'água.")
    ap.add_argument("--opacity", type=float, default=0.22, help="Opacidade do texto (0..1).")
    ap.add_argument("--angle", type=float, default=30.0, help="Ângulo (em graus) da marca d'água.")
    ap.add_argument("--scale", type=float, default=0.06, help="Tamanho do texto como fração da largura (0.06 = 6%).")
    ap.add_argument("--spacing", type=float, default=2.2, help="Multiplicador do tile para espaçamento entre repetições.")
    ap.add_argument("--color", default="#FFFFFF", help="Cor do texto (nome ou hex).")
    ap.add_argument("--stroke-width", type=int, default=2, help="Largura do contorno (melhora contraste).")
    ap.add_argument("--stroke-color", default="#000000", help="Cor do contorno.")
    ap.add_argument("--stroke-opacity", type=float, default=0.5, help="Opacidade do contorno (0..1).")
    ap.add_argument("--font", help="Fonte .ttf (opcional). Ex.: C:\\Windows\\Fonts\\arial.ttf")
    ap.add_argument("--keep-ext", action="store_true", help="Manter extensão (apenas PNG/JPEG).")
    args = ap.parse_args()

    in_dir = Path(args.dir).resolve()
    out_dir = Path(args.outdir).resolve()
    if not in_dir.exists():
        print(f"ERRO: diretório de entrada não existe: {in_dir}")
        return

    process_dir(
        in_dir=in_dir,
        out_dir=out_dir,
        text=args.text,
        opacity=args.opacity,
        angle=args.angle,
        scale=args.scale,
        spacing=args.spacing,
        color=args.color,
        stroke_width=args.stroke_width,
        stroke_color=args.stroke_color,
        stroke_opacity=args.stroke_opacity,
        font_path=args.font,
        keep_ext=args.keep_ext,
    )


if __name__ == "__main__":
    main()