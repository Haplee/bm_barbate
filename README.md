# ⚽ Sitio Web del Club Deportivo Balonmano Barbate

¡Bienvenido al repositorio del código fuente del sitio web del Club Deportivo Balonmano Barbate! Este proyecto ha sido re-estructurado para usar un sistema de **compilación estática (static build)**, lo que mejora el rendimiento, el SEO y facilita el despliegue en plataformas modernas como Vercel.

## 🚀 Sobre el Proyecto

Este sitio web está construido con tecnologías web fundamentales (HTML, CSS y JavaScript), pero con un giro moderno. En lugar de depender de JavaScript del lado del cliente para cargar datos importantes, el contenido de los equipos se **pre-renderiza** durante un proceso de compilación.

Esto significa que el HTML final ya incluye toda la información, resultando en tiempos de carga más rápidos y un sitio web mucho más amigable para los motores de búsqueda.

### ✨ Características Principales

- **Compilado Estáticamente:** El contenido dinámico (equipos) se inyecta en el HTML antes del despliegue.
- **Rendimiento Optimizado:** Al servir HTML pre-generado, se reduce la carga en el navegador del cliente y se mejora la velocidad de carga.
- **SEO Mejorado:** Los motores de búsqueda pueden indexar el contenido de los equipos de manera eficiente.
- **Gestión de Datos Centralizada:** La información de los equipos se gestiona en un único archivo (`data/teams.json`), facilitando las actualizaciones.
- **Despliegue Automatizado:** Configurado para un despliegue sin esfuerzo en [Vercel](https://vercel.com).
- **Diseño Moderno y Responsive:** La interfaz se adapta a cualquier dispositivo, desde móviles hasta ordenadores de escritorio.

---

## 🛠️ Flujo de Trabajo y Edición de Contenido

El proceso para actualizar el sitio ha cambiado. Ya **NO** se deben editar los archivos `.html` directamente para el contenido de los equipos.

### 👥 Actualizar Jugadores o Equipos

Toda la información de los equipos se encuentra en `data/teams.json`.

1.  **Abre el archivo `data/teams.json`**.
2.  Este archivo contiene una lista de todos los equipos. Cada equipo tiene un nombre, categoría, una lista de jugadores (`players`) y una lista de entrenadores (`coaches`).
3.  **Para editar, añadir o eliminar** un jugador o entrenador, simplemente modifica la lista correspondiente dentro del equipo que desees cambiar.
4.  **Para añadir un nuevo equipo**, copia un bloque de equipo existente y modifica sus datos. Asegúrate de mantener la estructura JSON correcta.

### 📰 Actualizar Noticias y Galerías

Las noticias y las galerías todavía se gestionan manualmente en sus respectivos archivos HTML (`noticias.html` y `galerias.html`), ya que su contenido es menos estructurado. Sigue las instrucciones originales para estas secciones si es necesario.

---

## 💻 Desarrollo Local

Para trabajar en el sitio en tu máquina local, necesitas tener [Node.js](https://nodejs.org/) instalado.

1.  **Instala las dependencias:**
    ```bash
    npm install
    ```
2.  **Ejecuta el script de compilación:**
    ```bash
    npm run build
    ```
3.  Este comando creará una carpeta `dist` con la versión final del sitio web. Para ver el sitio, puedes usar una extensión de servidor local como [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) en VS Code y abrir la carpeta `dist`.

Cualquier cambio que hagas en los archivos fuente (HTML, CSS, JS, o `data/teams.json`) requerirá que ejecutes `npm run build` de nuevo para ver los cambios reflejados en la carpeta `dist`.

---

## 📂 Estructura de Archivos

```
/
├── dist/                 # Carpeta de salida (generada por el build, para despliegue)
│
├── data/
│   ├── teams.json        # ¡IMPORTANTE! Fuente de datos para los equipos
│   └── staff.json        # Fuente de datos para el personal
│
├── scripts/
│   └── update_teams.py   # (OBSOLETO) Script para obtener datos (actualmente desactivado)
│
├── build.mjs             # Script de compilación que genera la carpeta 'dist'
├── vercel.json           # Configuración de despliegue para Vercel
├── package.json          # Dependencias y scripts de Node.js
│
├── index.html            # Páginas HTML base (plantillas)
├── equipos.html
├── ... (otras páginas)
│
├── css/
│   └── new_styles.css
└── js/
    └── script.js
```

Gracias por confiar en este proyecto. ¡Esta nueva estructura lo hace más robusto y preparado para el futuro!
