// Importo React hooks y librerías necesarias
import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

function App() {
  const [nombre, setNombre] = useState("");
  const [fechaInput, setFechaInput] = useState("");
  const [cumples, setCumples] = useState([]);
  const [editId, setEditId] = useState(null);
  const [mesFiltro, setMesFiltro] = useState("");
  const [modo, setModo] = useState(null);
  const [clave, setClave] = useState("");
  const [cumplesHoy, setCumplesHoy] = useState([]);

  const CLAVE_ADMIN = "admin123";

  const meses = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
  ];

  const refCumples = collection(db, "cumples");

  useEffect(() => {
    obtenerCumples();
  }, []);

  useEffect(() => {
    const hoy = new Date();
    const dia = hoy.getDate().toString().padStart(2, "0");
    const mes = (hoy.getMonth() + 1).toString().padStart(2, "0");
    const hoyStr = `${dia}${mes}`;
    setCumplesHoy(cumples.filter(c => c.fecha === hoyStr));
  }, [cumples]);

  const obtenerCumples = async () => {
    const data = await getDocs(refCumples);
    const lista = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    setCumples(lista);
  };

  const formatearFecha = (fecha) => {
    const dia = parseInt(fecha.slice(0, 2));
    const mesNum = parseInt(fecha.slice(2, 4)) - 1;
    return `${dia} de ${meses[mesNum]}`;
  };

  const agregarOEditarCumple = async () => {
    if (!nombre || fechaInput.length !== 4) {
      alert("Ingresa nombre y una fecha válida (DDMM).");
      return;
    }

    const nuevo = { nombre, fecha: fechaInput };
    if (editId) {
      await updateDoc(doc(db, "cumples", editId), nuevo);
      setEditId(null);
    } else {
      await addDoc(refCumples, nuevo);
      confetti();
    }

    setNombre("");
    setFechaInput("");
    obtenerCumples();
  };

  const eliminarCumple = async (id) => {
    await deleteDoc(doc(db, "cumples", id));
    obtenerCumples();
  };

  const editarCumple = (c) => {
    setNombre(c.nombre);
    setFechaInput(c.fecha);
    setEditId(c.id);
  };

  const cumplesFiltrados = (mesFiltro
    ? cumples.filter(c => parseInt(c.fecha.slice(2, 4)) === parseInt(mesFiltro))
    : cumples
  ).sort((a, b) => {
    const mesA = parseInt(a.fecha.slice(2, 4));
    const mesB = parseInt(b.fecha.slice(2, 4));
    const diaA = parseInt(a.fecha.slice(0, 2));
    const diaB = parseInt(b.fecha.slice(0, 2));
    return mesA !== mesB ? mesA - mesB : diaA - diaB;
  });

  const agrupadosPorMes = cumplesFiltrados.reduce((acc, c) => {
    const mes = parseInt(c.fecha.slice(2, 4));
    if (!acc[mes]) acc[mes] = [];
    acc[mes].push(c);
    return acc;
  }, {});

  if (!modo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-yellow-100">
        <div className="bg-white p-6 rounded shadow text-center">
          <h2 className="text-xl font-semibold mb-4">Acceso</h2>
          <button onClick={() => setModo("invitado")} className="bg-green-500 text-white px-4 py-2 rounded mb-4">Entrar como Invitado</button>
          <div>
            <input
              type="password"
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              placeholder="Contraseña admin"
              className="border px-2 py-1 rounded w-full mb-2"
            />
            <button
              onClick={() => {
                if (clave === CLAVE_ADMIN) {
                  setModo("admin");
                } else {
                  alert("Contraseña incorrecta");
                }
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Entrar como Admin
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-100 to-pink-100 flex flex-col items-center p-6">
      <div className="w-full max-w-md flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">🎉 Cumpleaños 🎈</h1>
        <button
          onClick={() => setModo(null)}
          className="text-sm text-red-600 underline"
        >
          Volver
        </button>
      </div>

      {cumplesHoy.length > 0 && (
        <div className="bg-green-200 p-4 rounded-lg mb-4 text-center w-full max-w-md shadow-md">
          <h2 className="text-lg font-bold text-green-800">🎂 Hoy cumple:</h2>
          <ul>
            {cumplesHoy.map((c, i) => (
              <li key={i}>{c.nombre}</li>
            ))}
          </ul>
        </div>
      )}

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
            placeholder="DDMM"
            maxLength={4}
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
          >
            Todos
          </button>
          {meses.map((mes, i) => (
            <button
              key={i}
              onClick={() => setMesFiltro(i + 1)}
              className={`px-3 py-1 rounded-full ${mesFiltro === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            >
              {mes}
            </button>
          ))}
        </div>

        {Object.entries(agrupadosPorMes).length === 0 ? (
          <p className="text-center text-gray-600">No hay cumpleaños para mostrar.</p>
        ) : (
          Object.entries(agrupadosPorMes).map(([mes, personas]) => (
            <div key={mes} className="bg-pink-100 p-4 rounded-lg mb-4 shadow">
              <h2 className="text-lg font-bold mb-2 text-pink-800">🎉 {meses[mes - 1]} 🎉</h2>
              {personas.map((c) => (
                <div key={c.id} className="bg-white p-3 rounded shadow mb-2 flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-lg">{c.nombre}</p>
                    <p className="text-gray-600 text-sm">{formatearFecha(c.fecha)}</p>
                  </div>
                  {modo === "admin" && (
                    <div className="flex gap-2">
                      <button onClick={() => editarCumple(c)} className="text-blue-500 text-sm hover:underline">Editar</button>
                      <button onClick={() => eliminarCumple(c.id)} className="text-red-500 text-sm hover:underline">Eliminar</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
