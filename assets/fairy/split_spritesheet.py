"""
Split a fairy spritesheet into individual transparent PNGs.
Usage: python split_spritesheet.py <input.png> [cols] [rows]

Defaults to 5 columns x 2 rows (10 sprites).
Auto-trims whitespace and exports as 512x512 transparent PNG.
"""

import sys
from pathlib import Path
from PIL import Image

def trim_whitespace(img: Image.Image, threshold: int = 245) -> Image.Image:
    """Crop out surrounding white/near-white pixels."""
    if img.mode != "RGBA":
        img = img.convert("RGBA")
    # Find bounding box of non-white content
    pixels = img.load()
    w, h = img.size
    left, top, right, bottom = w, h, 0, 0
    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            if a > 10 and (r < threshold or g < threshold or b < threshold):
                left = min(left, x)
                top = min(top, y)
                right = max(right, x)
                bottom = max(bottom, y)
    if right <= left or bottom <= top:
        return img
    # Add small padding
    pad = 4
    left = max(0, left - pad)
    top = max(0, top - pad)
    right = min(w, right + pad)
    bottom = min(h, bottom + pad)
    return img.crop((left, top, right, bottom))

def make_white_transparent(img: Image.Image, threshold: int = 240) -> Image.Image:
    """Convert white/near-white pixels to transparent."""
    img = img.convert("RGBA")
    pixels = img.load()
    w, h = img.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            if r >= threshold and g >= threshold and b >= threshold:
                pixels[x, y] = (r, g, b, 0)
    return img

def fit_to_square(img: Image.Image, size: int = 512) -> Image.Image:
    """Center the image in a square canvas and resize to target size."""
    w, h = img.size
    max_dim = max(w, h)
    square = Image.new("RGBA", (max_dim, max_dim), (0, 0, 0, 0))
    offset_x = (max_dim - w) // 2
    offset_y = (max_dim - h) // 2
    square.paste(img, (offset_x, offset_y), img)
    if max_dim != size:
        square = square.resize((size, size), Image.LANCZOS)
    return square

def split(input_path: str, cols: int = 5, rows: int = 2):
    src = Image.open(input_path)
    w, h = src.size
    cell_w = w // cols
    cell_h = h // rows

    # Expected names for our sprite system (row-major order)
    names = [
        "amethyst_1_idle", "amethyst_1_happy", "amethyst_1_excited",
        "amethyst_1_thinking", "amethyst_1_sleeping",
        # Row 2 - extra moods (not all in our system, keep for future use)
        "amethyst_1_sad", "amethyst_1_surprised", "amethyst_1_angry",
        "amethyst_1_waving", "amethyst_1_extra",
    ]

    out_dir = Path(input_path).parent
    count = 0
    for row in range(rows):
        for col in range(cols):
            idx = row * cols + col
            if idx >= len(names):
                break
            x1 = col * cell_w
            y1 = row * cell_h
            cell = src.crop((x1, y1, x1 + cell_w, y1 + cell_h))
            cell = make_white_transparent(cell)
            cell = trim_whitespace(cell)
            cell = fit_to_square(cell, 512)

            name = names[idx]
            out_path = out_dir / f"{name}.png"
            cell.save(str(out_path), "PNG")
            print(f"  Saved: {out_path.name} ({cell.size[0]}x{cell.size[1]})")
            count += 1

    print(f"\nDone! Split {count} sprites from {Path(input_path).name}")

if __name__ == "__main__":
    input_file = sys.argv[1] if len(sys.argv) > 1 else "assets/fairy/test.png"
    cols = int(sys.argv[2]) if len(sys.argv) > 2 else 5
    rows = int(sys.argv[3]) if len(sys.argv) > 3 else 2
    split(input_file, cols, rows)
