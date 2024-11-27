import React from 'react'
import ExerciseCardComponent from '@/app/components/cards/ExerciseCardComponent'
import NewsCardComponent from '@/app/components/cards/NewsCardComponent'
import NoteCardComponent from '@/app/components/cards/NoteCardComponent'
import useUtilsStore from '@/store/useUtilsStore'
import { Ticket, TicketType, TicketOperation, enumTextTags } from '@/constants/types'
import { serialize } from 'next-mdx-remote/serialize'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { TextComponent } from '@/app/components/text/TextComponent'

const TicketPage = async ({ params }: Readonly<{ params: { id: string } }>) => {
  async function serializeNote(mdx: string) {
    return await serialize(mdx, {
      mdxOptions: {
        remarkPlugins: [remarkMath],
        rehypePlugins: [rehypeKatex as any]
      }
    })
  }
  const ticket: Ticket = await useUtilsStore.getState().getTicket(params.id)
  let pageContent = <></>

  if (!ticket) return <div>Cargando...</div>

  /* Vista simplificada del componente original */
  if (ticket.operation == TicketOperation.UPDATE) {
    switch (ticket.itemType) {
      case TicketType.EXERCISE:
        pageContent = (
          <div className='grid place-items-center grid-cols-1 gap-16'>
            <div>
              <TextComponent
                tag={enumTextTags.h1}
                sizeFont='s20'
                className='font-bold text-gray-800 dark:text-dark-accent'>
                Ejercicio original
              </TextComponent>
              <ExerciseCardComponent exercise={ticket.originalExerciseId} />
            </div>
            <div>
              <TextComponent
                tag={enumTextTags.h1}
                sizeFont='s20'
                className='font-bold text-gray-800 dark:text-dark-accent'>
                Ejercicio modificado
              </TextComponent>
              <ExerciseCardComponent exercise={ticket.modifiedExerciseId} />
            </div>
          </div>
        )
        break

      case TicketType.NEWS:
        pageContent = (
          <div className='grid place-items-center grid-cols-1 gap-16'>
            <div>
              <TextComponent
                tag={enumTextTags.h1}
                sizeFont='s20'
                className='font-bold text-gray-800 dark:text-dark-accent'>
                Noticia original
              </TextComponent>
              <NewsCardComponent id={ticket.originalNewsId.id} />
            </div>
            <div>
              <TextComponent
                tag={enumTextTags.h1}
                sizeFont='s20'
                className='font-bold text-gray-800 dark:text-dark-accent'>
                Noticia modificada
              </TextComponent>
              <NewsCardComponent id={ticket.modifiedNewsId.id} />
            </div>
          </div>
        )
        break

      case TicketType.NOTE:
        pageContent = (
          <div className='grid place-items-center grid-cols-1 gap-16'>
            <div>
              <TextComponent
                tag={enumTextTags.h1}
                sizeFont='s20'
                className='font-bold text-gray-800 dark:text-dark-accent'>
                Nota original
              </TextComponent>
              <NoteCardComponent
                title={ticket.originalNoteId.title}
                description={ticket.originalNoteId.commentId.body}
                content={(await serializeNote(ticket.originalNoteId.body)).compiledSource}
                tags={ticket.originalNoteId.tags}
                showButton={false}
              />
            </div>
            <div>
              <TextComponent
                tag={enumTextTags.h1}
                sizeFont='s20'
                className='font-bold text-gray-800 dark:text-dark-accent'>
                Nota modificada
              </TextComponent>
              <NoteCardComponent
                title={ticket.modifiedNoteId.title}
                description={ticket.modifiedNoteId.commentId.body}
                content={(await serializeNote(ticket.modifiedNoteId.body)).compiledSource}
                tags={ticket.modifiedNoteId.tags}
                showButton={false}
              />
            </div>
          </div>
        )
        break
    }
  } else {
    switch (ticket.itemType) {
      case TicketType.EXERCISE:
        pageContent = <ExerciseCardComponent exercise={ticket.originalExerciseId} />
        break

      case TicketType.NEWS:
        pageContent = <NewsCardComponent id={ticket.originalNewsId.id} />
        break

      case TicketType.NOTE:
        pageContent = (
          <NoteCardComponent
            title={ticket.originalNoteId.title}
            description={ticket.originalNoteId.commentId.body}
            content={(await serializeNote(ticket.originalNoteId.body)).compiledSource}
            tags={ticket.originalNoteId.tags}
            showButton={false}
          />
        )
        break
    }
  }

  return <main className='grid min-h-screen grid-cols-1 place-items-center justify-between py-24'>{pageContent}</main>
}

export default TicketPage
