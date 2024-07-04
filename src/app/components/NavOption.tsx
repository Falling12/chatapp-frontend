import React, { FC } from 'react'

interface NavOptionProps {
    icon: React.ReactNode;
    title: string;
    url: string;
    action?: () => void;
    active: boolean;
}

const NavOption: FC<NavOptionProps> = ({
    icon,
    title,
    url,
    action,
    active
}) => {
  return (
    <a href={url} className={`rounded-md p-2 flex items-center gap-1 ${active ? 'bg-[#1F2937]' : 'bg-transparent'}`}>
        <span className={`${active ? 'opacity-100' : 'opacity-70'}`}>{icon}</span>
        <span className={`${active ? 'opacity-100' : 'opacity-70'}`}>{title}</span>
    </a>
  )
}

export default NavOption