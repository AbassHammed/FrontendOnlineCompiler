import React from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { firestore, storage } from '@/firebase/firebase';
import { useAuth } from '@/hooks/useAuth';
import { useSession } from '@/hooks/useSession';
import { Session } from '@/types';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';

import Loading from '../Loading';
import { Button } from '../ui/button';
import { ToastAction } from '../ui/toast';
import { ToolTip } from '../ui/tooltip';
import { useToast } from '../ui/use-toast';
import AvatarPop from './AvatarPop';
import Logout from './Logout';
import Timer from './Timer';

interface TopbarProps {
  compilerPage?: boolean;
  sessionName?: string;
  dashboardpage?: boolean;
  session?: Session | null;
}

const Topbar: React.FC<TopbarProps> = ({ compilerPage, sessionName, session }) => {
  const { toast } = useToast();
  const { sessionData } = useSession();
  const router = useRouter();
  const { user, loading } = useAuth();

  const handleQuitSession = async () => {
    if (!sessionData || !user) {
      toast({ description: 'An internal error occured' });
      return;
    }
    try {
      const userDocRef = doc(firestore, `sessions/${sessionData.sessionDocId}/users`, user.uid);
      await updateDoc(userDocRef, {
        connected: false,
        quitedAt: serverTimestamp(),
      });

      router.push('/');
    } catch (error) {
      toast({ variant: 'destructive', description: 'Error quitting session' });
    }
  };

  const handleQuit = async () => {
    toast({
      title: 'Quit Session',
      description: 'Are you sure you want to quit this session?',
      action: (
        <ToastAction altText="Quit" onClick={handleQuitSession}>
          Quit
        </ToastAction>
      ),
    });
  };

  const handleCloseSession = async () => {
    if (!session) {
      toast({ variant: 'destructive', description: 'Invalid session data' });
      return;
    }

    const sessionDocRef = doc(firestore, 'sessions', session.sessionDoc);

    try {
      const usersSubcollectionRef = collection(sessionDocRef, 'users');

      const usersSnapshot = await getDocs(usersSubcollectionRef);

      const usersDeletions = usersSnapshot.docs.map(userDoc => deleteDoc(userDoc.ref));

      await Promise.all(usersDeletions);

      await deleteDoc(sessionDocRef);

      const fileRef = ref(storage, session.filePath);
      await deleteObject(fileRef);

      toast({ description: 'Session closed and file deleted successfully' });
      router.push('/session');
    } catch (error) {
      toast({ variant: 'destructive', description: 'Error closing session' });
    }
  };

  const handleClose = async () => {
    toast({
      title: 'Close Session',
      description: 'Closing this session will delete it',
      action: (
        <ToastAction altText="Close" onClick={handleCloseSession}>
          Close
        </ToastAction>
      ),
    });
  };

  if (loading && !user) {
    return <Loading />;
  }

  return (
    <nav className="flex h-[48px] w-full shrink-0 items-center pr-2">
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center justify-center">
          <div className="flex items-center">
            <ul className="relative flex h-10 items-center justify-center">
              <Link href="/">
                <Image src="/Icon.png" alt="Logo" height={30} width={40} />
              </Link>
              {compilerPage && (
                <div className="flex items-center justify-center">
                  <li className="h-[16px] w-[1px] bg-gray-500"></li>
                  <span className="font-medium text-[14px] mx-5 text-[#f5f5f5]">{sessionName}</span>
                </div>
              )}
            </ul>
          </div>

          <div className="hidden md:flex justify-center flex-1 mt-2"></div>
        </div>
        <div className="flex items-center space-x-4 justify-end">
          {user && compilerPage && <Timer />}
          {user && (
            <div>
              <AvatarPop session={session} />
            </div>
          )}
          {compilerPage ? (
            <ToolTip message="Quit the session">
              <Button onClick={handleQuit} color="warning" size="sm" className="h-8">
                Quit
              </Button>
            </ToolTip>
          ) : (
            <ToolTip message="End the session">
              <Button onClick={handleClose} size="sm">
                Close
              </Button>
            </ToolTip>
          )}
          <Logout />
        </div>
      </div>
    </nav>
  );
};
export default Topbar;
