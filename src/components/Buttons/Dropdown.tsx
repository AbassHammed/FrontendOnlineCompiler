import React, { useState } from 'react';

import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react';

interface LanguageOption {
  id: string;
  name: string;
}

const languages: LanguageOption[] = [
  { id: '1', name: 'C++' },
  { id: '2', name: 'Python' },
  { id: '3', name: 'JavaScript' },
  { id: '4', name: 'C' },
  { id: '5', name: 'Java' },
  { id: '6', name: 'Ruby' },
  { id: '7', name: 'Go' },
  { id: '8', name: 'Rust' },
  { id: '9', name: 'TypeScript' },
  { id: '10', name: 'PHP' },
  { id: '11', name: 'Swift' },
  { id: '12', name: 'Kotlin' },
  { id: '13', name: 'C#' },
  { id: '14', name: 'Scala' },
  { id: '15', name: 'Perl' },
  { id: '16', name: 'Haskell' },
  { id: '17', name: 'Lua' },
  { id: '18', name: 'R' },
  { id: '19', name: 'Dart' },
];

interface DropDownProps {
  onLanguageSelect: (language: string) => void;
}

const DropDown: React.FC<DropDownProps> = ({ onLanguageSelect }) => {
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageOption>(languages[0]);

  const handleLanguageChange = (language: LanguageOption) => {
    setSelectedLanguage(language);
    onLanguageSelect(language.name);
  };

  return (
    <Popover placement="bottom-start">
      <PopoverTrigger>
        <div className="flex whitespace-nowrap !flex-row justify-center items-center p-2 cursor-pointer">
          {selectedLanguage.name}
          <ChevronDownIcon className="h-5 w-5" />
        </div>
      </PopoverTrigger>
      <PopoverContent className=" flex p-2 rounded-lg shadow-lg max-w-md mx-auto border border-default-200 bg-[#323232] text-white">
        <div className="grid grid-cols-3">
          {languages.map(language => (
            <button
              key={language.id}
              className="w-full p-2 rounded-lg text-white hover:bg-[#4d4d4d] focus:outline-none"
              onClick={() => handleLanguageChange(language)}>
              <div
                className={
                  selectedLanguage.name === language.name
                    ? 'font-bold text-left text-brand-purple'
                    : 'text-left'
                }>
                {language.name}
              </div>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DropDown;
