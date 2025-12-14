import { useState } from "react";
import API from "../../api/api";

export default function ChangePassword() {
  const [form, setForm] = useState({
    actual: "",
    nueva: "",
    confirmar: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.nueva !== form.confirmar) {
      setError("Las contraseñas nuevas no coinciden");
      return;
    }

    setLoading(true);

    try {
      const res = await API.put("/users/me/password", {
        actual: form.actual,
        nueva: form.nueva,
      });

      setSuccess(res.data.msg);
      setForm({ actual: "", nueva: "", confirmar: "" });
    } catch (err) {
      setError(err.response?.data?.msg || "Error al cambiar la contraseña");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center px-6 py-10">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg border">

        <h1 className="text-2xl font-bold text-blue-700 text-center mb-6">
          Cambiar Contraseña
        </h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="font-medium">Contraseña actual</label>
            <input
              type="password"
              name="actual"
              value={form.actual}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-2"
            />
          </div>

          <div>
            <label className="font-medium">Nueva contraseña</label>
            <input
              type="password"
              name="nueva"
              value={form.nueva}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-2"
            />
          </div>

          <div>
            <label className="font-medium">Confirmar nueva contraseña</label>
            <input
              type="password"
              name="confirmar"
              value={form.confirmar}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-2"
            />
          </div>

          {error && <p className="text-red-600">{error}</p>}
          {success && <p className="text-green-600">{success}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-xl font-semibold"
          >
            {loading ? "Guardando..." : "Cambiar Contraseña"}
          </button>
        </form>

      </div>
    </div>
  );
}