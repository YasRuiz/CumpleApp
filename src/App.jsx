import { useState, useEffect } from "react"; import { motion, AnimatePresence } from "framer-motion"; import confetti from "canvas-confetti"; import { db } from "./firebaseConfig"; import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, } from "firebase/firestore";

function App() { const [nombre, setNombre] = useState(""); const [fechaInput, setFechaInput] = useState(""); const [cumples, setCumples] = useState([]); const [editId, setEditId] = useState(null); const [mesFiltro, setMesFiltro] = useState(""); const [modo, setModo] = useState(null); const [intentoClave, setIntentoClave] = useState(""); const [claveAdmin, setClaveAdmin] = useState("admin123");

const meses = [ "enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre" ];

const cumpleRef = collection(db, "cumples");

useEffect(() => { const obtenerCumples = async () => { const data = await getDocs(cumpleRef); setCumples(data.docs.map(doc => ({ ...doc.data(), id: doc.id }))); }; obtenerCumples(); }, []);

const formatearFecha = (fecha) => { const [mes, dia] = fecha.split("-"); return ${parseInt(dia)} de ${meses[parseInt(mes) - 1]}; };

const validarFecha = (valor) => { if (valor.length !== 4) return null; const dia = parseInt(valor.slice(0, 2), 10); const mes = parseInt(valor.slice(2, 4), 10); const maxDays = new Date(2024, mes, 0).getDate();

if (
  isNaN(mes) || mes < 1 || mes > 12 ||
  isNaN(dia) || dia < 1 || dia > maxDays
) return null;

return `${mes.toString().padStart(2, "0")}-${dia.toString().padStart(2, "0")}`;

};

const agregarOEditarCumple = async () => { const fechaFormateada = validarFecha(fechaInput); if (!nombre || !fechaFormateada) { alert("Completa nombre y una fecha válida (DDMM)."); return; } if (editId) { const ref = doc(db, "cumples", editId); await updateDoc(ref, { nombre, fecha: fechaFormateada }); setCumples(prev => prev.map(c => c.id === editId ? { ...c, nombre, fecha: fechaFormateada } : c)); setEditId(null); } else { const docRef = await addDoc(cumpleRef, { nombre, fecha: fechaFormateada }); setCumples([...cumples, { nombre, fecha: fechaFormateada, id: docRef.id }]); confetti(); } setNombre(""); setFechaInput(""); };

const editarCumple = (cumple) => { setNombre(cumple.nombre); setFechaInput(cumple.fecha.split("-").reverse().join("")); setEditId(cumple.id); };

const eliminarCumple = async (id) => { await deleteDoc(doc(db, "cumples", id)); setCumples(cumples.filter(c => c.id !== id)); };

const cumplesFiltrados = mesFiltro ? cumples.filter(c => parseInt(c.fecha.split("-")[0]) === parseInt(mesFiltro)) : cumples;

const hoy = new Date(); const hoyStr = ${(hoy.getMonth() + 1).toString().padStart(2, "0")}-${hoy.getDate().toString().padStart(2, "0")}; const cumpleHoy = cumples.filter(c => c.fecha === hoyStr);

if (!modo) { return ( <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 to-pink-200"> <div className="bg-white p-6 rounded-lg shadow-lg space-y-4 text-center"> <h2 className="text-xl font-semibold">¿Cómo quieres ingresar?</h2> <button onClick={() => setModo("invitado")} className="bg-green-500 text-white px-4 py-2 rounded">Invitado</button> <div> <input type="password" value={intentoClave} onChange={(e) => setIntentoClave(e.target.value)} placeholder="Contraseña de admin" className="border px-2 py-1 mt-4 rounded w-full" /> <button onClick={() => { if (intentoClave === claveAdmin) setModo("admin"); else alert("Contraseña incorrecta"); }} className="bg-blue-500 text-white mt-2 px-4 py-2 rounded" >Administrador</button> </div> </div> </div> ); }

return ( <div className="min-h-screen bg-gradient-to-b from-yellow-100 to-pink-100 flex flex-col items-center p-6"> <h1 className="text-3xl font-bold text-center mb-4">🎉 Cumpleaños de Compañeros 🎈</h1>

{cumpleHoy.length > 0 && (
    <div className="bg-green-100 border border-green-400 text-green-800 px-4 py-2 rounded mb-4">
      🎂 Hoy cumplen: {cumpleHoy.map(c => c.nombre).join(", ")} 🎉
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
      <button onClick={() => setModo(null)} className="text-sm text-red-500 underline">Cerrar sesión</button>
    </div>
  )}

  {modo === "invitado" && (
    <button onClick={() => setModo(null)} className="text-sm text-blue-500 underline mb-4">← Volver al inicio</button>
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

); }

export default App;

