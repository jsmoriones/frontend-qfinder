import { createContext, useContext, useState, useEffect } from "react";
import Cookies from 'js-cookie';
import { loginService, registerRequest } from "../../services/AuthService"

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
  const [loading, setLoading] = useState(true); // Nuevo estado para la carga inicial

  useEffect(() => {
    const token = Cookies.get("token");
    console.log("Token obtenido de la cookie:", token);
    console.log("Cookies (objeto):", Cookies);

    setIsAuthenticated(!!token);
    setUser(token || null);

    const storedInfoUser = localStorage.getItem("infoUser");
    if (storedInfoUser) {
      try {
        setInfoUser(JSON.parse(storedInfoUser));
      } catch (error) {
        console.error("Error al parsear infoUser de localStorage:", error);
        localStorage.removeItem("infoUser");
      }
    }
    setLoading(false); // La carga inicial ha terminado
  }, []);

  useEffect(() => {
    if (user) {
      console.log(user);
      localStorage.setItem("user", user);
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem("user");
    }

    if (infoUser) {
      const encodeInfoUser = JSON.stringify(infoUser);
      localStorage.setItem("infoUser", encodeInfoUser);
    } else {
      localStorage.removeItem("infoUser");
    }
  }, [user, infoUser]);

  const signup = async (user) => {
    try {
      const res = await registerRequest(user);
      console.log("signup: ", res.data.user);
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
      setIsAuthenticated(true);
      setInfoUser({ ...response.data, token: null });
      return response;
    } catch (error) {
      if (error.status !== 200 && error.status !== 201) {
        throw new Error(error.response.data.error);
      }
    }
  };

  const logout = () => {
    Cookies.remove("token");
    localStorage.removeItem("infoUser");
    setUser(null);
    setIsAuthenticated(false);
    setInfoUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        signup,
        signIn,
        logout,
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