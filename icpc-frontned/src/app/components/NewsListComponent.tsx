import React, { Suspense } from 'react'
import cn from 'classnames'
import { TextComponent } from './text/TextComponent'
import { enumTextTags } from '@/constants/types'
const data = require('../newslist/listaNoticias.json')

const LazyNewsItemComponent = React.lazy(() => import('./cards/NewsItemComponent'))

interface INewsListComponentProps {
  className?: string
}

const NewsListComponent = ({ ...props }: Readonly<INewsListComponentProps>) => {
  const style = cn(props.className, 'w-11/12 flex flex-row flex-wrap gap-4 justify-between')
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
      <div className={style}>
        {data.news.map((news: { id: any; href: string; title: string; image: string }) => (
          <Suspense key={news.id}>
            <LazyNewsItemComponent
              item={news}
              className=''
            />
          </Suspense>
        ))}
      </div>
    </>
  )
}

export default NewsListComponent
