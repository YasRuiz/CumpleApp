import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

function App() {
  const [nombre, setNombre] = useState("");
  const [fechaInput, setFechaInput] = useState("");
  const [cumples, setCumples] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [confeti, setConfeti] = useState(false);
  const [mesFiltro, setMesFiltro] = useState("");

  const meses = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
  ];

  useEffect(() => {
    const guardados = localStorage.getItem("cumples");
    if (guardados) {
      setCumples(JSON.parse(guardados));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cumples", JSON.stringify(cumples));
  }, [cumples]);

  const formatearFecha = (fecha) => {
    const [anio, mes, dia] = fecha.split("-");
    return `${dia} de ${meses[parseInt(mes) - 1]} de ${anio}`;
  };

  const validarFecha = (valor) => {
    if (valor.length !== 8) return null;
    try {
      const day = parseInt(valor.slice(0, 2), 10);
      const month = parseInt(valor.slice(2, 4), 10);
      const year = parseInt(valor.slice(4, 8), 10);
      const maxDays = new Date(year, month, 0).getDate();

      if (
        isNaN(day) || day < 1 || day > maxDays ||
        isNaN(month) || month < 1 || month > 12 ||
        isNaN(year) || year < 1900 || year > 2100
      ) {
        return null;
      }

      return `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
    } catch {
      return null;
    }
  };

  const agregarOEditarCumple = () => {
    const fechaFormateada = validarFecha(fechaInput);
    if (!nombre || !fechaFormateada) {
      alert("Ingresa nombre y una fecha válida (DDMMYYYY).");
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
      setConfeti(true);
      setTimeout(() => setConfeti(false), 3000);
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

  const cumplesFiltrados = mesFiltro
    ? cumples.filter((c) => parseInt(c.fecha.split("-")[1]) === parseInt(mesFiltro))
    : cumples;

  return (
    <div className="min-h-screen bg-gradient-to-tr from-yellow-100 via-pink-200 to-purple-200 flex flex-col items-center p-4">
      <motion.h1
        className="text-4xl font-bold text-pink-700 text-center mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        🎉 Cumpleaños App 🎈
      </motion.h1>

      {confeti && (
        <motion.img
          src="https://media1.giphy.com/media/VyB31XTqZNJhFRZNyl/giphy.gif"
          alt="Confetti"
          className="w-20 h-20 absolute top-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}

      <motion.div
        className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm space-y-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full p-2 rounded border text-center"
        />
        <input
          type="text"
          placeholder="DDMMYYYY"
          maxLength={8}
          value={fechaInput}
          onChange={(e) => setFechaInput(e.target.value)}
          className="w-full p-2 rounded border text-center"
        />
        <button
          onClick={agregarOEditarCumple}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold p-2 rounded hover:opacity-90 transition"
        >
          {editIndex !== null ? "Guardar Cambios" : "Agregar Cumpleaños"}
        </button>
      </motion.div>

      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <button
          onClick={() => setMesFiltro("")}
          className={`px-3 py-1 rounded-full ${
            mesFiltro === "" ? "bg-pink-500 text-white" : "bg-white border"
          }`}
        >
          Todos
        </button>
        {meses.map((mes, i) => (
          <button
            key={i}
            onClick={() => setMesFiltro(i + 1)}
            className={`px-3 py-1 rounded-full ${
              mesFiltro === i + 1 ? "bg-pink-500 text-white" : "bg-white border"
            }`}
          >
            {mes}
          </button>
        ))}
      </div>

      <ul className="w-full max-w-sm mt-4 space-y-2">
        <AnimatePresence>
          {cumplesFiltrados.map((c, index) => (
            <motion.li
              key={index}
              className="bg-white p-4 rounded shadow flex justify-between items-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div>
                <p className="font-bold text-purple-700">{c.nombre}</p>
                <p className="text-sm text-gray-600">{formatearFecha(c.fecha)}</p>
              </div>
              <div className="flex gap-2 text-sm">
                <button
                  onClick={() => editarCumple(index)}
                  className="text-blue-500 hover:underline"
                >
                  Editar
                </button>
                <button
                  onClick={() => eliminarCumple(index)}
                  className="text-red-500 hover:underline"
                >
                  Eliminar
                </button>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}

export default App;
