import React, { useEffect, useState } from 'react';

import Settings from '@/components/Modals/settings';
import { ToolTip } from '@/components/ui/tooltip';
import DropDown from '@/components/Workspace/Playground/PreferenceNav/Dropdown';
import { Button } from '@nextui-org/react';
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
    <div className="flex items-center justify-between dark:bg-[#333] bg-[#fafafa] h-9 w-full rounded-t-md shadow-md">
      <div className="flex items-center text-white">
        <DropDown onLanguageSelect={onLanguageSelect} />
      </div>
      <div className="flex items-center relative justify-end mr-2">
        <ToolTip message="Settings">
          <Settings onFontSizeChange={onFontSizeChange} />
        </ToolTip>

        <Button
          isIconOnly
          aria-label="FullSreen"
          variant="light"
          className="w-7 h-7 rounded-sm text-lg hover:!bg-[#3a3a3a] "
          onClick={handleFullScreenToggle}>
          {!isFullScreen ? (
            <ToolTip message="Full Screen">
              <AiOutlineFullscreen className="text-purple-500" />
            </ToolTip>
          ) : (
            <AiOutlineFullscreenExit className="text-purple-500" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default PreferenceNav;
