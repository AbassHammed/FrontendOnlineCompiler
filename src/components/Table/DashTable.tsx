/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/router';

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
  Tooltip,
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
import { toast } from 'sonner';

import Loadin from '../Loading/Loading';
import { DeleteIcon } from './DeleteIcon';
import { EditIcon } from './EditIcon';

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
        toast.error("You don't have any open session.");
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
        );
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
      toast.warning('An internal error occured');
      return;
    }

    try {
      const userDocRef = doc(firestore, `sessions/${sessionDoc.id}/users`, docId);
      await updateDoc(userDocRef, {
        connected: false,
        quitedAt: serverTimestamp(),
      });
    } catch (error) {
      toast.error('Error quitting session');
    }
  };

  const handleAdd = async (docId: string) => {
    if (!docId || !sessionDoc) {
      toast.warning('An internal error occured');
      return;
    }

    try {
      const userDocRef = doc(firestore, `sessions/${sessionDoc.id}/users`, docId);
      await updateDoc(userDocRef, {
        connected: true,
        quitedAt: null,
      });
    } catch (error) {
      toast.error('Error quitting session');
    }
  };

  const renderCell = React.useCallback((user: User, columnKey: React.Key) => {
    const cellValue = user[columnKey as keyof User];

    switch (columnKey) {
      case 'name':
        return (
          <User
            name={cellValue}
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
        return !user.connected ? (
          <Tooltip size="sm" color="success" content="Edit user">
            <span
              className="text-lg text-success-400 cursor-pointer active:opacity-50"
              onClick={() => handleAdd(user.docId)}>
              <EditIcon />
            </span>
          </Tooltip>
        ) : (
          <Tooltip size="sm" color="danger" content="Remove user">
            <span
              className="text-lg text-danger cursor-pointer active:opacity-50"
              onClick={() => handleQuit(user.docId)}>
              <DeleteIcon />
            </span>
          </Tooltip>
        );
      default:
        return cellValue;
    }
  }, []);

  if (isLoading) {
    return <Loadin />;
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
