'use client'
import { enumTextTags, IReactNode } from '@/constants/types'
import cn from 'classnames'
import { ReactNode } from 'react'

/*
Input: className (string or array of strings for custom classes), tag (enumTextTags, HTML tag), sizeFont (font size), children (content), other props
Output: ITextComponentProps object for TextComponent
Return value: ITextComponentProps interface
Function: Describes the properties for the TextComponent (tag, font size, class, children, etc.)
Variables: className, tag, sizeFont, children, [key: string]: any
Date: 29 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/
interface ITextComponentProps extends IReactNode {
  tag?: enumTextTags
  sizeFont?: 's12' | 's14' | 's16' | 's18' | 's20' | 's24' | 's28' | 's36' | 's48' | 's60' | 's72' | 's96' | 's128'
  className?: string[] | string
  children: ReactNode | ReactNode[] | string
  [key: string]: any
}

const sizeClasses = {
  s12: 'text-xs',
  s14: 'text-sm',
  s16: 'text-base',
  s18: 'text-lg',
  s20: 'text-xl',
  s24: 'text-2xl',
  s28: 'text-3xl',
  s36: 'text-4xl',
  s48: 'text-5xl',
  s60: 'text-6xl',
  s72: 'text-7xl',
  s96: 'text-8xl',
  s128: 'text-9xl'
}

/*
Input: className (string or array), tag (enumTextTags), sizeFont (font size), children (content), other props
Output: Text element with custom tag, font size, and classes
Return value: JSX.Element (TextComponent UI)
Function: Renders a text element with a customizable tag, font size, and classes, displaying children content
Variables: CustomTag, classes, props
Date: 29 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/
export const TextComponent = ({ className = [], tag = enumTextTags.p, sizeFont = 's16', ...props }: ITextComponentProps) => {
  const CustomTag = tag
  const classes = cn('montserrat', `${className}`, `${sizeClasses[sizeFont]}`)

  return (
    <CustomTag
      className={classes}
      {...props}
    >
      {/* Either show the children of the component or an empty string */}
      {props.children ? props.children : ''}
    </CustomTag>
  )
}
