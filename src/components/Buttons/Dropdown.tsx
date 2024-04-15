import React, { useState } from 'react';

import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react';
import { BsCheckLg } from 'react-icons/bs';

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
  { id: '14', name: 'Perl' },
  { id: '15', name: 'Haskell' },
  { id: '16', name: 'Lua' },
  { id: '17', name: 'R' },
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
        <div className="flex whitespace-nowrap !flex-row justify-center items-center m-1 rounded-md p-1 cursor-pointer hover:bg-gray-8 text-gray-400 font-normal">
          {selectedLanguage.name}
          <ChevronDownIcon className="h-5 w-5" />
        </div>
      </PopoverTrigger>
      <PopoverContent className=" flex p-2 rounded-lg shadow-lg max-w-md mx-auto border border-default-200 bg-[#323232] text-white">
        <div className="grid grid-cols-3">
          {languages.map(language => (
            <div
              onClick={() => handleLanguageChange(language)}
              key={language.id}
              className="relative flex w-[100px] p-2 rounded-lg text-white hover:bg-[#4d4d4d] focus:outline-none cursor-pointer">
              <span
                className={`text-blue dark:text-dark-blue flex items-center pr-2 ${
                  selectedLanguage.name === language.name ? 'visible' : 'invisible'
                }`}>
                <BsCheckLg />
              </span>
              <div className="text-left">{language.name}</div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DropDown;
