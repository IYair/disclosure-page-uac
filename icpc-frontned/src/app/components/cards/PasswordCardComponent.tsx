'use client'
import { SubmitHandler, useForm } from 'react-hook-form'
import LogoComponent from '../LogoComponent'
import { TextComponent } from '../text/TextComponent'
import { enumTextTags } from '@/constants/types'
import React, { ReactNode } from 'react'
import SubmitComponent from '../forms/SubmitComponent'

/*
Input: A React Node, a submit handler, and a label
Output: An object with properties for the PasswordCardComponent
Return value: An object with the properties of the PasswordCardComponent
Function: To describe the properties of the PasswordCardComponent
Variables: children, onSubmit, label
Date: 28 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/

type FormProps = {
  children: ReactNode
  onSubmit: SubmitHandler<any>
  label: string
}

/*
***UNACCESSIBLE***
This component was made to be used when trying to change your own password.
This process was not finished and the only use of this component is the "/recovery" page, which is never mentioned to the user.

Input: a set of children, a submit handler, and a label
Output: a form component to change password
Return value: a form to change the password of a user account
Function: creates a form component to change the password of a user account
Variables: children, onSubmit, label, methods
Date: 28 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/

export default function PasswordCardComponent({ children, onSubmit, ...props}: Readonly<FormProps>) {
  const methods = useForm()
  const { handleSubmit } = methods

  return (
    <div className='md:mx-auto max-w-7xl md:px-4 w-full h-full lg:px-8 lg:w-2/3 lg:h-auto'>
      <div className='mx-auto max-w-3xl bg-gray-300 dark:bg-dark-primary rounded-md p-2 shadow-lg'>
        <div className='w-full grid grid-cols-1 place-items-center'>
          <LogoComponent size={150} />
          <TextComponent
            tag={enumTextTags.h3}
            sizeFont='s36'
            className='dark:text-dark-accent'>
            {props.label}
          </TextComponent>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='m-2 flex flex-col columns-1 place-items-center'>
          {/* Iterate through a list of children, check if they are valid elements and display them inside */}
          {React.Children.map(children, child => {
            return child && React.isValidElement(child)
              ? React.cloneElement(child, {
                  ...{
                    ...child.props,
                    register: methods.register,
                    key: child.props.name
                  }
                })
              : child
          })}
          <SubmitComponent text='Actualizar contraseña' action={() => {}}/>
        </form>
      </div>
    </div>
  )
}
