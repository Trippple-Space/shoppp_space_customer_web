import { useEffect } from 'react';
import { paths } from '../paths';
import { authService } from '../services/auth.service';
import useUserStore from '../store/user.store';
import { useRouteGuard } from './use-route-guard';
import { useSignOut } from './use-sign-out';

export const useAuthGuard = () => {
    const { user, isAuthenticated, authenticateUser } = useUserStore();
    const signOut = useSignOut()

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
                if (!authToken) {
                    signOut();
                }
            }
        };

        checkAuth();
    }, [user, isAuthenticated]);

    return null;
};

