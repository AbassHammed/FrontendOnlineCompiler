import React from 'react';

import Image from 'next/image';

import { authModalState } from '@/atoms';
import { useSetRecoilState } from 'recoil';

type NavbarProps = {
  showSign?: boolean;
};

const Navbar: React.FC<NavbarProps> = ({ showSign }) => {
  const setAuthModalState = useSetRecoilState(authModalState);
  const handleClick = () => {
    setAuthModalState(prev => ({ ...prev, isOpen: true }));
  };
  return (
    <div className="flex flex-col items-center justify-center h-[5rem] bg-[#1a1a1a] text-white relative">
      <div className="absolute top-4 left-4 flex items-center">
        <Image src="/Icon.png" alt="LetsCode Logo" width={50} height={50} />
        <h1 className="fonth1 ml-2">LetsCode</h1>
      </div>
      {showSign && (
        <button
          className="absolute top-4 right-4 bg-[#610c9f] text-white py-2.5 px-5 border-none text-[1rem] rounded-md font-medium cursor-pointer hover:bg-[#4e077d]"
          onClick={handleClick}>
          Sign In
        </button>
      )}
    </div>
  );
};
export default Navbar;
