# MiTienda Pro — Capa PWA + GitHub

Esta carpeta contiene el sistema **sin tocar tu HTML/diseño/funcionalidad original**.
Todo lo nuevo vive en `lib/` como módulos JS ES y se inyecta vía `bootstrap.js`.

## Estructura del repositorio (objetivo en GitHub)

```
/
├── app/        → Código fuente del PWA (HTML + lib/ + manifest + SW)
├── public/     → Datos públicos servidos por GitHub Pages
│   ├── data/   →   JSON: productos, planes, vendedores, etc.
│   └── img/    →   Imágenes optimizadas (WebP + miniaturas)
└── private/    → Backups, logs y archivos sensibles (no se publica)
    └── backups/
```

`/public` es **lectura pública** (GitHub Pages). `/app` es la PWA. `/private` queda en el repo pero
no se sirve (no hay link). El módulo `repo-init.js` crea esta estructura automáticamente vía API.

## Archivos

| Archivo | Función |
|---|---|
| `index.html` | Tu HTML original, intacto. |
| `manifest.json` | Manifest PWA compatible con GitHub Pages. |
| `service-worker.js` | SW con network-first (HTML/API) y stale-while-revalidate (estáticos). |
| `lib/crypto.js` | AES-GCM + PBKDF2 (passphrase del admin). |
| `lib/indexeddb.js` | Stores: config, cache, queue, logs, backups. |
| `lib/github-api.js` | Cliente REST (PAT). Soporta `commitMany` (commits agrupados). |
| `lib/reader.js` | Lectura desde `/public` con cache-first. |
| `lib/writer.js` | Escritura JSON e imágenes; encola si está offline. |
| `lib/sync.js` | Sincronización automática cada 30 s + on-online. |
| `lib/backup.js` | Snapshot local + subida a `/private/backups/`. |
| `lib/image-opt.js` | Compresión, conversión a WebP y miniaturas (Canvas). |
| `lib/repo-init.js` | Crea `/app /public /private` con commits iniciales. |
| `lib/admin-config.js` | Modal admin para token, passphrase, repo, init, sync, backup. |
| `lib/mobile-menu.js` | Menú hamburguesa Android/móvil (no afecta desktop). |
| `lib/bootstrap.js` | Punto de arranque; registra SW y expone `window.MTP`. |

## Cómo se integra en tu HTML

`index.html` carga **una sola línea** al final del `<body>`:

```html
<link rel="manifest" href="./manifest.json">
<meta name="theme-color" content="#ff6600">
<script type="module" src="./lib/bootstrap.js"></script>
```

Eso es todo. Tu CSS, tu JS, tus modales y tu diseño no se tocan.

## API global (`window.MTP`)

Desde tu código existente puedes usar:

```js
// Leer JSON desde /public/data/productos.json
const productos = await MTP.Reader.readJSON("data/productos.json");

// Subir un JSON (encripta passphrase la primera vez; queda cacheada en sesión)
await MTP.Writer.writeJSON("data/productos.json", productos, { message: "update" });

// Optimizar y subir una imagen
const { bytes, thumb, width, height } = await MTP.ImageOpt.prepare(file);
await MTP.Writer.writeImage("productos/p123.webp", bytes);
await MTP.Writer.writeImage("productos/p123-thumb.webp", thumb);

// Backup manual
await MTP.Backup.upload("pre-cambio");

// Abrir el modal de configuración
MTP.AdminConfig.open();
```

## Flujo de configuración (admin)

1. Click en el botón **⚙️** del header (lo añade `admin-config.js`).
2. Pega `owner`, `repo`, `branch`, **PAT** y una **passphrase**.
3. **Probar conexión** → **Crear /app /public /private** → ya está lista la estructura con commit inicial.
4. A partir de ahí, las escrituras se envían automáticamente; si está offline, se encolan en IndexedDB y se sincronizan al volver.

## Seguridad

- El token se guarda **cifrado** con AES-GCM 256, clave derivada con PBKDF2 (200 000 iteraciones) desde la passphrase.
- La passphrase nunca se persiste; vive en memoria mientras el admin tiene la sesión abierta.
- Usa siempre un PAT con scope mínimo (`repo`) y revócalo si sospechas exposición.

## Menú móvil

`mobile-menu.js` añade un botón hamburguesa en pantallas ≤ 900 px que clona los enlaces de tu nav
y los muestra en un panel deslizable. En desktop **no aparece** y el header original queda intacto.
