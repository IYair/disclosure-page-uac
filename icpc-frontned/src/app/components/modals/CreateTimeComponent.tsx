'use client'
import React, { useState, useEffect } from 'react'
import { FieldValues, SubmitHandler, UseFormReturn } from 'react-hook-form'
import { BasicPanelComponent } from '../panels/BasicPanelComponent'
import LogoComponent from '../LogoComponent'
import TextFieldComponent from '../forms/TextFieldComponent'
import SubmitComponent from '../forms/SubmitComponent'
import useUtilsStore from '@/store/useUtilsStore'
import { toast } from 'sonner'
import { TimeLimit } from '@/constants/types'
import { ArrowUturnLeftIcon, XMarkIcon } from '@heroicons/react/20/solid'

/*
Input: methods (UseFormReturn<FieldValues>), onCreateTimeLimit (function), timeId (optional string), onClose (function)
Output: Props for CreateTimeLimitComponent
Return value: CreateTimeLimitComponentProps interface
Function: Describes the properties for the CreateTimeLimitComponent modal
Variables: methods, onCreateTimeLimit, timeId, onClose
Date: 28 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/
interface CreateTimeLimitComponentProps {
  methods: UseFormReturn<FieldValues>
  onCreateTimeLimit: (time: number) => void
  timeId?: string
  onClose: () => void
}

/*
Input: methods, onCreateTimeLimit, timeId, onClose (from CreateTimeLimitComponentProps)
Output: Modal for creating or editing a time limit
Return value: React Node (modal component)
Function: Renders a modal for creating or editing a time limit, including a value field
Variables: createTimeLimit, updateTimeLimit, getTimeLimit, currentTimeLimit, useEffect, clearForm, onSubmit
Date: 28 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/
const CreateTimeLimitComponent: React.FC<CreateTimeLimitComponentProps> = ({ methods, onCreateTimeLimit, timeId, onClose }) => {
  const createTimeLimit = useUtilsStore(state => state.createTimeLimit)
  const updateTimeLimit = useUtilsStore(state => state.updateTimeLimit)
  const getTimeLimit = useUtilsStore(state => state.getTimeLimit)
  const [currentTimeLimit, setCurrentTimeLimit] = useState<TimeLimit>({} as TimeLimit)

  // Effect hook to load the time limit if timeId is provided
  useEffect(() => {
    // Function to load the time limit based on timeId
    const loadTimeLimit = async () => {
      // If timeId is provided, fetch the time limit details and fill the form with its values
      if (timeId) {
        const timeLimits = await getTimeLimit()
        const timeLimit = timeLimits.find(t => t.id === timeId)
        if (timeLimit) {
          methods.setValue('TimeLimit', timeLimit.timeLimit.toString())
          setCurrentTimeLimit(timeLimit)
        }
      } else {
        methods.reset({
          TimeLimit: ''
        })
        setCurrentTimeLimit({} as TimeLimit)
      }
    }
    loadTimeLimit()
  }, [timeId, getTimeLimit, methods])

  // Function to clear the form fields
  const clearForm = () => {
    // Reset the form fields to their initial values
    if (timeId) {
      methods.reset({
        TimeLimit: currentTimeLimit.timeLimit.toString()
      })
    } else methods.setValue('TimeLimit', '')
  }

  // Function to handle form submission
  const onSubmit: SubmitHandler<FieldValues> = async data => {
    const timeData = {
      timeLimit: parseInt(data.TimeLimit)
    }

    let response
    // If timeId is provided, update the time limit; otherwise, create a new one
    if (timeId) {
      response = await updateTimeLimit(timeId, { timeLimit: timeData.timeLimit })
    } else {
      response = await createTimeLimit(timeData.timeLimit)
    }

    // Handle the response from the API, if an id is found in the response then the request was successful
    if ('id' in response) {
      toast.success(`Límite de tiempo ${timeId ? 'editado' : 'creado'} con éxito.`, {
        duration: 5000,
        style: {
          backgroundColor: 'green',
          color: '#FFFFFF'
        }
      })
      onCreateTimeLimit(timeData.timeLimit)
      onClose()
    } else if ('message' in response) {
      toast.error(response.message, { duration: 5000, style: { backgroundColor: 'red', color: '#FFFFFF' } })
    }
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='relative bg-white dark:bg-dark-primary p-4 rounded-lg shadow-lg'>
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
                {/* Display the appropriate text if an id was provided */}
                {timeId ? 'Editar límite de tiempo' : 'Crear nuevo límite de tiempo'}
              </h2>
              <TextFieldComponent
                labelText='Valor del tiempo'
                register={methods.register}
                fieldName='TimeLimit'
                id='TimeLimit'
                necessary={true}
                type='text'
              />
              <SubmitComponent
                // Display the appropriate text if an id was provided
                text={timeId ? 'Actualizar' : 'Crear'}
                action={() => {}}
              />
            </div>
          </form>
        </BasicPanelComponent>
      </div>
    </div>
  )
}

export default CreateTimeLimitComponent
