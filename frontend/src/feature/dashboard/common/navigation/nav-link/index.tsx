import React from 'react'
import { NavLinkType } from './type'
import Link from 'next/link'

const NavLink = (props : NavLinkType) => {
    const { href,active, ...data } = props
    return(
        <Link {...data} href={href} className={`text-[16px] ${active ? "relative before:w-[6px] before:h-[24px] before:rounded-[20px] before:absolute before:bg-secondary text-secondary font-bold pr-[12px] before:right-0" : "text-typography-main"}`}></Link>
    )
}

export default NavLink