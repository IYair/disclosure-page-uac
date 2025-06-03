'use client'
import React, { useState, Dispatch, SetStateAction } from 'react'
import ThreeDotComponent from '../dropdowns/ThreeDotComponent'
import { IProfileTableItem, AllTabs } from '@/constants/types'
import { TextComponent } from '../text/TextComponent'
import TagComponent from '../tags/TagComponent'
import useExcerciseStore from '@/store/useExcerciseStore'
import useNoteStore from '@/store/useNoteStore'
import useNewsStore from '@/store/useNewsStore'
import useUtilsStore from '@/store/useUtilsStore'
import useStore from '@/store/useStore'
import { toast } from 'sonner'
import CreateCategoryComponent from '../modals/CreateCategoryComponent'
import CreateDifficultyComponent from '../modals/CreateDifficultyComponent'
import CreateMemoryComponent from '../modals/CreateMemoryComponent'
import CreateTimeLimitComponent from '../modals/CreateTimeComponent'
import CreateTagComponent from '../modals/CreateTagComponent'
import CreateExcerciseComponent from '../modals/CreateExcerciseComponent'
import CreateNoteComponent from '../modals/CreateNoteComponent'
import CreateNewsComponent from '../modals/CreateNewsComponent'
import CreateUserComponent from '../modals/CreateUserComponent'
import { useForm } from 'react-hook-form'
import DisplayReportComponent from '../cards/DisplayReportComponent'
import ConfirmDenyComponent from '../buttons/Confirm&DenyComponent'

/*
Input: name (string), action (function to execute on option select), style (string for CSS classes), href (optional string for navigation)
Output: Option object for table actions
Return value: Option object
Function: Defines the structure for an action option in the profile table (e.g., View, Edit, Delete)
Variables: name, action, style, href
Date: 28 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/
interface Option {
  name: string
  action: (id: string, itemType: string, href?: string) => void
  style: string
  href?: string
}

/*
Input: data (array of IProfileTableItem), itemType (string for the type of item),
  update (boolean for refresh), setUpdate (function to toggle update),
  onClose (function to close modals)
Output: Renders a table of profile items with actions and modals
Return value: JSX.Element (ProfileTableComponent UI)
Function: Displays a table of items (exercises, notes, news, etc.) with options to view, edit, delete.
  Also manages related modals and handles state for modals and deletion confirmation.
Variables: methods, modal open states, active item IDs, delete states, selectedReportId, options array
Date: 28 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/
interface IProfileTableComponentProps {
  data: IProfileTableItem[]
  itemType: string
  update: boolean
  setUpdate: Dispatch<SetStateAction<boolean>>
  onClose: () => void
}

/*
Input: An object with properties described in IProfileTableComponentProps, see above
Output: The component that displays the main data table of the profile page
Return value: A React Node
Function: To display different types of data items in a table for the user or admin to manage
Variables: methods, isCategoryModalOpen, isDifficultyModalOpen, isMemoryModalOpen,
isTimeModalOpen, isTagModalOpen, isExerciseModalOpen, isNoteModalOpen, isNewsModalOpen,
isUserModalOpen, confirmDelete, deleteId, deleteItemType, activeCategoryId,
activeDifficultyId, activeMemoryId, activeTimeId, activeTagId, activeExerciseId, activeNoteId, activeNewsId, activeUserId, selectedReportId
Date: 28 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/
const ProfileTableComponent = (props: Readonly<IProfileTableComponentProps>) => {
  const methods = useForm()
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [isDifficultyModalOpen, setIsDifficultyModalOpen] = useState(false)
  const [isMemoryModalOpen, setIsMemoryModalOpen] = useState(false)
  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false)
  const [isTagModalOpen, setIsTagModalOpen] = useState(false)
  const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false)
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false)
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false)
  const [isUserModalOpen, setIsUserModalOpen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleteItemType, setDeleteItemType] = useState<string | null>(null)
  const [activeCategoryId, setActiveCategoryId] = useState<string | undefined>(undefined)
  const [activeDifficultyId, setActiveDifficultyId] = useState<string | undefined>(undefined)
  const [activeMemoryId, setActiveMemoryId] = useState<string | undefined>(undefined)
  const [activeTimeId, setActiveTimeId] = useState<string | undefined>(undefined)
  const [activeTagId, setActiveTagId] = useState<string | undefined>(undefined)
  const [activeExerciseId, setActiveExerciseId] = useState<string | undefined>(undefined)
  const [activeNoteId, setActiveNoteId] = useState<string | undefined>(undefined)
  const [activeNewsId, setActiveNewsId] = useState<string | undefined>(undefined)
  const [activeUserId, setActiveUserId] = useState<string | undefined>(undefined)
  const deleteExercise = useExcerciseStore(state => state.deleteExercise)
  const deleteNote = useNoteStore(state => state.deleteNote)
  const deleteNews = useNewsStore(state => state.deleteNews)
  const deleteCategory = useUtilsStore(state => state.deleteCategory)
  const deleteTag = useUtilsStore(state => state.deleteTag)
  const deleteTimeLimit = useUtilsStore(state => state.deleteTimeLimit)
  const deleteMemoryLimit = useUtilsStore(state => state.deleteMemoryLimit)
  const deleteDifficulty = useUtilsStore(state => state.deleteDifficulty)
  const deleteUser = useStore(state => state.deleteUser)
  const hasPendingTicket = useUtilsStore(state => state.hasPendingTicket)

  const [selectedReportId, setSelectedReportId] = useState<string | null>(null)

  // Function to handle redirection based on item type and ID
  const handleRedirect = (id: string, itemType: string, href?: string) => {
    window.location.href = `/${href}/${id}`
  }

  // Function to handle showing the report modal
  const handleShowReport = (id: string, itemType: string) => {
    setSelectedReportId(id)
  }

  // Function to update the table state
  const updateTable = () => {
    props.setUpdate(!props.update)
  }

  // Function to handle editing items based on their type
  const handleEdit = async (id: string, itemType: string) => {
    try {
      // Check if the item type is one of the main types
      if (itemType === 'Noticias' || itemType === 'Ejercicios' || itemType === 'Apuntes') {
        const response = await hasPendingTicket(id, itemType)
        // If there are pending changes for the selected item, display an error message and return
        if (response === true) {
          toast.error('Ya existe una modificación en espera para este ítem.', {
            duration: 5000,
            style: { backgroundColor: 'red', color: 'white' }
          })
          return
        }
        // Display the appropriate modal according to the item type
        switch (itemType) {
          case AllTabs.EXERCISES:
            setActiveExerciseId(id)
            setIsExerciseModalOpen(true)
            break
          case AllTabs.NOTES:
            setActiveNoteId(id)
            setIsNoteModalOpen(true)
            break
          case AllTabs.NEWS:
            setActiveNewsId(id)
            setIsNewsModalOpen(true)
            break
        }
      } else {
        switch (itemType) {
          case AllTabs.CATEGORIES:
            setActiveCategoryId(id)
            setIsCategoryModalOpen(true)
            break
          case AllTabs.DIFFICULTY:
            setActiveDifficultyId(id)
            setIsDifficultyModalOpen(true)
            break
          case AllTabs.MEMORY:
            setActiveMemoryId(id)
            setIsMemoryModalOpen(true)
            break
          case AllTabs.TIME:
            setActiveTimeId(id)
            setIsTimeModalOpen(true)
            break
          case AllTabs.TAGS:
            setActiveTagId(id)
            setIsTagModalOpen(true)
            break
          case AllTabs.ACCOUNT:
            setActiveUserId(id)
            setIsUserModalOpen(true)
            break
          default:
            console.error('Tipo de ítem no reconocido:', itemType)
        }
      }
      props.setUpdate(!props.update)
    } catch (error) {
      console.error('Error al verificar el estado del ticket:', error)
      toast.error('Error al verificar el estado del ticket.', {
        duration: 5000,
        style: { backgroundColor: 'red', color: 'white' }
      })
    }
  }

  // Function to handle deletion of items
  const handleDelete = async (id: string, itemType: string) => {
    // Check if the item type is one of the main types
    if (itemType === 'Noticias' || itemType === 'Ejercicios' || itemType === 'Apuntes') {
      const response = await hasPendingTicket(id, itemType)

      // If the selected item has pending changes, display an error message
      if (response === true) {
        toast.error('Hay una solicitud de modificación en espera para este ítem.', {
          duration: 5000,
          style: { backgroundColor: 'red', color: 'white' }
        })
        return
      }
    }
    setDeleteId(id)
    setDeleteItemType(props.itemType)
    setConfirmDelete(true)
  }

  // Function to delete an item after user confirmation
  const confirmDeleteAction = async () => {
    let response
    // Send the appropriate response according to item type
    switch (deleteItemType) {
      case AllTabs.EXERCISES:
        response = await deleteExercise(deleteId!)
        break
      case AllTabs.NOTES:
        response = await deleteNote(deleteId!)
        break
      case AllTabs.NEWS:
        response = await deleteNews(deleteId!)
        break
      case AllTabs.CATEGORIES:
        response = await deleteCategory(deleteId!)
        break
      case AllTabs.TAGS:
        response = await deleteTag(deleteId!)
        break
      case AllTabs.TIME:
        response = await deleteTimeLimit(deleteId!)
        break
      case AllTabs.MEMORY:
        response = await deleteMemoryLimit(deleteId!)
        break
      case AllTabs.DIFFICULTY:
        response = await deleteDifficulty(deleteId!)
        break
      case AllTabs.ACCOUNT:
        response = await deleteUser(deleteId!)
        break
    }

    // If there is an item id in the response, the request was successful
    if ('id' in response!) {
      toast.success(`Solicitud de eliminación enviada`, { duration: 5000, style: { backgroundColor: 'green', color: 'white' } })
    }

    setConfirmDelete(false)
    setDeleteId(null)
    setDeleteItemType(null)
    props.setUpdate(!props.update)
  }

  // Different options to be displayed in the options menu for every item and their associated functions
  const options: Option[] = [
    {
      name: 'Ver',
      action: handleRedirect,
      style: 'hover:bg-secondary flex',
      href: 'ticket'
    },
    {
      name: 'Editar',
      action: handleEdit,
      style: 'hover:bg-secondary flex'
    },
    {
      name: 'Eliminar',
      action: handleDelete,
      style: 'hover:bg-red-600 flex'
    },
    {
      name: 'Ver',
      action: handleShowReport,
      style: 'hover:bg-secondary flex'
    }
  ]

  // Functions to set the available options according to the item type
  const setCurrentOptions = (id: string, itemType: string) => {
    switch (itemType) {
      case AllTabs.REPORTS:
        return [options[3]] // "Ver" for error reports
      case AllTabs.CHANGES:
        return [options[0]] // "Ver" for change tickets
      case AllTabs.EXERCISES:
        return [
          { ...options[0], href: 'exercises' }, // "Ver" to redirect to the item
          options[1], // "Editar"
          options[2] // "Eliminar"
        ]
      case AllTabs.NOTES:
        return [
          { ...options[0], href: 'note' }, // "Ver" to redirect to the item
          options[1], // "Editar"
          options[2] // "Eliminar"
        ]
      case AllTabs.NEWS:
        return [
          { ...options[0], href: 'news' }, // "Ver" to redirect to the item
          options[1], // "Editar"
          options[2] // "Eliminar"
        ]
      default:
        return [options[1], options[2]] // "Editar", "Eliminar" for other items
    }
  }

  return (
    <div>
      {/* If the state is true, display the modal */}
      {selectedReportId && (
        <DisplayReportComponent
          id={selectedReportId}
          onClose={() => {
            setSelectedReportId(null)
            props.setUpdate(!props.update)
          }}
        />
      )}
      {/* If the state is true, display the modal */}
      {confirmDelete && (
        <ConfirmDenyComponent
          onConfirm={confirmDeleteAction}
          onCancel={() => setConfirmDelete(false)}
        />
      )}
      {/* If the state is true, display the modal */}
      {isCategoryModalOpen && (
        <CreateCategoryComponent
          onClose={() => {
            setIsCategoryModalOpen(false)
            props.setUpdate(!props.update)
          }}
          categoryId={activeCategoryId}
        />
      )}
      {/* If the state is true, display the modal */}
      {isDifficultyModalOpen && (
        <CreateDifficultyComponent
          onClose={() => {
            setIsDifficultyModalOpen(false)
            props.setUpdate(!props.update)
          }}
          difficultyId={activeDifficultyId}
          methods={methods}
          onCreateDifficulty={(difficultyName: string) => {}}
        />
      )}
      {/* If the state is true, display the modal */}
      {isMemoryModalOpen && (
        <CreateMemoryComponent
          onClose={() => {
            setIsMemoryModalOpen(false)
            props.setUpdate(!props.update)
          }}
          memoryId={activeMemoryId}
          methods={methods}
          onCreateMemory={(memoryName: string) => {}}
        />
      )}
      {/* If the state is true, display the modal */}
      {isTimeModalOpen && (
        <CreateTimeLimitComponent
          onClose={() => {
            setIsTimeModalOpen(false)
            props.setUpdate(!props.update)
          }}
          timeId={activeTimeId}
          methods={methods}
          onCreateTimeLimit={(time: number) => {}}
        />
      )}
      {/* If the state is true, display the modal */}
      {isTagModalOpen && (
        <CreateTagComponent
          onClose={() => {
            setIsTagModalOpen(false)
            props.setUpdate(!props.update)
          }}
          tagId={activeTagId}
          methods={methods}
          onCreateTag={(tagName: string) => {}}
        />
      )}
      {/* If the state is true, display the modal */}
      {isExerciseModalOpen && (
        <div className='fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50'>
          <div className='rounded-lg p-6 w-full max-h-[90%] overflow-y-auto'>
            <CreateExcerciseComponent
              onClose={() => {
                props.setUpdate(!props.update)
                setIsExerciseModalOpen(false)
              }}
              id={activeExerciseId}
              onCreate={() => {}}
            />
          </div>
        </div>
      )}
      {/* If the state is true, display the modal */}
      {isNoteModalOpen && (
        <div className='fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50'>
          <div className='rounded-lg p-6 w-full max-h-[90%] overflow-y-auto'>
            <CreateNoteComponent
              onClose={() => {
                setIsNoteModalOpen(false)
                props.setUpdate(!props.update)
              }}
              id={activeNoteId}
            />
          </div>
        </div>
      )}
      {/* If the state is true, display the modal */}
      {isNewsModalOpen && (
        <div className='fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50'>
          <div className='rounded-lg p-6 w-full max-h-[90%] overflow-y-auto'>
            <CreateNewsComponent
              onClose={() => {
                setIsNewsModalOpen(false)
                props.setUpdate(!props.update)
              }}
              id={activeNewsId}
            />
          </div>
        </div>
      )}
      {/* If the state is true, display the modal */}
      {isUserModalOpen && (
        <div className='fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50'>
          <div className='rounded-lg p-6 w-full max-h-[90%] overflow-y-auto'>
            <CreateUserComponent
              onClose={() => {
                setIsUserModalOpen(false)
                props.setUpdate(!props.update)
              }}
              id={activeUserId}
            />
          </div>
        </div>
      )}
      <div className='relative lg:px-16'>
        <table className='w-full table-fixed border-separate border-spacing-0 z-10'>
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
                className='w-20 sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 
                text-right text-sm font-semibold text-gray-500 backdrop-blur 
                backdrop-filter sm:pl-6 lg:pl-8'></th>
            </tr>
          </thead>
          <tbody>
            {/* If the length of the data is different from 0, map the data; otherwise, show a 'no data' message */}
            {props.data.length !== 0 ? (
              // Loop through all items to display an item in the table
              props.data.map(item => (
                <tr
                  key={item.index}
                  className='cursor-pointer hover:bg-slate-200'>
                  <td
                    className={`whitespace-nowrap max-w-[200px] overflow-hidden text-ellipsis py-4 pl-4 pr-3 text-sm font-medium text-gray-900 
                    dark:text-dark-accent sm:pl-6 lg:pl-8`}>
                    <TextComponent>{item.title}</TextComponent>
                    {/* If the item has a tagName and a color, render a tag */}
                    {item.tagName && item.color && (
                      <div className='max-w-min'>
                        <TagComponent
                          color={item.color}
                          tagName={item.title}
                          showIcon={false}
                        />
                      </div>
                    )}
                    {/* If the item has a level, display the number */}
                    {item.level && <TextComponent>{item.level}</TextComponent>}
                  </td>
                  <td
                    className={`text-right whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium 
                    text-gray-900 dark:text-dark-accent sm:pl-6 lg:pl-8`}>
                    <ThreeDotComponent
                      id={item.id}
                      itemType={props.itemType}
                      options={setCurrentOptions(item.id, props.itemType)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  className='whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 
                  dark:text-dark-accent sm:pl-6 lg:pl-8 w-full justify-between items-center'>
                  <TextComponent>¡Ups! No hay elementos para mostrar</TextComponent>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ProfileTableComponent
