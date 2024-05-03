import React from 'react';

import { Button } from '@/components/ui/button';
import { auth } from '@/firebase/firebase';
import { useSignOut } from 'react-firebase-hooks/auth';
import { FiLogOut } from 'react-icons/fi';

import { ToolTip } from '../ui/tooltip';

const Logout: React.FC = () => {
  const [signOut] = useSignOut(auth);

  const handleLogout = () => {
    signOut();
  };
  return (
    <ToolTip message="Logout">
      <Button size="icon" variant="outline" onClick={handleLogout}>
        <FiLogOut />
      </Button>
    </ToolTip>
  );
};
export default Logout;
