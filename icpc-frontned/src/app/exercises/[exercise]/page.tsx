import React from 'react'
import ExerciseCardComponent from '@/app/components/cards/ExerciseCardComponent'
import useExcerciseStore from '@/store/useExcerciseStore'
import { serialize } from 'next-mdx-remote/serialize'
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'
import HeartbeatComponent from '@/app/components/logging/HeartbeatComponent'

// Function to serialize the input string to Markdown with math support
async function getMarkdown(body: string) {
  return await serialize(body, {
    mdxOptions: {
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex as any]
    }
  })
}

/*
Input: params (object with exercise string)
Output: JSX.Element with the exercise detail page layout
Return value: JSX.Element
Function: Renders the exercise detail page, fetching exercise data and rendering the card with markdown description and solution
Variables: exerciseBody, description, solution, params
Date: 29 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/
async function ExercisePage({ params }: Readonly<{ params: { exercise: string } }>) {
  const exerciseBody = await useExcerciseStore.getState().getExercise(params.exercise)
  const description = await getMarkdown(exerciseBody.description)
  const solution = await getMarkdown(exerciseBody.solution)  

  return (
    <main className='grid min-h-screen grid-cols-1 place-items-center justify-between w-full py-24'>
      <HeartbeatComponent itemId={params.exercise} itemType='exercise' />
      <div className='flex justify-end w-full'>
        <ExerciseCardComponent
          exercise={exerciseBody}
          itemId={params.exercise}
          description={description.compiledSource}
          solution={solution.compiledSource}
          clue={exerciseBody.clue}
        />
      </div>
    </main>
  )
}

export default ExercisePage
