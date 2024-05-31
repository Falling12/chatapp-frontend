import React, { useEffect } from 'react'
import ChatWindow from './components/ChatWindow'

export default function page({
    params
}: {
    params: {
        id: string
    }
}) {
  return (
    <main className='h-[calc(100vh-55px)] w-full p-7'>
        <ChatWindow id={params.id} />
    </main>
  )
}
