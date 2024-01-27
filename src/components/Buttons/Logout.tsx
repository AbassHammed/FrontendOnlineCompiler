import { auth } from '@/firebase/firebase';
import React from 'react';
import { Button, Tooltip } from '@nextui-org/react';
import { useSignOut } from 'react-firebase-hooks/auth';
import { FiLogOut } from 'react-icons/fi';

const Logout: React.FC = () => {
  const [signOut, loading, error] = useSignOut(auth);

  const handleLogout = () => {
    signOut();
  };
  return (
    <Tooltip content="Logout" color="danger">
      <Button size="sm" color="danger" isIconOnly onClick={handleLogout}>
        <FiLogOut />
      </Button>
    </Tooltip>
  );
};
export default Logout;
