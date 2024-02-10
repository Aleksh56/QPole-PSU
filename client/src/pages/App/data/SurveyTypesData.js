import QuizIcon from '@mui/icons-material/Quiz';
import PortraitOutlinedIcon from '@mui/icons-material/PortraitOutlined';
import LinearScaleOutlinedIcon from '@mui/icons-material/LinearScaleOutlined';

export const surveyTypesData = [
  {
    image: QuizIcon,
    title: 'Тест викторина',
    type: 'quiz',
    caption: 'Есть правильные и неправильные ответы. Считается кол-во баллов',
  },
  {
    image: PortraitOutlinedIcon,
    title: 'Личностный тест',
    type: 'personality',
    caption:
      'Нет правильных ответов. Результаты привязываются к вариантам ответов',
  },
  {
    image: LinearScaleOutlinedIcon,
    title: 'Квиз опросник',
    type: 'survey',
    caption: 'Возможность ветвления и начисление баллов за определенные ответы',
  },
];
