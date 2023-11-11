import { authService } from '../services/auth.service';
import useUserStore from '../store/user.store';
import { paths } from '../paths';
import { useRouter } from 'next/navigation';

export const useSignOut = () => {
  const router = useRouter()
  const { deAuthenticateUser } = useUserStore();

  const signOut = () => {
    authService.signOut()
    deAuthenticateUser();
    router.push(paths.login);
  };

  return signOut;
};
