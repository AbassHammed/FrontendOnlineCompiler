import React, { createContext, useContext, useEffect, useState } from 'react';

import { UserInfo } from '@/types';

interface SessionProviderProps {
  children: React.ReactNode;
}

export interface SessionData {
  filePath?: string;
  sessionName?: string;
  sessionDocId?: string;
  userInfo?: UserInfo;
}

interface SessionContextProps {
  sessionData: SessionData | null;
  setSessionData: React.Dispatch<React.SetStateAction<SessionData | null>>;
}

const SessionContext = createContext<SessionContextProps | undefined>(undefined);

export const SessionProvider: React.FC<SessionProviderProps> = ({ children }) => {
  const [sessionData, setSessionData] = useState<SessionData | null>(() => {
    // Check if window is defined which indicates we're running in the browser
    if (typeof window !== 'undefined') {
      const storedSessionData = sessionStorage.getItem('sessionData');
      return storedSessionData ? JSON.parse(storedSessionData) : null;
    }
    return null;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (sessionData) {
        sessionStorage.setItem('sessionData', JSON.stringify(sessionData));
      } else {
        sessionStorage.removeItem('sessionData');
      }
    }
  }, [sessionData]);

  return (
    <SessionContext.Provider value={{ sessionData, setSessionData }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};
