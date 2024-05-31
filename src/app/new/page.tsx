import React, { Suspense } from 'react'
import Friends from './components/Friends'
import FriendsSkeleton from './components/FriendsSkeleton'
import getUserFriends from '../libs/getUserFriends'
import { getChats } from '../actions'

export default async function page() {
    const friends = await getUserFriends()
    const chats = await getChats()

    return (
        <div className="flex flex-col gap-3 w-full p-2 border h-[calc(100vh-100px)] border-gray-700 rounded-xl mx-4 my-7">
            <h1 className="text-2xl text-center">New Conversation</h1>
            <Suspense fallback={<FriendsSkeleton />}>
                {/* @ts-ignore */}
                <Friends friends={friends} chats={chats} />
            </Suspense> 
        </div>
    )
}
