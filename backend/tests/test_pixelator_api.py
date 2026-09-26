"""Backend tests for Pixelator + Rocky + health endpoints."""
import io
import os
import time

import pytest
import requests
from PIL import Image

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://quantum-creative-lab.preview.emergentagent.com').rstrip('/')
API = f"{BASE_URL}/api"


def _make_image(w=400, h=300, fmt='PNG'):
    """Generate colorful test image."""
    img = Image.new('RGB', (w, h))
    px = img.load()
    for y in range(h):
        for x in range(w):
            px[x, y] = ((x * 255) // w, (y * 255) // h, ((x + y) * 255) // (w + h))
    buf = io.BytesIO()
    img.save(buf, format=fmt)
    buf.seek(0)
    return buf


# ── Health & root ─────────────────────────────────────────────
class TestHealth:
    def test_health(self):
        r = requests.get(f"{API}/health", timeout=15)
        assert r.status_code == 200
        j = r.json()
        assert j.get("status") == "ok"
        assert "rocky_llm" in j

    def test_root(self):
        r = requests.get(f"{API}/", timeout=15)
        assert r.status_code == 200
        assert "message" in r.json()


# ── Pixelator ─────────────────────────────────────────────────
class TestPixelator:
    def test_grid_auto(self):
        img = _make_image()
        t = time.time()
        r = requests.post(f"{API}/pixelate",
                          files={'file': ('t.png', img, 'image/png')},
                          data={'mode': 'Grid', 'pixel_size': 10, 'palette_type': 'auto'},
                          timeout=60)
        elapsed = time.time() - t
        assert r.status_code == 200, r.text
        j = r.json()
        assert j['image'].startswith('data:image/png;base64,')
        assert isinstance(j['swatches'], list) and len(j['swatches']) > 0
        assert j['width'] > 0 and j['height'] > 0
        print(f"grid_auto elapsed={elapsed:.2f}s swatches={len(j['swatches'])}")

    def test_segment_auto(self):
        img = _make_image()
        r = requests.post(f"{API}/pixelate",
                          files={'file': ('t.png', img, 'image/png')},
                          data={'mode': 'Segment', 'pixel_size': 10, 'palette_type': 'auto'},
                          timeout=90)
        assert r.status_code == 200, r.text
        j = r.json()
        assert j['image'].startswith('data:image/png;base64,')
        assert len(j['swatches']) > 0

    def test_grid_custom_palette(self):
        img = _make_image()
        colors = ['#ff0055', '#00ff88', '#0055ff', '#ffffff', '#000000']
        # requests: send list under same key
        data = [('mode', 'Grid'), ('pixel_size', '10'), ('palette_type', 'custom')]
        for c in colors:
            data.append(('custom_colors', c))
        r = requests.post(f"{API}/pixelate",
                          files={'file': ('t.png', img, 'image/png')},
                          data=data,
                          timeout=60)
        assert r.status_code == 200, r.text
        j = r.json()
        assert j['swatches'] == [[255, 0, 85], [0, 255, 136], [0, 85, 255], [255, 255, 255], [0, 0, 0]]

    def test_grid_pixel_size_1(self):
        img = _make_image(200, 150)
        r = requests.post(f"{API}/pixelate",
                          files={'file': ('t.png', img, 'image/png')},
                          data={'mode': 'Grid', 'pixel_size': 1, 'palette_type': 'auto'},
                          timeout=90)
        assert r.status_code == 200, r.text

    def test_non_image_returns_400(self):
        r = requests.post(f"{API}/pixelate",
                          files={'file': ('t.txt', io.BytesIO(b'this is not an image'), 'text/plain')},
                          data={'mode': 'Grid', 'pixel_size': 10, 'palette_type': 'auto'},
                          timeout=30)
        assert r.status_code == 400
        assert 'detail' in r.json()

    def test_empty_file_returns_400(self):
        r = requests.post(f"{API}/pixelate",
                          files={'file': ('t.png', io.BytesIO(b''), 'image/png')},
                          data={'mode': 'Grid', 'pixel_size': 10, 'palette_type': 'auto'},
                          timeout=30)
        assert r.status_code == 400

    def test_custom_palette_no_colors_returns_400(self):
        img = _make_image()
        r = requests.post(f"{API}/pixelate",
                          files={'file': ('t.png', img, 'image/png')},
                          data={'mode': 'Grid', 'pixel_size': 10, 'palette_type': 'custom'},
                          timeout=30)
        assert r.status_code == 400


# ── Rocky ─────────────────────────────────────────────────────
class TestRocky:
    def test_rocky_pixelator(self):
        r = requests.post(f"{API}/rocky",
                          json={'message': 'tell me about pixelator', 'session_id': 'test'},
                          timeout=30)
        assert r.status_code == 200
        j = r.json()
        assert 'reply' in j and 'source' in j
        assert len(j['reply']) > 0
