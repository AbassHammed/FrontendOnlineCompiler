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

export const EDITOR_FONT_SIZES = [
  '12px',
  '13px',
  '14px',
  '15px',
  '16px',
  '17px',
  '18px',
  '19px',
  '20px',
];
