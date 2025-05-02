import axios from "./axios";

export const registerRequest = async (user) =>
    axios.post(`/auth/register`, user)

export const verifyCount = async (data) =>{
    try {
        const response = await axios.post(`/auth/verify`, data)
        console.log("VerifyCount response: ", response);
        return response;
    } catch (error) {
        console.log(error)
        if(error.status === 400){
            throw new Error(error.response.data.error)
        }
    }
}