import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';

export const appHeaderData = [
  { caption: 'Ваши опросы', to: '/app', icon: DashboardIcon },
  { caption: 'Общедоступные опросы', to: '/polls', icon: GroupIcon },
];

export const commonHeaderLinksData = [
  { caption: 'Главная', to: '/' },
  // { caption: 'Опросы', to: '/polls' },
];

export const adminPanelSidebarLinks = [
  { id: 1, caption: 'Дэшборд', link: 'main' },
  { id: 2, caption: 'Пользователи', link: 'users' },
  { id: 2, caption: 'Обращения', link: 'support' },
  { id: 3, caption: 'Настройки', link: 'settings' },
];
