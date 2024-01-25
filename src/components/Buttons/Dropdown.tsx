import React, { Fragment, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { IconType } from 'react-icons';
import { SiJavascript, SiCplusplus, SiPython, SiC } from "react-icons/si";

interface LanguageOption {
  name: string;
  icon: IconType;
}

const languages: LanguageOption[] = [
  { name: 'JavaScript', icon: SiJavascript },
  { name: 'C', icon: SiC },
  { name: 'C++', icon: SiCplusplus },
  { name: 'Python', icon: SiPython },
];

interface DropDownProps {
  onLanguageSelect: (language: string) => void;
}

const DropDown: React.FC<DropDownProps> = ({ onLanguageSelect }) => {
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageOption>(languages[2]); // Default to C++

  const handleLanguageChange = (language: LanguageOption) => {
    setSelectedLanguage(language);
    onLanguageSelect(language.name);
  };

  return (
    <div className="fixed z-50 w-50">
      <Listbox value={selectedLanguage} onChange={handleLanguageChange}>
        {({ open }) => (
          <div className="relative mt-1">
            <Listbox.Button className="relative w-full cursor-default rounded-lg bg-[#303030] py-2 pl-3 pr-10 text-left text-white shadow-md focus:outline-none sm:text-sm">
              <div className="flex items-center">
                <selectedLanguage.icon className="text-xl mr-2" />
                <span className="block truncate">{selectedLanguage.name}</span>
              </div>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
            </Listbox.Button>
            <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
              <Listbox.Options className="absolute z-1000 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                {languages.map((language) => (
                  <Listbox.Option
                    key={language.name}
                    className={({ active }) => `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'}`}
                    value={language}
                  >
                    {({ selected }) => (
                      <div className={`flex items-center ${selected ? 'font-medium' : 'font-normal'}`}>
                        {/* <language.icon className="text-xl mr-2" /> */}
                        <span className="block truncate">{language.name}</span>
                        {selected && (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        )}
                      </div>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        )}
      </Listbox>
    </div>
  );
}

export default DropDown;
