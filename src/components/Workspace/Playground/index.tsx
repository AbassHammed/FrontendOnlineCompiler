import React, { useEffect, useState } from 'react';

import { languages } from '@/lib/lang';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import CodeMirror from '@uiw/react-codemirror';

import EditorFooter from './EditorFooter';
import PreferenceNav from './PreferenceNav';

const Playground = () => {
  const [fontSize, setFontSize] = useState(localStorage.getItem('lcc-fontSize') || '13px');
  const [selectedLanguage, setSelectedLanguage] = useState(
    sessionStorage.getItem('language') || 'C++',
  );
  const [currentCode, setCurrentCode] = useState(
    sessionStorage.getItem('code') ||
      languages[selectedLanguage as keyof typeof languages].initialCode,
  );

  useEffect(() => {
    sessionStorage.setItem('language', selectedLanguage);
    sessionStorage.setItem('code', currentCode);
  }, [selectedLanguage, currentCode]);

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
    setCurrentCode(languages[language as keyof typeof languages].initialCode);
  };

  const handleFontSizeChange = (fontSize: string) => {
    localStorage.setItem('lcc-fontSize', fontSize);
    setFontSize(fontSize);
  };

  const handleGenerate = () => {
    const fileExtension = languages[selectedLanguage as keyof typeof languages].fileExtension;
    const blob = new Blob([currentCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `main${fileExtension}`;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="flex flex-auto flex-col relative w-[55%] rounded-md shadow-xl overflow-hidden mx-2 mb-2">
      <PreferenceNav
        onFontSizeChange={handleFontSizeChange}
        onLanguageSelect={handleLanguageSelect}
      />
      <div className="w-full overflow-auto bg-[#262626] rounded-b-lg shadow-xl select-none h-[calc(100vh-154px)]">
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
