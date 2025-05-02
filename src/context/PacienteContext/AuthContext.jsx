import { createContext, useContext, useState, useEffect } from "react";
import { registerRequest } from "../../services/AuthService"

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
            return res.data.message;
        } catch (error) {
            console.log(error)
            if(error.status === 400){
                throw new Error(error.response.data.error)
            }
        }
    }
    return (
        <AuthContext.Provider value={{
            signup,
            user
        }}>
            {children}
        </AuthContext.Provider>
    )
}