// Íconos de los sitios de hallazgo: objetos con gancho, al modo de un grabado
// (contorno, sombreado de rayas y relleno claro). Caja de -11 a 11.
const R = '#c8102e';
const linea = (d, w = 0.85) => `<path d="${d}" fill="none" stroke="${R}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
const pieza = (d) => `<path d="${d}" fill="${R}" fill-opacity=".13" stroke="${R}" stroke-width=".85" stroke-linejoin="round"/>`;
const rayas = (d) => linea(d, 0.4);

export const ICONOS = {
  // Broche de ropa: dos tablillas de madera con su resorte.
  broche: `<g transform="rotate(-24)">
    ${pieza('M-0.15 -10.6L-3.1 -10.2L-3.4 -3.2L-4.5 -1.3L-3.6 0.7L-3.3 10.6L-0.15 10.6L-0.15 0.9L-1.2 -1.3L-0.15 -3.2Z')}
    ${pieza('M0.15 -10.6L3.1 -10.2L3.4 -3.2L4.5 -1.3L3.6 0.7L3.3 10.6L0.15 10.6L0.15 0.9L1.2 -1.3L0.15 -3.2Z')}
    ${rayas('M-3.1 3L-0.6 3.5M-3.1 5L-0.6 5.5M-3.1 7L-0.6 7.5M-3.1 9L-0.6 9.5M-3 -9L-0.6 -8.6M-3.1 -7L-0.6 -6.6M-3.2 -5L-0.6 -4.6')}
    ${rayas('M3.1 3L0.6 3.5M3.1 5L0.6 5.5M3.1 7L0.6 7.5M3.1 9L0.6 9.5M3 -9L0.6 -8.6M3.1 -7L0.6 -6.6M3.2 -5L0.6 -4.6')}
    <circle cx="0" cy="-1.3" r="1.9" fill="#f1efe9" stroke="${R}" stroke-width=".85"/>
    <circle cx="0" cy="-1.3" r=".8" fill="none" stroke="${R}" stroke-width=".5"/>
    ${linea('M-4.4 -2.8L-1.6 -1.9M4.4 -2.8L1.6 -1.9M-4.2 0.4L-1.7 -0.5M4.2 0.4L1.7 -0.5', 0.6)}
  </g>`,

  // Alfiler de gancho: la espiral, los dos alambres y la cabeza que cierra.
  alfiler: `<g transform="rotate(-32)">
    ${linea('M-7.6 -1.4L6.6 -2.6')}
    ${linea('M-7.4 1.6L9.4 0.5', 0.75)}
    ${linea('M8.6 0.55L10.6 0.4', 0.5)}
    <circle cx="-9" cy="0.1" r="2.5" fill="#f1efe9" stroke="${R}" stroke-width=".85"/>
    <circle cx="-9" cy="0.1" r="1.25" fill="none" stroke="${R}" stroke-width=".55"/>
    ${pieza('M5.4 -4.6H9.2Q11.6 -4.6 11.6 -2.4Q11.6 -0.3 9.4 0.2L5.4 0.2Q4.6 -2.2 5.4 -4.6Z')}
    ${rayas('M6.5 -4.2V-0.3M7.6 -4.4V-0.1M8.7 -4.4V0M9.8 -4.2V-0.1M10.8 -3.6V-0.8')}
  </g>`,

  // Gancho de percha: la vuelta del gancho, el cuello torcido y los hombros.
  percha: `<g transform="translate(0 1.2)">
    ${linea('M0 -1.6V-5.6C0 -9.6 -5 -10.4 -5.6 -7C-5.9 -5.6 -4.8 -4.9 -4 -5.4', 1)}
    ${linea('M0 -1.6V-5.6C0 -9.6 -5 -10.4 -5.6 -7', 0.4)}
    ${rayas('M-0.9 -2.1L0.9 -2.7M-0.9 -3.1L0.9 -3.7M-0.9 -4.1L0.9 -4.7')}
    ${pieza('M0 -1.4L-10.2 6.2Q-11 7.3 -9.6 7.4H9.6Q11 7.3 10.2 6.2Z')}
    <path d="M0 0.6L-7.6 6.2H7.6Z" fill="#f1efe9" stroke="${R}" stroke-width=".55"/>
    ${rayas('M-8.6 6.2L-7.4 5.3M8.6 6.2L7.4 5.3')}
  </g>`,

  // Anzuelo: el ojal, el vástago, la curva y la lengüeta.
  anzuelo: `<g transform="rotate(12)">
    <circle cx="1.6" cy="-9" r="1.7" fill="#f1efe9" stroke="${R}" stroke-width=".85"/>
    ${linea('M1.6 -7.3V3.2C1.6 9.6 -6.4 9.6 -6.4 3.4V-0.6', 1.1)}
    ${linea('M2.3 -6.8V3.2C2.3 10.4 -7.1 10.4 -7.1 3.4', 0.4)}
    ${pieza('M-6.4 -0.6L-7.8 -2.6L-5.2 1.2Z')}
    ${linea('M-6.4 -0.6L-4.6 2.4', 0.75)}
    ${linea('M1.6 -10.7C2.4 -11.6 3.6 -10.9 4.6 -11.8', 0.45)}
  </g>`,

  // Gancho de carpeta: la placa con sus ranuras y las dos patas dobladas.
  carpeta: `<g transform="rotate(-8)">
    ${pieza('M-9 0.4H9V3.4H-9Z')}
    ${rayas('M-7.6 0.9V2.9M-6.4 0.9V2.9M6.4 0.9V2.9M7.6 0.9V2.9')}
    <rect x="-4.4" y="1.1" width="8.8" height="1.6" rx=".5" fill="#f1efe9" stroke="${R}" stroke-width=".5"/>
    ${linea('M-7 0.4V-7.4Q-7 -9.6 -4.6 -9.6H-2.6', 1)}
    ${linea('M7 0.4V-7.4Q7 -9.6 4.6 -9.6H2.6', 1)}
    ${linea('M-7.8 0.4V-7.4Q-7.8 -10.4 -4.6 -10.4M7.8 0.4V-7.4Q7.8 -10.4 4.6 -10.4', 0.4)}
    ${rayas('M-9 4.6H9')}
  </g>`,

  // Anzuelo triple (potera): el ojal, el vástago y tres curvas con su
  // lengüeta, una de ellas de frente.
  potera: `<g transform="rotate(-10)">
    <circle cx="0" cy="-9.2" r="1.7" fill="#f1efe9" stroke="${R}" stroke-width=".85"/>
    ${linea('M0 -7.5V2.6', 1.1)}
    ${linea('M0 2.6C0 8.6 -7 8.6 -7 3V0.2', 1)}
    ${linea('M0 2.6C0 8.6 7 8.6 7 3V0.2', 1)}
    ${linea('M0 2.6C0.2 7.4 2.4 8.4 3.2 6.2', 0.8)}
    ${pieza('M-7 0.2L-8.4 -1.8L-5.8 1.9Z')}
    ${pieza('M7 0.2L8.4 -1.8L5.8 1.9Z')}
    ${rayas('M-0.8 -5.6L0.8 -6.2M-0.8 -3.6L0.8 -4.2M-0.8 -1.6L0.8 -2.2')}
    ${linea('M0 -10.9C0.8 -11.8 2 -11.1 3 -12', 0.45)}
  </g>`,

  // Anzuelo circular: la curva cerrada que vuelve sobre el vástago.
  anzueloCircular: `<g transform="rotate(18)">
    <circle cx="-3.2" cy="-9" r="1.6" fill="#f1efe9" stroke="${R}" stroke-width=".85"/>
    ${linea('M-3.2 -7.4V1.6C-3.2 9.8 8.2 9.8 8.2 2C8.2 -2.6 4.6 -3.6 2.6 -1.4', 1.1)}
    ${linea('M-2.5 -6.8V1.6C-2.5 8.9 7.4 8.9 7.4 2', 0.4)}
    ${pieza('M2.6 -1.4L0.6 -0.6L3.6 0.6Z')}
    ${rayas('M-4 -4.6L-2.4 -5.2M-4 -2.6L-2.4 -3.2')}
  </g>`,

  // Alfiler de gancho abierto: la aguja suelta de la cabeza, en ángulo.
  alfilerAbierto: `<g transform="rotate(-18)">
    ${linea('M-7.4 1.6L9.4 0.5', 0.85)}
    ${linea('M-7.2 -1.2L3.4 -9.6', 0.75)}
    ${linea('M3.2 -9.4L4.8 -10.7', 0.45)}
    <circle cx="-9" cy="0.3" r="2.5" fill="#f1efe9" stroke="${R}" stroke-width=".85"/>
    <circle cx="-9" cy="0.3" r="1.25" fill="none" stroke="${R}" stroke-width=".55"/>
    ${pieza('M5.4 -2.4H9.2Q11.6 -2.4 11.6 -0.2Q11.6 1.9 9.4 2.4L5.4 2.4Q4.6 0 5.4 -2.4Z')}
    ${rayas('M6.5 -2V1.9M7.6 -2.2V2.1M8.7 -2.2V2.2M9.8 -2V2.1M10.8 -1.4V1.4')}
  </g>`,

  // Aguja de crochet: el mango con su apoyo para el pulgar y la punta curva.
  crochet: `<g transform="rotate(-45)">
    ${pieza('M-11.6 -1.2H7.6Q9.4 -1.2 10.6 -2.4Q12.4 -3 12.6 -1.2Q12.8 1.2 10.4 1.2H-11.6Q-12.4 0 -11.6 -1.2Z')}
    <path d="M9 0Q10 -0.2 10.6 -1" fill="none" stroke="#f1efe9" stroke-width=".6"/>
    ${pieza('M-4.2 -2.6H2.4L3.8 0L2.4 2.6H-4.2L-5.6 0Z')}
    ${rayas('M-3.4 -2.2V2.2M-2.2 -2.4V2.4M-1 -2.4V2.4M0.2 -2.4V2.4M1.4 -2.4V2.4')}
    ${rayas('M-10.6 -1.2V1.2M-9 -1.2V1.2M4.6 -1.2V1.2')}
  </g>`,
};
