# ⚽ Sitio Web del Club Deportivo Balonmano Barbate

¡Bienvenido al repositorio del código fuente del sitio web estático para el Club Deportivo Balonmano Barbate! Este proyecto ha sido generado para proporcionar una presencia online moderna, limpia y fácil de gestionar.

## 🚀 Sobre el Proyecto

Este sitio web está construido con tecnologías web fundamentales (HTML, CSS y JavaScript) para asegurar un rendimiento rápido, compatibilidad universal y un mantenimiento sencillo. El diseño es completamente responsive, adaptándose a cualquier tamaño de pantalla, desde móviles hasta ordenadores de escritorio.

### ✨ Características Principales

- **Diseño Moderno:** Una interfaz limpia y atractiva basada en la identidad del club.
- **Responsive:** Perfecta visualización en todos los dispositivos.
- **Componentes Interactivos:** Menú de navegación móvil, cabecera que reacciona al scroll y secciones interactivas.
- **Fácil de Editar:** El contenido principal (noticias, jugadores, galerías) se puede editar directamente en los archivos HTML.
- **Optimizado:** Carga diferida de imágenes (`loading="lazy"`) para un mejor rendimiento.

---

## 🔧 ¿Cómo Editar el Contenido?

La principal ventaja de este sitio estático es que no necesitas bases de datos ni lenguajes de servidor complejos. Puedes editar el contenido directamente en los archivos `.html`.

### 📰 Actualizar las Noticias

1.  Abre el archivo `noticias.html`.
2.  Busca la sección `<div class="news-grid instagram-style">`.
3.  Dentro, verás varios bloques `<article class="news-card">`. Cada uno es una noticia.
4.  Para añadir una nueva, simplemente **copia y pega** uno de esos bloques.
5.  **Para editar:**
    -   Cambia la imagen en la línea: `<img src="URL_DE_TU_IMAGEN" ... >`
    -   Actualiza la fecha en: `<span class="card-date">...</span>`
    -   Escribe el texto de la noticia en: `<p class="card-excerpt">...</p>`

### 📸 Añadir Fotos a la Galería

1.  Abre el archivo `galerias.html`.
2.  Busca la sección `<div class="shop-grid">`.
3.  Dentro, verás varios bloques `<div class="product-card">`. Cada uno es una foto.
4.  Para añadir una nueva, **copia y pega** uno de esos bloques.
5.  **Para editar:**
    -   Cambia la imagen en la línea: `<img src="URL_DE_TU_IMAGEN" ... >`
    -   Añade una descripción en `alt="..."` para accesibilidad.

### 👥 Actualizar Jugadores de un Equipo

1.  Abre el archivo `equipos.html`.
2.  Busca la categoría que quieres editar (ej. "Senior Masculino").
3.  Dentro del `<div class="panel">` de esa categoría, verás una lista de `<div class="player-card">`.
4.  **Para editar un jugador:**
    -   Cambia el nombre del jugador en: `<h4>NOMBRE DEL JUGADOR</h4>`
    -   Añade la foto reemplazando el `src` en: `<img src="URL_FOTO_JUGADOR" ... >`
5.  Para **añadir o eliminar** jugadores, simplemente copia/pega o elimina un bloque `<div class="player-card">`.

---

## 🛠️ Estructura de Archivos

```
/
├── index.html          # Página de inicio
├── club.html           # Página sobre el club
├── equipos.html        # Página de equipos
├── noticias.html       # Página de noticias
├── galerias.html       # Página de galerías
├── contacto.html       # Página de contacto
│
├── css/
│   └── styles.css      # Hoja de estilos principal
│
├── js/
│   └── script.js       # Archivo de interactividad
│
└── assets/
    └── images/         # Carpeta para guardar imágenes (favicon, etc.)
```

¡Gracias por confiar en este proyecto! Si tienes alguna duda, el código está comentado para facilitar su comprensión.
