import { useEffect, useState } from 'react'
import CreateExerciseComponent from '../modals/CreateExcerciseComponent'
import CreateNoteComponent from '../modals/CreateNoteComponent'
import CreateNewsComponent from '../modals/CreateNewsComponent'
import { ButtonComponent } from '../buttons/ButtonComponent'
import CreateCategoryComponent from '../modals/CreateCategoryComponent'
import CreateDifficultyComponent from '../modals/CreateDifficultyComponent'
import CreateTimeLimitComponent from '../modals/CreateTimeComponent'
import CreateMemoryComponent from '../modals/CreateMemoryComponent'
import CreateTagComponent from '../modals/CreateTagComponent'
import CreateUserComponent from '../modals/CreateUserComponent'
import { useForm, FieldValues } from 'react-hook-form'

/*
Input: myTabs (array of user tab objects), adminTabs (array of admin tab objects),
  isAdmin (boolean for admin status), handleChange (function for tab change),
  updateTable (function to refresh table)
Output: Tab navigation UI with modal creation and tab switching
Return value: JSX.Element (TabComponent UI)
Function: Renders a tab navigation bar with support for user/admin tabs, modal creation, and responsive design
Variables: tabs, accountTab, filteredAdminTabs, showModal, showCreateButton, modalComponent, activeTab, methods
Date: 29 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

/*
Input: A list of user tabs, a list of admin tabs, a boolean indicating if the user is an admin,
a function to handle tab changes, and a function to update the table
Output: A tab navigation UI with modal creation and tab switching
Return value: A React Node
Function: Renders a tab navigation bar with support for user/admin tabs, modal creation, and responsive design
Variables: tabs, accountTab, filteredAdminTabs, showModal, showCreateButton, modalComponent, activeTab, methods
Date: 28 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/
export default function TabComponent({
  myTabs,
  adminTabs,
  isAdmin,
  handleChange,
  updateTable
}: Readonly<{
  readonly myTabs: ReadonlyArray<{
    href: string | undefined
    name: string
    current?: boolean
  }>
  readonly adminTabs: ReadonlyArray<{
    href: string | undefined
    name: string
    current?: boolean
  }>
  handleChange: (tabName: string) => void
  isAdmin: boolean
  updateTable: () => void
}>) {
  const tabs = myTabs.concat(adminTabs)
  const accountTab = tabs.find(tab => tab.name === 'Cuentas')
  const filteredAdminTabs = adminTabs.filter(tab => tab.name !== 'Cuentas')
  const [showModal, setShowModal] = useState(false)
  const [showCreateButton, setShowCreateButton] = useState(true)
  const [modalComponent, setModalComponent] = useState<JSX.Element | null>(null)
  const [activeTab, setActiveTab] = useState(tabs.find(tab => tab.current)?.name)
  const methods = useForm<FieldValues>()
  const onCreateDifficulty = (DifficultyName: string) => {}
  const onCreateTag = (tagName: string) => {}
  const onCreateTimeLimit = (time: number) => {}
  const onCreateMemory = (memoryName: string) => {}

  // Effect hook to update the table when the modal is closed
  useEffect(() => {
    updateTable()
  }, [showModal])

  // Function to handle tab changes
  const handleTabChange = (tabName: string) => {
    setActiveTab(tabName)
    handleChange(tabName)

    // If the name of the current tab matches one of the specified names, show the "Crear" button
    if (
      tabName === 'Apuntes' ||
      tabName === 'Noticias' ||
      tabName === 'Ejercicios' ||
      tabName === 'Categoría' ||
      tabName === 'Etiqueta' ||
      tabName === 'Tiempo' ||
      tabName === 'Memoria' ||
      tabName === 'Dificultad' ||
      tabName === 'Cuentas'
    ) {
      setShowCreateButton(true)

      // Set the modal component based on the current tab name
      if (tabName === 'Apuntes') {
        setModalComponent(<CreateNoteComponent onClose={handleModalClose} />)
      } else if (tabName === 'Noticias') {
        setModalComponent(<CreateNewsComponent onClose={handleModalClose} />)
      } else if (tabName === 'Ejercicios') {
        setModalComponent(
          <CreateExerciseComponent
            onClose={handleModalClose}
            onCreate={() => {}}
          />
        )
      } else if (tabName === 'Categoría') {
        setModalComponent(<CreateCategoryComponent onClose={handleModalClose} />)
      } else if (tabName === 'Etiqueta') {
        setModalComponent(
          <CreateTagComponent
            methods={methods}
            onCreateTag={onCreateTag}
            onClose={handleModalClose}
          />
        )
      } else if (tabName === 'Tiempo') {
        setModalComponent(
          <CreateTimeLimitComponent
            methods={methods}
            onCreateTimeLimit={onCreateTimeLimit}
            onClose={handleModalClose}
          />
        )
      } else if (tabName === 'Memoria') {
        setModalComponent(
          <CreateMemoryComponent
            methods={methods}
            onCreateMemory={onCreateMemory}
            onClose={handleModalClose}
          />
        )
      } else if (tabName === 'Dificultad') {
        setModalComponent(
          <CreateDifficultyComponent
            methods={methods}
            onCreateDifficulty={onCreateDifficulty}
            onClose={handleModalClose}
          />
        )
      } else if (tabName === 'Cuentas') {
        setModalComponent(<CreateUserComponent onClose={handleModalClose} />)
      }
    } else {
      setShowCreateButton(false)
      setModalComponent(null)
    }
  }

  // Function to open the modal with the appropriate component based on the active tab
  const handleModalOpen = () => {
    if (activeTab === 'Apuntes') {
      setModalComponent(<CreateNoteComponent onClose={handleModalClose} />)
    } else if (activeTab === 'Noticias') {
      setModalComponent(<CreateNewsComponent onClose={handleModalClose} />)
    } else if (activeTab === 'Ejercicios') {
      setModalComponent(
        <CreateExerciseComponent
          onClose={handleModalClose}
          onCreate={() => {}}
        />
      )
    } else if (activeTab === 'Categoría') {
      setModalComponent(<CreateCategoryComponent onClose={handleModalClose} />)
    } else if (activeTab === 'Etiqueta') {
      setModalComponent(
        <CreateTagComponent
          methods={methods}
          onCreateTag={onCreateTag}
          onClose={handleModalClose}
        />
      )
    } else if (activeTab === 'Tiempo') {
      setModalComponent(
        <CreateTimeLimitComponent
          methods={methods}
          onCreateTimeLimit={onCreateTimeLimit}
          onClose={handleModalClose}
        />
      )
    } else if (activeTab === 'Memoria') {
      setModalComponent(
        <CreateMemoryComponent
          methods={methods}
          onCreateMemory={onCreateMemory}
          onClose={handleModalClose}
        />
      )
    } else if (activeTab === 'Dificultad') {
      setModalComponent(
        <CreateDifficultyComponent
          methods={methods}
          onCreateDifficulty={onCreateDifficulty}
          onClose={handleModalClose}
        />
      )
    } else if (activeTab === 'Cuentas') {
      setModalComponent(<CreateUserComponent onClose={handleModalClose} />)
    }
    setShowModal(true)
  }

  // Function to close the modal and reset the component
  const handleModalClose = () => {
    setShowModal(false)
    setModalComponent(null)
  }

  return (
    <div className='flex flex-row justify-between w-full'>
      {/* If the showModal state is true, show the modalComponent */}
      {showModal && (
        <div className='fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50'>
          <div className='rounded-lg p-6 w-full max-h-[90%] overflow-y-auto'>{modalComponent}</div>
        </div>
      )}

      <div className='lg:hidden w-11/12'>
        <label
          htmlFor='tabs'
          className='sr-only'>
          Select a tab
        </label>
        <select
          id='tabs'
          name='tabs'
          className='block w-full min-w-[200px] rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 text-black lg:hidden'
          value={activeTab}
          onChange={e => handleTabChange(e.target.value)}>
          {/* If the account is an admin, show all tabs; otherwise show only the user's tabs */}
          {isAdmin
            ? tabs.map(tab => (
                <option
                  key={tab.name}
                  value={tab.name}>
                  {tab.name}
                </option>
              ))
            : myTabs.map(tab => (
                <option
                  key={tab.name}
                  value={tab.name}>
                  {tab.name}
                </option>
              ))}
        </select>
      </div>

      <div className='hidden lg:block lg:w-full'>
        <div className='border-b border-gray-200'>
          <div className='flex flex-row gap-8'>
            <div
              className='flex flex-row space-x-2'
              aria-label='Tabs'>
              {/* Map through the user's tabs and create a link for each one */}
              {myTabs.map(tab => (
                <a
                  key={tab.name}
                  href={tab.href}
                  className={classNames(
                    tab.name === activeTab
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent dark:text-white hover:border-gray-300 hover:text-gray-700',
                    'group inline-flex items-center border-b-2 py-3.5 px-1 text-xs font-medium'
                  )}
                  onClick={e => {
                    e.preventDefault()
                    handleTabChange(tab.name)
                    handleChange(tab.name)
                  }}
                  aria-current={tab.name === activeTab ? 'page' : undefined}>
                  <span>{tab.name}</span>
                </a>
              ))}
            </div>
            {/* If the account is an admin, show the admin tabs */}
            {isAdmin && (
              <div
                className='bg-primary rounded-md flex flex-row space-x-2'
                aria-label='Tabs'>
                {filteredAdminTabs.map(tab => (
                  <a
                    key={tab.name}
                    href={tab.href}
                    className={classNames(
                      tab.name === activeTab
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-white hover:border-gray-300 hover:text-gray-700',
                      `group inline-flex items-center border-b-2 py-2 px-1 text-xs font-medium`
                    )}
                    onClick={e => {
                      e.preventDefault()
                      handleTabChange(tab.name)
                      handleChange(tab.name)
                    }}
                    aria-current={tab.name === activeTab ? 'page' : undefined}>
                    <span>{tab.name}</span>
                  </a>
                ))}
              </div>
            )}
            {/* If the account is an admin, show the account tab */}
            {isAdmin && (
              <div
                className='bg-complementary rounded-md flex flex-row space-x-2'
                aria-label='Tabs'>
                {accountTab && (
                  <a
                    href={accountTab.href}
                    className={classNames(
                      accountTab.name === activeTab
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-white hover:border-gray-300 hover:text-gray-700',
                      `group inline-flex items-center border-b-2 py-2 px-1 text-xs font-medium`
                    )}
                    onClick={e => {
                      e.preventDefault()
                      handleTabChange(accountTab.name)
                      handleChange(accountTab.name)
                    }}
                    aria-current={accountTab.name === activeTab ? 'page' : undefined}>
                    <span>{accountTab.name}</span>
                  </a>
                )}
              </div>
            )}
            {/* If the state is true, show the create button at the end of the tab list */}
            {showCreateButton && (
              <ButtonComponent
                text='Crear'
                buttonType='button'
                onClick={handleModalOpen}
                className='ml-auto px-2 py-0 text-sm'
              />
            )}
          </div>
        </div>
      </div>
      {/* If the state is true, show the create button at the end of the tab list */}
      {showCreateButton && (
        <ButtonComponent
          text='Crear'
          buttonType='button'
          onClick={handleModalOpen}
          className='ml-10 px-4 py-2 text-sm text-center flex justify-center items-center lg:hidden'
        />
      )}
    </div>
  )
}
