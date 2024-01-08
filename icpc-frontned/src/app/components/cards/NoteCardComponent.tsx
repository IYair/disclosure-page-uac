import React from 'react'
import { BasicPanelComponent } from '../panels/BasicPanelComponent'
import { TextComponent } from '../text/TextComponent'
import { MDXRemote } from 'next-mdx-remote/rsc'
import TagListComponent from '../TagListComponent'

interface NoteCardProps {
  title: string
  description: string
  content: string
  tags: {
    id: number
    name: string
    color: string
  }[]
}

export default function NoteCardComponent({ ...props }: Readonly<NoteCardProps>) {
  return (
    <BasicPanelComponent backgroundColor='bg-white dark:bg-dark-primary'>
      <TextComponent
        sizeFont='s36'
        className='dark:text-dark-accent'>
        {props.title}
      </TextComponent>
      <TagListComponent
        tags={props.tags}
      />
      <TextComponent
        sizeFont='s14'
        className='text-gray-500 font-medium my-4'>
        {props.description}
      </TextComponent>
      <MDXRemote source={props.content} />
    </BasicPanelComponent>
  )
}
