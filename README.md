🎉 App de Cumpleaños 🎂
Esta es una aplicación web hecha con React y Firebase para registrar y mostrar cumpleaños. Ofrece una interfaz amigable para invitados y administradores, con funciones como agregar, editar, eliminar y filtrar cumpleaños por mes, así como una contraseña de administrador editable.

🚀 Características
Ver cumpleaños de todos los meses o filtrar por mes.

Agregar, editar y eliminar cumpleaños (solo para admins).

Mostrar quién cumple años hoy.

Lanzamiento de confeti al agregar cumpleaños.

Autenticación básica con contraseña de administrador.

Cambiar contraseña del administrador (almacenada en localStorage).

🛠️ Tecnologías usadas
React (hooks y JSX)

Tailwind CSS (estilos rápidos y responsive)

Firebase Firestore (base de datos)

canvas-confetti (efecto visual divertido)

📦 Instalación
Clona el repositorio:

bash
Copiar
Editar
git clone https://github.com/tu-usuario/cumples-app.git
cd cumples-app
Instala las dependencias:

bash
Copiar
Editar
npm install
Configura Firebase:

Asegúrate de tener un proyecto de Firebase creado. Luego, crea un archivo firebase.js dentro de src/:

js
Copiar
Editar
// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_AUTH_DOMAIN",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_STORAGE_BUCKET",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
Ejecuta la aplicación:

bash
Copiar
Editar
npm run dev
🔐 Contraseña de administrador
Por defecto: admin123

Puedes cambiarla desde la interfaz de administrador.

La nueva contraseña se guarda en localStorage, así que solo es válida para ese navegador/dispositivo.

📁 Estructura del proyecto
bash
Copiar
Editar
src/
│
├── App.jsx            # Componente principal
├── firebase.js        # Configuración de Firebase
├── index.js           # Entrada de la app
└── styles.css         # Estilos (usando Tailwind)
✅ TODO futuro (opcional)
Agregar autenticación real con Firebase Auth.

Notificaciones por email o push cuando alguien cumple.

Exportar/Importar cumpleaños (CSV).

Soporte para año completo (no solo DDMM).

## 🚀 Enlace en producción

- Firebase: [https://cumpleapp-18ab6.web.app](https://cumpleapp-18ab6.web.app)
- GitHub Pages: [https://yasruiz.github.io/CumpleApp/](https://yasruiz.github.io/CumpleApp/)

---

## 🧪 Comandos útiles

### Desarrollo
```bash
npm install
npm run dev


📄 Licencia
Este proyecto es libre para uso personal o educativo. Puedes modificarlo a tu gusto.