import React, { useEffect, useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/router';

import { authModalState } from '@/atoms/authModalAtom';
import Loadin from '@/components/Loading/Loading';
import AuthModal from '@/components/Modals/AuthModal';
import Navbar from '@/components/Navbar/Navbar';
import { auth } from '@/firebase/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRecoilValue, useSetRecoilState } from 'recoil';

const AuthPage: React.FC = () => {
  const authModal = useRecoilValue(authModalState);
  const [user, loading] = useAuthState(auth);
  const [pageLoading, setPageLoading] = useState(true);
  const setAuthModalState = useSetRecoilState(authModalState);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/session');
    }
    if (!loading && !user) {
      setPageLoading(false);
    }
  }, [user, router, loading, setAuthModalState]);

  if (pageLoading) {
    return <Loadin />;
  }

  return (
    <div className="bg-[#1A1A1A] h-screen relative">
      <div className="mx-auto">
        <Navbar showSign={true} />
        <div className="flex items-center justify-center h-[calc(100vh-5rem)] pointer-events-none select-none">
          <Image src="/home.svg" alt="Hero image" width={700} height={700} />
        </div>
        {authModal.isOpen && <AuthModal />}
      </div>
    </div>
  );
};
export default AuthPage;
