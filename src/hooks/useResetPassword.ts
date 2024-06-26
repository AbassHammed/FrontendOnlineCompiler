import { useState } from 'react';

import { auth } from '@/firebase/firebase';
import { confirmPasswordReset } from 'firebase/auth';

export const useResetPassword = () => {
  const [error, setError] = useState<Error | null>(null);
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [loading, setLoading] = useState(false);

  const resetPassword = async (oobCode: string, newPassword: string) => {
    setLoading(true);

    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      setIsSuccessful(true);
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  return { resetPassword, error, isSuccessful, loading };
};
