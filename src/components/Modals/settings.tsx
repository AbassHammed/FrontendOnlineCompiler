import React from 'react';

import useLocalStorage from '@/hooks/useLocalStorage';
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/react';
import { AiOutlineSetting } from 'react-icons/ai';

const EDITOR_FONT_SIZES = ['12px', '13px', '14px', '15px', '16px', '17px', '18px'];

interface SettingsProps {
  onFontSizeChange: (fontSize: string) => void;
}

const Settings: React.FC<SettingsProps> = ({ onFontSizeChange }) => {
  const [fontSize, setFontSize] = useLocalStorage('lcc-fontSize', '13px');
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleFontSizeChange = (fontSize: string) => {
    setFontSize(fontSize);
    onFontSizeChange(fontSize);
  };
  return (
    <div>
      <Button
        isIconOnly
        color="primary"
        variant="light"
        className="w-7 h-7 rounded-sm text-lg"
        aria-label="Settings"
        onPress={() => onOpen()}>
        <AiOutlineSetting />
      </Button>
      {isOpen && (
        <Modal
          backdrop="blur"
          isOpen={isOpen}
          onClose={onClose}
          className="bg-[#0f0f0f] text-white p-1">
          <ModalContent>
            {
              <>
                <ModalHeader className="flex flex-col gap-1">Settings</ModalHeader>
                <ModalBody className="pb-2">
                  <p>Choose your preferred font size </p>
                  <Dropdown>
                    <DropdownTrigger>
                      <Button
                        size="sm"
                        variant="bordered"
                        color="success"
                        className="capitalize h-9 w-5">
                        {fontSize as string}
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                      aria-label="Single selection example"
                      variant="flat"
                      disallowEmptySelection
                      selectionMode="single"
                      selectedKeys={new Set([fontSize])}
                      onSelectionChange={keys =>
                        handleFontSizeChange(Array.from(keys)[0] as string)
                      }>
                      {EDITOR_FONT_SIZES.map(font => (
                        <DropdownItem key={font}>{font}</DropdownItem>
                      ))}
                    </DropdownMenu>
                  </Dropdown>
                </ModalBody>
              </>
            }
          </ModalContent>
        </Modal>
      )}
    </div>
  );
};
export default Settings;
