"use client"
import { useSession } from 'next-auth/react';
import React, { createContext, useContext, useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

interface SocketContextType {
    socket: Socket | null;
}

const SocketContext = createContext<SocketContextType>({ socket: null });

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { data: session } = useSession();
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        // Connect to your socket server
        const newSocket = io('http://localhost:8000', {
            extraHeaders: {
                authorization: session?.user?.token as string,
            }
        }); // Replace with your server URL

        setSocket(newSocket);

        // Cleanup the socket connection on component unmount
        return () => {
            newSocket.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = (): Socket | null => {
    const { socket } = useContext(SocketContext);
    return socket;
};
