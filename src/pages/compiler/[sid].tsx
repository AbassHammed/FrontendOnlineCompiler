import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/router';

import Loadin from '@/components/Loading/Loading';
import Topbar from '@/components/Topbar/Topbar';
import Workspace from '@/components/Workspace/Workspace';
import { firestore } from '@/firebase/firebase';
import { useAuth } from '@/hooks/useAuth';
import { useSession } from '@/hooks/useSession';
import { doc, onSnapshot, serverTimestamp, updateDoc } from 'firebase/firestore';
import { toast } from 'sonner';

const Compiler: React.FC = () => {
  const { sessionData } = useSession();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [warningTimeoutId, setWarningTimeoutId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!sessionData) {
      router.push('/session');
      return;
    }

    const notifyUserOfDisconnection = () => {
      toast.warning('You will be disconnected if you leave the page.');
    };

    const setDisconnectedAfterTimeout = () => {
      const timeoutId = setTimeout(async () => {
        if (
          user &&
          typeof sessionData.sessionId === 'string' &&
          typeof sessionData.userInfo?.uid === 'string'
        ) {
          const userRef = doc(
            firestore,
            `sessions/${sessionData.sessionId}/users`,
            sessionData.userInfo.uid,
          );
          await updateDoc(userRef, {
            connected: false,
            quitedAt: serverTimestamp(),
          });
        }
      }, 1000);
      setWarningTimeoutId(timeoutId);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        notifyUserOfDisconnection();
        setDisconnectedAfterTimeout();
      } else {
        if (warningTimeoutId) {
          clearTimeout(warningTimeoutId);
          setWarningTimeoutId(null);
        }
      }
    };

    if (
      authLoading ||
      !user ||
      typeof sessionData.sessionId !== 'string' ||
      typeof sessionData.userInfo?.uid !== 'string'
    ) {
      return;
    }

    const unsubscribe = onSnapshot(
      doc(firestore, `sessions/${sessionData.sessionId}/users`, sessionData.userInfo.uid),
      docSnapshot => {
        if (!docSnapshot.exists() || !docSnapshot.data()?.connected) {
          router.push('/session');
        }
      },
    );

    document.addEventListener('mouseleave', notifyUserOfDisconnection);

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('mouseleave', notifyUserOfDisconnection);
      if (warningTimeoutId) {
        clearTimeout(warningTimeoutId);
      }
      unsubscribe();
    };
  }, [user, authLoading, sessionData, router, warningTimeoutId]);

  if (!user || authLoading || !sessionData) {
    return <Loadin />;
  }

  return (
    <div>
      <Topbar
        compilerPage={true}
        sessionName={typeof sessionData.sessionName === 'string' ? sessionData.sessionName : ''}
        sessionId={sessionData.sessionId as string}
      />
      <Workspace />
    </div>
  );
};

export default Compiler;
