'use client'
import React, { Suspense, useEffect, useState } from 'react'
import cn from 'classnames'
import { TextComponent } from './text/TextComponent'
import { enumTextTags, News } from '@/constants/types'
import useNewsStore from '@/store/useNewsStore'

// Implementation of lazy loading for the items in the list
const LazyNewsItemComponent = React.lazy(() => import('./cards/NewsItemComponent'))

/*
Input: An optional tailwind string
Output: An object with the properties for the NewsListComponent
Return value: An object with the properties of the NewsListComponent
Function: To describe the properties (required and optional) of the NewsListComponent
Variables: className
Date: 29 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/
interface INewsListComponentProps {
  className?: string
}

/*
Input: className (optional string for custom classes)
Output: List of news articles as a component
Return value: JSX.Element (news list)
Function: Fetches and displays a list of news articles, using lazy loading for each item
Variables: className, newsList, news, getNews, style, ref
Date: 29 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/
const NewsListComponent = ({ ...props }: Readonly<INewsListComponentProps>) => {
  const style = cn(props.className, 'w-11/12 flex flex-row flex-wrap gap-4')
  let ref = React.createRef<HTMLDivElement>()
  const newsList = useNewsStore(state => state.news)
  const [news, setNews] = useState<News[]>(newsList)
  const getNews = useNewsStore(state => state.getNews)
  
  // Fetch news articles when the component mounts
  useEffect(() => {
    getNews().then(response => {
      setNews(response)
    })
  }, [getNews])

  return (
    <>
      <div className={style}>
        <TextComponent
          tag={enumTextTags.h1}
          sizeFont='s28'
          className='font-bold dark:text-dark-accent my-4'>
          Noticias
        </TextComponent>
      </div>
      <div className={style} ref={ref}>
        {/* If the news list is not empty, render the news items; otherwise show a message */}
        {news.length > 0 ? (
          news.map((newsItem: News) => (
            <Suspense key={newsItem.index}>
              <LazyNewsItemComponent
                item={newsItem}
                className=''
              />
            </Suspense>
          ))
        ) : (
          <TextComponent
            className='text-center w-full'
            tag={enumTextTags.h1}
            sizeFont='s20'>
            No hay noticias
          </TextComponent>
        )}
      </div>
    </>
  )
}

export default NewsListComponent