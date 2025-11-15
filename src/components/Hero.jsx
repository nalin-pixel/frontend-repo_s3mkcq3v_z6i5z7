import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BellRing } from 'lucide-react'
import ThreeHouse from './ThreeHouse'

export default function Hero({ onStart }) {
  const [loaded, setLoaded] = useState(false)
  const [assembling, setAssembling] = useState(true)
  const timeoutRef = useRef(null)

  useEffect(() => {
    // Simulate a 3s house assembly, then reveal CTA
    timeoutRef.current = setTimeout(() => {
      setAssembling(false)
    }, 3000)
    return () => clearTimeout(timeoutRef.current)
  }, [])

  return (
    <section id="entry" className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0">
        <ThreeHouse onLoaded={() => setLoaded(true)} />
      </div>

      {/* Overlay gradient and copy */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/30 to-white/60 pointer-events-none" />

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.8 }} className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900">
          3D Interactive House Portfolio
        </motion.h1>
        <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4, duration: 0.8 }} className="mt-4 max-w-2xl text-gray-700">
          Scroll through a playful, modern home where each room highlights a different part of the story.
        </motion.p>

        <AnimatePresence>
          {loaded && !assembling && (
            <motion.button
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={onStart}
              className="group mt-10 inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-white shadow-lg shadow-blue-600/30 focus:outline-none focus:ring-4 focus:ring-blue-300"
            >
              <BellRing className="h-5 w-5" />
              Click the Doorbell
              <span className="ml-1 transition-opacity opacity-0 group-hover:opacity-100">→</span>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Loading hint */}
        {!loaded && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 text-sm text-gray-600">
            Loading the house...
          </motion.div>
        )}
      </div>
    </section>
  )
}
