import type { ClasesMimo } from '../../utils/markdown';

// Clases (de Tailwind, con la paleta del sitio) con las que el cartulario
// muestra cada elemento del Markdown.
const SEPARADORES: ClasesMimo['separadores'] = {
  '---': 'my-6 h-px w-full bg-ink-border/80',
  '___': 'my-3 h-px w-full bg-ink-border/55',
  '***': 'my-8 h-0.5 w-full bg-ink-primary',
  '===': 'my-0 h-2 w-full border-y border-ink-border/80',
  '+++': 'my-2 h-4 w-full',
};

export const CLASES_CARTULARIO: ClasesMimo = {
  cita: 'border-l-2 border-accent-vermilion pl-5 py-2 my-7 italic text-ink-muted bg-river-mist/35 text-base leading-relaxed font-sans',
  negrita: 'font-bold text-ink-primary',
  italica: 'italic',
  enlace: 'font-semibold text-cobalt underline decoration-cobalt/40 underline-offset-2 hover:text-cobalt-dark',
  codigo: 'font-mono text-sm bg-paper-sheet px-1.5 py-0.5 rounded text-cobalt',
  h1: 'font-sans font-bold text-3xl md:text-5xl text-ink-primary tracking-tight mt-0 mb-6',
  h2: 'font-sans font-bold text-2xl md:text-3xl text-ink-primary tracking-tight mt-10 mb-4',
  h3: 'font-sans font-semibold text-xl text-ink-primary mt-8 mb-3',
  parrafo: 'text-base md:text-lg text-ink-muted leading-relaxed my-4 font-sans',
  lista: 'list-disc pl-6 my-4 space-y-2 text-base md:text-lg text-ink-muted leading-relaxed font-sans marker:text-ink-faint',
  figura: 'my-8 w-full',
  imagen: 'h-auto w-full object-contain',
  pie: 'mt-2 text-sm text-ink-faint italic leading-relaxed font-sans',
  video: 'my-8 aspect-video w-full overflow-hidden rounded-sm border border-ink-border/60 bg-black',
  marcoVideo: 'h-full w-full',
  separadores: SEPARADORES,
  separadoresEnCita: { ...SEPARADORES, '+++': 'my-1 h-2 w-full' },
};
