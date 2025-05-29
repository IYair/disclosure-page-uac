'use client'
import React, { useEffect, useState } from 'react'
import { UseFormReturn, FieldValues, SubmitHandler } from 'react-hook-form'
import { BasicPanelComponent } from '../panels/BasicPanelComponent'
import LogoComponent from '../LogoComponent'
import TextFieldComponent from '../forms/TextFieldComponent'
import SubmitComponent from '../forms/SubmitComponent'
import useUtilsStore from '@/store/useUtilsStore'
import { toast } from 'sonner'
import { Difficulties } from '@/constants/types'
import { ArrowUturnLeftIcon, XMarkIcon } from '@heroicons/react/20/solid'

/*
Input: A set of methods, a function to create a difficulty level, an optional difficulty ID, and a function to close the modal
Output: An object with properties for the CreateDifficultyComponent
Return value: An object with the properties of the CreateDifficultyComponent
Function: To describe the properties (required and optional) of the CreateDifficultyComponent
Variables: methods, onCreateDifficulty, difficultyId, onClose
Date: 28 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/

interface CreateDifficultyComponentProps {
  methods: UseFormReturn<FieldValues>
  onCreateDifficulty: (DifficultyName: string) => void
  difficultyId?: string
  onClose: () => void
}

/*
Input: An object with properties described in the CreateDifficultyComponentProps interface, see above
Output: A modal component to create or edit a difficulty level
Return value: A React Node
Function: Allow the users to create or edit a difficulty level
Variables: currentDifficulty, setCurrentDifficulty, createDifficulty, updateDifficulty, getDifficulty
Date: 28 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/

const CreateDifficultyComponent: React.FC<CreateDifficultyComponentProps> = ({ methods, onCreateDifficulty, difficultyId, onClose }) => {
  const createDifficulty = useUtilsStore(state => state.createDifficulty)
  const updateDifficulty = useUtilsStore(state => state.updateDifficulty)
  const getDifficulty = useUtilsStore(state => state.getDifficulty)
  const [currentDifficulty, setCurrentDifficulty] = useState<Difficulties>({} as Difficulties)

  // Effect hook to load the difficulty data if an ID is provided
  useEffect(() => {
    const loadDifficulty = async () => {
      // If a difficultyId is provided, fetch the difficulty data
      if (difficultyId) {
        const difficulty = await getDifficulty(difficultyId)
        // If the difficulty is found, set the form values and current difficulty state
        if (difficulty) {
          methods.setValue('DifficultyName', difficulty.name)
          methods.setValue('Level', difficulty.level)
          setCurrentDifficulty(difficulty)
        }
      } else {
        // If no difficultyId is provided, reset the form values and current difficulty state
        methods.setValue('DifficultyName', '')
        methods.setValue('Level', null)
        setCurrentDifficulty({} as Difficulties)
      }
    }
    loadDifficulty()
  }, [difficultyId, getDifficulty, methods])

  // Function to clear the form values and reset the current difficulty state
  const clearForm = () => {
    // If a difficultyId is provided, reset the form with the current difficulty data
    if (difficultyId) {
      methods.reset({
        DifficultyName: currentDifficulty.name,
        Level: currentDifficulty.level
      })
    } else {
      methods.setValue('DifficultyName', '')
      methods.setValue('Level', null)
    }
  }

  // Function to handle form submission
  const onSubmit: SubmitHandler<FieldValues> = async data => {
    let response
    // If a difficultyId is provided, edit the existing difficulty, otherwise create a new one
    if (difficultyId) {
      response = await updateDifficulty(difficultyId, { level: Number(data.Level), name: String(data.DifficultyName) })
    } else {
      response = await createDifficulty({ level: Number(data.Level), name: String(data.DifficultyName) })
    }

    // If the response contains an ID, shows a success message
    if ('id' in response) {
      toast.success(`La dificultad se ha ${difficultyId ? 'editado' : 'creado'} con éxito.`, {
        duration: 5000,
        style: {
          backgroundColor: 'green',
          color: '#FFFFFF'
        }
      })
      onCreateDifficulty(data.DifficultyName)
      methods.setValue('DifficultyName', '')
      methods.setValue('Level', null)
      onClose()
    } else if ('message' in response) {
      toast.error(response.message, { duration: 5000, style: { backgroundColor: 'red', color: '#FFFFFF' } })
    }
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='bg-white dark:bg-dark-primary p-4 rounded-lg shadow-lg relative'>
        <div className='relative'>
          <div className='absolute top-0 right-0 flex gap-1 p-2'>
            <div
              className='p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 rounded'
              title='Restablecer formulario'>
              <button
                type='button'
                onClick={clearForm}
                className='text-inherit' // Color heredado del padre
              >
                <ArrowUturnLeftIcon className='h-6 w-6' />
              </button>
            </div>
            <div
              className='p-2 hover:bg-gray-100 dark:hover:bg-red-700 transition-colors duration-200 rounded'
              title='Cerrar formulario'>
              <button
                onClick={() => {
                  clearForm()
                  onClose()
                }}
                className='text-inherit' // Color heredado del padre
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
                {/* Display the appropriate text if the id is provided */}
                {difficultyId ? 'Editar nivel de dificultad' : 'Crear nuevo nivel de dificultad'}
              </h2>
              <TextFieldComponent
                labelText='Nombre de la dificultad'
                register={methods.register}
                fieldName='DifficultyName'
                id='DifficultyName'
                necessary={true}
                type='text'
              />
              <TextFieldComponent
                labelText='Nivel de la dificultad'
                register={methods.register}
                fieldName='Level'
                id='Level'
                necessary={true}
                type='number'
              />
              <SubmitComponent
                // Set the text based on whether an ID is provided
                text={difficultyId ? 'Actualizar' : 'Crear'}
                action={() => {}}
              />
            </div>
          </form>
        </BasicPanelComponent>
      </div>
    </div>
  )
}

export default CreateDifficultyComponent
