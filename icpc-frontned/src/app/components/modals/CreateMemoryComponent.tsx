'use client'
import React, { useState, useEffect } from 'react'
import { FieldValues, SubmitHandler, UseFormReturn } from 'react-hook-form'
import { BasicPanelComponent } from '../panels/BasicPanelComponent'
import LogoComponent from '../LogoComponent'
import TextFieldComponent from '../forms/TextFieldComponent'
import SubmitComponent from '../forms/SubmitComponent'
import { SelectComponent } from '@/app/components/dropdowns/SelectComponent'
import useUtilsStore from '@/store/useUtilsStore'
import { toast } from 'sonner'
import { MemoryLimit } from '@/constants/types'
import { ArrowUturnLeftIcon, XMarkIcon } from '@heroicons/react/20/solid'

/*
Input: methods (UseFormReturn), onCreateMemory (function), memoryId (optional string), onClose (function)
Output: Props for CreateMemoryComponent
Return value: CreateMemoryComponentProps interface
Function: Describes the properties for the CreateMemoryComponent modal
Variables: methods, onCreateMemory, memoryId, onClose
Date: 28 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/
interface CreateMemoryComponentProps {
  methods: UseFormReturn<FieldValues>
  onCreateMemory: (memoryName: string) => void
  memoryId?: string
  onClose: () => void
}

/*
Input: methods, memoryId, onClose (from CreateMemoryComponentProps)
Output: Modal for creating or editing a memory limit
Return value: React Node (modal component)
Function: Renders a modal for creating or editing a memory limit
Variables: createMemory, updateMemory, getMemory, currentMemory, MemorySelect,
selectedMemoryUnit, setSelectedMemoryUnit, useEffect, clearForm, onSubmit
Date: 28 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/
const CreateMemoryComponent: React.FC<CreateMemoryComponentProps> = ({ methods, memoryId, onClose }) => {
  const createMemory = useUtilsStore(state => state.createMemory)
  const updateMemory = useUtilsStore(state => state.updateMemory)
  const getMemory = useUtilsStore(state => state.getMemory)
  const [currentMemory, setCurrentMemory] = useState({} as MemoryLimit)

  const MemorySelect = [
    { index: 0, id: 'KB', name: 'KB' },
    { index: 1, id: 'GB', name: 'GB' },
    { index: 2, id: 'MB', name: 'MB' }
  ]

  const [selectedMemoryUnit, setSelectedMemoryUnit] = useState<string>(MemorySelect[0].id)

  useEffect(() => {
    const loadMemory = async () => {
      if (memoryId) {
        const memory = await getMemory(memoryId)
        if (memory) {
          setCurrentMemory(memory)
          let val = 0
          if (memory.memoryLimit % (1024 * 1024) === 0) {
            val = memory.memoryLimit / (1024 * 1024)
            setSelectedMemoryUnit('GB')
          } else if (memory.memoryLimit % 1024 === 0) {
            val = memory.memoryLimit / 1024
            setSelectedMemoryUnit('MB')
          } else {
            val = memory.memoryLimit
            setSelectedMemoryUnit('KB')
          }
          methods.reset({
            MemoryName: val
          })
        }
      } else {
        methods.reset({
          MemoryName: ''
        })
        setSelectedMemoryUnit(MemorySelect[0].id)
        setCurrentMemory({} as MemoryLimit)
      }
    }
    loadMemory()
  }, [memoryId, getMemory, methods])

  const clearForm = () => {
    if (memoryId) {
      let val = 0
      if (currentMemory.memoryLimit % (1024 * 1024) === 0) {
        val = currentMemory.memoryLimit / (1024 * 1024)
        setSelectedMemoryUnit('GB')
      } else if (currentMemory.memoryLimit % 1024 === 0) {
        val = currentMemory.memoryLimit / 1024
        setSelectedMemoryUnit('MB')
      } else {
        val = currentMemory.memoryLimit
        setSelectedMemoryUnit('KB')
      }
      methods.reset({
        MemoryName: val
      })
    } else {
      methods.reset()
      setSelectedMemoryUnit(MemorySelect[0].id)
    }
  }

  const onSubmit: SubmitHandler<FieldValues> = async data => {
    const processResponse = async (response: any) => {
      const toastOptions = {
        duration: 5000,
        style: {
          backgroundColor: response.id ? 'green' : '#ff0000',
          color: '#ffffff'
        }
      }
      if (response.id) {
        toast.success(
          `Se ha ${memoryId ? 'editado' : 'creado'} el limite de memoria correctamente: ${response.memoryLimit}KB`,
          toastOptions
        )
        onClose();
      } else if ('message' in response) {
        toast.error(response.message, toastOptions)
      } else {
        toast.error('Error al procesar la solicitud.', toastOptions)
      }
    }

    const memoryData = {
      value: parseInt(data.MemoryName),
      id: selectedMemoryUnit
    }

    if (memoryId) {
      const response = await updateMemory(memoryId, memoryData)
      await processResponse(response)
    } else {
      const response = await createMemory(memoryData)
      await processResponse(response)
    }
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='relative bg-white dark:bg-dark-primary p-4 rounded-lg shadow-lg'>
      <div className="relative">
        <div className="absolute top-0 right-0 flex gap-1 p-2">
           <div
             className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 rounded"
             title="Restablecer formulario"
           >
             <button
               type="button"
               onClick={clearForm}
               className="text-inherit" // Color heredado del padre
             >
               <ArrowUturnLeftIcon className="h-6 w-6" />
             </button>
           </div>
           <div
             className="p-2 hover:bg-gray-100 dark:hover:bg-red-700 transition-colors duration-200 rounded"
             title="Cerrar formulario"
           >
             <button
               onClick={onClose}
               className="text-inherit" // Color heredado del padre
           >
              <XMarkIcon className="h-6 w-6" />
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
                {memoryId ? 'Editar límite de memoria' : 'Crear nuevo límite de memoria'}
              </h2>
              <div className='flex items-end'>
                <div className='w-[70%]'>
                  <TextFieldComponent
                    labelText='Valor de la memoria'
                    register={methods.register}
                    fieldName='MemoryName'
                    id='MemoryName'
                    necessary={true}
                    type='text'
                  />
                </div>
                <div className='w-[30%]'>
                  <SelectComponent
                    options={MemorySelect}
                    fieldName={'magnitud'}
                    id={'magnitud'}
                    labelText={''}
                    selected={selectedMemoryUnit}
                    onChange={setSelectedMemoryUnit}
                  />
                </div>
              </div>
              <div className='my-5'>
              <SubmitComponent
                text={memoryId ? 'Actualizar' : 'Crear'}
                action={() => {}}
              />
              </div>
            </div>
          </form>
        </BasicPanelComponent>
      </div>
    </div>
  )
}

export default CreateMemoryComponent
