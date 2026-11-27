# Genera el lienzo de la DERIVA:02 (Gráfica Generativa) a partir de la
# estructura de su página editorial: partes, capítulos, obras y series.
#   - Capítulo de una sola obra: una isla con el nombre y la descripción del
#     capítulo.
#   - Capítulo de varias obras: un cartel (islote) con el capítulo y su
#     descripción, y debajo una isla por obra.
#   - Serie: una isla con el nombre y la descripción del capítulo, con la
#     imagen principal, e islotes chicos con las demás imágenes.
#   - Parte: un cartel (islote) sobre sus capítulos.
# Reescribe los bloques del curso02 en src/motor/Derivas.ts, src/data/islas.ts
# y src/data/islotes.ts. Las alturas medidas se leen de alturas.json (si no
# existe, se estiman). Uso, desde la raíz del repositorio:
#   python3 src/data/herramientas/lienzo-generativa.py src/data/herramientas/lienzo-generativa-alturas.json
# Para volver a medir las alturas (con el sitio en npx astro preview --port 4321):
#   node src/data/herramientas/lienzo-generativa-medir.cjs src/data/herramientas/lienzo-generativa-alturas.json
# (con las tarjetas recién generadas con alturas chicas, para medir su altura natural).
import json, os, re, sys

L = '/curso02/imagenes/lienzo/'
COLOR = '#16253D'

PARTES = [
    (1, 'Generative Digital Art', 'Visualization of mereological relationships within —and between— particle systems.'),
    (2, 'Forking paths', 'The paths that branch out in the garden reconnect somewhere in the depths, only to branch out again within our minds. They trace connections that are at times visible and sometimes hermetically latent.'),
    (3, 'Max Extract', 'A relentlessly extractive machinery designed to build efficient solutions to non-existent problems.'),
    (4, 'The encroachment', 'Inner spaces violently usurped by a hasty move to the bit.'),
    (5, 'Meticulously unplanned', 'A transient scaffolding that shapes the habitat of digital identities.'),
]

# (capítulo, parte, nombre, descripción, tipo, contenido)
#   tipo 'obra': contenido = (id, imagen)
#   tipo 'obras': contenido = [(id, nombre, descripción, imagen), …]
#   tipo 'serie': contenido = (id, imagen principal, [imágenes de los islotes])
def serie(prefijo, grupos):
    return [L + f'{prefijo}-{g}{l}.webp' for g in grupos for l in 'abc']

CAPITULOS = [
    (1, 1, 'Stochastic Parrots', 'Raised for deterministic purposes.', 'obra', ('gen-cap01', L + 'cap01-stochastic-parrots.webp')),
    (2, 1, 'Metaversed Nature', 'Pixel perfect wilderness', 'obras', [
        ('gen-cap02-haemolacria', 'Haemolacria', 'Just as the last flash of green was fading, tears of the deepest red hit the ground.', L + 'cap02-haemolacria.webp'),
        ('gen-serie-03', 'Plastic Natianta', 'Plasticized seabed weaves its way through the food chain, back to the surface.', None),
        ('gen-cap02-aigrette', "The Marshal's Queer Aigrette", 'A prouder silhouette of the wearer, extending beyond the battlefield.', L + 'cap02-marshals-queer-aigrette.webp'),
        ('gen-cap02-three-body', 'The Three-Body Problem', 'Controlling the uncontrollable to become more controllable.', L + 'cap02-three-body-problem.webp'),
        ('gen-serie-04', 'Diaspores', 'The diaspora commences right after the vibrant cry of the lichens.', None),
        ('gen-cap02-battle', 'The Battle', 'The struggle only starts after the beast has been tamed.', L + 'cap02-the-battle.webp'),
        ('gen-cap02-ointment', 'Fly in the Ointment', 'After the convenient discovery of the insect, no one questioned the alleged benefits of the ointment again.', L + 'cap02-fly-in-the-ointment.webp'),
        ('gen-cap02-neural-rhythm', 'Neural Rhythm', 'The synchronized oscillations of the media platforms will tirelessly attempt to modulate attentions until all memories dance to the same drumbeat.', L + 'cap02-neural-rhythm.webp'),
    ]),
    (3, 1, 'Orchestrion', 'Although the artificiality of harmony goes unnoticed by most dancers, the insistence on the automatically regurgitated repertoire always ends up composing the same melody.', 'obra', ('gen-cap03', L + 'cap03-orchestrion.webp')),
    (4, 1, 'Computational Mythology', "Authorless anthology narratives that steer the world's dark compass needle.", 'obras', [
        ('gen-cap04-blood-moon', 'Blood Moon Turban', 'Lurking behind the veil of the red moon, the killer is on the prowl. Not as innocuous as a snail can possibly be, but decidedly bloodier.', L + 'cap04-blood-moon-turban.webp'),
        ('gen-cap04-inequalities', 'Systems of Inequalities', 'Apparently, no quadrant contains the solution to these inequalities.', L + 'cap04-systems-of-inequalities.webp'),
        ('gen-cap04-false-northing', 'False Northing', 'Always projecting North positivity for your convenience.', L + 'cap04-false-northing.webp'),
        ('gen-cap04-mboi-tata', 'Mbói Tatá', 'Forever outfired by the serpent.', L + 'cap04-mboi-tata.webp'),
    ]),
    (5, 1, 'Sarandí Revelation', 'Then the angel emptied out his bowl into the river and the beast was allowed to scourge the poor with dispensation.', 'obra', ('gen-serie-01', None)),
    (6, 1, 'Meanwhile, in the Southern Hemisphere, a lymphatic summer', 'While the eyes of the world are upon the blood, the lymph flows unnoticed, always in the same direction.', 'serie', ('gen-serie-05', None, serie('cap06-meanwhile', '234'))),
    (7, 1, 'Blue Prowess', 'A buggy blue superiority buried in our deepest thoughts.', 'obra', ('gen-cap07', L + 'cap07-blue-prowess.webp')),
    (8, 2, 'Digital Cartography', 'Virtual representations explaining an increasingly opaque world.', 'obras', [
        ('gen-cap08-pormenores', 'Pormenores', 'In a distant land, a fearless elf set off on a quest to find a pot of gold at the end of the rainbow, only to discover that no one had properly explained the details of the path he needed to take.', L + 'cap08-pormenores.webp'),
        ('gen-cap08-green-velvet', 'Green Velvet Reward', 'It has never been easier to place a bet.', L + 'cap08-green-velvet-reward.webp'),
    ]),
    (9, 2, 'Dispensable Treasure Maps', 'Pointless artifacts describing the fateful legacy buried in landfills for future generations.', 'obra', ('gen-cap09', L + 'cap09-dispensable-treasure-maps.webp')),
    (10, 2, 'Yabotí Lowlands', "Aerial shots of the enigmatic signs of old that mark the verdant turtle's back in Yabotí lowlands.", 'serie', ('gen-cap10', L + 'cap10-yaboti-1a.webp', serie('cap10-yaboti', '123')[1:])),
    (11, 3, 'Edge Effects', 'Opportunistic species will benefit most from new fragmented habitats.', 'obras', [
        ('gen-cap11-windowsill', 'Windowsill Ill Sprouts', 'No more marks/spots from acid rain on your windows! Protect your glass surfaces with the new eco-friendly, plant-powered, multi-surface cleaner, and clean your home naturally, without the unpleasant chemical residues.', L + 'cap11-windowsill-ill-sprouts.webp'),
        ('gen-serie-06', 'Fertile Regolith', 'Sixty Harvest Moons Left.', None),
    ]),
    (12, 3, 'Fire Season', 'The big season finale will let nothing but soot.', 'serie', ('gen-cap12', L + 'cap12-fire-season-2a.webp',
        [L + 'cap12-fire-season-1.webp'] + [L + f'cap12-fire-season-2{l}.webp' for l in 'bc'] + serie('cap12-fire-season', '367'))),
    (13, 3, 'The Ostrich Evidence', 'There’s a secret in the blushed sand, a silent story buried in the bones of the feathered dinosaur. The runner of the sky.', 'obra', ('gen-cap13', L + 'cap13-the-ostrich-evidence.webp')),
    (14, 4, 'Bubbled by Design', 'Every click, every tap, every scroll strategically planned to thicken your digital bubble.', 'obras', [
        ('gen-cap14-la-noria', 'La Noria', 'Stroboscopic seduction of the wagon-wheel effect during the Tenties Gold Rush.', L + 'cap14-la-noria.webp'),
        ('gen-cap14-struggle', 'The Order of the Struggle', 'When predation, competition, and parasitism regulate the tangle, each pair of legs of the centipede must wait for its turn to move.', L + 'cap14-the-order-of-the-struggle.webp'),
    ]),
    (15, 4, 'Eardrum Negentropy', 'After hearing the red noise for so long, the exact words of the omen were whispered in their ears.', 'obra', ('gen-cap15', L + 'cap15-eardrum-negentropy.webp')),
    (16, 5, 'Sacred Urbanity', 'Season of vulnerable cities blossoming.', 'obras', [
        ('gen-cap16-scaffolded', 'Scaffolded Whole', 'The synapse during own thinking also relies on scaffolding.', L + 'cap16-scaffolded-whole.webp'),
        ('gen-cap16-kite', 'Kite Festival Above, But Temple Below', 'Kites soar up in the sky, while temples root deep in the hills.', L + 'cap16-kite-festival.webp'),
        # Sin equivalente en la página editorial: se conservan su título y descripción.
        ('gen-serie-02', None, None, None),
    ]),
    (17, 5, 'Astralium', 'A series of generative web3 astral cards.', 'serie', ('gen-cap17', L + 'cap17-astralium-1a.webp', serie('cap17-astralium', '123')[1:])),
    (18, 5, 'Lombrela', 'In shadows of struggle, our path we sketch.', 'serie', ('gen-cap18', L + 'cap18-lombrela-1a.webp', serie('cap18-lombrela', '123')[1:])),
]

# Enlaces externos de las islas (detailHref): la tarjeta lleva a esa
# dirección, en una pestaña nueva, con el botón VER ↗.
ENLACES = {
    'gen-cap01': 'https://objkt.com/tokens/KT1Gj1viD8ggFTJVEL3GKcUazB2QE2K9HyLS/118',  # Stochastic Parrots
    'gen-cap02-haemolacria': 'https://objkt.com/tokens/KT1Gj1viD8ggFTJVEL3GKcUazB2QE2K9HyLS/120',  # Haemolacria
    'gen-serie-03': 'https://objkt.com/tokens/KT1Gj1viD8ggFTJVEL3GKcUazB2QE2K9HyLS/123',  # Plastic Natianta
    'gen-cap02-aigrette': 'https://objkt.com/tokens/KT1Gj1viD8ggFTJVEL3GKcUazB2QE2K9HyLS/121',  # The Marshal's Queer Aigrette
    'gen-cap02-three-body': 'https://objkt.com/tokens/KT1Gj1viD8ggFTJVEL3GKcUazB2QE2K9HyLS/124',  # The Three-Body Problem
    'gen-serie-04': 'https://objkt.com/tokens/KT1Gj1viD8ggFTJVEL3GKcUazB2QE2K9HyLS/122',  # Diaspores
    'gen-cap02-battle': 'https://objkt.com/tokens/KT1Gj1viD8ggFTJVEL3GKcUazB2QE2K9HyLS/127',  # The Battle
    'gen-cap02-ointment': 'https://objkt.com/tokens/KT1Gj1viD8ggFTJVEL3GKcUazB2QE2K9HyLS/128',  # Fly in the Ointment
    'gen-cap02-neural-rhythm': 'https://objkt.com/tokens/hicetnunc/866385',  # Neural Rhythm
    'gen-cap03': 'https://objkt.com/tokens/hicetnunc/866619',  # Orchestrion
    'gen-cap04-blood-moon': 'https://objkt.com/tokens/KT1Gj1viD8ggFTJVEL3GKcUazB2QE2K9HyLS/115',  # Blood Moon Turban
    'gen-cap04-inequalities': 'https://objkt.com/tokens/KT1Gj1viD8ggFTJVEL3GKcUazB2QE2K9HyLS/117',  # Systems of Inequalities
    'gen-cap04-false-northing': 'https://objkt.com/tokens/KT1Gj1viD8ggFTJVEL3GKcUazB2QE2K9HyLS/101',  # False Northing
    'gen-cap04-mboi-tata': 'https://objkt.com/tokens/KT1Gj1viD8ggFTJVEL3GKcUazB2QE2K9HyLS/113',  # Mbói Tatá
    'gen-serie-01': 'https://objkt.com/tokens/KT1Gj1viD8ggFTJVEL3GKcUazB2QE2K9HyLS/125',  # Sarandí Revelation
    'gen-serie-05': 'https://objkt.com/tokens/KT1Gj1viD8ggFTJVEL3GKcUazB2QE2K9HyLS/97',  # Meanwhile, in the Southern Hemisphere, a lymphatic summer
    'gen-cap07': 'https://objkt.com/tokens/KT1Gj1viD8ggFTJVEL3GKcUazB2QE2K9HyLS/119',  # Blue Prowess
    'gen-cap08-pormenores': 'https://objkt.com/tokens/KT1Gj1viD8ggFTJVEL3GKcUazB2QE2K9HyLS/126',  # Pormenores
    'gen-cap08-green-velvet': 'https://objkt.com/tokens/KT1CgF2L4mF4hxMbYrFytiGHvnME3NLM8d64/8',  # Green Velvet Reward
    'gen-cap09': 'https://objkt.com/curations/objkt/dispensable-treasure-maps-7818d03c',  # Dispensable Treasure Maps
    'gen-cap10': 'https://objkt.com/curations/objkt/yaboti-lowlands-f925a5c4',  # Yabotí Lowlands
    'gen-cap11-windowsill': 'https://objkt.com/tokens/hicetnunc/847373',  # Windowsill Ill Sprouts
    'gen-serie-06': 'https://objkt.com/tokens/KT1Gj1viD8ggFTJVEL3GKcUazB2QE2K9HyLS/99',  # Fertile Regolith
    'gen-cap12': 'https://objkt.com/curations/objkt/fire-season-2e1aa23d',  # Fire Season
    'gen-cap13': 'https://objkt.com/tokens/KT1Gj1viD8ggFTJVEL3GKcUazB2QE2K9HyLS/57',  # The Ostrich Evidence
    'gen-cap14-la-noria': 'https://objkt.com/tokens/KT1Gj1viD8ggFTJVEL3GKcUazB2QE2K9HyLS/91',  # La Noria
    'gen-cap14-struggle': 'https://objkt.com/tokens/KT1Gj1viD8ggFTJVEL3GKcUazB2QE2K9HyLS/90',  # The Order of the Struggle
    'gen-cap15': 'https://objkt.com/tokens/hicetnunc/848964',  # Eardrum Negentropy
    'gen-cap16-scaffolded': 'https://objkt.com/tokens/hicetnunc/847467',  # Scaffolded Whole
    'gen-cap16-kite': 'https://objkt.com/tokens/hicetnunc/847469',  # Kite Festival Above, But Temple Below
    'gen-serie-02': 'https://objkt.com/tokens/hicetnunc/850950',  # Meticulously Unplanned
    'gen-cap17': 'https://objkt.com/curations/objkt/astralium-2deb015d',  # Astralium
    'gen-cap18': 'https://objkt.com/curations/objkt/lombrela-73a6a925',  # Lombrela
}
# Avatares de los capítulos: una imagen cuadrada (de AV, ver
# lienzo-generativa-imagenes.py) en un islote a la izquierda del cartel del
# capítulo, de su mismo alto; el cartel se achica para dejarle lugar. En un
# capítulo sin cartel (una serie), a la altura de los carteles de la fila,
# sobre la isla.
AV = '/curso02/imagenes/avatares/'
AVATARES = {
    4: 'cap04-computational-mythology',
    8: 'cap08-digital-cartography',
    11: 'cap11-edge-effects',
    12: 'cap12-fire-season',
    14: 'cap14-bubbled-by-design',
    16: 'cap16-sacred-urbanity',
}
AG = 20  # entre el avatar y el cartel

# Lo que el botón agrega a la altura de la tarjeta.
ALTO_BOTON = 18

# Filas del lienzo: qué partes van en cada una.
FILAS = [[1], [2, 3], [4, 5]]

# Medidas (px del lienzo)
IW, G, CG, PG, RG = 400, 40, 120, 300, 260   # isla, entre islas, entre capítulos, entre partes, entre filas
SW, SG, SROWS = 150, 16, 3                     # islotes de las series
EST = {'isla': 930, 'cartel': 160, 'parte': 150, 'islote': 252}

ALTURAS = json.load(open(sys.argv[1])) if len(sys.argv) > 1 and os.path.exists(sys.argv[1]) else {}
alto = lambda id_, tipo: ALTURAS.get(id_, EST[tipo]) + (ALTO_BOTON if id_ in ENLACES else 0)

# Los datos actuales de las islas que ya existían (se conservan sus campos).
ISLAS_TS = open('src/data/islas.ts').read()
def existente(id_):
    m = re.search(r"\n  \{\n    id: '" + id_ + r"',\n(.*?)\n  \},", ISLAS_TS, re.S)
    campos = {}
    for linea in m.group(1).split('\n'):
        k = re.match(r"\s*(\w+): (.*?),?\s*$", linea)
        if k: campos[k.group(1)] = k.group(2).rstrip(',').strip()
    return campos

q = lambda s: "'" + s.replace('\\', '\\\\').replace("'", "\\'") + "'"
codigo = lambda n: f'#{n}'

islas, estructura_islas, islotes, estructura_islotes = [], [], [], []
contador = {'curso': 7, 'islote': 23}
def subcurso():
    s = f"curso{contador['curso']:03d}"; contador['curso'] += 1; return s
def subislote():
    s = f"islote{contador['islote']:03d}"; contador['islote'] += 1; return s
SUBCURSOS_EXISTENTES = {f'gen-serie-0{i}': f'curso00{i}' for i in range(1, 7)}

def isla(id_, x, y, ancho, alto_, cod, cabecera, etiqueta, titulo, descripcion, imagen):
    estructura_islas.append((id_, SUBCURSOS_EXISTENTES.get(id_) or subcurso(), x, y, ancho, alto_))
    previo = existente(id_) if id_ in SUBCURSOS_EXISTENTES else {}
    campos = [('id', q(id_))]
    campos.append(('imageUrl', previo.get('imageUrl') or q(imagen)))
    if 'thumbnailImageUrl' in previo: campos.append(('thumbnailImageUrl', previo['thumbnailImageUrl']))
    else: campos.append(('thumbnailImageUrl', q(imagen.replace('/lienzo/', '/miniaturas/'))))  # para el Derrotero
    campos += [('code', q(cod)),
               ('title', q(titulo) if titulo else previo['title']),
               ('description', q(descripcion) if descripcion else previo['description']),
               ('tag', q(etiqueta)), ('accentColor', q(COLOR)), ('headerLabel', q(cabecera))]
    if id_ in ENLACES: campos.append(('detailHref', q(ENLACES[id_])))
    for k in ('imageCaption', 'imageDate', 'keywords'):
        if k in previo: campos.append((k, previo[k]))
    islas.append(campos)

def islote(id_, superior, x, y, ancho, alto_, campos):
    estructura_islotes.append((id_, superior, subislote(), x, y, ancho, alto_))
    islotes.append([('id', q(id_))] + campos)

def avatar(n, nombre, superior, izquierda, arriba, lado):
    islote(f'islote-gen-cap{n:02d}-avatar', superior, izquierda + lado / 2, arriba + lado / 2, lado, lado, [
        ('showHeader', 'false'), ('imageUrl', q(AV + AVATARES[n] + '.webp')), ('imageMaxHeight', str(round(lado))),
        ('code', q(f'CAPÍTULO {n:02d}')), ('tag', "''"), ('accentColor', q(COLOR)), ('backgroundColor', q('#ffffff')),
        ('imageCaption', "''"), ('headerLabel', q(nombre)), ('showAction', 'false')])

# --- Disposición ---------------------------------------------------------------
def ancho_capitulo(cap):
    n, parte, nombre, desc, tipo, cont = cap
    if tipo == 'obras':
        cols = {1: 1, 2: 2, 3: 3, 4: 2, 8: 4}[len(cont)]
        return cols * IW + (cols - 1) * G
    if tipo == 'serie':
        scols = -(-len(cont[2]) // SROWS)
        return IW + 24 + scols * SW + (scols - 1) * SG
    return IW

y_fila = 0
for fila in FILAS:
    x = 0
    alto_fila = 0
    # Alto de la banda de carteles: igual para toda la fila.
    alto_parte = max(alto(f'islote-gen-parte{p}', 'parte') for p in fila)
    alto_cartel = max([alto(f'islote-gen-cap{c[0]:02d}', 'cartel') for c in CAPITULOS if c[1] in fila and c[4] == 'obras'] or [0])
    y_islas = y_fila + alto_parte + 30 + alto_cartel + 30
    for p in fila:
        caps = [c for c in CAPITULOS if c[1] == p]
        ancho_parte = sum(ancho_capitulo(c) for c in caps) + CG * (len(caps) - 1)
        x_parte = x
        primera_isla_parte = None
        for cap in caps:
            n, parte, nombre, desc, tipo, cont = cap
            w = ancho_capitulo(cap)
            if tipo == 'obra':
                id_, img = cont
                h = alto(id_, 'isla')
                isla(id_, x + IW / 2, y_islas + h / 2, IW, h, codigo(n), 'OBRA', f'PARTE {parte}', nombre, desc, img)
                alto_fila = max(alto_fila, y_islas + h - y_fila)
                primera = id_
            elif tipo == 'serie':
                id_, img, resto = cont
                h = alto(id_, 'isla')
                isla(id_, x + IW / 2, y_islas + h / 2, IW, h, codigo(n), 'SERIE', f'{len(resto) + 1} IMÁGENES', nombre, desc, img)
                x0 = x + IW + 24
                for k, imagen in enumerate(resto):
                    c, r = k // SROWS, k % SROWS
                    hi = alto(f'islote-{id_}-{k + 1:02d}', 'islote')
                    islote(f'islote-{id_}-{k + 1:02d}', id_, x0 + c * (SW + SG) + SW / 2, y_islas + r * (hi + SG) + hi / 2, SW, hi, [
                        ('showHeader', 'false'), ('imageUrl', q(imagen)), ('imageMaxHeight', '400'),
                        ('code', q(f'{codigo(n)} · {k + 2}/{len(resto) + 1}')), ('tag', "''"), ('accentColor', q(COLOR)),
                        ('imageCaption', "''"), ('headerLabel', "''"), ('showAction', 'false')])
                alto_fila = max(alto_fila, y_islas + h - y_fila)
                primera = id_
                if n in AVATARES and alto_cartel:
                    avatar(n, nombre, id_, x, y_islas - 30 - alto_cartel, alto_cartel)
            else:
                cols = {1: 1, 2: 2, 3: 3, 4: 2, 8: 4}[len(cont)]
                filas_cap = [cont[i:i + cols] for i in range(0, len(cont), cols)]
                y_obra = y_islas
                for r, obras in enumerate(filas_cap):
                    hs = [alto(o[0], 'isla') for o in obras]
                    for c, (o, h) in enumerate(zip(obras, hs)):
                        oid, onombre, odesc, oimg = o
                        isla(oid, x + c * (IW + G) + IW / 2, y_obra + h / 2, IW, h, codigo(n), nombre.upper(), f'{cont.index(o) + 1}/{len(cont)}', onombre, odesc, oimg)
                    y_obra += max(hs) + G
                alto_fila = max(alto_fila, y_obra - G - y_fila)
                primera = cont[0][0]
                hc = alto(f'islote-gen-cap{n:02d}', 'cartel')
                xc, wc = x, w
                if n in AVATARES:
                    avatar(n, nombre, primera, x, y_islas - 30 - hc, hc)
                    xc, wc = x + hc + AG, w - hc - AG
                islote(f'islote-gen-cap{n:02d}', primera, xc + wc / 2, y_islas - 30 - hc / 2, wc, hc, [
                    ('showHeader', 'true'), ('code', q(f'CAPÍTULO {n:02d}')), ('title', q(nombre)), ('description', q(desc)),
                    ('tag', q(f'PARTE {parte}')), ('accentColor', q(COLOR)), ('backgroundColor', q('#ffffff')),
                    ('headerLabel', q(nombre.upper())), ('showAction', 'false')])
            primera_isla_parte = primera_isla_parte or primera
            x += w + CG
        x = x - CG + PG
        pn, pnombre, pdesc = PARTES[p - 1]
        hp = alto(f'islote-gen-parte{p}', 'parte')
        islote(f'islote-gen-parte{p}', primera_isla_parte, x_parte + ancho_parte / 2, y_fila + hp / 2, ancho_parte, hp, [
            ('showHeader', 'true'), ('code', q(f'PARTE {p}')), ('title', q(pnombre)), ('description', q(pdesc)),
            ('tag', "''"), ('accentColor', q(COLOR)), ('backgroundColor', q('#f0ffff')),
            ('headerLabel', q(pnombre.upper())), ('showAction', 'false')])
    y_fila += alto_fila + RG

# Centrar el conjunto en el origen.
xs = [e[2] - e[4] / 2 for e in estructura_islas] + [e[2] + e[4] / 2 for e in estructura_islas]
ys = [e[3] - e[5] / 2 for e in estructura_islas] + [e[3] + e[5] / 2 for e in estructura_islas] + [e[4] - e[6] / 2 for e in estructura_islotes]
dx, dy = -round((min(xs) + max(xs)) / 2), -round((min(ys) + max(ys)) / 2)
estructura_islas = [(a, b, round(x + dx), round(y + dy), w, round(h)) for a, b, x, y, w, h in estructura_islas]
estructura_islotes = [(a, s, b, round(x + dx), round(y + dy), round(w), round(h)) for a, s, b, x, y, w, h in estructura_islotes]

# El excurso "Max Extract" (islote-generativa-01) sigue con Sarandí Revelation,
# a la izquierda de la primera fila.
# Debajo de Sarandí Revelation, que en la primera fila deja lugar debajo.
sar = next(e for e in estructura_islas if e[0] == 'gen-serie-01')
estructura_islotes.append(('islote-generativa-01', 'gen-serie-01', 'islote002', sar[2] + 10, sar[3] + sar[5] // 2 + 60 + 216, 420, 431))

# --- Escritura -------------------------------------------------------------------
def bloque(campos, sangria='    '):
    return '  {\n' + ''.join(f'{sangria}{k}: {v},\n' for k, v in campos) + '  },\n'

D = open('src/motor/Derivas.ts').read()
ini = D.index("    id: 'generativa',")
a = D.index('subcursos: [', ini) + len('subcursos: [')
b = D.index("\n    ]\n  },\n  {\n    id: 'pensamiento'", a)
D = D[:a] + '\n      // Generado por la disposición del lienzo de la DERIVA:02: partes en filas,\n      // capítulos de izquierda a derecha (ver la página editorial).\n' + ''.join(
    f"      {{\n        id: '{i}',\n        subcurso: '{s}',\n        x: {x},\n        y: {y},\n        ancho: {w},\n        alto: {h},\n      }},\n" for i, s, x, y, w, h in estructura_islas).rstrip(',\n') + D[b:]
a = D.index('  // ISLOTES DEL CURSO:02 / NIVEL 2 / SUBDERIVAS "GENERATIVA"')
b = D.index('  // ISLOTES DEL CURSO:04 / SUBDERIVAS "EXPEDIENTE 11/26"')
D = D[:a] + '''  // ISLOTES DEL CURSO:02 / NIVEL 2 / SUBDERIVAS "GENERATIVA"
  // Carteles de las partes y de los capítulos de varias obras, las demás
  // imágenes de cada serie y el excurso "Max Extract".
  // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
''' + ''.join(f"  {{\n    id: '{i}',\n    idSuperior: '{s}',\n    subcurso: '{sub}',\n    x: {x},\n    y: {y},\n    ancho: {w},\n    alto: {h},\n  }},\n" for i, s, sub, x, y, w, h in estructura_islotes) + '\n' + D[b:]
open('src/motor/Derivas.ts', 'w').write(D)

I = open('src/data/islas.ts').read()
a = I.index(' // CURSO:02 - GENERATIVA\n //\n') + len(' // CURSO:02 - GENERATIVA\n //\n')
b = I.index(' //\n // CURSO:03')
I = I[:a] + ' // Una isla por obra o por serie, en el orden de la página editorial.\n' + ''.join(bloque(c) for c in islas) + '    \n' + I[b:]
open('src/data/islas.ts', 'w').write(I)

T = open('src/data/islotes.ts').read()
a = T.index('  // ISLOTES DEL CURSO:02 / SUBDERIVAS "GENERATIVA"')
a = T.index("  {\n    id: 'islote-generativa-01',", a)
b = T.index('  // ISLOTES DEL CURSO:04 / SUBDERIVAS "EXPEDIENTE 11/26"')
viejo = T[a:b]
fin_excurso = viejo.index('  },') + len('  },')
T = T[:a] + viejo[:fin_excurso] + '\n' + ''.join(bloque(c) for c in islotes) + '\n\n' + T[b:]
open('src/data/islotes.ts', 'w').write(T)

print(len(islas), 'islas,', len(islotes) + 1, 'islotes')
print('ancho', round(max(xs) - min(xs)), 'alto', round(max(ys) - min(ys)))
