import React, { useEffect, useState } from 'react';

import DropDown from '@/components/Buttons/Dropdown';
import Settings from '@/components/Modals/settings';
import { ToolTip } from '@/components/Tooltip';
import { AiOutlineFullscreen, AiOutlineFullscreenExit } from 'react-icons/ai';

interface PreferenceNavProps {
  onLanguageSelect: (language: string) => void;
  onFontSizeChange: (fontSize: string) => void;
}

const PreferenceNav: React.FC<PreferenceNavProps> = ({ onLanguageSelect, onFontSizeChange }) => {
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
      <div className="flex m-1 sticky top-0 right-0">
        <button className="relative flex group rounded px-3 py-1.5 font-medium items-center justify-center transition-all focus:outline-none hover:bg-dark-fill-3">
          <div className="h-4 w-4 font-bold text-lg">
            <ToolTip message="Settings">
              <Settings onFontSizeChange={onFontSizeChange} />
            </ToolTip>
          </div>
        </button>

        <button
          className="flex rounded px-3 py-1.5 font-medium items-center justify-center transition-all focus:outline-none hover:bg-dark-fill-3"
          onClick={handleFullScreenToggle}>
          <div className="h-4 w-4 font-bold text-lg">
            {!isFullScreen ? (
              <ToolTip message="Full Screen">
                <AiOutlineFullscreen className="text-purple-500" />
              </ToolTip>
            ) : (
              <AiOutlineFullscreenExit className="text-purple-500" />
            )}
          </div>
        </button>
      </div>
    </div>
  );
};

export default PreferenceNav;
