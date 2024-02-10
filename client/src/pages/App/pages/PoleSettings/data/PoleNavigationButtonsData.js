import SettingsIcon from '@mui/icons-material/Settings';
import ResultsIcon from '@mui/icons-material/BarChart';
import QuestionsIcon from '@mui/icons-material/HelpOutline';
import IntegrationIcon from '@mui/icons-material/SettingsEthernet';
import PublishIcon from '@mui/icons-material/Public';
import PoleMainSettingsPage from '../../Pole/PoleMainSettings';

export const poleNavigationButtonsData = [
  {
    icon: SettingsIcon,
    label: 'Основное',
    page: 'main',
    component: PoleMainSettingsPage,
  },
  { icon: ResultsIcon, label: 'Результаты', page: 'results', component: '2' },
  { icon: QuestionsIcon, label: 'Вопросы', page: 'questions', component: '3' },
  {
    icon: IntegrationIcon,
    label: 'Интеграции',
    page: 'integrations',
    component: '4',
  },
  { icon: PublishIcon, label: 'Публикация', page: 'publish', component: '5' },
];
