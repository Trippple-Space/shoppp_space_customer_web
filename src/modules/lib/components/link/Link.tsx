import Link from 'next/link'
import React, { FC, ReactNode } from 'react'

interface ILink {
    children: ReactNode,
    href: string
    type: 'native' | 'navlink'
}
const CustomLink: FC<ILink> = ({children, href}) => {
  return (
    <Link href={href}><span>{children}</span></Link>
  )
}

export default CustomLink
