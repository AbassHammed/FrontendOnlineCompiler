import React, { useEffect, useState } from 'react';

import DropDown from '@/components/Buttons/Dropdown';
import SettingsModal from '@/components/Modals/SettingsModal';
import { AiOutlineFullscreen, AiOutlineFullscreenExit, AiOutlineSetting } from 'react-icons/ai';

import { ISettings } from '../Playground';

type PreferenceNavProps = {
  settings: ISettings;
  setSettings: React.Dispatch<React.SetStateAction<ISettings>>;
  onLanguageSelect: (language: string) => void;
};

const PreferenceNav = ({ onLanguageSelect, setSettings, settings }: PreferenceNavProps) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleFullScreenToggle = () => {
    if (isFullScreen) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
    setIsFullScreen(!isFullScreen);
  };

  useEffect(() => {
    const exitHandler = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', exitHandler);
    document.addEventListener('webkitfullscreenchange', exitHandler);
    document.addEventListener('mozfullscreenchange', exitHandler);
    document.addEventListener('MSFullscreenChange', exitHandler);

    return () => {
      document.removeEventListener('fullscreenchange', exitHandler);
      document.removeEventListener('webkitfullscreenchange', exitHandler);
      document.removeEventListener('mozfullscreenchange', exitHandler);
      document.removeEventListener('MSFullscreenChange', exitHandler);
    };
  }, []);

  return (
    <div className="flex items-center justify-between bg-[#303030] h-9 w-full rounded-t-lg shadow-md">
      <div className="flex items-center text-white">
        <DropDown onLanguageSelect={onLanguageSelect} />
      </div>
      <div className="flex items-center m-1 relative">
        <button
          className="relative flex group rounded px-3 py-1.5 font-medium items-center justify-center transition-all focus:outline-none hover:bg-dark-fill-3"
          onClick={() => setSettings({ ...settings, settingsModalIsOpen: true })}>
          <div className="h-4 w-4 text-dark-gray-6 font-bold text-lg">
            <AiOutlineSetting className="text-purple-500" />
          </div>
          <div className="absolute top-8 left-2/4 -translate-x-2/4 border border-default-200 bg-gradient-to-br from-default-100 to-default-50 p-2 rounded shadow-lg z-40 group-hover:scale-100 scale-0 transition-all duration-300 ease-in-out !whitespace-nowrap">
            <p className="text-sm text-dark-gray-7">Settings</p>
          </div>
        </button>

        <button
          className="flex rounded px-3 py-1.5 font-medium items-center justify-center transition-all focus:outline-none hover:bg-dark-fill-3"
          onClick={handleFullScreenToggle}>
          <div className="h-4 w-4 text-dark-gray-6 font-bold text-lg">
            {!isFullScreen ? (
              <AiOutlineFullscreen className="text-purple-500" />
            ) : (
              <AiOutlineFullscreenExit className="text-purple-500" />
            )}
          </div>
        </button>
      </div>
      {settings.settingsModalIsOpen && (
        <SettingsModal settings={settings} setSettings={setSettings} />
      )}
    </div>
  );
};

export default PreferenceNav;
