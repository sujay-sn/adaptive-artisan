import { argbFromRgb, hexFromArgb, QuantizerCelebi, Score } from '@material/material-color-utilities';
import { idbDelete, idbGet, idbSet } from '@/lib/idb';

export interface Wallpaper {
  /** A downscaled copy for display; the original never leaves the browser. */
  thumbnail: Blob;
  /** Candidate seed colors, best first. */
  seeds: string[];
}

const KEY = 'wallpaper';

function drawScaled(bitmap: ImageBitmap, maxSize: number): HTMLCanvasElement {
  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  canvas.getContext('2d')?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return canvas;
}

function toBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('Could not encode the image'))), 'image/webp', 0.82);
  });
}

/**
 * Seed colors from an image, the way Android themes from a wallpaper:
 * Material's quantizer and scorer, run on a 128px copy so a large photo
 * costs no more than a small one.
 */
export async function extractWallpaper(file: Blob): Promise<Wallpaper> {
  const bitmap = await createImageBitmap(file);
  try {
    const sample = drawScaled(bitmap, 128);
    const context = sample.getContext('2d', { willReadFrequently: true });
    if (!context) throw new Error('Canvas 2D is unavailable');
    const { data } = context.getImageData(0, 0, sample.width, sample.height);
    const pixels: number[] = [];
    for (let i = 0; i < data.length; i += 4) {
      if ((data[i + 3] ?? 0) < 255) continue;
      pixels.push(argbFromRgb(data[i] ?? 0, data[i + 1] ?? 0, data[i + 2] ?? 0));
    }
    const seeds = Score.score(QuantizerCelebi.quantize(pixels, 128), { desired: 4 }).map((argb) => hexFromArgb(argb).toUpperCase());
    return { thumbnail: await toBlob(drawScaled(bitmap, 480)), seeds };
  } finally {
    bitmap.close();
  }
}

export const saveWallpaper = (wallpaper: Wallpaper) => idbSet(KEY, wallpaper);
export const loadWallpaper = () => idbGet<Wallpaper>(KEY);
export const forgetWallpaper = () => idbDelete(KEY);