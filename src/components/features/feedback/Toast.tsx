import { AnimatePresence, motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface Props {
  message: string
  visible: boolean
  icon?: ReactNode
}

export default function Toast({ message, visible, icon }: Props) {
  return (
    <AnimatePresence>
      {visible && (
        <div className="pointer-events-none fixed bottom-14 left-1/2 z-[150] -translate-x-1/2">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.3 } }}
            exit={{ opacity: 0, y: 6, transition: { duration: 0.3 } }}
            className="flex items-center gap-[13px] whitespace-nowrap rounded-lg border-[0.5px] border-[rgba(162,162,162,0.4)] bg-[#4a4a49] px-6 py-3.5 pl-5 text-[16px] font-medium leading-base text-white"
          >
            {icon && (
              <div className="flex shrink-0 items-center justify-center text-[18px] leading-none text-white">
                {icon}
              </div>
            )}
            {message}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
