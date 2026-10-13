# G ♥ J — Nuestra Historia

Una aplicación web personal para guardar y visualizar los momentos más importantes de una historia en pareja. Un timeline interactivo que recoge hitos, viajes, estudios, trabajo y momentos de vida compartidos desde 2018.

## ✨ Características

- **Timeline vertical y horizontal** — cambia entre vistas con un solo clic.
- **Agrupación por mes** — los eventos del mismo mes comparten un único punto central.
- **Punto multicolor** — el punto se pinta con un `conic-gradient` y cada color apunta hacia la tarjeta de su protagonista; las tarjetas ramifican desde ese punto común.
- **Filtros interactivos** por protagonista (Juntos, Jorge, Gema), categoría y año.
- **Búsqueda** en tiempo real por título o descripción.
- **Gestión completa (CRUD)**: Añadir, editar y eliminar eventos con formulario integrado.
- **Autenticación segura**: Visualización pública del timeline y modo edición protegido mediante Firebase Auth (email/password).
- **Galería de fotos** por evento con lightbox y soporte drag & drop, alojadas en la nube mediante [ImgBB](https://imgbb.com/).
- **Almacenamiento en la nube (Firestore)**: Sincronización en tiempo real sin pausas de inactividad.
- **Backup automático con GitHub Actions**: Sincronización periódica programada de los eventos de Firestore a `data/events.json` en el repositorio.
- **Exportar / importar** datos en formato JSON para backups locales.
- **Tema claro/oscuro** persistente según preferencias del usuario.
- **Diseño responsive** adaptado a móviles con menú hamburguesa y controles optimizados.

## 🚀 Cómo arrancar en local

```bash
python3 -m http.server 8080
```

Luego abre el navegador en **http://localhost:8080**

> También puedes usar cualquier otro puerto cambiando el número al final:
> ```bash
> python3 -m http.server 3000
> ```

## 🛑 Cómo parar el servidor

Si lo lanzaste en una terminal abierta, basta con pulsar **`Ctrl + C`** en esa terminal.

Si quedó corriendo en segundo plano, busca el proceso por su puerto y mátalo:

```bash
# Ver qué proceso ocupa el puerto 8080
lsof -ti:8080

# Pararlo directamente
kill $(lsof -ti:8080)
```

## 📁 Estructura del proyecto

```
nosotros/
├── .github/
│   └── workflows/
│       └── backup.yml          # GitHub Action: backup automático de Firestore
├── index.html                  # Entrada principal
├── assets/
│   ├── css/
│   │   ├── style.css           # Entrada principal e importación de cascada
│   │   ├── variables.css       # Tokens de diseño, temas y reset global
│   │   ├── header.css          # Cabecera, menú hamburguesa y barra de filtros
│   │   ├── timeline.css        # Diseño de timeline vertical y horizontal
│   │   └── ui.css              # Modales, formulario, lightbox, toasts y FAB
│   └── js/
│       ├── config.js           # Credenciales Firebase, ImgBB y configuración
│       ├── storage.js          # Adaptador Firebase Firestore + Auth + fallback local
│       ├── events.js           # Store de eventos y filtros
│       ├── gallery.js          # Subida a ImgBB, lightbox y dropzone
│       ├── timeline.js         # Renderizado del timeline (vertical/horizontal)
│       └── app.js              # Lógica principal y coordinación de módulos
├── data/
│   └── events.json             # Respaldo estático de los eventos en el repo
└── scripts/
    └── sync-events.js          # Script para volcar eventos de Firestore a data/events.json
```

## 🛠️ Tecnologías

- **Frontend:** HTML5, CSS3 vanilla (sin frameworks ni Tailwind), JavaScript ES6+.
- **Base de datos:** Google Cloud Firestore (lectura pública, escritura autenticada).
- **Autenticación:** Firebase Authentication.
- **Alojamiento de imágenes:** ImgBB API v1.
- **Despliegue & Automatización:** GitHub Pages + GitHub Actions (backups periódicos).
- **Tipografía:** Google Fonts (*Playfair Display* + *Inter*).
