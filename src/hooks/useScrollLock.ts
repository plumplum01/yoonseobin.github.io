import { useCallback, useEffect, useRef } from 'react'

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

  const lock = useCallback(() => {
    if (!locked.current) {
      locked.current = true
      applyLock()
    }
  }, [])

  const unlock = useCallback(() => {
    if (locked.current) {
      locked.current = false
      releaseLock()
    }
  }, [])

  return { lock, unlock }
}
