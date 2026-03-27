import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function Login() {
    const { login, user } = useAuth();
    const navigate = useNavigate();
    const [nickname, setNickname] = useState('');
    const [password, setPassword] = useState('');
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
            await login(nickname, password);
            navigate('/', { replace: true });
        } catch {
            setError('Неверный ник или пароль');
        }
    };

    return (
        <div className="flex flex-col items-center gap-4 p-8 max-w-sm mx-auto">
            <h1 className="text-xl font-semibold text-white">Вход</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">
                <input
                    type="text"
                    className="border-2 border-gray-500 p-2 rounded-md bg-black/40 text-white"
                    placeholder="Ник"
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
                    autoComplete="current-password"
                    required
                    minLength={6}
                />
                {error && <p className="text-red-400 text-sm">{error}</p>}
                <button
                    type="submit"
                    className="cursor-pointer bg-blue-600 text-white p-2 rounded-md hover:bg-blue-500"
                >
                    Войти
                </button>
            </form>
            <p className="text-gray-400 text-sm">
                Нет аккаунта?{' '}
                <Link to="/register" className="text-blue-400 hover:underline">
                    Регистрация
                </Link>
            </p>
        </div>
    );
}
