import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight, BookOpen, CircleCheck, Clock3, Compass, Cpu, FileCheck2, Globe2, Map, Plane, Radar, Scale, Shield, ShieldCheck, UsersRound, Gamepad2 } from 'lucide-react'
import type { Lecture } from '../../types/lecture'
import { hasMaterials } from '../../lib/assets'

const icons = {
  drone: Plane, scale: Scale, globe: Globe2, 'file-check': FileCheck2,
  map: Map, brain: UsersRound, shield: Shield, 'shield-check': ShieldCheck,
  clipboard: CircleCheck, gamepad: Gamepad2,
}
export function LectureCard({ lecture, index }: { lecture: Lecture; index: number }) {
  const Icon = icons[lecture.icon as keyof typeof icons] || BookOpen
  const ready = hasMaterials(lecture.materials)
  return (
    <motion.article initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .12 }}
      transition={{ duration: .44, delay: (index % 5) * .065 }} className="lecture-card">
      <Link className="lecture-card-link" to={`/lecture/${lecture.id}`} aria-label={`${lecture.number}-дәрісті ашу: ${lecture.title}`}>
        <div className="lecture-top"><span className="lecture-index">{String(lecture.number).padStart(2,'0')}</span><span className="lecture-icon"><Icon size={26} strokeWidth={1.65}/></span></div>
        <span className="lecture-overline">{lecture.number}-ДӘРІС</span>
        <h3>{lecture.title}</h3>
        <div className="lecture-bottom"><span className={`availability ${ready ? 'available' : ''}`}>
          {ready ? <><CircleCheck size={13}/> Материал бар</> : <><Clock3 size={13}/> Әзірленуде</>}</span>
          <span className="card-arrow"><ArrowUpRight size={20}/></span>
        </div>
      </Link>
    </motion.article>
  )
}
export function SectionDecor() { return <div className="section-decor" aria-hidden="true"><Radar size={25}/><Compass size={22}/><Cpu size={21}/></div> }
