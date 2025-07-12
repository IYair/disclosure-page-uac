'use client'
import { Menu, MenuItem, MenuItems, Transition } from '@headlessui/react'
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid'
import React, { Fragment, useState } from 'react'

/*
Input: name, action, style, href (optional)
Output: Option object for menu actions
Return value: Option interface
Function: Describes a menu option for the three-dot dropdown
Variables: name, action, style, href
Date: 28 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/
interface Option {
  name: string
  action: (id: string, itemType: string, href?: string) => void
  style: string
  href?: string
}

/*
Input: id, itemType, options (array of Option)
Output: Props for ThreeDotComponent
Return value: IThreeDotComponentProps interface
Function: Describes the properties for the ThreeDotComponent
Variables: id, itemType, options
Date: 28 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/
interface IThreeDotComponentProps {
  id: string
  itemType: string
  options: Option[]
}

/*
Input: id, itemType, options (array of Option)
Output: Three-dot dropdown menu for actions
Return value: React Node (dropdown menu)
Function: Renders a three-dot dropdown menu for item actions
Variables: open, props, option
Date: 28 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/
const ThreeDotComponent = (props: Readonly<IThreeDotComponentProps>) => {
  const [open, setOpen] = useState(false)
  const [openReportModal, setOpenReportModal] = useState(false)

  // Render the dropdown menu if options are provided
  return props.options ? (
    <div>
      <Menu
        as='div'
        className='relative inline-block text-left mx-3 my-3'>
        {/* Toggle menu open/close on icon click */}
        <EllipsisVerticalIcon
          onClick={() => {
            setOpen(!open)
          }}
          className='block h-6 w-6'
        />
        <Transition
          as={Fragment}
          enter='transition ease-out duration-100'
          enterFrom='transform opacity-0 scale-95'
          enterTo='transform opacity-100 scale-100'
          leave='transition ease-in duration-75'
          leaveFrom='transform opacity-100 scale-100'
          leaveTo='transform opacity-0 scale-95'
          show={open}>
          <MenuItems
            onMouseLeave={() => setOpen(false)}
            className={`absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white 
                  dark:bg-primary shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10`}>
            <div className='py-1 grid grid-cols-1'>
              {/* Render each menu option as a button */}
              {props.options.map(opt => (
                <MenuItem
                  key={opt.name}
                  as='div'
                  className={opt.style}>
                  <button
                    onClick={() => {
                      opt.action(props.id, props.itemType, opt.href)
                      setOpen(false)
                    }}
                    className='text-left w-full h-full px-4 py-1'>
                    {opt.name}
                  </button>
                </MenuItem>
              ))}
            </div>
          </MenuItems>
        </Transition>
      </Menu>
    </div>
  ) : (
    <></>
  )
}

export default ThreeDotComponent
