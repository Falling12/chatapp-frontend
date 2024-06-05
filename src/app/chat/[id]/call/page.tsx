"use client"
import { useSocket } from '@/app/SocketProvider';
import { useAppSelector } from '@/store/store';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Peer, { MediaConnection } from 'peerjs'; // Import MediaConnection for handling incoming calls

const Room = () => {
    const socket = useSocket();
    const userVideoRef = useRef<HTMLVideoElement>(null);
    const peerVideoRef = useRef<HTMLVideoElement>(null);
    const userStreamRef = useRef<MediaStream | null>(null);
    const offer = useAppSelector((state) => state.app.incomingCall);
    const { id } = useParams();
    const [peer, setPeer] = useState<Peer | null>(null);

    useEffect(() => {
        if (!socket) return;

        if (offer) {
            const peer = new Peer();
            setPeer(peer);

            peer.on('open', () => {
                socket.emit('answer-made', {
                    answer: peer.id, // Send the peer ID instead of the peer object
                    chat: id
                })
            });

            peer.on('call', (call) => {
                navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
                    if (userVideoRef.current) userVideoRef.current.srcObject = stream;
                    userStreamRef.current = stream;

                    call.answer(stream);

                    call.on('stream', (remoteStream) => {
                        if (peerVideoRef.current) peerVideoRef.current.srcObject = remoteStream;
                    });
                });
            });
        } else {
            const peer = new Peer();
            setPeer(peer);

            peer.on('open', () => {
                socket.emit('call-made', {
                    offer: peer.id,
                    chat: id
                })
            });

            socket.on('answer', (data: { answer: string, chat: string }) => {
                navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
                    if (userVideoRef.current) userVideoRef.current.srcObject = stream;
                    userStreamRef.current = stream;

                    const call = peer.call(data.answer, stream);

                    call.on('stream', (remoteStream) => {
                        if (peerVideoRef.current) peerVideoRef.current.srcObject = remoteStream;
                    });
                });
            })
        }

        return () => {
            peer?.destroy()
            socket?.off('answer-made')
        }
    }, [socket]);

    return (
        <div className='flex items-center gap-2 p-3 w-full'>
            <video autoPlay muted ref={peerVideoRef} className='w-1/2 h-full' />

            <video autoPlay muted ref={userVideoRef} className='w-1/2 h-full' />
        </div>
    );
};

export default Room;