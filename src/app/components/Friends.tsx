import React from 'react'
import getUserFriends from '../libs/getUserFriends';

export default async function Friends() {
    const friends = await getUserFriends();

    return (
        <div>
            {friends.map((friend: any) => (
                <div key={friend.id}>
                    {friend.name}
                </div>
            ))}
        </div>
    )
}
