import React, { useEffect, useState } from 'react';

import { languages } from '@/lib/lang';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import CodeMirror from '@uiw/react-codemirror';

import EditorFooter from './EditorFooter';
import PreferenceNav from './PreferenceNav/PreferenceNav';

const Playground = () => {
  const [fontSize, setFontSize] = useState('13px');
  const [selectedLanguage, setSelectedLanguage] = useState('C++');
  const [currentCode, setCurrentCode] = useState('');

  useEffect(() => {
    setCurrentCode(languages[selectedLanguage as keyof typeof languages].initialCode);
  }, [selectedLanguage]);

  const handleLanguageSelect = (language: string) => setSelectedLanguage(language);
  const handleFontSizeChange = (fontSize: string) => setFontSize(fontSize);

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
    <div className="flex flex-auto flex-col relative bg-[#0f0f0f] w-[55%] rounded-md shadow-xl overflow-hidden mx-2 mb-2 ">
      <PreferenceNav
        onFontSizeChange={handleFontSizeChange}
        onLanguageSelect={handleLanguageSelect}
      />
      <div className="w-full overflow-auto bg-[#282828] rounded-b-lg shadow-xl select-none h-[calc(100vh-154px)]">
        <CodeMirror
          value={currentCode}
          onChange={setCurrentCode}
          theme={vscodeDark}
          extensions={[languages[selectedLanguage as keyof typeof languages].extension]}
          style={{ fontSize: fontSize }}
        />
      </div>
      <EditorFooter handleGenerate={handleGenerate} />
    </div>
  );
};

export default Playground;
