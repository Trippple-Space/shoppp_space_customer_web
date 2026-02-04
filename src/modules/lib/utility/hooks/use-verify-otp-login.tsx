import { useState } from 'react';
import { authService } from '../services/auth.service';
import useUserStore from '@/store/user.store';

export const useVerifyOtpLogin = (onSuccess?: () => void) => {
  const [loading, setLoading] = useState(false);
  const { authenticateUser } = useUserStore();

  const verifyOtp = async (otp: string, token: string) => {
    setLoading(true);
    try {
      const { token: authToken, user } = await authService.verifyOtpLogin({
        otp,
        token,
      });

      authenticateUser(user);
      onSuccess?.();

      return user;
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return { verifyOtp, loading };
};
