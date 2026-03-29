import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from 'react';
import { api } from '../api/client';

const TOKEN_KEY = 'access_token';
const USER_KEY = 'auth_user';

export type UserRole = 'admin' | 'user';
export type AuthUser = { nickname: string; role: UserRole };

type AuthContextValue = {
    user: AuthUser | null;
    token: string | null;
    loading: boolean;
    login: (nickname: string, password: string) => Promise<void>;
    register: (nickname: string, password: string, steamId?: number) => Promise<void>;
    logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const t = localStorage.getItem(TOKEN_KEY);
        const raw = localStorage.getItem(USER_KEY);
        if (t && raw) {
            setToken(t);
            try {
                setUser(JSON.parse(raw) as AuthUser);
            } catch {
                localStorage.removeItem(USER_KEY);
                localStorage.removeItem(TOKEN_KEY);
            }
        }
        setLoading(false);
    }, []);

    const persist = useCallback((access_token: string, u: AuthUser) => {
        localStorage.setItem(TOKEN_KEY, access_token);
        localStorage.setItem(USER_KEY, JSON.stringify(u));
        setToken(access_token);
        setUser(u);
    }, []);

    const login = useCallback(
        async (nickname: string, password: string) => {
            const { data } = await api.post<{ access_token: string; user: AuthUser }>(
                '/auth/login',
                { nickname, password },
            );
            persist(data.access_token, data.user);
        },
        [persist],
    );

    const register = useCallback(
        async (nickname: string, password: string, steamId?: number) => {
            const body: { nickname: string; password: string; steamId?: number } = {
                nickname,
                password,
            };
            if (steamId !== undefined && !Number.isNaN(steamId)) {
                body.steamId = steamId;
            }
            const { data } = await api.post<{ access_token: string; user: AuthUser }>(
                '/auth/register',
                body,
            );
            persist(data.access_token, data.user);
        },
        [persist],
    );

    const logout = useCallback(() => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setToken(null);
        setUser(null);
    }, []);

    const value = useMemo(
        () => ({
            user,
            token,
            loading,
            login,
            register,
            logout,
        }),
        [user, token, loading, login, register, logout],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return ctx;
}
