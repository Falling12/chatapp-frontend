"use client"
import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

interface Props {
    text: string
    date: string
    sender: User
    sended: boolean
}

export default function Message({
    text,
    date,
    sender,
    sended
}: Props) {
    const variants = {
        hidden: {
            opacity: 0,
            y: 50
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.2
            }
        }
    }
    return (
        <motion.div
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

                    <div className='flex items-center bg-black/50 rounded-xl p-2 max-w-[200px]'>
                        <p className='text-white break-all'>{text}</p>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
