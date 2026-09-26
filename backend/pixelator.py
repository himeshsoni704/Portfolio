import base64
import io
import logging

import numpy as np
import PIL.Image as Image
from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from skimage.segmentation import slic
from sklearn.cluster import KMeans

logger = logging.getLogger(__name__)
router = APIRouter()


def hex_to_rgb(hex_color: str):
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i + 2], 16) for i in (0, 2, 4))


class Pixelator:
    """Port of Himesh's original pixelator.py — grid sampling + SLIC segmentation."""

    def grid_sampling(self, image: Image.Image, palette: np.ndarray, pixel_size: int) -> Image.Image:
        width, height = image.size
        small_width = max(1, width // pixel_size)
        small_height = max(1, height // pixel_size)

        small_image = image.resize((small_width, small_height), resample=Image.BOX).convert('RGB')
        pixels = np.array(small_image).reshape(-1, 3).astype(np.float64)

        # nearest palette color per pixel — vectorized form of the original per-pixel loop
        dist = np.sqrt(((pixels[:, np.newaxis, :] - palette[np.newaxis, :, :]) ** 2).sum(axis=2))
        new_pixels = palette[np.argmin(dist, axis=1)]

        output = Image.fromarray(new_pixels.reshape(small_height, small_width, 3).astype('uint8'))
        return output.resize((width, height), resample=Image.NEAREST)

    def segmentation_sampling(self, image: Image.Image, palette: np.ndarray, n_segments: int = 2000) -> Image.Image:
        img_np = np.array(image.convert('RGB'))
        # organic shapes based on color boundaries
        segments = slic(img_np, n_segments=n_segments, compactness=1, start_label=1)

        flat = segments.ravel()
        n_seg = int(flat.max()) + 1
        counts = np.bincount(flat, minlength=n_seg).clip(min=1)
        sums = np.zeros((n_seg, 3), dtype=np.float64)
        for c in range(3):
            sums[:, c] = np.bincount(flat, weights=img_np[:, :, c].ravel(), minlength=n_seg)
        avg_colors = sums / counts[:, np.newaxis]

        # closest palette color for each shape — vectorized form of the original per-segment loop
        dist = np.sqrt(((avg_colors[:, np.newaxis, :] - palette[np.newaxis, :, :]) ** 2).sum(axis=2))
        best = palette[np.argmin(dist, axis=1)]

        res = best[flat].reshape(img_np.shape).astype('uint8')
        return Image.fromarray(res)


class Swatch:
    """Port of Himesh's original swatch.py — SLIC shapes + KMeans on shape colors."""

    def extract_palette(self, image: Image.Image, num_colors: int) -> np.ndarray:
        img_np = np.array(image.convert('RGB'))

        # 1. use SLIC to find segments (shapes)
        n_segments = min(1000, max(2, (img_np.shape[0] * img_np.shape[1]) // 8))
        segments = slic(img_np, n_segments=n_segments, compactness=2)

        # 2. average color of each segment
        flat = segments.ravel()
        n_seg = int(flat.max()) + 1
        counts = np.bincount(flat, minlength=n_seg).clip(min=1)
        sums = np.zeros((n_seg, 3), dtype=np.float64)
        for c in range(3):
            sums[:, c] = np.bincount(flat, weights=img_np[:, :, c].ravel(), minlength=n_seg)
        segment_colors = sums / counts[:, np.newaxis]

        # 3. KMeans on the shapes, not the pixels
        kmeans = KMeans(n_clusters=min(num_colors, len(segment_colors)), random_state=0, n_init=10)
        kmeans.fit(segment_colors)
        return kmeans.cluster_centers_.astype(int)


@router.post("/pixelate")
async def pixelate(
    file: UploadFile = File(...),
    mode: str = Form('Grid'),
    pixel_size: int = Form(10),
    palette_type: str = Form('auto'),
    custom_colors: list[str] = Form([]),
):
    data = await file.read()
    if not data:
        raise HTTPException(status_code=400, detail='No file uploaded')

    try:
        image = Image.open(io.BytesIO(data))
    except Exception:
        raise HTTPException(status_code=400, detail='Could not read that image file')

    # resize very wide images, same as the original app.py
    if image.width > 1000:
        new_height = int(1000 * image.height / image.width)
        image = image.resize((1000, new_height), resample=Image.LANCZOS)

    pixel_size = max(1, min(25, pixel_size))

    # palette selection
    if palette_type == 'custom':
        rgbs = [hex_to_rgb(c) for c in custom_colors if c]
        if not rgbs:
            raise HTTPException(status_code=400, detail='Custom palette selected but no colors provided')
        swatches = np.array(rgbs, dtype=np.float64)[:16]
    else:
        try:
            swatches = Swatch().extract_palette(image, num_colors=22).astype(np.float64)
        except Exception as e:
            logger.warning(f"palette extraction failed: {e}")
            raise HTTPException(status_code=400, detail='Palette extraction failed for this image')

    pixelator = Pixelator()
    try:
        if mode == 'Segment':
            # smaller pixel_size slider value = more segments (higher detail)
            n_segs = max(200, 8000 // pixel_size)
            n_segs = min(n_segs, max(2, (image.width * image.height) // 8))
            pixelated = pixelator.segmentation_sampling(image, palette=swatches, n_segments=n_segs)
        else:
            pixelated = pixelator.grid_sampling(image, palette=swatches, pixel_size=pixel_size)
    except HTTPException:
        raise
    except Exception as e:
        logger.warning(f"pixelate failed: {e}")
        raise HTTPException(status_code=500, detail='Pixelation failed while processing this image')

    buf = io.BytesIO()
    pixelated.save(buf, format='PNG')
    b64 = base64.b64encode(buf.getvalue()).decode()

    return {
        'image': f'data:image/png;base64,{b64}',
        'swatches': [[int(v) for v in color] for color in swatches],
        'width': pixelated.width,
        'height': pixelated.height,
    }