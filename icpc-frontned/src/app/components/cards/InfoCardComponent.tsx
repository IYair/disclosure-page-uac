'use client'
import { NewspaperIcon, ListBulletIcon, BookOpenIcon } from '@heroicons/react/24/outline'
import { BasicPanelComponent } from '../panels/BasicPanelComponent'
import { TextComponent } from '../text/TextComponent'
import { enumTextTags } from '@/constants/types'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import useNewsStore from '@/store/useNewsStore'
import useExcerciseStore from '@/store/useExcerciseStore'
import useNoteStore from '@/store/useNoteStore'

/*
Input: A title string, an icon string, an info string, a href string, and a type number
Output: An object with properties for the InfoCardComponent
Return value: An object with the properties of the InfoCardComponent
Function: To describe the properties of the InfoCardComponent
Variables: title, icon, info, href, type
Date: 28 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/

interface IInfoCardComponentProps {
  title: string
  icon: string
  info: string
  href: string
  type: number
}

/*
Input: An object with properties described in the IInfoCardComponentProps interface, see above
Output: A card with all the information about the exercises, notes and news articles according to the type
Return value: A React Node
Function: Creates a small card with the title, icon, information and a link to see more
Variables: title, icon, info, href, exercises, value
Date: 28 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/

export const InfoCardComponent = ({ title = 'Title', type = 0, href = '#', ...props }: IInfoCardComponentProps) => {
  const getExerciseCount = useExcerciseStore(state => state.getCount)
  const getNotesCount = useNoteStore(state => state.getCount)
  const getNewsCount = useNewsStore(state => state.getCount)

  const [value, setValue] = useState<number>(0)

  // An effect hook to fetch the count of items based on the type
  useEffect(() => {
    switch (type) {
      case 0:
        getExerciseCount().then(response => {
          setValue(response)
        })
        break
      case 1:
        getNotesCount().then(response => {
          setValue(response)
        })
        break
      case 2:
        getNewsCount().then(response => {
          setValue(response)
        })
        break
    }
  }, [getExerciseCount, getNotesCount, getNewsCount])
  return (
    <BasicPanelComponent>
      <div className='flex justify-between items-center'>
        <div className='flex flex-row gap-2 '>
          {/* Displays the icon if the "icon" string matches the value */}
          {props.icon === 'NewspaperIcon' && <NewspaperIcon className='w-6 h-6' />}
          {props.icon === 'ListBulletIcon' && <ListBulletIcon className='w-6 h-6' />}
          {props.icon === 'BookOpenIcon' && <BookOpenIcon className='w-6 h-6' />}
          <TextComponent
            tag={enumTextTags.h3}
            sizeFont='s16'
            className='font-medium'>
            {title}
          </TextComponent>
        </div>
        <div className='flex flex-row gap-2'>
          <TextComponent
            tag={enumTextTags.span}
            sizeFont='s14'
            className='text-gray-500 font-medium'>
            {`Total de ${title.toLowerCase()}:`}
          </TextComponent>
          <TextComponent
            tag={enumTextTags.h3}
            sizeFont='s14'
            className='font-medium text-secondary'>
            {value.toString()}
          </TextComponent>
        </div>
      </div>
      <div className='pt-2'>
        <TextComponent
          tag={enumTextTags.p}
          sizeFont='s12'
          className='leading-5 text-gray-500'>
          {/* Displays the info text or a default text if info is not provided */}
          {props.info || `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`}
        </TextComponent>
      </div>
      <div className='mt-2'>
        <Link href={href}>
          <TextComponent
            tag={enumTextTags.span}
            sizeFont='s14'
            className='text-secondary font-medium cursor-pointer'>
            {`Ver mas...`}
          </TextComponent>
        </Link>
      </div>
    </BasicPanelComponent>
  )
}
