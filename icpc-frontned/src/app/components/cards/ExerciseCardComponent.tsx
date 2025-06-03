'use client'
import { UserCircleIcon, ClockIcon, CpuChipIcon } from '@heroicons/react/20/solid'
import React from 'react'
import { enumTextTags, Exercise } from '@/constants/types'
import TagListComponent from '../tags/TagListComponent'
import { TextComponent } from '../text/TextComponent'
import ExerciseHeaderComponent from '../ui/ExerciseHeaderComponent'
import ExerciseMarkdownComponent from '../ui/ExerciseMarkdownComponent'

/*
Input: An Exercise object, a description string, an optional solution string, an optional itemId string, and an optional clue string
Output: An object with properties for the ExerciseCardComponent
Return value: An object with the properties of the ExerciseCardComponent
Function: To describe the properties (required and optional) of the ExerciseCardComponent
Variables: exercise, description, solution, itemId, clue
Date: 28 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/

interface ExerciseCardComponentProps {
  exercise: Exercise
  description: string
  solution?: string
  itemId?: string
  clue?: string
}

/*
Input: An object with properties described in the ExerciseCardComponentProps interface, see above
Output: A React component that renders an exercise with all the relevant information
Return value: A React Node
Function: To display all the content of an exercise
Variables: exercise, description, solution, itemId, clue
Date: 28 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/

const ExerciseCardComponent = ({ ...props }: Readonly<ExerciseCardComponentProps>) => {
  return (
    <main className='w-full'>
      <ExerciseHeaderComponent
        category={props.exercise.category.name}
        title={props.exercise.title}
        itemId={props.itemId!}
      />

      <div className='mx-auto w-full px-4 py-8 sm:px-6 lg:px-8'>
        {' '}
        {/* Main content */}
        <div className='mx-auto grid w-full max-w-full grid-cols-1 grid-rows-1 items-start gap-x-8 gap-y-8 lg:grid-cols-3'>
          {/* Summary */}
          <div className='lg:col-start-3 lg:row-end-1'>
            <div className='rounded-lg bg-gray-50 shadow-sm ring-1 ring-gray-900/5'>
              <dl className='flex flex-wrap p-4'>
                <div className='flex-auto pl-6'>
                  <dt className='text-sm font-semibold leading-6 text-accent'>Dificultad</dt>
                  <dd className='mt-1 text-base font-semibold leading-6 text-gray-900'>{props.exercise.difficulty.name}</dd>
                </div>
                <div className='flex-none self-end px-6 pt-4'></div>
                <div className='mt-6 flex w-full flex-none gap-x-4 border-t border-gray-900/5 px-6 pt-6'>
                  <dt className='flex-none'>
                    <UserCircleIcon
                      className='h-6 w-5 text-gray-400'
                      aria-hidden='true'
                    />
                  </dt>
                  <dd className='text-sm font-medium leading-6 text-accent'>{props.exercise.author}</dd>
                </div>
                <div className='mt-4 flex w-full flex-none gap-x-4 px-6'>
                  <dt className='flex-none'>
                    <span className='sr-only'>Due date</span>
                    <ClockIcon
                      className='h-6 w-5 text-gray-400'
                      aria-hidden='true'
                    />
                  </dt>
                  <dd className='text-sm leading-6 text-accent'>
                    <time dateTime='2023-01-31'>{`${
                      props.exercise.time ? props.exercise.time.timeLimit + ' seg.' : 'Sin límite de tiempo'
                    } `}</time>
                  </dd>
                </div>
                <div className='mt-4 flex w-full flex-none gap-x-4 px-6'>
                  <dt className='flex-none'>
                    <span className='sr-only'>Límite de memoria</span>
                    <CpuChipIcon
                      className='h-6 w-5 text-gray-400'
                      aria-hidden='true'
                    />
                  </dt>
                  <dd className='text-sm leading-6 text-accent'>{`${
                    props.exercise.memoryId ? props.exercise.memoryId.memoryLimit + 'KB' : 'Sin límite de memoria'
                  }`}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Details of the exercise */}
          <div
            className='-mx-4 w-full px-4 py-8 shadow-sm ring-1 ring-gray-900/5 sm:mx-0 sm:rounded-lg sm:px-8 sm:pb-14 
            lg:col-span-2 lg:row-span-2 lg:row-end-2 xl:px-16 xl:pb-20 xl:pt-16'>
            <TagListComponent
              tags={props.exercise.tags}
              showIcon={false}
            />
            <dl className='mt-6 grid grid-cols-1 text-sm leading-6 sm:grid-cols-2'>
              <div className='sm:pr-4'>
                <dt className='inline text-accent dark:text-dark-accent'>Entrada</dt>{' '}
                <dd className='inline text-accent dark:text-dark-accent'>
                  <TextComponent
                    sizeFont='s12'
                    tag={enumTextTags.p}
                    className='whitespace-pre-wrap'>
                    {props.exercise.input}
                  </TextComponent>
                </dd>
              </div>
              <div className='mt-2 sm:mt-0 sm:pl-4'>
                <dt className='inline text-accent dark:text-dark-accent'>Salida</dt>{' '}
                <dd className='inline text-accent dark:text-dark-accent'>
                  <TextComponent
                    sizeFont='s12'
                    tag={enumTextTags.p}
                    className='whitespace-pre-wrap'>
                    {props.exercise.output}
                  </TextComponent>
                </dd>
              </div>
              <div className='mt-6 border-t border-gray-900/5 pt-6 sm:pr-4'>
                <dt className='inline text-accent dark:text-dark-accent'>Entrada de ejemplo</dt>{' '}
                <dd className='inline text-accent dark:text-dark-accent'>
                  <TextComponent
                    sizeFont='s12'
                    tag={enumTextTags.p}
                    className='whitespace-pre-wrap'>
                    {props.exercise.example_input}
                  </TextComponent>
                </dd>
              </div>
              <div className='mt-8 sm:mt-6 sm:border-t sm:border-gray-900/5 sm:pl-4 sm:pt-6'>
                <dt className='inline text-accent dark:text-dark-accent'>Salida de ejemplo</dt>{' '}
                <dd className='inline text-accent dark:text-dark-accent'>
                  <TextComponent
                    sizeFont='s12'
                    tag={enumTextTags.p}
                    className='whitespace-pre-wrap'>
                    {props.exercise.example_output}
                  </TextComponent>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
      {/* Component to render the cards with the description, constraints, clue and solution */}
      <ExerciseMarkdownComponent
        description={props.description}
        clue={props.clue}
        constraints={props.exercise.constraints}
        solution={props.solution}
      />
    </main>
  )
}

export default ExerciseCardComponent
