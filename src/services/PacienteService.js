import axios from "./axios";
import Cookies from 'js-cookie';

export const listPatients = async () => {
  try {
    const token = Cookies.get("login");
    const response = await axios.get(
      "/paciente/todosPacientes",
      token
    );

    return response;
  } catch (error) {
    console.log("Error al listar los pacientes: ", error);
    return error;
  }
}

export const listAllUsers = async () => {
  try {
    const token = Cookies.get("login");
    const response = await axios.get(
      "/auth/listar",
      token
    );

    return response;
  } catch (error) {
    console.log("Error al listar los pacientes: ", error);
    return error;
  }
}

export const registerPatient = async (user) => {
  try {
    const token = Cookies.get('login');

    //get ide user
    const dataUser = localStorage.getItem("infoUser");
    const decodeDataUser = JSON.parse(dataUser);

    console.log("decodeDataUser: ", decodeDataUser);
    const response = await axios.post(
      `/paciente/registrarPaciente2`,
      user,
      token
    )
    console.log(response)
    return response
  } catch (error) {
    console.log(error)
    return error
  }
}

export const editPatient = async (user, id) => {
  try {
    const token = Cookies.get('login');
    const response = await axios.put(
      `/paciente/actualizarPaciente2/${id}`,
      user,
      token
    )
    console.log(response)
    return response
  } catch (error) {
    console.log(error)
    return error
  }
}

export const removePatient = async (id) => {
  try {
    const token = Cookies.get('login');
    console.log("getUsers: ", token)
    const response = await axios.delete(
      `/paciente/eliminarPaciente2/${id}`,
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