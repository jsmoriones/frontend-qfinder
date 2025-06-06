import axios from "./axios";
import Cookies from 'js-cookie';

export const getCommunity = async () => {
  try {
    const token = Cookies.get('token');
    console.log("getCommunity: ", token)
    const response = await axios.get(
      `/redes/listarRedes`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    )
    return response
  } catch (error) {
    console.log
    return error;
  }
}

export const createCommunity = async (data) => {
  try {
    const token = Cookies.get('token');
    console.log("createCommunity: ", token)
    const response = await axios.post(
      `/redes/crear`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    )
    return response;
  } catch (error) {
    return error;
  }
}

export const editCommunity = async (data, id) => {
  try {
    console.log("editCommunity: ", data, " ", id)
    const token = Cookies.get('token');
    const response = await axios.put(
      `/redes/actualizarRed/${id}`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    )
    return response;
  } catch (error) {
    return error;
  }
}