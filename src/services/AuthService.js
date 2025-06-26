import axios from "./axios";

export const registerRequest = async (user) => axios.post(`/auth/register`, user)

export const verifyCount = async (data) =>{
    try {
        const response = await axios.post(`/auth/verify`, data)
        console.log("VerifyCount response: ", response);
        return response;
    } catch (error) {
        console.log(error)
        if(error.status === 400){
            throw new Error(error.response.data.error)
        }
    }
}


export const getUserInfo = async () => {
    try {
        const response = await axios.get("/auth/perfilAdmin");

        return response;
    } catch (error) {
        console.log("Error al obtener datos de usuario: ", error);
    }
}


export const loginService = async (data) => {
    try {
        const response = await axios.post("/auth/login", data);
        console.log("Response Login: ", response);
        return response;
    } catch (error) {
        console.log(error)
        if(error.status === 401){
            throw new Error(error.response.data.error)
        }
    }
}

/** Service para recuperar contraseña */

export const recuperarW = async (data) => {
    try {
        const response = await axios.post("/auth/recuperarW", data);
        console.log("recuperarW: ", response);
        return response;
    } catch (error) {
        console.log(error)
        if(error.status === 404){
            throw new Error(error.response.data.mensaje)
        }
    }
}

export const verificarCodigoW = async (data) => {
    try {
        const response = await axios.post("/auth/verificar-codigoW", data);
        console.log("verificarCodigoW: ", response);
        return response;
    } catch (error) {
        console.log(error)
        if(error.status === 404){
            throw new Error(error.response.data.mensaje)
        }
    }
}

export const cambiarPasswordW = async (data) => {
    try {
        const response = await axios.post("/auth/cambiar-passwordW", data);
        console.log("cambiarPasswordW: ", response);
        return response;
    } catch (error) {
        console.log(error)
        if(error.status === 404){
            throw new Error(error.response.data.mensaje)
        }
    }
}