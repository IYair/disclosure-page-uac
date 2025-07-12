'use client'
import { useEffect } from 'react'
import useAuthStore from '@/store/useStore'
import useExcerciseStore from '@/store/useExcerciseStore'
import useNoteStore from '@/store/useNoteStore'

/*
Input: An item id, and an item type string ('exercise' or 'note')
Output: An object with properties for the HeartbeatComponent
Return value: An object with the properties of the HeartbeatComponent
Function: To describe the properties (required and optional) of the HeartbeatComponent
Variables: itemId, itemType
Date: 28 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/

interface HeartbeatComponentProps {
  itemId: string
  itemType: 'exercise' | 'note'
}

/*
Input: An object with properties described in the HeartbeatComponentProps interface, see above
Output: A React component that sends a heartbeat signal every 5 minutes 
Return value: A React Node
Function: To send a signal and log if the user has seen an item for more than 30 seconds and every 5 minutes
Variables: itemId, itemType, isLoggedIn, logExercise, logNote
Date: 28 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/

export default function HeartbeatComponent({ itemId, itemType }: Readonly<HeartbeatComponentProps>) {
  const isLoggedIn = useAuthStore(state => state.isLogged)
  const logExercise = useExcerciseStore(state => state.log)
  const logNote = useNoteStore(state => state.log)

  // Effect to send heartbeat
  useEffect(() => {
    let intervalId: NodeJS.Timeout
    const sendHeartbeat = () => {
      // Log the item if the user is not logged in
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
      sendHeartbeat()
      intervalId = setInterval(sendHeartbeat, 300000) // 5 min
    }, 30000)
    return () => {
      clearTimeout(timeoutId)
      if (intervalId) clearInterval(intervalId)
    }
  }, [])
  return null
}
