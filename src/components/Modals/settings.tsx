import React from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui';
import { Settings as SettingsIcon } from 'lucide-react';

export const EDITOR_FONT_SIZES = ['12px', '13px', '14px', '15px', '16px', '17px', '18px'];

const Settings: React.FC = () => (
  <AlertDialog>
    <AlertDialogTrigger asChild>
      <div className="flex items-center justify-center cursor-pointer text-[#737373] hover:bg-[#e7e7e7] dark:hover:bg-dark-fill-3 rounded-lg p-2">
        <div className="relative text-[16px] leading-[normal] before:block before:h-4 before:w-4">
          <SettingsIcon className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4 text-[#737373] dark:text-[#737373] group-hover:text-gray-7 dark:group-hover:text-dark-gray-7" />
        </div>
      </div>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete your account and remove your
          data from our servers.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction>Continue</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);
export default Settings;
