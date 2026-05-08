import axiosInstance from './axiosConfig';

export const fetchMedicaments = async () => {
  const response = await axiosInstance.get('/medicaments/');
  return response.data.results || response.data;
};

export const fetchAlertes = async () => {
  const response = await axiosInstance.get('/medicaments/alertes/');
  return response.data;
};

export const createMedicament = async (data) => {
  const response = await axiosInstance.post('/medicaments/', data);
  return response.data;
};
    