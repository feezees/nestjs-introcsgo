import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '../api/client';
import { useAuth } from '../auth/AuthContext';
import { EditUserModal } from '../components/EditUserModal';
import { UserRow } from '../components/UserRow';
import '../index.css';
import type { User } from '../types';

function Users() {
    const [users, setUsers] = useState<User[] | 'loading' | 'error'>('loading');

    const nicknameRef = useRef<HTMLInputElement>(null);
    const steamIdRef = useRef<HTMLInputElement>(null);

    const [editUserId, setEditUserId] = useState<number | null>(null);

    const { user: authUser } = useAuth();

    const handleGetUsers = useCallback(async () => {
        api.get('/users').then((response) => {
            setUsers(response.data);
        }).catch(() => {
            setUsers('error');
        })
    }, []);

    const handleAddUser = useCallback(async () => {
        let reqBody: { nickname: string; steamId?: number } = { nickname: nicknameRef.current?.value as string };
        if (steamIdRef.current?.value) {
            if (String(+steamIdRef.current?.value) === steamIdRef.current?.value) {
                reqBody.steamId = Number(steamIdRef.current?.value);
            }
        }

        api.post('/users', reqBody).then((response) => {
            console.log(response.data);
            handleGetUsers();
        }).catch((error) => {
            console.log(error);
        })
    }, [nicknameRef, steamIdRef, handleGetUsers]);

    const handleDeleteUser = useCallback(async (id: number) => {
        api.delete(`/users/${id}`).then((response) => {
            console.log(response.data);
            handleGetUsers();
        }).catch((error) => {
            console.log(error);
        })
    }, [handleGetUsers]);

    const handleUpdateUser = useCallback(async (reqBody: { nickname: string; steamId?: number }) => {
        api
            .put(`/users/${editUserId}`, reqBody)
            .then((response) => {
                setEditUserId(null);
                console.log(response.data);
                handleGetUsers();
            })
            .catch((error) => {
                console.log(error);
            })
    }, [editUserId, handleGetUsers]);

    useEffect(() => {
        handleGetUsers();
    }, [handleGetUsers]);

    return (
        <>
            {authUser?.role === 'admin' && (
                <div className='flex gap-2 pb-2 mb-2'>
                    <input type="text" className='border-2 border-gray-500 p-2 rounded-md' placeholder='Enter user nickname' ref={nicknameRef} />
                    <input type="text" className='border-2 border-gray-500 p-2 rounded-md' placeholder='Enter your steamId' ref={steamIdRef} />
                    <button className='cursor-pointer bg-blue-500 text-white p-2 rounded-md' onClick={handleAddUser}>Add</button>
                </div>
            )}

            {users === 'loading' && <div>Loading...</div>}
            {users === 'error' && <div>Get users Error</div>}

            <EditUserModal editUserId={editUserId} handleUpdateUser={handleUpdateUser} setEditUserId={setEditUserId} />

            <div className='flex justify-between  border-b border-gray-500 p-2 ml-4'>
                <div className='flex gap-2'>
                    <div className="w-[300px]">nickname</div>
                    <div className="w-[300px]">steamId</div>
                </div>
            </div>

            <div className='flex flex-col gap-2 p-2 m-2'>
                {users instanceof Array && users.map((user) => (
                    <UserRow key={user.id} user={user} handleDeleteUser={handleDeleteUser} setEditUserId={setEditUserId} authUserRole={authUser?.role} />
                ))}
            </div>
        </>
    );
}

export default Users;
