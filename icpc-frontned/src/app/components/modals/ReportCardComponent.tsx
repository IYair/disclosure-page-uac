import React from 'react'
import { BasicPanelComponent } from '../panels/BasicPanelComponent'
import LogoComponent from '../LogoComponent'
import { enumTextTags } from '@/constants/types'
import { TextComponent } from '../text/TextComponent'
import { FieldValues, UseFormReturn } from 'react-hook-form'
import TextFieldComponent from '../forms/TextFieldComponent'
import SubmitComponent from '../forms/SubmitComponent'
import { toast } from 'sonner'
import useUtilsStore from '@/store/useUtilsStore'
import { ArrowUturnLeftIcon, XMarkIcon } from '@heroicons/react/20/solid'
import TextAreaComponent from '../forms/TextAreaComponent'

/*
Input: methods (UseFormReturn<FieldValues>), itemType (string), itemId (string), onSubmit (function), onCancel (function)
Output: Props for ReportCardComponent
Return value: IReportCardProps interface
Function: Describes the properties for the ReportCardComponent modal
Variables: methods, itemType, itemId, onSubmit, onCancel
Date: 28 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/
interface IReportCardProps {
  methods: UseFormReturn<FieldValues>
  itemType: string
  itemId: string
  onSubmit: (data: any) => void
  onCancel: () => void
}

/*
Input: methods, itemType, itemId, onSubmit, onCancel (from IReportCardProps)
Output: Modal for submitting a report about an item
Return value: React Node (modal component)
Function: Renders a modal for submitting a report, including description and content fields
Variables: createReport, handleSubmit, clearForm, methods, itemType, itemId, onSubmit, onCancel
Date: 28 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/
const ReportCardComponent = ({ itemType, itemId, onSubmit, onCancel, methods }: Readonly<IReportCardProps>) => {
  const { createReport } = useUtilsStore()

  // Function to handle form submission
  const handleSubmit = async (data: FieldValues) => {
    // Validate that description and content fields are filled
    if (!data.description || !data.content) {
      toast.error('Favor de rellenar el reporte', {
        duration: 5000,
        style: {
          backgroundColor: 'red',
          color: '#ffffff'
        }
      })
      return
    }

    try {
      const response = await createReport({
        summary: data.description,
        report: data.content,
        itemType,
        itemId: itemId
      })
      // Check if the response contains an ID, indicating success
      if ('id' in response) {
        toast.success('Reporte Enviado', {
          duration: 5000,
          style: {
            backgroundColor: 'green',
            color: '#ffffff'
          }
        })
        onSubmit(data)
        onCancel()
      } else {
        const errorMessage = 'message' in response ? response.message : 'Error desconocido';
        toast.error(`Error al enviar el reporte: ${errorMessage}`, {
          duration: 5000,
          style: {
            backgroundColor: '#ff0000',
            color: '#ffffff'
          }
        })
      }
    } catch (error) {
      toast.error(`Error al enviar el reporte: ${error}`, {
        duration: 5000,
        style: {
          backgroundColor: '#ff0000',
          color: '#ffffff'
        }
      })
    }
  }

  // Function to clear the form fields
  const clearForm = () => {
    methods.reset()
  }

  return (
    <div
      className={`margin-auto md:mx-auto max-w-7xl md:px-4 w-full h-full lg:px-8 lg:w-2/3 lg:h-auto 
  min-h-screen place-items-center justify-between py-24`}>
      <BasicPanelComponent backgroundColor='bg-white dark:bg-dark-primary w-full lg:w-2/3'>
        <div className='relative'>
          <div className='absolute top-0 right-0 flex gap-1 p-2'>
            <div
              className='p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 rounded'
              title='Borrar formulario'>
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
                onClick={onCancel}
                className='text-inherit'>
                <XMarkIcon className='h-6 w-6' />
              </button>
            </div>
          </div>
        </div>
        <div className='flex flex-col items-center w-full'>
          <LogoComponent size={100} />
          <TextComponent
            tag={enumTextTags.h1}
            sizeFont='s16'
            className='dark:text-dark-accent'>
            ¿Encontraste un error?
          </TextComponent>
          <form onSubmit={methods.handleSubmit(handleSubmit)} className='w-full'>
            <TextFieldComponent
              labelText='Descripción del error'
              register={methods.register}
              fieldName='description'
              id='description'
              necessary={true}
              type='text'
              auto='off'
            />
            <TextAreaComponent
              labelText='Contenido'
              fieldName='content'
              register={methods.register}
              id={'content'}
              necessary={false}
            />

            <div className='flex justify-center'>
              <SubmitComponent text='Reportar' action={() => {}}/>
            </div>
          </form>
        </div>
      </BasicPanelComponent>
    </div>
  )
}

export default ReportCardComponent
