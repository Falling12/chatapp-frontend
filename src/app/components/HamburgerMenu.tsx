"use client"
import { toggleSidebar } from '@/store/reducers/appSlice'
import { useAppDispatch, useAppSelector } from '@/store/store'
import React from 'react'

export default function HamburgerMenu() {
    const dispatch = useAppDispatch()

    const openSidebar = () => {
        dispatch(toggleSidebar())
    }

    return (
        <div className="hidden items-center flex-col gap-1 bg-black p-2 rounded-md cursor-pointer max-[700px]:flex" onClick={() => openSidebar()}>
            <div className="w-7 h-1 rounded-full bg-white"></div>
            <div className="w-7 h-1 rounded-full bg-white"></div>
            <div className="w-7 h-1 rounded-full bg-white"></div>
        </div>
    )
}
