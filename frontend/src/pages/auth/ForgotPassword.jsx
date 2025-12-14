import { useState } from "react";
import API from "../../api/api";

export default function ForgotPassword() {
  const [correo, setCorreo] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");

    try {
      const res = await API.post("/auth/forgot-password", { correo });
      setMsg(res.data.msg);
    } catch (err) {
      setError(err.response?.data?.msg);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl w-full max-w-md shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-4">Recuperar contraseña</h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Correo electrónico"
            className="border w-full px-4 py-2 rounded-xl"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />

          {msg && <p className="text-green-600">{msg}</p>}
          {error && <p className="text-red-600">{error}</p>}

          <button className="w-full bg-blue-600 text-white py-2 rounded-xl">
            Enviar enlace
          </button>
        </form>
      </div>
    </div>
  );
}