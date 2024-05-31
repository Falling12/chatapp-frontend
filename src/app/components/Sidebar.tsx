"use client"
import React, { Suspense, useEffect } from 'react'
import Chats from './Chats'
import ChatsSkeleton from './ChatsSkeleton'
import AddButton from './AddButton'
import { useAppSelector } from '@/store/store'

export default function Sidebar(
  { chats }: { chats: any[] }
) {
  const sidebarOpen = useAppSelector((state) => state.app.sidebarOpen)
  const [styles, setStyles] = React.useState({} as any)

  useEffect(() => {
    const determineSidebarOpen = () => {
      const windowWidth = window.innerWidth
      const newStyles = () => {
        if (windowWidth < 700 && sidebarOpen) {
          return {
            marginTop: '20px',
            height: '100vh',
            position: 'fixed',
            transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
            transition: 'transform 0.3s ease-in-out'
          }
        } else if (windowWidth < 700 && !sidebarOpen) {
          return {
            marginTop: '20px',
            height: '100vh',
            position: 'fixed',
            transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
            transition: 'transform 0.3s ease-in-out'
          }
        } else if (windowWidth > 700) {
          return {
            transform: 'translateX(0)',
          }
        }
      }

      setStyles(newStyles)
    }

    determineSidebarOpen()

    window.addEventListener('resize', () => {
      // determine if sidebar is open, only if the window is smaller than 700px
      determineSidebarOpen()
    })

    return () => {
      window.removeEventListener('resize', () => {})
    }
  }, [sidebarOpen])

  return (
    <aside className="w-[400px] bg-gray-900 h-[calc(100vh-100px)] mt-[30px] flex flex-col p-4 gap-3 rounded-r-xl translate-x-0 z-10"
      style={styles}
    >
      <div className='flex items-center justify-between'>
        <h1 className="text-2xl">Conversations</h1>
        <AddButton />
      </div>

      <Suspense fallback={<ChatsSkeleton />}>
        {/* @ts-ignore */}
        <Chats chats={chats} /> 
      </Suspense>
    </aside>
  )
}
