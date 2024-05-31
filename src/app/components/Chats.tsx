"use client"
import React, { useEffect } from 'react'
import Chat from './Chat';
import { useSession } from 'next-auth/react';

export default function Chats(
    { chats }: { chats: any[] }
) {
    const { data: session } = useSession();

    return (
        <div className='chats'>
            {chats ? chats.map((chat: any) => (
                <Chat
                    key={chat.id}
                    name={chat.users.filter((user: any) => user.id !== session?.user.id)[0].name}
                    id={chat.id}
                    image={chat.users.filter((user: any) => user.id !== session?.user.id)[0].imageUrl}
                    lastMessage={chat.messages.length > 0 ? chat.messages[chat.messages.length - 1].text : 'No messages yet...'}
                />
            ))
            : <h1 className="text-2xl text-center">No chats yet...</h1>
            }
        </div>
    )
}
