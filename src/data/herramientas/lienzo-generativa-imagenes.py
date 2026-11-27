# Imágenes verticales del lienzo de la DERIVA:02. Uso, desde la raíz:
#   python3 src/data/herramientas/lienzo-generativa-imagenes.py
# Imágenes verticales del lienzo de la DERIVA:02, a partir de las de la página
# editorial (public/curso02/imagenes/editorial/): las composiciones se separan
# en sus paneles; las horizontales se recortan 9:16 por el centro.
import os
from PIL import Image
E='public/curso02/imagenes/editorial/'; OUT='public/curso02/imagenes/lienzo/'
os.makedirs(OUT, exist_ok=True)
TRES=[(0,460),(469,930),(939,1400)]        # composiciones de tres, 1400 px
TRES_CHICA=[(0,260),(271,532),(543,804)]   # composiciones de tres, 804 px
DOS_1036=[(0,512),(523,1036)]
DOS_1400=[(0,695),(704,1400)]
def paneles(archivo, cortes, nombres):
    im=Image.open(E+archivo).convert('RGB'); h=im.size[1]
    for (x0,x1),n in zip(cortes,nombres):
        im.crop((x0,0,x1,h)).save(OUT+n+'.webp',quality=82,method=6)
def vertical(archivo, nombre, centro=0.5):
    im=Image.open(E+archivo).convert('RGB'); w,h=im.size; cw=round(h*9/16)
    x0=max(0,min(w-cw,round(w*centro-cw/2)))
    im.crop((x0,0,x0+cw,h)).save(OUT+nombre+'.webp',quality=82,method=6)

vertical('cap01-stochastic-parrots.webp','cap01-stochastic-parrots')
paneles('cap02-metaversed-nature-1.webp',TRES,['cap02-haemolacria','cap02-plastic-natianta','cap02-marshals-queer-aigrette'])
paneles('cap02-metaversed-nature-2.webp',TRES,['cap02-three-body-problem','cap02-diaspores','cap02-the-battle'])
paneles('cap02-metaversed-nature-3.webp',DOS_1036,['cap02-fly-in-the-ointment','cap02-neural-rhythm'])
vertical('cap03-orchestrion.webp','cap03-orchestrion')
paneles('cap04-computational-mythology-1.webp',DOS_1036,['cap04-blood-moon-turban','cap04-systems-of-inequalities'])
paneles('cap04-computational-mythology-2.webp',DOS_1036,['cap04-false-northing','cap04-mboi-tata'])
for i in (2,3,4):
    paneles(f'cap06-meanwhile-in-the-southern-hemisphere-a-l-{i}.webp',TRES_CHICA,[f'cap06-meanwhile-{i}{l}' for l in 'abc'])
vertical('cap07-blue-prowess.webp','cap07-blue-prowess')
paneles('cap08-digital-cartography.webp',DOS_1400,['cap08-pormenores','cap08-green-velvet-reward'])
vertical('cap09-dispensable-treasure-maps.webp','cap09-dispensable-treasure-maps')
for i in (1,2,3):
    paneles(f'cap10-yabot-lowlands-{i}.webp',TRES_CHICA,[f'cap10-yaboti-{i}{l}' for l in 'abc'])
paneles('cap11-edge-effects.webp',DOS_1400,['cap11-windowsill-ill-sprouts','cap11-fertile-regolith'])
vertical('cap12-fire-season-1.webp','cap12-fire-season-1')
paneles('cap12-fire-season-2.webp',TRES,[f'cap12-fire-season-2{l}' for l in 'abc'])
for i in (3,6,7):
    paneles(f'cap12-fire-season-{i}.webp',TRES_CHICA,[f'cap12-fire-season-{i}{l}' for l in 'abc'])
vertical('cap13-the-ostrich-evidence.webp','cap13-the-ostrich-evidence')
paneles('cap14-bubbled-by-design.webp',DOS_1400,['cap14-la-noria','cap14-the-order-of-the-struggle'])
vertical('cap15-eardrum-negentropy.webp','cap15-eardrum-negentropy')
paneles('cap16-sacred-urbanity.webp',DOS_1400,['cap16-scaffolded-whole','cap16-kite-festival'])
for i in (1,2,3):
    paneles(f'cap17-astralium-{i}.webp',TRES_CHICA,[f'cap17-astralium-{i}{l}' for l in 'abc'])
    paneles(f'cap18-lombrela-{i}.webp',TRES_CHICA,[f'cap18-lombrela-{i}{l}' for l in 'abc'])
