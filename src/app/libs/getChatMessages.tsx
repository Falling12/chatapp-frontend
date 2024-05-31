"use client"

export const getChatMessages = async (chatId: string, beforeId: string, token: string, limit: number) => {
    const res = await fetch(`http://192.168.1.244:8000/api/chats/${chatId}?beforeId=${beforeId}&limit=${limit}`, {
        headers: {
            'authorization': token,
            'Content-Type': 'application/json'
        }
    })

    // handle unauthorized
    if (res.status === 401) {
        return []
    }

    const { data } = await res.json()

    return data
}