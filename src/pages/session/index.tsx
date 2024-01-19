import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { authModalState } from '@/atoms/authModalAtom';
import AuthModal from '@/components/Modals/AuthModal';
import Topbar from '@/components/Topbar/Topbar';

type SessionPageProps = {};

const SessionPage: React.FC<SessionPageProps> = () => {
  const authModal = useRecoilValue(authModalState);
  const setAuthModalState = useSetRecoilState(authModalState);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#1A1A1A] text-white relative">
      <div className="absolute w-full top-0">
        <Topbar />
      </div>
      <div className="flex flex-col md:flex-row justify-center items-center gap-4">
        <button
          className="w-64 h-40 bg-[#610C9F] rounded-lg shadow-md flex items-center justify-center text-2xl font-bold cursor-pointer relative"
          onClick={() => setAuthModalState((prev) => ({ ...prev, isOpen: true, type: "join" }))}
        >
          <FaPlus className="mr-2 text-3xl" />
          Join a session
        </button>
        <button
          className="w-64 h-40 bg-[#03C988] rounded-lg shadow-md flex items-center justify-center text-2xl font-bold cursor-pointer relative"
          onClick={() => setAuthModalState((prev) => ({ ...prev, isOpen: true, type: "create" }))}
        >
          <FaPlus className="mr-2 text-3xl" />
          Create a session
        </button>
      </div>
        { authModal.isOpen && <AuthModal /> }
    </div>
  );
};

export default SessionPage;
