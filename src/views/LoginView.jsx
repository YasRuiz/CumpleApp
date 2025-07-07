export default function LoginView({ intentoClave, setIntentoClave, claveAdmin, setModo }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 to-pink-200">
      <div className="bg-white p-6 rounded-lg shadow-lg space-y-4 text-center">
        <h2 className="text-xl font-semibold">¿Cómo quieres ingresar?</h2>
        <button onClick={() => setModo("invitado")} className="bg-green-500 text-white px-4 py-2 rounded">Invitado</button>

        <div>
          <input
            type="password"
            value={intentoClave}
            onChange={(e) => setIntentoClave(e.target.value)}
            placeholder="Contraseña de admin"
            className="border px-2 py-1 mt-4 rounded w-full"
          />
          <button
            onClick={() => {
              if (intentoClave === claveAdmin) {
                setModo("admin");
                setIntentoClave("");
              } else {
                alert("Contraseña incorrecta");
              }
            }}
            className="bg-blue-500 text-white mt-2 px-4 py-2 rounded"
          >
            Administrador
          </button>

          <button
            onClick={() => alert("Contacta al soporte para restablecer tu contraseña.")}
            className="text-sm text-blue-700 mt-2 underline"
          >
            Olvidé mi contraseña
          </button>
        </div>
      </div>
    </div>
  );
}
