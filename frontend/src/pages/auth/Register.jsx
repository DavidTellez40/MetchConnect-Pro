import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import logo from "../../assets/logo.svg";

export default function Register() {
  const { register } = useContext(AuthContext);

  const initialForm = {
    nombre: "",
    correo: "",
    contrasena: "",
    rol: "conductor",
    telefono: "",
    documento: "",
    especialidad: "",
    taller: "",
  };

  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Normalizaciones para campos numéricos
    if (name === "telefono" || name === "documento") {
      // mantener solo dígitos
      const digits = value.replace(/[^0-9]/g, "");
      setForm((s) => ({ ...s, [name]: digits }));
      return;
    }

    setForm((s) => ({ ...s, [name]: value }));
  };

  // Validación local antes de enviar
  const validate = () => {
    if (!form.nombre.trim()) return "El nombre es obligatorio.";
    if (!form.correo.trim()) return "El correo es obligatorio.";
    // email simple regex
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(form.correo)) return "El correo no es válido.";
    if (!form.contrasena || form.contrasena.length < 6) return "La contraseña debe tener al menos 6 caracteres.";
    if (!form.documento) return "El documento es obligatorio.";
    if (form.documento.length > 10) return "El documento debe tener como máximo 10 dígitos.";
    // Si rol conductor: (vehículo opcional, no obligatorio). Si quieres hacerlo obligatorio, descomenta:
    // if (form.rol === "conductor" && !form.vehiculo.trim()) return "El vehículo es obligatorio para conductores.";
    if (form.rol === "mecanico") {
      if (!form.especialidad.trim()) return "La especialidad es obligatoria para mecánicos.";
      if (!form.taller.trim()) return "El taller es obligatorio para mecánicos.";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    setLoading(true);
    try {
      // Llamamos al register del contexto (lo que centraliza token/usuario)
      await register({
        nombre: form.nombre,
        correo: form.correo,
        contrasena: form.contrasena,
        rol: form.rol,
        telefono: form.telefono || undefined,
        documento: form.documento,
        especialidad: form.rol === "mecanico" ? form.especialidad || undefined : undefined,
        taller: form.rol === "mecanico" ? form.taller || undefined : undefined,
      });

      setSuccess("✓ Registro exitoso. Ahora puedes iniciar sesión.");
      setForm(initialForm);
    } catch (err) {
      // Trata de leer distintos formatos de error que el backend pueda enviar
      const msg =
        err?.response?.data?.msg ||
        (err?.response?.data?.errors && err.response.data.errors.map((x) => x.msg).join(", ")) ||
        err.message ||
        "Error en el registro.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-lg bg-white shadow-xl rounded-2xl p-8 border border-gray-100">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src={logo} className="w-20 h-20" alt="Logo" />
        </div>

        <h1 className="text-2xl font-bold text-center text-blue-700 mb-6">Registro de Usuario</h1>

        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <div>
            <label className="block font-medium mb-1">Nombre completo</label>
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
              className="w-full border px-4 py-2 rounded-xl focus:ring-2 focus:ring-blue-500"
              placeholder="Juan Pérez"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Correo electrónico</label>
            <input
              name="correo"
              type="email"
              value={form.correo}
              onChange={handleChange}
              required
              className="w-full border px-4 py-2 rounded-xl focus:ring-2 focus:ring-blue-500"
              placeholder="correo@ejemplo.com"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Contraseña</label>
            <input
              name="contrasena"
              type="password"
              value={form.contrasena}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full border px-4 py-2 rounded-xl focus:ring-2 focus:ring-blue-500"
              placeholder="********"
            />
            <p className="text-xs text-gray-400 mt-1">Mínimo 6 caracteres</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Teléfono</label>
              <input
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded-xl focus:ring-2 focus:ring-blue-500"
                placeholder="3001234567"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Documento</label>
              <input
                name="documento"
                value={form.documento}
                onChange={handleChange}
                required
                maxLength={10}
                className="w-full border px-4 py-2 rounded-xl focus:ring-2 focus:ring-blue-500"
                placeholder="Número de identificación (solo números)"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium mb-1">Rol</label>
            <select
              name="rol"
              value={form.rol}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-xl"
            >
              <option value="conductor">Conductor</option>
              <option value="mecanico">Mecánico</option>
            </select>
          </div>

          {/* Condicionales */}
          {form.rol === "conductor" && (
            <div>

            </div>
          )}

          {form.rol === "mecanico" && (
            <>
              <div>
                <label className="block font-medium mb-1">Especialidad</label>
                <input
                  name="especialidad"
                  value={form.especialidad}
                  onChange={handleChange}
                  required={form.rol === "mecanico"}
                  className="w-full border px-4 py-2 rounded-xl focus:ring-2 focus:ring-blue-500"
                  placeholder="Motor, frenos, suspensión..."
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Taller</label>
                <input
                  name="taller"
                  value={form.taller}
                  onChange={handleChange}
                  required={form.rol === "mecanico"}
                  className="w-full border px-4 py-2 rounded-xl focus:ring-2 focus:ring-blue-500"
                  placeholder="Nombre del taller"
                />
              </div>
            </>
          )}

          {/* Mensajes */}
          {error && <p className="text-red-600 text-sm text-center">{error}</p>}
          {success && <p className="text-green-600 text-sm text-center font-medium">{success}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            {loading ? "Registrando..." : "Registrarme"}
          </button>

          <p className="text-center text-gray-600 mt-4 text-sm">
            ¿Ya tienes cuenta?{" "}
            <a href="/login" className="text-blue-600 hover:underline font-medium">
              Inicia sesión aquí
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}