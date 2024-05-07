/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { ReactNode, useEffect, useState } from 'react';

import { useRouter } from 'next/router';

import Loading from '@/components/Loading';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
  ToastAction,
  UserAvatar,
  useToast,
} from '@/components/ui';
import { auth, firestore, storage } from '@/firebase/firebase';
import { userInfoQuery } from '@/firebase/query';
import { useAuth } from '@/hooks/useAuth';
import useLocalStorage from '@/hooks/useLocalStorage';
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
import { Ban, ChevronRight, LogOut, Moon, Sun, SunMoon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useSignOut } from 'react-firebase-hooks/auth';
import { BsCheckLg } from 'react-icons/bs';

const Themes = [
  { name: 'System Default', value: 'system' },
  { name: 'Light', value: 'light' },
  { name: 'Dark', value: 'dark' },
] as const;

const Apparence: React.FC = () => {
  const { setTheme } = useTheme();
  const [themevariant, setThemeVariant] = useLocalStorage('theme', 'system');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setTheme(themevariant);
  }, [themevariant, setTheme]);

  return (
    <div>
      <DropdownMenu open={isOpen}>
        <DropdownMenuTrigger
          className="rounded cursor-pointer flex flex-row items-center justify-between w-full py-3 space-x-6 px-2 md:space-x-3 md:py-[10px] dark:hover:bg-[#404040]"
          onClick={() => setIsOpen(prev => !prev)}>
          <div className="leading-none">
            {themevariant === 'dark' ? <Moon /> : themevariant === 'light' ? <Sun /> : <SunMoon />}
          </div>
          <div className="grow text-left"> Apparence</div>
          <ChevronRight className="w-[14px] h-[14px]" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48 dark:bg-[#303030] border-none">
          <div className="flex flex-col">
            {Themes.map((theme, idx) => (
              <div
                onClick={() => setThemeVariant(theme.value)}
                key={idx}
                className="relative flex w-full p-1 m-1 rounded-[4px] text-[#f5f5f5] dark:hover:bg-[#404040] focus:outline-none cursor-pointer">
                <span
                  className={`flex items-center mr-2 ${
                    themevariant === theme.value ? 'visible' : 'invisible'
                  }`}>
                  <BsCheckLg />
                </span>
                <div className="text-left text-[14px]">{theme.name}</div>
              </div>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

interface ModuleProps {
  onClick: () => void;
  label: string;
  icon: ReactNode;
}

const Module: React.FC<ModuleProps> = ({ onClick, label, icon }) => (
  <div
    className="rounded cursor-pointer flex flex-row items-center py-3 space-x-6 px-2 md:space-x-3 md:py-[10px] hover:bg-[#404040]"
    onClick={onClick}>
    <div className="leading-none">{icon}</div>
    <div className="grow text-left">{label}</div>
  </div>
);
interface AvatarPopProps {
  session?: Session | null;
  compilerPage?: boolean;
}

const AvatarPop: React.FC<AvatarPopProps> = ({ session, compilerPage }) => {
  const { user, loading } = useAuth();
  const [userData, setUserData] = useState({ fullName: '', imageUrl: '', email: '' });
  const { toast } = useToast();
  const { sessionData } = useSession();
  const router = useRouter();
  const [signOut] = useSignOut(auth);

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

  const handleSignOut = async () => {
    toast({
      title: 'Sign Out',
      description: 'You will be signed out of your account.',
      action: (
        <ToastAction altText="signOut" onClick={signOut}>
          Sign Out
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
      <PopoverContent
        onOpenAutoFocus={e => e.preventDefault()}
        className="relative w-[270px] flex top-3 flex-col right-3 p-2 text-[14px] dark:bg-[#303030] border-none">
        <div className="flex shrink-0 items-center px-[1px]">
          <Avatar className="flex h-14 w-14">
            <AvatarImage src={userData.imageUrl} />
            <AvatarFallback>
              {userData.fullName
                .split(' ')
                .map(part => part[0])
                .join(' ')}
            </AvatarFallback>
          </Avatar>
          <div className="pl-3">
            <h4 className="flex items-center text-small font-semibold">{userData.fullName}</h4>
            <h5 className="text-small tracking-tight">{userData.email}</h5>
          </div>
          <div className="flex flex-row"></div>
        </div>
        <div className="m-0  p-0 px-4 md:mt-4 md:border-none md:px-0 dark:text-[#ffffff99]">
          {compilerPage ? (
            <Module onClick={handleQuit} label="Quit Session" icon={<Ban />} />
          ) : (
            <Module onClick={handleClose} label="Close Session" icon={<Ban />} />
          )}
          <Module onClick={handleSignOut} label="Sign Out" icon={<LogOut />} />
          <Apparence />
        </div>
      </PopoverContent>
    </Popover>
  );
};
export default AvatarPop;
