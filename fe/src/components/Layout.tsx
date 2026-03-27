import { Link } from "react-router-dom"
import { Background } from "./Background"

const navItems = [
    {
        label: "users",
        path: "/",
    }
]

export const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex flex-col items-center justify-center  text-white w-full">
            <nav className="w-screen flex p-4 gap-2 border-b border-gray-500">
                {navItems.map((item) => (
                    <Link key={item.path} className="text-gray-300 hover:text-white" to={item.path}>{item.label}</Link>
                ))}
            </nav>
            <Background />
            <div className='min-h-[100%] w-full'>
                {children}
            </div>
        </div>
    )
}