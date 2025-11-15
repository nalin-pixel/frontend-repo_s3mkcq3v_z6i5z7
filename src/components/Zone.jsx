import { motion } from 'framer-motion'

export default function Zone({ id, title, subtitle, children, bg = 'bg-white' }) {
  return (
    <section id={id} className={`${bg} min-h-screen w-full flex items-center justify-center py-24 px-6`}>
      <div className="max-w-6xl w-full">
        <div className="mb-10 text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900">{title}</h2>
          {subtitle && <p className="mt-3 text-gray-600">{subtitle}</p>}
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6 }}>
          {children}
        </motion.div>
      </div>
    </section>
  )
}
