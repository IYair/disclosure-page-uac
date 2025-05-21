import React from 'react';
import ExerciseCardComponent from '@/app/components/cards/ExerciseCardComponent';
import NewsCardComponent from '@/app/components/cards/NewsCardComponent';
import NoteCardComponent from '@/app/components/cards/NoteCardComponent';
import useUtilsStore from '@/store/useUtilsStore';
import { Ticket, TicketType, TicketOperation, enumTextTags } from '@/constants/types';
import { serialize } from 'next-mdx-remote/serialize';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { TextComponent } from '@/app/components/text/TextComponent';
import { TicketActions } from '@/app/ticket/TicketActions';

const TicketPage = async ({ params }: Readonly<{ params: { id: string } }>) => {
  const ticket: Ticket = await useUtilsStore.getState().getTicket(params.id);

  async function serializeNote(mdx: string) {
    return await serialize(mdx, {
      mdxOptions: {
        remarkPlugins: [remarkMath],
        rehypePlugins: [rehypeKatex as any]
      }
    });
  }

  if (!ticket) return <div>Cargando...</div>;

  let pageContent = <></>;
  if (ticket.operation === TicketOperation.UPDATE) {
    switch (ticket.itemType) {
      case TicketType.EXERCISE:
        const originalDescription = await serializeNote(ticket.originalExerciseId.description)
        const originalSolution = await serializeNote(ticket.originalExerciseId.solution)
        const modifiedDescription = await serializeNote(ticket.modifiedExerciseId.description)
        const modifiedSolution = await serializeNote(ticket.modifiedExerciseId.solution)
        pageContent = (
          <div className="grid place-items-center grid-cols-1 gap-16">
            <div>
              <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 text-accent dark:text-dark-accent">
                <TextComponent
                  tag={enumTextTags.h1}
                  sizeFont="s36"
                  className="font-bold text-gray-800 dark:text-dark-accent"
                >
                  Ejercicio original
                </TextComponent>
              </div>
              <ExerciseCardComponent
                exercise={ticket.originalExerciseId}
                description={originalDescription.compiledSource}
                solution={originalSolution.compiledSource}
                clue={ticket.originalExerciseId.clue ? ticket.originalExerciseId.clue : ''} // Mostrar pista
              />
            </div>
            <div>
              <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 text-accent dark:text-dark-accent">
                <TextComponent
                  tag={enumTextTags.h1}
                  sizeFont="s36"
                  className="font-bold text-gray-800 dark:text-dark-accent"
                >
                  Ejercicio modificado
                </TextComponent>
              </div>
              <ExerciseCardComponent
                exercise={ticket.modifiedExerciseId}
                description={modifiedDescription.compiledSource}
                solution={modifiedSolution.compiledSource}
                clue={ticket.modifiedExerciseId.clue ? ticket.modifiedExerciseId.clue : ''} // Mostrar pista
              />
            </div>
          </div>
        )
        break

      case TicketType.NEWS:
        pageContent = (
          <div className='grid place-items-center grid-cols-1 gap-16'>
            <div className='mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 text-accent dark:text-dark-accent'>
              <TextComponent
                tag={enumTextTags.h1}
                sizeFont='s36'
                className='font-bold text-gray-800 dark:text-dark-accent'>
                Noticia original
              </TextComponent>
              <NewsCardComponent
                id={ticket.originalNewsId.id}
                isTicketPage={true}
              />
            </div>
            <div className='mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 text-accent dark:text-dark-accent'>
              <TextComponent
                tag={enumTextTags.h1}
                sizeFont='s36'
                className='font-bold text-gray-800 dark:text-dark-accent'>
                Noticia modificada
              </TextComponent>
              <NewsCardComponent
                id={ticket.modifiedNewsId.id}
                isTicketPage={true}
              />
            </div>
          </div>
        )
        break

      case TicketType.NOTE:
        const originalContent = await serializeNote(ticket.originalNoteId.body)
        const modifiedContent = await serializeNote(ticket.modifiedNoteId.body)
        pageContent = (
          <div className='grid place-items-center grid-cols-1 gap-16'>
            <div className='mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 text-accent dark:text-dark-accent'>
              <TextComponent
                tag={enumTextTags.h1}
                sizeFont='s36'
                className='font-bold text-gray-800 dark:text-dark-accent'>
                Nota original
              </TextComponent>
              <NoteCardComponent
                title={ticket.originalNoteId.title}
                description={ticket.originalNoteId.commentId.body}
                content={originalContent.compiledSource}
                tags={ticket.originalNoteId.tags}
                showButton={false}
              />
            </div>
            <div className='mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 text-accent dark:text-dark-accent'>
              <TextComponent
                tag={enumTextTags.h1}
                sizeFont='s36'
                className='font-bold text-gray-800 dark:text-dark-accent'>
                Nota modificada
              </TextComponent>
              <NoteCardComponent
                title={ticket.modifiedNoteId.title}
                description={ticket.modifiedNoteId.commentId.body}
                content={modifiedContent.compiledSource}
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
        const description = await serializeNote(ticket.originalExerciseId.description);
        const solution = await serializeNote(ticket.originalExerciseId.solution);
        pageContent = (
          <>
            <TextComponent
              tag={enumTextTags.h1}
              sizeFont="s24"
              className="text-accent dark:text-dark-accent m-4"
            >
              {ticket.commentId.body}
            </TextComponent>
            <ExerciseCardComponent
              exercise={ticket.originalExerciseId}
              description={description.compiledSource}
              solution={solution.compiledSource}
              clue={ticket.originalExerciseId.clue ? ticket.originalExerciseId.clue : ''} // Mostrar pista
            />
          </>
        )
        break

      case TicketType.NEWS:
        pageContent = (
          <>
            <TextComponent
              tag={enumTextTags.h1}
              sizeFont='s24'
              className='text-accent dark:text-dark-accent m-4'>
              {ticket.commentId.body}
            </TextComponent>
            <NewsCardComponent
              id={ticket.originalNewsId.id}
              isTicketPage={true}
            />
          </>
        )
        break

      case TicketType.NOTE:
        const body = await serializeNote(ticket.originalNoteId.body)
        pageContent = (
          <>
            <TextComponent
              tag={enumTextTags.h1}
              sizeFont='s24'
              className='text-accent dark:text-dark-accent m-4'>
              {ticket.commentId.body}
            </TextComponent>
            <NoteCardComponent
              title={ticket.originalNoteId.title}
              description={ticket.originalNoteId.commentId.body}
              content={body.compiledSource}
              tags={ticket.originalNoteId.tags}
              showButton={false}
            />
          </>
        )
        break
    }
  }

  return (
    <main className="grid min-h-screen grid-cols-1 place-items-center justify-between py-24">
      {pageContent}
      <TicketActions ticketId={ticket.id} />
    </main>
  );
};

export default TicketPage;