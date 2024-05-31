import React from 'react'

export default function FriendSkeleton() {
  return (
    <div className='flex w-full items-center bg-gray-900 rounded-xl p-3 gap-3 justify-between'>
        <div className='flex items-center gap-3'>
            <div className='w-10 h-10 rounded-full bg-gray-700 animate-pulse'></div>
    
            <div className='flex flex-col gap-2'>
                <div className='w-20 h-4 rounded-lg bg-gray-700 animate-pulse'></div>
                <div className='w-40 h-3 rounded-lg bg-gray-700 animate-pulse'></div>
            </div>
        </div>
    
        <div className='w-10 h-10 rounded-full bg-gray-700 animate-pulse'></div>
    </div>
  )
}
