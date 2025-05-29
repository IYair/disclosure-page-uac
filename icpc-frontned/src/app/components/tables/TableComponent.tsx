'use client'
import TagListComponent from '../tags/TagListComponent'
import { PaginationComponent } from '../paginations/PaginationComponent'
import InputSelectorComponent from '../dropdowns/InputSelectorComponent'
import TagSelectorComponent from '../forms/TagSelectorComponent'
import { Exercise, Tags, enumTextTags } from '@/constants/types'
import { Controller, FieldValues, useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import useUtilsStore from '@/store/useUtilsStore'
import useExcerciseStore from '@/store/useExcerciseStore'
import { TextComponent } from '../text/TextComponent'

/*
Input: a list of strings that define CSS classes
Output: a single string of Tailwind CSS
Return value: a string with the CSS classes
Function: joins multiple strings into a single string
Variables: classes
Date: 21 - 03 - 2024
Author: Gerardo Omar Rodriguez Ramirez
*/
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

/*
Input: None (uses hooks and store state)
Output: Table of exercises with filtering by category, tags, and difficulty
Return value: JSX.Element (table UI or message if no exercises)
Function: Renders a table of exercises, allows filtering by category, tags, and difficulty, and displays exercise details
Variables: tags, getTags, categories, getCategories, difficulties, getDifficulties,
methods, tagOptions, category, categoryOptions, selectedTags, difficultyOptions, difficulty, exercises, getExcerciseList
Date: 28 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/
export default function TableComponent() {
  const tags = useUtilsStore().tags
  const getTags = useUtilsStore.getState().getTags
  const categories = useUtilsStore().categories
  const getCategories = useUtilsStore.getState().getCategories
  const difficulties = useUtilsStore().difficulty
  const getDifficulties = useUtilsStore.getState().getDifficulties
  const methods = useForm<FieldValues>()
  const [tagOptions, setTagOptions] = useState<Tags[]>(tags)
  const [category, setCategory] = useState('')
  const [categoryOptions, setCategoryOptions] = useState(categories)
  const [selectedTags, setSelectedTags] = useState<Tags[]>([])
  const [difficultyOptions, setDifficultyOptions] = useState(difficulties)
  const [difficulty, setDifficulty] = useState('')
  const [exercises, setExercises] = useState<Exercise[]>([])
  const getExcerciseList = useExcerciseStore.getState().getExerciseList

  // Effect hook to fetch categories, difficulties, tags, and exercises
  useEffect(() => {
    getCategories().then(response => {
      setCategoryOptions(response)
    })
    getDifficulties().then(response => {
      setDifficultyOptions(response)
    })
    getTags().then(response => {
      setTagOptions(response)
    })
    getExcerciseList(selectedTags, category, difficulty).then(response => {
      setExercises(response)
    })
  }, [getCategories, getDifficulties, selectedTags, category, difficulty, getExcerciseList, getTags])

  return (
    <div className='px-4 sm:px-6 lg:px-8 '>
      <form className='w-full grid grid-cols-1 sm:grid-cols-3 gap-4'>
        <Controller
          defaultValue={[]}
          control={methods.control}
          render={({ field }) => (
            <InputSelectorComponent
              label='Categoría'
              id='category'
              onChange={val => {
                field.onChange(val)
                // Update the category state with the selected value
                setCategory((val === null ? '' : val.label) as string)
              }}
              options={categoryOptions.map(item => {
                return { label: item.name, value: item.id }
              })}
              selectedOption={field.value}
              clearable={true}
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
              options={tagOptions}
              selectedTags={field.value}
              onChange={val => {
                field.onChange(val)
                setSelectedTags(val)
              }}
              label='Etiquetas'
            />
          )}
          rules={{ required: true }}
        />
        <Controller
          defaultValue={[]}
          control={methods.control}
          render={({ field }) => (
            <InputSelectorComponent
              label='Dificultad'
              id='difficulty'
              onChange={val => {
                field.onChange(val)
                // Update the difficulty state with the selected value
                setDifficulty((val === null ? '' : val.label) as string)
              }}
              options={difficultyOptions.map(item => {
                return { label: item.name, value: item.id }
              })}
              selectedOption={field.value}
              clearable={true}
            />
          )}
          name='difficulty'
        />
      </form>
      {/* If the length of the exercises list is greater than 0 */}
      {exercises.length > 0 ? (
        <div className='mt-8'>
          <div className='-mx-4 -my-2 sm:-mx-6 lg:-mx-8 overflow-x-auto'>
            {' '}
            <div
              className={`ring-1 ring-gray-300 sm:mx-0 sm:rounded-lg inline-block 
              min-w-full align-middle scroll-smooth`}>
              <table className='min-w-full border-separate border-spacing-0'>
                {' '}
                <thead>
                  <tr>
                    <th
                      scope='col'
                      className='sticky top-0 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 
                      text-left text-sm font-semibold text-gray-500 backdrop-blur 
                      backdrop-filter sm:pl-6 lg:pl-8'>
                      NOMBRE
                    </th>
                    <th
                      scope='col'
                      className='sticky top-0 border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm
                      font-semibold text-gray-500 backdrop-blur backdrop-filter'>
                      DIFICULTAD
                    </th>
                    <th
                      scope='col'
                      className='sticky top-0 border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm
                      font-semibold text-gray-500 backdrop-blur backdrop-filter'>
                      CATEGORIA
                    </th>
                    <th
                      scope='col'
                      className='sticky top-0 border-b border-gray-300 bg-white bg-opacity-75 px-3 
                      py-3.5 text-left text-sm font-semibold text-gray-500 backdrop-blur backdrop-filter'>
                      ETIQUETAS
                    </th>
                    <th
                      scope='col'
                      className='sticky top-0 border-b border-gray-300 bg-white bg-opacity-75 
                      py-3.5 pl-3 pr-4 backdrop-blur backdrop-filter sm:pr-6 lg:pr-8'>
                      <span className='sr-only'>Acciones</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* Loop through all exercises in the list to display items in the table */}
                  {exercises.map((exercise, id) => (
                    <tr
                      key={exercise.id}
                      className='cursor-pointer hover:bg-slate-200'>
                      <td
                        className={classNames(
                          id !== Object.keys(exercise).length - 1 ? 'border-b border-gray-200' : '',
                          'whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-dark-accent sm:pl-6 lg:pl-8'
                        )}>
                        <a
                          href={`/exercises/${exercise.id}`}
                          className='hover:text-dark-complementary'>
                          {exercise.title}
                        </a>
                      </td>
                      <td
                        className={classNames(
                          id !== Object.keys(exercise).length - 1 ? 'border-b border-gray-200' : '',
                          'whitespace-nowrap px-3 py-4 text-sm text-gray-500'
                        )}>
                        <div className='flex gap-1 h-full items-center'>
                          {Array.from(Array(exercise.difficulty.level), (_, i) => (
                            <img
                              alt=''
                              src='icons/estrellas.svg'
                              key={i}
                              className='h-2.5 w-2.5 xl:h-5 xl:w-5'
                            />
                          ))}
                        </div>
                      </td>
                      <td
                        className={classNames(
                          id !== Object.keys(exercise).length - 1 ? 'border-b border-gray-200' : '',
                          'whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-dark-accent'
                        )}>
                        {exercise.category.name}
                      </td>
                      <td
                        className={classNames(
                          id !== Object.keys(exercise).length - 1 ? 'border-b border-gray-200' : '',
                          'whitespace-nowrap text-sm text-gray-500'
                        )}>
                        <div className='flex flex-row'>
                          <TagListComponent
                            tags={exercise.tags.slice(0, 3)}
                            showIcon={false}
                          />
                          {exercise.tags.length > 3 && (
                            <span className='ml-1 text-gray-400'>...</span>
                          )}
                        </div>
                      </td>
                      <td
                        className={classNames(
                          id !== Object.keys(exercise).length - 1 ? 'border-b border-gray-200' : '',
                          'relative whitespace-nowrap py-4 pr-4 pl-3 text-right text-sm font-medium sm:pr-8 lg:pr-8'
                        )}>
                        <a
                          href={`/exercises/${exercise.id}`}
                          className='text-indigo-600 hover:text-indigo-900'>
                          Leer<span className='sr-only'>, {exercise.title}</span>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <TextComponent
          className='text-center w-full mt-8'
          tag={enumTextTags.h1}
          sizeFont='s20'>
          No hay ejercicios
        </TextComponent>
      )}
    </div>
  )
}
