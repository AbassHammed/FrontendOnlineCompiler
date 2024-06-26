import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/router';

import { firestore } from '@/firebase/firebase';
import { userInfoQuery } from '@/firebase/query';
import { useAuth } from '@/hooks/useAuth';
import { useSession } from '@/hooks/useSession';
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';

import { useToast } from '../ui';

const JoinSession = () => {
  const [inputs, setInputs] = useState({ sessionId: '' });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [userData, setUserData] = useState({ fullName: '', uid: '' });
  const { setSessionData, sessionData } = useSession();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchUser = async () => {
    if (user) {
      const userInfo = await userInfoQuery(user.uid);
      if (userInfo) {
        setUserData({ fullName: userInfo.fullName, uid: user.uid });
      }
    }
  };

  const validateInputs = () => {
    if (!inputs.sessionId) {
      toast({ title: 'Empty Inputs', description: 'Session ID is required' });
      return false;
    }
    return true;
  };

  const joinSession = async () => {
    try {
      setIsLoading(true);
      const sessionsQuery = query(
        collection(firestore, 'sessions'),
        where('sessionId', '==', inputs.sessionId),
      );
      const querySnapshot = await getDocs(sessionsQuery);

      if (querySnapshot.empty) {
        toast({
          variant: 'destructive',
          title: 'Session not found',
          description: 'Please check the session ID',
        });
        return;
      }

      const sessionDoc = querySnapshot.docs[0];
      const sessionDat = sessionDoc.data();
      const usersRef = collection(firestore, `sessions/${sessionDoc.id}/users`);
      const userDocRef = doc(firestore, `sessions/${sessionDoc.id}/users/${userData.uid}`);
      const userInfoQuery = query(usersRef, where('name', '==', userData.fullName));
      const userSnapshot = await getDocs(userInfoQuery);

      if (userSnapshot.empty) {
        // If no user found, add them to the session
        await setDoc(userDocRef, {
          name: userData.fullName,
          joinedAt: new Date(),
          connected: true,
          quitedAt: null,
        });
        setSessionData({
          ...sessionData,
          filePath: sessionDat.filePath,
          sessionName: sessionDat.sessionName,
          sessionDocId: sessionDoc.id,
        });
        // After adding the user, redirect them to the compiler page
        router.push(`/c/${inputs.sessionId}`);
      } else {
        // If user found, check if they are connected
        const userDoc = userSnapshot.docs[0];
        if (!userDoc.data().connected) {
          // eslint-disable-next-line quotes
          toast({
            variant: 'destructive',
            title: 'Connection Error',
            description: 'You have been disconnected from the session',
          });
          return;
        }
        setSessionData({
          ...sessionData,
          filePath: sessionDat.filePath,
          sessionName: sessionDat.sessionName,
          sessionDocId: sessionDoc.id,
        });
        // If connected, redirect to the compiler page
        router.push(`/c/${inputs.sessionId}`);
      }
    } catch (error: unknown) {
      toast({ variant: 'destructive', title: 'Error', description: 'An error occurred' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoin = async (e: any) => {
    e.preventDefault();
    if (validateInputs()) {
      await fetchUser();
      await joinSession();
    }
  };

  useEffect(() => {
    if (user) {
      fetchUser();
    }
  }, [user, fetchUser]);

  return (
    <form className="space-y-6 px-6 pb-4" onSubmit={handleJoin}>
      <h3 className="text-xl font-medium text-white">Join a session</h3>
      <div>
        <label htmlFor="sessionId" className="text-sm font-medium block mb-2 text-gray-300">
          Your session ID
        </label>
        <input
          onChange={handleInputChange}
          type="sessionId"
          name="sessionId"
          id="sessionId"
          className="
            border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
            bg-gray-600 border-gray-500 placeholder-gray-400 text-white
        "
          placeholder="25AZ7R9B"
        />
      </div>

      <button
        type="submit"
        className="w-full text-white focus:ring-blue-300 font-medium rounded-lg
                text-sm px-5 py-2.5 text-center bg-brand-purple hover:bg-brand-purple-s
            ">
        {isLoading ? 'Joining...' : 'Join'}
      </button>
    </form>
  );
};
export default JoinSession;
