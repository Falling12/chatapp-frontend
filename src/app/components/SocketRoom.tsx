"use client"
import React, { useEffect, useState } from 'react'
import { useSocket } from '../SocketProvider'

export default function SocketRoom() {
    const socket = useSocket()
    const [room, setRoom] = useState('')
    const [message, setMessage] = useState('')

    useEffect(() => {
        if (socket) {
            socket.on('message', (message) => {
                setMessage(message)
            })
        }
    }, [socket])

    return (
        <div>
            <input type="text" onChange={(e) => {
                setRoom(e.target.value)
            }} />

            <button onClick={() => {
                socket?.emit('join-room', room)
            }}>Join room</button>

            {message}
        </div>
    )
}
