import { useEffect, useRef } from 'react'

let lockCount = 0

function applyLock() {
  lockCount++
  document.body.style.overflow = 'hidden'
}

function releaseLock() {
  lockCount = Math.max(0, lockCount - 1)
  if (lockCount === 0) {
    document.body.style.overflow = ''
  }
}

export function useScrollLock() {
  const locked = useRef(false)

  useEffect(() => {
    return () => {
      if (locked.current) {
        releaseLock()
        locked.current = false
      }
    }
  }, [])

  return {
    lock() {
      if (!locked.current) {
        locked.current = true
        applyLock()
      }
    },
    unlock() {
      if (locked.current) {
        locked.current = false
        releaseLock()
      }
    },
  }
}
