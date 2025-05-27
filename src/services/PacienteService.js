import axios from "./axios";
import Cookies from 'js-cookie';

export const registerPatient = async (user) => {
  try {
    const token = Cookies.get('token');
    const response = await axios.post(
      `/paciente/register`,
      user,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjAsInJvbCI6IlVzdWFyaW8iLCJpYXQiOjE3NDgyNzkxOTEsImV4cCI6MTc0ODM2NTU5MX0.ka1lpLwj7YDD6akSIsePszr5hzZRPxd0IijwxCxpsJ4`
        }
      }
    )
    console.log(response)
  } catch (error) {
    console.log(error)
  }
}