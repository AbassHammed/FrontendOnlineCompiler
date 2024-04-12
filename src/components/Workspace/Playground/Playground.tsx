import React, { useEffect, useMemo, useState } from 'react';

import useLocalStorage from '@/hooks/useLocalStorage';
import { cpp } from '@codemirror/lang-cpp';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import CodeMirror from '@uiw/react-codemirror';

import EditorFooter from './EditorFooter';
import PreferenceNav from './PreferenceNav/PreferenceNav';

export interface ISettings {
  fontSize: string;
  settingsModalIsOpen: boolean;
  dropdownIsOpen: boolean;
}

const Playground = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [fontSize, setFontSize] = useLocalStorage('lcc-fontSize', '16px');
  const [settings, setSettings] = useState({
    fontSize,
    settingsModalIsOpen: false,
    dropdownIsOpen: false,
  });
  const [selectedLanguage, setSelectedLanguage] = useState('C++');
  const [currentCode, setCurrentCode] = useState('');

  const languages = useMemo(
    () => ({
      JavaScript: {
        extension: javascript(),
        initialCode: 'console.log("Hello, JavaScript!");',
        fileExtension: '.js',
        backendIdentifier: 'javascript',
      },
      C: {
        extension: cpp(),
        initialCode: '#include <stdio.h>\nint main() {\n   printf("Hello, C!");\n   return 0;\n}',
        fileExtension: '.c',
        backendIdentifier: 'c',
      },
      'C++': {
        extension: cpp(),
        initialCode:
          '#include <iostream>\nint main() {\n    std::cout << "Hello, C++!";\n    return 0;\n}',
        fileExtension: '.cpp',
        backendIdentifier: 'cpp',
      },
      Python: {
        extension: python(),
        initialCode: 'print("Hello, Python!")',
        fileExtension: '.py',
        backendIdentifier: 'python',
      },
    }),
    [],
  );

  useEffect(() => {
    setCurrentCode(languages[selectedLanguage as keyof typeof languages].initialCode);
  }, [languages, selectedLanguage]);

  const handleLanguageSelect = (language: string) => setSelectedLanguage(language);

  const handleGenerate = () => {
    const fileExtension = languages[selectedLanguage as keyof typeof languages].fileExtension;
    const blob = new Blob([currentCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code${fileExtension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="flex flex-auto flex-col relative bg-[#0f0f0f] w-[55%] rounded-lg shadow-xl overflow-hidden px-2 mb-2">
      <PreferenceNav
        settings={settings}
        setSettings={setSettings}
        onLanguageSelect={handleLanguageSelect}
      />
      <div className="w-full overflow-auto bg-[#282828] rounded-b-lg shadow-xl select-none h-[calc(100vh-94px)]">
        <CodeMirror
          value={currentCode}
          onChange={setCurrentCode}
          theme={vscodeDark}
          extensions={[languages[selectedLanguage as keyof typeof languages].extension]}
          style={{ fontSize: settings.fontSize }}
        />
      </div>
      <EditorFooter handleGenerate={handleGenerate} />
    </div>
  );
};

export default Playground;
