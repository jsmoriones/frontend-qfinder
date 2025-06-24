import axios from "./axios";
import Cookies from 'js-cookie';

export const listarMembresiaW = async (id, pageNumber) => {
    try {
        const token = Cookies.get("login");
        const response = await axios.get(`/membresiaRed/listarMembresiaW/${id}?page=${pageNumber}`, token);
        console.log("Membresia response: ", response);
        return response;
    } catch (error) {
        console.log("Error al consultar la mebresia de redes: ", error);
        return error;
    }
}

export const eliminarMiembroW = async (idRed, idMiembro) => {
    try {
        const token = Cookies.get("login");
        const response = await axios.delete(`/membresiaRed/eliminarMiembroW/${idRed}/${idMiembro}`, token);
        console.log("Membresia response: ", response);
        return response;
    } catch (error) {
        console.log("Error al eliminar usuario de red: ", error);
        return error;
    }
}