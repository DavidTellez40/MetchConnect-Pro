import { useEffect, useState } from "react";
import API from "../../api/api";
import { useParams, useNavigate } from "react-router-dom";

export default function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    rol: "",
    telefono: "",
    vehiculo: "",
    especialidad: "",
    taller: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const { data } = await API.get(`/users/${id}`);
      setForm(data);
    } catch (err) {
      console.error(err);
      alert("Error al cargar usuario");
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.put(`/users/${id}`, form);
      alert("Usuario actualizado ✔");
      navigate("/admin");
    } catch (err) {
      console.error(err);
      alert("Error al actualizar");
    }
  };

  if (loading) return <p className="text-center mt-10">Cargando...</p>;

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-md border">

        <h1 className="text-2xl font-bold text-blue-600 mb-6">
          Editar Usuario
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <input
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg"
            placeholder="Nombre"
          />

          <input
            type="email"
            name="correo"
            value={form.correo}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg"
            placeholder="Correo"
          />

          <select
            name="rol"
            value={form.rol}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg"
          >
            <option value="conductor">Conductor</option>
            <option value="mecanico">Mecánico</option>
            <option value="admin">Administrador</option>
          </select>

          {/* Campos condicionales */}
          {form.rol === "conductor" && (
            <input
              type="text"
              name="vehiculo"
              value={form.vehiculo}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg"
              placeholder="Vehículo"
            />
          )}

          {form.rol === "mecanico" && (
            <>
              <input
                type="text"
                name="especialidad"
                value={form.especialidad}
                onChange={handleChange}
                className="w-full border p-2 rounded-lg"
                placeholder="Especialidad"
              />

              <input
                type="text"
                name="taller"
                value={form.taller}
                onChange={handleChange}
                className="w-full border p-2 rounded-lg"
                placeholder="Taller"
              />
            </>
          )}

          <button
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700"
          >
            Guardar Cambios
          </button>

        </form>

      </div>
    </div>
  );
}