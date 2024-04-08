import React, { useState } from 'react';

import { useRouter } from 'next/router';

import { firestore } from '@/firebase/firebase';
import { useSession } from '@/hooks/useSession';
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { toast } from 'sonner';

const JoinSession = () => {
  const [inputs, setInputs] = useState({ sessionId: '', userName: '' });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { setSessionData, sessionData } = useSession();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const validateInputs = () => {
    if (!inputs.sessionId) {
      toast.warning('Please fill all fields');
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
        toast.error('Session ID not found');
        return;
      }
      // tout est bon ici
      if (sessionData?.userInfo?.fullName) {
        const sessionDoc = querySnapshot.docs[0];
        const sessionDat = sessionDoc.data();
        const usersRef = collection(firestore, `sessions/${sessionDoc.id}/users`);
        const userDocRef = doc(
          firestore,
          `sessions/${sessionDoc.id}/users/${sessionData.userInfo.uid}`,
        );
        const userQuery = query(usersRef, where('name', '==', sessionData.userInfo.fullName));
        const userSnapshot = await getDocs(userQuery);

        if (userSnapshot.empty) {
          // If no user found, add them to the session
          await setDoc(userDocRef, {
            name: sessionData.userInfo.fullName,
            joinedAt: new Date(),
            connected: true,
            quitedAt: null,
          });
          setSessionData({
            ...sessionData,
            filePath: sessionDat.filePath,
            sessionName: sessionDat.sessionName,
            sessionId: sessionDoc.id,
          });
          // After adding the user, redirect them to the compiler page
          router.push(`/compiler/${inputs.sessionId}`);
        } else {
          // If user found, check if they are connected
          const userDoc = userSnapshot.docs[0];
          if (!userDoc.data().connected) {
            // eslint-disable-next-line quotes
            toast.error("You've been disconnected, please contact your session Admin");
            return;
          }
          setSessionData({
            ...sessionData,
            filePath: sessionDat.filePath,
            sessionName: sessionDat.sessionName,
            sessionId: sessionDoc.id,
          });
          // If connected, redirect to the compiler page
          router.push(`/compiler/${inputs.sessionId}`);
        }
      }
    } catch (error: any) {
      toast.error(`Error joining session: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoin = async (e: any) => {
    e.preventDefault();
    if (validateInputs()) {
      await joinSession();
    }
  };

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
      <div>
        <label htmlFor="userName" className="text-sm font-medium block mb-2 text-gray-300">
          Your name
        </label>
        <input
          onChange={handleInputChange}
          type="userName"
          name="userName"
          id="userName"
          className="
            border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
            bg-gray-600 border-gray-500 placeholder-gray-400 text-white
        "
          placeholder="Coco jojo"
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
