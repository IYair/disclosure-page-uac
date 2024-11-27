import CreateExcerciseComponent from '../components/modals/CreateExcerciseComponent'
import CreateNewsComponent from '../components/modals/CreateNewsComponent'
import CreateNoteComponent from '../components/modals/CreateNoteComponent'
import CreateCategoryComponent from '../components/modals/CreateCategoryComponent'
import CreateDifficultyComponent from '../components/modals/CreateDifficultyComponent'
import CreateMemoryComponent from '../components/modals/CreateMemoryComponent'
import CreateTagComponent from '../components/modals/CreateTagComponent'
import CreateTimeLimitComponent from '../components/modals/CreateTimeComponent'

export default function Home() {
  return (
    <>
      <CreateNewsComponent />
      <CreateNoteComponent />
      <CreateExcerciseComponent />

      <CreateCategoryComponent />
      <CreateDifficultyComponent />
      <CreateMemoryComponent />
      <CreateTagComponent />
      <CreateTimeLimitComponent />
    </>
  )
}

