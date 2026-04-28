# MiTienda Pro — Sistema completo

## Estructura
- `app/` → PWA publicada en GitHub Pages
- `public/` → datos sincronizados (state.json + imágenes)
- `private/` → backups (no público)
- `Guia_Desarrollador.pdf` → manual completo paso a paso

## Inicio rápido
1. Sube todo a un repo público de GitHub.
2. Settings → Pages → branch `main`, folder `/ (root)`.
3. Abre `https://<usuario>.github.io/<repo>/app/`.
4. Admin (contraseña por defecto `admin2025`) → pestaña **Avanzado** → conecta GitHub con tu PAT y passphrase → Guardar.
5. Listo: cualquier cambio en admin se sincroniza a todos los dispositivos en ≤10s.

Lee la guía PDF para detalles (APK, offline, debugging, etc.).
