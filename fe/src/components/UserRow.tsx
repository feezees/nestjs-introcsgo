import type { User } from "../types"

export const UserRow = ({ user, handleDeleteUser, setEditUserId }: { user: User, handleDeleteUser: (id: number) => void, setEditUserId: (id: number) => void }) => {
    return (
        <div className='flex justify-between  border-b border-gray-500 p-2'>
            <div className='flex gap-2 '>
                <div className="w-[300px]">{user.nickname}</div>
                <div className="w-[300px]">{user.steamId}</div>
            </div>
            <div className='flex gap-2'>
                <button className='cursor-pointer bg-red-500 text-white p-2 rounded-md' onClick={() => handleDeleteUser(user.id)}>Delete</button>
                <button className='cursor-pointer bg-blue-500 text-white p-2 rounded-md' onClick={() => setEditUserId(user.id)}>Edit</button>
            </div>
        </div>
    )
}