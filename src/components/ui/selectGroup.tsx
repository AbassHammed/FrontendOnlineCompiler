import React from 'react';

import { useLocalStorage } from '@/hooks';
import { EDITOR_FONT_SIZES } from '@/lib/constants';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from './select';

const FontSize: React.FC = () => {
  const [value, setValue] = useLocalStorage('font-size', '13px');
  return (
    <Select>
      <SelectTrigger className="w-[100px]">
        <SelectValue>{value}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Fonts</SelectLabel>
          {EDITOR_FONT_SIZES.map(font => (
            <SelectItem key={font} value={font} onSelect={() => setValue(font)}>
              {font}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
export default FontSize;
