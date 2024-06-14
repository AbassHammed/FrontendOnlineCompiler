import { collection, getDocs, query, where } from 'firebase/firestore';

import { firestore } from './firebase';

export const userInfoQuery = async (userId: string) => {
  const dataQuery = query(collection(firestore, 'users'), where('uid', '==', userId));
  const querySnapshot = await getDocs(dataQuery);

  if (querySnapshot.empty) {
    return;
  }

  const data: { fullName: string; imageUrl: string; email: string } = {
    fullName: querySnapshot.docs[0].data().fullName,
    imageUrl: querySnapshot.docs[0].data().imageUrl,
    email: querySnapshot.docs[0].data().email,
  };

  return data;
};
