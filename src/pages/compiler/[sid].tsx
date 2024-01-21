import Topbar from '@/components/Topbar/Topbar';
import Workspace from '@/components/Workspace/Workspace';
import { auth, firestore } from '@/firebase/firebase';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const Compiler: React.FC = () => {
    const { user, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { sessionId, UserId } = router.query;
    const [warningTimeoutId, setWarningTimeoutId] = useState<NodeJS.Timeout | null>(null);

    const notifyUserOfDisconnection = () => {
        toast.warning('You will be disconnected if you leave the page.');
    };

    const setDisconnectedAfterTimeout = () => {
        const timeoutId = setTimeout(async () => {
            if (user && typeof sessionId === 'string' && typeof UserId === 'string') {
                const userRef = doc(firestore, `sessions/${sessionId}/users`, UserId);
                await updateDoc(userRef, { connected: false });
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

    useEffect(() => {
        if (authLoading || !user || typeof sessionId !== 'string' || typeof UserId !== 'string') return;

        const unsubscribe = onSnapshot(doc(firestore, `sessions/${sessionId}/users`, UserId), (docSnapshot) => {
            if (!docSnapshot.exists() || !docSnapshot.data()?.connected) {
                router.push('/session');
            }
        });

        document.addEventListener('mouseleave', notifyUserOfDisconnection);

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            document.addEventListener('mouseleave', notifyUserOfDisconnection);
            if (warningTimeoutId) clearTimeout(warningTimeoutId);
            unsubscribe();
        };
    }, [user, authLoading, sessionId, UserId, router]);

    if (!user || authLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <Topbar compilerPage={true} sessionName={typeof router.query.sessionName === 'string' ? router.query.sessionName : ''} sessionId={sessionId as string} UserId={UserId as string}/>
            <Workspace filePath={typeof router.query.filePath === 'string' ? router.query.filePath : ''} sessionId={sessionId as string} UserId={UserId as string} />
        </div>
    );
}

export default Compiler;
