import React, { useEffect } from 'react';

import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';

import Loadin from '@/components/Loading/Loading';
import Workspace from '@/components/Workspace/Workspace';
import { firestore } from '@/firebase/firebase';
import { useAuth } from '@/hooks/useAuth';
import { useSession } from '@/hooks/useSession';
import { doc, onSnapshot, serverTimestamp, updateDoc } from 'firebase/firestore';

const Topbar = dynamic(() => import('../../components/Topbar/Topbar'), { ssr: false });

const Compiler: React.FC = () => {
  const { sessionData } = useSession();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleDisconnect = async () => {
      if (
        user &&
        typeof sessionData?.sessionDocId === 'string' &&
        document.visibilityState === 'hidden'
      ) {
        const userRef = doc(firestore, `sessions/${sessionData.sessionDocId}/users`, user.uid);
        await updateDoc(userRef, {
          connected: false,
          quitedAt: serverTimestamp(),
        });
      }
    };

    if (!sessionData || !user) {
      return;
    }

    const unsubscribe = onSnapshot(
      doc(firestore, `sessions/${sessionData.sessionDocId}/users`, user.uid),
      docSnapshot => {
        if (!docSnapshot.exists() || !docSnapshot.data()?.connected) {
          router.push('/session');
        }
      },
    );

    document.addEventListener('visibilitychange', handleDisconnect);

    return () => {
      document.removeEventListener('visibilitychange', handleDisconnect);

      unsubscribe();
    };
  }, [user, authLoading, sessionData, router]);

  if (!user || authLoading || !sessionData) {
    return <Loadin />;
  }

  return (
    <div className="bg-[#0f0f0f] !min-h-full">
      <Head>
        <title>LetsCode | {sessionData.sessionName}</title>
      </Head>
      <Topbar
        compilerPage={true}
        sessionName={typeof sessionData.sessionName === 'string' ? sessionData.sessionName : ''}
      />
      <Workspace />
    </div>
  );
};

export default Compiler;
