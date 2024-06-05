"use client"
import React, { useEffect } from 'react'
import { useSocket } from '../SocketProvider';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import DeleteButton from './DeleteButton';
import Image from 'next/image';
import CallButton from './CallButton';
import { useSession } from 'next-auth/react';

interface ChatProps {
    name: string;
    id: string;
    image: string;
    lastMessage: string;
    isOnline: boolean;
    users: any[];
}

export default function Chat({ name, id, image, lastMessage, isOnline, users }: ChatProps) {
    const socket = useSocket()
    const [active, setActive] = React.useState(false)
    const params = useParams<{ id: string }>()
    const [online, setOnline] = React.useState(isOnline)
    const { data: session } = useSession();

    const joinRoom = () => {
        socket?.emit('join-room', id)
    }

    useEffect(() => {
        // Check if one user is online from the list of users except the current user
        const online = users.some(user => user.id !== session?.user.id && user.online)

        setOnline(online)

        if(params.id === id) {
            setActive(true)
        }

        return () => {
            setActive(false)
        }
    }, [params.id])

    useEffect(() => {
        socket?.on('friend-status', (data: { id: string, name: string, online: boolean }) => {
            console.log(data)
            if (users.some(user => user.id === data.id)) {
                setOnline(data.online)
            }
        })

        return () => {
            socket?.off('friend-status')
        }
    }, [socket])

    return (
        <div className='flex items-center gap-3 group hover:bg-black/30 p-2 rounded-xl cursor-pointer justify-between transition-colors' style={{
            backgroundColor: active ? 'rgba(0, 0, 0, 0.3)' : 'transparent'
        }} onClick={() => joinRoom()}>
            <Link href={`/chat/${id}`} className='w-full'>
                <div className='flex items-center gap-3'>
                    <div className='relative w-10 h-10 rounded-full'>
                        <Image src={`http://192.168.1.231:8000${image}`} width={'40'} height={'40'} alt={name} className='w-10 h-10 rounded-full' />

                        {
                            online && (
                                <div className='absolute w-3 h-3 bg-green-500 rounded-full bottom-0 right-0'></div>
                            )
                        }
                    </div>

                    <div className='flex flex-col gap-1'>
                        <div className='font-bold text-lg group-hover:translate-x-2 transition-transform capitalize'>{name}</div>
                        <p className='text-sm text-gray-400 max-w-[100px] text-ellipsis whitespace-nowrap overflow-hidden'>{lastMessage}</p>
                    </div>
                </div>

            </Link>
            
            <CallButton chatId={id} />
            <DeleteButton id={id} disabled={active} />
        </div>
    )
}
