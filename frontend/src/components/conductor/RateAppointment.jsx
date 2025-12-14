import { useState } from "react";
import API from "../../api/api";

export default function RateAppointment({ citaId, onClose, onSuccess }) {
  const [estrellas, setestrellas] = useState(5);
  const [comentario, setComentario] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await API.post("/ratings", {
        citaId,
        estrellas,
        comentario,
      });

      onSuccess();
      onClose();
    } catch (err) {
      setError("No se pudo enviar la valoración");
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">

        <h2 className="text-xl font-bold mb-4 text-center">
          Valorar Mecánico
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Puntuación */}
          <div>
            <label className="block font-medium mb-1">
              Puntuación (1 a 5)
            </label>
            <select
              value={estrellas}
              onChange={(e) => setestrellas(Number(e.target.value))}
              className="w-full border px-4 py-2 rounded-xl"
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n} ⭐
                </option>
              ))}
            </select>
          </div>

          {/* Comentario */}
          <div>
            <label className="block font-medium mb-1">
              Comentario (opcional)
            </label>
            <textarea
              rows="3"
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              className="w-full border px-4 py-2 rounded-xl"
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-xl bg-green-600 text-white"
            >
              {loading ? "Enviando..." : "Enviar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}