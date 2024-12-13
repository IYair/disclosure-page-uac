import React from 'react'
import ThreeDotComponent from '../dropdowns/ThreeDotComponent'
import { IProfileTableItem } from '@/constants/types'
import { TextComponent } from '../text/TextComponent'
import TagComponent from '../tags/TagComponent'

interface IProfileTableComponentProps {
  data: IProfileTableItem[]
  itemType: string
}

const ProfileTableComponent = (props: Readonly<IProfileTableComponentProps>) => {
  const handleEdit = (id: string, itemType: string) => {
    console.log('Le picó en Editar', id, itemType)
  }
  const handleDelete = (id: string, itemType: string) => {
    console.log('Le picó en Eliminar', id, itemType)
  }

  const tableData = props.data.length !== 0 ? (props.data.map(item => (
    <tr
      key={item.index}
      className='cursor-pointer hover:bg-slate-200'>
      <td
        className={`whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 
        dark:text-dark-accent sm:pl-6 lg:pl-8 w-full justify-between items-center`}>
        <TextComponent>{item.title}</TextComponent>
        {item.tagName && item.color && (
          <div className='max-w-min'>
            <TagComponent
              color={item.color}
              tagName={item.title}
              showIcon={false}
            />
          </div>
        )}
      </td>
      <td className='whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-dark-accent sm:pl-6 lg:pl-8'>
        <ThreeDotComponent
          handleDelete={handleDelete}
          handleEdit={handleEdit}
          id={item.id}
          itemType={props.itemType}
        />
      </td>
    </tr>
  ))) : (<tr>
    <td
      className='whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 
      dark:text-dark-accent sm:pl-6 lg:pl-8 w-full justify-between items-center'>
      <TextComponent>¡Ups! No hay elementos para mostrar</TextComponent></td>
  </tr>)

  return (
    <table className='min-w-full border-separate border-spacing-0'>
      <thead>
        <tr>
          <th
            scope='col'
            className='sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 
                    text-left text-sm font-semibold text-gray-500 backdrop-blur 
                    backdrop-filter sm:pl-6 lg:pl-8'>
            TÍTULO
          </th>
          <th
            scope='col'
            className='sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 
                    text-left text-sm font-semibold text-gray-500 backdrop-blur 
                    backdrop-filter sm:pl-6 lg:pl-8'></th>
        </tr>
      </thead>
      <tbody>
        {tableData}
      </tbody>
    </table>
  )
}

export default ProfileTableComponent
