import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";

export default function MisVehiculos() {
  const navigate = useNavigate();

  const [vehicles, setVehicles] = useState([]);
  const [msg, setMsg] = useState("");
  const [form, setForm] = useState({
    placa: "",
    modelo: "",
    anio: ""
  });

  const loadVehicles = async () => {
    const { data } = await API.get("/vehicles/my");
    setVehicles(data);
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    await API.post("/vehicles", form);

    setForm({ placa: "", modelo: "", anio: "" });
    setMsg("✅ Vehículo registrado correctamente");
    loadVehicles();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Mis Vehículos</h1>

          <button
            onClick={() => navigate("/conductor")}
            className="bg-gray-600 text-white px-4 py-2 rounded-xl"
          >
            ← Volver
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-2xl shadow-md max-w-md mx-auto mb-8 space-y-4"
        >
          <input
            placeholder="Placa"
            className="border w-full px-4 py-2 rounded-xl"
            value={form.placa}
            onChange={(e) => setForm({ ...form, placa: e.target.value })}
            required
          />
          <input
            placeholder="Modelo"
            className="border w-full px-4 py-2 rounded-xl"
            value={form.modelo}
            onChange={(e) => setForm({ ...form, modelo: e.target.value })}
            required
          />
          <input
            placeholder="Año"
            type="number"
            className="border w-full px-4 py-2 rounded-xl"
            value={form.anio}
            onChange={(e) => setForm({ ...form, anio: e.target.value })}
            required
          />

          {msg && <p className="text-green-600 text-center">{msg}</p>}

          <button className="w-full bg-blue-600 text-white py-2 rounded-xl">
            Agregar vehículo
          </button>
        </form>

        {vehicles.length === 0 ? (
          <p className="text-center text-gray-600">
            No tienes vehículos registrados
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {vehicles.map((v) => (
              <div
                key={v._id}
                className="bg-white p-4 rounded-xl shadow border"
              >
                <p><strong>Placa:</strong> {v.placa}</p>
                <p><strong>Modelo:</strong> {v.modelo}</p>
                <p><strong>Año:</strong> {v.anio}</p>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}