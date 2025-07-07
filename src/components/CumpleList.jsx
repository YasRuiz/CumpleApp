// Importo 'motion' de Framer Motion para animaciones, y una función utilitaria para formatear fechas
import { motion } from "framer-motion";
import { formatearFecha } from "../utils/formatearFecha";

// Defino una lista de colores pastel que voy a usar como fondo para las secciones por mes
const colores = [
  "bg-pink-100", "bg-yellow-100", "bg-blue-100", "bg-green-100",
  "bg-purple-100", "bg-red-100", "bg-indigo-100", "bg-orange-100",
  "bg-lime-100", "bg-cyan-100", "bg-rose-100", "bg-amber-100"
];

// Componente principal que recibe los cumpleaños (cumples), un modo de vista, y funciones para editar y eliminar
const CumpleList = ({ cumples, modo, onEdit, onDelete }) => {
  // Agrupo los cumpleaños por mes
  const agrupados = {};

  // Recorro la lista de cumpleaños y los organizo según el mes (extraigo el mes del campo 'fecha')
  cumples.forEach((c) => {
    const mes = parseInt(c.fecha.slice(2, 4)); // Extraigo los dígitos del mes (por ejemplo, de "0705" saco "07")
    if (!agrupados[mes]) agrupados[mes] = [];
    agrupados[mes].push(c); // Agrego el cumpleaños al array correspondiente
  });

  // Ordeno los meses numéricamente
  const mesesOrdenados = Object.keys(agrupados).sort((a, b) => a - b);

  // Renderizo el contenido
  return (
    <div>
      {/* Recorro los meses ordenados y para cada uno renderizo su sección */}
      {mesesOrdenados.map((mes, i) => (
        <div key={mes} className={`p-4 rounded-xl mb-4 shadow ${colores[i % colores.length]}`}>
          {/* Título con el nombre del mes */}
          <h2 className="text-xl font-semibold mb-2">{`🎉 ${mesNombre(mes)} 🎉`}</h2>
          
          {/* Recorro los cumpleaños de ese mes */}
          {agrupados[mes].map((c) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-3 rounded-lg shadow mb-2 flex justify-between items-center"
            >
              {/* Muestro el nombre y la fecha formateada */}
              <div>
                <p className="font-semibold text-lg">{c.nombre}</p>
                <p className="text-gray-600">{formatearFecha(c.fecha)}</p>
              </div>

              {/* Si el modo es "admin", muestro los botones para editar y eliminar */}
              {modo === "admin" && (
                <div className="flex gap-2">
                  <button onClick={() => onEdit(c)} className="text-blue-600 text-sm hover:underline">Editar</button>
                  <button onClick={() => onDelete(c.id)} className="text-red-600 text-sm hover:underline">Eliminar</button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      ))}
    </div>
  );
};

// Función que transforma el número de mes a su nombre correspondiente
const mesNombre = (mesNum) => {
  const nombres = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
  ];
  return nombres[mesNum - 1]; // Resto 1 porque los arrays en JS empiezan en 0
};

// Exporto el componente para poder usarlo en otras partes de la app
export default CumpleList;
