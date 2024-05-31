"use client"
import React from 'react'
import { deleteChat } from '../actions'
import { useTransition } from 'react'
import { useSession } from 'next-auth/react'

export default function DeleteButton({
    id,
    disabled
}: {
    id: string
    disabled: boolean
}) {
    let [isPending, startTransition] = useTransition()
    const { data: session } = useSession()

    const handleClick = async () => {
        await deleteChat(id, session!.user.token)
    }

    return (
        // @ts-ignore  
        <button disabled={disabled} onClick={() => handleClick()} className='flex items-center justify-center bg-red-400 disabled:bg-red-300 hover:bg-red-500 transition-colors text-white w-10 h-10 rounded-xl p-2'>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
        </button>
    )
}
