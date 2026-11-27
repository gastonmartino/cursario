// Mide la altura de las tarjetas del lienzo de la DERIVA:02 (islas e islotes)
// con todas las imágenes cargadas. Necesita el sitio en http://localhost:4321.
// Uso: node lienzo-generativa-medir.cjs <alturas.json>
const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1440,height:900}});
await p.goto('http://localhost:4321/?deriva=generativa');await p.waitForTimeout(2500);
// Cargar todas las imágenes de las tarjetas del lienzo de la deriva.
await p.evaluate(async()=>{
  const nodos=[...document.querySelectorAll('[id^="spatial-subnode-gen-"],[id^="spatial-islote-islote-gen"],[id^="spatial-islote-islote-generativa"]')];
  const imgs=nodos.flatMap(n=>[...n.querySelectorAll('img')]);
  imgs.forEach(i=>{i.loading='eager';});
  await Promise.all(imgs.map(i=>i.complete&&i.naturalWidth?0:new Promise(r=>{i.onload=i.onerror=r;setTimeout(r,8000);})));
});
await p.waitForTimeout(800);
const r=await p.evaluate(()=>{const o={};
 document.querySelectorAll('[id^="spatial-subnode-gen-"]').forEach(n=>{o[n.id.replace('spatial-subnode-','')]=n.offsetHeight;});
 document.querySelectorAll('[id^="spatial-islote-islote-gen"]').forEach(n=>{o[n.id.replace('spatial-islote-','')]=n.offsetHeight;});
 return o;});
require('fs').writeFileSync(process.argv[2],JSON.stringify(r,null,1));
const v=Object.entries(r);console.log(v.length,'medidas');
console.log(v.filter(([k])=>!k.startsWith('islote-gen-cap')||k.length<20).map(([k,h])=>k+':'+h).join('  '));
await b.close();})();
