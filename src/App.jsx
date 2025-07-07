import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

function App() {
  const [nombre, setNombre] = useState("");
  const [fechaInput, setFechaInput] = useState("");
  const [cumples, setCumples] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [mesFiltro, setMesFiltro] = useState("");

  const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
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

  useEffect(() => {
    const hoy = new Date();
    const cumpleañeros = cumples.filter((c) => {
      const [y, m, d] = c.fecha.split("-");
      return (
        parseInt(m) === hoy.getMonth() + 1 &&
        parseInt(d) === hoy.getDate()
      );
    });

    if (cumpleañeros.length > 0) {
      alert(
        `🎉 Hoy están de cumpleaños:\n\n${cumpleañeros
          .map((c) => c.nombre)
          .join("\n")}`
      );
    }
  }, [cumples]);

  const formatearFecha = (fecha) => {
    const [anio, mes, dia] = fecha.split("-");
    return `${parseInt(dia)} de ${meses[parseInt(mes) - 1]} de ${anio}`;
  };

  const validarFecha = (valor) => {
    if (valor.length !== 8) return null;
    try {
      const year = parseInt(valor.slice(4, 8), 10);
      const month = parseInt(valor.slice(0, 2), 10);
      const day = parseInt(valor.slice(2, 4), 10);
      const maxDays = new Date(year, month, 0).getDate();

      if (
        isNaN(year) || year < 1900 || year > 2100 ||
        isNaN(month) || month < 1 || month > 12 ||
        isNaN(day) || day < 1 || day > maxDays
      ) {
        return null;
      }

      return `${year}-${month.toString().padStart(2, "0")}-${day
        .toString()
        .padStart(2, "0")}`;
    } catch {
      return null;
    }
  };

  const lanzarConfeti = () => {
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
    });
  };

  const agregarOEditarCumple = () => {
    const fechaFormateada = validarFecha(fechaInput);
    if (!nombre || !fechaFormateada) {
      alert("Completa nombre y una fecha válida (MMDDYYYY).");
      return;
    }

    const nuevo = { nombre, fecha: fechaFormateada };

    if (editIndex !== null) {
      const actualizados = [...cumples];
      actualizados[editIndex] = nuevo;
      setCumples(ordenarCumples(actualizados));
      setEditIndex(null);
    } else {
      const actualizados = [...cumples, nuevo];
      setCumples(ordenarCumples(actualizados));
      lanzarConfeti();
    }

    setNombre("");
    setFechaInput("");
  };

  const editarCumple = (index) => {
    const c = cumples[index];
    setNombre(c.nombre);
    const [y, m, d] = c.fecha.split("-");
    setFechaInput(`${m}${d}${y}`);
    setEditIndex(index);
  };

  const eliminarCumple = (index) => {
    const filtrados = cumples.filter((_, i) => i !== index);
    setCumples(filtrados);
  };

  const ordenarCumples = (lista) => {
    return [...lista].sort((a, b) => {
      const fechaA = new Date(a.fecha);
      const fechaB = new Date(b.fecha);
      return (
        fechaA.getMonth() - fechaB.getMonth() ||
        fechaA.getDate() - fechaB.getDate()
      );
    });
  };

  const cumplesFiltrados = mesFiltro
    ? cumples.filter(
        (c) => parseInt(c.fecha.split("-")[1]) === parseInt(mesFiltro)
      )
    : cumples;

  return (
    <div className="min-h-screen bg-gradient-to-tr from-yellow-100 via-pink-100 to-purple-200 flex flex-col items-center p-4">
      <motion.h1
        className="text-4xl font-extrabold text-purple-800 mb-6 text-center"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        🎉 Cumpleaños de Compañeros 🎈
      </motion.h1>

      <motion.div
        className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm space-y-4"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full p-3 border border-pink-300 rounded-md text-center text-purple-700 font-semibold"
        />
        <input
          type="text"
          placeholder="MMDDYYYY"
          maxLength={8}
          value={fechaInput}
          onChange={(e) => setFechaInput(e.target.value)}
          className="w-full p-3 border border-pink-300 rounded-md text-center text-blue-600 font-semibold"
        />
        <button
          onClick={agregarOEditarCumple}
          className="w-full bg-gradient-to-r from-pink-400 to-purple-500 text-white p-3 rounded-md font-bold hover:brightness-110 transition"
        >
          {editIndex !== null ? "Guardar Cambios" : "🎂 Agregar Cumpleaños"}
        </button>
      </motion.div>

      <div className="mt-6 w-full max-w-sm">
        <div className="flex flex-wrap gap-2 justify-center mb-4">
          <button
            onClick={() => setMesFiltro("")}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              mesFiltro === "" ? "bg-purple-600 text-white" : "bg-gray-200"
            }`}
          >
            Todos
          </button>
          {meses.map((mes, i) => (
            <button
              key={i}
              onClick={() => setMesFiltro(i + 1)}
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                mesFiltro === i + 1
                  ? "bg-pink-500 text-white"
                  : "bg-yellow-100 text-purple-700"
              }`}
            >
              {mes}
            </button>
          ))}
        </div>

        <AnimatePresence>
          {cumplesFiltrados.length === 0 ? (
            <motion.p
              className="text-center text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              No hay cumpleaños en este mes.
            </motion.p>
          ) : (
            cumplesFiltrados.map((c, index) => (
              <motion.li
                key={index}
                className="bg-white p-4 mt-2 rounded-lg shadow-md flex justify-between items-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <div>
                  <p className="font-bold text-purple-800">{c.nombre}</p>
                  <p className="text-sm text-gray-600">
                    {formatearFecha(c.fecha)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => editarCumple(index)}
                    className="text-blue-500 hover:underline text-sm"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => eliminarCumple(index)}
                    className="text-red-500 hover:underline text-sm"
                  >
                    Eliminar
                  </button>
                </div>
              </motion.li>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
