import i18n from 'i18next';
import { merge } from 'lodash';
import { initReactI18next } from 'react-i18next';

import ru_alert from './ru/ru.alert.json';
import ru_assits from './ru/ru.assist.json';
import ru_buttons from './ru/ru.buttons.json';
import ru_field from './ru/ru.field.json';
import ru_head from './ru/ru.head.json';

// const ru_notifications = merge(ru_alert);
const ru_controls = merge(ru_buttons, ru_assits, ru_field);

const ru_translation = merge(ru_alert, ru_controls, ru_head);

const resources = {
  en: { translation: ru_translation },
  ru: { translation: ru_translation },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'ru',
  fallbackLng: 'ru',

  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
