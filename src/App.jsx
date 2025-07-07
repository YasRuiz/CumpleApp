import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

function App() {
  const [modo, setModo] = useState(null); // 'admin' o 'invitado'
  const [intentoClave, setIntentoClave] = useState("");
  const [nombre, setNombre] = useState("");
  const [fechaInput, setFechaInput] = useState("");
  const [cumples, setCumples] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [mesFiltro, setMesFiltro] = useState("");

  const CLAVE_ADMIN = "admin123";
  const meses = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
  ];

  // Cargar cumpleaños guardados
  useEffect(() => {
    const guardados = localStorage.getItem("cumples");
    if (guardados) setCumples(JSON.parse(guardados));
  }, []);

  // Guardar en localStorage
  useEffect(() => {
    localStorage.setItem("cumples", JSON.stringify(cumples));
  }, [cumples]);

  const formatearFecha = (fecha) => {
    const [y, m, d] = fecha.split("-");
    return `${parseInt(d)} de ${meses[parseInt(m) - 1]} de ${y}`;
  };

  const validarFecha = (valor) => {
    if (valor.length !== 8) return null;
    try {
      const day = parseInt(valor.slice(0, 2), 10);
      const month = parseInt(valor.slice(2, 4), 10);
      const year = parseInt(valor.slice(4, 8), 10);
      const maxDays = new Date(year, month, 0).getDate();

      if (
        isNaN(year) || year < 1900 || year > 2100 ||
        isNaN(month) || month < 1 || month > 12 ||
        isNaN(day) || day < 1 || day > maxDays
      ) return null;

      return `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
    } catch {
      return null;
    }
  };

  const agregarOEditarCumple = () => {
    const fechaFormateada = validarFecha(fechaInput);
    if (!nombre || !fechaFormateada) {
      alert("Completa nombre y una fecha válida (DDMMYYYY).");
      return;
    }

    const nuevo = { nombre, fecha: fechaFormateada };
    let actualizados;

    if (editIndex !== null) {
      actualizados = [...cumples];
      actualizados[editIndex] = nuevo;
      setEditIndex(null);
    } else {
      actualizados = [...cumples, nuevo];
      confetti(); // 🎉
    }

    setCumples(actualizados);
    setNombre("");
    setFechaInput("");
  };

  const editarCumple = (index) => {
    const c = cumples[index];
    const [y, m, d] = c.fecha.split("-");
    setNombre(c.nombre);
    setFechaInput(`${d}${m}${y}`);
    setEditIndex(index);
  };

  const eliminarCumple = (index) => {
    const filtrados = cumples.filter((_, i) => i !== index);
    setCumples(filtrados);
  };

  const cumplesFiltrados = mesFiltro
    ? cumples.filter((c) => parseInt(c.fecha.split("-")[1]) === parseInt(mesFiltro))
    : cumples;

  // Pantalla de selección de modo
  if (!modo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 to-pink-200 font-[Fredoka]">
        <div className="bg-white p-6 rounded-lg shadow-lg space-y-4 text-center w-full max-w-xs">
          <h2 className="text-xl font-semibold">¿Cómo quieres ingresar?</h2>
          <button onClick={() => setModo("invitado")} className="bg-green-500 text-white px-4 py-2 rounded w-full">Invitado</button>
          <div>
            <input
              type="password"
              value={intentoClave}
              onChange={(e) => setIntentoClave(e.target.value)}
              placeholder="Contraseña de admin"
              className="border px-2 py-1 mt-4 rounded w-full"
            />
            <button
              onClick={() => {
                if (intentoClave === CLAVE_ADMIN) setModo("admin");
                else alert("Contraseña incorrecta");
              }}
              className="bg-blue-500 text-white mt-2 px-4 py-2 rounded w-full"
            >Administrador</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-100 to-pink-100 flex flex-col items-center p-6 font-[Fredoka]">
      <motion.h1
        className="text-3xl font-bold text-center mb-2 text-blue-800"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        🎉 Cumpleaños de Compañeros 🎈
      </motion.h1>

      <p className="text-sm italic mb-4 text-gray-600">Modo: {modo === "admin" ? "Administrador" : "Invitado"}</p>

      {modo === "admin" && (
        <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-md space-y-2">
          <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            placeholder="DDMMYYYY"
            maxLength={8}
            value={fechaInput}
            onChange={(e) => setFechaInput(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <button
            onClick={agregarOEditarCumple}
            className="w-full bg-blue-500 text-white p-2 rounded"
          >
            {editIndex !== null ? "Guardar Cambios" : "Agregar Cumpleaños"}
          </button>
        </div>
      )}

      <div className="mt-6 w-full max-w-md">
        <div className="flex flex-wrap gap-2 justify-center mb-4">
          <button
            onClick={() => setMesFiltro("")}
            className={`px-3 py-1 rounded-full ${mesFiltro === "" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >Todos</button>
          {meses.map((mes, i) => (
            <button
              key={i}
              onClick={() => setMesFiltro(i + 1)}
              className={`px-3 py-1 rounded-full ${mesFiltro === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            >{mes}</button>
          ))}
        </div>

        {cumplesFiltrados.length === 0 ? (
          <p className="text-center text-gray-600">No hay cumpleaños para mostrar.</p>
        ) : (
          cumplesFiltrados.map((c, index) => (
            <div key={index} className="bg-white p-4 rounded shadow mb-2 flex justify-between items-center">
              <div>
                <p className="font-semibold text-lg text-blue-700">{c.nombre}</p>
                <p className="text-gray-600">{formatearFecha(c.fecha)}</p>
              </div>
              {modo === "admin" && (
                <div className="flex gap-2">
                  <button onClick={() => editarCumple(index)} className="text-blue-500 text-sm hover:underline">Editar</button>
                  <button onClick={() => eliminarCumple(index)} className="text-red-500 text-sm hover:underline">Eliminar</button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
