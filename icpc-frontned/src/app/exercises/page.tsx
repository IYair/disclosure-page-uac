import { enumTextTags } from '@/constants/types'
import { TextComponent } from '../components/text/TextComponent'
import TableComponent from '../components/tables/TableComponent'

/*
Input: None (uses hooks and store state)
Output: JSX.Element with the exercises page layout
Return value: JSX.Element
Function: Renders the exercises page, displaying a list or grid of exercises
Variables: (to be filled based on actual implementation)
Date: 29 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/
export default function Home() {
  return (
    <div className='mt-16'>
      <div className='pt-10 px-10'>
        <TextComponent
          sizeFont='s28'
          tag={enumTextTags.h1}
          className='text-dark-primary dark:text-dark-accent'>
          Ejercicios
        </TextComponent>
        <TextComponent
          sizeFont='s14'
          tag={enumTextTags.p}
          className='text-dark-primary dark:text-dark-accent mt-5'>
          Aquí encontrarás ejercicios de diferentes temas de programación
        </TextComponent>
      </div>

      <div className='px-10 mt-5'>
        <TableComponent />
      </div>
    </div>
  )
}
