import React from 'react'
import { TextComponent } from '../components/text/TextComponent'
import { enumTextTags } from '@/constants/types'
import Politica from '@/app/privacy/politica.mdx'

/*
Input: None
Output: JSX.Element representing the privacy terms page layout
Return value: JSX.Element
Function: Renders the privacy terms page, including a header and the Politica component, styled with Tailwind CSS classes
Variables: None
Date: 28 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/

export default function Page() {
  return (
    <main className='flex min-h-screen flex-col w-full items-center py-24'>
      <div className='w-4/5'>
        <TextComponent
          sizeFont='s28'
          tag={enumTextTags.h1}
          className='dark:text-dark-accent'>
          Términos de privacidad
        </TextComponent>
        <Politica />
      </div>
    </main>
  )
}
