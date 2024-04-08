import React, { useEffect } from 'react';

import { currentUserQuery } from '@/firebase/query';
import { useAuth } from '@/hooks/useAuth';
import { useSession } from '@/hooks/useSession';

export const Wrapper = ({ children }: { children: React.ReactNode }) => {
  const { setSessionData } = useSession();
  const { user } = useAuth();

  useEffect(() => {
    const FetchData = async () => {
      const authState = sessionStorage.getItem('authState');

      if (!authState && user) {
        await currentUserQuery(user.uid, setSessionData).then(() => {
          sessionStorage.setItem('authState', 'true');
        });
      }
    };

    if (user) {
      FetchData();
    }
  }, [user, setSessionData]);

  return <div>{children}</div>;
};
