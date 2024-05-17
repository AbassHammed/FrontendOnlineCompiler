import React from 'react';

import { buttonVariants } from '@/components/ui';
import { SettingsNavItem as items } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { settingNav } from '@/types';

interface SidebarNavProps {
  setVariant: React.Dispatch<React.SetStateAction<settingNav>>;
  variant: settingNav;
}

/**
 * Renders the SettingsNav component with a list of settings items.
 * @param {SidebarNavProps} setVariant - Function to set the variant of settings
 * @return {JSX.Element} The rendered SettingsNav component
 */
const SettingsNav: React.FC<SidebarNavProps> = ({
  setVariant,
  variant,
}: SidebarNavProps): JSX.Element => {
  const toggle = (path: settingNav) => {
    setVariant(path);
  };

  return (
    <div className="bg-[#0000000a] p-4 dark:bg-[#262626]">
      <h2 className="mb-4 text-lg font-medium">Settings</h2>
      <div className="flex flex-col gap-2">
        {items.map(item => (
          <button
            onClick={() => toggle(item.href)}
            key={item.href}
            className={cn(
              buttonVariants({ variant: 'ghost' }),
              variant === item.href
                ? 'bg-sd-accent text-sd-accent-foreground hover:bg-sd-accent hover:text-sd-accent-foreground fill-sd-accent-foreground'
                : 'hover:bg-sd-accent hover:text-sd-accent-foreground fill-sd-muted-foreground',
              'relative inline-flex items-center text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sd-ring disabled:pointer-events-none disabled:opacity-50 h-9 rounded-sd-md text-sd-muted-foreground justify-start px-3 py-[10px]',
            )}>
            <item.icon
              className={cn(
                'mr-2 h-4 w-4',
                variant === item.href ? 'fill-sd-accent-foreground' : 'fill-sd-muted-foreground',
              )}
            />
            <span
              className={cn(
                variant === item.href ? 'fill-sd-accent-foreground' : 'fill-sd-muted-foreground',
              )}>
              {item.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SettingsNav;
