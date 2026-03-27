import type { User } from "../types"
import type { UserRole } from '../auth/AuthContext';

export const UserRow = ({ user, handleDeleteUser, setEditUserId, authUserRole }: { user: User, handleDeleteUser: (id: number) => void, setEditUserId: (id: number) => void, authUserRole?: UserRole }) => {
    return (
        <div className='flex justify-between  border-b border-gray-500 p-2'>
            <div className='flex gap-2 '>
                <div className="w-[300px]">{user.nickname}</div>
                <div className="w-[300px]">
                    {/* link to steam profile */}
                    <a href={`https://steamcommunity.com/profiles/${user.steamId}`} className="font-medium text-fg-brand hover:underline">{user.steamId}</a>
                </div>
            </div>
            <div className='flex gap-2'>
                {authUserRole === 'admin' && (
                    <>
                        <button className='cursor-pointer bg-red-500 text-white p-2 rounded-md' onClick={() => handleDeleteUser(user.id)}>Delete</button>
                        <button className='cursor-pointer bg-blue-500 text-white p-2 rounded-md' onClick={() => setEditUserId(user.id)}>Edit</button>
                    </>
                )}
            </div>
        </div>
    )
}