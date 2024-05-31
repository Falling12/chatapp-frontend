"use client"
import React from 'react'
import { useSocket } from '../SocketProvider'
import Image from 'next/image'

export default function User({
    friend
}: {
    friend: {
        name: string
        email: string
        imageUrl: string
        id: string
    }
}) {
    const socket = useSocket()

    const addFriend = () => {
        socket?.emit('friend-request', friend.id)
    }

    return (
        <div className="flex flex-col items-center gap-3 bg-black w-fit p-3 rounded-xl">
            <div className='flex items-center gap-3'>
                <Image src={`http://192.168.1.244:8000${friend.imageUrl}`} width={'40'} height={'40'} className="w-10 h-10 rounded-full" alt='pfp'/>

                <div className="flex flex-col gap-2">
                    <h1 className="text-xl">{friend.name}</h1>
                    <p className="text-gray-400">{friend.email}</p>
                </div>
            </div>

            <button className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl px-3 py-1 w-full" onClick={() => addFriend()}>Add Friend</button>
        </div>
    )
}
