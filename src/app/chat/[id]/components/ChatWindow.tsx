"use client"
import React, { useEffect, useState } from 'react'
import { useSocket } from '../../../SocketProvider'
import Message from './Message'
import { getChatMessages } from '@/app/libs/getChatMessages'
import { useSession } from 'next-auth/react'
import styles from './ChatWindow.module.css'
import { revalidatePath, revalidateTag } from 'next/cache'
import { clearCachesByServerAction, getChats } from '@/app/actions'
import { useRouter } from 'next/navigation'
import { useAppDispatch } from '@/store/store'
import { setIncomingCall } from '@/store/reducers/appSlice'

export default function ChatWindow({ id }: { id: string }) {
    const socket = useSocket();
    const [messages, setMessages] = useState<Message[]>([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false); // Added loading state
    const [showScrollToBottom, setShowScrollToBottom] = useState(false); // Added state to show/hide the scrollToBottom button
    const [joined, setJoined] = useState(false); // Added state to check if the user has joined the room
    const { data: session } = useSession();
    const router = useRouter();
    const dispatch = useAppDispatch();

    const fetchMoreMessages = async () => {
        setLoading(true);
    
        // Check if messages array is not empty before accessing the first element
        if (messages.length > 0) {
            const newMessages = await getChatMessages(id, messages[0].id, session?.user.token as string, 20);
    
            setMessages((msgs) => [...newMessages.reverse(), ...msgs]);
        }
    
        setLoading(false);
    };
    
    const scrollToBottom = () => {
        const msgCont = document.querySelector('#msg-cont');
    
        if (msgCont) {
            // Delay the scrollTo to ensure the element is rendered and has a valid scrollHeight
            setTimeout(() => {
                msgCont.scrollBy({
                    top: msgCont.scrollHeight,
                    behavior: 'smooth'
                })
            }, 100);
        }
    }

    useEffect(() => {
        const msgCont = document.querySelector('#msg-cont');

        const handleScroll = () => {
            if (msgCont && msgCont.scrollTop === 0 && !loading) {
                fetchMoreMessages();
            }

            // Show the scrollToBottom button if the user is more than 100px from the bottom
            if (msgCont && msgCont.scrollHeight - msgCont.scrollTop - msgCont.clientHeight > 100) {
                setShowScrollToBottom(true);
            } else {
                setShowScrollToBottom(false);
            }
        };

        msgCont?.addEventListener('scroll', handleScroll);

        if (messages.length === 0) {
            getChatMessages(id, '', session?.user.token as string, 20).then((msgs) => {
                setMessages(msgs.reverse());
            });
        }

        if (socket) {
            if(!joined) {
                socket.emit('join-room', id);
                setJoined(true);
            }

            const handleMessage = (message: any) => {
                setMessages((msgs) => [...msgs, message]);

                scrollToBottom();
            };

            socket.on('message', handleMessage);
            
            socket.on('call', (offer: any) => {
                dispatch(setIncomingCall(offer.offer))
                router.push(`/chat/${id}/call`);
            });

            return () => {
                msgCont?.removeEventListener('scroll', handleScroll);
                socket.off('message', handleMessage);
            };
        }

    }, [socket, loading, id, session]);

    // run this effect once on mount
    useEffect(() => {
        scrollToBottom();
    }, []);

    useEffect(() => {
        return () => {
            setJoined(false);
            socket?.emit('leave-room', id)
        }
    }, [socket, id])

    const sendMessage = async () => {
        socket?.emit('message', {
            message: message,
            room: id
        })
        
        clearCachesByServerAction('chats')

        setMessage('')

        scrollToBottom();
    }

    return (
        <div className='flex flex-col gap-3 h-full w-full p-2 relative border border-gray-700 rounded-xl'>
            <div className={styles.msg_cont} id="msg-cont">
                {
                    messages.map((message, index) => (
                        <Message key={index} text={message.text} date={message.createdAt} sender={message.user} sended={
                            message.user.id === session?.user.id
                        } />
                    ))
                }
                {loading && <p>Loading...</p>}
            </div>

            <div className='flex flex-col w-full items-center gap-3'>
                {
                    showScrollToBottom && (
                        <div className='bg-black p-2 w-10 h-10 rounded-full flex items-center justify-center rotate-180 cursor-pointer' onClick={() => scrollToBottom()}>
                            &#8679;
                        </div>
                    )
                }
                <div className='flex items-center gap-3 w-full'>
                    <input type="text" className='flex-1 p-2 rounded-xl focus:outline-none bg-black text-white' value={message} onChange={(e) => {
                        setMessage(e.target.value)
                    }} />

                    <button className='bg-black text-white px-4 py-2 rounded-xl' onClick={() => sendMessage()}>Send</button>
                </div>
            </div>
        </div>
    )
}
