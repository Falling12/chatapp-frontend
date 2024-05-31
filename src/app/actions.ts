"use server"

import { getServerSession } from "next-auth";
import { revalidatePath, revalidateTag } from "next/cache"
import { authOptions } from "./utils/auth";

export async function getChats() {
    const session = await getServerSession(authOptions);

    const res = await fetch('http://192.168.1.244:8000/api/chats/', {
        headers: {
            'authorization': session?.user.token as string,
            'Content-Type': 'application/json'
        },
        next: {
            tags: ['chats']
        }
    })

    // handle unauthorized
    if (res.status === 401) {
        return []
    }

    const { data } = await res.json()

    return data
}

export async function getUserNotifications() {
    const session = await getServerSession(authOptions);
    const res = await fetch('http://192.168.1.244:8000/api/user/friend-requests', {
        headers: {
            'Content-Type': 'application/json',
            'authorization': session?.user.token as string
        }
    })

    const { friendRequests } = await res.json()

    return friendRequests
}

export async function deleteChat(id: string, token: string) {
    const res = await fetch(`http://192.168.1.244:8000/api/chats/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'authorization': token
        }
    })

    revalidatePath('/', 'layout')
}

export async function newChat(userIds: string[], token: string) {
    const res = await fetch(`http://192.168.1.244:8000/api/chats`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': token
        },
        body: JSON.stringify({
            userIds: userIds,
            name: ''
        })
    })

    revalidatePath('/', 'layout')
}


export const clearCachesByServerAction = async (path: string) => {
    try {
        if (path) { 
            revalidateTag(path) 
        }
        else {
            revalidatePath("/")
        }
    } catch (error) {
        console.error("clearCachesByServerAction => ", error)
    }
}