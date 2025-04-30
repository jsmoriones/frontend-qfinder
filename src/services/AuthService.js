import axios from "./axios";

export const registerRequest = async (user) =>
    axios.post(`/auth/register`, user)

export const verifyCount = async (data) =>
    axios.post(`/auth/verify`, data)