import React from 'react';

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

export const admUsrsFilterCategories = [
  { name: 'Сортировка по', options: ['Опция 1', 'Опция 2'] },
  { name: 'Тип опроса', options: ['Опрос 1', 'Опрос 2'] },
  { name: 'Статус', options: ['Активный', 'Неактивный'] },
  { name: 'Группа', options: ['Группа 1', 'Группа 2'] },
];
