"use client"
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useSocket } from "../SocketProvider";
import { getUserNotifications } from "../actions";
import Image from "next/image";
import HamburgerMenu from "./HamburgerMenu";
import NavOption from "./NavOption";

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

export default function NavMenu({}) {
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]) as any[]
    const socket =  useSocket()
    const { data: session } = useSession();

    useEffect(() => {
        const getNotifications = async () => {
            const get = await getUserNotifications()

            setNotifications(get)
        }

        getNotifications()
    }, [])

    useEffect(() => {
        socket?.on('friend-request', (data) => {
            setNotifications((n: any) => [...n, data.friendRequest])
        })

        return () => {
            socket?.off('friend-request')
        }
    }, [socket])

    const manageRequest = (id: string, status: string) => {
        socket?.emit('friend-request-response', {
            friendRequestId: id,
            status
        })

        setNotifications((n: any) => n.filter((notification: any) => notification.id !== id))
    }

    return (
        <header className="w-full bg-[#111827] items-center gap-2 p-4 flex justify-between fixed top-0  z-10">
            <div className="flex items-center gap-2">
                <HamburgerMenu />
                <Link href="/">
                    👋 Welcome, {session?.user.name}!
                </Link>
            </div>

            <div className="flex items-center bg-[#1F2937] rounded-2xl px-4 py-2 gap-1">
                <input type="text" placeholder="Search..." className="bg-transparent text-white focus:outline-none" />

                <div className="bg-[#111827] rounded-lg p-1 cursor-pointer text-[12px] font-bold text-white/70">
                    CTRL+Q
                </div>
            </div>

            {/* <div className="flex gap-3 items-center">
                <svg className="cursor-pointer" onClick={() => setShowNotifications(!showNotifications)} fill="white" height="24" id="Layer_1" version="1.1" viewBox="0 0 512 512" width="24" xmlns="http://www.w3.org/2000/svg">
                    <g>
                        <path d="M381.7,225.9c0-97.6-52.5-130.8-101.6-138.2c0-0.5,0.1-1,0.1-1.6c0-12.3-10.9-22.1-24.2-22.1c-13.3,0-23.8,9.8-23.8,22.1   c0,0.6,0,1.1,0.1,1.6c-49.2,7.5-102,40.8-102,138.4c0,113.8-28.3,126-66.3,158h384C410.2,352,381.7,339.7,381.7,225.9z" />
                        <path d="M256.2,448c26.8,0,48.8-19.9,51.7-43H204.5C207.3,428.1,229.4,448,256.2,448z" />
                    </g>
                </svg>

                {
                    showNotifications && (
                        <div className="absolute right-0 top-[100%] bg-gray-900/60 backdrop-blur-lg w-[400px] rounded-xl border border-gray-700 flex flex-col">
                            <div className="flex items-center justify-between border-b border-gray-700 p-2">
                                <h1 className="text-lg">Notifications</h1>
                                <button className="text-sm text-blue-500">Mark all as read</button>
                            </div>

                            <div className="flex flex-col gap-2 p-2 overflow-y-auto max-h-[300px]">
                               {
                                    notifications.map((notification: any, index: number) => (
                                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-700 rounded-xl">
                                            <div className="flex items-center gap-2">
                                                <Image src={`http://192.168.1.231:8000${notification.sender.imageUrl}`} width={'40'} height={'40'} alt="pfp" className="w-10 h-10 rounded-full" />
                                                <div className="flex flex-col gap-1">
                                                <h1 className="text-lg">{notification.sender.name}</h1>
                                                <p className="text-gray-400">{notification.sender.email}</p>
                                                </div>
                                            </div>

                                            <div className="flex gap-2">
                                                <button className="bg-green-500 hover:bg-green-600 text-white rounded-xl px-3 py-1" onClick={() => manageRequest(notification.id, 'accepted')}>Accept</button>
                                                <button className="bg-red-500 hover:bg-red-600 text-white rounded-xl px-3 py-1" onClick={() => manageRequest(notification.id, 'rejected')}>Decline</button>
                                            </div>
                                    </div>
                                    ))
                               }
                            </div>
                        </div>
                    )
                }

                <div className="flex gap-2">
                    <AuthButton />
                </div>
            </div> */}

            <div className="flex items-center gap-2">
                <NavOption 
                    icon={<svg width="25" height="26" viewBox="0 0 25 26" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.4998 20.269V15.034H14.611V20.269C14.611 20.8448 15.0735 21.316 15.6387 21.316H18.7221C19.2873 21.316 19.7498 20.8448 19.7498 20.269V12.94H21.4971C21.9698 12.94 22.196 12.3432 21.8362 12.0291L13.244 4.14516C12.8535 3.78918 12.2573 3.78918 11.8668 4.14516L3.27457 12.0291C2.92512 12.3432 3.14095 12.94 3.61373 12.94H5.36095V20.269C5.36095 20.8448 5.82345 21.316 6.38873 21.316H9.47207C10.0373 21.316 10.4998 20.8448 10.4998 20.269Z" fill="white"/></svg>}
                    title={'Home'}
                    url={'/'}
                    active={true}
                />

                <AuthButton />
            </div>
        </header>
    )
}