'use client'
import { UserIcon } from '@heroicons/react/20/solid'
import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/20/solid'
import { TextComponent } from '@/app/components/text/TextComponent'
import { enumTextTags } from '@/constants/types'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import useStore from '@/store/useStore'

/*
Input: verified (boolean for login status), options (array of {id, name, href})
Output: Dropdown menu with user options
Return value: JSX.Element (user dropdown)
Function: Renders a user icon that acts as a dropdown menu with navigation and logout
Variables: router, optionStyle, logout, handleLogout, options, verified
Date: 29 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/
interface IUserProps {
  verified: boolean
  options: {
    id: number
    name: string
    href: string
  }[]
}

/*
Input: An object with properties described in the IUserProps interface, see above
Output: Dropdown menu with user options
Return value: JSX.Element (user dropdown)
Function: Renders a user icon that acts as a dropdown menu with navigation and logout
Variables: router, optionStyle, logout, handleLogout, options, verified
Date: 29 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/
export default function UserComponent({ options, verified }: Readonly<IUserProps>) {
  const router = useRouter()
  const optionStyle =
    'hover:text-secondary hover:bg-gray-100 px-4 py-2 dark:text-accent  dark:hover:text-complementary dark:hover:bg-secondary'

  // Function to combine class names conditionally
  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
  }

  const logout = useStore(state => state.logout)

  // Function to handle logout and redirect if on profile page
  const handleLogout = async () => {
    await logout()
    if (window.location.pathname === '/profile') {  
      router.push('/')
    }
  }
  
  // If the user is not verified, return a simple login text; otherwise render the dropdown menu
  return verified ? (
    <Menu
      as='div'
      className='relative flex'>
      {({ open }) => (
        <>
          <Menu.Button>
            {/* If the menu is open, show the close icon; otherwise, show the user icon */}
            {open ? (
              <XMarkIcon
                className='block h-6 w-6 m-2'
                aria-hidden='true'
              />
            ) : (
              <UserIcon className='h-10 w-10' />
            )}
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
              className={`absolute right-4 mt-8 w-56 origin-top-right rounded-md bg-white 
                  dark:bg-primary shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}>
              <div className='py-1 grid grid-cols-1'>
                {/* Loop through all the options and render them */}
                {options.map(option => (
                  <Menu.Item key={option.id}>
                    {({ active }) => (
                      <Link
                        href={option.href}
                        className={optionStyle}>
                        <TextComponent
                          sizeFont='s12'
                          tag={enumTextTags.p}
                          className={classNames(active ? 'dark:bg-secondary' : 'dark:text-dark-accent', 'flex py-1')}>
                          {option.name}
                        </TextComponent>
                      </Link>
                    )}
                  </Menu.Item>
                ))}
                {/* If the user is verified, show the profile and logout options; otherwise show login */}
                {verified ? (
                  <>
                    <Menu.Item>
                      <Link
                        className={optionStyle}
                        href='/profile'>
                        <TextComponent
                          sizeFont='s12'
                          tag={enumTextTags.p}
                          className={`hover:text-secondary dark:hover:bg-secondary
                            dark:hover:text-complementary dark:text-dark-accent text-gray-700 flex py-1`}>
                          Mi perfil
                        </TextComponent>
                      </Link>
                    </Menu.Item>
                    <Menu.Item>
                      <Link
                        className={optionStyle}
                        href='#'
                        onClick={handleLogout}>
                        <TextComponent
                          sizeFont='s12'
                          tag={enumTextTags.p}
                          className={`hover:text-secondary dark:hover:bg-secondary
                            dark:hover:text-complementary dark:text-dark-accent text-gray-700 flex py-1`}>
                          Cerrar sesión
                        </TextComponent>
                      </Link>
                    </Menu.Item>
                  </>
                ) : (
                  <Menu.Item>
                    <Link
                      className={optionStyle}
                      href='/login'>
                      <TextComponent
                        sizeFont='s12'
                        tag={enumTextTags.p}
                        className={`hover:text-secondary dark:hover:bg-secondary
                            dark:hover:text-complementary dark:text-dark-accent text-gray-700 flex py-1`}>
                        Iniciar sesión
                      </TextComponent>
                    </Link>
                  </Menu.Item>
                )}
              </div>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  ) : (
    <TextComponent
      tag={enumTextTags.p}
      sizeFont='s12'
      className='hover:text-secondary dark:text-dark-accent dark:hover:text-dark-complementary'>
      Iniciar sesión
    </TextComponent>
  )
}
