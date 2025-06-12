import { createContext, useContext, useState, useEffect } from "react";
import Cookies from 'js-cookie';
import { getUserInfo, loginService, registerRequest } from "../../services/AuthService"

//creamos el context
export const AuthContext = createContext();

export const useAuth = () =>{
    const context = useContext(AuthContext);
    if(!context){
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context
}

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [infoUser, setInfoUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Estado para la carga inicial

  useEffect(() => {
    const token = Cookies.get("login");
    console.log("Token obtenido de la cookie:", token);

    // Verificar si hay datos del usuario en localStorage
    const storedUser = localStorage.getItem("user");
    const storedInfoUser = localStorage.getItem("infoUser");
    const codeExpiryTime = localStorage.getItem("code_expiry_time");
    
    console.log("Datos en localStorage:", {
      storedUser,
      storedInfoUser,
      codeExpiryTime
    });

    // Si hay token o usuario almacenado
    if (token || storedUser) {
      setIsAuthenticated(true);
      
      // Priorizar el usuario almacenado si existe
      if (storedUser) {
        try {
          // Intentar parsear como JSON, si falla, usar como string
          let userData;
          try {
            userData = JSON.parse(storedUser);
          } catch {
            userData = storedUser;
          }
          setUser(userData);
          console.log("Usuario recuperado de localStorage:", userData);
        } catch (error) {
          console.error("Error al procesar user de localStorage:", error);
          localStorage.removeItem("user");
          setUser(token || null);
        }
      } else if (token) {
        setUser(token);
      }
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }

    // Cargar información del usuario desde localStorage
    if (storedInfoUser) {
      try {
        setInfoUser(JSON.parse(storedInfoUser));
      } catch (error) {
        console.error("Error al parsear infoUser de localStorage:", error);
        localStorage.removeItem("infoUser");
      }
    }
    
    // MEJORA: Dar un pequeño delay para asegurar que todos los estados se actualicen
    setTimeout(() => {
      setLoading(false); // La carga inicial ha terminado
    }, 100);
  }, []);

  useEffect(() => {
    if (user) {
      console.log("Usuario actualizado:", user);
      // Almacenar el usuario como string si es un objeto, o directamente si es string
      const userToStore = typeof user === 'object' ? JSON.stringify(user) : user;
      localStorage.setItem("user", userToStore);
      setIsAuthenticated(true);
    } else {
      // MEJORA: Solo limpiar localStorage si realmente no hay usuario después del loading inicial
      if (!loading) {
        localStorage.removeItem("user");
        setIsAuthenticated(false);
      }
    }

    if (infoUser) {
      const encodeInfoUser = JSON.stringify(infoUser);
      localStorage.setItem("infoUser", encodeInfoUser);
    } else {
      // MEJORA: Solo limpiar si no está en loading
      if (!loading) {
        localStorage.removeItem("infoUser");
      }
    }
  }, [user, infoUser, loading]);

  const signup = async (user) => {
    try {
      const res = await registerRequest(user);
      console.log("signup: ", res.data.user);
      
      // NO establecer tiempo de expiración aquí, ya que el backend lo maneja
      // El tiempo se establecerá cuando el usuario llegue a la página de verificación
      
      setUser(res.data.user);
      setIsAuthenticated(true);
      return res.data.message;
    } catch (error) {
      console.log(error);
      if (error.status === 400) {
        throw new Error(error.response.data.error);
      }
    }
  };

  const signIn = async (user) => {
    try {
      const response = await loginService(user);
      if(response.status === 200 && response.data.rol !== "Usuario"){
        const responseGetInfo = await getUserInfo();
        if(responseGetInfo.status === 200){
          setInfoUser({ ...responseGetInfo.data, token: null });
        }
        setIsAuthenticated(true);
        return response;
      }else{
        return {
          status: 400,
          message: "No tiene accecso al Panel de control, debes contactar con el Administrador."
        }
      }
    } catch (error) {
      if (error.status !== 200 && error.status !== 201) {
        return error;
      }
    }
  };

  const logout = () => {
    Cookies.remove("login");
    localStorage.removeItem("infoUser");
    localStorage.removeItem("user");
    localStorage.removeItem("code_expiry_time"); // Limpiar también el tiempo de expiración
    setUser(null);
    setIsAuthenticated(false);
    setInfoUser(null);
  };

  // Función para limpiar datos cuando el código expire
  const clearUserData = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("infoUser");
    localStorage.removeItem("code_expiry_time");
    setUser(null);
    setInfoUser(null);
    setIsAuthenticated(false);
  };

  // Función para verificar si el código aún es válido
  const isCodeStillValid = () => {
    const codeExpiryTime = localStorage.getItem("code_expiry_time");
    if (!codeExpiryTime) {
      // Si no hay tiempo de expiración guardado, asumimos que es válido
      // (probablemente el usuario acaba de registrarse)
      return true;
    }
    
    const currentTime = Date.now();
    const expiryTime = parseInt(codeExpiryTime);
    return currentTime < expiryTime;
  };

  // Función para obtener el tiempo restante en segundos
  const getTimeRemaining = () => {
    const codeExpiryTime = localStorage.getItem("code_expiry_time");
    if (!codeExpiryTime) {
      // Si no hay tiempo de expiración, establecer 15 minutos por defecto
      const newExpiryTime = Date.now() + (15 * 60 * 1000);
      localStorage.setItem("code_expiry_time", newExpiryTime.toString());
      return 15 * 60; // 15 minutos en segundos
    }
    
    const currentTime = Date.now();
    const expiryTime = parseInt(codeExpiryTime);
    const timeLeft = Math.max(0, Math.floor((expiryTime - currentTime) / 1000));
    return timeLeft;
  };

  // Función para inicializar el tiempo de expiración cuando el usuario llegue a verify
  const initializeCodeExpiry = () => {
    const codeExpiryTime = localStorage.getItem("code_expiry_time");
    if (!codeExpiryTime) {
      // Establecer 15 minutos desde ahora
      const expiryTime = Date.now() + (15 * 60 * 1000);
      localStorage.setItem("code_expiry_time", expiryTime.toString());
      console.log("Tiempo de expiración inicializado:", new Date(expiryTime));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        signup,
        signIn,
        logout,
        clearUserData,
        isCodeStillValid,
        getTimeRemaining,
        initializeCodeExpiry,
        user,
        infoUser,
        isAuthenticated,
        loading, // Exponemos el estado de carga
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}