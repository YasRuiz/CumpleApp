import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { db } from "./firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

function App() {
  const [nombre, setNombre] = useState("");
  const [fechaInput, setFechaInput] = useState("");
  const [cumples, setCumples] = useState([]);
  const [editId, setEditId] = useState(null);
  const [mesFiltro, setMesFiltro] = useState("");
  const [modo, setModo] = useState(null);
  const [intentoClave, setIntentoClave] = useState("");

  const CLAVE_ADMIN = "admin123";

  const meses = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
  ];

  const cumpleRef = collection(db, "cumples");

  useEffect(() => {
    const cargar = async () => {
      const snapshot = await getDocs(cumpleRef);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCumples(data);
    };
    cargar();
  }, []);

  const formatearFecha = (fecha) => {
    const [anio, mes, dia] = fecha.split("-");
    return `${parseInt(dia)} de ${meses[parseInt(mes) - 1]} de ${anio}`;
  };

  const validarFecha = (valor) => {
    if (valor.length !== 8) return null;
    try {
      const year = parseInt(valor.slice(4), 10);
      const month = parseInt(valor.slice(2, 4), 10);
      const day = parseInt(valor.slice(0, 2), 10);
      const maxDays = new Date(year, month, 0).getDate();

      if (
        isNaN(year) || isNaN(month) || isNaN(day) ||
        month < 1 || month > 12 || day < 1 || day > maxDays
      ) return null;

      return `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
    } catch {
      return null;
    }
  };

  const agregarOEditarCumple = async () => {
    const fechaFormateada = validarFecha(fechaInput);
    if (!nombre || !fechaFormateada) {
      alert("Nombre y fecha válida en formato DDMMYYYY son requeridos.");
      return;
    }

    const nuevo = { nombre, fecha: fechaFormateada };

    if (editId) {
      const ref = doc(db, "cumples", editId);
      await updateDoc(ref, nuevo);
      setCumples(cumples.map(c => (c.id === editId ? { id: editId, ...nuevo } : c)));
      setEditId(null);
    } else {
      const docRef = await addDoc(cumpleRef, nuevo);
      setCumples([...cumples, { id: docRef.id, ...nuevo }]);
      confetti();
    }

    setNombre("");
    setFechaInput("");
  };

  const editarCumple = (cumple) => {
    setNombre(cumple.nombre);
    const [y, m, d] = cumple.fecha.split("-");
    setFechaInput(`${d}${m}${y}`);
    setEditId(cumple.id);
  };

  const eliminarCumple = async (id) => {
    await deleteDoc(doc(db, "cumples", id));
    setCumples(cumples.filter(c => c.id !== id));
  };

  const cumplesFiltrados = mesFiltro
    ? cumples.filter((c) => parseInt(c.fecha.split("-")[1]) === parseInt(mesFiltro))
    : cumples;

  const volverInicio = () => {
    setModo(null);
    setIntentoClave("");
  };

  if (!modo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 to-pink-200">
        <div className="bg-white p-6 rounded-lg shadow-lg space-y-4 text-center">
          <h2 className="text-xl font-semibold">¿Cómo quieres ingresar?</h2>
          <button onClick={() => setModo("invitado")} className="bg-green-500 text-white px-4 py-2 rounded">Invitado</button>
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
              className="bg-blue-500 text-white mt-2 px-4 py-2 rounded"
            >Administrador</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-100 to-pink-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold text-center mb-4">🎉 Cumpleaños de Compañeros 🎈</h1>

      <div className="mb-4">
        {modo === "admin" ? (
          <button onClick={volverInicio} className="text-sm text-red-600 underline">Cerrar sesión</button>
        ) : (
          <button onClick={volverInicio} className="text-sm text-blue-600 underline">Volver al inicio</button>
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
            {editId ? "Guardar Cambios" : "Agregar Cumpleaños"}
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
          cumplesFiltrados.map((c) => (
            <div key={c.id} className="bg-white p-4 rounded shadow mb-2 flex justify-between items-center">
              <div>
                <p className="font-semibold text-lg">{c.nombre}</p>
                <p className="text-gray-600">{formatearFecha(c.fecha)}</p>
              </div>
              {modo === "admin" && (
                <div className="flex gap-2">
                  <button onClick={() => editarCumple(c)} className="text-blue-500 text-sm hover:underline">Editar</button>
                  <button onClick={() => eliminarCumple(c.id)} className="text-red-500 text-sm hover:underline">Eliminar</button>
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
