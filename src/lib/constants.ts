import { settingNav } from '@/types';
import { FaCode, FaKeyboard } from 'react-icons/fa';

export const SettingsNavItem: {
  href: settingNav;
  title: string;
  icon: typeof FaKeyboard;
}[] = [
  {
    href: 'shortcut',
    title: 'Shortcuts',
    icon: FaKeyboard,
  },
  {
    href: 'editor',
    title: 'Code Editor',
    icon: FaCode,
  },
];
