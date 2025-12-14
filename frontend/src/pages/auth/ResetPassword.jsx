import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/api";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [contrasena, setContrasena] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMsg("");
    setLoading(true);

    try {
      const res = await API.post(`/auth/reset-password/${token}`, {
        contrasena,
      });

      setMsg(res.data.msg);

      // 🔁 Redirección automática en 3 segundos
      setTimeout(() => {
        navigate("/login");
      }, 3000);

    } catch (err) {
      setError(err.response?.data?.msg || "Error al cambiar la contraseña");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">

        <h1 className="text-2xl font-bold text-center mb-4">
          Restablecer contraseña
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Nueva contraseña"
            className="w-full border px-4 py-2 rounded-xl"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
          />

          {msg && (
            <p className="text-green-600 text-center font-medium">
              {msg}<br />
              Redirigiendo al inicio de sesión…
            </p>
          )}

          {error && (
            <p className="text-red-600 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl"
          >
            {loading ? "Guardando..." : "Cambiar contraseña"}
          </button>
        </form>

        {/* Botón manual */}
        {msg && (
          <button
            onClick={() => navigate("/login")}
            className="mt-4 w-full border border-blue-600 text-blue-600 py-2 rounded-xl hover:bg-blue-50"
          >
            Ir a iniciar sesión
          </button>
        )}
      </div>
    </div>
  );
}