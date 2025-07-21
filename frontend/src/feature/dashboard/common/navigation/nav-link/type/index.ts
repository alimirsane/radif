import { HTMLAttributes } from "react"

export interface NavLinkType extends HTMLAttributes<HTMLAnchorElement> {
    text ?: string
    href : string
    active ?:boolean
}