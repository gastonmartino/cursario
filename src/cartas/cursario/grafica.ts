// Gráfica vectorial de la carta "cursario": una carta náutica imaginaria.
// Se genera en el servidor, al construir el sitio, a partir de una semilla al
// azar, así que cambia en cada build (igual que los ríos del lienzo).
import { createNoise2D } from 'simplex-noise';
import { zonasDespejadas, type Composicion, type Rect } from './composicion';

export const PALETA = {
  papel: '#efe9dc',
  tinta: '#141416',
  linea: '#d6cdbb',
  ultramar: '#1f3797',
  celeste: '#cbd8ec',
  celesteMedio: '#9db4dd',
  bermellon: '#e2472b',
  ocre: '#c8934a',
};

// Generador de números al azar con semilla (mulberry32).
function crearAzar(semilla: number) {
  let s = semilla >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const n1 = (v: number) => v.toFixed(1);
const dentro = (x: number, y: number, [rx, ry, ra, rh]: Rect) => x >= rx && x <= rx + ra && y >= ry && y <= ry + rh;

// `prefijo` distingue los id del SVG cuando hay más de una gráfica en la página.
export function generarGrafica(composicion: Composicion, prefijo: string, semilla = Math.floor(Math.random() * 1e9)): string {
  const azar = crearAzar(semilla);
  const ruido = createNoise2D(azar);
  const { ancho, alto, margen, banda, marco: conMarco } = composicion.hoja;
  const { aguas, islas, rosas } = composicion;
  const recuadros = composicion.recuadros.flat();
  const enRecuadro = (x: number, y: number) => recuadros.some((r) => dentro(x, y, r));
  const despejadas = zonasDespejadas(composicion);
  const capas: string[] = [];

  // Contorno irregular y suave alrededor de un centro (aguas, islas, curvas).
  const mancha = (cx: number, cy: number, r: number, desfase: number, irregularidad = 0.32) => {
    const puntos: Array<[number, number]> = [];
    const n = 72;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      const k = 1 + irregularidad * ruido(Math.cos(a) * 1.1 + desfase, Math.sin(a) * 1.1 + desfase * 0.7);
      puntos.push([cx + Math.cos(a) * r * k, cy + Math.sin(a) * r * k]);
    }
    const medio = (a: [number, number], b: [number, number]) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    const inicio = medio(puntos[n - 1], puntos[0]);
    let d = `M${n1(inicio[0])},${n1(inicio[1])}`;
    for (let i = 0; i < n; i++) {
      const m = medio(puntos[i], puntos[(i + 1) % n]);
      d += `Q${n1(puntos[i][0])},${n1(puntos[i][1])} ${n1(m[0])},${n1(m[1])}`;
    }
    return `${d}Z`;
  };

  // --- retícula ---
  let reticula = '';
  for (let x = margen + banda; x < ancho - margen; x += 100) {
    reticula += `<line x1="${x}" y1="${margen}" x2="${x}" y2="${alto - margen}" stroke-width="${x % 500 < 100 ? 0.8 : 0.4}"/>`;
  }
  for (let y = margen + banda; y < alto - margen; y += 100) {
    reticula += `<line x1="${margen}" y1="${y}" x2="${ancho - margen}" y2="${y}" stroke-width="${y % 500 < 100 ? 0.8 : 0.4}"/>`;
  }
  capas.push(`<g stroke="${PALETA.linea}">${reticula}</g>`);

  // --- aguas poco profundas, con curvas de profundidad punteadas ---
  capas.push(`<defs>
    <pattern id="${prefijo}-punteado" width="7" height="7" patternUnits="userSpaceOnUse">
      <circle cx="1.5" cy="1.5" r="0.7" fill="${PALETA.ultramar}" opacity="0.35"/>
    </pattern>
  </defs>`);
  aguas.forEach(({ x, y, r }, i) => {
    const d = i * 3.7 + azar() * 10;
    capas.push(`<path d="${mancha(x, y, r * 1.35, d)}" fill="${PALETA.celeste}"/>`);
    capas.push(`<path d="${mancha(x, y, r * 0.9, d + 1.3)}" fill="${PALETA.celesteMedio}"/>`);
    capas.push(`<path d="${mancha(x, y, r * 0.9, d + 1.3)}" fill="url(#${prefijo}-punteado)"/>`);
    [1.6, 1.95, 2.4].forEach((escala, j) => {
      capas.push(`<path d="${mancha(x, y, r * escala, d + j * 0.4, 0.38)}" fill="none" stroke="${PALETA.tinta}" stroke-width="0.7" stroke-dasharray="${['1 3', '4 3', '1 2 6 2'][j]}" opacity="0.7"/>`);
    });
  });

  // --- recuadros negros e islas dentro de ellos ---
  capas.push(`<g fill="${PALETA.tinta}">${recuadros.map(([x, y, a, h]) => `<rect x="${x}" y="${y}" width="${a}" height="${h}"/>`).join('')}</g>`);
  islas.forEach(({ x, y, r }, i) => {
    const d = 40 + i * 2.9;
    [2.3, 1.8].forEach((escala, j) => {
      capas.push(`<path d="${mancha(x, y, r * escala, d + j, 0.4)}" fill="none" stroke="${PALETA.papel}" stroke-width="0.7" stroke-dasharray="${j ? '4 3' : '1 3'}" opacity="0.8"/>`);
    });
    capas.push(`<path d="${mancha(x, y, r * 1.3, d)}" fill="${PALETA.celesteMedio}"/>`);
    capas.push(`<path d="${mancha(x, y, r, d + 0.6, 0.45)}" fill="${PALETA.papel}" stroke="${PALETA.tinta}" stroke-width="1"/>`);
  });

  // --- sondeos: profundidades en itálica, como en las cartas náuticas ---
  let sondeos = '';
  for (let i = 0; i < composicion.sondeos; i++) {
    const x = margen + banda + 6 + azar() * (ancho - 2 * (margen + banda) - 20);
    const y = margen + banda + 12 + azar() * (alto - 2 * (margen + banda) - 20);
    if (despejadas.some((zona) => dentro(x, y, zona))) continue;
    const profundidad = Math.floor(Math.pow(azar(), 1.6) * 180) + 1;
    const decimal = azar() < 0.35 ? `<tspan font-size="6" dy="2">${Math.floor(azar() * 10)}</tspan>` : '';
    const color = enRecuadro(x, y) ? PALETA.papel : PALETA.tinta;
    sondeos += `<text x="${n1(x)}" y="${n1(y)}" fill="${color}">${profundidad}${decimal}</text>`;
  }
  capas.push(`<g font-family="Tinos, 'Times New Roman', serif" font-style="italic" font-size="9" opacity="0.85">${sondeos}</g>`);

  // --- rumbos entre las rosas y hacia los bordes ---
  let rumbos = '';
  rosas.forEach((a, i) => {
    rosas.slice(i + 1).forEach((b) => {
      rumbos += `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke-width="0.9"/>`;
    });
    for (let k = 0; k < 3; k++) {
      const angulo = azar() * Math.PI * 2;
      const largo = 600 + azar() * 900;
      rumbos += `<line x1="${a.x}" y1="${a.y}" x2="${n1(a.x + Math.cos(angulo) * largo)}" y2="${n1(a.y + Math.sin(angulo) * largo)}" stroke-width="0.6" stroke-dasharray="${k ? '10 6' : 'none'}"/>`;
    }
  });
  capas.push(`<g stroke="${PALETA.bermellon}" opacity="0.75">${rumbos}</g>`);

  // --- rosas de los vientos ---
  for (const { x, y, r } of rosas) capas.push(rosa(x, y, r));

  // --- símbolos: cruces, triángulos, rocas, oleaje ---
  let simbolos = '';
  for (let i = 0; i < 7; i++) {
    const x = 120 + azar() * (ancho - 240);
    const y = 300 + azar() * (alto - 500);
    if (despejadas.some((zona) => dentro(x, y, zona))) continue;
    const tipo = i % 4;
    if (tipo === 0) {
      // grilla de cruces
      for (let fx = 0; fx < 3; fx++) for (let fy = 0; fy < 3; fy++) {
        const cx = x + fx * 22, cy = y + fy * 22;
        simbolos += `<path d="M${n1(cx - 5)},${n1(cy)}H${n1(cx + 5)}M${n1(cx)},${n1(cy - 5)}V${n1(cy + 5)}" stroke="${PALETA.bermellon}" stroke-width="1.4"/>`;
      }
    } else if (tipo === 1) {
      simbolos += `<path d="M${n1(x)},${n1(y - 9)}L${n1(x + 9)},${n1(y + 7)}L${n1(x - 9)},${n1(y + 7)}Z" fill="${PALETA.ocre}"/>`;
      simbolos += `<path d="M${n1(x)},${n1(y + 15)}L${n1(x + 9)},${n1(y + 31)}L${n1(x - 9)},${n1(y + 31)}Z" fill="${PALETA.ocre}"/>`;
    } else if (tipo === 2) {
      simbolos += `<text x="${n1(x)}" y="${n1(y)}" font-size="16" fill="${PALETA.tinta}">✱</text>`;
    } else {
      for (let k = 0; k < 3; k++) {
        const yy = y + k * 8;
        simbolos += `<path d="M${n1(x)},${n1(yy)}q6,-5 12,0t12,0t12,0" fill="none" stroke="${PALETA.ultramar}" stroke-width="1.3"/>`;
      }
    }
  }
  capas.push(`<g>${simbolos}</g>`);

  // --- marco graduado ---
  if (conMarco) capas.push(marco(ancho, alto, margen, banda));

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${ancho} ${alto}" width="${ancho}" height="${alto}" aria-hidden="true">${capas.join('')}</svg>`;
}

// Rosa de los vientos con su graduación de 360°, anillo interior y estrella.
function rosa(cx: number, cy: number, r: number): string {
  const c = PALETA.bermellon;
  const interior = r * 0.64;
  let marcas = '';
  for (let grado = 0; grado < 360; grado++) {
    const a = (grado - 90) * (Math.PI / 180);
    const largo = grado % 10 === 0 ? 14 : grado % 5 === 0 ? 9 : 4.5;
    marcas += `<line x1="${n1(Math.cos(a) * r)}" y1="${n1(Math.sin(a) * r)}" x2="${n1(Math.cos(a) * (r - largo))}" y2="${n1(Math.sin(a) * (r - largo))}"/>`;
    if (grado % 2 === 0) {
      marcas += `<line x1="${n1(Math.cos(a) * interior)}" y1="${n1(Math.sin(a) * interior)}" x2="${n1(Math.cos(a) * (interior - (grado % 10 === 0 ? 8 : 4)))}" y2="${n1(Math.sin(a) * (interior - (grado % 10 === 0 ? 8 : 4)))}"/>`;
    }
  }
  let numeros = '';
  for (let grado = 0; grado < 360; grado += 30) {
    numeros += `<text transform="rotate(${grado}) translate(0 ${n1(-r - 6)})" text-anchor="middle">${String(grado).padStart(3, '0')}</text>`;
  }
  const brazo = (angulo: number, largo: number, relleno: boolean) => {
    const a = (angulo - 90) * (Math.PI / 180);
    const p = (ang: number, l: number) => `${n1(Math.cos(ang) * l)},${n1(Math.sin(ang) * l)}`;
    const ancho = 0.16;
    return `<path d="M${p(a, largo)}L${p(a + ancho, largo * 0.22)}L0,0L${p(a - ancho, largo * 0.22)}Z" fill="${relleno ? c : 'none'}"/>`;
  };
  return `<g transform="translate(${cx} ${cy})" stroke="${c}" fill="none" stroke-width="0.7">
    <circle r="${r}" stroke-width="1.2"/><circle r="${n1(r - 15)}"/><circle r="${n1(interior)}"/><circle r="${n1(interior - 9)}"/>
    <g stroke-width="0.6">${marcas}</g>
    <g fill="${c}" stroke="none" font-family="'Archivo Narrow', sans-serif" font-size="8">${numeros}</g>
    <line x1="${-r}" y1="0" x2="${r}" y2="0" stroke-dasharray="2 4"/><line x1="0" y1="${-r}" x2="0" y2="${r}" stroke-dasharray="2 4"/>
    <line x1="${n1(-r * 0.7)}" y1="${n1(-r * 0.7)}" x2="${n1(r * 0.7)}" y2="${n1(r * 0.7)}" stroke-width="0.4"/><line x1="${n1(r * 0.7)}" y1="${n1(-r * 0.7)}" x2="${n1(-r * 0.7)}" y2="${n1(r * 0.7)}" stroke-width="0.4"/>
    ${brazo(0, interior - 10, true)}${brazo(90, interior * 0.75, false)}${brazo(180, interior * 0.75, false)}${brazo(270, interior * 0.75, false)}
    ${brazo(45, interior * 0.45, false)}${brazo(135, interior * 0.45, false)}${brazo(225, interior * 0.45, false)}${brazo(315, interior * 0.45, false)}
    <circle r="3" fill="${c}"/>
    <text y="${n1(-interior - 22)}" text-anchor="middle" fill="${c}" stroke="none" font-family="Tinos, serif" font-weight="700" font-size="${Math.max(9, r * 0.08).toFixed(0)}">N</text>
    <text y="${n1(interior * 0.45)}" text-anchor="middle" fill="${c}" stroke="none" font-family="'Archivo Narrow', sans-serif" font-size="7" letter-spacing="1">VAR 7°30'W · 2026</text>
  </g>`;
}

// Marco de la carta: línea exterior, banda graduada en franjas alternadas y
// coordenadas en los cuatro bordes.
function marco(ancho: number, alto: number, margen: number, banda: number): string {
  const t = PALETA.tinta;
  let franjas = '';
  let rotulos = '';
  const paso = 25;
  for (let x = margen + banda, i = 0; x < ancho - margen - banda; x += paso, i++) {
    if (i % 2 === 0) {
      franjas += `<rect x="${x}" y="${margen}" width="${paso}" height="${banda}"/>`;
      franjas += `<rect x="${x}" y="${alto - margen - banda}" width="${paso}" height="${banda}"/>`;
    }
    if (i % 8 === 0) {
      const minutos = 40 + i / 4;
      rotulos += `<text x="${x}" y="${margen - 7}" text-anchor="middle">81°${String(Math.floor(minutos % 60)).padStart(2, '0')}'W</text>`;
      rotulos += `<text x="${x}" y="${alto - margen + 15}" text-anchor="middle">81°${String(Math.floor(minutos % 60)).padStart(2, '0')}'W</text>`;
    }
  }
  for (let y = margen + banda, i = 0; y < alto - margen - banda; y += paso, i++) {
    if (i % 2 === 1) {
      franjas += `<rect x="${margen}" y="${y}" width="${banda}" height="${paso}"/>`;
      franjas += `<rect x="${ancho - margen - banda}" y="${y}" width="${banda}" height="${paso}"/>`;
    }
    if (i % 8 === 0) {
      const minutos = 35 - i / 4;
      const texto = `12°${String(Math.floor(((minutos % 60) + 60) % 60)).padStart(2, '0')}'N`;
      rotulos += `<text transform="translate(${margen - 8} ${y}) rotate(-90)" text-anchor="middle">${texto}</text>`;
      rotulos += `<text transform="translate(${ancho - margen + 15} ${y}) rotate(-90)" text-anchor="middle">${texto}</text>`;
    }
  }
  return `<g>
    <rect x="${margen}" y="${margen}" width="${ancho - 2 * margen}" height="${alto - 2 * margen}" fill="none" stroke="${t}" stroke-width="1.6"/>
    <rect x="${margen + banda}" y="${margen + banda}" width="${ancho - 2 * (margen + banda)}" height="${alto - 2 * (margen + banda)}" fill="none" stroke="${t}" stroke-width="0.8"/>
    <rect x="${margen - 6}" y="${margen - 6}" width="${ancho - 2 * margen + 12}" height="${alto - 2 * margen + 12}" fill="none" stroke="${t}" stroke-width="0.5"/>
    <g fill="${t}">${franjas}</g>
    <g fill="${t}" font-family="'Archivo Narrow', sans-serif" font-size="8" letter-spacing="0.5">${rotulos}</g>
  </g>`;
}
