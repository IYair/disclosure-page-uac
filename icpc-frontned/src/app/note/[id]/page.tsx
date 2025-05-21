import React from 'react'
import NoteCardComponent from '../../components/cards/NoteCardComponent'
import { TextComponent } from '@/app/components/text/TextComponent'
import { serialize } from 'next-mdx-remote/serialize'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import useNoteStore from '@/store/useNoteStore'
import { Note } from '@/constants/types'
import HeartbeatComponent from '@/app/components/logging/HeartbeatComponent'

export default async function Page({ params }: Readonly<{ params: { id: string } }>) {
  const getNote = useNoteStore.getState().getNote
  if (params.id) {
    const note: Note = await getNote(params.id)
    const mdx = await serialize(note.body, {
      mdxOptions: {
        remarkPlugins: [remarkMath],
        rehypePlugins: [rehypeKatex as any]
      }
    })
    return (
      <main className='grid min-h-screen grid-cols-1 place-items-center justify-between py-24'>
        <HeartbeatComponent itemId={note.id} itemType='note' />
        <NoteCardComponent
          title={note.title}
          description={note.commentId.body}
          content={mdx.compiledSource}
          tags={note.tags}
          showButton={true}
          itemId={note.id}
        />
      </main>
    )
  } else {
    return (
      <main className='grid min-h-screen grid-cols-1 place-items-center justify-between py-24'>
        <TextComponent>Error 404... </TextComponent>
      </main>
    )
  }
}
