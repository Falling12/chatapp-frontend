"use client"
import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

interface Props {
    text: string
    date: string
    sender: User
    sended: boolean
    hasRead: boolean
}

export default function Message({
    text,
    date,
    sender,
    sended,
    hasRead
}: Props) {
    const variants = {
        hidden: {
            opacity: 0,
            y: 20 // Adjusted from 50 to 20
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.2
            }
        }
    }

    const formatDateToPretty = (date: string) => {
        const d = new Date(date)
        const now = new Date()
        const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000)
        const diffInMinutes = Math.floor(diffInSeconds / 60)
        const diffInHours = Math.floor(diffInMinutes / 60)
        const diffInDays = Math.floor(diffInHours / 24)
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

        if (diffInSeconds < 60) {
            return `${diffInSeconds} seconds ago`
        } else if (diffInMinutes < 60) {
            return `${diffInMinutes} minutes ago`
        } else if (diffInHours < 24) {
            return `${diffInHours} hours ago`
        } else if (diffInDays < 7) {
            return `${daysOfWeek[d.getDay()]}`
        } else {
            return d.toLocaleDateString()
        }
    }

    return (
        <motion.div
            key={date}
            variants={variants}
            initial='hidden'
            animate='visible'
            className='flex flex-col gap-1'
        >
            <div className={`flex flex-col gap-1 ${sended ? 'items-end' : 'items-start'}`}>
                <div className='flex items-center gap-2' style={{
                    flexDirection: sended ? 'row-reverse' : 'row'
                }}>
                    <Image src={`http://192.168.1.231:8000${sender.imageUrl}`} width={'28'} height={'28'} alt="" className='w-7 h-7 rounded-full' />

                    <div className='flex items-center bg-black/50 rounded-xl p-2 max-w-[50%] min-w-[200px] flex-col gap-2'>
                        <p className='text-white break-all' style={{
                            alignSelf: sended ? 'flex-end' : 'flex-start'
                        }}>{text}</p>

                        <div className='flex items-center gap-1 justify-between w-full'>
                            <p className='text-xs text-gray-400'>{formatDateToPretty(date)}</p>

                            {
                                sended && (
                                    <div className={`w-4 h-4 p-1 rounded-full flex items-center justify-center ${hasRead ? 'bg-blue-500' : 'bg-gray-400'}`}>
                                        {
                                            !hasRead ? <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M19.78 2.19995L24 6.41995L8.44 22L0 13.55L4.22 9.32995L8.44 13.55L19.78 2.19995ZM19.78 4.99995L8.44 16.36L4.22 12.19L2.81 13.55L8.44 19.17L21.19 6.41995L19.78 4.99995Z" fill="white" />
                                            </svg> :
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M9.00001 20.4199L2.79001 14.2099L5.62001 11.3799L9.00001 14.7699L18.88 4.87988L21.71 7.70988L9.00001 20.4199Z" fill="white" />
                                                </svg>
                                        }
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
