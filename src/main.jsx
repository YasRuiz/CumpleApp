import React from "react";
/* Primero importo React, que es necesario para poder usar JSX 
   y crear componentes. Aunque en versiones más nuevas ya no siempre 
   es obligatorio, lo incluyo por compatibilidad y claridad. */

import ReactDOM from "react-dom/client";
/* Importo el módulo de React DOM que me permite renderizar 
   la aplicación en el navegador. Uso la versión moderna con `.createRoot` 
   para aprovechar la nueva API de React 18. */

import App from "./App";
/* Importo el componente principal de mi aplicación, 
   el que va a actuar como punto de entrada a toda la interfaz. */

import "./index.css";
/* Importo los estilos globales, donde también están las directivas de Tailwind 
   (@tailwind base, components y utilities). Aquí se define el aspecto visual 
   general de la app. */

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* Uso StrictMode para ayudarme a detectar posibles problemas en tiempo de desarrollo.
        No afecta la app en producción, pero sí me avisa si hay código obsoleto o no óptimo. */}
    <App />
  </React.StrictMode>
);
/* Finalmente, le digo a React que monte (renderice) mi componente <App />
   dentro del elemento HTML con el id "root", que está en el archivo index.html. 
   Toda la app vive dentro de ese contenedor. */
