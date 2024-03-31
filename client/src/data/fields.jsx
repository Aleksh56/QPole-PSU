import React from 'react';
import BlockIcon from '@mui/icons-material/Block';
import SettingsIcon from '@mui/icons-material/Settings';

export const appHeaderData = [
  { caption: 'Ваши опросы', to: '/app' },
  { caption: 'Общедоступные опросы', to: '/polls' },
];

export const commonHeaderLinksData = [
  { caption: 'Главная', to: '/' },
  { caption: 'Опросы', to: '/polls' },
];

export const appTypesFilter = [
  { value: 'Все типы', label: 'Все типы' },
  { value: 'Опрос', label: 'Опрос' },
  { value: 'Викторина', label: 'Викторина' },
];

export const appStatusesFilter = [
  { value: 'Все статусы', label: 'Все статусы' },
  { value: '0', label: 'Открытые' },
  { value: '1', label: 'Закрытые' },
];

export const appGroupsFilter = [
  { value: 'Для всех', label: 'Для всех' },
  { value: 'Group 2', label: 'Group 2' },
  { value: 'Group 3', label: 'Group 3' },
];

export const appFilterOptions = [
  { label: 'Тип', name: 'poll_type', options: appTypesFilter },
  { label: 'Статус', name: 'is_closed', options: appStatusesFilter },
  { label: 'Группа', name: 'group', options: appGroupsFilter },
];

export const servicesCardsData = [
  {
    caption: 'Изучение клиентского опыта',
    buttons: [
      'Анализ конкурентов',
      'Изучение потребностей покупателя',
      'Сбор обратной связи',
      'Оценка уровня лояльности',
    ],
  },
  {
    caption: 'Анализ продукта',
    buttons: [
      'Оценка логотипа, макетов, дизайна упаковок',
      'UX-тестирование',
      'Сравнение с конкурентами',
    ],
  },
  {
    caption: 'Проверка гипотез',
    buttons: ['Тестирование концептов', 'CustDev', 'Изучение спроса'],
  },
  {
    caption: 'Маркетинговые исследования',
    buttons: [
      'Исследование рынка',
      'Проверка креативов',
      'Оценка эффективности рекламных кампаний',
      'Изучение ЦА',
      'Измерения уровня знания бренда',
    ],
  },
  {
    caption: 'Работа с персоналом',
    buttons: [
      'Оценка удовлетворенности сотрудников',
      'Аттестация персонала',
      'Сбор обратной связи',
      'Тестирование персонала',
      'Опросы сотрудников',
    ],
  },
  {
    caption: 'Образовательные учреждения',
    buttons: [
      'Психологические тестировния',
      'Исследование целей и ценностей обучающихся',
      'Тестирование учащихся',
      'Оценка качества знаний',
    ],
  },
];

export const pollDesignFieldData = [
  { label: 'Основной цвет', name: 'primaryColor' },
  { label: 'Цвет кнопок', name: 'buttonColor' },
  { label: 'Цвет текста кнопок', name: 'buttonTextColor' },
];

export const pollTuningSettings = [
  {
    heading: 'Настройки опроса',
    switchSettings: [
      {
        id: 'hide_participants_quantity',
        label: 'Скрыть количество проголосовавших',
        defaultChecked: false,
      },
      {
        id: 'hide_options_percentage',
        label: 'Скрыть проценты у вариантов ответа',
        defaultChecked: false,
      },
      { id: 'is_anonymous', label: 'Анонимное голосование', defaultChecked: false },
      { id: 'has_multiple_choices', label: 'Множественный выбор в вопросе', defaultChecked: false },
    ],
  },
  {
    heading: 'Настройки результатов',
    switchSettings: [
      {
        id: 'can_cancel_vote',
        label: 'Запретить повторное прохождение теста',
        defaultChecked: false,
      },
    ],
  },
  {
    heading: 'Защита от списывания',
    switchSettings: [
      {
        id: 'mix_questions',
        label: 'Перемешивать вопросы',
        defaultChecked: false,
      },
      {
        id: 'mix_options',
        label: 'Перемешивать варианты ответов',
        defaultChecked: false,
      },
    ],
  },
];

export const getAdminUsersTableColumns = (handleBlockUser, handleChangeStatus) => [
  { id: 1, key: 'id', caption: 'ID' },
  { id: 2, key: 'name', caption: 'Имя', render: (name) => name ?? '-' },
  { id: 3, key: 'email', caption: 'Email' },
  { id: 4, key: 'role', caption: 'Роль', render: (role) => role ?? '-' },
  {
    id: 5,
    key: 'is_banned',
    caption: 'Статус',
    render: (isBanned) => (
      <span
        style={{
          color: isBanned ? '#EF3826' : '#00B69B',
          backgroundColor: isBanned ? 'rgba(239, 56, 38, .2)' : 'rgba(0, 182, 155, .3)',
          padding: '6px 16px',
          borderRadius: '5px',
          fontWeight: 500,
        }}
      >
        {isBanned ? 'Заблокирован' : 'Активен'}
      </span>
    ),
  },
  {
    id: 6,
    key: 'actions',
    caption: 'Действия',
    render: (_, user) => (
      <>
        <BlockIcon
          onClick={() => handleBlockUser(user.id)}
          color="error"
          sx={{ cursor: 'pointer' }}
        />
        <SettingsIcon
          onClick={() => handleChangeStatus(user.id)}
          sx={{ ml: 1, cursor: 'pointer' }}
        />
      </>
    ),
  },
];
