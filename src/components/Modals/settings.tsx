import React from 'react';

import { AlertDialog, AlertDialogContent, AlertDialogTrigger, SettingsNav } from '@/components/ui';
import { settingNav } from '@/types';
import { Settings as SettingsIcon } from 'lucide-react';

export const EDITOR_FONT_SIZES = ['12px', '13px', '14px', '15px', '16px', '17px', '18px'];

/**
 * Renders the Settings component.
 *
 * @return {ReactNode} The rendered Settings component
 */
const Settings: React.FC = () => {
  const [variant, setVariant] = React.useState<settingNav>('shortcut');

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          aria-label="Settings"
          className="rounded px-2 py-2 font-medium items-center whitespace-nowrap focus:outline-none inline-flex group dark:text-[#585c65] hover:bg-[#e7e7e7] dark:hover:bg-[#ffffff14]">
          <SettingsIcon className="h-[18px] w-[18px] dark:text-[#fff9] text-[#585c65] group-hover:text-black dark:group-hover:text-white" />
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent className="p-0 m-0 rounded-lg">
        <div className="flex overflow-hidden rounded-xl h-[460px]">
          <SettingsNav variant={variant} setVariant={setVariant} />
          <div className="flex-1 lg:max-w-2xl"></div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
export default Settings;
