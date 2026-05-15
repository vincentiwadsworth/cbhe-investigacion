![CBHE](https://img.shields.io/badge/CBHE-Hidrocarburos%20y%20Energía-00507e) ![Astro](https://img.shields.io/badge/Astro-6.2.1-ff5d01) ![Tailwind](https://img.shields.io/badge/Tailwind-4.2.4-38bdf8) ![License](https://img.shields.io/badge/License-MIT-green) ![Status](https://img.shields.io/badge/Status-Production-brightgreen)

# CBHE Web

**SSG institucional moderno de la Cámara Boliviana de Hidrocarburos y Energía.**

[cbhe-web.pages.dev](https://vincentiwadsworth.github.io/cbhe-web/) · [Demo en vivo](https://vincentiwadsworth.github.io/cbhe-web/) · [Admin CMS](https://vincentiwadsworth.github.io/cbhe-web/admin/)

---

## Por qué este proyecto

Sitio web corporativo de alto rendimiento para una institución sectorial de 40 años. Combina:

- ✅ **Arquitectura Zero-JS** — SSG con Astro 6, cero JavaScript en cliente, Core Web Vitals en verde
- ✅ **CMS headless sin costo** — Sveltia CMS con backend GitHub, edición visual sin infraestructura
- ✅ **Automatización de datos financieros** — Workflow programado (3×/día) que actualiza WTI, Brent, Henry Hub, TTF, USD/BOB
- ✅ **SEO técnico completo** — JSON-LD (Organization, WebSite, Article, BreadcrumbList), Open Graph, Twitter Cards
- ✅ **Accesibilidad WCAG 2.2** — Skip-link, ARIA, `<details>` nativo, focus-visible, prefers-reduced-motion
- ✅ **Design system robusto** — 50 tokens Material Design 3, tipografía Inter self-hosted (Latin subset)

---

## Quick Start

```bash
# Clone e instala
git clone https://github.com/vincentiwadsworth/cbhe-web.git
cd cbhe-web
npm ci

# Añade .env con la API key de Web3Forms (ver abajo)
cp .env.example .env
# Edita .env y añade: WEB3FORMS_KEY=tu_api_key_aqui

# Ejecuta servidor de desarrollo
npm run dev
# Abre http://localhost:4321

# Build para producción
npm run build
npm run preview
```

---

## Stack Tecnológico

| Capa | Tecnología | Por qué |
|------|------------|---------|
| **SSG Framework** | Astro 6.2.1 | Zero-JS por defecto, routing file-based, Content Collections con Zod |
| **Estilos** | Tailwind CSS 4.2.4 + `@tailwindcss/vite` | Config en CSS, sin JS, utility-first optimizado |
| **Tipografía** | Inter (self-hosted) | Latin subset (400-800), 0 requests externos, render instantáneo |
| **Íconos** | astro-icon + Material Symbols | 33 símbolos precargados, tree-shakeable, sin `@material-symbols` |
| **CMS** | Sveltia CMS | Panel visual, backend GitHub, workflow Save vs Save and Publish |
| **Formularios** | Web3Forms | API key env var, sin backend propio, spam filtering incluido |
| **Hosting** | GitHub Pages | Deploy automático via Actions, subpath `/cbhe-web/`, gratis |
| **Automatización** | GitHub Actions (cron) | 3×/día scraping BCB + yfinance → `data/prices.json` |
| **Imágenes** | sharp | Optimización automática, WebP con fallback, lazy-loading |

---

## Arquitectura

```mermaid
flowchart TB
    subgraph "Editor (no técnico)"
        A[Sveltia CMS<br>/admin/]
    end

    subgraph "GitHub (backend)"
        B[Repo Principal]
        C[Actions: deploy.yml<br>push → build → Pages]
        D[Actions: update-data.yml<br>cron → fetch_prices.py → commit]
    end

    subgraph "Build Process"
        E[Astro Build<br>Content Collections]
        F[Markdown → HTML]
        G[JSON data → PreciosGrid]
    end

    subgraph "Output"
        H[GitHub Pages<br>/cbhe-web/]
        I[Static Files<br>zero JS]
    end

    subgraph "Servicios Externos"
        J[Web3Forms<br>formularios]
        K[BCB + yfinance<br>precios diarios]
    end

    A -->|Save → [skip ci] / Publish → commit| B
    B -->|push| C
    B -->|18:00 UTC| D
    D -->|scraping| K
    D -->|commit prices.json| B

    C -->|astro build| E
    E --> F
    E --> G
    E --> H
    H --> I

    F --> J
```

---

## Uso

### Editar Contenido vía CMS

1. Abre [`/admin/`](https://vincentiwadsworth.github.io/cbhe-web/admin/)
2. Edita artículos, cursos o empresas
3. **Save** → commit `[skip ci]` → borrador (no publica)
4. **Save and Publish** → commit normal → deploy automático (~1 min)

Content Collections con Zod (`src/content.config.ts`) garantiza que cada Markdown tenga campos requeridos validados.

### Ejecutar Localmente

```bash
# Desarrollo (hot reload)
npm run dev

# Build de producción
npm run build

# Preview del build de producción local
npm run preview
```

### Actualización de Datos

La sección de indicadores financieros (WTI, Brent, Henry Hub, TTF, USD/BOB) se actualiza automáticamente:

- **Horario**: 08:00, 12:00, 18:00 BOT (Lu-Vie)
- **Fuente**: Sitio BCB (USD/BOB) + API yfinance (commodities)
- **Fallback**: Si BCB o yfinance fallan, usa valores cacheados de `data/prices.json`
- **Trigger manual**: Ve a Actions → Update Financial Data → Run workflow

---

## Estructura del Proyecto

```
cbhe-web/
├── src/
│   ├── pages/              # 12 páginas estáticas + 2 [slug].astro
│   │   ├── index.astro     # Home: hero, estadísticas, alianzas, noticias
│   │   ├── quienes-somos.astro  # Timeline historia, ACTUAR
│   │   ├── afiliadas.astro     # Directorio 50+ empresas por grupos
│   │   └── [slug].astro       # Routing dinámico para artículos/cursos
│   ├── components/
│   │   ├── Navbar.astro       # Sticky, responsive, `<details>` menu
│   │   ├── Footer.astro
│   │   ├── PreciosGrid.astro  # Dashboard precios con formato fecha
│   │   └── Icon.astro
│   ├── layouts/
│   │   └── Layout.astro       # Base: SEO, OG, JSON-LD, breadcrumbs
│   ├── content/
│   │   ├── articulos/         # 7 artículos (noticias, análisis, eventos)
│   │   ├── cursos/            # 4 cursos (capacitación técnica)
│   │   └── empresas/          # 50+ empresas en 6 grupos
│   ├── content.config.ts      # Zod schemas para 3 colecciones
│   └── styles/
│       └── global.css         # 50 tokens MD3 + Inter + base layer
├── public/
│   └── admin/                 # Sveltia CMS (config.yml + index.html)
├── data/
│   └── prices.json            # Indicadores financieros (actualizado 3×/día)
├── scripts/
│   └── fetch_prices.py        # Scraping BCB + yfinance (102 líneas)
├── .github/workflows/
│   ├── deploy.yml             # Build + deploy GitHub Pages
│   └── update-data.yml        # Cron: fetch_prices.py → commit
├── package.json
├── astro.config.mjs
└── tsconfig.json
```

---

## Características Clave

| Característica | Implementación | Beneficio |
|----------------|----------------|-----------|
| **Páginas Zero-JS** | Astro SSG, sin hydration | Puntuación Lighthouse perfecta, carga instantánea |
| **Edición CMS** | Sveltia + backend GitHub | Usuarios no técnicos pueden editar sin desarrolladores |
| **Datos auto-actualizados** | GitHub Actions cron (3×/día) | Indicadores financieros siempre actualizados |
| **SEO con datos estructurados** | JSON-LD (Organization, WebSite, Article, BreadcrumbList) | Rich snippets en resultados de Google |
| **Accesibilidad** | WCAG 2.2, ARIA, keyboard nav, `<details>` | Amigable para screen readers, navegable por teclado |
| **Design system** | 50 tokens MD3 + Inter self-hosted | Branding consistente, latencia cero en fuentes |
| **Responsive** | Mobile-first, breakpoints Tailwind | Flawless en todos los dispositivos |
| **Manejo de formularios** | Web3Forms (spam filtering) | Sin backend necesario, spam protection integrado |
| **Performance** | Sharp image optimization, lazy-loading, preconnect | Core Web Vitals en verde |
