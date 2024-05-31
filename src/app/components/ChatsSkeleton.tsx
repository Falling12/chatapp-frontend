"use client"
import React from 'react'
import FriendSkeleton from './ChatSkeleton'
import { useSession } from 'next-auth/react'

export default function ChatsSkeleton() {
    const { data: session } = useSession()

    const friendsCount = session?.user.friendsCount

    return (
        <div className="flex flex-col space-y-2">
            { 
                Array.from({ length: friendsCount! }).map((_, i) => (
                    <FriendSkeleton key={i} />
                ))
            }
        </div>
    )
}
