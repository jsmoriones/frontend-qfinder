import axios from "./axios";
import Cookies from 'js-cookie';

export const getUsers = async () => {
  try {
    const token = Cookies.get('token');
    console.log("getUsers: ", token)
    const response = await axios.get(
      `/auth/listarUsuarios`,
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