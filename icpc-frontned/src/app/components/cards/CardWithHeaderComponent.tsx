'use client'
import { enumTextTags } from '@/constants/types'
import cn from 'classnames'
import { TextComponent } from '../text/TextComponent'
import { ButtonComponent } from '../buttons/ButtonComponent'

interface CardWithHeaderComponentProps {
  title: string
  comments?: string
  className?: string[] | string
}

/*
Input: the title and comments to display in the card, styles for the card
Output: a card with a title, comments, style, and buttons
Return value: a card component used in the landing page to display a welcome message
Function: creates a card with a header, comments, and buttons
Variables: title, comments, className, classes
Date: 21 - 03 - 2024
Author: Gerardo Omar Rodriguez Ramirez
*/

export const CardWithHeaderComponent = ({ className = [], ...props }: CardWithHeaderComponentProps) => {
  const classes = cn(className, `overflow-hidden rounded-lg bg-white shadow dark:bg-dark-primary mx-5`)
  return (
    <div className={classes}>
      <div className='px-4 pt-5 sm:px-6'>
        <TextComponent
          tag={enumTextTags.h2}
          sizeFont='s20'
          className={'text-accent dark:text-white font-semibold'}>
          {props.title}
        </TextComponent>
      </div>
      <div className='px-4 py-5 sm:p-6'>
        <TextComponent
          sizeFont='s12'
          tag={enumTextTags.p}
          className='leading-5 text-gray-500'>
          {props.comments}
        </TextComponent>
      </div>
      <div className='px-4 py-5 flex flex-col gap-4 sm:flex-row sm:gap-6 sm:justify-center items-center'>
        <a href='/exercises'>
          <ButtonComponent
            text='¡Ponte a practicar!'
            icon
            onClick={() => {}}
          />
        </a>
        <a href='/note'>
          <ButtonComponent
            buttonType='button_outline'
            text='Aprende más'
            icon
            onClick={() => {}}
          />
        </a>
      </div>
    </div>
  )
}
