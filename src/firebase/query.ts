import { Dispatch, SetStateAction } from 'react';

import { SessionData } from '@/hooks/useSession';
import { UserInfo } from '@/types';
import { collection, DocumentData, getDocs, query, where } from 'firebase/firestore';

import { firestore } from './firebase';

export const currentUserQuery = async (
  userId: string,
  setSessionData: Dispatch<SetStateAction<SessionData | null>>,
) => {
  const userQuery = query(collection(firestore, 'users'), where('uid', '==', userId));
  const querySnapshot = await getDocs(userQuery);

  if (querySnapshot.empty) {
    return;
  }

  const userData = querySnapshot.docs[0].data() as DocumentData;

  setSessionData((prevSessionData): SessionData | null => {
    if (!prevSessionData) {
      return {
        userInfo: {
          ...(userData as UserInfo),
        },
      };
    }
    return {
      ...prevSessionData,
      userInfo: {
        ...prevSessionData.userInfo,
        ...(userData as UserInfo),
      },
    };
  });
};
