import { useEffect, useLayoutEffect, useState } from 'react';
import { protectedPaths } from '../paths';
import { authService } from '../services/auth.service';
import useUserStore from '../store/user.store';
import { usePathname } from 'next/navigation';
import { hydratePersonalizationFromApi } from '../store/personalization.store';


/**
 * 
 * TODO:
 * Deprecate this and use auth middleware in the future
 * 
 */
export const useAuthGuard = () => {
    const { user, isAuthenticated, authenticateUser } = useUserStore();
  const pathname = usePathname()
    const [checking, setChecking] = useState(true) 

    useLayoutEffect(() => {
        const checkAuth = async () => {
            if (!user || !isAuthenticated) {
                const authToken = authService.getAuthCredentials();
              if (authToken) {
                    const authUser = await authService.validateAuth();
                if (authUser) {
                  authenticateUser(authUser)
                  setChecking(false)
                  return
                }
                }
                if (!authToken && protectedPaths.includes(pathname)) {
                    setChecking(false)
                    return
                }
            }
                setChecking(false)
        };
        checkAuth();
    }, [user, isAuthenticated, pathname]);

    useEffect(() => {
      if (!isAuthenticated) {
        return;
      }

      hydratePersonalizationFromApi().catch(() => {
        // Offline fallback: keep local personalization flag / draft.
      });
    }, [isAuthenticated]);
  
  return { user, checking }
};

