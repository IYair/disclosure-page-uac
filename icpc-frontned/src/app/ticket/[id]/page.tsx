
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

/*
Input: params (object with id string)
Output: JSX.Element with the ticket detail, update, or 404 page
Return value: JSX.Element
Function: Renders the ticket detail page, showing the original and modified content for updates, or a 404 message if not found
Variables: params, ticket, pageContent, serializeNote
Date: 29 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/
const TicketPage = async ({ params }: Readonly<{ params: { id: string } }>) => {
  const ticket: Ticket = await useUtilsStore.getState().getTicket(params.id);

  // Function to serialize MDX content with math support
  async function serializeNote(mdx: string) {
    return await serialize(mdx, {
      mdxOptions: {
        remarkPlugins: [remarkMath],
        rehypePlugins: [rehypeKatex as any]
      }
    });
  }

  // If the ticket is not found, return a loading message
  if (!ticket) return <div>Cargando...</div>;

  let pageContent = <></>;
  // Check if the ticket is an update operation
  if (ticket.operation === TicketOperation.UPDATE) {
    switch (ticket.itemType) {
      // Handle the case where the ticket is an update for an exercise
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
                clue={ticket.originalExerciseId.clue ? ticket.originalExerciseId.clue : ''}
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
                clue={ticket.modifiedExerciseId.clue ? ticket.modifiedExerciseId.clue : ''}
              />
            </div>
          </div>
        )
        break
      // Handle the case where the ticket is an update for a news article
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
      // Handle the case where the ticket is an update for a note
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
    // If the ticket is not an update, display the original content
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
              clue={ticket.originalExerciseId.clue ? ticket.originalExerciseId.clue : ''}
            />
          </>
        )
        break
      // Handle the case where the ticket is for a news article
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
      // Handle the case where the ticket is for a note
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