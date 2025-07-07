export default function MesFiltro({ meses, mesFiltro, setMesFiltro }) {
  return (
    <div className="flex flex-wrap gap-2 justify-center mb-4">
      <button
        onClick={() => setMesFiltro("")}
        className={`px-3 py-1 rounded-full ${mesFiltro === "" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
      >
        Todos
      </button>
      {meses.map((mes, i) => (
        <button
          key={i}
          onClick={() => setMesFiltro(i + 1)}
          className={`px-3 py-1 rounded-full ${mesFiltro === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          {mes}
        </button>
      ))}
    </div>
  );
}
