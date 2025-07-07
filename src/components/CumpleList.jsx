import { formatearFecha } from "../utils/formatearFecha";

export default function CumpleList({ cumples, modo, onEdit, onDelete }) {
  return cumples.length === 0 ? (
    <p className="text-center text-gray-600">No hay cumpleaños para mostrar.</p>
  ) : (
    cumples.map((c) => (
      <div key={c.id} className="bg-white p-4 rounded shadow mb-2 flex justify-between items-center">
        <div>
          <p className="font-semibold text-lg">{c.nombre}</p>
          <p className="text-gray-600">{formatearFecha(c.fecha)}</p>
        </div>
        {modo === "admin" && (
          <div className="flex gap-2">
            <button onClick={() => onEdit(c)} className="text-blue-500 text-sm hover:underline">Editar</button>
            <button onClick={() => onDelete(c.id)} className="text-red-500 text-sm hover:underline">Eliminar</button>
          </div>
        )}
      </div>
    ))
  );
}
