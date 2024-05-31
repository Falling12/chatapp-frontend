"use client"
import React, { useTransition } from 'react'
import { useSession } from 'next-auth/react'
import { newChat } from '@/app/actions'
import Image from 'next/image'

export default function Friend(friend: User) {
    const { data: session } = useSession()

    const handleClick = async () => {
        await newChat([session!.user.id, friend.id], session!.user.token)
        
        document?.querySelector('.chats')?.dispatchEvent(new CustomEvent('fetchChats'))
    }

    return (
        <div className='flex w-full items-center bg-gray-900 rounded-xl p-3 gap-3 justify-between'>
            <div className='flex items-center gap-3'>
                <Image src={`http://192.168.1.244:8000${friend.imageUrl}`} width={'40'} height={'40'} alt='pfp' className="w-10 h-10 rounded-full" />

                <div className="flex flex-col gap-1">
                    <h1 className="text-xl">{friend.name}</h1>
                    <p className="text-gray-400">{friend.email}</p>
                </div>
            </div>

            {/* @ts-ignore */}
            <button onClick={() => handleClick()} className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl px-3 py-1 w-fit">New conversation</button>
        </div>
    )
}
