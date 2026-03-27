import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function Register() {
    const { register, user } = useAuth();
    const navigate = useNavigate();
    const [nickname, setNickname] = useState('');
    const [password, setPassword] = useState('');
    const [steamId, setSteamId] = useState('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            navigate('/', { replace: true });
        }
    }, [user, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            let sid: number | undefined;
            if (steamId.trim()) {
                const n = Number(steamId.trim());
                if (String(n) !== steamId.trim()) {
                    setError('Steam ID должен быть числом');
                    return;
                }
                sid = n;
            }
            await register(nickname, password, sid);
            navigate('/', { replace: true });
        } catch (err: unknown) {
            const msg =
                err &&
                typeof err === 'object' &&
                'response' in err &&
                err.response &&
                typeof err.response === 'object' &&
                'data' in err.response &&
                err.response.data &&
                typeof err.response.data === 'object' &&
                'message' in err.response.data
                    ? String((err.response.data as { message: unknown }).message)
                    : 'Ошибка регистрации';
            setError(Array.isArray(msg) ? msg.join(', ') : msg);
        }
    };

    return (
        <div className="flex flex-col items-center gap-4 p-8 max-w-sm mx-auto">
            <h1 className="text-xl font-semibold text-white">Регистрация</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">
                <input
                    type="text"
                    className="border-2 border-gray-500 p-2 rounded-md bg-black/40 text-white"
                    placeholder="Ник (уникальный)"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    autoComplete="username"
                    required
                />
                <input
                    type="password"
                    className="border-2 border-gray-500 p-2 rounded-md bg-black/40 text-white"
                    placeholder="Пароль (мин. 6 символов)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                    minLength={6}
                />
                <input
                    type="text"
                    className="border-2 border-gray-500 p-2 rounded-md bg-black/40 text-white"
                    placeholder="Steam ID (необязательно)"
                    value={steamId}
                    onChange={(e) => setSteamId(e.target.value)}
                />
                {error && <p className="text-red-400 text-sm">{error}</p>}
                <button
                    type="submit"
                    className="cursor-pointer bg-green-600 text-white p-2 rounded-md hover:bg-green-500"
                >
                    Создать аккаунт
                </button>
            </form>
            <p className="text-gray-400 text-sm">
                Уже есть аккаунт?{' '}
                <Link to="/login" className="text-blue-400 hover:underline">
                    Войти
                </Link>
            </p>
        </div>
    );
}
