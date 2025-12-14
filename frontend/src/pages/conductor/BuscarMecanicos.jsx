import { useEffect, useState } from "react";
import API from "../../api/api";

export default function BuscarMecanicos() {
  const [especialidad, setEspecialidad] = useState("");
  const [mechanics, setMechanics] = useState([]);

  const buscar = async () => {
    const { data } = await API.get(
      `/mechanics/search?especialidad=${especialidad}`
    );
    setMechanics(data);
  };

  useEffect(() => {
    buscar();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">
        Buscar Mecánicos
      </h1>

      <div className="max-w-xl mx-auto mb-6 flex gap-2">
        <input
          placeholder="Especialidad (ej: frenos, motor, electricidad)"
          className="border w-full px-4 py-2 rounded-xl"
          value={especialidad}
          onChange={(e) => setEspecialidad(e.target.value)}
        />
        <button
          onClick={buscar}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl"
        >
          Buscar
        </button>
      </div>

      {mechanics.length === 0 ? (
        <p className="text-center text-gray-600">
          No se encontraron mecánicos
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {mechanics.map((m) => (
            <div
              key={m._id}
              className="bg-white p-6 rounded-2xl shadow border"
            >
              <h2 className="text-xl font-semibold">{m.nombre}</h2>
              <p className="text-gray-600">
                <strong>Especialidad:</strong> {m.especialidad}
              </p>
              <p className="text-gray-600">
                <strong>Taller:</strong> {m.taller || "No registrado"}
              </p>

              {/* Botón futuro */}
              <button className="mt-4 w-full bg-green-600 text-white py-2 rounded-xl">
                Solicitar cita
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}