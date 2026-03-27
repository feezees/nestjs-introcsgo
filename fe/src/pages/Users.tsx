import axios from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';
import { EditUserModal } from '../components/EditUserModal';
import { UserRow } from '../components/UserRow';
import '../index.css';
import type { User } from '../types';

function Users() {
    const [users, setUsers] = useState<User[] | 'loading' | 'error'>('loading');

    const nicknameRef = useRef<HTMLInputElement>(null);
    const steamIdRef = useRef<HTMLInputElement>(null);

    const [editUserId, setEditUserId] = useState<number | null>(null);

    const handleGetUsers = useCallback(async () => {
        axios.get('http://localhost:3000/users', {
            withCredentials: true,
        }).then((response) => {
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

        axios.post('http://localhost:3000/users', reqBody, {
            withCredentials: true,
        }).then((response) => {
            console.log(response.data);
            handleGetUsers();
        }).catch((error) => {
            console.log(error);
        })
    }, [nicknameRef, steamIdRef, handleGetUsers]);

    const handleDeleteUser = useCallback(async (id: number) => {
        axios.delete(`http://localhost:3000/users/${id}`, {
            withCredentials: true,
        }).then((response) => {
            console.log(response.data);
            handleGetUsers();
        }).catch((error) => {
            console.log(error);
        })
    }, [handleGetUsers]);

    const handleUpdateUser = useCallback(async (reqBody: { nickname: string; steamId?: number }) => {
        axios
            .put(`http://localhost:3000/users/${editUserId}`, reqBody, { withCredentials: true })
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
            <div className='flex gap-2 p-2 m-2'>
                <input type="text" className='border-2 border-gray-500 p-2 rounded-md' placeholder='Enter user nickname' ref={nicknameRef} />
                <input type="text" className='border-2 border-gray-500 p-2 rounded-md' placeholder='Enter your steamId' ref={steamIdRef} />
                <button className='cursor-pointer bg-blue-500 text-white p-2 rounded-md' onClick={handleAddUser}>Add</button>
            </div>

            {users === 'loading' && <div>Loading...</div>}
            {users === 'error' && <div>Get users Error</div>}

            <EditUserModal editUserId={editUserId} handleUpdateUser={handleUpdateUser} setEditUserId={setEditUserId} />

            <div className='flex flex-col gap-2 p-2 m-2'>
                {users instanceof Array && users.map((user) => (
                    <UserRow key={user.id} user={user} handleDeleteUser={handleDeleteUser} setEditUserId={setEditUserId} />
                ))}
            </div>
        </>
    );
}

export default Users;
