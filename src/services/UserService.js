import axios from "./axios";
import Cookies from 'js-cookie';

export const getUsers = async (page) => {
  try {
    const token = Cookies.get('login');
    console.log("getUsers: ", token)
    const response = await axios.get(
      `/auth/listarUsuarios?page=${page}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    )
    return response
  } catch (error) {
    console.log(error)
  }
}

export const registerUser = async (data) => {
  try {
    const token = Cookies.get('login');
    console.log("getUsers: ", token)
    const response = await axios.post(
      `/auth/registrarUsuario`,
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

export const editUser = async (data, id) => {
  try {
    console.log("editUser: ", data, " ", id)
    const token = Cookies.get('login');
    console.log("getUsers: ", token)
    const response = await axios.put(
      `/auth/actualizarUsuario/${id}`,
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

export const removeUser = async (id) => {
  try {
    const token = Cookies.get('login');
    console.log("getUsers: ", token)
    const response = await axios.delete(
      `/auth/eliminarUsuario/${id}`,
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