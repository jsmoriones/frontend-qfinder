import axios from "./axios";
import Cookies from 'js-cookie';

export const listMedications = async () => {
  try {
    const token = Cookies.get("token");
    const response = await axios.get(
      "/medicamentos/listar",
      token
    );

    return response;
  } catch (error) {
    console.log("Error al listar los medicamentos: ", error);
    return error;
  }
}

export const addMedication = async (data) => {
  try {
    console.log("Desde addMedication: ", data)
    const token = Cookies.get("token");
    const response = await axios.post(
      "/medicamentos/crear",
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );

    return response;
  } catch (error) {
    console.log("Error al agregar un medicamento: ", error);
    return error;
  }
}

export const editMedication = async (data, id) => {
  try {
    const token = Cookies.get("token");
    const response = await axios.put(
      `/medicamentos/actualizar/${id}`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );

    return response;
  } catch (error) {
    console.log("Error al agregar un medicamento: ", error);
    return error;
  }
}

export const removeMedication = async (id) => {
  try {
    const token = Cookies.get('token');
    const response = await axios.delete(
      `/medicamentos/eliminar/${id}`,
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