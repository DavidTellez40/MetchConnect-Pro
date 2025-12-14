import { useEffect, useState, useContext } from "react";
import API from "../../api/api";
import { AuthContext } from "../../context/AuthContext";

export default function Profile() {
  // Accedemos al usuario logueado y a logout desde el contexto
  const { user, logout } = useContext(AuthContext);

  // Estado del formulario
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    documento: "",
    vehiculo: "",
    especialidad: "",
    taller: "",
  });

  // Estados de carga y mensajes
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Al cargar el componente, obtenemos los datos del perfil
  useEffect(() => {
    loadProfile();
  }, []);

  // Función para obtener datos del backend
  const loadProfile = async () => {
    try {
      const { data } = await API.get("/users/me");

      // Rellenamos el formulario con los datos del usuario
      setForm({
        nombre: data.nombre || "",
        correo: data.correo || "",
        telefono: data.telefono || "",
        documento: data.documento || "",
        vehiculo: data.vehiculo || "",
        especialidad: data.especialidad || "",
        taller: data.taller || "",
      });
    } catch (err) {
      console.error(err);
      setError("Error al cargar el perfil.");
    }

    setLoading(false);
  };

  // Manejar cambios en inputs
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Guardar cambios del perfil
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await API.put("/users/me", form);
      setSuccess("Datos actualizados correctamente ✔");
    } catch (err) {
      console.error(err);
      setError("Error al guardar cambios");
    }

    setSaving(false);
  };

  // Mientras carga los datos, mostramos un texto temporal
  if (loading) return <p className="p-10 text-center">Cargando perfil...</p>;

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10 flex justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg border">

        {/* Título */}
        <h1 className="text-3xl font-bold text-blue-700 text-center mb-6">
          Mi Perfil
        </h1>

        {/* Formulario principal */}
        <form className="space-y-4" onSubmit={handleSubmit}>

          {/* Nombre */}
          <div>
            <label className="font-medium block mb-1">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-2"
            />
          </div>

          {/* Correo */}
          <div>
            <label className="font-medium block mb-1">Correo</label>
            <input
              type="email"
              name="correo"
              value={form.correo}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-2"
            />
          </div>

          {/* Teléfono */}
          <div>
            <label className="font-medium block mb-1">Teléfono</label>
            <input
              type="text"
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-2"
            />
          </div>

          {/* Documento */}
          <div>
            <label className="font-medium block mb-1">Documento</label>
            <input
              type="text"
              name="documento"
              value={form.documento}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-2"
            />
          </div>

          {/* Vehículo — Solo conductores */}
          {user.rol === "conductor" && (
            <div>
              <label className="font-medium block mb-1">Vehículo</label>
              <input
                type="text"
                name="vehiculo"
                value={form.vehiculo}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-2"
              />
            </div>
          )}

          {/* Especialidad + Taller — Solo mecánicos */}
          {user.rol === "mecanico" && (
            <>
              <div>
                <label className="font-medium block mb-1">Especialidad</label>
                <input
                  type="text"
                  name="especialidad"
                  value={form.especialidad}
                  onChange={handleChange}
                  className="w-full border rounded-xl px-4 py-2"
                />
              </div>

              <div>
                <label className="font-medium block mb-1">Taller</label>
                <input
                  type="text"
                  name="taller"
                  value={form.taller}
                  onChange={handleChange}
                  className="w-full border rounded-xl px-4 py-2"
                />
              </div>
            </>
          )}

          {/* Mensajes de error y éxito */}
          {error && <p className="text-red-600">{error}</p>}
          {success && <p className="text-green-600">{success}</p>}

          {/* Botón para guardar */}
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl font-semibold"
          >
            {saving ? "Guardando..." : "Guardar Cambios"}
          </button>
        </form>

        {/* Enlace a cambiar contraseña */}
        <div className="text-center mt-4">
          <a
            href="/perfil/cambiar-contrasena"
            className="text-blue-600 font-semibold hover:underline"
          >
            Cambiar contraseña
          </a>
        </div>

      </div>
    </div>
  );
}