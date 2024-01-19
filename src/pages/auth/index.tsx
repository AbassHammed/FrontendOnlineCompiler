import React, { useEffect, useState } from 'react';
import { authModalState } from "@/atoms/authModalAtom";
import Navbar from '@/components/Navbar/Navbar';
import AuthModal from '@/components/Modals/AuthModal';
import { useRecoilValue } from 'recoil';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/firebase';
import { useRouter } from 'next/router';
import Image from 'next/image';

type AuthPageProps = {};

const AuthPage: React.FC<AuthPageProps> = () => {
    const authModal = useRecoilValue(authModalState);
	const [user, loading, error] = useAuthState(auth);
	const [pageLoading, setPageLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		if (user) router.push("/");
		if (!loading && !user) setPageLoading(false);
	}, [user, router, loading]);

	if (pageLoading) return null;
    
    return <div className="bg-[#282828] h-screen relative">
        <div className="mx-auto">
            <Navbar />
            <div className="flex items-center justify-center h-[calc(100vh-5rem)] pointer-events-none select-none">
                <Image src="/hero.png" alt="Hero image" width={700} height={700} />
            </div>
            {authModal.isOpen && <AuthModal />}
        </div>
    </div>

}
export default AuthPage;