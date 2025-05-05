import { createContext, useContext, useState, useEffect } from "react";
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
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    //Cuando se monta el componente, obtengo lo que este en localstorage y lo guardo en la variable de estado user
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      }, []);

      //Cada que cambia el valor de  la variable user y si hay cambio  guardo en localstorage el valor de user
      useEffect(() => {
        if (user) {
          localStorage.setItem("user", JSON.stringify(user));
        } else {
          localStorage.removeItem("user");
        }
      }, [user]);

    const signup = async (user) => {
        try {
            const res = await registerRequest(user);
            setUser(res.data.user);
            setIsAuthenticated(true);
            return res.data.message;
        } catch (error) {
            console.log(error)
            if(error.status === 400){
                throw new Error(error.response.data.error)
            }
        }
    }

    const signIn = async (user) => {
        try {
            const response = await  loginService(user);
            setIsAuthenticated(true);
            return response;
        } catch (error) {
            if(error.status !== 200  || error.status !== 201){
                throw new Error(error.response.data.error)
            }
        }
    }

    return (
        <AuthContext.Provider value={{
            signup,
            signIn,
            user,
            isAuthenticated
        }}>
            {children}
        </AuthContext.Provider>
    )
}