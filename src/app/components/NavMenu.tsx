"use client"
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { useSocket } from "../SocketProvider";
import { useEffect, useState } from "react";

function AuthButton() {
    const { data: session } = useSession();

    if (session) {
        return (
            <>
                {session?.user?.name}
                <button onClick={() => signOut()}>Sign out</button>
            </>
        )
    }

    return (
        <button onClick={() => signIn()}>Sign in</button>
    )
}

export default function NavMenu() {
    const socket = useSocket()
    const [message, setMessage] = useState('')
    
    useEffect(() => {
        if (socket) {
            socket.on('message', (message) => {
                setMessage(message)
            })
        }
    }, [socket])

    return (
        <div className="w-full bg-neutral-800 flex items-center gap-2 p-4">
            <AuthButton />

            {message}
        </div>
    )
}