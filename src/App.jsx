import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { db } from "./firebase";
import {
  collection, addDoc, getDocs, deleteDoc, doc, updateDoc
} from "firebase/firestore";

import CumpleForm from "./components/CumpleForm";
import CumpleList from "./components/CumpleList";
import MesFiltro from "./components/MesFiltro";
import LoginView from "./views/LoginView";
import { formatearFecha } from "./utils/formatearFecha";

function App() {
  const [nombre, setNombre] = useState("");
  const [fechaInput, setFechaInput] = useState(""); // DDMM
  const [cumples, setCumples] = useState([]);
  const [editId, setEditId] = useState(null);
  const [mesFiltro, setMesFiltro] = useState("");
  const [modo, setModo] = useState(null);
  const [intentoClave, setIntentoClave] = useState("");
  const [claveAdmin, setClaveAdmin] = useState("admin123");
  const [mostrarCambioClave, setMostrarCambioClave] = useState(false);
  const [nuevaClave, setNuevaClave] = useState("");
  const [cumplesHoy, setCumplesHoy] = useState([]);

  const meses = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
  ];

  const refCumples = collection(db, "cumples");

  useEffect(() => {
    obtenerCumples();
    const claveGuardada = localStorage.getItem("claveAdmin");
    if (claveGuardada) setClaveAdmin(claveGuardada);
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

  const cambiarClave = () => {
    if (nuevaClave.length < 4) {
      alert("La nueva contraseña debe tener al menos 4 caracteres.");
      return;
    }
    localStorage.setItem("claveAdmin", nuevaClave);
    setClaveAdmin(nuevaClave);
    setNuevaClave("");
    setMostrarCambioClave(false);
    alert("Contraseña actualizada correctamente.");
  };

  const cumplesFiltrados = mesFiltro
    ? cumples.filter(c => parseInt(c.fecha.slice(2, 4)) === parseInt(mesFiltro))
    : cumples;

  if (!modo) {
    return (
      <LoginView
        intentoClave={intentoClave}
        setIntentoClave={setIntentoClave}
        claveAdmin={claveAdmin}
        setModo={setModo}
      />
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
        <>
          <CumpleForm
            nombre={nombre}
            setNombre={setNombre}
            fechaInput={fechaInput}
            setFechaInput={setFechaInput}
            onSubmit={agregarOEditarCumple}
            editId={editId}
          />

          <button
            onClick={() => setMostrarCambioClave(!mostrarCambioClave)}
            className="text-sm text-blue-600 underline mt-2"
          >
            {mostrarCambioClave ? "Cancelar cambio de contraseña" : "Cambiar contraseña"}
          </button>

          {mostrarCambioClave && (
            <div className="space-y-2 max-w-md w-full mt-2">
              <input
                type="password"
                placeholder="Nueva contraseña"
                value={nuevaClave}
                onChange={(e) => setNuevaClave(e.target.value)}
                className="w-full p-2 border rounded"
              />
              <button
                onClick={cambiarClave}
                className="w-full bg-green-500 text-white p-2 rounded"
              >
                Confirmar cambio
              </button>
            </div>
          )}
        </>
      )}

      <div className="mt-6 w-full max-w-md">
        <MesFiltro meses={meses} mesFiltro={mesFiltro} setMesFiltro={setMesFiltro} />
        <CumpleList
          cumples={cumplesFiltrados}
          modo={modo}
          onEdit={editarCumple}
          onDelete={eliminarCumple}
        />
      </div>
    </div>
  );
}

export default App;
