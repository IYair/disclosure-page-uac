import { enumTextTags } from '@/constants/types'
import { TextComponent } from '../text/TextComponent'
import Link from 'next/link'
import NewsItemComponent from '../cards/NewsItemComponent'
import useNewsStore from '@/store/useNewsStore'

export const LastNewsComponent = async () => {
  const lastNews = await useNewsStore.getState().getLatest();
  return (
    <div className='h-full'>
      <div className='flex justify-between'>
        <TextComponent
          tag={enumTextTags.h2}
          sizeFont='s20'
          className='font-bold text-gray-800 dark:text-dark-accent'>
          Últimas Noticias
        </TextComponent>

        <div className='flex justify-end'>
          <Link href='/noticias' className='text-primary dark:text-dark-accent'>
            Ver más noticias
          </Link>
        </div>
      </div>
      <div className='flex flex-col gap-4 md:flex-row h-full'>
        {lastNews.map(item => (
          <NewsItemComponent item={item} key={item.id} />
        ))}
      </div>
    </div>
  );
}
