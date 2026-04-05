import { Link } from "react-router-dom"
import { Background } from "./Background"
import { useAuth } from "../auth/AuthContext"

const navItems = [
    {
        label: "users",
        path: "/",
    },
    {
        label: "items",
        path: "/items",
    },
    {
        label: "chat",
        path: "/chat",
    }
]

export const Layout = ({ children }: { children: React.ReactNode }) => {
    const { user, logout, loading } = useAuth()

    return (
        <div className="flex flex-col items-center justify-center  text-white w-full">
            <nav className="w-screen flex flex-wrap items-center justify-between p-4 gap-2 border-b border-gray-500">
                <div className="flex gap-4">
                    {navItems.map((item) => (
                        <Link key={item.path} className="text-gray-300 hover:text-white" to={item.path}>{item.label}</Link>
                    ))}
                </div>
                <div className="flex items-center gap-3 text-sm">
                    {!loading && user && (
                        <>
                            <Link className="text-gray-300 hover:text-white" to={`/profile/${user.id}`}>{user.nickname}</Link>
                            <button type="button" className="text-gray-300 hover:text-white cursor-pointer" onClick={() => logout()}>
                                выход
                            </button>
                        </>
                    )}
                    {!loading && !user && (
                        <>
                            <Link className="text-gray-300 hover:text-white" to="/login">вход</Link>
                            <Link className="text-gray-300 hover:text-white" to="/register">регистрация</Link>
                        </>
                    )}
                </div>
            </nav>
            <Background />
            <div className='min-h-[100%] w-full p-4'>
                {children}
            </div>
        </div>
    )
}