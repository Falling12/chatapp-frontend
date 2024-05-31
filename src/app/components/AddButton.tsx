import Link from 'next/link'
import React from 'react'

export default function AddButton() {
  return (
    <Link href={'/new'} className='flex items-center justify-center w-10 h-10 rounded-xl bg-gray-700 cursor-pointer hover:bg-gray-600 transition-all'>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
    </Link>
  )
}
