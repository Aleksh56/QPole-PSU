export const settings = [
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
