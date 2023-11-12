import { useEffect } from 'react';
import { paths, protectedPaths } from '../paths';
import { authService } from '../services/auth.service';
import useUserStore from '../store/user.store';
import { useRouteGuard } from './use-route-guard';
import { useSignOut } from './use-sign-out';
import { usePathname } from 'next/navigation';

export const useAuthGuard = () => {
    const { user, isAuthenticated, authenticateUser } = useUserStore();
    const signOut = useSignOut()
    const pathname = usePathname()
    useEffect(() => {
        const checkAuth = async () => {
            if (!user || !isAuthenticated) {
                const authToken = authService.getAuthCredentials();
                if (authToken) {
                    const authUser = await authService.validateAuth();
                    if (authUser) {
                        return authenticateUser(authUser)
                    }
                }
                console.log({protectedPaths, pathname})
                if (!authToken && protectedPaths.includes(pathname) ) {
                    signOut();
                }
            }
        };

        checkAuth();
    }, [user, isAuthenticated, pathname]);

    return null;
};

