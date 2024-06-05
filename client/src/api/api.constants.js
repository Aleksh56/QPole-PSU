import config from '@config';

export const API_URL = {
  MAIN: `${config.serverUrl.main}/`,
};

export const ENDPOINTS = {
  USER: {
    CHANGE_SELF_DATA: '/api/my_profile',
    // GET_SELF: `lk_api/user/`,
    // REGISTRATION: `lk_api/register`,
    // LOGIN: `lk_api/login`,
    // TOKEN_REFRESH: `lk_api/refresh`,
    // PASSWORD_RESET: `lk_api/reset-password`,
    // CREATE_PASSWORD: `lk_api/create-password`,
    // REQUEST_CODE: `lk_api/register/request-code`,
    // CONFIRM_CODE: `lk_api/register/confirm-code`,
  },
  ADMIN: {
    POLL_SETTINGS: '/admin_api/project_settings',
    USER_SETTINGS: '/admin_api/users',
    GET_TICKETS: '/admin_api/support_request',
  },
  SUPPORT: {
    SEND_TICKET: '/api/my_support_requests',
  },

  QUESTIONS: {
    BASE_URL: '/api/my_poll_question',
  },
  POLL: {
    BASE_URL: '/api/my_poll',
  },
};
