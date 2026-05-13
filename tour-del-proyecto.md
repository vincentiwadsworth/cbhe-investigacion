# Tour del proyecto — CBHE Web

> Para compartir pantalla y recorrer en una llamada.
> No es un pitch, es una muestra de cómo está armado.

---

## 1. ¿De qué se trata el sitio?

Web institucional de la **Cámara Boliviana de Hidrocarburos y Energía**. Agrupa a más de 50
empresas del sector, tiene 40 años de trayectoria, y sus afiliadas participan en la producción del 99% del gas natural
boliviano.

Secciones:

- Inicio — hero con datos del sector, precios, novedades, afiliación, cursos
- Quiénes Somos — misión, historia, mesa directiva, estatutos
- Afiliación — requisitos y formulario para unirse
- Capacitación — cursos técnicos con fecha, modalidad y horas
- Novedades — artículos de noticias, análisis, eventos
- Contacto — formulario, teléfonos, mapa

🔗 **Sitio publicado:** https://vincentiwadsworth.github.io/cbhe-web/

---

## 2. ¿Cómo funciona esto por dentro?

### En fácil: ¿qué es una página estática?

En una web con WordPress + Elementor pasa esto:

```
1. Alguien entra a la web
2. El servidor recibe la visita
3. PHP se ejecuta, consulta MySQL, junta el theme, los plugins, los datos de Elementor
4. Arma el HTML en el momento
5. Se lo manda al navegador
```

En esta web pasa esto:

```
1. Yo ejecuto `astro build` UNA SOLA VEZ en mi computadora (o en GitHub Actions)
2. Eso genera todos los HTML, CSS e imágenes listos para servir
3. Esos archivos se suben a GitHub Pages
4. Cuando alguien entra, el servidor simplemente entrega el archivo HTML que ya existe
```

**La analogía:** WordPress es un restaurante donde cada plato se cocina cuando el cliente lo pide.
Un sitio estático es una rotisería: la comida ya está preparada, la servís directo del mostrador.

| | WordPress + Elementor | Este proyecto (Astro) |
|---|---|---|
| **Dónde vive el contenido** | Base de datos MySQL | Archivos Markdown en el repo |
| **Cuándo se genera el HTML** | En cada visita | Una sola vez, en el build |
| **Qué necesita el servidor** | PHP + MySQL | Nada — solo servir archivos |
| **Panel de edición** | WP Admin | Sveltia CMS (conectado a GitHub) |
| **Lo que ve el visitante** | HTML, CSS, JS | HTML, CSS (cero JS) |
| **En qué se parecen** | Ambos permiten editar contenido sin tocar código, ambos producen un sitio que se ve profesional | |

Cada artículo y curso del sitio es literalmente esto:

```
src/content/articulos/nueva-mesa-directiva.md
```

Un archivo de texto con un bloque YAML al inicio y el contenido en Markdown abajo. Nada de base
de datos, nada de `wp_posts`, nada de `post_meta`. Si querés ver qué artículos hay, abrís una
carpeta.

---

## 3. Estructura del proyecto

```
cbhe-web/
├── src/
│   ├── pages/           ← 7 páginas .astro (inicio, quienes-somos, afiliacion, etc.)
│   ├── components/      ← componentes reutilizables (Navbar, Footer, Icon, PreciosGrid)
│   ├── layouts/         ← Layout base (HTML, meta tags, SEO, base href)
│   ├── content/
│   │   ├── articulos/   ← 7 artículos en Markdown
│   │   └── cursos/      ← 3 cursos en Markdown
│   └── styles/
│       └── global.css   ← 50 tokens de diseño (colores, tipografía)
├── public/
│   └── admin/           ← panel del CMS (Sveltia)
│       ├── index.html
│       └── config.yml   ← define qué campos tiene cada tipo de contenido
├── data/
│   └── prices.json      ← datos de precios de combustibles
├── .github/workflows/
│   └── deploy.yml       ← GitHub Actions: build automático en cada push
├── astro.config.mjs     ← configuración del framework e íconos
├── src/content.config.ts ← esquema Zod que valida los artículos y cursos
└── package.json         ← dependencias (5 en total)
```

---

## 4. Cómo se edita el contenido

El panel de edición está en:

🔗 https://vincentiwadsworth.github.io/cbhe-web/admin/

Todo lo que se hace ahí —crear un artículo, editar un curso, marcar como borrador— se convierte
en un **commit en GitHub**. El CMS no tiene servidor propio: es una aplicación web que usa la API
de GitHub para leer y escribir archivos directamente en el repositorio.

Dos botones clave:

- **Save** → commit con `[skip ci]` → no dispara el deploy. Ideal para borradores.
- **Save and Publish** → commit normal → dispara el deploy automático.

La configuración del CMS está en `public/admin/config.yml`. Ahí se define qué colecciones existen
— `articulos` y `cursos` — y qué campos tiene cada una. Si mañana querés agregar una colección
nueva (ej. "empresas afiliadas"), agregás 15 líneas al YAML y listo.

---

## 5. Cómo se publica

El deploy es 100% automático con **GitHub Actions**.

Flujo real:

```
1. Alguien edita en el CMS y hace "Save and Publish"
2. El CMS hace un commit al repo en la rama main
3. GitHub Actions detecta el push y ejecuta deploy.yml
4. Corre: npm ci → npx astro build → publica a GitHub Pages
5. El sitio se actualiza en ~1 minuto
```

🔗 **Workflow de deploy:** https://github.com/vincentiwadsworth/cbhe-web/blob/main/.github/workflows/deploy.yml

El build genera una carpeta `dist/` con HTML, CSS e imágenes estáticas. GitHub Pages sirve eso
directamente. Hosting: $0. Mantenimiento de servidor: $0. Parches de seguridad de WordPress: $0.

---

## 6. Los formularios (sin backend)

Los formularios de afiliación y contacto usan **Web3Forms**, un servicio que recibe los datos y
los reenvía por email.

```
<form action="https://api.web3forms.com/submit" method="POST">
  <input type="hidden" name="access_key" value={CLAVE_SECRETA} />
  ...
</form>
```

La clave vive en un archivo `.env` local (no se commitea) y como un **GitHub Secret** para
producción. Así no hay backend que mantener, pero los formularios funcionan igual.

---

## 7. El diseño

Sistema de diseño con **50 tokens de Material Design 3** definidos como variables CSS en
`src/styles/global.css`:

- `--color-primary`, `--color-surface`, `--color-on-surface-variant`, etc.
- Tailwind v4 los transforma automáticamente en clases: `bg-primary`, `text-on-surface-variant`

Tipografía: **Inter** (self-hosted, subset Latin 400-800). Sin dependencia de Google Fonts.

Íconos: **33 Material Symbols** precargados en `astro.config.mjs`. Solo se incluyen los que el
sitio realmente usa — los demás ni se descargan.

Resultado final: **0 KB de JavaScript**. El sitio es puro HTML y CSS. Un Lighthouse score que
WordPress con 15 plugins solo puede soñar.

---

## Recorrido sugerido para la llamada

1. **Abrir el sitio publicado** — https://vincentiwadsworth.github.io/cbhe-web/
   - Mostrar las secciones: hero, precios, afiliadas, novedades, cursos

2. **Abrir el código en VS Code** — carpeta `src/pages/`
   - Abrir `index.astro`: que vea el frontmatter, los imports, la sintaxis
   - Abrir `quienes-somos.astro`: otra página similar, mismo patrón

3. **Mostrar el contenido** — carpeta `src/content/articulos/`
   - Abrir `nueva-mesa-directiva.md`: que vea que es texto plano con metadatos
   - Mostrar `src/content.config.ts`: que vea cómo Zod valida la estructura

4. **Mostrar el CMS** — https://vincentiwadsworth.github.io/cbhe-web/admin/
   - Entrar a la colección "Artículos", abrir uno, mostrar el editor
   - Explicar los botones Save y Save and Publish

5. **Mostrar GitHub Actions** — https://github.com/vincentiwadsworth/cbhe-web/actions
   - Que vea el historial de deploys, los logs, el tiempo que tarda

6. **Mostrar `astro.config.mjs`** — que vea la configuración: base URL, íconos, integraciones
   - Son 70 líneas. Un `wp-config.php` tranquilo tiene 100.

---

🔗 **Repositorio:** https://github.com/vincentiwadsworth/cbhe-web
