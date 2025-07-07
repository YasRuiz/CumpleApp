// Exporto este componente por defecto para poder importarlo fácilmente desde App.jsx u otro archivo
export default function MesFiltro({ meses, mesFiltro, setMesFiltro }) {
  return (
    // Contenedor de los botones de filtro de mes
    <div className="flex flex-wrap gap-2 justify-center mb-4">
      
      {/* Botón para mostrar todos los cumpleaños sin filtro de mes */}
      <button
        onClick={() => setMesFiltro("")} // Borra el filtro al hacer clic
        className={`px-3 py-1 rounded-full ${
          mesFiltro === "" ? "bg-blue-500 text-white" : "bg-gray-200"
        }`}
      >
        Todos
      </button>

      {/* Recorro el array de meses y genero un botón por cada uno */}
      {meses.map((mes, i) => (
        <button
          key={i} // Siempre es buena práctica agregar una key única en listas
          onClick={() => setMesFiltro(i + 1)} // Establezco el filtro con el número de mes (de 1 a 12)
          className={`px-3 py-1 rounded-full ${
            mesFiltro === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          {mes}
        </button>
      ))}
    </div>
  );
}
