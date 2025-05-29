'use client'
import { SubmitHandler, useForm } from 'react-hook-form'
import PasswordCardComponent from '../components/cards/PasswordCardComponent'
import TextFieldComponent from '../components/forms/TextFieldComponent'

// Function to handle form submission
const onSubmit: SubmitHandler<FormData> = () => {}

/*
***UNUSED***
This page is not being currently used in the website. The original design included a password recovery process that was not implemented.
Users will probably not be aware of this route, as it is not mentioned in the user guide and there are no links to this route.

Input: None (no props)
Output: JSX.Element with the password recovery page layout
Return value: JSX.Element
Function: Renders the password recovery page, including a form for new password and confirmation
Variables: methods, onSubmit
Date: 29 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/
export default function Home() {
  const methods = useForm()
  return (
    <main className='grid min-h-screen grid-cols-1 place-items-center justify-between py-24'>
      <PasswordCardComponent
        label='Crear nueva contraseña'
        onSubmit={onSubmit}>
        <TextFieldComponent
          labelText='Ingresa tu nueva contraseña'
          fieldName='newPassword'
          auto='new-password'
          id='newPassword'
          necessary={true}
          type='password'
          register={methods.register}
        />
        <TextFieldComponent
          labelText='Confirma tu nueva contraseña'
          fieldName='confirmation'
          auto='new-password'
          id='confirmation'
          necessary={true}
          type='password'
          register={methods.register}
        />
      </PasswordCardComponent>
    </main>
  )
}
