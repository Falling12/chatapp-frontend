import getUserFriends from '@/app/libs/getUserFriends'
import React from 'react'
import Friend from './Friend';
import { getChats } from '@/app/actions';

interface FriendsProps {
    friends: User[]
    chats: any[]
}

export default async function Friends(
    { friends, chats }: FriendsProps
) {
    // filter out friends that are already have conversations with, except the chats with more than 2 users
    const filteredFriends = friends.filter((friend: User) => {
        const chat = chats.find((chat: any) => chat.users.length === 2 && chat.users.find((user: any) => user.id === friend.id))
        return !chat
    })

    return (
        <div className='flex flex-col space-y-3'>
            {filteredFriends.map((friend: any) => (
                <Friend
                    key={friend.id}
                    name={friend.name}
                    id={friend.id}
                    imageUrl={friend.imageUrl}
                    friendsCount={friend.friendsCount}
                    email={friend.email}
                />
            ))}
        </div>
    )
}
