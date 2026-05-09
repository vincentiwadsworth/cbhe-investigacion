# CBHE Web

Sitio web institucional de la Cámara Boliviana de Hidrocarburos y Energía.

🔗 **[cbhe-web.pages.dev](https://vincentiwadsworth.github.io/cbhe-web/)**

## Stack

| Capa | Herramienta |
|---|---|
| Framework | Astro 6 — SSG, cero JS al cliente |
| Estilos | Tailwind v4 — `@tailwindcss/vite`, sin config JS |
| Contenido | Content Collections + Zod — Markdown tipado |
| CMS | Sveltia CMS — panel visual con backend en GitHub |
| Hosting | GitHub Pages — deploy automático con Actions |
| Formularios | Web3Forms — sin backend propio |
| Íconos | astro-icon — 33 Material Symbols precargados |
| Tipografía | Inter — self-hosted, subset Latin |
| Diseño | 50 tokens Material Design 3 en CSS custom properties |

## Cómo funciona

### Editar contenido

El CMS está en [`/admin/`](https://vincentiwadsworth.github.io/cbhe-web/admin/). Desde ahí se crean y editan artículos y cursos. Cada cambio es un commit en el repositorio:

- **Save** → commit con `[skip ci]` → borrador, no publica
- **Save and Publish** → commit normal → dispara el deploy

El contenido vive en `src/content/` como archivos Markdown. Zod (`src/content.config.ts`) valida que cada archivo tenga los campos requeridos.

### Publicar

Push a `main` → GitHub Actions ejecuta `astro build` → publica en GitHub Pages. Tarda ~1 minuto.

### Datos del sector

La sección de indicadores financieros (WTI, Brent, Henry Hub, TTF, USD/BOB) se actualiza sola: un workflow corre a las 18:00 UTC, ejecuta `scripts/fetch_prices.py`, y commitea `data/prices.json`. El build levanta ese JSON y el componente `PreciosGrid.astro` renderiza los valores.

### Formularios

Los formularios de afiliación y contacto envían a Web3Forms. La API key está en `.env` (local) y como GitHub Secret (`WEB3FORMS_KEY`) para producción.

## Estructura

```
src/
├── pages/             7 páginas .astro
├── components/         Navbar, Footer, Icon, PreciosGrid
├── layouts/           Layout base (HTML shell, SEO, OG tags)
├── content/
│   ├── articulos/     7 artículos en Markdown
│   └── cursos/        3 cursos en Markdown
├── content.config.ts  Esquemas Zod para validar contenido
└── styles/
    └── global.css     50 tokens MD3 + @import "tailwindcss"

public/
└── admin/             Sveltia CMS (config.yml + index.html)

data/
└── prices.json        Indicadores financieros (actualizado a diario)

scripts/
└── fetch_prices.py    Scraping de precios con yfinance + httpx

.github/workflows/
├── deploy.yml         Build y deploy a GitHub Pages
└── update-data.yml    Actualización diaria de prices.json
```

## Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor local en `localhost:4321` |
| `npm run build` | Genera `dist/` con el sitio estático |
| `npm run preview` | Previsualiza el build local |

## Variables de entorno

| Variable | Uso |
|---|---|
| `WEB3FORMS_KEY` | API key para formularios de contacto y afiliación |
