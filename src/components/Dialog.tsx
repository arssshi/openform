import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'

interface Props { children: ReactNode; onClose: () => void; label: string; className?: string }

export default function Dialog({ children, onClose, label, className = '' }: Props) {
  const ref = useRef<HTMLDialogElement>(null)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose
  const reduce = useReducedMotion()
  useEffect(() => {
    const dialog = ref.current!
    const previous = document.activeElement as HTMLElement | null
    const overflow = document.body.style.overflow
    if (!dialog.open) dialog.showModal()
    document.body.style.overflow = 'hidden'
    const handleCancel = (event: Event) => { event.preventDefault(); onCloseRef.current() }
    dialog.addEventListener('cancel', handleCancel)
    return () => {
      dialog.removeEventListener('cancel', handleCancel)
      dialog.close()
      document.body.style.overflow = overflow
      if (previous?.isConnected) previous.focus({ preventScroll: true })
    }
  }, [])

  return createPortal(
    <dialog ref={ref} aria-label={label} className={`dialog ${className}`} onClick={event => { if (event.target === ref.current) onClose() }}>
      <motion.div className="dialog-inner" initial={{ opacity: 0, transform: reduce ? 'none' : 'translateY(14px)' }} animate={{ opacity: 1, transform: reduce ? 'none' : 'translateY(0px)' }} transition={{ type: 'spring', visualDuration: .25, bounce: .1 }}>
        <button className="dialog-close icon-button" onClick={onClose} aria-label={`Close ${label}`}><X size={21} /></button>
        {children}
      </motion.div>
    </dialog>, document.body,
  )
}
