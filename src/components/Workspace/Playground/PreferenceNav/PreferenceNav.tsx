import React, { useState, useEffect } from 'react';
import { AiOutlineFullscreen, AiOutlineFullscreenExit, AiOutlineSetting } from "react-icons/ai";
import { ISettings } from '../Playground';
import SettingsModal from '@/components/Modals/SettingsModal';

type PreferenceNavProps = {
	settings: ISettings;
	setSettings: React.Dispatch<React.SetStateAction<ISettings>>;
	onLanguageSelect: (language: string) => void;
};
interface TooltipProps {
    show: boolean;
    children: string;
}

const Tooltip = ({ show, children }: TooltipProps) => (
    <div className={`absolute bottom-10 left-1/2 transform -translate-x-1/2 ${show ? 'block' : 'hidden'} bg-dark-layer-1 text-brand-purple p-2 rounded shadow-lg z-50`}>
        <p className="text-sm">{children}</p>
    </div>
);

const PreferenceNav = ({ onLanguageSelect, setSettings, settings  }: PreferenceNavProps) => {
    const [isFullScreen, setIsFullScreen] = useState(false);
	const [showTooltip, setShowTooltip] = useState<string | null>(null);
	const [selectedLanguage, setSelectedLanguage] = useState('JavaScript');

	const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newLanguage = event.target.value;
        setSelectedLanguage(newLanguage);
        onLanguageSelect(newLanguage);
    };

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

        document.addEventListener("fullscreenchange", exitHandler);
        document.addEventListener("webkitfullscreenchange", exitHandler);
        document.addEventListener("mozfullscreenchange", exitHandler);
        document.addEventListener("MSFullscreenChange", exitHandler);

        return () => {
            document.removeEventListener("fullscreenchange", exitHandler);
            document.removeEventListener("webkitfullscreenchange", exitHandler);
            document.removeEventListener("mozfullscreenchange", exitHandler);
            document.removeEventListener("MSFullscreenChange", exitHandler);
        };
    }, []);

    return (
        <div className="flex items-center justify-between bg-[#303030] h-9 w-full overflow-x-hidden rounded-t-lg shadow-md">
            <div className='flex items-center text-white'>
                <button className='flex cursor-pointer items-center rounded focus:outline-none bg-[#303030] text-dark-label-2 hover:bg-[#303030] px-2 py-1.5 font-medium'>
                    <div className='flex items-center pl-8 pr-4'>
                        <select value={selectedLanguage} onChange={handleLanguageChange} className="bg-[#303030] text-xs text-label-2 dark:text-dark-label-2">
                            <option value="JavaScript">JavaScript</option>
                            <option value="C">C</option>
                            <option value="C++">C++</option>
                            <option value="Python">Python</option>
                        </select>
                    </div>
                </button>
            </div>
            <div className='flex items-center m-1 relative'>
                <button
                    className='preferenceBtn'
					onClick={() => setSettings({ ...settings, settingsModalIsOpen: true })}
                    onMouseEnter={() => setShowTooltip('Settings')}
					onMouseLeave={() => setShowTooltip(null)}
                >
                    <div className='h-4 w-4 text-dark-gray-6 font-bold text-lg'>
                        <AiOutlineSetting />
                    </div>
                    <Tooltip show={showTooltip === 'Settings'}>Settings</Tooltip>
                </button>

                <button
                    className="preferenceBtn"
                    onClick={handleFullScreenToggle}
                    onMouseEnter={() => setShowTooltip('FullScreen')}
                    onMouseLeave={() => setShowTooltip(null)}
                >
                    <div className='h-4 w-4 text-dark-gray-6 font-bold text-lg'>
                        {!isFullScreen ? <AiOutlineFullscreen /> : <AiOutlineFullscreenExit />}
                    </div>
                    <Tooltip show={showTooltip === 'FullScreen'}>Full Screen</Tooltip>
                </button>
			</div>
			{settings.settingsModalIsOpen && <SettingsModal settings={settings} setSettings={setSettings} />}
        </div>
    );
}

export default PreferenceNav;
