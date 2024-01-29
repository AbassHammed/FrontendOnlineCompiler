import React, { useEffect, useState } from 'react';
import { authModalState } from '@/atoms/authModalAtom';
import Navbar from '@/components/Navbar/Navbar';
import AuthModal from '@/components/Modals/AuthModal';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/firebase';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Loadin from '@/components/Loading/Loading';

const AuthPage: React.FC = () => {
  const authModal = useRecoilValue(authModalState);
  const [user, loading] = useAuthState(auth);
  const [pageLoading, setPageLoading] = useState(true);
  const setAuthModalState = useSetRecoilState(authModalState);
  const router = useRouter();

  useEffect(() => {
    setAuthModalState(prev => ({ ...prev, isOpen: false }));
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
