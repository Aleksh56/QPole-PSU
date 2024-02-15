import axios from 'axios';

const BASE_URL = `http://89.111.155.6`;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Token ${localStorage.getItem('auth_token') ?? ''}`,
  },
});

export const handleRequest = async (method, url, data, successMessage) => {
  try {
    const response = await api[method](url, data);
    // ToDo - Delete
    console.log(successMessage, response);
    return { data: response.data, ok: true };
  } catch (error) {
    // ToDo - Rewrite to Notification Snackbar
    console.error(`${successMessage} failed:`, error?.response?.data || error.message);
    throw error;
  }
};

export const registerUser = (userData) => {
  return handleRequest('post', '/login/register/', userData, 'Registration');
};

export const loginUser = (userData) => {
  return handleRequest('post', '/login/login/', userData, 'Login');
};

export const sendResetPasswordCode = async (userEmail) => {
  return handleRequest('post', '/login/send_reset_code/', userEmail, 'Send_reset_code');
};

export const checkResetPasswordCode = async (resetCode) => {
  return handleRequest('post', '/login/check_reset_code/', resetCode, 'Check_reset_code');
};

export const resetPasswordRequest = async (newUserPasswordData) => {
  return handleRequest(
    'post',
    '/login/reset_password/',
    newUserPasswordData,
    'Reset_password_request'
  );
};
