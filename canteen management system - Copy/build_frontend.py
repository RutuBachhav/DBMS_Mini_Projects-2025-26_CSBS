"""Copy static frontend into public/ for Vercel (same-origin API + static)."""
import shutil
from pathlib import Path

root = Path(__file__).resolve().parent
src = root / "frontend"
dst = root / "public"

if not src.is_dir():
    raise SystemExit(f"Missing frontend directory: {src}")

if dst.exists():
    shutil.rmtree(dst)
shutil.copytree(src, dst)
print(f"Copied {src} -> {dst}")
