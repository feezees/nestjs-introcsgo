import { UserRole } from './auth/AuthContext';

export interface User {
    id: number;
    nickname: string;
    steamId?: number;
    role: UserRole;
}