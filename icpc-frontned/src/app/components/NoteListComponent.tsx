import React from 'react'
import NoteItemComponent from '../components/NoteItemComponent'
import { Note } from '@/constants/types'

/*
Input: notes (array of Note objects)
Output: List of note items as a component
Return value: JSX.Element (note list)
Function: Maps a set of note articles into a list of clickable items
Variables: notes
Date: 29 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/
interface NoteListProps {
  notes: Note[]
}

/*
Input: notes (array of Note objects)
Output: List of note items as a component
Return value: JSX.Element (note list)
Function: Maps a set of note articles into a list of clickable items
Variables: notes
Date: 29 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/
const NoteListComponent = ({ ...props }: Readonly<NoteListProps>) => {
  return (
    <div className='flex flex-col gap-2'>
      {props.notes.map((note, index) => (
        <a key={index} href={`note/${note.id}`}>
          <NoteItemComponent note={note} index={index+1}/>
        </a>
      ))}
    </div>
  )
}

export default NoteListComponent
