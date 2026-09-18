# 💛 Para ti, con flores amarillas

Experiencia web romántica e interactiva para el Día de las Flores Amarillas.

---

## 📁 Estructura del proyecto

```
/
├── index.html          ← Página principal
├── css/
│   └── style.css       ← Todos los estilos
├── js/
│   └── script.js       ← Toda la lógica e interactividad
├── images/
│   ├── foto1.jpg       ← Reemplaza con tus fotos
│   ├── foto2.jpg
│   ├── foto3.jpg
│   ├── foto4.jpg
│   └── flores/         ← Carpeta opcional para imágenes extra
├── audio/
│   └── cancion.mp3     ← Coloca aquí tu canción
└── README.md
```

---

## ⚙️ Personalización

Abre `js/script.js` y modifica el objeto `CONFIG` al inicio del archivo:

```js
const CONFIG = {
  nombre: "Mi amor",              // Nombre del destinatario
  nombreRemitente: "Tu nombre",   // Tu nombre
  saludo: "Para ti,",             // Saludo de la carta
  fechaEspecial: "21 de septiembre",
  musica: "audio/cancion.mp3",    // Ruta de la canción

  mensajeCarta: `Tu mensaje aquí...`,  // Texto de la carta

  fotos: [
    { src: "images/foto1.jpg", fecha: "Una fecha", caption: "Un mensaje" },
    // ...
  ],

  frasesJardin: [
    "Frase al tocar una flor",
    // ...
  ]
};
```

---

## 🖼️ Fotografías

Coloca tus fotos en la carpeta `images/` con los nombres:
- `foto1.jpg`, `foto2.jpg`, `foto3.jpg`, `foto4.jpg`

O cambia las rutas directamente en `CONFIG.fotos`.

Tamaño recomendado: **800×600 px** o proporción **4:3**.

---

## 🎵 Música

1. Coloca tu archivo de audio en `audio/cancion.mp3`
2. Formatos soportados: `.mp3`, `.ogg`, `.wav`
3. La música **no se reproduce automáticamente** — el usuario debe presionar el botón 🎵

---

## 🚀 Ejecutar localmente

### Opción 1 — VS Code Live Server
1. Instala la extensión **Live Server** en VS Code
2. Clic derecho en `index.html` → **Open with Live Server**

### Opción 2 — Python (si tienes Python instalado)
```bash
# Python 3
python -m http.server 8080
# Luego abre: http://localhost:8080
```

### Opción 3 — Node.js
```bash
npx serve .
```

> ⚠️ No abras `index.html` directamente con doble clic — algunas funciones requieren un servidor local.

---

## 🌐 Publicar en Internet

### GitHub Pages (gratis)
1. Sube el proyecto a un repositorio de GitHub
2. Ve a **Settings → Pages**
3. Selecciona la rama `main` y carpeta `/root`
4. Tu sitio estará en `https://tuusuario.github.io/nombre-repo`

### Netlify (gratis, más fácil)
1. Ve a [netlify.com](https://netlify.com)
2. Arrastra la carpeta del proyecto al área de deploy
3. Listo — obtienes una URL pública al instante

### Vercel (gratis)
```bash
npx vercel
```

---

## 🎨 Personalización visual avanzada

Las variables de color están en `css/style.css` dentro de `:root`:

```css
:root {
  --yellow: #f5c842;       /* Amarillo principal */
  --gold: #d4a017;         /* Dorado */
  --green: #4a7c59;        /* Verde natural */
  --green-dark: #2d5a3d;   /* Verde oscuro */
  --cream: #fdf6e3;        /* Fondo crema */
}
```

---

## ✅ Compatibilidad

- Chrome, Edge, Firefox, Safari
- Diseño responsive: móvil, tablet, laptop, escritorio
- Modo noche incluido
- Accesible (ARIA, alt en imágenes, navegación por teclado)
