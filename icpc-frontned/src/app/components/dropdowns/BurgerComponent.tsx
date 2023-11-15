'use client'
import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/20/solid'
import { TextComponent } from '../TextComponent'
import { enumTextSizes, enumTextTags } from '@/constants/types'

interface IDropdownProps {
  options: {
    id: number
    name: string
    href: string
  }[]
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function BurgerComponent({ options }: Readonly<IDropdownProps>) {
  return (
    <Menu
      as='div'
      className='relative inline-block text-left'>
      {({ open }) => (
        <>
          <Menu.Button>
            {open ? (
              <XMarkIcon
                className='block h-6 w-6'
                aria-hidden='true'
              />
            ) : (
              <Bars3Icon
                className='block h-6 w-6'
                aria-hidden='true'
              />
            )}
          </Menu.Button>
          {open && (
            <div>
              <Transition
                as={Fragment}
                enter='transition ease-out duration-100'
                enterFrom='transform opacity-0 scale-95'
                enterTo='transform opacity-100 scale-100'
                leave='transition ease-in duration-75'
                leaveFrom='transform opacity-100 scale-100'
                leaveTo='transform opacity-0 scale-95'>
                <Menu.Items className='absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
                  <div className='py-3 px-3 grid grid-cols-1'>
                    {options.map(option => (
                      <Menu.Item key={option.id}>
                        {({ active }) => (
                          <TextComponent
                            sizeFont={enumTextSizes.s12}
                            tag={enumTextTags.a}
                            href={option.href}
                            className={classNames(active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'flex px-4 py-2')}>
                            {option.name}
                          </TextComponent>
                        )}
                      </Menu.Item>
                    ))}
                  </div>
                </Menu.Items>
              </Transition>
            </div>
          )}
        </>
      )}
    </Menu>
  )
}