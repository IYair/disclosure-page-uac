'use client'
import { BasicPanelComponent } from '@/app/components/panels/BasicPanelComponent'
import { TextComponent } from '../text/TextComponent'
import TagListComponent from '../tags/TagListComponent'
import { ButtonComponent } from '../buttons/ButtonComponent'
import MarkdownBodyComponent from '../panels/MarkdownBodyComponent'
import { Tags } from '@/constants/types'
import ReportButtonComponent from '@/app/components/buttons/ReportButtonComponent'
import { toast } from 'sonner'

/*
Input: A title string, a description string, content string, a boolean to show the "report error" button,
an array of tags, and an optional itemId string
Output: An object with properties for the NoteCardComponent
Return value: An object with the properties of the NoteCardComponent
Function: To describe the properties (required and optional) of the NoteCardComponent
Variables: title, description, content, showButton, tags, itemId
Date: 28 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/

interface NoteCardProps {
  title: string
  description: string
  content: string
  showButton: boolean
  tags: Tags[]
  itemId?: string
}

/*
Input: None
Output: A Toast message with the described text
Return value: None
Function: Display a toast message when the button is clicked
Variables: toast
Date: 28 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/

function onclick() {
  toast.success('Redirigiendo a la página de ejercicios')
}

/*
Input: An object with properties described in the NoteCardProps interface, see above
Output: A card component that displays a note with title, description, content, and optional button
Return value: A React Node
Function: Display a card with all the contents of a note
Variables: title, description, content, showButton, tags, itemId
Date: 28 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/

export default function NoteCardComponent({ ...props }: Readonly<NoteCardProps>) {
  return (
    <BasicPanelComponent backgroundColor='bg-white dark:bg-dark-primary w-full md:w-11/12'>
      {props.showButton && (
        <div className='flex justify-end w-full px-16'>
          <ReportButtonComponent
            itemId={props.itemId!}
            itemType='note'
          />
        </div>
      )}
      <TextComponent
        sizeFont='s36'
        className='dark:text-dark-accent'>
        {props.title}
      </TextComponent>
      <TagListComponent
        tags={props.tags}
        showIcon={false}
        className='my-4'
      />
      <TextComponent
        sizeFont='s14'
        className='text-gray-500 dark:text-dark-accent font-medium my-4'>
        {props.description}
      </TextComponent>
      <div className='w-full'>
        <MarkdownBodyComponent body={props.content} />
      </div>
      {props.showButton ? (
        <div className='grid justify-items-center my-4'>
          <a href='/exercises'>
            <ButtonComponent text='Problemas del tema' onClick={onclick}/>
          </a>
        </div>
      ) : (
        <></>
      )}
    </BasicPanelComponent>
  )
}
