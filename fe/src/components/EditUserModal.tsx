import { useCallback, useRef } from "react";

interface EditUserModalProps {
    editUserId: number | null;
    handleUpdateUser: (reqBody: { nickname: string; steamId?: number }) => void;
    setEditUserId: (id: number | null) => void;
}

export const EditUserModal = ({ editUserId, handleUpdateUser, setEditUserId }: EditUserModalProps) => {
    const nicknameRef = useRef<HTMLInputElement>(null);
    const steamIdRef = useRef<HTMLInputElement>(null);

    const submitHandler = useCallback(() => {
        let reqBody: { nickname: string; steamId?: number } = { nickname: nicknameRef.current?.value as string };
        if (steamIdRef.current?.value) {
            if (String(+steamIdRef.current?.value) === steamIdRef.current?.value) {
                reqBody.steamId = Number(steamIdRef.current?.value);
            }
        }

        handleUpdateUser(reqBody);
    }, [nicknameRef, steamIdRef, handleUpdateUser]);
    return (
        <>
            {editUserId && <div className='fixed top-0 left-0 w-full h-full flex justify-center items-center'>
                <div className="bg-black opacity-70 absolute inset-0"  onClick={() => setEditUserId(null)}> </div>
                    <div className='z-10 flex flex-col gap-2 p-2 m-2 min-w-md bg-white text-black rounded-md'>
                        <input type="text" className='border-2 border-gray-500 p-2 rounded-md' placeholder='Enter user nickname' ref={nicknameRef} />
                        <input type="text" className='border-2 border-gray-500 p-2 rounded-md' placeholder='Enter your steamId' ref={steamIdRef} />
                        <button className='cursor-pointer bg-blue-500 text-white p-2 rounded-md' onClick={submitHandler}>Update</button>
                        <button className='cursor-pointer bg-red-500 text-white p-2 rounded-md' onClick={() => setEditUserId(null)}>Cancel</button>
                    </div>
            </div>}
        </>
    )
}