'use client'
import React, { useEffect, useState } from 'react'
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

/*
Input: None
Output: a form to create an exercise
Return value: a modal form component to create an exercise
Function: creates a form to write exercises, handles sending the data to the database
Variables: methods, tags, categories, difficulty, timeLimits, memoryLimits
Date: 21 - 03 - 2024
Author: Gerardo Omar Rodriguez Ramirez
*/

const CreateExcerciseComponent = () => {
  const methods = useForm<FieldValues>()
  const createExcercise = useExcerciseStore(state => state.createExcercise)
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

  let [tags, setTags] = useState<Tags[]>(tagList)
  let [categories, setCategories] = useState<Categories[]>(categoriesList)
  let [difficulty, setDifficulty] = useState<Difficulties[]>(difficultiesList)
  let [timeLimits, setTimeLimits] = useState<TimeLimit[]>(timeLimitList)
  let [memoryLimits, setMemoryLimits] = useState<MemoryLimit[]>(memoryLimitList)
  let [update, setUpdate] = useState<boolean>(false)

  useEffect(() => {
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
  }, [getCategories, getDifficulties, getTags, getTimeLimit, getMemoryLimit, update])

  const onSubmit: SubmitHandler<FieldValues> = async data => {
    const response = await createExcercise({
      name: String(data.name),
      category: { name: data.category.label, id: data.category.value},
      difficulty: {name: data.difficulty.label, id: data.difficulty.id},
      time: { value: parseInt(data.time.label), id: data.time.id },
      memoryId: data.memoryId.value,
      input: String(data.input),
      output: String(data.output),
      constraints: String(data.constraints),
      clue: String(data.clue),
      tags: data.tags,
      author: String(data.author),
      description: String(data.description),
      example_input: String(data.example_input),
      example_output: String(data.example_output),
      solution: String(data.solution),
      isVisible: false,
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

  return (
    <form
      onSubmit={methods.handleSubmit(onSubmit)}
      className={`margin-auto md:mx-auto max-w-7xl md:px-4 w-full h-full lg:px-8 lg:w-11/12 lg:h-auto 
    min-h-screen place-items-center justify-between py-24`}>
      <BasicPanelComponent backgroundColor='bg-white dark:bg-dark-primary'>
        <div className='flex flex-col items-center'>
          <LogoComponent size={100} />
          <TextComponent
            tag={enumTextTags.h1}
            sizeFont='s16'
            className='dark:text-dark-accent'>
            Crear ejercicio
          </TextComponent>
        </div>
        <div className='grid grid-cols-1 items-start lg:grid-cols-2 lg:gap-16'>
          <div className='w-full flex flex-col gap-2'>
            <TextFieldComponent
              labelText='Nombre del ejercicio'
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
              rules={{required:true}}
              render={({ field }) => (
                <InputSelectorCreateComponent
                  label='Categoría'
                  id='category'
                  onChange={val => {
                    field.onChange(val)}}
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
              defaultValue={[]}
              control={methods.control}
              rules={{required:true}}
              render={({ field }) => (
                <InputSelectorComponent
                  label='Nivel de dificultad'
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
                <InputSelectorCreateComponent
                  label='Límite de tiempo'
                  id='time'
                  onChange={val => field.onChange(val)}
                  options={timeLimits.map(item => {
                    return { label: item.timeLimit.toString(), value: item.id }
                  })}
                  handleCreate={handleCreateTimeLimit}
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
                    field.onChange(val)}}
                  options={memoryLimits.map(item => {
                    const label: number = item.memoryLimit * 64
                    return { label: label.toString(), value: item.id }
                  })}
                  selectedOption={field.value}
                />
              )}
              name='memoryId'
            />
            <TextFieldComponent
              labelText='Entrada esperada'
              register={methods.register}
              fieldName='input'
              id='input'
              necessary={true}
              type='text'
              auto='off'
            />
            <TextFieldComponent
              labelText='Salida esperada'
              register={methods.register}
              fieldName='output'
              id='output'
              necessary={true}
              type='text'
              auto='off'
            />
            <Controller
              name='restriction'
              defaultValue=''
              control={methods.control}
              rules={{required:true}}
              render={({ field }) => (
                <MarkdownAreaComponent
                  value={field.value}
                  onChange={newValue => field.onChange(newValue)}
                  labelText='Restricciones'
                  className='p-2'
                />
              )}
            />
            
            <TextFieldComponent
              labelText='Pista'
              register={methods.register}
              fieldName='clue'
              id='clue'
              necessary={true}
              type='text'
              auto='off'
            />
            <Controller
              name='tags'
              defaultValue={[]}
              control={methods.control}
              render={({ field }) => (
                <TagSelectorComponent
                  id='tagSelector'
                  options={tags}
                  selectedTags={field.value}
                  onChange={val => field.onChange(val)}
                />
              )}
              rules={{ required: true }}
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
              rules={{required:true}}
              render={({ field }) => (
                <MarkdownAreaComponent
                  value={field.value}
                  onChange={newValue => field.onChange(newValue)}
                  labelText='Descripción del problema'
                  className='p-2'
                />
              )}
            />
            <TextAreaComponent
              labelText='Ejemplo de entrada'
              register={methods.register}
              fieldName='example_input'
              id='example_input'
              necessary={true}
            />
            <TextAreaComponent
              labelText='Ejemplo de salida'
              register={methods.register}
              fieldName='example_output'
              id='example_output'
              necessary={true}
            />
            <Controller
              name='solution'
              defaultValue=''
              control={methods.control}
              rules={{required:true}}
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
          <SubmitComponent text='Crear ejercicio' />
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
export default CreateExcerciseComponent
