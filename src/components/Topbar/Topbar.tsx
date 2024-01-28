import { auth, storage, firestore } from '@/firebase/firebase';
import Link from 'next/link';
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useSetRecoilState } from 'recoil';
import { authModalState } from '@/atoms/authModalAtom';
import Image from 'next/image';
import Timer from '../Timer/Timer';
import styled from 'styled-components';
import Logout from '../Buttons/Logout';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { useRouter } from 'next/router';
import { toast } from 'sonner';
import ProfilePicture from '@/utils/profilePic';
import { Button, Tooltip } from '@nextui-org/react';
import { Session } from '@/utils/types';
import { ref, deleteObject } from 'firebase/storage';

type TopbarProps = {
  compilerPage?: boolean;
  sessionName?: string;
  sessionId?: string;
  UserId?: string;
  UserName?: string;
  dashboardpage?: boolean;
  session?: Session | null;
};

const TopLeftContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-items: center;
`;

const Topbar: React.FC<TopbarProps> = ({
  compilerPage,
  sessionName,
  sessionId,
  UserId,
  UserName,
  dashboardpage,
  session,
}) => {
  const [user] = useAuthState(auth);
  const setAuthModalState = useSetRecoilState(authModalState);
  const router = useRouter();

  const handleQuit = async () => {
    if (!UserId || !sessionId) {
      toast.warning('An internal error occured');
      return;
    }

    try {
      const userDocRef = doc(firestore, `sessions/${sessionId}/users`, UserId);
      await updateDoc(userDocRef, {
        connected: false,
        quitedAt: serverTimestamp(),
      });

      router.push('/');
    } catch (error) {
      toast.error('Error quitting session');
    }
  };

  const handleCloseSession = async () => {
    if (!session || !session.sessionId) {
      toast.error('Invalid session data');
      return;
    }

    const sessionDocRef = doc(firestore, 'sessions', session.sessionDoc);

    try {
      const usersSubcollectionRef = collection(sessionDocRef, 'users');

      const usersSnapshot = await getDocs(usersSubcollectionRef);

      const usersDeletions = usersSnapshot.docs.map(userDoc => deleteDoc(userDoc.ref));

      await Promise.all(usersDeletions);

      await deleteDoc(sessionDocRef);

      if (session.filePath) {
        const fileRef = ref(storage, session.filePath);
        await deleteObject(fileRef);
      }

      toast.success('Session closed and file deleted successfully');
      router.push('/session');
    } catch (error) {
      toast.error('Error closing session');
    }
  };

  const handleClose = async () => {
    toast.warning('Closing this session will delete it', {
      action: {
        label: 'Close',
        onClick: () => {
          handleCloseSession();
        },
      },
    });
  };

  return (
    <nav className="flex h-[50px] w-full shrink-0 items-center bg-[#0f0f0f] text-dark-gray-7">
      <div className="flex justify-between w-full px-5">
        <TopLeftContainer>
          <Link href="/" className="h-[22px]">
            <Image src="/Icon.png" alt="Logo" height={50} width={50} />
          </Link>
        </TopLeftContainer>

        <div className="hidden md:flex justify-center flex-1 mt-2">
          <span className="font-bold">{sessionName}</span>
        </div>

        <div className="flex items-center space-x-4 justify-end">
          {!user && (
            <Link
              href="/auth"
              onClick={() => setAuthModalState(prev => ({ ...prev, isOpen: true, type: 'login' }))}>
              <button className="bg-dark-fill-3 py-1 px-2 cursor-pointer rounded">Sign In</button>
            </Link>
          )}
          {user && compilerPage && <Timer />}
          {user && (
            <div className="cursor-pointer group relative">
              <ProfilePicture email={UserName} />
              <div className="absolute top-10 left-2/4 -translate-x-2/4 mx-auto bg-dark-layer-1 p-2 rounded shadow-lg z-40 group-hover:scale-100 scale-0 transition-all duration-300 ease-in-out">
                <p className="text-sm">{UserName}</p>
              </div>
            </div>
          )}
          {!dashboardpage ? (
            <Tooltip content="Quit the session">
              <Button onClick={handleQuit} color="warning" size="sm">
                Quit
              </Button>
            </Tooltip>
          ) : (
            <Tooltip content="End the session">
              <Button onClick={handleClose} color="warning" size="sm">
                Close
              </Button>
            </Tooltip>
          )}

          {user && <Logout />}
        </div>
      </div>
    </nav>
  );
};
export default Topbar;
