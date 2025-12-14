import { useState, useEffect } from "react";
import API from "../../api/api";

export default function UserModal({ user, onClose, reload }) {
  const editing = Boolean(user);

  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    rol: "conductor",
    telefono: "",
    documento: "",
    vehiculo: "",
    especialidad: "",
    taller: "",
    estado: "activo",
  });

  // Cargar datos si es edición
  useEffect(() => {
    if (editing) {
      setForm({
        nombre: user.nombre || "",
        correo: user.correo || "",
        rol: user.rol || "conductor",
        telefono: user.telefono || "",
        documento: user.documento || "",
        vehiculo: user.vehiculo || "",
        especialidad: user.especialidad || "",
        taller: user.taller || "",
        estado: user.estado || "activo",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editing) {
        // actualizar usuario
        await API.put(`/users/${user._id}`, form);
      } else {
        // crear usuario (forzar contraseña temporal)
        await API.post("/auth/register", {
          ...form,
          contrasena: "123456", // Contraseña por defecto
        });
      }

      reload();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error guardando usuario");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg p-6 rounded-2xl shadow-xl">

        <h2 className="text-2xl font-bold text-blue-700 mb-4">
          {editing ? "Editar Usuario" : "Crear Usuario"}
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>

          {/* Nombre */}
          <div>
            <label className="block font-medium">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-xl"
              required
            />
          </div>

          {/* Correo */}
          <div>
            <label className="block font-medium">Correo</label>
            <input
              type="email"
              name="correo"
              value={form.correo}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-xl"
              required
            />
          </div>

          {/* Rol */}
          <div>
            <label className="block font-medium">Rol</label>
            <select
              name="rol"
              value={form.rol}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-xl"
            >
              <option value="conductor">Conductor</option>
              <option value="mecanico">Mecánico</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Teléfono */}
          <div>
            <label className="block font-medium">Teléfono</label>
            <input
              type="text"
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-xl"
            />
          </div>

          {/* Documento */}
          <div>
            <label className="block font-medium">Documento</label>
            <input
              type="text"
              name="documento"
              value={form.documento}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-xl"
            />
          </div>

          {/* Campos dinámicos */}
          {form.rol === "conductor" && (
            <div>
              <label className="block font-medium">Vehículo</label>
              <input
                type="text"
                name="vehiculo"
                value={form.vehiculo}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-xl"
              />
            </div>
          )}

          {form.rol === "mecanico" && (
            <>
              <div>
                <label className="block font-medium">Especialidad</label>
                <input
                  type="text"
                  name="especialidad"
                  value={form.especialidad}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-medium">Taller</label>
                <input
                  type="text"
                  name="taller"
                  value={form.taller}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded-xl"
                />
              </div>
            </>
          )}

          {/* Estado */}
          <div>
            <label className="block font-medium">Estado</label>
            <select
              name="estado"
              value={form.estado}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-xl"
            >
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>

          {/* BOTONES */}
          <div className="flex justify-end gap-4 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded-xl"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-xl"
            >
              {editing ? "Guardar Cambios" : "Crear Usuario"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}