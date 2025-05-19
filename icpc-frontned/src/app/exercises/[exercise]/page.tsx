import React from 'react'
import useStore from '@/store/useStore'
import ExerciseCardComponent from '@/app/components/cards/ExerciseCardComponent'
import useExcerciseStore from '@/store/useExcerciseStore'
import { serialize } from 'next-mdx-remote/serialize'
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'

async function getMarkdown(body: string) {
  return await serialize(body, {
    mdxOptions: {
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex as any]
    }
  })
}

async function ExercisePage({ params }: Readonly<{ params: { exercise: string } }>) {
  const exerciseBody = await useExcerciseStore.getState().getExercise(params.exercise)
  const description = await getMarkdown(exerciseBody.description)
  const isLoggedIn = useStore.getState().isLogged
  const solution = await getMarkdown(exerciseBody.solution)
  if (!isLoggedIn) {
    useExcerciseStore.getState().log(params.exercise)
  }

  return (
    <main className='grid min-h-screen grid-cols-1 place-items-center justify-between w-full py-24'>
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
