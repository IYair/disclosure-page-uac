import React from 'react'
import NewsCardComponent from '@/app/components/cards/NewsCardComponent'

/*
Input: params (object with id string)
Output: JSX.Element with the news detail or 404 page
Return value: JSX.Element
Function: Renders the news detail page if id is valid, otherwise shows a 404 message
Variables: params
Date: 29 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/

export default async function Page({ params }: Readonly<{ params: { id: string } }>) {
  if (params.id !== undefined && params.id !== '') {
    return (
      <main className='grid min-h-screen grid-cols-1 place-items-center justify-between py-24'>
        <NewsCardComponent id={params.id} />
      </main>
    )
  } else {
    return (
      <main className='grid min-h-screen grid-cols-1 place-items-center justify-between py-24'>
        <h1>404</h1>
      </main>
    )
  }
}
