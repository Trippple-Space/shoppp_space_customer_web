import { useState } from 'react';
import { authService } from '../services/auth.service';
import useUserStore from '@/store/user.store';
import { syncGuestStateAfterAuth } from '../guest-session';
import { useCartStore } from '../store/cart.store';

export const useVerifyOtpLogin = (onSuccess?: () => void) => {
  const [loading, setLoading] = useState(false);
  const { authenticateUser } = useUserStore();
  const fetchCart = useCartStore((state) => state.fetchCart);

  const verifyOtp = async (otp: string, token: string) => {
    setLoading(true);
    try {
      const { token: authToken, user } = await authService.verifyOtpLogin({
        otp,
        token,
      });

      authenticateUser(user);
      await syncGuestStateAfterAuth(user.id);
      fetchCart();
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
