import React from 'react'
import { BasicPanelComponent } from '../panels/BasicPanelComponent'
import { TextComponent } from '../text/TextComponent'
import { enumTextTags, News } from '@/constants/types'
import MarkdownBodyComponent from '../panels/MarkdownBodyComponent'
import useNewsStore from '@/store/useNewsStore'
import { serialize } from 'next-mdx-remote/serialize'
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'
import ReportButtonComponent from '../buttons/ReportButtonComponent'

/*
Input: An id string, an optional itemId string, and an optional isTicketPage boolean
Output: An object with properties for the NewsCardComponent
Return value: An object with the properties of the NewsCardComponent
Function: To describe the properties (required and optional) of the NewsCardComponent
Variables: id, itemId, isTicketPage
Date: 28 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/

interface NewsCardComponentProps {
  id: string
  itemId?: string
  isTicketPage?: boolean
}

/*
Input: A single id string representing the news article
Output: A News object containing the article's details
Return value: A News object, see News type in '@/constants/types'
Function: Fetches a news article by its id from the news store
Variables: id
Date: 28 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/

async function getNewsArticle(id: string): Promise<News> {
  return await useNewsStore.getState().getNewsArticle(id)
}

/*
Input: An object with properties described in the NewsCardComponentProps interface, see above
Output: A card component that displays a news article with title, image, author, date, and body
Return value: A React Node
Function: Display a card with all the contents of a news article
Variables: isTicketPage, news, body
Date: 28 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/

async function NewsCardComponent({ isTicketPage = false, ...props  }: Readonly<NewsCardComponentProps>) {
  const news = await getNewsArticle(props.id)
  const body = await serialize(news.body, {
    mdxOptions: {
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex as any]
    }
  })

  return (
    <BasicPanelComponent backgroundColor='bg-white dark:bg-dark-primary w-full md:w-11/12'>
      { /* Renders the report button if this component is NOT rendered inside the page of a ticket */}
      {!isTicketPage && (
        <div className='flex justify-end w-full px-16'>
          <ReportButtonComponent
            itemId={news.id}
            itemType='news'
          />
        </div>
      )}
      <TextComponent
        sizeFont='s36'
        className='dark:text-dark-accent my-4'
        tag={enumTextTags.h1}>
        {news.title}
      </TextComponent>
      <img
        className='object-cover w-2/3 lg:w-1/3 m-auto rounded-md'
        alt=''
        src={process.env.NEXT_PUBLIC_API_URL + 'api/v1/image/' + news.imageId.id}
      />
      <TextComponent
        sizeFont='s14'
        className='text-gray-500 font-medium my-4'>
        { /* Displays the username of the professor that uploaded the article or "Anónimo" if the value is null */}
        {news.created_by ?? 'Anónimo'}
      </TextComponent>
      <TextComponent
        sizeFont='s14'
        className='text-gray-500 font-medium my-4'>
        { /* Displays the date of creation of the article in YYYY-MM-DD format */}
        {news.created_at ? `${news.created_at.split('Z')[0].toString().split('T')[0]}` : ''}
      </TextComponent>
      <MarkdownBodyComponent body={body.compiledSource} />
    </BasicPanelComponent>
  )
}

export default NewsCardComponent
