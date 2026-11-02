#!/usr/bin/env python3
"""Generate the original editorial covers used in the Culture carousel.

These are project-authored graphic covers, not reproductions of publisher
book jackets or film posters. They are intentionally monochrome so the series
matches the site's design system.
"""
from __future__ import annotations

import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parents[1]
COVERS = ROOT / 'public' / 'images' / 'covers'
W, H = 640, 800
MONTSERRAT = '/tmp/Montserrat.ttf'
INTER = '/tmp/Inter.ttf'
FALLBACK = '/System/Library/Fonts/Supplemental/Arial.ttf'


def font(path: str, size: int, weight: int = 500) -> ImageFont.FreeTypeFont:
    try:
        face = ImageFont.truetype(path, size)
        face.set_variation_by_axes([weight])
        return face
    except Exception:
        return ImageFont.truetype(FALLBACK, size)


def crop_ratio(image: Image.Image, ratio: float, fy: float = 0.45) -> Image.Image:
    width, height = image.size
    target_h = int(width / ratio)
    if target_h <= height:
        top = int((height - target_h) * fy)
        return image.crop((0, top, width, top + target_h))
    target_w = int(height * ratio)
    left = (width - target_w) // 2
    return image.crop((left, 0, left + target_w, height))


def wrap(draw: ImageDraw.ImageDraw, text: str, face: ImageFont.FreeTypeFont, max_width: int) -> list[str]:
    words = text.split()
    lines: list[str] = []
    current = ''
    for word in words:
        candidate = f'{current} {word}'.strip()
        if draw.textlength(candidate, font=face) <= max_width or not current:
            current = candidate
        else:
            lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def load_base(path: str) -> Image.Image:
    image = Image.open(path).convert('RGB')
    image = crop_ratio(image, 0.8, 0.42)
    image = image.resize((W, H), Image.Resampling.LANCZOS)
    image = ImageOps.grayscale(image)
    image = ImageOps.autocontrast(image, cutoff=0.4)
    image = ImageEnhance.Contrast(image).enhance(1.06)
    return image.convert('RGB')


def create_cover(item: dict, index: int, base: Image.Image, total: int) -> None:
    image = base.copy().convert('RGBA')

    # Deep, even veil with a stronger bottom edge for the credit block.
    shade = Image.new('RGBA', (W, H), (10, 18, 30, 0))
    sd = ImageDraw.Draw(shade)
    for y in range(H):
        progress = y / H
        alpha = int(110 + 92 * progress)
        sd.line([(0, y), (W, y)], fill=(10, 18, 30, alpha))
    image = Image.alpha_composite(image, shade)
    draw = ImageDraw.Draw(image)

    # Frame and registration marks.
    border = 26
    draw.rectangle((border, border, W - border, H - border), outline=(255, 255, 255, 85), width=1)
    draw.line((border, 72, W - border, 72), fill=(255, 255, 255, 72), width=1)
    draw.line((border, H - 82, W - border, H - 82), fill=(255, 255, 255, 72), width=1)

    micro = font(INTER, 14, 500)
    tiny = font(INTER, 12, 450)
    label = 'BOOK' if item['kind'] == 'book' else 'FILM'
    draw.text((border + 18, border + 17), f'EVEREST FIELD NOTES / {label}', font=micro, fill=(235, 241, 247, 220))
    draw.text((W - border - 18, border + 17), f'{index:02d} / {total:02d}', font=tiny, fill=(203, 213, 225, 190), anchor='ra')

    word = item['coverWord']
    word_face = font(MONTSERRAT, 118 if len(word) <= 5 else 84, 700)
    draw.text((border + 26, 174), word, font=word_face, fill=(255, 255, 255, 245))

    title_face = font(INTER, 28, 650)
    title_lines = wrap(draw, item['title'], title_face, W - 2 * border - 58)
    title_y = 392
    for line in title_lines[:3]:
        draw.text((border + 28, title_y), line, font=title_face, fill=(255, 255, 255, 240))
        title_y += 35

    credit = item.get('author') or item.get('director') or ''
    credit_face = font(INTER, 17, 450)
    draw.text((border + 28, title_y + 18), credit, font=credit_face, fill=(203, 213, 225, 215))

    draw.line((border + 28, H - 124, W - border - 28, H - 124), fill=(255, 255, 255, 80), width=1)
    draw.text((border + 28, H - 107), f'EVEREST  ·  {item["year"]}', font=tiny, fill=(203, 213, 225, 190))
    draw.text((W - border - 28, H - 107), '8 848,86 M', font=tiny, fill=(203, 213, 225, 150), anchor='ra')

    image.convert('RGB').save(COVERS / f'{item["id"]}.webp', 'WEBP', quality=84, method=6)


def main() -> None:
    data = json.loads((ROOT / 'data' / 'everest.json').read_text())
    COVERS.mkdir(parents=True, exist_ok=True)
    bases = [
        load_base(str(ROOT / 'public/images/hero-everest-1800.avif')),
        load_base(str(ROOT / 'public/images/khumbu-glacier.avif')),
        load_base(str(ROOT / 'public/images/everest-portrait.avif')),
    ]
    items = data['culture']['books'] + data['culture']['films']
    for index, item in enumerate(items, start=1):
        # Different crops and rotations of the same three monochrome plates.
        base = bases[(index - 1) % len(bases)]
        if index % 3 == 0:
            base = ImageOps.mirror(base)
        create_cover(item, index, base, len(items))
    # A distinct, slightly brighter cover for the 2026 premiere.
    tenzing = next(item for item in items if item['id'] == 'tenzing')
    create_cover(tenzing, items.index(tenzing) + 1, bases[2], len(items))


if __name__ == '__main__':
    main()
