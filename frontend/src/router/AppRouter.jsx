import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

// Pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import DashboardConductor from "../pages/conductor/DashboardConductor";
import CreateAppointment from "../pages/conductor/CreateAppointment";
import MisVehiculos from "../pages/conductor/MisVehiculos";
import MisCitas from "../pages/conductor/MisCitas";
import DashboardMecanico from "../pages/mecanico/DashboardMecanico";
import MisCitasMecanico from "../pages/mecanico/MisCitasMecanico";
import MisValoraciones from "../pages/mecanico/MisValoraciones";
import ValorarMecanico from "../pages/conductor/ValorarMecanico";
import BuscarMecanicos from "../pages/conductor/BuscarMecanicos";
import DashboardAdmin from "../pages/admin/DashboardAdmin";
import UsersAdmin from "../pages/admin/UsersAdmin";
import EditUser from "../pages/admin/EditUser";
import Profile from "../pages/common/Profile";
import ChangePassword from "../pages/common/ChangePassword";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";


function PrivateRoute({ children, roles }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <p>Cargando...</p>;
  if (!user) return <Navigate to="/login" />;

  if (roles && !roles.includes(user.rol)) {
    return <Navigate to="/" />;
  }

  return children;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/conductor"
          element={
            <PrivateRoute roles={["conductor"]}>
              <DashboardConductor />
            </PrivateRoute>
          }
        />

                <Route
          path="/conductor/crear-cita"
          element={
            <PrivateRoute roles={["conductor"]}>
              <CreateAppointment />
            </PrivateRoute>
          }
        />

                <Route
          path="/conductor/mis-citas"
          element={
            <PrivateRoute roles={["conductor"]}>
              <MisCitas />
            </PrivateRoute>
          }
        />

                <Route
          path="/conductor/vehiculos"
          element={
            <PrivateRoute roles={["conductor"]}>
             <MisVehiculos />
         </PrivateRoute>
          }
          />

                <Route
        path="/conductor/buscar-mecanicos"
        element={
          <PrivateRoute roles={["conductor"]}>
            <BuscarMecanicos />
          </PrivateRoute>
        }
      />

        <Route
          path="/mecanico"
          element={
            <PrivateRoute roles={["mecanico"]}>
              <DashboardMecanico />
            </PrivateRoute>
          }
        />

        <Route
          path="/mecanico/mis-citas"
          element={
             <PrivateRoute roles={["mecanico"]}>
               <MisCitasMecanico />
             </PrivateRoute>
          }
          />

        <Route
          path="/mecanico/valoraciones"
           element={
              <PrivateRoute roles={["mecanico"]}>
               <MisValoraciones />
             </PrivateRoute>
          }
          />
      // Después de las rutas del conductor:
<Route
  path="/conductor/valorar/:citaId" // 🛑 NUEVA RUTA DINÁMICA
  element={
    <PrivateRoute roles={["conductor"]}>
      <ValorarMecanico />
    </PrivateRoute>
  }
/>

        <Route
          path="/admin"
          element={
            <PrivateRoute roles={["admin"]}>
              <DashboardAdmin />
            </PrivateRoute>
          }
        />

          <Route
    path="/admin/usuarios"
    element={
      <PrivateRoute roles={["admin"]}>
        <UsersAdmin />
      </PrivateRoute>
    }
  />

        <Route
        path="/admin/editar-usuario/:id"
        element={
          <PrivateRoute roles={["admin"]}>
            <EditUser />
          </PrivateRoute>
        }
      />

          <Route
      path="/perfil"
      element={
        <PrivateRoute roles={["admin", "conductor", "mecanico"]}>
          <Profile />
        </PrivateRoute>
      }
    />

          <Route
        path="/perfil/cambiar-contrasena"
        element={
          <PrivateRoute roles={["admin", "conductor", "mecanico"]}>
            <ChangePassword />
          </PrivateRoute>
        }
      />

          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

        <Route path="*" element={<Navigate to="/login" />} />

      </Routes>
    </BrowserRouter>
  );
}