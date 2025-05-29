import React from 'react'
import { TextComponent } from './text/TextComponent'
import TagListComponent from './tags/TagListComponent'
import { Note } from '@/constants/types'

/*
Input: note (Note object), index (number)
Output: Note item as a component
Return value: JSX.Element (note item)
Function: Renders a note item card with title, description, and tags
Variables: note, index
Date: 29 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/
interface NoteItemProps {
  note: Note
  index: number
}

/*
Input: note (Note object), index (number)
Output: Note item as a component
Return value: JSX.Element (note item)
Function: Renders a note item card with title, description, and tags
Variables: note, index
Date: 29 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/
const NoteItemComponent = ({ ...props }: Readonly<NoteItemProps>) => {
  return (
    <div className='bg-white dark:bg-dark-primary flex flex-col w-full rounded-md shadow-md p-2'>
      <div className='flex flex-col lg:flex-row w-full items-center lg:items-start justify-between gap-x-2'>
        <TextComponent
          sizeFont='s24'
          className='text-secondary dark:text-dark-complementary'>{`${props.index}.- ${props.note.title}`}</TextComponent>
        <div className='flex flex-row'>
          <TagListComponent
            tags={props.note.tags.slice(0, 3)}
            showIcon={false}
          />
          {/* If the amount of tags is greater than 3, show ellipsis */}
          {props.note.tags.length > 3 && (
            <span className='ml-1 text-gray-400'> ... </span>
          )}
        </div>
      </div>
      <TextComponent className='p-1'>{props.note.commentId.body}</TextComponent>
    </div>
  )
}

export default NoteItemComponent
