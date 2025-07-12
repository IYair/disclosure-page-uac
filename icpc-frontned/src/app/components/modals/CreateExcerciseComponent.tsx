'use client'
import React, { useEffect, useState, useRef } from 'react'
import { Controller, FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { BasicPanelComponent } from '../panels/BasicPanelComponent'
import LogoComponent from '../LogoComponent'
import { TextComponent } from '../text/TextComponent'
import { Categories, enumTextTags, Tags, Difficulties, TimeLimit, MemoryLimit, Option } from '@/constants/types'
import TextFieldComponent from '../forms/TextFieldComponent'
import TagSelectorComponent from '../forms/TagSelectorComponent'
import MarkdownAreaComponent from '../forms/MarkdownAreaComponent'
import SubmitComponent from '../forms/SubmitComponent'
import useExcerciseStore from '@/store/useExcerciseStore'
import useUtilsStore from '@/store/useUtilsStore'
import { toast } from 'sonner'
import InputSelectorComponent from '../dropdowns/InputSelectorComponent'
import InputSelectorCreateComponent from '../dropdowns/InputSelectorCreateComponent'
import useAuthStore from '@/store/useStore'
import TextAreaComponent from '../forms/TextAreaComponent'
import { ArrowUturnLeftIcon, XMarkIcon } from '@heroicons/react/20/solid'
import ConfirmDenyComponent from '../buttons/Confirm&DenyComponent'

/*
Input: An optional id, a function to execute when the modal is closed
Output: An object with properties for the CreateExerciseComponent
Return value: An object with the properties of the CreateExerciseComponent
Function: To describe the properties (required and optional) of the CreateExerciseComponent
Variables: id, onClose
Date: 28 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/

interface CreateExerciseComponentProps {
  id?: string
  onClose: () => void
  onCreate: () => void
}

const CreateExcerciseComponent = (props: CreateExerciseComponentProps) => {
  const methods = useForm<FieldValues>()
  const createExcercise = useExcerciseStore(state => state.createExcercise)
  const updateExcercise = useExcerciseStore(state => state.updateExcercise)
  const getTags = useUtilsStore(state => state.getTags)
  const tagList = useUtilsStore(state => state.tags)
  const getCategories = useUtilsStore(state => state.getCategories)
  const categoriesList = useUtilsStore(state => state.categories)
  const getDifficulties = useUtilsStore(state => state.getDifficulties)
  const difficultiesList = useUtilsStore(state => state.difficulty)
  const getTimeLimit = useUtilsStore(state => state.getTimeLimit)
  const timeLimitList = useUtilsStore(state => state.timeLimit)
  const getMemoryLimit = useUtilsStore(state => state.getMemoryLimit)
  const memoryLimitList = useUtilsStore(state => state.memoryLimit)
  const createTimeLimit = useUtilsStore(state => state.createTimeLimit)
  const createCategory = useUtilsStore(state => state.createCategory)

  const selectRef = useRef<{ clear: () => void }>(null)
  const [selectedTags, setSelectedTags] = useState<Tags[]>([])
  const [selectedCategory, setSelectedCategory] = useState<Option | null>(null)
  const [selectedMemory, setSelectedMemory] = useState<Option | null>(null)
  const getExercise = useExcerciseStore(state => state.getExercise)
  const [showConfirm, setShowConfirm] = React.useState(false)

  let [tags, setTags] = useState<Tags[]>(tagList)
  let [categories, setCategories] = useState<Categories[]>(categoriesList)
  let [difficulty, setDifficulty] = useState<Difficulties[]>(difficultiesList)
  let [timeLimits, setTimeLimits] = useState<TimeLimit[]>(timeLimitList)
  let [memoryLimits, setMemoryLimits] = useState<MemoryLimit[]>(memoryLimitList)
  let [update, setUpdate] = useState<boolean>(false)

  // Effect to fetch initial data for the form
  useEffect(() => {
    const fetchExercise = async () => {
      try {
        getTags().then(response => {
          setTags(response)
        })
        getCategories().then(response => {
          setCategories(response)
        })
        getDifficulties().then(response => {
          setDifficulty(response)
        })
        getTimeLimit().then(response => {
          setTimeLimits(response)
        })
        getMemoryLimit().then(response => {
          setMemoryLimits(response)
        })

        // If an ID is provided, fetch the exercise data to pre-fill the form
        if (props.id) {
          const exercise = await getExercise(props.id)
          // If the exercise is found, set the form values and selected options
          if (exercise) {
            methods.reset({
              name: exercise.title,
              category: { label: exercise.category.name, value: exercise.category.id },
              difficulty: { label: exercise.difficulty.name, value: exercise.difficulty.id },
              // If time limit is set, format it for the form
              time: exercise.time ? { label: exercise.time.timeLimit.toString(), value: exercise.time.id } : null,
              // If memory limit is set, format it for the form
              memoryId:
                exercise.memoryId !== null ? { label: exercise.memoryId.memoryLimit.toString(), value: exercise.memoryId.id } : null,
              input: exercise.input,
              output: exercise.output,
              constraints: exercise.constraints,
              clue: exercise.clue,
              tags: exercise.tags,
              author: exercise.author,
              description: exercise.description,
              example_input: exercise.example_input,
              example_output: exercise.example_output,
              solution: exercise.solution
            })
            setSelectedCategory({ label: exercise.category.name, value: exercise.category.id })
            setSelectedTags(exercise.tags)
            // If memory limit is set, format it for the form
            setSelectedMemory(
              exercise.memoryId !== null ? { label: exercise.memoryId.memoryLimit.toString(), value: exercise.memoryId.id } : null
            )
          } else {
            toast.error('No se encontró el ejercicio con el ID proporcionado.', {
              duration: 5000,
              style: {
                backgroundColor: '#ff0000',
                color: '#ffffff'
              }
            })
          }
        }
      } catch (error) {
        toast.error('Error al cargar los datos iniciales.', {
          duration: 5000,
          style: {
            backgroundColor: '#ff0000',
            color: '#ffffff'
          }
        })
      }
    }

    fetchExercise()
  }, [props.id, methods, getExercise, getCategories, getDifficulties, getTags, getTimeLimit, getMemoryLimit, update])

  // Function to handle form submission
  const onSubmit: SubmitHandler<FieldValues> = async formData => {
    // Function to process the response from the API after creating or updating an exercise
    const processResponse = async (response: any) => {
      const toastOptions = {
        duration: 5000,
        style: {
          backgroundColor: response.id ? 'green' : '#ff0000',
          color: '#ffffff'
        }
      }
      // If the response contains an ID, it means the exercise was created or updated successfully and the modal closes
      if (response.id) {
        toast.success(props.id ? 'Ejercicio Actualizado' : 'Ejercicio creado con éxito.', toastOptions)
        props.onClose()
      } else if ('message' in response) {
        toast.error(response.message, toastOptions)
      } else {
        toast.error('Unexpected response format', toastOptions)
      }
    }

    const exerciseData = {
      name: String(formData.name),
      category: { name: formData.category.label, id: formData.category.value },
      difficulty: { name: formData.difficulty.label, id: formData.difficulty.value },
      time: formData.time?.value ? { value: formData.time.label, id: formData.time.value } : null,
      memoryId: formData.memoryId?.value ? String(formData.memoryId.value) : '',
      input: String(formData.input),
      output: String(formData.output),
      constraints: formData.constraints ? String(formData.constraints) : '',
      clue: formData.clue ? String(formData.clue) : '',
      tags: formData.tags,
      author: String(formData.author),
      description: String(formData.description),
      example_input: String(formData.example_input),
      example_output: String(formData.example_output),
      solution: formData.solution ? String(formData.solution) : '',
      isVisible: false,
      userAuthor: String(useAuthStore.getState().user?.userName),
      role: String(useAuthStore.getState().user?.role)
    }

    // If an ID is provided, update the existing exercise, otherwise create a new one
    if (props.id) {
      const response = await updateExcercise(exerciseData, props.id)
      await processResponse(response)
    } else {
      const response = await createExcercise(exerciseData)
      await processResponse(response)
    }
  }

  // Function to handle the creation of a new category
  const handleCreateCategory = async (newValue: Option) => {
    const category = newValue.label
    const response = await createCategory({ name: category, commentId: category })
    if ('statusCode' in response && response.statusCode === 201) {
      setCategories([...categories, { id: response.data.id, name: category }])
    } else if ('message' in response) {
      toast.error(response.message, {
        duration: 5000,
        style: {
          backgroundColor: '#ff0000',
          color: '#ffffff'
        }
      })
    }
    setUpdate(!update)
  }

  // Function to handle the creation of a new time limit
  const handleCreateTimeLimit = async (newValue: Option) => {
    const timeLimit = parseInt(newValue.label)
    const response = await createTimeLimit(timeLimit)
    if ('statusCode' in response && response.statusCode === 201) {
      setTimeLimits([...timeLimits, { id: response.data.id, timeLimit: timeLimit }])
    } else if ('message' in response) {
      toast.error(response.message, {
        duration: 5000,
        style: {
          backgroundColor: '#ff0000',
          color: '#ffffff'
        }
      })
    }
    setUpdate(!update)
  }

  // Function to clear the form and reset the selected options
  const clearForm = () => {
    // If an id was provided, fetch the exercise data to reset the form
    if (props.id) {
      const fetchExercise = async () => {
        const exercise = await getExercise(props.id!)
        // If the exercise is found, reset the form with its data
        if (exercise) {
          methods.reset({
            name: exercise.title,
            category: { label: exercise.category.name, value: exercise.category.id },
            difficulty: { label: exercise.difficulty.name, value: exercise.difficulty.id },
            time: { label: exercise.time.timeLimit.toString(), value: exercise.time.id },
            memoryId: { label: exercise.memoryId.memoryLimit.toString(), value: exercise.memoryId.id },
            input: exercise.input,
            output: exercise.output,
            constraints: exercise.constraints,
            clue: exercise.clue,
            tags: exercise.tags,
            author: exercise.author,
            description: exercise.description,
            example_input: exercise.example_input,
            example_output: exercise.example_output,
            solution: exercise.solution
          })
          setSelectedCategory({ label: exercise.category.name, value: exercise.category.id })
          setSelectedTags(exercise.tags)
          setSelectedMemory({ label: exercise.memoryId.memoryLimit.toString(), value: exercise.memoryId.id })
        } else {
          toast.error('No se pudo recargar la nota.', {
            duration: 5000,
            style: {
              backgroundColor: '#ff0000',
              color: '#ffffff'
            }
          })
        }
      }
      fetchExercise()
    } else {
      // If no id was provided, reset the form to its initial state
      methods.reset()
      setSelectedCategory(null)
      setSelectedMemory(null)
    }
  }

  // Function to validate the form data before submission
  const dataValidate = () => {
    const data = methods.getValues()
    const missingFields = []
    const invalidFields = []

    // Validation of required fields
    if (!data.name) missingFields.push('Nombre del ejercicio')
    if (data.category.length === 0) missingFields.push('Categoría')
    if (data.difficulty.length === 0) missingFields.push('Nivel de dificultad')
    if (!data.input) missingFields.push('Entrada esperada')
    if (!data.output) missingFields.push('Salida esperada')
    if (!data.example_input) missingFields.push('Ejemplo de entrada')
    if (!data.example_output) missingFields.push('Ejemplo de salida')
    if (data.tags.length === 0) missingFields.push('Etiquetas')
    if (!data.description) missingFields.push('Descripción del problema')

    // Validation of field length
    if (data.input && data.input.length > 255) invalidFields.push('Entrada esperada')
    if (data.output && data.output.length > 255) invalidFields.push('Salida esperada')
    if (data.example_input && data.example_input.length > 255) invalidFields.push('Ejemplo de entrada')
    if (data.example_output && data.example_output.length > 255) invalidFields.push('Ejemplo de salida')

    // Show missing fields
    if (missingFields.length > 0) {
      toast.error(`Favor de llenar los datos de: ${missingFields.join(', ')}`, {
        duration: 5000,
        style: {
          textAlign: 'justify',
          backgroundColor: '#ff0000',
          color: '#ffffff'
        }
      })
      return
    }

    // Show invalid fields
    if (invalidFields.length > 0) {
      toast.error(`Los siguientes campos no deben exceder 255 caracteres: ${invalidFields.join(', ')}`, {
        duration: 5000,
        style: {
          textAlign: 'justify',
          backgroundColor: '#ff0000',
          color: '#ffffff'
        }
      })
      return
    }

    setShowConfirm(true)
  }
  return (
    <>
      {/* Display the ConfirmDenyComponent according to state */}
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
        }}
        className={`margin-auto md:mx-auto max-w-7xl md:px-4 w-full h-full lg:px-8 lg:w-11/12 lg:h-auto 
    min-h-screen place-items-center justify-between py-10`}>
        <BasicPanelComponent backgroundColor='bg-white dark:bg-dark-primary'>
          <div className='relative'>
            <div className='absolute top-0 right-0 flex gap-1 p-2'>
              <div
                className='p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration:200 rounded'
                title='Restablecer formulario'>
                <button
                  type='button'
                  onClick={clearForm}
                  className='text-inherit'>
                  <ArrowUturnLeftIcon className='h-6 w-6' />
                </button>
              </div>
              <div
                className='p-2 hover:bg-gray-100 dark:hover:bg-red-700 transition-colors duration:200 rounded'
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
              {props.id ? 'Editar ejercicio' : 'Crear ejercicio'}
            </TextComponent>
          </div>
          <div className='grid grid-cols-1 items-start lg:grid-cols-2 lg:gap-16'>
            <div className='w-full flex flex-col gap-2'>
              <TextFieldComponent
                labelText='Nombre del ejercicio*'
                register={methods.register}
                fieldName='name'
                id='name'
                necessary={true}
                type='text'
                auto='off'
              />
              <Controller
                defaultValue={[]}
                control={methods.control}
                rules={{ required: true }}
                render={({ field }) => (
                  <InputSelectorCreateComponent
                    label='Categoría*'
                    id='category'
                    ref={selectRef}
                    onChange={val => {
                      field.onChange(val)
                      setSelectedCategory(val)
                    }}
                    options={categories.map(item => {
                      return { label: item.name, value: item.id }
                    })}
                    handleCreate={handleCreateCategory}
                    selectedOption={field.value}
                  />
                )}
                name='category'
              />
              <Controller
                name='tags'
                defaultValue={[]}
                control={methods.control}
                render={({ field }) => (
                  <TagSelectorComponent
                    id='tagSelector2'
                    options={tags}
                    selectedTags={field.value}
                    onChange={val => field.onChange(val)}
                    label='Etiquetas*'
                  />
                )}
                rules={{ required: true }}
              />
              <Controller
                defaultValue={[]}
                control={methods.control}
                rules={{ required: true }}
                render={({ field }) => (
                  <InputSelectorComponent
                    label='Nivel de dificultad*'
                    id='difficulty'
                    onChange={val => field.onChange(val)}
                    options={difficulty.map(item => {
                      return { label: item.name, value: item.id }
                    })}
                    selectedOption={field.value}
                  />
                )}
                name='difficulty'
              />
              <Controller
                defaultValue={[]}
                control={methods.control}
                render={({ field }) => (
                  <InputSelectorComponent
                    label='Límite de tiempo'
                    id='time'
                    onChange={val => field.onChange(val)}
                    options={timeLimits.map(item => {
                      return { label: item.timeLimit.toString(), value: item.id }
                    })}
                    selectedOption={field.value}
                  />
                )}
                name='time'
              />
              <Controller
                defaultValue={[]}
                control={methods.control}
                render={({ field }) => (
                  <InputSelectorComponent
                    label='Límite de memoria'
                    id='memoryId'
                    onChange={val => {
                      field.onChange(val)
                    }}
                    options={memoryLimits.map(item => {
                      const label: number = item.memoryLimit
                      return { label: label.toString(), value: item.id }
                    })}
                    selectedOption={field.value}
                  />
                )}
                name='memoryId'
              />
              <TextAreaComponent
                labelText='Entrada esperada*'
                register={methods.register}
                fieldName='input'
                id='input'
                necessary={true}
              />
              <TextAreaComponent
                labelText='Salida esperada*'
                register={methods.register}
                fieldName='output'
                id='output'
                necessary={true}
              />
              <TextAreaComponent
                labelText='Restricciones'
                register={methods.register}
                fieldName='constraints'
                id='constraints'
                necessary={false}
              />

              <TextFieldComponent
                labelText='Pista'
                register={methods.register}
                fieldName='clue'
                id='clue'
                necessary={false}
                type='text'
                auto='off'
              />
              <TextFieldComponent
                labelText='Autor'
                register={methods.register}
                fieldName='author'
                id='author'
                necessary={false}
                type={'username'}
                auto='off'
              />
            </div>
            <div className='w-full flex flex-col gap-2'>
              <Controller
                name='description'
                defaultValue=''
                control={methods.control}
                rules={{ required: true }}
                render={({ field }) => (
                  <MarkdownAreaComponent
                    value={field.value}
                    onChange={newValue => field.onChange(newValue)}
                    labelText='Descripción del problema*'
                    className='p-2'
                  />
                )}
              />
              <TextAreaComponent
                labelText='Ejemplo de entrada*'
                register={methods.register}
                fieldName='example_input'
                id='example_input'
                necessary={true}
              />
              <TextAreaComponent
                labelText='Ejemplo de salida*'
                register={methods.register}
                fieldName='example_output'
                id='example_output'
                necessary={true}
              />
              <Controller
                name='solution'
                defaultValue=''
                control={methods.control}
                render={({ field }) => (
                  <MarkdownAreaComponent
                    value={field.value}
                    onChange={newValue => field.onChange(newValue)}
                    labelText='Solución del problema'
                    className='p-2'
                  />
                )}
              />
            </div>
          </div>
          <div className='flex flex-col items-center'>
            <SubmitComponent
              // Set the text based on whether an ID is provided
              text={props.id ? 'Actualizar ejercicio' : 'Crear ejercicio'}
              action={dataValidate}
            />
          </div>
        </BasicPanelComponent>
      </form>
    </>
  )
}

export default CreateExcerciseComponent
