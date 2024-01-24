import React, { useState } from "react";
import {Select, SelectItem} from "@nextui-org/react";

type DropDownProps = {
    onLanguageSelect: (language: string) => void;
}

const DropDown : React.FC<DropDownProps>=({onLanguageSelect}) => {
	const [selectedLanguage, setSelectedLanguage] = useState('C++');

    const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newLanguage = event.target.value;
        if (newLanguage != selectedLanguage)
        {
            setSelectedLanguage(newLanguage);
            onLanguageSelect(newLanguage); 
        }
    };

  return (
    <div className="flex w-full max-w-xs flex-col gap-2">
        <Select
              variant="bordered"
              value={selectedLanguage}
        className="bg-[#303030] text-xs text-label-2 dark:text-dark-label-2"
        onChange={handleLanguageChange}
      >
              <SelectItem key="C" value="C">C</SelectItem>
              <SelectItem key="C++" value="C++">C++</SelectItem>
              <SelectItem key="Python" value="Python">Python</SelectItem>
      </Select>
    </div>
  );
}

export default DropDown;
