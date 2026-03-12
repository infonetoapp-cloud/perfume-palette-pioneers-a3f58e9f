from __future__ import annotations

from collections import Counter, deque
from pathlib import Path

from PIL import Image


ROOT = Path(r"C:\Users\sinan\Desktop\gorsel\perfume-palette-pioneers-a3f58e9f\public\note-illustrations")
PROTECTED_FILES = {
    ROOT / "clean.png",
    ROOT / "floral.png",
    ROOT / "vanilla.png",
    ROOT / "citrus.png",
}


def discover_pngs(root: Path) -> list[Path]:
    return sorted(
        path for path in root.rglob("*.png")
        if path.is_file() and path not in PROTECTED_FILES
    )


def quantize(rgb: tuple[int, int, int], step: int = 8) -> tuple[int, int, int]:
    return tuple(min(255, round(channel / step) * step) for channel in rgb)


def brightness(rgb: tuple[int, int, int]) -> float:
    r, g, b = rgb
    return (0.2126 * r) + (0.7152 * g) + (0.0722 * b)


def spread(rgb: tuple[int, int, int]) -> int:
    return max(rgb) - min(rgb)


def color_distance(a: tuple[int, int, int], b: tuple[int, int, int]) -> float:
    ar, ag, ab = a
    br, bg, bb = b
    return ((ar - br) ** 2 + (ag - bg) ** 2 + (ab - bb) ** 2) ** 0.5


def collect_border_samples(image: Image.Image) -> list[tuple[int, int, int]]:
    pixels = image.load()
    width, height = image.size
    samples: list[tuple[int, int, int]] = []

    def maybe_add(x: int, y: int) -> None:
        r, g, b, a = pixels[x, y]
        if a == 0:
            return
        rgb = (r, g, b)
        if brightness(rgb) < 135:
            return
        if spread(rgb) > 48:
            return
        samples.append(rgb)

    for x in range(width):
        maybe_add(x, 0)
        maybe_add(x, height - 1)

    for y in range(height):
        maybe_add(0, y)
        maybe_add(width - 1, y)

    return samples


def derive_background_palette(samples: list[tuple[int, int, int]]) -> list[tuple[int, int, int]]:
    if not samples:
        return []

    counts = Counter(quantize(sample) for sample in samples)
    palette = [color for color, _ in counts.most_common(6)]

    # Keep only the light/neutral colors that are typical for baked transparency grids.
    filtered = [
        color for color in palette
        if brightness(color) >= 145 and spread(color) <= 52
    ]

    return filtered or palette[:2]


def pixel_is_background(
    rgba: tuple[int, int, int, int],
    palette: list[tuple[int, int, int]],
) -> bool:
    if rgba[3] == 0:
        return False

    rgb = rgba[:3]
    if brightness(rgb) < 120:
        return False

    if not palette:
        return brightness(rgb) >= 180 and spread(rgb) <= 30

    min_distance = min(color_distance(rgb, swatch) for swatch in palette)
    dynamic_threshold = 28 if brightness(rgb) < 170 else 42
    return min_distance <= dynamic_threshold


def clear_background(path: Path) -> bool:
    image = Image.open(path).convert("RGBA")
    pixels = image.load()
    width, height = image.size
    border_samples = collect_border_samples(image)
    palette = derive_background_palette(border_samples)

    visited = [[False] * height for _ in range(width)]
    queue: deque[tuple[int, int]] = deque()

    def enqueue(x: int, y: int) -> None:
        if visited[x][y]:
            return
        if not pixel_is_background(pixels[x, y], palette):
            return
        visited[x][y] = True
        queue.append((x, y))

    for x in range(width):
        enqueue(x, 0)
        enqueue(x, height - 1)

    for y in range(height):
        enqueue(0, y)
        enqueue(width - 1, y)

    changed = False
    while queue:
        x, y = queue.popleft()
        r, g, b, _ = pixels[x, y]
        pixels[x, y] = (r, g, b, 0)
        changed = True

        for nx, ny in (
            (x - 1, y),
            (x + 1, y),
            (x, y - 1),
            (x, y + 1),
            (x - 1, y - 1),
            (x - 1, y + 1),
            (x + 1, y - 1),
            (x + 1, y + 1),
        ):
            if 0 <= nx < width and 0 <= ny < height:
                enqueue(nx, ny)

    if changed:
        image.save(path)

    return changed


def count_nontransparent_corners(path: Path) -> bool:
    image = Image.open(path).convert("RGBA")
    width, height = image.size
    corners = [
        image.getpixel((0, 0)),
        image.getpixel((width - 1, 0)),
        image.getpixel((0, height - 1)),
        image.getpixel((width - 1, height - 1)),
    ]
    return any(pixel[3] != 0 for pixel in corners)


def main() -> None:
    changed_paths: list[Path] = []
    remaining_paths: list[Path] = []

    for path in discover_pngs(ROOT):
        if clear_background(path):
            changed_paths.append(path)

    for path in discover_pngs(ROOT):
        if count_nontransparent_corners(path):
            remaining_paths.append(path)

    print(f"Updated {len(changed_paths)} files.")
    for path in changed_paths:
        print(path)

    print(f"Remaining nontransparent-corner files: {len(remaining_paths)}")
    for path in remaining_paths:
        print(path)


if __name__ == "__main__":
    main()
