"use client"
import React, { useEffect, useState, useRef } from 'react';
import Chat from './Chat';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';

export default function Chats(
    { chats }: { chats: any[] }
) {
    const { data: session } = useSession();
    const params = useParams<{ id: string }>();
    const [activeChatId, setActiveChatId] = useState(params.id || '');
    const [indicatorTop, setIndicatorTop] = useState(0);
    const chatRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        setActiveChatId(params.id);
    }, [params.id]);

    useEffect(() => {
        const activeIndex = chats.findIndex(chat => chat.id === activeChatId);
        if (activeIndex !== -1 && chatRefs.current[activeIndex]) {
            const activeChatElement = chatRefs.current[activeIndex];
            const { offsetTop, offsetHeight } = activeChatElement!;
            setIndicatorTop(offsetTop + offsetHeight / 2 - 12);
        }
    }, [activeChatId, chats]);

    return (
        <div className='chats relative'>
            {
                activeChatId && (
                    <div className='w-1.5 h-6 bg-blue-500 rounded-full' style={{
                        boxShadow: '0 0 10px 0px #0066FF',
                        position: 'absolute',
                        top: indicatorTop,
                        left: 0,
                        transition: 'top 0.3s',
                    }}></div>
                )
            }

            <div className='flex flex-col gap-3'>
                {chats ? chats.map((chat: any, index: number) => (
                    <Chat
                        key={chat.id}
                        name={chat.users.length > 2 ? chat.name : chat.users.filter((user: any) => user.id !== session?.user.id)[0].name}
                        id={chat.id}
                        image={chat.users.filter((user: any) => user.id !== session?.user.id)[0].imageUrl}
                        lastMessage={chat.messages.length > 0 ? chat.messages[chat.messages.length - 1] : 'No messages yet...'}
                        isOnline={chat.online}
                        users={chat.users}
                        ref={el => {
                            chatRefs.current[index] = el;
                        }}
                        onClick={() => setActiveChatId(chat.id)}
                        active={chat.id === activeChatId}
                    />
                ))
                    : <h1 className="text-2xl text-center">No chats yet...</h1>
                }
            </div>
        </div>
    )
}
