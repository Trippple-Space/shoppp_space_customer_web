export interface User {
    email: string;
    id: number;
    lastLoginAt: Date;
    meta?: any
    mobile?: string
    settings?: any
    username: string
    profile: UserProfile
}

export interface UserProfile {
    firstName: string,
    lastName: string,
    gender: string,
}