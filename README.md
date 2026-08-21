# jose-codesu.github.io

Portfolio de **Jose Lavin** — AI Engineer. Next.js 16 + TypeScript + Tailwind v4,
exportado como sitio estático y desplegado en GitHub Pages.

**Live:** https://jose-codesu.github.io

---

## Lo que tienes que saber para usarlo

Todo el contenido vive en `src/content/`. **Para agregar un proyecto, un
certificado o una experiencia no tocas ningún componente**: escribes un objeto en
el archivo correspondiente y el sitio lo recoge solo.

```
src/content/
├── types.ts         La forma de cada dato (leelo una vez, contesta el 90% de las dudas)
├── site.ts          Tu nombre, email, links, headline, SEO
├── projects.ts      Los proyectos, sus case studies y sus screenshots  ← el más importante
├── credentials.ts   Certificados + educación
├── experience.ts    Historial profesional
├── stack.ts         Skills, con nivel honesto (working / learning)
├── notes.ts         Artículos técnicos (/notes)
└── log.ts           El registro fechado de lo que vas haciendo
```

### Agregar un certificado nuevo

1. Abre `src/content/credentials.ts`.
2. Copia el objeto que ya está y ponlo **arriba** del array (van del más nuevo al
   más viejo).
3. Llena `name`, `issuer`, `issued` (fecha ISO: `'2026-09-14'`), `credentialId`,
   `verifyUrl` (si el emisor da link público), `summary`, y opcionalmente
   `courses` y `skills`.
4. `git add . && git commit -m "Add <certificado>" && git push` — GitHub Actions
   lo publica solo en ~2 minutos.

### Agregar un proyecto

1. Abre `src/content/projects.ts` y copia la forma de uno existente al principio
   del array.
2. Lo mínimo para que se vea bien: `slug`, `name`, `tagline`, `summary`, `year`,
   `status`, `role`, `platform`, `stack`, `featured: true`.
3. El case study (`problem`, `approach`, `outcome`, `notes`, `metrics`,
   `disclosure`) es opcional — cada bloque que no pongas simplemente no se
   renderiza.
4. La página `/work/<slug>` se genera sola. No hay que crear archivos.

> `draft: true` deja un proyecto en el archivo pero fuera del sitio. Úsalo para
> algo que todavía no quieres enseñar (ahí está `metro-performance-tracker`).

### Agregar screenshots a un proyecto

1. Mete las imágenes en `public/media/<proyecto>/`. Tamaños que ya funcionan:
   capturas de iPhone a 460×1000, capturas de web a 1100×688.
2. En `projects.ts`, agrega el array `media` con `src`, `alt`, `caption`, `kind`
   (`'phone'` o `'wide'`) y `width` / `height`.
3. `icon: '/media/icons/<proyecto>.png'` pone el icono de la app junto al nombre.
   Si no hay icono se dibuja un monograma con la inicial.

El `alt` no es opcional: describe **qué muestra la pantalla**, no que es una
captura. Es lo que lee alguien con lector de pantalla y lo que indexa Google.

### Agregar una demo al Lab

`/lab` es donde el visitante **corre** tu trabajo en vez de leer sobre él. Hoy
hay dos:

- `/lab/eval` — el banco de evals de Savor. Los datos viven en
  `src/content/data/savor-evals.json` (16 fotos × 13 corridas, extraídos de
  `Savor-App/scripts/eval/runs/`). Para actualizarlo, vuelve a generar ese JSON
  con las corridas nuevas — el mismo formato: `photos[]` con `truth` y
  `confidence`, `runs[]` con `estimates` por foto.
- `/lab/clone` — el detector de clones de Notewell. `src/lib/clone-detect.ts`
  es una copia literal de `notewell/src/lib/similarity.ts`; si cambias el
  algoritmo allá, cópialo aquí (y el comentario lo dice).

Un proyecto se enlaza a su demo con el campo `demo` en `projects.ts`.

### Escribir una nota

`src/content/notes.ts`. Cada nota es un objeto con `slug`, `title`, `date`,
`summary` y un `body` de bloques:

```ts
{ type: 'p',     text: 'Un párrafo. Los `backticks` salen como código inline.' }
{ type: 'h2',    text: 'Un subtítulo' }
{ type: 'list',  items: ['Punto uno', 'Punto dos'] }
{ type: 'code',  code: 'npm run build', lang: 'sh' }
{ type: 'quote', text: 'La frase que te llevas.' }
```

Hay una nota `draft: true` de plantilla al final del archivo: cópiala. La
sección `/notes` (y su link en el menú) sólo aparece cuando hay al menos una
nota publicada.

### Agregar una entrada al log

`src/content/log.ts`. Fecha ISO, título, dos líneas de cuerpo y un `tag`
(`ship` | `learn` | `write` | `milestone`). Se ordena solo por fecha.

### Cambiar el currículum en PDF

Reemplaza `public/Jose-Lavin-Resume.pdf` con el archivo nuevo (mismo nombre).

---

## Correr el proyecto

```bash
npm install
npm run dev        # http://localhost:3000
```

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Genera el sitio estático en `./out` (corre `prebuild` primero) |
| `npm run og` | Regenera las tarjetas sociales en `public/og/` |
| `npm run check` | Verifica el sitio exportado (páginas, imágenes, feed) |
| `npm run typecheck` | TypeScript sin emitir |
| `npm run lint` | ESLint |

---

## Cómo está construido

- **Next.js 16 App Router** con `output: 'export'` → HTML estático puro. GitHub
  Pages no corre Node, así que no hay rutas dinámicas ni API routes.
- **`trailingSlash: true`** para que `/work/savor/` resuelva a un `index.html`
  real en Pages.
- **`public/.nojekyll`** — sin este archivo, Pages ignora la carpeta `_next/` y
  el sitio sale sin estilos.
- **Tailwind v4** con los tokens de diseño en `src/app/globals.css` (`@theme`).
  Dark mode por clase, manejado por `next-themes` sin flash al cargar.
- **Tarjetas sociales**: `scripts/generate-og.mjs` dibuja una por página con
  satori + resvg en `public/og/` antes de cada build — incluida una por proyecto,
  así compartir un case study muestra su propio titular. Se hace así (y no con
  `opengraph-image.tsx`) porque esa convención genera un archivo sin extensión y
  Pages lo sirve como `octet-stream`, que varios crawlers rechazan.
- **Résumé en `/resume`**: se arma con el mismo contenido que el resto del sitio,
  así que no se puede desactualizar. `Cmd+P` da un PDF limpio (las reglas de
  impresión fuerzan la paleta clara y quitan el header y el footer). El teléfono
  vive sólo en el PDF descargable, nunca en la página.
- **Skills con evidencia**: cada skill enseña los iconos de los proyectos que la
  usan (`src/lib/evidence.ts`). Se deriva de `projects.ts`, no se mantiene a
  mano — si un skill no tiene proyecto que lo respalde, se nota.
- **RSS** en `/feed.xml` con las notas y el log.
- **Gráficos**: la paleta de series (`--series-a` / `--series-b` en
  `globals.css`) pasó las seis validaciones del skill `dataviz` en claro y en
  oscuro — banda de luminosidad, piso de croma, separación para daltonismo
  (ΔE 17 protan), separación normal y contraste 3:1. Si cambias esos colores,
  vuelve a correr el validador antes de subirlos.
- **Deploy**: `.github/workflows/deploy.yml` corre typecheck, lint, build y
  `npm run check` en cada push a `main`, y publica `./out` en Pages. El check
  falla si una página exporta vacía o si falta una imagen referenciada.

### Decisiones de movimiento

El sitio usa las skills de [emilkowalski/skills](https://github.com/emilkowalski/skills)
(instaladas en `.agents/skills`, enlazadas en `.claude/skills`). Lo que se
aplicó:

- Curvas propias (`--ease-out: cubic-bezier(0.23, 1, 0.32, 1)`), nunca `ease-in`.
- Todo lo de UI por debajo de 300ms.
- `:active { scale(0.97) }` en todo lo presionable.
- El **⌘K no anima** al abrir: es la superficie de más frecuencia del sitio y va
  por teclado — animarla solo agregaría latencia.
- Las revelaciones al hacer scroll son animaciones CSS (fuera del hilo
  principal), y con `prefers-reduced-motion` conservan el fade y pierden el
  desplazamiento.
- El lightbox de screenshots usa el `<dialog>` nativo: foco atrapado, Escape y
  fondo inerte los da la plataforma. Entra a 200ms desde `scale(0.96)` — nunca
  desde `scale(0)`, porque nada en el mundo real aparece de la nada.
- El filtro de tecnologías en `/work` no anima: es un control que se clickea
  repetido para escanear, y cualquier transición sería latencia.

---

## Estructura

```
src/
├── app/            Rutas: /, /work, /work/[slug], /notes, /notes/[slug],
│                          /credentials, /about, /resume, /feed.xml
├── components/     UI. Nada de contenido aquí.
├── content/        Todo el contenido editable
└── lib/            cn() y formateo de fechas
public/media/       Screenshots e iconos de los proyectos
assets/fonts/       TTFs estáticos que usa el generador de tarjetas sociales
scripts/            generate-og.mjs · check-build.mjs
```
