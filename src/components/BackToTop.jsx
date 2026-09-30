import { useEffect, useState } from 'react'
import { Icon } from './ui.jsx'

export default function BackToTop({ color = 'bg-[#e02f12]' }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      className={`fixed bottom-4 right-5 z-40 grid h-[30px] w-[30px] place-items-center rounded-[3px] text-white transition-opacity ${color} ${
        show ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      <Icon.chevronUp className="h-3.5 w-3.5" />
    </button>
  )
}
