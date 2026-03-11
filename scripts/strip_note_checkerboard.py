from __future__ import annotations

from collections import deque
from pathlib import Path

from PIL import Image


ROOT = Path(r"C:\Users\sinan\Desktop\gorsel\perfume-palette-pioneers-a3f58e9f\public\note-illustrations")
DIRECTORIES = [ROOT / "ingredients", ROOT / "accords", ROOT / "families"]


def is_background(rgb: tuple[int, int, int]) -> bool:
    max_channel = max(rgb)
    min_channel = min(rgb)
    spread = max_channel - min_channel
    return min_channel >= 170 and spread <= 18


def strip_checkerboard(path: Path) -> bool:
    image = Image.open(path).convert("RGBA")
    pixels = image.load()
    width, height = image.size
    visited = [[False] * height for _ in range(width)]
    queue: deque[tuple[int, int]] = deque()

    def enqueue(x: int, y: int) -> None:
        if visited[x][y]:
            return
        rgba = pixels[x, y]
        if rgba[3] == 0 or not is_background(rgba[:3]):
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

        for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
            if 0 <= nx < width and 0 <= ny < height:
                enqueue(nx, ny)

    if changed:
        image.save(path)

    return changed


def main() -> None:
    changed_paths: list[Path] = []

    for directory in DIRECTORIES:
        if not directory.exists():
            continue
        for path in directory.glob("*.png"):
            if strip_checkerboard(path):
                changed_paths.append(path)

    print(f"Updated {len(changed_paths)} files.")
    for path in changed_paths:
        print(path)


if __name__ == "__main__":
    main()
