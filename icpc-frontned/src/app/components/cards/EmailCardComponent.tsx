'use client'

import { SubmitHandler, useForm } from 'react-hook-form'
import LogoComponent from '../LogoComponent'
import { TextComponent } from '@/app/components/text/TextComponent'
import { enumTextTags } from '@/constants/types'
import React, { ReactNode } from 'react'
import SubmitComponent from '../forms/SubmitComponent'

interface FormData {
  email: string
}

type FormProps = {
  children: ReactNode
  onSubmit: SubmitHandler<any>
  label: string
}

export default function LoginCardComponent({ children, onSubmit, ...props }: Readonly<FormProps>) {
  const methods = useForm<FormData>()
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
          <SubmitComponent />
        </form>
      </div>
    </div>
  )
}
