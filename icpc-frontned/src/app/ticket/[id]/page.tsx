'use client'
import React, { useState, useEffect } from 'react'

import ExerciseCardComponent from '@/app/components/cards/ExerciseCardComponent'
import NewsCardComponent from '@/app/components/cards/NewsCardComponent'
import NoteCardComponent from '@/app/components/cards/NoteCardComponent'
import useUtilsStore from '@/store/useUtilsStore'
import { Ticket, TicketType, TicketOperation } from '@/constants/types'
import { serialize } from 'next-mdx-remote/serialize'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { MDXRemoteSerializeResult } from 'next-mdx-remote'

const TicketPage = ({ params }: Readonly<{ params: { id: string } }>) => {
  const [ticket, setTicket] = useState<Ticket>() 
  const [mdx, setMdx] = useState<MDXRemoteSerializeResult<Record<string, unknown>, Record<string, unknown>> | undefined>(undefined);
  const getTicket = useUtilsStore.getState().getTicket

 

  useEffect(() => {
    const fetchTicket = async () => {
      // Aquí iría la lógica para obtener los datos del ticket
      const data = await getTicket(params.id)
      setTicket(data)
    }
    
    const serializeNote = async (body: string) =>{
      const data = await serialize(body, {
        mdxOptions: 
        {
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex as any]
        }
      })
      setMdx(data);
    }



    fetchTicket() 
    if (ticket?.itemType == TicketType.NOTE){ 
      serializeNote(ticket.originalNoteId.body)
    }
  }, [params.id])

  if (!ticket) return <div>Cargando...</div>

  /* Vista simplificada del componente original */
  if (ticket.operation == TicketOperation.UPDATE) {
    switch (ticket.itemType) {
      case TicketType.EXERCISE:
        return <ExerciseCardComponent exercise={ticket.originalExerciseId} />

      case TicketType.NEWS:
        return <NewsCardComponent id={ticket.originalNewsId.id}  />

      case TicketType.NOTE:
        return <NoteCardComponent
        title={ticket.originalNoteId.title}
        description={ticket.originalNoteId.commentId.body}
        content={mdx?.compiledSource ? mdx.compiledSource : 'Apunte no disponible'}
        tags={ticket.originalNoteId.tags}
        showButton={true} />
    }
  }
  
  else {
    switch (ticket.itemType) {
      case TicketType.EXERCISE:
        return <ExerciseCardComponent exercise={ticket.originalExerciseId} />

      case TicketType.NEWS:
        return <NewsCardComponent id={ticket.originalNewsId.id}  />

      case TicketType.NOTE:
        return <NoteCardComponent
        title={ticket.originalNoteId.title}
        description={ticket.originalNoteId.commentId.body}
        content={mdx?.compiledSource ? mdx.compiledSource : 'Apunte no disponible'}
        tags={ticket.originalNoteId.tags}
        showButton={true} />
    }
  }
}

export default TicketPage
