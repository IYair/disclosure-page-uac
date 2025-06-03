'use client'
import { Menu, MenuButton, Transition, MenuItems, MenuItem } from '@headlessui/react'
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid'
import React, { Fragment, useEffect, useState } from 'react'
import ReportButtonComponent from '../buttons/ReportButtonComponent'
import LogoComponent from '../LogoComponent' // Importa el LogoComponent

/*
Input: category (string, exercise category), title (string, exercise title), itemId (string, exercise ID)
Output: ExerciseHeaderComponentProps object for ExerciseHeaderComponent
Return value: ExerciseHeaderComponentProps interface
Function: Describes the properties for the ExerciseHeaderComponent (category, title, item ID)
Variables: category, title, itemId
Date: 29 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/
interface ExerciseHeaderComponentProps {
  category: string
  title: string
  itemId: string
}

/*
Input: An array of strings with tailwind classes
Output: A single string of tailwind classes
Return value: A string
Function: Combines multiple tailwind class strings into one
Variables: classes
Date: 29 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

/*
Input: category (string), title (string), itemId (string)
Output: Header UI for exercise page, with category, title, and report button
Return value: JSX.Element (ExerciseHeaderComponent UI)
Function: Renders a header for the exercise page, showing the category, title, and a report button if not on a ticket page
Variables: isTicketPage, props
Date: 29 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/
const ExerciseHeaderComponent = ({ ...props }: Readonly<ExerciseHeaderComponentProps>) => {
  const [isTicketPage, setIsTicketPage] = useState(false)

  // Effect to determine if the current page is a ticket page
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsTicketPage(window.location.pathname.includes('ticket'))
    }
  }, [])

  return (
    <header className='relative isolate'>
      <div
        className='absolute inset-0 -z-10 overflow-hidden'
        aria-hidden='true'>
        <div className='absolute left-16 top-full -mt-16 transform-gpu opacity-50 blur-3xl xl:left-1/2 xl:-ml-80'>
          <div
            className='aspect-[1154/678] w-[72.125rem] bg-gradient-to-br from-[#FF80B5] to-[#9089FC]'
            style={{
              clipPath:
                // eslint-disable-next-line max-len
                'polygon(100% 38.5%, 82.6% 100%, 60.2% 37.7%, 52.4% 32.1%, 47.5% 41.8%, 45.2% 65.6%, 27.5% 23.4%, 0.1% 35.3%, 17.9% 0%, 27.7% 23.4%, 76.2% 2.5%, 74.2% 56%, 100% 38.5%)'
            }}
          />
        </div>
        <div className='absolute inset-x-0 bottom-0 h-px bg-gray-900/5' />
      </div>

      <div className='mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8'>
        <div className='mx-auto flex flex-col lg:flex-row max-w-2xl items-center justify-between gap-x-8 lg:mx-0 lg:max-w-none'>
          <div className='flex items-center gap-x-6'>
            <h1>
              <div className='text-sm leading-6 text-gray-500'>
                <span className='text-accent dark:text-dark-accent'>{props.category}</span>
              </div>
              <div className='mt-1 text-2xl font-semibold leading-6 text-accent dark:text-dark-accent'>{props.title}</div>
            </h1>
          </div>
          <div className='flex items-center gap-x-4 sm:gap-x-6'>
            <a
              href='/note'
              className='rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm
                  hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'>
              Apuntes
            </a>
            {/* If this is not in the ticket page, display the report error button */}
            {!isTicketPage && (
              <div
                className='rounded-md px-3 py-2 text-sm font-semibold focus-visible:outline 
                focus-visible:outline-2 focus-visible:outline-offset-2'>
                <ReportButtonComponent
                  itemId={props.itemId}
                  itemType='exercise'
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default ExerciseHeaderComponent
