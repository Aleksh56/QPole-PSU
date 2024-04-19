import { handleRequest } from '@/api/api';
import { createEffect } from 'effector';

export const sendTicketFx = createEffect(async ({ type, message }) => {
  const data = await handleRequest('post', `/api/my_support_requests/`, {
    ticket_type: type,
    text: message,
  });
});
