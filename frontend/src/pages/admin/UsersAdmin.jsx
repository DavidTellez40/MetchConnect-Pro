import { useEffect, useState } from "react";
import API from "../../api/api";
import UserModal from "../../components/admin/UserModal";
import ConfirmDialog from "../../components/common/ConfirmDialog";

export default function UsersAdmin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("todos");

  // Modals
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Cargar usuarios desde backend
  const loadUsers = async () => {
    try {
      const { data } = await API.get("/users");
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = users
    .filter((u) =>
      u.nombre.toLowerCase().includes(search.toLowerCase()) ||
      u.correo.toLowerCase().includes(search.toLowerCase())
    )
    .filter((u) => (roleFilter === "todos" ? true : u.rol === roleFilter));

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">
        Gestión de Usuarios
      </h1>

      <div className="bg-white p-6 rounded-2xl shadow-md">

        {/* Controles superiores */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">

          <input
            type="text"
            placeholder="Buscar por nombre o correo..."
            className="border rounded-xl px-4 py-2 w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="border rounded-xl px-4 py-2"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="todos">Todos</option>
            <option value="conductor">Conductores</option>
            <option value="mecanico">Mecánicos</option>
            <option value="admin">Admins</option>
          </select>

          <button
            onClick={() => {
              setEditingUser(null);
              setShowModal(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl"
          >
            + Crear Usuario
          </button>
        </div>

        {/* Tabla */}
        {loading ? (
          <p className="text-center text-gray-600">Cargando usuarios...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200 text-left">
                  <th className="p-3">Nombre</th>
                  <th className="p-3">Correo</th>
                  <th className="p-3">Rol</th>
                  <th className="p-3">Estado</th>
                  <th className="p-3">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u._id} className="border-b">
                    <td className="p-3">{u.nombre}</td>
                    <td className="p-3">{u.correo}</td>
                    <td className="p-3 capitalize">{u.rol}</td>
                    <td className="p-3">{u.estado}</td>
                    <td className="p-3 flex gap-2">
                      <button
                        onClick={() => {
                          setEditingUser(u);
                          setShowModal(true);
                        }}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg"
                      >
                        Editar
                      </button>

                      <button
                        onClick={() => {
                          setUserToDelete(u);
                          setConfirmDelete(true);
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modales */}
      {showModal && (
        <UserModal
          user={editingUser}
          onClose={() => setShowModal(false)}
          reload={loadUsers}
        />
      )}

      {confirmDelete && (
        <ConfirmDialog
          message={`¿Eliminar al usuario ${userToDelete.nombre}?`}
          onConfirm={async () => {
            await API.delete(`/users/${userToDelete._id}`);
            loadUsers();
            setConfirmDelete(false);
          }}
          onCancel={() => setConfirmDelete(false)}
        />
      )}

    </div>
  );
}