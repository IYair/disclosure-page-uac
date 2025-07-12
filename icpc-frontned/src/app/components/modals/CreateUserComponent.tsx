'use client'
import React, { useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { BasicPanelComponent } from '../panels/BasicPanelComponent'
import { enumTextTags } from '@/constants/types'
import LogoComponent from '../LogoComponent'
import { TextComponent } from '../text/TextComponent'
import TextFieldComponent from '../forms/TextFieldComponent'
import CheckboxComponent from '../forms/CheckboxComponent'
import SubmitComponent from '../forms/SubmitComponent'
import useStore, { IUser } from '@/store/useStore'
import { toast } from 'sonner'
import { ArrowUturnLeftIcon, XMarkIcon } from '@heroicons/react/20/solid'
import ConfirmDenyComponent from '../buttons/Confirm&DenyComponent'

/*
Input: onClose (function), id (optional string)
Output: Props for CreateUserComponent
Return value: ICreateUserProps interface
Function: Describes the properties for the CreateUserComponent modal
Variables: onClose, id
Date: 28 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/
interface ICreateUserProps {
  onClose: () => void
  id?: string
}

/*
Input: onClose, id (from ICreateUserProps)
Output: Modal for creating or editing a user account
Return value: React Node (modal component)
Function: Renders a modal for creating or editing a user, including form fields for user data and admin permissions
Variables: methods, createUser, updateUser, getUser, user, currentUser, showConfirm, useEffect, fetchUser, onSubmit, clearForm
Date: 28 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/
const CreateUserComponent = (props: ICreateUserProps) => {
  const methods = useForm<FieldValues>()
  const createUser = useStore(state => state.createUser)
  const updateUser = useStore(state => state.updateUser)
  const getUser = useStore(state => state.getUser)
  const user = useStore(state => state.user)
  const [currentUser, setCurrentUser] = useState<IUser>({} as IUser)
  const [showConfirm, setShowConfirm] = React.useState(false)

  // Effect hook to load the user if an ID is provided
  useEffect(() => {
    // Function to fetch user data based on the provided ID
    const fetchUser = async () => {
      try {
        // If an ID is provided, fetch the user data
        if (props.id) {
          const user = await getUser(props.id)
          // If user data is found, reset the form with the user's details
          if (user) {
            methods.reset({
              name: user.name,
              lastName: user.lastName,
              userName: user.userName,
              email: user.email,
              isAdmin: user.isAdmin
            })
            setCurrentUser(user)
          } else {
            toast.error('No se encontró el usuario con el ID proporcionado.', {
              duration: 5000,
              style: {
                backgroundColor: '#ff0000',
                color: '#ffffff'
              }
            })
          }
        }
      } catch (error) {
        toast.error('Error al cargar los datos del usuario.', {
          duration: 5000,
          style: {
            backgroundColor: '#ff0000',
            color: '#ffffff'
          }
        })
      }
    }

    fetchUser()
  }, [props.id, methods, getUser])

  // Function to handle form submission
  const onSubmit: SubmitHandler<FieldValues> = async data => {
    const userData = {
      name: String(data.name),
      lastName: String(data.lastName),
      userName: String(data.userName),
      email: String(data.email),
      password: String(data.password),
      passwordVerify: String(data.passwordVerify),
      isAdmin: Boolean(data.isAdmin)
    }

    // If an id was provided, update the user data; otherwise create a new account
    const response = props.id
      ? await updateUser(props.id, { ...userData, role: user!.role, editorId: user!.id })
      : await createUser(userData)
    // if an id was found in the response, the request was successful
    if ('id' in response) {
      toast.success(`La cuenta de usuario se ha ${props.id ? 'actualizado' : 'creado'} con éxito.`, {
        duration: 5000,
        style: {
          backgroundColor: 'green',
          color: '#FFFFFF'
        }
      })
      props.onClose()
    } else if ('message' in response) {
      toast.error(response.message, {
        duration: 5000,
        style: {
          backgroundColor: 'red',
          color: '#FFFFFF'
        }
      })
    }
  }

  // Function to clear the form fields
  const clearForm = () => {
    // Reset the form fields to their initial values
    if (props.id) {
      methods.reset({
        name: currentUser.name,
        lastName: currentUser.lastName,
        userName: currentUser.userName,
        email: currentUser.email,
        isAdmin: currentUser.isAdmin
      })
      methods.setValue('password', '')
      methods.setValue('passwordVerify', '')
    } else {
      methods.reset()
    }
  }

  return (
    <>
      {/* If the showConfirm state is true, show the confirmation modal */}
      {showConfirm && (
        <ConfirmDenyComponent
          onConfirm={() => {
            setShowConfirm(false)
            methods.handleSubmit(onSubmit)()
          }}
          onCancel={() => setShowConfirm(false)}
        />
      )}
      <form
        onSubmit={e => {
          e.preventDefault()
          setShowConfirm(true)
        }}
        className={`margin-auto md:mx-auto max-w-14xl md:px-4 w-full h-full lg:px-10 lg:w-2/3 lg:h-auto 
      min-h-screen place-items-center justify-between py-24`}>
        <BasicPanelComponent backgroundColor='bg-white dark:bg-dark-primary w-full lg:w-2/3'>
          <div className='relative'>
            <div className='absolute top-0 right-0 flex gap-1 p-2'>
              <div
                className='p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 rounded'
                title='Restablecer formulario'>
                <button
                  type='button'
                  onClick={clearForm}
                  className='text-inherit'>
                  <ArrowUturnLeftIcon className='h-6 w-6' />
                </button>
              </div>
              <div
                className='p-2 hover:bg-gray-100 dark:hover:bg-red-700 transition-colors duration-200 rounded'
                title='Cerrar formulario'>
                <button
                  onClick={props.onClose}
                  className='text-inherit'>
                  <XMarkIcon className='h-6 w-6' />
                </button>
              </div>
            </div>
          </div>
          <div className='flex flex-col items-center'>
            <LogoComponent size={100} />
            <TextComponent
              tag={enumTextTags.h1}
              sizeFont='s16'
              className='dark:text-dark-accent'>
              {/* Display the appropriate text if an id was provided */}
              {props.id ? 'Editar usuario' : 'Crear cuenta de usuario'}
            </TextComponent>
            <TextFieldComponent
              labelText='Nombre'
              register={methods.register}
              fieldName='name'
              id='name'
              necessary={true}
              type='text'
              auto='name'
            />
            <TextFieldComponent
              labelText='Apellido'
              register={methods.register}
              fieldName='lastName'
              id='lastName'
              necessary={true}
              type='text'
              auto='last-name'
            />
            <TextFieldComponent
              labelText='Nombre de usuario'
              register={methods.register}
              fieldName='userName'
              id='userName'
              necessary={true}
              type='text'
              auto='username'
            />
            <TextFieldComponent
              labelText='Correo electrónico'
              register={methods.register}
              fieldName='email'
              id='email'
              necessary={true}
              type='email'
              auto='email'
            />
            <TextFieldComponent
              labelText='Contraseña'
              register={methods.register}
              fieldName='password'
              id='password'
              necessary={false}
              type='password'
            />
            <TextFieldComponent
              labelText='Verifique su contraseña'
              register={methods.register}
              fieldName='passwordVerify'
              id='passwordVerify'
              necessary={false}
              type='password'
            />
            <CheckboxComponent
              labelText='Permisos de administrador'
              fieldName='isAdmin'
              register={methods.register}
            />
            <SubmitComponent
              // Display the appropriate text if an id was provided
              text={props.id ? 'Actualizar cuenta' : 'Crear cuenta'}
              action={() => {}}
            />
          </div>
        </BasicPanelComponent>
      </form>
    </>
  )
}

export default CreateUserComponent
