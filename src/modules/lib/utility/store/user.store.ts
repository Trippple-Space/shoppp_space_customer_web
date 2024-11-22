import { create } from 'zustand'
import { User } from '../types/user.interface';

interface UserStore {
    user: User | null,
    isAuthenticated: boolean,
    authenticateUser: (user: User) => void,
    deAuthenticateUser: () => void
}

const useUserStore = create<UserStore>((set) => ({
    user: null,
    isAuthenticated: false,
    authenticateUser: (user: User) => set({ isAuthenticated: true, user }),
    deAuthenticateUser: () => set({ isAuthenticated: false, user: null }),
}))

export default useUserStore;