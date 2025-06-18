import axios from "./axios";
import Cookies from 'js-cookie';

export const estadisticas = async () => {
    try {
        const token = Cookies.get('login');
        const response = await axios.get(
        `/estadisticas`,
            token
        );
        return response
    } catch (error) {
        console.log(error)
        return error;
    }
}