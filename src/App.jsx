import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

function App() {
  const [nombre, setNombre] = useState("");
  const [fechaInput, setFechaInput] = useState("");
  const [cumples, setCumples] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [mesFiltro, setMesFiltro] = useState("");
  const [modo, setModo] = useState(null);
  const [intentoClave, setIntentoClave] = useState("");

  const [claveAdmin, setClaveAdmin] = useState(
    localStorage.getItem("claveAdmin") || "admin123"
  );

  const meses = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
  ];

  useEffect(() => {
    const guardados = localStorage.getItem("cumples");
    if (guardados) setCumples(JSON.parse(guardados));
  }, []);

  useEffect(() => {
    localStorage.setItem("cumples", JSON.stringify(cumples));
  }, [cumples]);

  const formatearFecha = (fecha) => {
    const [anio, mes, dia] = fecha.split("-");
    return `${parseInt(dia)} de ${meses[parseInt(mes) - 1]} de ${anio}`;
  };

  const validarFecha = (valor) => {
    if (valor.length !== 8) return null;
    try {
      const year = parseInt(valor.slice(4, 8), 10);
      const month = parseInt(valor.slice(2, 4), 10);
      const day = parseInt(valor.slice(0, 2), 10);
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
    if (editIndex !== null) {
      const actualizados = [...cumples];
      actualizados[editIndex] = nuevo;
      setCumples(actualizados);
      setEditIndex(null);
    } else {
      const actualizados = [...cumples, nuevo];
      setCumples(actualizados);
      confetti();
    }
    setNombre("");
    setFechaInput("");
  };

  const editarCumple = (index) => {
    const c = cumples[index];
    setNombre(c.nombre);
    const [y, m, d] = c.fecha.split("-");
    setFechaInput(`${d}${m}${y}`);
    setEditIndex(index);
  };

  const eliminarCumple = (index) => {
    const filtrados = cumples.filter((_, i) => i !== index);
    setCumples(filtrados);
  };

  const cambiarClave = () => {
    const nuevaClave = prompt("Ingresa nueva contraseña para administrador:");
    if (nuevaClave && nuevaClave.trim().length >= 4) {
      localStorage.setItem("claveAdmin", nuevaClave.trim());
      setClaveAdmin(nuevaClave.trim());
      alert("Contraseña actualizada.");
    } else {
      alert("Debe tener al menos 4 caracteres.");
    }
  };

  const recuperarClave = () => {
    alert(`Tu contraseña actual es: ${claveAdmin}`);
  };

  const cumplesFiltrados = mesFiltro
    ? cumples.filter((c) => parseInt(c.fecha.split("-")[1]) === parseInt(mesFiltro))
    : cumples;

  if (!modo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 to-pink-200">
        <div className="bg-white p-6 rounded-lg shadow-lg space-y-4 text-center w-full max-w-sm">
          <h2 className="text-xl font-semibold">¿Cómo quieres ingresar?</h2>
          <button onClick={() => setModo("invitado")} className="bg-green-500 text-white px-4 py-2 rounded w-full">
            Invitado
          </button>
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
                if (intentoClave === claveAdmin) {
                  setModo("admin");
                } else {
                  alert("Contraseña incorrecta");
                }
              }}
              className="bg-blue-500 text-white mt-2 px-4 py-2 rounded w-full"
            >
              Administrador
            </button>
            <button
              onClick={recuperarClave}
              className="text-sm text-blue-600 mt-2 underline"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-100 to-pink-100 flex flex-col items-center p-6">
      <div className="flex justify-between w-full max-w-md mb-4">
        <h1 className="text-2xl font-bold">🎉 Cumpleaños</h1>
        {modo === "admin" ? (
          <div className="flex gap-2">
            <button onClick={cambiarClave} className="text-sm underline text-blue-600">Cambiar contraseña</button>
            <button onClick={() => setModo(null)} className="text-sm underline text-red-600">Cerrar sesión</button>
          </div>
        ) : (
          <button onClick={() => setModo(null)} className="text-sm underline text-blue-600">Regresar</button>
        )}
      </div>

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
                <p className="font-semibold text-lg">{c.nombre}</p>
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

