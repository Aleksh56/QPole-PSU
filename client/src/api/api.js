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
    console.log(successMessage, response);
    return { data: response.data, ok: true };
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

export const sendResetPasswordCode = async (userEmail) => {
  return handleRequest(
    () => api.post('/login/send_reset_code/', userEmail),
    'Send_reset_code'
  );
};

export const checkResetPasswordCode = async (resetCode) => {
  return handleRequest(
    () => api.post('/login/check_reset_code/', resetCode),
    'Check_reset_code'
  );
};

export const resetPasswordRequest = async (newUserPasswordData) => {
  return handleRequest(
    () => api.post('/login/reset_password/', newUserPasswordData),
    'Reset_password_request'
  );
};
