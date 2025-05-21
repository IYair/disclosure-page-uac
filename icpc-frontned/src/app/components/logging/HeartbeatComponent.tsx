'use client'
import { useEffect } from 'react'
import useAuthStore from '@/store/useStore'
import useExcerciseStore from '@/store/useExcerciseStore'
import useNoteStore from '@/store/useNoteStore'

interface HeartbeatComponentProps {
  itemId: string
  itemType: 'exercise' | 'note'
}

export default function HeartbeatComponent({ itemId, itemType }: Readonly<HeartbeatComponentProps>) {
  const isLoggedIn = useAuthStore(state => state.isLogged)
  const logExercise = useExcerciseStore(state => state.log)
  const logNote = useNoteStore(state => state.log)
  useEffect(() => {
    let intervalId: NodeJS.Timeout
    const sendHeartbeat = () => {
      if (!isLoggedIn) {
        if (itemType === 'exercise') {
          logExercise(itemId)
        } else if (itemType === 'note') {
          logNote(itemId)
        }
      }
    }
    // Start after 30 seconds
    const timeoutId = setTimeout(() => {
      sendHeartbeat() // Optionally send once at 30s
      intervalId = setInterval(sendHeartbeat, 300000) // 5 min
    }, 30000)
    return () => {
      clearTimeout(timeoutId)
      if (intervalId) clearInterval(intervalId)
    }
  }, [])
  return null
}
