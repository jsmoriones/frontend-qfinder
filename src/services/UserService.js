import axios from "./axios";
import Cookies from 'js-cookie';

export const getUsers = async (page) => {
  try {
    const token = Cookies.get('login');
    console.log("getUsers: ", token)
    const response = await axios.get(
      `/auth/listarUsuarios?page=${page}`,
      token
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
      token
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
      token
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
      token
    )
    return response;
  } catch (error) {
    return error;
  }
}

export const actualizarPerfilAdmin = async (data, id) => {
  try {
    console.log("actualizarPerfilAdmin: ", data, " ", id)
    const token = Cookies.get('login');
    console.log("actualizarPerfilAdmin: ", token)
    const response = await axios.put(
      `/auth/actualizarPerfilAdmin`,
      data,
      token
    )
    return response;
  } catch (error) {
    return error;
  }
}

export const buscarUsuario = async (data) => {
  try {
    const token = Cookies.get('login');
    //console.log("buscarUsuario: ", token)
    console.log("buscarUsuario: ",data)
    const response = await axios.post(
      `/auth/buscarUsuario`,
      data,
      token
    )
    return response
  } catch (error) {
    console.log(error)
  }
}

export const listarAdmin = async (page) => {
  try {
    const token = Cookies.get('login');
    console.log("listarAdmin: ", token)
    const response = await axios.get(
      `/auth/listarAdmin?page=${page}`,
      token
    )
    return response
  } catch (error) {
    console.log(error)
  }
}