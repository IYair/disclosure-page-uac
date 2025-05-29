import React from 'react'
import NewsListComponent from '../components/NewsListComponent'

/*
Input: None
Output: JSX.Element with the news list page layout
Return value: JSX.Element
Function: Renders the news list page, displaying the NewsListComponent
Variables: None
Date: 29 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/

export default function Page() {
  return (
    <main className='grid min-h-screen grid-cols-1 place-items-center justify-between py-24'>
        <NewsListComponent className='lg:w-10/12'/>
    </main>
  )
}