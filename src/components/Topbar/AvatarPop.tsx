/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/router';

import Loading from '@/components/Loading';
import { firestore, storage } from '@/firebase/firebase';
import { userInfoQuery } from '@/firebase/query';
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

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Popover,
  PopoverContent,
  PopoverTrigger,
  ToastAction,
  UserAvatar,
  useToast,
} from '../ui';

interface AvatarPopProps {
  session?: Session | null;
}

const AvatarPop: React.FC<AvatarPopProps> = ({ session }) => {
  const { user, loading } = useAuth();
  const [userData, setUserData] = useState({ fullName: '', imageUrl: '', email: '' });
  const { toast } = useToast();
  const { sessionData } = useSession();
  const router = useRouter();

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

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const data = await userInfoQuery(user.uid);
        if (data) {
          setUserData(data);
        }
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return <Loading />;
  }
  return (
    <Popover>
      <PopoverTrigger className="flex cursor-pointer group relative !h-6 justify-center items-center">
        <UserAvatar
          ImageUrl={userData.imageUrl}
          fallBackInitials={userData.fullName
            .split(' ')
            .map(part => part[0])
            .join(' ')}
        />
      </PopoverTrigger>
      <PopoverContent className="w-[260px] flex">
        <div className="flex">
          <Avatar className="flex h-12 w-12">
            <AvatarImage src={userData.imageUrl} sizes="" />
            <AvatarFallback>
              {userData.fullName
                .split(' ')
                .map(part => part[0])
                .join(' ')}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start justify-center pl-2">
            <h4 className="text-small font-semibold leading-none text-[#f5f5f5]">
              {userData.fullName}
            </h4>
            <h5 className="text-small tracking-tight">{userData.email}</h5>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
export default AvatarPop;
