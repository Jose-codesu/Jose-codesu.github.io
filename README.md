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
├── projects.ts      Los proyectos y sus case studies  ← el más importante
├── credentials.ts   Certificados + educación
├── experience.ts    Historial profesional
├── stack.ts         Skills, con nivel honesto (working / learning)
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
| `npm run og` | Regenera `public/og.png` (la tarjeta social) |
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
- **Tarjeta social**: `scripts/generate-og.mjs` la dibuja con satori + resvg y la
  escribe en `public/og.png` antes de cada build. Se hace así (y no con
  `opengraph-image.tsx`) porque esa convención genera un archivo sin extensión y
  Pages lo sirve como `octet-stream`, que varios crawlers rechazan.
- **Deploy**: `.github/workflows/deploy.yml` corre typecheck, lint y build en
  cada push a `main`, y publica `./out` en Pages.

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

---

## Estructura

```
src/
├── app/            Rutas: /, /work, /work/[slug], /credentials, /about
├── components/     UI. Nada de contenido aquí.
├── content/        Todo el contenido editable
└── lib/            cn() y formateo de fechas
assets/fonts/       TTFs estáticos que usa el generador de la tarjeta social
scripts/            generate-og.mjs
```
