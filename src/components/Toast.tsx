import { AnimatePresence, motion } from 'framer-motion'
import type { ReactNode } from 'react'
import styles from './Toast.module.css'

interface Props {
  message: string
  visible: boolean
  icon?: ReactNode
}

export default function Toast({ message, visible, icon }: Props) {
  return (
    <AnimatePresence>
      {visible && (
        <div className={styles.wrapper}>
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.3 } }}
            exit={{ opacity: 0, y: 6, transition: { duration: 0.3 } }}
            className={styles.pill}
          >
            {icon && <div className={styles.icon}>{icon}</div>}
            {message}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
