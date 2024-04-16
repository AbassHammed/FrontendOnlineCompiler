import React, { useEffect, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { firestore, storage } from '@/firebase/firebase';
import { userQuery } from '@/firebase/query';
import { useAuth } from '@/hooks/useAuth';
import { useSession } from '@/hooks/useSession';
import { Session } from '@/types';
import { Avatar, Button, Tooltip } from '@nextui-org/react';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import { toast } from 'sonner';

import Logout from '../Buttons/Logout';
import Loadin from '../Loading/Loading';
import Timer from '../Timer/Timer';

type TopbarProps = {
  compilerPage?: boolean;
  sessionName?: string;
  dashboardpage?: boolean;
  session?: Session | null;
};

const Topbar: React.FC<TopbarProps> = ({ compilerPage, sessionName, session }) => {
  const { sessionData } = useSession();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [userData, setUserData] = useState({ fullName: '', imageUrl: '' });

  const handleQuit = async () => {
    if (!sessionData || !user) {
      toast.warning('An internal error occured');
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
      toast.error('Error quitting session');
    }
  };

  const handleCloseSession = async () => {
    if (!session) {
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

      const fileRef = ref(storage, session.filePath);
      await deleteObject(fileRef);

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

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const data = await userQuery(user.uid);
        if (data) {
          setUserData(data);
        }
      }
    };

    fetchData();
  }, [user]);

  if (loading && !user) {
    return <Loadin />;
  }

  return (
    <nav className="flex h-[50px] w-full shrink-0 items-center bg-[#0f0f0f] text-dark-gray-7">
      <div className="flex justify-between w-full px-5">
        <div className="absolute top-0 left-0 flex items-center justify-center">
          <Link href="/" className="h-[22px]">
            <Image src="/Icon.png" alt="Logo" height={50} width={50} />
          </Link>
        </div>

        <div className="hidden md:flex justify-center flex-1 mt-2">
          <span className="font-bold">{sessionName}</span>
        </div>

        <div className="flex items-center space-x-4 justify-end">
          {user && compilerPage && <Timer />}
          {user && (
            <div className="cursor-pointer group relative">
              <Avatar color="default" size="sm" radius="full" src={userData.imageUrl} />
              <div className="absolute top-10 left-2/4 -translate-x-2/4 bg-dark-layer-1 p-2 rounded shadow-lg z-40 group-hover:scale-100 scale-0 transition-all duration-300 ease-in-out !whitespace-nowrap">
                <p className="text-sm">{userData.fullName}</p>
              </div>
            </div>
          )}
          {compilerPage ? (
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
          <Logout />
        </div>
      </div>
    </nav>
  );
};
export default Topbar;
