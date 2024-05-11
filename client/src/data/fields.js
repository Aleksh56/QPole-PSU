import LinearScaleOutlinedIcon from '@mui/icons-material/LinearScaleOutlined';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PortraitOutlinedIcon from '@mui/icons-material/PortraitOutlined';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import QuizIcon from '@mui/icons-material/Quiz';

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
    ],
  },
  {
    heading: 'Настройки результатов',
    switchSettings: [
      {
        id: 'is_revote_allowed',
        label: 'Разрешить повторное прохождение теста',
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

export const shareButtons = [
  {
    caption: 'QR-код',
    view: 'qr',
    description: 'Скачайте рисунок с QR-кодом вашего опроса',
    icon: QrCode2Icon,
  },
  {
    caption: 'Email приглашения',
    view: 'email',
    description: 'Пригласите участников опроса',
    icon: MailOutlineIcon,
  },
];

export const pollResTableFlds = [
  { caption: 'Количество баллов (правильных ответов)', field: 'correct' },
  { caption: 'Максимальное количество баллов', field: 'total' },
  { caption: 'Процент', field: 'percentage' },
];

export const admSupportTableCols = [
  { caption: 'ID', key: 'id' },
  // { caption: 'ФИО', key: 'author', render: (author) => <span>{author.name}</span> ?? '-' },
  { caption: 'Email', key: 'author', render: (author) => <span>{author.email}</span> ?? '-' },
  { caption: 'Сообщение', key: 'text' },
  // { caption: 'Дата обращения', key: 'created_date' },
  {
    caption: 'Просмотрено',
    key: 'is_seen',
    render: (is_seen) =>
      (
        <span
          style={{
            color: !is_seen ? '#EF3826' : '#00B69B',
            backgroundColor: !is_seen ? 'rgba(239, 56, 38, .2)' : 'rgba(0, 182, 155, .3)',
            padding: '6px 16px',
            borderRadius: '5px',
            fontWeight: 500,
          }}
        >
          {is_seen ? 'Просмотрено' : 'Не просмотрено'}
        </span>
      ) ?? '-',
  },
  {
    caption: 'Статус',
    key: 'is_closed',
    render: (is_closed) =>
      (
        <span
          style={{
            color: !is_closed ? '#EF3826' : '#00B69B',
            backgroundColor: !is_closed ? 'rgba(239, 56, 38, .2)' : 'rgba(0, 182, 155, .3)',
            padding: '6px 16px',
            borderRadius: '5px',
            fontWeight: 500,
          }}
        >
          {is_closed ? 'Закрыта' : 'Открыта'}
        </span>
      ) ?? '-',
  },
  { caption: 'Дата закрытия', key: 'is_closed_date' },
];

export const surveyTypesData = [
  {
    image: QuizIcon,
    title: 'Тест викторина',
    type: 'Викторина',
    caption: 'Есть правильные и неправильные ответы. Считается кол-во баллов',
  },
  {
    image: PortraitOutlinedIcon,
    title: 'Анонимный опрос',
    type: 'Анонимный',
    caption: 'Нет правильных ответов. Результаты привязываются к вариантам ответов',
  },
  {
    image: LinearScaleOutlinedIcon,
    title: 'Квиз опросник',
    type: 'Опрос',
    caption: 'Возможность ветвления и начисление баллов за определенные ответы',
  },
];

export const surveySettings = {
  title: 'Вы не создали ни одного теста или опроса',
  description: 'Вы можете сразу приступить к созданию своего первого теста',
  buttonCaption: 'Создать новый опрос',
  survey: {
    popUpTitle: 'Выберите тип создаваемого опроса',
    surveyButtons: [...surveyTypesData],
  },
};

export const pollAdminSettings = [
  {
    caption: 'Максимальное количество вопросов',
    label: 'Введите количество',
    link: 'max_questions_quantity',
  },
  {
    caption: 'Минимальное количество вопросов',
    label: 'Введите количество',
    link: 'min_questions_quantity',
  },
  {
    caption: 'Максимальное количество ответов в вопросе',
    label: 'Введите количество',
    link: 'max_question_options_quantity',
  },
  {
    caption: 'Минимальное количество ответов в вопросе',
    label: 'Введите количество',
    link: 'min_question_options_quantity',
  },
  {
    caption: 'Максимальное количество повторных прохождений',
    label: 'Введите количество',
    link: 'max_users_polls_quantity',
  },
  {
    caption: 'Максимальное количество опросов у пользователя',
    label: 'Введите количество',
    link: 'max_revotes_quantity',
  },
];
