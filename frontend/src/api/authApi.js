import axiosInstance from './axiosConfig';

export const loginUser = async (credentials) => {
    const response = await axiosInstance.post('/token/', credentials);
    return response.data;
};

export const registerUser = async (userData) => {
    const response = await axiosInstance.post('/register/', userData);
    return response.data;
};