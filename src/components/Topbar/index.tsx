import React from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { useAuth } from '@/hooks/useAuth';
import { Session } from '@/types';

import Loading from '../Loading';
import Settings from '../Modals/settings';
import AvatarPop from './AvatarPop';
import Timer from './Timer';

interface TopbarProps {
  compilerPage?: boolean;
  sessionName?: string;
  session?: Session | null;
}

const Topbar: React.FC<TopbarProps> = ({ compilerPage, sessionName, session }) => {
  const { user, loading } = useAuth();

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
                  <span className="font-medium text-[14px] mx-5 dark:text-[#f5f5f5]">
                    {sessionName}
                  </span>
                </div>
              )}
            </ul>
          </div>
        </div>
        <div className="relative ml-4 flex items-center gap-2 justify-end">
          {user && compilerPage && (
            <>
              <Timer />
              <Settings />
            </>
          )}
          {user && (
            <div className="flex flex-row justify-center items-center gap-2">
              <AvatarPop session={session} compilerPage={compilerPage} />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
export default Topbar;
