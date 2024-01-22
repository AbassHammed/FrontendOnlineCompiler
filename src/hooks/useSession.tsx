import React, { createContext, useContext, useState } from 'react';

interface SessionProviderProps {
    children: React.ReactNode;
}

interface SessionData {
    filePath?: string;
    sessionName?: string;
    sessionId?: string;
    userId?: string;
}

interface SessionContextProps {
    sessionData: SessionData | null;
    setSessionData: React.Dispatch<React.SetStateAction<SessionData | null>>;
}

const SessionContext = createContext<SessionContextProps | undefined>(undefined);

export const SessionProvider: React.FC<SessionProviderProps> = ({ children }) => {
    const [sessionData, setSessionData] = useState<SessionData | null>(null);

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
