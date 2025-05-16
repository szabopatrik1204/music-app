export enum UserRole {
    Admin = 'admin',
    Artist = 'artist',
    Listener = 'listener'
}

export interface User {
    email: string;
    name: string;
    address: string;
    nickname: string;
    password: string;
    role: UserRole;
}