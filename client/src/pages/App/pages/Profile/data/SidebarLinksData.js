import HomeIcon from '@mui/icons-material/Home';
import BarChartIcon from '@mui/icons-material/BarChart';
import PeopleIcon from '@mui/icons-material/People';

export const SidebarLinksData = [
  {
    caption: 'Профиль',
    icon: HomeIcon,
    to: '/app/profile',
  },
  {
    caption: 'Статистика',
    icon: BarChartIcon,
    to: '/app/profile/statistics',
  },
  {
    caption: 'Участники',
    icon: PeopleIcon,
    to: '/app/profile/contributors',
  },
];
