'use client'
import React, { useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { BasicPanelComponent } from '../panels/BasicPanelComponent'
import LogoComponent from '../LogoComponent'
import TextFieldComponent from '../forms/TextFieldComponent'
import SubmitComponent from '../forms/SubmitComponent'
import useUtilsStore from '@/store/useUtilsStore'
import { toast } from 'sonner'
import { Categories } from '@/constants/types'
import { ArrowUturnLeftIcon, XMarkIcon } from '@heroicons/react/20/solid'

/*
Input: A function to execute when the modal is closed and an optional category ID 
Output: An object with properties for the CreateCategoryComponent
Return value: An object with the properties of the CreateCategoryComponent
Function: To describe the properties (required and optional) of the CreateCategoryComponent
Variables: onClose, categoryId
Date: 28 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/

interface CreateCategoryComponentProps {
  onClose: () => void
  categoryId?: string
}

/*
Input: An object with properties described in the CreateCategoryComponentProps interface, see above
Output: A modal component to create or edit a category
Return value: A React Node
Function: Create a modal that allows the user to create or edit a category
Variables: methods, createCategory, updateCategory, getCategory, currentCategory
Date: 28 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/

const CreateCategoryComponent: React.FC<CreateCategoryComponentProps> = ({ onClose, categoryId }) => {
  const methods = useForm<FieldValues>()
  const createCategory = useUtilsStore(state => state.createCategory)
  const updateCategory = useUtilsStore(state => state.updateCategory || (() => Promise.resolve({})))
  const getCategory = useUtilsStore(state => state.getCategory)
  const [currentCategory, setCurrentCategory] = useState<Categories>({} as Categories)

  // Effect hook to load the category if categoryId is provided
  useEffect(() => {
    // If categoryId is not null
    if (categoryId) {
      // Fetch a category by id
      const loadCategory = async () => {
        const category = await getCategory(categoryId)
        if (category) {
          methods.setValue('categoryName', category.name)
          setCurrentCategory(category)
        }
      }
      loadCategory()
    }
  }, [categoryId, getCategory, methods])

  // Function to clear the form fields
  const clearForm = () => {
    // Reset the form fields to their initial values
    if (categoryId) {
      methods.reset({
        categoryName: currentCategory.name
      })
    } else {
      methods.reset()
    }
  }

  // Function to handle form submission
  const onSubmit: SubmitHandler<FieldValues> = async data => {
    let response
    // If categoryId is provided, update the category; otherwise, create a new one
    if (categoryId) {
      response = await updateCategory(categoryId, { name: String(data.categoryName) })
    } else {
      response = await createCategory({ name: String(data.categoryName), commentId: String(data.categoryName) })
    }

    // If the response contains an id, show a success message; otherwise, show an error message
    if ('id' in response) {
      toast.success(`La categoría se ha ${categoryId ? 'editado' : 'creado'} con éxito.`, {
        duration: 5000,
        style: {
          backgroundColor: 'green',
          color: '#FFFFFF'
        }
      })
      onClose()
    } else if ('message' in response) {
      toast.error(response.message, { duration: 5000, style: { backgroundColor: 'red', color: '#FFFFFF' } })
    }
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='bg-white dark:bg-dark-primary p-4 rounded-lg shadow-lg relative w-1/3'>
        <div className='relative'>
          <div className='absolute top-0 right-0 flex gap-1 p-2'>
            <div
              className='p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 rounded'
              title='Restablecer formulario'>
              <button
                type='button'
                onClick={clearForm}
                className='text-inherit'
              >
                <ArrowUturnLeftIcon className='h-6 w-6' />
              </button>
            </div>
            <div
              className='p-2 hover:bg-gray-100 dark:hover:bg-red-700 transition-colors duration-200 rounded'
              title='Cerrar formulario'>
              <button
                onClick={onClose}
                className='text-inherit'
              >
                <XMarkIcon className='h-6 w-6' />
              </button>
            </div>
          </div>
        </div>
        <BasicPanelComponent backgroundColor='bg-white dark:bg-dark-primary'>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className='space-y-4'>
            <div className='flex flex-col items-center'>
              <LogoComponent size={100} />
              <h2 className='text-center text-lg font-bold dark:text-dark-accent'>
                {/* Display the appropriate text if the category id exists */}
                {categoryId ? 'Editar categoría' : 'Crear nueva categoría'}
              </h2>
              <TextFieldComponent
                labelText='Nombre de la categoría'
                register={methods.register}
                fieldName='categoryName'
                id='categoryName'
                necessary={true}
                type='text'
              />
              <SubmitComponent
                // Display the appropriate text if the category id exists
                text={categoryId ? 'Actualizar' : 'Crear'}
                action={() => {}}
              />
            </div>
          </form>
        </BasicPanelComponent>
      </div>
    </div>
  )
}

export default CreateCategoryComponent
