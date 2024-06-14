import React from 'react';

import { Button } from '@/components/ui/button';
import { auth } from '@/firebase/firebase';
import { useSignOut } from 'react-firebase-hooks/auth';
import { FiLogOut } from 'react-icons/fi';

import { ToastAction } from '../ui/toast';
import { ToolTip } from '../ui/tooltip';
import { useToast } from '../ui/use-toast';

const Logout: React.FC = () => {
  const [signOut] = useSignOut(auth);
  const { toast } = useToast();

  const handleSignOut = async () => {
    toast({
      title: 'Sign Out',
      description: 'You will be signed out of your account.',
      action: (
        <ToastAction altText="signOut" onClick={signOut}>
          Sign Out
        </ToastAction>
      ),
    });
  };
  return (
    <ToolTip message="Logout">
      <Button size="icon" variant="outline" onClick={handleSignOut}>
        <FiLogOut />
      </Button>
    </ToolTip>
  );
};
export default Logout;
