// src/components/CumpleList.jsx
import { motion } from "framer-motion";
import { formatearFecha } from "../utils/formatearFecha";

const colores = [
  "bg-pink-100", "bg-yellow-100", "bg-blue-100", "bg-green-100",
  "bg-purple-100", "bg-red-100", "bg-indigo-100", "bg-orange-100",
  "bg-lime-100", "bg-cyan-100", "bg-rose-100", "bg-amber-100"
];

const CumpleList = ({ cumples, modo, onEdit, onDelete }) => {
  const agrupados = {};

  cumples.forEach((c) => {
    const mes = parseInt(c.fecha.slice(2, 4));
    if (!agrupados[mes]) agrupados[mes] = [];
    agrupados[mes].push(c);
  });

  const mesesOrdenados = Object.keys(agrupados).sort((a, b) => a - b);

  return (
    <div>
      {mesesOrdenados.map((mes, i) => (
        <div key={mes} className={`p-4 rounded-xl mb-4 shadow ${colores[i % colores.length]}`}>
          <h2 className="text-xl font-semibold mb-2">{`🎉 ${mesNombre(mes)} 🎉`}</h2>
          {agrupados[mes].map((c) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-3 rounded-lg shadow mb-2 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold text-lg">{c.nombre}</p>
                <p className="text-gray-600">{formatearFecha(c.fecha)}</p>
              </div>
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

const mesNombre = (mesNum) => {
  const nombres = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
  ];
  return nombres[mesNum - 1];
};

export default CumpleList;
