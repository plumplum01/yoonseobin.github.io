import { AnimatePresence, motion } from 'framer-motion'

interface Props {
  message: string
  visible: boolean
}

export default function Toast({ message, visible }: Props) {
  return (
    <AnimatePresence>
      {visible && (
        <div
          style={{
            position: 'fixed',
            bottom: '56px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 150,
            pointerEvents: 'none',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.3 } }}
            exit={{ opacity: 0, y: 6, transition: { duration: 0.3 } }}
            style={{
              background: '#2c2c2c',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '999px',
              padding: '14px 28px',
              fontSize: '15px',
              color: 'rgba(255,255,255,0.75)',
              letterSpacing: '0.01em',
              whiteSpace: 'nowrap',
            }}
          >
            {message}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
