export const settings = [
  {
    heading: 'Настройки опроса',
    switchSettings: [
      { id: 'Hide votes', label: 'Скрыть количество проголосовавших', defaultChecked: false },
      { id: 'Hide percentage', label: 'Скрыть проценты у вариантов ответа', defaultChecked: false },
      { id: 'is_anonymous', label: 'Анонимное голосование', defaultChecked: false },
    ],
  },
  {
    heading: 'Настройки результатов',
    switchSettings: [
      {
        id: 'Disable 2nd chance',
        label: 'Запретить повторное прохождение теста',
        defaultChecked: false,
      },
    ],
  },
  {
    heading: 'Защита от списывания',
    switchSettings: [
      {
        id: 'Disable 2nd chance',
        label: 'Перемешивать вопросы',
        defaultChecked: false,
      },
      {
        id: 'Disable 2nd chance',
        label: 'Перемешивать варианты ответов',
        defaultChecked: false,
      },
    ],
  },
];
