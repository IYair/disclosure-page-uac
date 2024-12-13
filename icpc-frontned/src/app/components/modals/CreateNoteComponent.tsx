'use client'
import React, { useEffect, useState } from 'react'
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

/*
Input: None
Output: a form to create a note article
Return value: a modal form component to create a note article
Function: creates a modal form to write a note article into a database
Variables: methods, data, tags
Date: 07 - 05 - 2024
Author: Gerardo Omar Rodriguez Ramirez
*/

const CreateNoteComponent = () => {
  const methods = useForm<FieldValues>()
  const getTags = useUtilsStore(state => state.getTags)
  const tagList = useUtilsStore(state => state.tags)
  const getCategories = useUtilsStore(state => state.getCategories)
  const categoriesList = useUtilsStore(state => state.categories)
  const createNote = useNoteStore(state => state.createNote)
  const createCategory = useUtilsStore(state => state.createCategory)

  let [tags, setTags] = useState<Tags[]>(tagList)
  let [categories, setCategories] = useState<Categories[]>(categoriesList)
  let [update, setUpdate] = useState<boolean>(false)

  useEffect(() => {
    getTags().then(response => {
      setTags(response)
    })
    getCategories().then(response => {
      setCategories(response)
    })
  }, [getCategories, getTags, update])

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

  const onSubmit: SubmitHandler<FieldValues> = async data => {
    const response = await createNote({
      title: String(data.title),
      description: String(data.description),
      body: String(data.content),
      categoryId: { name: data.category.label, id: data.category.value },
      tags: data.tags,
      isVisible: (useAuthStore.getState().user?.role === 'admin' ? true : false),
      userAuthor: String(useAuthStore.getState().user?.userName),
      role: String(useAuthStore.getState().user?.role)
    })

    if ('statusCode' in response && response.statusCode === 201) {
      toast.success(response.message, {
        duration: 5000,
        style: {
          backgroundColor: 'green',
          color: '#ffffff'
        }
      })
    } else {
      if ('message' in response) {
        toast.error(response.message, {
          duration: 5000,
          style: {
            backgroundColor: '#ff0000',
            color: '#ffffff'
          }
        })
      }
    }
  }
  return (
    <form
      onSubmit={methods.handleSubmit(onSubmit)}
      className={`margin-auto md:mx-auto max-w-7xl md:px-4 w-full h-full lg:px-8 lg:w-2/3 lg:h-auto 
    min-h-screen place-items-center justify-between py-24`}>
      <BasicPanelComponent backgroundColor='bg-white dark:bg-dark-primary'>
        <div className='flex flex-col items-center'>
          <LogoComponent size={100} />
          <TextComponent
            tag={enumTextTags.h1}
            sizeFont='s16'
            className='dark:text-dark-accent'>
            Crear apunte
          </TextComponent>
          <TextFieldComponent
            labelText='Título del apunte'
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
            rules={{required:true}}
            render={({ field }) => (
              <InputSelectorCreateComponent
                label='Categoría'
                id='category'
                onChange={val => field.onChange(val)}
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
              />
            )}
            rules={{ required: true }}
          />
          <TextAreaComponent
            labelText={'Descripción'}
            register={methods.register}
            fieldName={'description'}
            id={'description'}
            necessary={true}
          />
          <Controller
            name='content'
            defaultValue=''
            control={methods.control}
            rules={{required:true}}
            render={({ field }) => (
              <MarkdownAreaComponent
                value={field.value}
                onChange={newValue => field.onChange(newValue)}
                labelText='Contenido'
                className='p-2'
              />
            )}
          />
          <SubmitComponent text='Crear apunte' />
        </div>
        <div className='mt-4'>
          <button
            type='button'
            className='inline-flex items-center gap-x-2 rounded-md bg-primary text-complementary px-3.5 py-2.5 
              font-medium shadow-sm hover:bg-secondary focus-visible:outline 
              focus-visible:outline-offset-2 focus-visible:outline-complementary'
            >
            {}Borrar formulario
          </button>
        </div>
      </BasicPanelComponent>
    </form>
  )
}

export default CreateNoteComponent
