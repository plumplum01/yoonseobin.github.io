import { AnimatePresence, motion } from 'framer-motion'
import styles from './Toast.module.css'

interface Props {
  message: string
  visible: boolean
}

export default function Toast({ message, visible }: Props) {
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
            {message}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
