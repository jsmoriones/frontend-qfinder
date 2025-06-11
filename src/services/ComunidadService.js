import axios from "./axios";
import Cookies from 'js-cookie';

export const getCommunity = async () => {
  try {
    const token = Cookies.get('login');
    console.log("getCommunity: ", token)
    const response = await axios.get(
      `/redes/listarRedes`,
      token
    )
    return response
  } catch (error) {
    console.log
    return error;
  }
}

export const createCommunity = async (data) => {
  try {
    const token = Cookies.get('login');
    console.log("createCommunity: ", token)
    const response = await axios.post(
      `/redes/crear`,
      data,
      token
    )
    return response;
  } catch (error) {
    return error;
  }
}

export const editCommunity = async (data, id) => {
  try {
    console.log("editCommunity: ", data, " ", id)
    const token = Cookies.get('login');
    const response = await axios.put(
      `/redes/actualizarRed/${id}`,
      data,
      token
    )
    return response;
  } catch (error) {
    return error;
  }
}