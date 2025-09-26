'use client';


import { useLayoutEffect, useState } from 'react';
import { protectedPaths } from '../paths';
import { authService } from '../services/auth.service';
import useUserStore from '../store/user.store';
import { useSignOut } from './use-sign-out';
import { usePathname } from 'next/navigation';


/**
 * 
 * TODO:
 * Deprecate this and use auth middleware in the future
 * 
 */
export const useAuthGuard = () => {
    const { user, isAuthenticated, authenticateUser } = useUserStore();
    const signOut = useSignOut()
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
                    signOut();
                }
            }
                setChecking(false)
        };
        checkAuth();
    }, [user, isAuthenticated, pathname]);
  
  return { user, checking }
};

