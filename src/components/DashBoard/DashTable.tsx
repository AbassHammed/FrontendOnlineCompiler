import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/router';

import { Icons } from '@/components/icons';
import Loading from '@/components/Loading';
import { useToast } from '@/components/ui';
import { auth, firestore } from '@/firebase/firebase';
import { userInfoQuery } from '@/firebase/query';
import { columns, Session } from '@/types';
import {
  Chip,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  User,
} from '@nextui-org/react';
import {
  collection,
  doc,
  DocumentData,
  onSnapshot,
  query,
  QueryDocumentSnapshot,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

type User = {
  docId: string;
  connected: boolean;
  joinedAt: string | undefined;
  quitedAt?: string | null;
  email: string;
  imageUrl: string;
  name: string;
};

type DashTableProps = {
  setSession: React.Dispatch<React.SetStateAction<Session | null>>;
};

const DashTable: React.FC<DashTableProps> = ({ setSession }) => {
  const [user] = useAuthState(auth);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  let sessionDoc: QueryDocumentSnapshot<DocumentData, DocumentData>;

  const classNames = React.useMemo(
    () => ({
      wrapper: ['max-h-[382px]', 'max-w-[1200px]', 'bg-[#282828]', 'w-3xl'],
      th: ['bg-transparent', 'text-default-500', 'border-b', 'border-divider'],
      td: [
        // changing the rows border radius
        // first
        'group-data-[first=true]:first:before:rounded-none',
        'group-data-[first=true]:last:before:rounded-none',
        // middle
        'group-data-[middle=true]:before:rounded-none',
        // last
        'group-data-[last=true]:first:before:rounded-none',
        'group-data-[last=true]:last:before:rounded-none',
      ],
    }),
    [],
  );

  useEffect(() => {
    if (!user) {
      return;
    }

    setIsLoading(true);
    const sessionsQuery = query(
      collection(firestore, 'sessions'),
      where('userId', '==', user.email),
    );
    const unsubscribeSession = onSnapshot(sessionsQuery, querySnapshot => {
      if (querySnapshot.empty) {
        // eslint-disable-next-line quotes
        toast({ description: "You don't have any open session." });
        router.push('/session');
        setIsLoading(false);
        return;
      }

      sessionDoc = querySnapshot.docs[0];
      const sessionData = sessionDoc.data() as DocumentData;
      setSession({
        sessionDoc: sessionDoc.id,
        sessionId: sessionData.sessionId,
        sessionName: sessionData.sessionName,
        filePath: sessionData.filePath,
        time: sessionData.timestamp.toDate().toLocaleTimeString(),
        date: sessionData.timestamp.toDate().toDateString(),
        userId: sessionData.userId,
      });
      setIsLoading(false);

      const usersRef = collection(firestore, 'sessions', sessionDoc.id, 'users');
      onSnapshot(usersRef, async snapshot => {
        const usersDataPromises = snapshot.docs.map(async doc => {
          const basicUserData: {
            name: string;
            connected: boolean;
            joinedAt: Timestamp;
            quitedAt: Timestamp;
          } = doc.data() as {
            name: string;
            connected: boolean;
            joinedAt: Timestamp;
            quitedAt: Timestamp;
          };
          const additionalUserInfo = await userInfoQuery(doc.id);

          if (!additionalUserInfo) {
            return undefined; // explicitly return undefined
          }

          return {
            docId: doc.id,
            name: additionalUserInfo.fullName,
            imageUrl: additionalUserInfo.imageUrl,
            email: additionalUserInfo.email,
            connected: basicUserData.connected,
            joinedAt: basicUserData.joinedAt
              ? (basicUserData.joinedAt.toDate().toLocaleTimeString() as string)
              : undefined,
            quitedAt: basicUserData.quitedAt
              ? (basicUserData.quitedAt.toDate().toLocaleTimeString() as string)
              : null,
          };
        });

        const combinedUsersData = (await Promise.all(usersDataPromises)).filter(
          user => user !== undefined,
        ) as User[];
        setUsers(combinedUsersData);
      });
    });

    return () => {
      if (unsubscribeSession) {
        unsubscribeSession();
      }
    };
  }, [user, firestore, router, setSession]);

  const handleQuit = async (docId: string) => {
    if (!docId || !sessionDoc) {
      toast({
        variant: 'destructive',
        title: 'An internal error occured',
        description: 'Please try again',
      });
      return;
    }

    try {
      const userDocRef = doc(firestore, `sessions/${sessionDoc.id}/users`, docId);
      await updateDoc(userDocRef, {
        connected: false,
        quitedAt: serverTimestamp(),
      });
    } catch (error) {
      toast({ variant: 'destructive', description: 'Error quitting session' });
    }
  };

  const handleAdd = async (docId: string) => {
    if (!docId || !sessionDoc) {
      toast({
        variant: 'destructive',
        title: 'An internal error occured',
        description: 'Please try again',
      });
      return;
    }

    try {
      const userDocRef = doc(firestore, `sessions/${sessionDoc.id}/users`, docId);
      await updateDoc(userDocRef, {
        connected: true,
        quitedAt: null,
      });
    } catch (error) {
      toast({ variant: 'destructive', description: 'Error adding user to session' });
    }
  };

  const renderCell = React.useCallback((user: User, columnKey: React.Key) => {
    switch (columnKey) {
      case 'name':
        return (
          <User
            name={user.name}
            avatarProps={{ radius: 'lg', src: user.imageUrl }}
            description={user.email}></User>
        );
      case 'disconnect':
        return (
          <div className="relative flex items-center">
            <p>{user.quitedAt}</p>
          </div>
        );
      case 'connect':
        return (
          <div className="relative flex items-center">
            <p>{user.joinedAt}</p>
          </div>
        );
      case 'status':
        return (
          <Chip
            className="capitalize"
            color={user.connected ? 'success' : 'danger'}
            size="sm"
            variant="flat">
            {user.connected ? 'Active' : 'Disconnected'}
          </Chip>
        );
      case 'actions':
        return (
          <div className="flex justify-center items-center">
            {!user.connected ? (
              <span
                className="text-lg text-success-400 cursor-pointer active:opacity-50"
                onClick={() => handleAdd(user.docId)}>
                <Icons.editIcon />
              </span>
            ) : (
              <span
                className="text-lg text-danger cursor-pointer active:opacity-50"
                onClick={() => handleQuit(user.docId)}>
                <Icons.deleteIcon />
              </span>
            )}
          </div>
        );
      default:
        return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Table
      classNames={classNames}
      className="text-gray-100 items-center"
      aria-label="Participants table">
      <TableHeader columns={columns}>
        {(column: { uid: string; name: string }) => (
          <TableColumn key={column.uid} align={column.uid === 'actions' ? 'center' : 'start'}>
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        emptyContent={'No one is connected to the session for now'}
        items={users.map((user, index) => ({ ...user, id: index }))}>
        {(item: {
          id: any;
          docId: string;
          connected: boolean;
          joinedAt: string | undefined;
          quitedAt?: string | null;
          email: string;
          imageUrl: string;
          name: string;
        }) => (
          <TableRow key={item.id}>
            {(columnKey: React.Key) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
export default DashTable;
