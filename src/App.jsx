import { useState, useEffect } from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "@react-hook/window-size";

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
      <Confetti width={width} height={height} numberOfPieces={120} />

      <h1 className="text-4xl font-bold text-center mb-4 text-pink-700">
        🎉 Cumpleaños de Compañeros 🎈
      </h1>

      <img
        src="https://media1.giphy.com/media/VyB31XTqZNJhFRZNyl/giphy.gif"
        alt="Fiesta"
        className="w-24 mb-6"
      />

      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md text-center">
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-300"
        />

        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className="w-full mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-300"
        />

        <button
          onClick={agregarCumple}
          className="w-full bg-pink-500 text-white font-semibold py-2 rounded hover:bg-pink-600 transition"
        >
          {modoEdicion ? "Guardar Cambios" : "Agregar Cumpleaños"}
        </button>
      </div>

      <div className="mt-6 w-full max-w-md space-y-4">
        {cumples.map((c, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-lg shadow-md flex flex-col sm:flex-row sm:justify-between items-center"
          >
            <div className="text-center sm:text-left">
              <p className="font-semibold text-lg text-gray-800">{c.nombre}</p>
              <p className="text-sm text-gray-500">{formatearFecha(c.fecha)}</p>
            </div>
            <div className="flex gap-4 mt-2 sm:mt-0">
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
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
