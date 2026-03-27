import { Link } from "react-router-dom"

export const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen absolute top-0 left-0 w-full">
            <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
            <p className="text-lg">The page you are looking for does not exist.</p>
            <Link to="/" className="text-blue-500 hover:text-blue-700">Go back to the home page</Link>
        </div>
    )
}