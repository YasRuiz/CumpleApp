import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";

function App() {
  const [nombre, setNombre] = useState("");
  const [fechaInput, setFechaInput] = useState("");
  const [cumples, setCumples] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
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
      spread: 100,
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
    <div className="min-h-screen bg-gradient-to-b from-yellow-100 to-pink-100 flex flex-col items-center p-6">
      <motion.h1
        className="text-3xl font-bold mb-4 text-center"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        🎉 Cumpleaños de Compañeros 🎈
      </motion.h1>

      <motion.div
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md space-y-4"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full p-2 border rounded text-center"
        />
        <input
          type="text"
          placeholder="MMDDYYYY"
          maxLength={8}
          value={fechaInput}
          onChange={(e) => setFechaInput(e.target.value)}
          className="w-full p-2 border rounded text-center"
        />
        <button
          onClick={agregarOEditarCumple}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
        >
          {editIndex !== null ? "Guardar Cambios" : "Agregar Cumpleaños"}
        </button>
      </motion.div>

      <div className="mt-6 w-full max-w-md">
        <div className="flex flex-wrap gap-2 justify-center mb-4">
          <button
            onClick={() => setMesFiltro("")}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              mesFiltro === "" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            Todos
          </button>
          {meses.map((mes, i) => (
            <button
              key={i}
              onClick={() => setMesFiltro(i + 1)}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                mesFiltro === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              {mes.charAt(0).toUpperCase() + mes.slice(1)}
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
                className="bg-white p-4 mt-2 rounded shadow flex justify-between items-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <div>
                  <p className="font-semibold">{c.nombre}</p>
                  <p className="text-sm text-gray-600">{formatearFecha(c.fecha)}</p>
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
