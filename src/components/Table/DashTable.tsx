import React, { useEffect, useState } from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Chip,
  Tooltip,
} from '@nextui-org/react';
import { EditIcon } from './EditIcon';
import { DeleteIcon } from './DeleteIcon';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore } from '@/firebase/firebase';
import {
  collection,
  getDocs,
  query,
  where,
  Timestamp,
  DocumentData,
  onSnapshot,
  Unsubscribe,
  doc,
  updateDoc,
  serverTimestamp,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import { useRouter } from 'next/router';
import Loadin from '../Loading/Loading';
import { toast } from 'sonner';

type Session = {
  sessionId: string;
  sessionName: string;
  filePath: string;
  time: string;
  date: string;
  userId: string;
};

type User = {
  docId: string;
  name: string;
  connected: boolean;
  joinedAt: string | undefined;
  quitedAt?: string | null;
};

const columns = [
  { name: 'NAME', uid: 'name' },
  { name: 'STATUS', uid: 'status' },
  { name: 'CONNECTED', uid: 'connect' },
  { name: 'DISCONNECTED', uid: 'disconnect' },
  { name: 'ACTIONS', uid: 'actions' },
];

type DashTableProps = {};

const DashTable: React.FC<DashTableProps> = () => {
  const [user] = useAuthState(auth);
  const [session, setSession] = useState<Session | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
    if (!user) {return;}
    let unsubscribeUsers: Unsubscribe | undefined;

    const fetchSession = async () => {
      try {
        setIsLoading(true);
        const sessionsQuery = query(
          collection(firestore, 'sessions'),
          where('userId', '==', user.email),
        );
        const querySnapshot = await getDocs(sessionsQuery);

        if (querySnapshot.empty) {
          toast.error('You don\'t have any open session.');
          return;
        }

        sessionDoc = querySnapshot.docs[0];
        const sessionData = sessionDoc.data() as DocumentData;
        setSession({
          sessionId: sessionData.sessionId,
          sessionName: sessionData.sessionName,
          filePath: sessionData.filePath,
          time: sessionData.timestamp.toDate().toLocaleTimeString(),
          date: sessionData.timestamp.toDate().toDateString(),
          userId: sessionData.userId,
        });

        const usersRef = collection(
          firestore,
          'sessions',
          sessionDoc.id,
          'users',
        );
        return onSnapshot(usersRef, snapshot => {
          const usersData: User[] = snapshot.docs.map(doc => {
            const userData = doc.data() as DocumentData;
            const quitedAt = userData.quitedAt
              ? userData.quitedAt.toDate().toLocaleTimeString()
              : null;
            return {
              docId: doc.id,
              name: userData.name,
              connected: userData.connected,
              joinedAt: userData.joinedAt.toDate().toLocaleTimeString(),
              quitedAt,
            };
          });
          setUsers(usersData);
        });
      } catch (e) {
        toast.error('An error occurred while fetching session details.');
      } finally {
        setIsLoading(false);
      }
    };

    (async () => {
      unsubscribeUsers = await fetchSession();
    })();

    return () => {
      if (unsubscribeUsers) {unsubscribeUsers();}
    };
  }, [user]);

  const handleQuit = async (docId: string) => {
    if (!docId || !sessionDoc) {
      toast.warning('An internal error occured');
      return;
    }

    try {
      const userDocRef = doc(
        firestore,
        `sessions/${sessionDoc.id}/users`,
        docId,
      );
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
      const userDocRef = doc(
        firestore,
        `sessions/${sessionDoc.id}/users`,
        docId,
      );
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
        return <User name={cellValue}></User>;
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
            variant="flat"
          >
            {user.connected ? 'Active' : 'Disconnected'}
          </Chip>
        );
      case 'actions':
        return (
          <div className="relative items-center gap-2">
            {!user.connected ? (
              <Tooltip color="success" content="Edit user">
                <span
                  className="text-lg text-success-400 cursor-pointer active:opacity-50"
                  onClick={() => handleAdd(user.docId)}
                >
                  <EditIcon />
                </span>
              </Tooltip>
            ) : (
              <Tooltip color="danger" content="Remove user">
                <span
                  className="text-lg text-danger cursor-pointer active:opacity-50"
                  onClick={() => handleQuit(user.docId)}
                >
                  <DeleteIcon />
                </span>
              </Tooltip>
            )}
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  if (isLoading) {return <Loadin />;}

  return (
    <Table
      classNames={classNames}
      className="text-gray-100 items-center"
      aria-label="Example table with custom cells"
    >
      <TableHeader columns={columns}>
        {(column: { uid: string; name: any }) => (
          <TableColumn
            key={column.uid}
            align={column.uid === 'actions' ? 'center' : 'start'}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={users.map((user, index) => ({ ...user, id: index }))}>
        {(item: {
          id: any;
          name?: string;
          connected?: boolean;
          joinedAt?: string;
          quittedAt?: string;
        }) => (
          <TableRow key={item.id}>
            {(columnKey: React.Key) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
export default DashTable;
