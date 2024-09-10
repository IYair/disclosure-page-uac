'use client'
import { Menu, Transition, Listbox } from '@headlessui/react'
import {
  EllipsisVerticalIcon,
  UserCircleIcon,
  CalendarDaysIcon,
  CreditCardIcon,
  CheckCircleIcon,
  PaperClipIcon,
  FaceSmileIcon,
  FaceFrownIcon,
  FireIcon,
  HandThumbUpIcon,
  HeartIcon,
  XMarkIcon
} from '@heroicons/react/20/solid'
import React, { Fragment, useEffect, useState } from 'react'
import useExerciseStore from '@/store/useExcerciseStore'
import { enumTextTags, Exercise } from '@/constants/types'
import TagListComponent from '../tags/TagListComponent'
import { TextComponent } from '../text/TextComponent'

interface ExerciseCardComponentProps {
  exercise: Exercise
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

const ExerciseCardComponent = ({ ...props }: Readonly<ExerciseCardComponentProps>) => {
  const invoice = {
    subTotal: '$8,800.00',
    tax: '$1,760.00',
    total: '$10,560.00',
    items: [
      {
        id: 1,
        title: 'Logo redesign',
        description: 'New logo and digital asset playbook.',
        hours: '20.0',
        rate: '$100.00',
        price: '$2,000.00'
      },
      {
        id: 2,
        title: 'Website redesign',
        description: 'Design and program new company website.',
        hours: '52.0',
        rate: '$100.00',
        price: '$5,200.00'
      },
      {
        id: 3,
        title: 'Business cards',
        description: 'Design and production of 3.5" x 2.0" business cards.',
        hours: '12.0',
        rate: '$100.00',
        price: '$1,200.00'
      },
      {
        id: 4,
        title: 'T-shirt design',
        description: 'Three t-shirt design concepts.',
        hours: '4.0',
        rate: '$100.00',
        price: '$400.00'
      }
    ]
  }

  const activity = [
    { id: 1, type: 'created', person: { name: 'Chelsea Hagon' }, date: '7d ago', dateTime: '2023-01-23T10:32' },
    { id: 2, type: 'edited', person: { name: 'Chelsea Hagon' }, date: '6d ago', dateTime: '2023-01-23T11:03' },
    { id: 3, type: 'sent', person: { name: 'Chelsea Hagon' }, date: '6d ago', dateTime: '2023-01-23T11:24' },
    {
      id: 4,
      type: 'commented',
      person: {
        name: 'Chelsea Hagon',
        imageUrl:
          // eslint-disable-next-line max-len
          'https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      comment: 'Called client, they reassured me the invoice would be paid by the 25th.',
      date: '3d ago',
      dateTime: '2023-01-23T15:56'
    },
    { id: 5, type: 'viewed', person: { name: 'Alex Curren' }, date: '2d ago', dateTime: '2023-01-24T09:12' },
    { id: 6, type: 'paid', person: { name: 'Alex Curren' }, date: '1d ago', dateTime: '2023-01-24T09:20' }
  ]

  const moods = [
    { name: 'Excited', value: 'excited', icon: FireIcon, iconColor: 'text-white', bgColor: 'bg-red-500' },
    { name: 'Loved', value: 'loved', icon: HeartIcon, iconColor: 'text-white', bgColor: 'bg-pink-400' },
    { name: 'Happy', value: 'happy', icon: FaceSmileIcon, iconColor: 'text-white', bgColor: 'bg-green-400' },
    { name: 'Sad', value: 'sad', icon: FaceFrownIcon, iconColor: 'text-white', bgColor: 'bg-yellow-400' },
    { name: 'Thumbsy', value: 'thumbsy', icon: HandThumbUpIcon, iconColor: 'text-white', bgColor: 'bg-blue-500' },
    { name: 'I feel nothing', value: null, icon: XMarkIcon, iconColor: 'text-gray-400', bgColor: 'bg-transparent' }
  ]
  //const [selected, setSelected] = useState(moods[5])

  return (
    <main>
      <header className='relative isolate pt-16'>
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
          <div className='mx-auto flex max-w-2xl items-center justify-between gap-x-8 lg:mx-0 lg:max-w-none'>
            <div className='flex items-center gap-x-6'>
              <img
                src='https://tailwindui.com/img/logos/48x48/tuple.svg'
                alt=''
                className='h-16 w-16 flex-none rounded-full ring-1 ring-gray-900/10'
              />
              <h1>
                <div className='text-sm leading-6 text-gray-500'>
                  <span className='text-accent dark:text-dark-accent'>{props.exercise.category.name}</span>
                </div>
                <div className='mt-1 text-base font-semibold leading-6 text-accent dark:text-dark-accent'>{props.exercise.title}</div>
              </h1>
            </div>
            <div className='flex items-center gap-x-4 sm:gap-x-6'>
              <button
                type='button'
                className='hidden text-sm font-semibold leading-6 text-accent dark:text-dark-accent sm:block'>
                Copy URL
              </button>
              <a
                href='#'
                className='hidden text-sm font-semibold leading-6 text-accent dark:text-dark-accent sm:block'>
                Edit
              </a>
              <a
                href='/notelist'
                className='rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm
                  hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'>
                Apuntes
              </a>

              <Menu
                as='div'
                className='relative sm:hidden'>
                <Menu.Button className='-m-3 block p-3'>
                  <span className='sr-only'>More</span>
                  <EllipsisVerticalIcon
                    className='h-5 w-5 text-gray-500'
                    aria-hidden='true'
                  />
                </Menu.Button>

                <Transition
                  as={Fragment}
                  enter='transition ease-out duration-100'
                  enterFrom='transform opacity-0 scale-95'
                  enterTo='transform opacity-100 scale-100'
                  leave='transition ease-in duration-75'
                  leaveFrom='transform opacity-100 scale-100'
                  leaveTo='transform opacity-0 scale-95'>
                  <Menu.Items
                    className='absolute right-0 z-10 mt-0.5 w-32 origin-top-right rounded-md 
                    bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none'>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          type='button'
                          className={classNames(
                            active ? 'bg-gray-50' : '',
                            'block w-full px-3 py-1 text-left text-sm leading-6 text-gray-900'
                          )}>
                          Copy URL
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href='#'
                          className={classNames(active ? 'bg-gray-50' : '', 'block px-3 py-1 text-sm leading-6 text-gray-900')}>
                          Edit
                        </a>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
        </div>
      </header>

      <div className='mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8'>
        <div className='mx-auto grid max-w-2xl grid-cols-1 grid-rows-1 items-start gap-x-8 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-3'>
          {/* Invoice summary */}
          <div className='lg:col-start-3 lg:row-end-1'>
            <h2 className='sr-only'>Summary</h2>
            <div className='rounded-lg bg-gray-50 shadow-sm ring-1 ring-gray-900/5'>
              <dl className='flex flex-wrap'>
                <div className='flex-auto pl-6 pt-6'>
                  <dt className='text-sm font-semibold leading-6 text-accent'>Dificultad</dt>
                  <dd className='mt-1 text-base font-semibold leading-6 text-gray-900'>{props.exercise.difficulty.name}</dd>
                </div>
                <div className='flex-none self-end px-6 pt-4'>
                  <dt className='sr-only'>Status</dt>
                  <dd className='rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-600 ring-1 ring-inset ring-green-600/20'>
                    Paid
                  </dd>
                </div>
                <div className='mt-6 flex w-full flex-none gap-x-4 border-t border-gray-900/5 px-6 pt-6'>
                  <dt className='flex-none'>
                    <span className='sr-only'>Client</span>
                    <UserCircleIcon
                      className='h-6 w-5 text-gray-400'
                      aria-hidden='true'
                    />
                  </dt>
                  <dd className='text-sm font-medium leading-6 text-accent'>{props.exercise.author}</dd>
                </div>
                <div className='mt-4 flex w-full flex-none gap-x-4 px-6'>
                  <dt className='flex-none'>
                    <span className='sr-only'>Due date</span>
                    <CalendarDaysIcon
                      className='h-6 w-5 text-gray-400'
                      aria-hidden='true'
                    />
                  </dt>
                  <dd className='text-sm leading-6 text-accent'>
                    <time dateTime='2023-01-31'>{`Límite de tiempo: ${props.exercise.time.timeLimit} seg.`}</time>
                  </dd>
                </div>
                <div className='mt-4 flex w-full flex-none gap-x-4 px-6'>
                  <dt className='flex-none'>
                    <span className='sr-only'>Límite de memoria</span>
                    <CreditCardIcon
                      className='h-6 w-5 text-gray-400'
                      aria-hidden='true'
                    />
                  </dt>
                  <dd className='text-sm leading-6 text-accent'>{`${props.exercise.memoryId.memoryLimit * 64} KB`}</dd>
                </div>
              </dl>
              <div className='mt-6 border-t border-gray-900/5 px-6 py-6'>
                <a
                  href='#'
                  className='text-sm font-semibold leading-6 text-gray-900'>
                  Download receipt <span aria-hidden='true'>&rarr;</span>
                </a>
              </div>
            </div>
          </div>

          {/* Invoice */}
          <div
            className='-mx-4 px-4 py-8 shadow-sm ring-1 ring-gray-900/5 sm:mx-0 sm:rounded-lg sm:px-8 sm:pb-14 
            lg:col-span-2 lg:row-span-2 lg:row-end-2 xl:px-16 xl:pb-20 xl:pt-16'>
            <TagListComponent
              tags={props.exercise.tags}
              showIcon={false}
            />
            <dl className='mt-6 grid grid-cols-1 text-sm leading-6 sm:grid-cols-2'>
              <div className='sm:pr-4'>
                <dt className='inline text-accent dark:text-dark-accent'>Entrada</dt>{' '}
                <dd className='inline text-accent dark:text-dark-accent'>
                  <TextComponent
                    sizeFont='s12'
                    tag={enumTextTags.p}>
                    {props.exercise.input}
                  </TextComponent>
                </dd>
              </div>
              <div className='mt-2 sm:mt-0 sm:pl-4'>
                <dt className='inline text-accent dark:text-dark-accent'>Salida</dt>{' '}
                <dd className='inline text-accent dark:text-dark-accent'>
                  <TextComponent
                    sizeFont='s12'
                    tag={enumTextTags.p}>
                    {props.exercise.output}
                  </TextComponent>
                </dd>
              </div>
              <div className='mt-6 border-t border-gray-900/5 pt-6 sm:pr-4'>
                <dt className='inline text-accent dark:text-dark-accent'>Entrada de ejemplo</dt>{' '}
                <dd className='inline text-accent dark:text-dark-accent'>
                  <TextComponent
                    sizeFont='s12'
                    tag={enumTextTags.p}>
                    {props.exercise.example_input}
                  </TextComponent>
                </dd>
              </div>
              <div className='mt-8 sm:mt-6 sm:border-t sm:border-gray-900/5 sm:pl-4 sm:pt-6'>
                <dt className='inline text-accent dark:text-dark-accent'>Salida de ejemplo</dt>{' '}
                <dd className='inline text-accent dark:text-dark-accent'>
                  <TextComponent
                    sizeFont='s12'
                    tag={enumTextTags.p}>
                    {props.exercise.example_output}
                  </TextComponent>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </main>
  )
}

export default ExerciseCardComponent
