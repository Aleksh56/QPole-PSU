import config from '@/config';
import axios from 'axios';

let isRefreshing = false;
let failedQueue = [];

const api = axios.create({
  baseURL: config.serverUrl.main,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(undefined, async (error) => {
  const originalRequest = error.config;
  if (error.response.status === 401 && !originalRequest._retry) {
    if (isRefreshing) {
      return new Promise(function (resolve, reject) {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return api(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    return new Promise((resolve, reject) => {
      refreshToken()
        .then(({ token }) => {
          localStorage.setItem('auth_token', token);
          api.defaults.headers.common['Authorization'] = 'Bearer ' + token;
          processQueue(null, token);
          resolve(api(originalRequest));
        })
        .catch((err) => {
          processQueue(err, null);
          reject(err);
        })
        .finally(() => {
          isRefreshing = false;
        });
    });
  }
  return Promise.reject(error);
});

const refreshToken = async () => {
  handleRequest('post', '/login/token/refresh/', {
    refresh_token: localStorage.getItem('refresh_token'),
  });
};

export const handleRequest = async (method, url, data, successMessage) => {
  try {
    const response = await api[method](url, data);
    console.log(successMessage, response);
    return { data: response.data, ok: true };
  } catch (error) {
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
