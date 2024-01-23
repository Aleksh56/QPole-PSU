import axios from 'axios';

const BASE_URL = `http://89.111.155.6`;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const handleRequest = async (requestFunction, successMessage) => {
  try {
    const response = await requestFunction();
    console.log(successMessage, response.data);
    return response.data;
  } catch (error) {
    console.error(`${successMessage} failed:`, error.request.response);
    throw error;
  }
};

export const registerUser = async (userData) => {
  return handleRequest(
    () => api.post('/login/register/', userData),
    'Registration'
  );
};

export const loginUser = async (userData) => {
  return handleRequest(() => api.post('/login/login/', userData), 'Login');
};
