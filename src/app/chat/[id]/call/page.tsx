"use client"

import { useSocket } from '@/app/SocketProvider';
import { useAppSelector } from '@/store/store';
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Peer from 'simple-peer';

const Room = () => {
    const socket = useSocket();
    const userVideoRef = useRef<HTMLVideoElement | null>(null);
    const peerVideoRef = useRef<HTMLVideoElement | null>(null);
    const userStreamRef = useRef<MediaStream | null>(null);
    const offer = useAppSelector((state) => state.app.incomingCall);
    const { id } = useParams();
    const [peer, setPeer] = useState<Peer.Instance | null>(null);

    useEffect(() => {
        if (offer) {
            // Incoming call
            navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
                if (userVideoRef.current) userVideoRef.current.srcObject = stream;
                userStreamRef.current = stream;

                const peer = new Peer({ initiator: false, stream, trickle: false });
                setPeer(peer);

                peer.on('signal', (data) => {
                    socket?.emit('answer-made', { answer: data, chat: id });
                });

                peer.on('stream', (remoteStream) => {
                    if (peerVideoRef.current) peerVideoRef.current.srcObject = remoteStream;
                });

                peer.signal(offer); // Signal the incoming offer
            }).catch((error) => {
                console.error('Error accessing media devices:', error);
            });
        } else {
            // Outgoing call
            navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
                if (userVideoRef.current) userVideoRef.current.srcObject = stream;
                userStreamRef.current = stream;

                const peer = new Peer({ initiator: true, stream, trickle: false });
                setPeer(peer);

                peer.on('signal', (data) => {
                    socket?.emit('call-made', { offer: data, chat: id });
                });

                peer.on('stream', (remoteStream) => {
                    console.log('Remote stream:', remoteStream);
                    if (peerVideoRef.current) peerVideoRef.current.srcObject = remoteStream;
                });
            }).catch((error) => {
                console.error('Error accessing media devices:', error);
            });
        }

        return () => {
            if (peer) {
                peer.destroy();
            }
        };
    }, [offer, socket, id]);

    return (
        <div className='flex items-center gap-2 p-3 w-full'>
            <video autoPlay muted ref={userVideoRef} className='w-1/2 h-full' />
            <video autoPlay ref={peerVideoRef} className='w-1/2 h-full' />
        </div>
    );
};

export default Room;
