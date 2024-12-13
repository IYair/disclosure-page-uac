'use client'
import { useForm } from 'react-hook-form'
import { ButtonComponent } from '../components/buttons/ButtonComponent'
import TextFieldComponent from '../components/forms/TextFieldComponent'
import TabComponent from '../components/tabs/TabComponent'
import { NewspaperIcon, ArchiveBoxIcon, ListBulletIcon, BookmarkIcon } from '@heroicons/react/20/solid'
import useAuthStore, { IUser } from '@/store/useStore'
import { useCallback, useEffect, useState } from 'react'
import useNewsStore from '@/store/useNewsStore'
import {
  Categories,
  Exercise,
  News,
  Note,
  Tags,
  AllTabs,
  TimeLimit,
  MemoryLimit,
  Difficulties,
  IProfileTableItem,
  Report,
  Ticket
} from '@/constants/types'
import ProfileTableComponent from '../components/tables/ProfileTableComponent'
import useExcerciseStore from '@/store/useExcerciseStore'
import useNoteStore from '@/store/useNoteStore'
import useUtilsStore from '@/store/useUtilsStore'

const myTabs = [
  { name: 'Ejercicios', href: '#', icon: ListBulletIcon, current: true },
  { name: 'Apuntes', href: '#', icon: BookmarkIcon, current: false },
  { name: 'Noticias', href: '#', icon: NewspaperIcon, current: false },
  { name: 'Reportes', href: '#', icon: ArchiveBoxIcon, current: false }
]
const adminTabs = [
  { name: 'Cambios', href: '#', icon: ArchiveBoxIcon, current: false },
  { name: 'Categoría', href: '#', icon: ListBulletIcon, current: false },
  { name: 'Etiqueta', href: '#', icon: BookmarkIcon, current: false },
  { name: 'Tiempo', href: '#', icon: NewspaperIcon, current: false },
  { name: 'Memoria', href: '#', icon: ArchiveBoxIcon, current: false },
  { name: 'Dificultad', href: '#', icon: ArchiveBoxIcon, current: false },
  { name: 'Cuentas', href: '#', icon: ArchiveBoxIcon, current: false }
]

function Page() {
  const methods = useForm()

  const user = useAuthStore(state => state.user)
  const getProfile = useAuthStore(state => state.getProfile)

  const [tableData, setTableData] = useState<IProfileTableItem[]>([])
  const [mode, setMode] = useState(AllTabs.EXERCISES)
  const getNews = useNewsStore.getState().getNews
  const getExercises = useExcerciseStore.getState().getExerciseList
  const getNotes = useNoteStore.getState().getList
  const getCategories = useUtilsStore.getState().getCategories
  const getTags = useUtilsStore.getState().getTags
  const getTime = useUtilsStore.getState().getTimeLimit
  const getMemory = useUtilsStore.getState().getMemoryLimit
  const getDifficulty = useUtilsStore.getState().getDifficulties
  const getUsers = useAuthStore.getState().getUsers
  const getReports = useUtilsStore.getState().getReports
  const getPendingTickets = useUtilsStore.getState().getPendingTickets

  const handleChange = useCallback(
    async (data: string) => {
      const tab = data
      switch (tab) {
        case AllTabs.EXERCISES:
          const exercises: Exercise[] = await getExercises([], '', '')
          const mappedExercises: IProfileTableItem[] = exercises.map((exercise, index) => {
            return { title: exercise.title, index, id: exercise.id }
          })
          setTableData(mappedExercises)
          setMode(AllTabs.EXERCISES)
          break
        case AllTabs.NOTES:
          const notes: Note[] = await getNotes([], '')
          const mappedNotes = notes.map((note, index) => {
            return { index, ...note }
          })
          setTableData(mappedNotes)
          setMode(AllTabs.NOTES)
          break
        case AllTabs.NEWS:
          const news: News[] = await getNews()
          const mappedNews = news.map((newsArticle, index) => {
            return { index, title: newsArticle.title, id: newsArticle.id }
          })
          setTableData(mappedNews)
          setMode(AllTabs.NEWS)
          break
        case AllTabs.REPORTS:
          const reports: Report[] = await getReports()
          const mappedReports = reports.map((report, index) => {
            return { index, title: report.summary, id: report.id }
          })
          setTableData(mappedReports)
          setMode(AllTabs.REPORTS)
          break
        case AllTabs.CHANGES:
          const tickets: Ticket[] = await getPendingTickets()
          const mappedTickets = tickets.map((ticket, index) => {
            return { index, title: ticket.commentId.body, id: ticket.id }
          })
          setTableData(mappedTickets)
          setMode(AllTabs.CHANGES)
          break
        case AllTabs.CATEGORIES:
          const categories: Categories[] = await getCategories()
          const mappedCategories = categories.map((category, index) => {
            return { index: index, title: category.name, id: category.id }
          })
          setTableData(mappedCategories)
          setMode(AllTabs.CATEGORIES)
          break
        case AllTabs.TAGS:
          const tags: Tags[] = await getTags()
          const mappedTags = tags.map((tag, index) => {
            return { index, title: tag.name, id: tag.id, color: tag.color, tagName: tag.name }
          })
          setTableData(mappedTags)
          setMode(AllTabs.TAGS)
          break
        case AllTabs.TIME:
          const time: TimeLimit[] = await getTime()
          const mappedTime = time.map((time, index) => {
            return { index, title: `${time.timeLimit.toString()} seg.`, id: time.id }
          })
          setTableData(mappedTime)
          setMode(AllTabs.TIME)
          break
        case AllTabs.MEMORY:
          const memory: MemoryLimit[] = await getMemory()
          const mappedMemory = memory.map((memory, index) => {
            return { index, title: `${memory.memoryLimit.toString()} KB.`, id: memory.id }
          })
          setTableData(mappedMemory)
          setMode(AllTabs.MEMORY)
          break
        case AllTabs.DIFFICULTY:
          const difficulty: Difficulties[] = await getDifficulty()
          const mappedDifficulty = difficulty.map((difficulty, index) => {
            return { index, title: difficulty.name, id: difficulty.id }
          })
          setTableData(mappedDifficulty)
          setMode(AllTabs.DIFFICULTY)
          break
        case AllTabs.ACCOUNT:
          const account: IUser[] = await getUsers()
          const mappedAccount = account.map((account, index) => {
            return { index, title: account.userName, id: account.id }
          })
          setTableData(mappedAccount)
          setMode(AllTabs.ACCOUNT)
          break
      }
    },
    [getCategories, getDifficulty, getExercises, getMemory, getNews, getNotes, getTags, getTime, getUsers, getReports, getPendingTickets]
  )

  useEffect(() => {
    getProfile()
    handleChange(mode)
  }, [getProfile, handleChange, mode])

  return (
    <div>
      <div className=''>
        <main className='mt-14'>
          <div className='divide-y divide-white/5'>
            <div className='grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8'>
              <div>
                <h2 className='text-base font-semibold leading-7 dark:text-white'>Información personal</h2>
                <p className='mt-1 text-sm leading-6 text-gray-400'>Usa tu correo institucional.</p>
              </div>

              <form className='md:col-span-2'>
                <div className='grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6'>
                  <div className='col-span-full flex items-center gap-x-8'>
                    <img
                      // eslint-disable-next-line max-len
                      src='https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
                      alt=''
                      className='h-24 w-24 flex-none rounded-lg bg-gray-800 object-cover'
                    />
                    <div>
                      <ButtonComponent
                        text='Cambiar foto de perfil'
                        buttonType='button_outline'
                        icon={false}
                      />
                      <p className='mt-2 text-xs leading-5 text-gray-400'>JPG, GIF or PNG. 1MB max.</p>
                    </div>
                  </div>

                  <div className='sm:col-span-3'>
                    <div className='mt-2'>
                      <TextFieldComponent
                        id='first-name'
                        fieldName='first-name'
                        labelText='Nombre'
                        register={methods.register}
                        necessary={false}
                        type='text'
                        placeholder={user?.name}
                      />
                    </div>
                  </div>

                  <div className='sm:col-span-3'>
                    <div className='mt-2'>
                      <TextFieldComponent
                        id='last-name'
                        fieldName='last-name'
                        labelText='Apellidos'
                        register={methods.register}
                        necessary={false}
                        type='text'
                        placeholder={user?.lastName}
                      />
                    </div>
                  </div>

                  <div className='col-span-full'>
                    <div className='mt-2'>
                      <TextFieldComponent
                        id='email'
                        fieldName='email'
                        labelText='Correo Electrónico'
                        register={methods.register}
                        necessary={false}
                        type='email'
                        placeholder={user?.email}
                      />
                    </div>
                  </div>

                  <div className='col-span-full'>
                    <div className='mt-2'>
                      <TextFieldComponent
                        id='user-name'
                        fieldName='user-name'
                        labelText='Nombre de usuario'
                        register={methods.register}
                        necessary={false}
                        type='text'
                        placeholder={user?.userName}
                      />
                    </div>
                  </div>
                </div>

                <div className='mt-8 flex'>
                  <ButtonComponent
                    text='Guardar'
                    buttonType='button'
                    icon={false}
                  />
                </div>
              </form>
            </div>
            <div className='mx-10'>
              <TabComponent
                myTabs={myTabs}
                adminTabs={adminTabs}
                handleChange={handleChange}
                isAdmin={user?.role === 'admin'}
              />
            </div>
            <div className='mx-10'>
              <ProfileTableComponent
                data={tableData}
                itemType={mode}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Page
