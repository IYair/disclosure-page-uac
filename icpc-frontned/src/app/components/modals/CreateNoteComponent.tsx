'use client'
import React, { useEffect, useState, useRef } from 'react'
import { BasicPanelComponent } from '../panels/BasicPanelComponent'
import LogoComponent from '../LogoComponent'
import { TextComponent } from '../text/TextComponent'
import { Categories, enumTextTags, Tags, Option } from '@/constants/types'
import TextFieldComponent from '../forms/TextFieldComponent'
import { FieldValues, Controller, useForm, SubmitHandler } from 'react-hook-form'
import TextAreaComponent from '../forms/TextAreaComponent'
import MarkdownAreaComponent from '../forms/MarkdownAreaComponent'
import SubmitComponent from '../forms/SubmitComponent'
import TagSelectorComponent from '../forms/TagSelectorComponent'
import useUtilsStore from '@/store/useUtilsStore'
import useNoteStore from '@/store/useNoteStore'
import InputSelectorCreateComponent from '../dropdowns/InputSelectorCreateComponent'
import { toast } from 'sonner'
import useAuthStore from '@/store/useStore'
import { ArrowUturnLeftIcon, XMarkIcon } from '@heroicons/react/20/solid'
import ConfirmDenyComponent from '../buttons/Confirm&DenyComponent'

/*
Input: An id string, an onClose function
Output: An object with properties for the CreateNotesComponent
Return value: An object with the properties of the CreateNotesComponent
Function: To describe the properties (required and optional) of the CreateNotesComponent
Variables: id, onClose
Date: 28 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/

interface CreateNotesComponentProps {
  id?: string
  onClose: () => void
}

/*
Input: An object with properties described in the CreateNotesComponentProps interface, see above
Output: A modal component to create or edit a note
Return value: A React Node
Function: To allow users to create or edit a note
Variables: methods, getTags, tagList, getCategories, categoriesList, createNote,
updateNote, createCategory, selectRef, tags, categories, selectedTags, selectedCategory, update, getNotesArticle, showConfirm
Date: 28 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/

const CreateNoteComponent = (props: CreateNotesComponentProps) => {
  const methods = useForm<FieldValues>()
  const getTags = useUtilsStore(state => state.getTags)
  const tagList = useUtilsStore(state => state.tags)
  const getCategories = useUtilsStore(state => state.getCategories)
  const categoriesList = useUtilsStore(state => state.categories)
  const createNote = useNoteStore(state => state.createNote)
  const updateNote = useNoteStore(state => state.updateNote)
  const createCategory = useUtilsStore(state => state.createCategory)

  const selectRef = useRef<{ clear: () => void }>(null)
  const [tags, setTags] = useState<Tags[]>(tagList)
  const [categories, setCategories] = useState<Categories[]>(categoriesList)
  const [selectedTags, setSelectedTags] = useState<Tags[]>([])
  const [selectedCategory, setSelectedCategory] = useState<Option | null>(null)
  const [update, setUpdate] = useState<boolean>(false)
  const getNotesArticle = useNoteStore(state => state.getNote)
  const [showConfirm, setShowConfirm] = React.useState(false)

  // Effect hook to fetch initial data for tags and categories, and load note if id is provided
  useEffect(() => {
    // Function to fetch notes and set initial form values
    const fetchNotes = async () => {
      try {
        getTags().then(response => {
          setTags(response)
        })
        getCategories().then(response => {
          setCategories(response)
        })

        // If an ID is provided, fetch the note data
        if (props.id) {
          const note = await getNotesArticle(props.id)
          // If the note exists, reset the form with its data
          if (note) {
            methods.reset({
              title: note.title,
              description: note.commentId.body,
              content: note.body,
              category: { label: note.category.name, value: note.category.id },
              tags: note.tags
            })
            setSelectedCategory({ label: note.category.name, value: note.category.id })
            setSelectedTags(note.tags)
          } else {
            toast.error('No se encontró la nota con el ID proporcionado.', {
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

    fetchNotes()
  }, [props.id, methods, getTags, getCategories, getNotesArticle])

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

  // Function to handle form submission
  const onSubmit: SubmitHandler<FieldValues> = async formData => {
    // Function to process the response from the API
    const processResponse = async (response: any) => {
      const toastOptions = {
        duration: 5000,
        style: {
          backgroundColor: 'id' in response ? 'green' : '#ff0000',
          color: '#ffffff'
        }
      }
      // If the response contains an id, show a success message; otherwise, show an error message
      if ('id' in response) {
        toast.success(props.id ? 'Nota Actualizada' : 'Nota creada con éxito.', toastOptions)
        props.onClose()
      } else if ('message' in response) {
        toast.error(response.message, toastOptions)
      } else {
        toast.error('Unexpected response format', toastOptions)
      }
    }

    const noteData = {
      title: String(formData.title),
      description: String(formData.description),
      body: String(formData.content),
      categoryId: { name: formData.category.label, id: formData.category.value },
      tags: formData.tags,
      isVisible: useAuthStore.getState().user?.role === 'admin',
      userAuthor: String(useAuthStore.getState().user?.userName),
      role: String(useAuthStore.getState().user?.role)
    }

    // If an ID is provided, update the note; otherwise, create a new one
    if (props.id) {
      const response = await updateNote(noteData, props.id)
      await processResponse(response)
    } else {
      const response = await createNote(noteData)
      await processResponse(response)
    }
  }

  // Function to clear the form fields
  const clearForm = () => {
    // If an id is provided, fetch the data of the note and reset the values
    if (props.id) {
      // Function to fetch the data of a note
      const fetchNote = async () => {
        const note = await getNotesArticle(props.id!)
        // If a valid note is found, reset the form with its data
        if (note) {
          methods.reset({
            title: note.title,
            category: { label: note.category.name, value: note.category.id },
            tags: note.tags,
            description: note.commentId.body,
            content: note.body
          })
          setSelectedCategory({ label: note.category.name, value: note.category.id })
          setSelectedTags(note.tags)
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
      fetchNote()
    } else {
      methods.reset()
      setSelectedCategory(null)
    }
  }

  // Function to validate the form data before submission
  const dataValidate = () => {
    const data = methods.getValues()
    const missingFields = []

    if (!data.title) missingFields.push('Título del apunte')
    if (data.category.length === 0) missingFields.push('Categoría')
    if (data.tags.length === 0) missingFields.push('Etiquetas')
    if (!data.description) missingFields.push('Descripción')
    if (!data.content) missingFields.push('Contenido')

    // If there are missing fields, show an error toast and return
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
    setShowConfirm(true)
  }

  return (
    <>
      {/* If the showConfirm state is true, display the confirmation modal */}
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
        className={`margin-auto md:mx-auto max-w-7xl md:px-4 w-full h-full lg:px-8 lg:w-2/3 lg:h-auto 
      min-h-screen place-items-center justify-between py-10`}>
        <BasicPanelComponent backgroundColor='bg-white dark:bg-dark-primary'>
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
              {/* Display the appropriate text if an id is provided */}
              {props.id ? 'Editar apunte' : 'Crear apunte'}
            </TextComponent>
            <TextFieldComponent
              labelText='Título del apunte*'
              register={methods.register}
              fieldName='title'
              auto='off'
              id='title'
              necessary={true}
              type='text'
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
              defaultValue={[] as Tags[]}
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
            <TextAreaComponent
              labelText='Descripción*'
              register={methods.register}
              fieldName='description'
              id='description'
              necessary={true}
            />
            <Controller
              name='content'
              defaultValue=''
              control={methods.control}
              rules={{ required: true }}
              render={({ field }) => (
                <MarkdownAreaComponent
                  value={field.value}
                  onChange={newValue => field.onChange(newValue)}
                  labelText='Contenido*'
                  className='p-2'
                />
              )}
            />
            <SubmitComponent
              // Display the appropriate text if an id is provided
              text={props.id ? 'Actualizar apunte' : 'Crear apunte'}
              action={dataValidate}
            />
          </div>
        </BasicPanelComponent>
      </form>
    </>
  )
}

export default CreateNoteComponent
