# 🎉 CumpleApp - Aplicación de Cumpleaños

App web desarrollada con React + Firebase para registrar y consultar cumpleaños. Soporta dos modos de ingreso: **invitado** (solo lectura) y **administrador** (control completo). Incorpora confeti, filtros mensuales, edición en tiempo real y despliegue tanto en Firebase Hosting como en GitHub Pages.

---

## 🚀 Características destacadas

* 🔒 **Modo Administrador e Invitado**: inicio con selector de rol. El administrador requiere contraseña editable.
* 🎂 **Lista de cumpleaños**: vista clara con agrupación por mes.
* 🔍 **Filtro mensual**: ver todos los cumpleaños o filtrar por un mes específico.
* 🥳 **Confeti**: al agregar un nuevo cumpleaño (modo admin).
* 📅 **Hoy cumplen**: sección que resalta los cumpleaños actuales.
* 🛠️ **Cambiar contraseña admin** desde la interfaz (usa localStorage).

---

## 🧱 Tecnologías utilizadas

* [React](https://reactjs.org/) + Hooks
* [Firebase Firestore](https://firebase.google.com/)
* [Tailwind CSS](https://tailwindcss.com/)
* [canvas-confetti](https://www.npmjs.com/package/canvas-confetti)
* [Vite](https://vitejs.dev/) como bundler
* [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) para PWA
* [GitHub Pages](https://pages.github.com/) y [Firebase Hosting](https://firebase.google.com/products/hosting) para despliegue

---

## 📁 Estructura del proyecto

```
src/
├── assets/             # Recursos estáticos (iconos, etc.)
├── components/         # Componentes como CumpleList, CumpleForm, MesFiltro
├── utils/              # Funciones reutilizables (formateo de fechas)
├── views/              # (opcional) futuras vistas
├── App.jsx             # Componente principal con lógica y UI
├── firebase.js         # Configuración de Firebase
├── main.jsx            # Punto de entrada React
├── App.css / index.css # Estilos base y globales
```

---

## 🔧 Instalación y configuración

```bash
git clone https://github.com/YasRuiz/CumpleApp.git
cd CumpleApp
npm install
```

### 📲 Configura Firebase

1. Crea un proyecto desde [Firebase Console](https://console.firebase.google.com/)
2. Agrega tu config en `src/firebase.js`:

```js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "...",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
```

---

## 🔐 Contraseña de administrador

* Por defecto: `admin123`
* Editable desde el modo admin
* Almacenada en `localStorage` (no segura para producción real)

---

## 👩‍💻 Scripts disponibles

```bash
npm run dev        # Desarrollar en localhost:5173
npm run build      # Build para Firebase (vite.config.firebase.js)
npm run build:gh   # Build para GitHub Pages (vite.config.github.js)
npm run preview    # Servidor local para build
npm run deploy     # Despliega a GitHub Pages
```

---

## 🚀 Enlaces en producción

* 🔴 **Firebase**: [https://cumpleapp-18ab6.web.app](https://cumpleapp-18ab6.web.app)
* 🔵 **GitHub Pages**: [https://yasruiz.github.io/CumpleApp/](https://yasruiz.github.io/CumpleApp/)

---

## ✅ Cambios implementados recientemente

| Cambio                  | Descripción                                                                 |
| ----------------------- | --------------------------------------------------------------------------- |
| Modo invitado/admin     | Se agregó selector de rol con contraseña editable para admin                |
| Confeti                 | Se lanza cuando se agrega un nuevo cumpleaño (modo admin)                   |
| Agrupación por mes      | Cumpleaños ordenados y agrupados visualmente por mes                        |
| Filtros visuales        | Botones por mes con estilo activo/inactivo                                  |
| Firebase + GitHub Pages | Soporte dual de despliegue                                                  |
| Separación de config    | `vite.config.github.js` y `vite.config.firebase.js` definidos según destino |

---

## 💡 Ideas futuras (TODO)

* Integrar Firebase Auth real (email/password)
* Exportar e importar cumpleaños (CSV)
* Notificaciones push en cumpleaños
* Soporte para fecha completa (con año)

---

## 📜 Licencia

Este proyecto es libre para uso personal y educativo. Puedes modificarlo y adaptarlo según tus necesidades.

---

> Desarrollado por Yas Ruiz 🚀
