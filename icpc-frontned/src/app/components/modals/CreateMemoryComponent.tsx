'use client'
import React from 'react'
import { UseFormReturn, FieldValues, SubmitHandler, useForm, Controller } from 'react-hook-form'
import { BasicPanelComponent } from '../panels/BasicPanelComponent'
import LogoComponent from '../LogoComponent'
import TextFieldComponent from '../forms/TextFieldComponent'
import SubmitComponent from '../forms/SubmitComponent'
import { SelectComponent } from '@/app/components/dropdowns/SelectComponent'
import useUtilsStore from '@/store/useUtilsStore'
import { toast } from 'sonner'

/*  
Formulario para creación de categorías
Fecha: 12 - 11 - 2024  
*/

const CreateMemoryComponent = () => {
  const methods = useForm<FieldValues>()
  const createMemory = useUtilsStore(state => state.createMemoryLimit)
  const onSubmit: SubmitHandler<FieldValues> = async data => {
    const response = await createMemory({ value: parseInt(data.MemoryName), id: String(data.magnitud) })
    if ('statusCode' in response && response.statusCode === 201) {
      toast.success(response.message, {
        duration: 5000,
        style: {
          backgroundColor: 'green',
          color: '#FFFFFF'
        }
      })
    } else if ('message' in response) {
      toast.error(response.message, { duration: 5000, style: { backgroundColor: 'red', color: '#FFFFFF' } })
    }
  }

  const MemorySelect = [
    {
      index: 0,
      id: 'KB',
      name: 'KB'
    },
    {
      index: 1,
      id: 'GB',
      name: 'GB'
    },
    {
      index: 2,
      id: 'MB',
      name: 'MB'
    }
  ]

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
      <BasicPanelComponent backgroundColor='bg-white dark:bg-dark-primary'>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className='space-y-4'>
          <div className='flex flex-col items-center'>
            <LogoComponent size={100} />
            <h2 className='text-center text-lg font-bold dark:text-dark-accent'>Crear nuevo limite de memoria</h2>
            <div className='flex items-end'>
              <div className='w-[70%]'>
                <TextFieldComponent
                  labelText='Valor de la memoria en GB'
                  register={methods.register}
                  fieldName='MemoryName'
                  id='MemoryName'
                  necessary={true}
                  type='text'
                />
              </div>
              <div className='w-[30%]'>
                <Controller
                  defaultValue={MemorySelect[0]}
                  control={methods.control}
                  render={({ field }) => (
                    <SelectComponent
                      options={MemorySelect}
                      selected={field.value}
                      fieldName='magnitud'
                      id='magnitud'
                      labelText=' '
                      onChange={newSelected => {
                        console.log(newSelected)
                        field.onChange(newSelected)
                      }}
                      className=''
                    />
                  )}
                  name='category'
                />
              </div>
            </div>
            <SubmitComponent text='Crear' />
          </div>
        </form>
      </BasicPanelComponent>
    </div>
  )
}

export default CreateMemoryComponent
