import axios from 'axios';

import { handleRequest } from '@/api/api';
import config from '@/config';

const timeouts = {};

export const getInfoAboutPole = async (id) => {
  return handleRequest('get', `/api/my_poll/?poll_id=${id}`);
};

export const changePoleData = async (field, value, id, fetchPoleData, showAlert) => {
  if (timeouts[field]) {
    clearTimeout(timeouts[field]);
  }

  if (field === 'image') {
    axios.patch(
      `${config.serverUrl.main}/api/my_poll/?poll_id=${id}`,
      { [field]: value },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token') ?? ''}`,
          'content-type': 'multipart/form-data',
        },
      },
    );
  }

  timeouts[field] = setTimeout(() => {
    handleRequest(
      'patch',
      `/api/my_poll${field === 'start_time' || field === 'end_time' || field === 'duration' ? '_settings' : ''}/?poll_id=${id}`,
      { [field]: value },
    ).then(() =>
      fetchPoleData().then(() => {
        showAlert('Данные об опросе успешно сохранены !', 'success');
      }),
    );
    delete timeouts[field];
  }, 0);
};
