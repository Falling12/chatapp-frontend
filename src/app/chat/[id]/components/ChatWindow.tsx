"use client"
import React, { useEffect, useState, useRef } from 'react'
import { useSocket } from '../../../SocketProvider'
import Message from './Message'
import { getChatMessages } from '@/app/libs/getChatMessages'
import { useSession } from 'next-auth/react'
import styles from './ChatWindow.module.css'
import { revalidatePath, revalidateTag } from 'next/cache'
import { clearCachesByServerAction, clearPathCache, getChats } from '@/app/actions'
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
    const [isTyping, setIsTyping] = useState(false);
    const [typingData, setTypingData] = useState({ typing: false, user: '' });
    const dispatch = useAppDispatch();

    // Create a ref for the messages container
    const msgContRef = useRef<HTMLDivElement>(null);

    const fetchMoreMessages = async () => {
        setLoading(true)
    
        // Check if messages array is not empty before accessing the first element
        if (messages.length > 0) {
            const newMessages = await getChatMessages(id, messages[0].id, session?.user.token as string, 20);
    
            setMessages((msgs) => [...newMessages.reverse(), ...msgs]);
        }
    
        setLoading(false);
    };

    const scrollToBottom = () => {
        const msgCont = msgContRef.current;

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

    const markMessagesAsRead = () => {
        const unreadMessages = messages.filter(msg => !msg.hasRead && msg.user.id !== session?.user.id).map(msg => msg.id);
        if (unreadMessages.length > 0) {
            socket?.emit('markAsRead', { messages: unreadMessages, room: id });
        }
    }

    useEffect(() => {
        const handleScroll = () => {
            // Add a threshold of 50px before reaching the top
            if (msgContRef.current && msgContRef.current.scrollTop < 50 && !loading) {
                fetchMoreMessages();
            }
        
            // Show the scrollToBottom button if the user is more than 100px from the bottom
            if (msgContRef.current && msgContRef.current.scrollHeight - msgContRef.current.scrollTop - msgContRef.current.clientHeight > 100) {
                setShowScrollToBottom(true);
            } else {
                setShowScrollToBottom(false);
            }
            
            markMessagesAsRead();
        };

        msgContRef.current?.addEventListener('scroll', handleScroll);

        if (messages.length === 0) {
            getChatMessages(id, '', session?.user.token as string, 20).then((msgs) => {
                setMessages(msgs);
                markMessagesAsRead();
            });
        }

        if (socket) {
            if (!joined) {
                socket.emit('join-room', id);
                setJoined(true);
            }

            const handleMessage = (message: any) => {
                setMessages((msgs) => [...msgs, message]);

                scrollToBottom();
                markMessagesAsRead();
            };

            socket.on('message', handleMessage);

            socket.on('call', (offer: any) => {
                dispatch(setIncomingCall(offer.offer))
                router.push(`/chat/${id}/call`);
            });

            socket.on('typing', (data) => {
                setTypingData(data);
            })

            socket.on('markAsRead', (readMessages) => {
                setMessages((msgs) =>
                    msgs.map((msg) =>
                        readMessages.some((readMsg: Message) => readMsg.id === msg.id) ? { ...msg, hasRead: true } : msg
                    )
                );
            });

            return () => {
                msgContRef.current?.removeEventListener('scroll', handleScroll);
                socket.off('message', handleMessage);
                socket.off('markAsRead');
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

        clearPathCache('/')

        setMessage('')

        scrollToBottom();
    }

    const handleMessageTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);
        if (e.target.value !== '' && !isTyping) {
            setIsTyping(true);
            socket?.emit('typing', { room: id, typing: true, user: session?.user.id });
        } else if (e.target.value === '' && isTyping) {
            setIsTyping(false);
            socket?.emit('typing', { room: id, typing: false, user: session?.user.id });
        }
    }

    useEffect(() => {
        if (isTyping) {
            const typingTimeout = setTimeout(() => {
                setIsTyping(false);
                socket?.emit('typing', { room: id, typing: false, user: session?.user.id });
            }, 2000);

            return () => clearTimeout(typingTimeout);
        }
    }, [isTyping, socket, id, session]);

    return (
        <div className='flex flex-col gap-3 h-full w-full p-2 relative border border-gray-700 rounded-xl'>
            <div className={styles.msg_cont} id="msg-cont" ref={msgContRef}>
                {
                    messages.map((message, index) => (
                        <Message 
                            key={index} 
                            text={message.text} 
                            date={message.createdAt} 
                            sender={message.user} 
                            sended={
                                message.user.id === session?.user.id
                            } 
                            hasRead={message.hasRead}
                        />
                    ))
                }
                {loading && <p>Loading...</p>}
            </div>

            <div className='flex flex-col w-full items-center gap-3'>
                {
                    typingData.typing && (
                        <p className='self-start'>{typingData.user.name} is typing...</p>
                    )
                }

                {
                    showScrollToBottom && (
                        <div className='bg-black p-2 w-10 h-10 rounded-full flex items-center justify-center rotate-180 cursor-pointer' onClick={() => scrollToBottom()}>
                            &#8679;
                        </div>
                    )
                }
                <div className='flex items-center gap-3 w-full'>
                    <input type="text" className='flex-1 p-2 rounded-xl focus:outline-none bg-black text-white' value={message} onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            if (message !== '') {
                                sendMessage();
                            }
                        }
                    }} onChange={(e) => handleMessageTyping(e)} />

                    <button className='bg-black text-white px-4 py-2 rounded-xl' onClick={() => sendMessage()}>Send</button>
                </div>
            </div>
        </div>
    )
}
