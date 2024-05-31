"use client"
import { useSession } from 'next-auth/react'
import React from 'react'
import FriendSkeleton from './FriendSkeleton'

export default function FriendsSkeleton() {
    const { data: session } = useSession()

    const friendsCount = session?.user.friendsCount as number
    
    return (
        <div className="flex flex-col space-y-2">
            { 
                friendsCount !== 0 
                &&
                Array.from({ length: friendsCount! }).map((_, i) => (
                    <FriendSkeleton key={i} />
                ))
            }
        </div>
    )
}
