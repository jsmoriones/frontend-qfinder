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
    async function checkLogin() { // <-- Crea una función asíncrona interna
        const token = Cookies.get("login");
        console.log("Token obtenido de la cookie:", token);

        const storedUser = localStorage.getItem("user");
        const storedInfoUser = localStorage.getItem("infoUser");
        const codeExpiryTime = localStorage.getItem("code_expiry_time");
        
        console.log("Datos en localStorage:", {
            storedUser,
            storedInfoUser,
            codeExpiryTime
        });

        // Lógica para verificar y establecer el estado de autenticación
        if (token) {
            // Aquí podrías incluso hacer una llamada al backend para validar el token si es necesario
            // Por ahora, asumimos que si hay token, está autenticado.
            setIsAuthenticated(true);
            setUser(token); // O decodifica el token si lo necesitas
        } else if (storedUser) { // Si no hay token, pero hay usuario en localStorage (quizás un flujo sin cookies de token JWT directo)
            try {
                let userData;
                try {
                    userData = JSON.parse(storedUser);
                } catch {
                    userData = storedUser;
                }
                setUser(userData);
                setIsAuthenticated(true); // Se autentica si hay usuario guardado
                console.log("Usuario recuperado de localStorage:", userData);
            } catch (error) {
                console.error("Error al procesar user de localStorage:", error);
                localStorage.removeItem("user");
                setUser(null);
                setIsAuthenticated(false);
            }
        } else {
            setIsAuthenticated(false);
            setUser(null);
        }

        if (storedInfoUser) {
            try {
                setInfoUser(JSON.parse(storedInfoUser));
            } catch (error) {
                console.error("Error al parsear infoUser de localStorage:", error);
                localStorage.removeItem("infoUser");
            }
        }
        
        // ¡IMPORTANTE! setLoading(false) se llama solo DESPUÉS de todas las verificaciones
        setLoading(false); 
    }

    checkLogin(); // Llama a la función asíncrona
  }, []);

  useEffect(() => {
        if (user) {
            console.log("Usuario actualizado:", user);
            const userToStore = typeof user === 'object' ? JSON.stringify(user) : user;
            localStorage.setItem("user", userToStore);
            // No setIsAuthenticated(true) aquí, ya se hace en signIn o en la carga inicial
        } else if (!loading) { // Solo limpiar si no estamos en la carga inicial
            localStorage.removeItem("user");
            // No setIsAuthenticated(false) aquí, ya se hace en logout o al fallar signIn
        }

        if (infoUser) {
            const encodeInfoUser = JSON.stringify(infoUser);
            localStorage.setItem("infoUser", encodeInfoUser);
        } else if (!loading) { // Solo limpiar si no estamos en la carga inicial
            localStorage.removeItem("infoUser");
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
      return res;
    } catch (error) {
      //console.log(error);
      if (error.status === 400) {
        //throw new Error(error.response.data.error);
      }
      return error
    }
  };

  const signIn = async (userCredentials) => { // Cambiado 'user' a 'userCredentials' para claridad
    try {
        const response = await loginService(userCredentials);

        if (response.status === 200) {
                // Guarda el token en la cookie aquí si tu loginService no lo hace
                Cookies.set("login", response.data.token); // Suponiendo que el token está en response.data.token
                
                setIsAuthenticated(true); // <-- Setear a true si el login fue exitoso

                // Lógica específica para administradores
                if (response.data.rol === "Administrador") {
                    const responseGetInfo = await getUserInfo();
                    if (responseGetInfo.status === 200) {
                        setInfoUser({ ...responseGetInfo.data, token: null });
                    }
                }
        } else {
            // Si el status no es 200, significa que hubo un error de login (ej. credenciales inválidas)
            setIsAuthenticated(false); // Asegurarse de que no esté autenticado
            return response; // Retornar la respuesta original con el error (ej. status 401)
        }

        return response;
    } catch (error) {
        // Manejar errores de red o servidor, o errores lanzados por loginService/getUserInfo
        console.error("Error en signIn (AuthContext):", error);
        setIsAuthenticated(false); // Asegurarse de que no esté autenticado si hay un error
        // Si el error tiene una respuesta (ej. de Axios) y status, retornarlo.
        if (error.response) {
            return error.response;
        }
        // Si no, lanzar el error para que LoginPage lo maneje como un error inesperado
        throw error;
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
        setInfoUser,
        isAuthenticated,
        loading, // Exponemos el estado de carga
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}