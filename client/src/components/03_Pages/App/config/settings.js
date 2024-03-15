import { surveyTypesData } from '../data/SurveyTypesData';

export const _settings = {
  title: 'Вы не создали ни одного теста или опроса',
  description: 'Вы можете сразу приступить к созданию своего первого теста',
  buttonCaption: 'Создать новый опрос',
  survey: {
    popUpTitle: 'Выберите тип создаваемого опроса',
    surveyButtons: [...surveyTypesData],
  },
};
