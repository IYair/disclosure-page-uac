'use client'
import { enumTextTags, News } from '@/constants/types'
import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import { BasicPanelComponent } from '../panels/BasicPanelComponent'
import { TextComponent } from '../text/TextComponent'
import cn from 'classnames'

/*
Input: A News object, an optional className string for styling
Output: An object with properties for the NewsItemComponent
Return value: An object with the properties of the NewsItemComponent
Function: To describe the properties (required and optional) of the NewsItemComponent
Variables: item, className
Date: 28 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/

interface INewsItemProps {
  item: News
  className?: string
}

/*
Input: An object with properties described in the INewsItemProps interface, see above
Output: A card that displays a news item with title, image, and style
Return value: A React Node
Function: Display a news article as a card that is part of a list of news articles
Variables: item { href, title, image }, className, style
Date: 28 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/

const NewsItemComponent = ({ ...props }: Readonly<INewsItemProps>) => {
  const style = cn(props.className, 'bg-white dark:bg-dark-primary w-full lg:w-[32%]')
  return (
    <BasicPanelComponent backgroundColor={style}>
      <Link
        href={`/news/${props.item.id}`}
        className='h-full'>
        <div className='relative mb-4 h-64'>
          {/* Displays the cover of the news articles if the id of the image exists and it's not empty */}
          {props.item.imageId?.id !== undefined && props.item.imageId.id !== '' && (
            <Image
              src={process.env.NEXT_PUBLIC_API_URL + 'api/v1/image/' + props.item.imageId.id}
              fill
              alt={props.item.title}
              className='object-cover rounded-md'
            />
          )}
        </div>
        <TextComponent
          tag={enumTextTags.p}
          sizeFont='s16'
          className='font-bold text-dark-accent'>
          {props.item.title}
        </TextComponent>
      </Link>
    </BasicPanelComponent>
  )
}

export default NewsItemComponent
