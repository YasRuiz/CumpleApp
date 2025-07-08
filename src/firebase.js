// Importa funciones necesarias
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Configuración de tu proyecto Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBw8obXXgiWHLWub--AeFJVwDPTGQmyB24",
  authDomain: "cumpleapp-18ab6.firebaseapp.com",
  projectId: "cumpleapp-18ab6",
  storageBucket: "cumpleapp-18ab6.appspot.com", // 🔧 corregido aquí
  messagingSenderId: "747746427102",
  appId: "1:747746427102:web:de20b4af1610a8614f424f"
};

// Inicializa la app
const app = initializeApp(firebaseConfig);

// Exporta la instancia de Firestore
export const db = getFirestore(app);
