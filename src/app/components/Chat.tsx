"use client"
import React, { useEffect } from 'react'
import { useSocket } from '../SocketProvider';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import DeleteButton from './DeleteButton';
import Image from 'next/image';
import CallButton from './CallButton';

interface ChatProps {
    name: string;
    id: string;
    image: string;
    lastMessage: string;
}

export default function Chat({ name, id, image, lastMessage }: ChatProps) {
    const socket = useSocket()
    const [active, setActive] = React.useState(false)
    const params = useParams<{ id: string }>()

    const joinRoom = () => {
        socket?.emit('join-room', id)
    }

    useEffect(() => {
        if(params.id === id) {
            setActive(true)
        }

        return () => {
            setActive(false)
        }
    }, [params.id])

    return (
        <div className='flex items-center gap-3 group hover:bg-black/30 p-2 rounded-xl cursor-pointer justify-between transition-colors' style={{
            backgroundColor: active ? 'rgba(0, 0, 0, 0.3)' : 'transparent'
        }} onClick={() => joinRoom()}>
            <Link href={`/chat/${id}`} className='w-full'>
                <div className='flex items-center gap-3'>
                    <Image src={`http://192.168.1.231:8000${image}`} width={'40'} height={'40'} alt={name} className='w-10 h-10 rounded-full' />

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
