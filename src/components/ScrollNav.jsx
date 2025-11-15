import { useEffect, useState } from 'react'
import { Circle, CircleDot } from 'lucide-react'

const sections = [
  'entry',
  'projects',
  'about',
  'skills',
  'hobbies',
  'contact'
]

export default function ScrollNav() {
  const [active, setActive] = useState('entry')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id)
          }
        })
      },
      { root: null, rootMargin: '0px', threshold: 0.5 }
    )

    sections.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="fixed right-5 top-1/2 -translate-y-1/2 z-30 hidden md:flex flex-col gap-3">
      {sections.map((id) => (
        <button key={id} onClick={() => scrollTo(id)} className="p-1 text-gray-600 hover:text-blue-600">
          {active === id ? <CircleDot size={18} /> : <Circle size={18} />}
        </button>
      ))}
    </div>
  )
}
