'use client'
import { Disclosure } from '@headlessui/react'
import { TextComponent } from '@/app/components/text/TextComponent'
import { enumTextTags } from '@/constants/types'
import BurgerComponent from './dropdowns/BurgerComponent'
import Link from 'next/link'
import LogoComponent from './LogoComponent'
import UserComponent from './UserComponent'
import useStore from '@/store/useStore'
import SearchBarComponent from './SearchBarComponent'

// Routes for the dropdown menu and the links associated to them
const routes = [
  {
    id: 1,
    name: 'Inicio',
    href: '/'
  },
  {
    id: 2,
    name: 'Apuntes',
    href: '/note'
  },
  {
    id: 3,
    name: 'Ejercicios',
    href: '/exercises'
  },
  {
    id: 4,
    name: 'Noticias',
    href: '/news'
  },
  {
    id: 5,
    name: 'Acerca de nosotros',
    href: '/about'
  }
]

/*
Input: None (uses hooks and store state)
Output: JSX.Element with the navigation bar layout
Return value: JSX.Element
Function: Renders the navigation bar, including logo, links, search bar, user dropdown, and mobile menu
Variables: routes, verified
Date: 29 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/
export default function NavbarComponent() {

  const verified = useStore(state => state.isLogged)

  return (
    <Disclosure
      as='nav'
      className='bg-white dark:bg-dark-primary shadow fixed top-0 w-full z-50'>
      <div className='mx-auto max-w-7xl px-2 sm:px-4 lg:px-8'>
        <div className='flex h-16 justify-between'>
          <div className='flex px-2 lg:px-0'>
            <div className='flex flex-shrink-0 items-center'>
              <Link href='/'>
                <LogoComponent size={40} />
              </Link>
            </div>
            <div className='hidden items-center lg:ml-6 lg:flex lg:space-x-8'>
              {/* Loop through all the routes and place them as options in the menu */}
              {routes.map(route => (
                <Link
                  href={route.href}
                  key={route.id}
                  className='hover:text-secondary dark:text-dark-accent dark:hover:text-dark-complementary'>
                  <TextComponent
                    tag={enumTextTags.p}
                    sizeFont='s14'
                    className='flex items-center border-b-2 border-transparent px-1 pt-1'>
                    {route.name}
                  </TextComponent>
                </Link>
              ))}
            </div>
          </div>
          <div className='flex flex-1 items-center justify-center px-2 lg:ml-6 lg:justify-end'>
            <SearchBarComponent />
          </div>
          <div className='flex items-center lg:hidden'>
            {/* Mobile menu button */}
            <BurgerComponent
              options={routes}
              verified={verified}
            />
          </div>
          <div className='hidden lg:ml-4 lg:flex lg:items-center'>
            {/* Profile dropdown */}
            <Link
              // If the user has logged in, display the dropdown menu; otherwise redirect to the login page
              href={verified ? '#' : '/login'}
              className='hover:text-base-accent dark:text-dark-accent dark:hover:text-complementary'>
              <UserComponent
                options={routes}
                verified={verified}
              />
            </Link>
          </div>
        </div>
      </div>
    </Disclosure>
  )
}