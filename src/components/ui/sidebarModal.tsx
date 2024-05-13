import React from 'react';

import Link from 'next/link';

import { buttonVariants } from '@/components/ui';
import { SettingsNavItem as items } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { settingNav } from '@/types';

interface SidebarNavProps {
  setVariant: React.Dispatch<React.SetStateAction<settingNav>>;
  variant: settingNav;
}

const SettingsNav: React.FC<SidebarNavProps> = ({ setVariant, variant }) => {
  const toggle = (path: settingNav) => {
    setVariant(path);
  };

  return (
    <nav className={cn('flex flex-col space-x-0 space-y-1')}>
      {items.map(item => (
        <Link
          onClick={() => toggle(item.href)}
          key={item.href}
          href={`#${item.href}`}
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            variant === item.href
              ? 'bg-muted hover:bg-muted'
              : 'hover:bg-transparent hover:underline',
            'justify-start',
          )}>
          {item.title}
        </Link>
      ))}
    </nav>
  );
};

export default SettingsNav;
