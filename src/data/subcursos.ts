export interface SubcursoDefinition {
  course: 'curso00' | 'curso01' | 'curso02' | 'curso03';
  parentDerivaId: 'en-curso' | 'untref' | 'generativa' | 'pensamiento';
  subcurso: 'curso001' | 'curso002' | 'curso003';
  itemId: string;
  code: string;
  title: string;
  subtitle: string;
  tag: string;
  accentColor: string;
  categoryLabel: string;
  captionLabel: string;
}

export const SUBCURSOS: SubcursoDefinition[] = [
  {
    course: 'curso00', parentDerivaId: 'en-curso', subcurso: 'curso001', itemId: 'bitacora-01',
    code: 'CURSO:00.1', title: 'Estudios de Materia & Papel', subtitle: 'Registro de Taller #01',
    tag: 'BITÁCORA VIVA', accentColor: '#E03E2D', categoryLabel: 'MATERIA / PAPEL', captionLabel: 'REGISTRO #01',
  },
  {
    course: 'curso00', parentDerivaId: 'en-curso', subcurso: 'curso002', itemId: 'bitacora-02',
    code: 'CURSO:00.2', title: 'Sensores, Tensión & Viscosidad', subtitle: 'Registro de Taller #02',
    tag: 'CIRCUITOS & SENSÓRICA', accentColor: '#E03E2D', categoryLabel: 'CIRCUITOS / SENSÓRICA', captionLabel: 'REGISTRO #02',
  },
  {
    course: 'curso00', parentDerivaId: 'en-curso', subcurso: 'curso003', itemId: 'bitacora-03',
    code: 'CURSO:00.3', title: 'Derivas Algorítmicas Recientes', subtitle: 'Registro de Taller #03',
    tag: 'CÓDIGO EN PROCESO', accentColor: '#E03E2D', categoryLabel: 'SIMULACIÓN / CÓDIGO', captionLabel: 'REGISTRO #03',
  },
  {
    course: 'curso01', parentDerivaId: 'untref', subcurso: 'curso001', itemId: 'untref-obra-01',
    code: 'CURSO:01.1', title: 'Dispositivos / Instalación Electrónica', subtitle: 'MAE, obra #01',
    tag: 'MAESTRÍA UNTREF', accentColor: '#0038A8', categoryLabel: 'DISPOSITIVO / INSTALACIÓN', captionLabel: 'OBRA #01',
  },
  {
    course: 'curso01', parentDerivaId: 'untref', subcurso: 'curso002', itemId: 'untref-obra-02',
    code: 'CURSO:01.2', title: 'Instalación Espacial & Sensórica', subtitle: 'MAE, obra #02',
    tag: 'MAESTRÍA UNTREF', accentColor: '#0038A8', categoryLabel: 'ESPACIO / SENSÓRICA', captionLabel: 'OBRA #02',
  },
  {
    course: 'curso01', parentDerivaId: 'untref', subcurso: 'curso003', itemId: 'untref-obra-03',
    code: 'CURSO:01.3', title: 'Escultura & Materia Electrónica', subtitle: 'MAE, obra #03',
    tag: 'MAESTRÍA UNTREF', accentColor: '#0038A8', categoryLabel: 'ESCULTURA / MATERIA', captionLabel: 'OBRA #03',
  },
  {
    course: 'curso02', parentDerivaId: 'generativa', subcurso: 'curso001', itemId: 'gen-serie-01',
    code: 'CURSO:02.1', title: 'Campos de Flujo & Turbulencia', subtitle: 'Estudio en Processing / Java',
    tag: 'PROCESSING', accentColor: '#16253D', categoryLabel: 'PROCESSING / JAVA', captionLabel: 'SERIE #01',
  },
  {
    course: 'curso02', parentDerivaId: 'generativa', subcurso: 'curso002', itemId: 'gen-serie-02',
    code: 'CURSO:02.2', title: 'Moiré & Interferencias de Tinta', subtitle: 'Piezas audiovisuales',
    tag: 'PROCESSING', accentColor: '#16253D', categoryLabel: 'GRÁFICA / MOIRÉ', captionLabel: 'SERIE #02',
  },
  {
    course: 'curso02', parentDerivaId: 'generativa', subcurso: 'curso003', itemId: 'gen-serie-03',
    code: 'CURSO:02.3', title: 'Estudio de Partículas & Video', subtitle: 'Piezas audiovisuales',
    tag: 'VIDEO GENERATIVO', accentColor: '#16253D', categoryLabel: 'PARTÍCULAS / VIDEO', captionLabel: 'SERIE #03',
  },
  {
    course: 'curso03', parentDerivaId: 'pensamiento', subcurso: 'curso001', itemId: 'dis-ensayo-01',
    code: 'CURSO:03.1', title: 'Interfaces & Interacciones Inteligentes', subtitle: 'Ensayo crítico',
    tag: 'ENSAYO EDITORIAL', accentColor: '#002FA7', categoryLabel: 'INTERFACES / DISEÑO', captionLabel: 'TEXTO #01',
  },
  {
    course: 'curso03', parentDerivaId: 'pensamiento', subcurso: 'curso002', itemId: 'dis-ensayo-02',
    code: 'CURSO:03.2', title: 'La Materia del Trazo Digital', subtitle: 'Apuntes de cátedra y pedagogía',
    tag: 'PEDAGOGÍA DEL DISEÑO', accentColor: '#002FA7', categoryLabel: 'PEDAGOGÍA / TRAZO', captionLabel: 'TEXTO #02',
  },
  {
    course: 'curso03', parentDerivaId: 'pensamiento', subcurso: 'curso003', itemId: 'dis-ensayo-03',
    code: 'CURSO:03.3', title: 'Al Encuentro de Otro Diseño', subtitle: 'Manifiesto & Derivas Disciplinares',
    tag: 'CRÍTICA DISCIPLINAR', accentColor: '#002FA7', categoryLabel: 'MANIFIESTO / DISEÑO', captionLabel: 'TEXTO #03',
  },
];

export const getSubcursosByDeriva = (derivaId: SubcursoDefinition['parentDerivaId']) =>
  SUBCURSOS.filter((subcurso) => subcurso.parentDerivaId === derivaId);
