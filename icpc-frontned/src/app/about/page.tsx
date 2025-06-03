import React from 'react'
import { TextComponent } from '../components/text/TextComponent'
import { enumTextTags } from '@/constants/types'
import About from '@/app/about/acercade.mdx'

/*
Input: The content of a Markdown file, wrapped in a React component
Output: A React page component that displays the content of the Markdown file
Return value: A React Node
Function: It displays the content of the "acercade.mdx" file in a structured format
Variables: None
Date: 28 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/

export default function Page() {
  return (
    <main className='flex min-h-screen flex-col w-full items-center py-24'>
      <div className='w-4/5 dark:text-dark-accent text-justify'>
        <TextComponent
          sizeFont='s28'
          tag={enumTextTags.h1}
          className='dark:text-dark-accent'>
          Acerca de nosotros
        </TextComponent>
        <About />
      </div>
    </main>
  )
}
