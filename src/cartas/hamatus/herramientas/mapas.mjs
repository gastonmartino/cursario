// Genera los mapas de Latinoamérica de la carta hamatus (sitios de hallazgo).
// No es parte del sitio: necesita world-atlas@2, topojson-client@3 y d3-geo@3,
// instalados aparte (npm i en una carpeta temporal), y se corre desde ahí:
//   node mapas.mjs <ruta a src/cartas/hamatus/mapas>

import fs from 'node:fs';
import { feature } from 'topojson-client';
import { geoMercator, geoPath, geoGraticule10, geoGraticule } from 'd3-geo';
const out = process.argv[2];
fs.mkdirSync(out, { recursive: true });
const load = (f) => JSON.parse(fs.readFileSync(`node_modules/world-atlas/${f}`));
const land50 = feature(load('land-50m.json'), load('land-50m.json').objects.land);
const land10 = feature(load('land-10m.json'), load('land-10m.json').objects.land);
const paises50 = feature(load('countries-50m.json'), load('countries-50m.json').objects.countries);
const paises110 = feature(load('countries-110m.json'), load('countries-110m.json').objects.countries);

// Sitios de hallazgo (ficticios, en lugares reales).
const SITIOS = [
  { id: 'HH-01', nombre: 'Conurbano bonaerense', lon: -58.4, lat: -34.75 },
  { id: 'HH-02', nombre: 'Montevideo', lon: -56.17, lat: -34.88, lado: 'abajo' },
  { id: 'HH-03', nombre: 'Asunción', lon: -57.6, lat: -25.28 },
  { id: 'HH-04', nombre: 'La Paz', lon: -68.15, lat: -16.5 },
  { id: 'HH-05', nombre: 'Lima', lon: -77.03, lat: -12.05 },
  { id: 'HH-06', nombre: 'São Paulo', lon: -46.63, lat: -23.55 },
  { id: 'HH-07', nombre: 'Ciudad de México', lon: -99.13, lat: 19.43 },
  { id: 'HH-08', nombre: 'Santiago', lon: -70.65, lat: -33.45 },
];

const coord = (v, pos, neg) => `${Math.abs(v).toFixed(2)}°${v >= 0 ? pos : neg}`;

function mapa({ nombre, paisesFuente = 50, letra = 11, land, ancho, alto, centro, escala, anillos, sitios, rot = 0, graticula = 10, paises = false }) {
  const proj = geoMercator().center(centro).scale(escala).translate([ancho / 2, alto / 2]).angle(rot).clipExtent([[-60, -60], [ancho + 60, alto + 60]]);
  const path = geoPath(proj).digits(1);
  const d = path(land);
  const grat = path(geoGraticule().step([graticula, graticula])());
  const tinta = '#2b2f36';
  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${ancho} ${alto}" width="${ancho}" height="${alto}">
<defs>
  <pattern id="trama" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
    <circle cx="1.5" cy="1.5" r="1.05" fill="${tinta}" fill-opacity=".38"/>
  </pattern>
  <clipPath id="marco"><rect width="${ancho}" height="${alto}"/></clipPath>
  <path id="costa" d="${d}"/>
</defs>
<g clip-path="url(#marco)">
<path d="${grat}" fill="none" stroke="${tinta}" stroke-opacity=".18" stroke-width=".6" stroke-dasharray="2 4"/>
`;
  // Curvas de nivel: el contorno repetido con trazos cada vez más finos,
  // alternando tinta y papel (de afuera hacia adentro).
  anillos.forEach((w, i) => {
    s += `<use href="#costa" fill="none" stroke="${i % 2 ? '#f1efe9' : tinta}" stroke-opacity="${i % 2 ? 1 : 0.22}" stroke-width="${w}" stroke-linejoin="round"/>\n`;
  });
  s += `<use href="#costa" fill="#f1efe9"/>\n<use href="#costa" fill="url(#trama)"/>\n`;
  if (paises) s += `<path d="${path(paisesFuente === 110 ? paises110 : paises50)}" fill="none" stroke="${tinta}" stroke-opacity=".45" stroke-width=".7" stroke-dasharray="3 2"/>\n`;
  s += `<use href="#costa" fill="none" stroke="${tinta}" stroke-width="1.3" stroke-linejoin="round"/>\n`;
  for (const sitio of sitios) {
    const [x, y] = proj([sitio.lon, sitio.lat]);
    if (x < 0 || y < 0 || x > ancho || y > alto) continue;
    const k = letra / 11, r = 9 * k, c = 14 * k;
    const tx = x + c, ty = sitio.lado === 'abajo' ? y + 2.6 * c : y - 0.5 * c;
    s += `<g font-family="'IBM Plex Mono', monospace" font-size="${letra}" fill="${tinta}">
  <circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#c8102e" stroke-width="${1.2 * k}"/>
  <path d="M${x - c} ${y}h${2 * c}M${x} ${y - c}v${2 * c}" stroke="#c8102e" stroke-width="${k}"/>
  <text x="${tx}" y="${ty}" font-weight="600" fill="#c8102e">${sitio.id}</text>
  <text x="${tx}" y="${ty + 1.15 * letra}">${sitio.nombre.toUpperCase()}</text>
  <text x="${tx}" y="${ty + 2.3 * letra}" fill-opacity=".7">${coord(sitio.lat, 'N', 'S')} ${coord(sitio.lon, 'E', 'O')}</text>
</g>\n`;
  }
  s += `</g></svg>\n`;
  fs.writeFileSync(`${out}/${nombre}.svg`, s);
  console.log(nombre, (s.length / 1024).toFixed(0) + ' KB');
}

mapa({ nombre: 'mapa-latinoamerica', land: land50, paisesFuente: 110, letra: 17, ancho: 900, alto: 1200, centro: [-75, -8], escala: 430, anillos: [46, 38, 30, 22, 14, 7], sitios: SITIOS.filter((s) => s.id !== 'HH-02'), paises: true });
mapa({ nombre: 'mapa-rio-de-la-plata', land: land50, letra: 16, ancho: 1200, alto: 800, centro: [-57.6, -34.6], escala: 9000, anillos: [120, 100, 80, 60, 40, 20], sitios: SITIOS.slice(0, 2), graticula: 1 });
mapa({ nombre: 'mapa-cono-sur', land: land50, ancho: 1000, alto: 900, centro: [-63, -33], escala: 1300, anillos: [70, 56, 42, 28, 14], sitios: [SITIOS[0], SITIOS[1], SITIOS[2], SITIOS[7]], paises: true, graticula: 5 });
mapa({ nombre: 'mapa-andes', land: land50, ancho: 900, alto: 900, centro: [-72, -14], escala: 1500, anillos: [60, 48, 36, 24, 12], sitios: [SITIOS[3], SITIOS[4]], paises: true, graticula: 5 });
