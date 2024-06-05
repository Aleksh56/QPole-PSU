import { createEffect } from 'effector';

import { handleRequest } from '@/api/api';
import { ENDPOINTS } from '@/api/api.constants';

export const sendTicketFx = createEffect(async ({ type, message }) => {
  await handleRequest('post', `${ENDPOINTS.SUPPORT.SEND_TICKET}/`, {
    ticket_type: type,
    text: message,
  });
});
