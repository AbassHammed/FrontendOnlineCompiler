import React from 'react';

import { AlertDialog, AlertDialogContent, AlertDialogTrigger, SettingsNav } from '@/components/ui';
import { settingNav } from '@/types';
import { Settings as SettingsIcon } from 'lucide-react';

export const EDITOR_FONT_SIZES = ['12px', '13px', '14px', '15px', '16px', '17px', '18px'];

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
      <AlertDialogContent className="p-0 m-0">
        <div className="pb-5 px-2 md:block rounded-lg  light:bg-white">
          <div>
            <h2 className="text-2xl tracking-tight px-4 pt-4">Settings</h2>
          </div>
          <div className="flex flex-col lg:flex-row lg:space-x-12 lg:space-y-0">
            <aside className="p-2 lg:w-1/5">
              <SettingsNav variant={variant} setVariant={setVariant} />
            </aside>
            <div className="flex-1 lg:max-w-2xl"></div>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
export default Settings;
