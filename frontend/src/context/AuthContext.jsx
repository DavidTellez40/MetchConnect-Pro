import { createContext, useState, useEffect } from "react";
import API from "../api/api";  

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);


  // 🛑 CORRECCIÓN CLAVE: Sincroniza el encabezado de Axios cada vez que el token cambie
  // Esto maneja login, register y logout.
  useEffect(() => {
    if (token) {
        // Establecer el encabezado de autorización globalmente en Axios
        API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        // Eliminar el encabezado si el token es nulo
        delete API.defaults.headers.common["Authorization"];
    }
  }, [token]);
    
  // Cargar usuario desde localStorage si ya había sesión (Primer useEffect - Se ejecuta una vez)
  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
        setLoading(false);
        return;
    }
    
    // 🛑 AGRESIVO: Configurar el header de Axios inmediatamente
    // Esto previene la carrera de condición antes de que los hijos se monten
    API.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;

    const restoreSession = async () => {
        try {
            // La llamada a la API ya tiene el header configurado por la línea de arriba
            const { data } = await API.get("/users/me");
            setUser(data);
            setToken(storedToken); 
        } catch (error) {
            console.error("Sesión inválida, cerrando sesión");
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setUser(null);
            setToken(null);
        } finally {
            setLoading(false);
        }
    };

    restoreSession();
}, []);


  // --------------------------
  // El resto de las funciones (login, register, logout)
  // --------------------------
  const login = async (correo, contrasena) => {
    const { data } = await API.post("/auth/login", {
      correo,        
      contrasena     
    });

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    setUser(data.user);
    setToken(data.token); 
    setLoading(false); 

    return data.user;
  };

  const register = async (formData) => {
    const { data } = await API.post("/auth/register", formData);

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    setUser(data.user);
    setToken(data.token); 
    setLoading(false); 

    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null); 
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}