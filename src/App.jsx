import { useRef } from 'react'
import Hero from './components/Hero'
import Zone from './components/Zone'
import ScrollNav from './components/ScrollNav'
import { motion } from 'framer-motion'
import { Github, Linkedin, Mail } from 'lucide-react'

function ProjectCard({ title, tech, desc }) {
  return (
    <motion.div whileHover={{ y: -6 }} className="rounded-xl border bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
      <h4 className="font-semibold text-gray-900">{title}</h4>
      <p className="text-sm text-gray-600 mt-1">{desc}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {tech.map((t) => (
          <span key={t} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">{t}</span>
        ))}
      </div>
    </motion.div>
  )
}

export default function App() {
  const startRef = useRef(null)

  const handleStart = () => {
    const el = document.getElementById('projects')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen w-full text-gray-900">
      <ScrollNav />

      {/* Entry with Spline asset and CTA */}
      <Hero onStart={handleStart} />

      {/* Zone 1: Projects Wall */}
      <Zone id="projects" title="Projects" subtitle="Hover a frame to reveal details" bg="bg-gradient-to-b from-white to-blue-50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ProjectCard title="Realtime Dashboard" tech={["React","WebSocket","Tailwind"]} desc="Streaming KPIs and alerts with smooth transitions." />
          <ProjectCard title="3D Playground" tech={["Three.js","GLTF","Shader"]} desc="Interactive scenes with custom materials and LOD." />
          <ProjectCard title="AI Notes" tech={["FastAPI","Pinecone","OpenAI"]} desc="Semantic search and summarization for teams." />
        </div>
      </Zone>

      {/* Zone 2: About Me (Computer Desk) */}
      <Zone id="about" title="About Me" subtitle="Milestones and a quick timeline" bg="bg-white">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-gray-50">
              <p className="text-sm text-gray-600">2016 → First production app shipped</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50">
              <p className="text-sm text-gray-600">2019 → Led migration to a scalable micro FE stack</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50">
              <p className="text-sm text-gray-600">2022 → Launched immersive 3D portfolio concept</p>
            </div>
          </div>
          <div className="aspect-video rounded-xl border bg-black/90 text-white p-6">
            <p className="text-lg">Desk PC</p>
            <p className="text-sm text-white/70 mt-2">Screen would show timeline and a mini gallery in the full build.</p>
          </div>
        </div>
      </Zone>

      {/* Zone 3: Skills (Bookshelf) */}
      <Zone id="skills" title="Skills" subtitle="Levels shown as rising elements" bg="bg-gradient-to-b from-blue-50 to-purple-50">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[['React',90],['Three.js',70],['FastAPI',80],['Tailwind',85],['Framer Motion',88],['MongoDB',75],['WebGL',65],['CI/CD',72]].map(([name, level]) => (
            <div key={name} className="p-4 rounded-lg bg-white shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{name}</span>
                <span className="text-sm text-gray-500">{level}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded">
                <motion.div initial={{ width: 0 }} whileInView={{ width: `${level}%` }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="h-2 rounded bg-gradient-to-r from-blue-600 to-purple-600" />
              </div>
            </div>
          ))}
        </div>
      </Zone>

      {/* Zone 4: Hobbies & Games (Coffee Table with Mobile) */}
      <Zone id="hobbies" title="Hobbies & Games" subtitle="Scroll to activate playful cards" bg="bg-white">
        <div className="grid md:grid-cols-3 gap-6">
          {[{t:'Photography',d:'Street & landscapes'},{t:'Indie Games',d:'Puzzle + platformers'},{t:'Cycling',d:'Long weekend rides'}].map((c) => (
            <motion.div key={c.t} whileHover={{ rotate: -1, scale: 1.02 }} className="p-6 rounded-xl border bg-white shadow-sm">
              <h4 className="font-semibold">{c.t}</h4>
              <p className="text-sm text-gray-600 mt-1">{c.d}</p>
            </motion.div>
          ))}
        </div>
      </Zone>

      {/* Zone 5: Contact (Bathroom slip) */}
      <Zone id="contact" title="Reach Me Out Quickly!" subtitle="Say hi on any of these" bg="bg-gradient-to-b from-purple-50 to-white">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-lg">Let’s build something memorable.</p>
            <div className="mt-4 flex items-center gap-3">
              <a href="https://github.com" target="_blank" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-900 text-white hover:bg-gray-800"><Github size={18}/>GitHub</a>
              <a href="https://linkedin.com" target="_blank" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-500"><Linkedin size={18}/>LinkedIn</a>
              <a href="mailto:hello@example.com" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-600 text-white hover:bg-pink-500"><Mail size={18}/>Email</a>
            </div>
          </div>
          <motion.div initial={{ rotate: 0 }} whileInView={{ rotate: [0, 2, -2, 0] }} transition={{ duration: 1.2 }} className="w-full md:w-1/2 aspect-video rounded-xl bg-white border shadow-sm flex items-center justify-center">
            <p className="text-gray-600">Slip-and-fall gag transitions here in full build</p>
          </motion.div>
        </div>
      </Zone>
    </div>
  )
}
