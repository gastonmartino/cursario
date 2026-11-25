# Prepara las fotos de Homo Hamatus para la carta hamatus: recorte, versión
# color en WebP y versión tramada (4 tonos, tramado ordenado, a mitad de
# resolución) en PNG, algunas con corrimiento de franjas; y la original, sin
# recortar ni intervenir (hasta 2000 px), para el visor.
# Uso, desde la raíz del repositorio: python3 src/cartas/hamatus/herramientas/fotos.py
# Lee los originales de media/homo-hamatus/ y escribe en
# public/curso01/subcursos/curso003/medios/fotos/.

import sys, os
import numpy as np
from PIL import Image, ImageOps, ImageEnhance

SRC = 'media/homo-hamatus'
OUT = 'public/curso01/subcursos/curso003/medios/fotos'
os.makedirs(OUT, exist_ok=True)

# nombre de salida: (archivo, recorte relativo (x0,y0,x1,y1), ancho final, corrimiento)
FOTOS = {
  'hh-torre':        ('hh-000.JPG', (0.0, 0.03, 1.0, 0.93), 900, False),
  'hh-electronica':  ('hh-004.JPG', (0.0, 0.10, 1.0, 0.85), 900, True),
  'hh-anillos':      ('hh-006.JPG', (0.0, 0.0, 1.0, 0.75), 900, False),
  'hh-redes':        ('hh-009.JPG', (0.0, 0.05, 1.0, 0.95), 900, True),
  'hh-ganchos':      ('hh-007.JPG', (0.0, 0.0, 1.0, 0.70), 900, False),
  'hh-libro':        ('hh-011-bitacora.JPG', (0.30, 0.25, 1.0, 1.0), 900, False),
  'hh-especimen':    ('hh-015-bitacora3.JPG', (0.05, 0.40, 0.95, 1.0), 900, False),
  'hh-cenital':      ('hh-021.JPG', (0.05, 0.0, 0.95, 1.0), 1000, True),
  'hh-estrella':     ('hh-016.JPG', (0.0, 0.10, 1.0, 0.85), 900, False),
  'hh-fondo':        ('hh-019.JPG', (0.0, 0.15, 1.0, 0.90), 900, False),
  'hh-sala':         ('hh-013.JPG', (0.0, 0.0, 1.0, 0.85), 900, False),
  'hh-perfil':       ('hh-012.JPG', (0.0, 0.05, 1.0, 0.95), 900, False),
}

# Paleta de cuatro tonos: tinta, pizarra, gris azulado y papel.
PALETA = np.array([[27, 31, 39], [74, 85, 99], [154, 166, 178], [236, 233, 226]], dtype=np.float32)
BAYER = np.array([[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]], dtype=np.float32) / 16 - 0.5

def trama(im, celda=2):
    g = ImageOps.autocontrast(im.convert('L'), cutoff=1)
    w, h = g.size
    chica = g.resize((w // celda, h // celda), Image.LANCZOS)
    a = np.asarray(chica, dtype=np.float32) / 255
    a = np.clip((a - 0.5) * 1.15 + 0.5, 0, 1)
    n = len(PALETA) - 1
    umbral = np.tile(BAYER, (a.shape[0] // 4 + 1, a.shape[1] // 4 + 1))[: a.shape[0], : a.shape[1]]
    idx = np.clip(np.floor(a * n + 0.5 + umbral), 0, n).astype(int)
    rgb = PALETA[idx].astype(np.uint8)
    # A la mitad de resolución: el navegador la agranda sin suavizar.
    return Image.fromarray(rgb)

def corrimiento(im, semilla):
    # Franjas verticales que se estiran desde una fila: la falla de una pantalla.
    rng = np.random.default_rng(semilla)
    a = np.asarray(im).copy()
    h, w = a.shape[:2]
    for _ in range(7):
        x0 = int(rng.integers(0, w - 40)); ancho = int(rng.integers(12, max(13, w // 9)))
        y = int(rng.integers(h // 6, h - h // 6)); largo = int(rng.integers(h // 8, h // 3))
        a[y:y + largo, x0:x0 + ancho] = a[y, x0:x0 + ancho]
    for _ in range(4):
        y0 = int(rng.integers(0, h - 20)); alto = int(rng.integers(4, 26)); d = int(rng.integers(-60, 60))
        a[y0:y0 + alto] = np.roll(a[y0:y0 + alto], d, axis=1)
    return Image.fromarray(a)

for i, (nombre, (archivo, (x0, y0, x1, y1), ancho, glitch)) in enumerate(FOTOS.items()):
    im = ImageOps.exif_transpose(Image.open(f'{SRC}/{archivo}')).convert('RGB')
    original = im.copy(); original.thumbnail((2000, 2000), Image.LANCZOS)
    original.save(f'{OUT}/{nombre}-original.webp', quality=76, method=6)
    W, H = im.size
    im = im.crop((int(x0 * W), int(y0 * H), int(x1 * W), int(y1 * H)))
    alto = round(ancho * im.size[1] / im.size[0])
    im = im.resize((ancho, alto), Image.LANCZOS)
    im.save(f'{OUT}/{nombre}.webp', quality=72, method=6)
    t = trama(im)
    if glitch:
        t = corrimiento(t, i)
    pal = Image.new('P', (1, 1)); pal.putpalette(PALETA.astype(np.uint8).flatten().tolist() + [0] * (768 - 12))
    t.quantize(palette=pal, dither=Image.Dither.NONE).save(f'{OUT}/{nombre}-trama.png', optimize=True)
    print(nombre, im.size, os.path.getsize(f'{OUT}/{nombre}.webp') // 1024, 'KB /', os.path.getsize(f'{OUT}/{nombre}-trama.png') // 1024, 'KB')
