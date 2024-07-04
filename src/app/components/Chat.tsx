"use client"
import React, { useEffect, forwardRef } from 'react';
import { useSocket } from '../SocketProvider';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

interface ChatProps {
    name: string;
    id: string;
    image: string;
    lastMessage: {
        text: string;
        createdAt: string;
    };
    isOnline: boolean;
    users: any[];
    onClick: () => void;
    active: boolean;
}

const Chat = forwardRef<HTMLDivElement, ChatProps>(({ name, id, image, lastMessage, isOnline, users, onClick, active }, ref) => {
    const socket = useSocket();
    const [online, setOnline] = React.useState(isOnline);
    const { data: session } = useSession();

    useEffect(() => {
        const online = users.some(user => user.id !== session?.user.id && user.online);
        setOnline(online);
    }, [users, session?.user.id]);

    useEffect(() => {
        socket?.on('friend-status', (data: { id: string, name: string, online: boolean }) => {
            if (users.some(user => user.id === data.id)) {
                setOnline(data.online);
            }
        });

        return () => {
            socket?.off('friend-status');
        };
    }, [socket, users]);

    const formatDateToPretty = (date: string) => {
        const d = new Date(date)
        const now = new Date()
        const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000)
        const diffInMinutes = Math.floor(diffInSeconds / 60)
        const diffInHours = Math.floor(diffInMinutes / 60)
        const diffInDays = Math.floor(diffInHours / 24)
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

        if (diffInSeconds < 60) {
            return `${diffInSeconds} seconds ago`
        } else if (diffInMinutes < 60) {
            return `${diffInMinutes} minutes ago`
        } else if (diffInHours < 24) {
            return `${diffInHours} hours ago`
        } else if (diffInDays < 7) {
            return `${daysOfWeek[d.getDay()]}`
        } else {
            return d.toLocaleDateString()
        }
    }

    return (
        <div ref={ref} className='flex items-center gap-2 w-full' style={{
            marginLeft: active ? '15px' : '0',
            width: active ? 'calc(100% - 15px)' : '100%',
            transition: 'margin-left 0.3s'
        }} onClick={onClick}>
            <div className='flex items-center gap-3 group hover:bg-black/30 p-2 rounded-xl cursor-pointer justify-between transition-all w-full' style={{
                background: active ? 'linear-gradient(45deg, #0041A380, #111827)' : 'linear-gradient(45deg, #1F2937, #111827)'
            }}>
                <Link href={`/chat/${id}`} className='w-full'>
                    <div className='flex items-center gap-3'>
                        <div className='relative w-10 h-10 rounded-full'>
                            <Image src={`http://192.168.1.231:8000${image}`} width={'40'} height={'40'} alt={name} className='w-10 h-10 rounded-full' />
                            {online && (
                                <div className='absolute w-3 h-3 bg-green-500 rounded-full bottom-0 right-0'></div>
                            )}
                        </div>
                        <div className='flex flex-col gap-1'>
                            <div className='font-bold text-lg group-hover:translate-x-2 transition-transform capitalize'>{name}</div>
                            <p className='text-sm text-gray-400 max-w-[300px] text-ellipsis whitespace-nowrap overflow-hidden'>{lastMessage.text} · {formatDateToPretty(lastMessage.createdAt)}</p>
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    );
});

Chat.displayName = 'Chat';

export default Chat;
