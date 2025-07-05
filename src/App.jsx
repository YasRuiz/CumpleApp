import { useState, useEffect } from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "@react-hook/window-size";

// Colores e íconos por mes (0 = enero, 11 = diciembre)
const estiloMes = [
  { color: "bg-red-100", icono: "🎉" },
  { color: "bg-pink-100", icono: "❤️" },
  { color: "bg-yellow-100", icono: "🌼" },
  { color: "bg-green-100", icono: "🌿" },
  { color: "bg-blue-100", icono: "🌸" },
  { color: "bg-purple-100", icono: "☀️" },
  { color: "bg-orange-100", icono: "🎆" },
  { color: "bg-teal-100", icono: "🌻" },
  { color: "bg-rose-100", icono: "🍂" },
  { color: "bg-amber-100", icono: "🎃" },
  { color: "bg-lime-100", icono: "🌟" },
  { color: "bg-indigo-100", icono: "🎁" },
];

function App() {
  const [nombre, setNombre] = useState("");
  const [fecha, setFecha] = useState("");
  const [cumples, setCumples] = useState([]);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [indiceEdicion, setIndiceEdicion] = useState(null);
  const [width, height] = useWindowSize();

  useEffect(() => {
    const datosGuardados = localStorage.getItem("cumples");
    if (datosGuardados) {
      setCumples(JSON.parse(datosGuardados));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cumples", JSON.stringify(cumples));
  }, [cumples]);

  const agregarCumple = () => {
    if (!nombre || !fecha) return;

    if (modoEdicion) {
      const nuevos = [...cumples];
      nuevos[indiceEdicion] = { nombre, fecha };
      setCumples(nuevos);
      setModoEdicion(false);
      setIndiceEdicion(null);
    } else {
      setCumples([...cumples, { nombre, fecha }]);
    }

    setNombre("");
    setFecha("");
  };

  const editarCumple = (index) => {
    setNombre(cumples[index].nombre);
    setFecha(cumples[index].fecha);
    setModoEdicion(true);
    setIndiceEdicion(index);
  };

  const eliminarCumple = (index) => {
    const nuevos = cumples.filter((_, i) => i !== index);
    setCumples(nuevos);
  };

  const formatearFecha = (fechaISO) => {
    const opciones = { day: "numeric", month: "long", year: "numeric" };
    return new Date(fechaISO).toLocaleDateString("es-ES", opciones);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-pink-100 flex flex-col items-center p-6 relative">
      <Confetti width={width} height={height} numberOfPieces={100} />

      <h1 className="text-4xl font-bold text-center mb-4 text-pink-700">
        🎊 Cumpleaños de Compañeros 🎂
      </h1>

      <img
        src="https://media1.giphy.com/media/VyB31XTqZNJhFRZNyl/giphy.gif"
        alt="Fiesta"
        className="w-24 mb-6 rounded shadow"
      />

      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md text-center space-y-4">
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-300"
        />

        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-300"
        />

        <button
          onClick={agregarCumple}
          className="w-full bg-pink-500 text-white font-semibold py-2 rounded hover:bg-pink-600 transition"
        >
          {modoEdicion ? "Guardar Cambios" : "Agregar Cumpleaños"}
        </button>
      </div>

      <div className="mt-8 w-full max-w-md space-y-4">
        {cumples.map((c, index) => {
          const mes = new Date(c.fecha).getMonth();
          const estilo = estiloMes[mes];

          return (
            <div
              key={index}
              className={`${estilo.color} p-4 rounded-lg shadow-md flex justify-between items-center transition hover:scale-[1.02]`}
            >
              <div>
                <p className="font-semibold text-lg text-gray-800">
                  {estilo.icono} {c.nombre}
                </p>
                <p className="text-sm text-gray-600">{formatearFecha(c.fecha)}</p>
              </div>
              <div className="flex flex-col gap-1 text-sm">
                <button
                  onClick={() => editarCumple(index)}
                  className="text-blue-600 hover:underline"
                >
                  Editar
                </button>
                <button
                  onClick={() => eliminarCumple(index)}
                  className="text-red-600 hover:underline"
                >
                  Eliminar
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
