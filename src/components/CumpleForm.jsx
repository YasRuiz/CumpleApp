import { useState } from "react";

export default function CumpleForm({ nombre, setNombre, fechaInput, setFechaInput, onSubmit, editId }) {
  return (
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
        onClick={onSubmit}
        className="w-full bg-blue-500 text-white p-2 rounded"
      >
        {editId ? "Guardar Cambios" : "Agregar Cumpleaños"}
      </button>
    </div>
  );
}
