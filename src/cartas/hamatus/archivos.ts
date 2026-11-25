/**
 * ARCHIVOS DE LA CARTA HAMATUS
 * Lo que la carta necesita saber de una imagen de public/: su nombre, si es
 * una foto (tiene versión tramada), su versión original y si es vertical.
 */
import fs from 'node:fs';
import path from 'node:path';
import type { BloqueMimo } from '../../utils/markdown';

// Una pieza de un capítulo: imágenes (una foto, varias, o una lámina), el
// video o una nota.
type Imagen = Extract<BloqueMimo, { tipo: 'imagen' }>;
export type PiezaHamatus =
  | { tipo: 'imagenes'; imagenes: Imagen[] }
  | { tipo: 'video'; youtube: string }
  | { tipo: 'cita'; texto: string };

export const nombreArchivo = (src: string) => src.split('/').pop() ?? src;

// Foto con versión tramada al lado (mismo nombre, "-trama.png").
export const tramaDe = (src: string) => {
  if (!/\.webp$/i.test(src)) return null;
  const trama = src.replace(/\.webp$/i, '-trama.png');
  return fs.existsSync(path.join(process.cwd(), 'public', trama)) ? trama : null;
};

// La versión original de una foto, sin intervenir, para el visor (mismo
// nombre y "-original.webp"); sin ella, la misma imagen.
export const originalDe = (src: string) => {
  const original = src.replace(/\.webp$/i, '-original.webp');
  return original !== src && fs.existsSync(path.join(process.cwd(), 'public', original)) ? original : src;
};

// Ancho y alto de una imagen de public/, leídos de su encabezado (JPEG, PNG o
// WebP), para saber si una lámina es vertical.
export const medidas = (src: string): { ancho: number; alto: number } | null => {
  try {
    const b = fs.readFileSync(path.join(process.cwd(), 'public', src));
    if (b.toString('ascii', 1, 4) === 'PNG') return { ancho: b.readUInt32BE(16), alto: b.readUInt32BE(20) };
    if (b.toString('ascii', 8, 12) === 'WEBP') {
      const tipo = b.toString('ascii', 12, 16);
      if (tipo === 'VP8X') return { ancho: 1 + b.readUIntLE(24, 3), alto: 1 + b.readUIntLE(27, 3) };
      if (tipo === 'VP8 ') return { ancho: b.readUInt16LE(26) & 0x3fff, alto: b.readUInt16LE(28) & 0x3fff };
      if (tipo === 'VP8L') { const v = b.readUInt32LE(21); return { ancho: (v & 0x3fff) + 1, alto: ((v >> 14) & 0x3fff) + 1 }; }
    }
    if (b[0] === 0xff && b[1] === 0xd8) {
      for (let i = 2; i < b.length;) {
        const marca = b[i + 1];
        if (marca >= 0xc0 && marca <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marca)) return { ancho: b.readUInt16BE(i + 7), alto: b.readUInt16BE(i + 5) };
        i += 2 + b.readUInt16BE(i + 2);
      }
    }
  } catch {}
  return null;
};
export const esVertical = (src: string) => { const m = medidas(src); return Boolean(m && m.alto > m.ancho); };
