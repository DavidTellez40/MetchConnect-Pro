import { useState } from "react";
import API from "../../api/api";
import StarRating from "../common/StarRating";

export default function RatingModal({ citaId, onClose, reload }) {
  const [estrellas, setEstrellas] = useState(5);
  const [comentario, setComentario] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      await API.post("/ratings", {
        citaId,
        estrellas,
        comentario
      });

      reload();
      onClose();
    } catch (err) {
      setError(err.response?.data?.msg || "Error al guardar valoración");
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-lg">

        <h2 className="text-xl font-bold mb-4 text-center">
          Valorar mecánico
        </h2>

        <div className="flex justify-center mb-4">
          <StarRating
            value={estrellas}
            editable
            onChange={setEstrellas}
            size={30}
          />
        </div>

        <textarea
          className="w-full border rounded-xl p-3"
          rows="3"
          placeholder="Comentario (opcional)"
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
        />

        {error && <p className="text-red-600 mt-2 text-sm">{error}</p>}

        <div className="flex gap-3 mt-5">
          <button
            onClick={onClose}
            className="flex-1 border rounded-xl py-2"
          >
            Cancelar
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-xl py-2 font-semibold"
          >
            {loading ? "Guardando..." : "Enviar"}
          </button>
        </div>
      </div>
    </div>
  );
}