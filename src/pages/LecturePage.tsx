import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowUpRight, BookOpen, CheckCircle2, ClipboardList, FileText, Layers3 } from 'lucide-react'
import type { LectureDatabase } from '../types/lecture'
import { MaterialSection } from '../components/viewers/MaterialSections'
import { DroneLabPreview } from '../components/scene/DroneLabPreview'
import { hasMaterials } from '../lib/assets'

export function LecturePage({ database }: { database: LectureDatabase }) {
  const { id } = useParams<{ id: string }>()
  const lecture = database.lectures.find((item) => item.id === id)
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'auto' }) }, [id])
  if (!lecture) return <main className="not-found container"><h1>Дәріс табылмады</h1><Link to="/?section=lectures"><ArrowLeft size={16} /> Барлық дәрістерге қайту</Link></main>
  const ready = hasMaterials(lecture.materials)
  const sections = lecture.materials
  return <main className="lecture-page">
    <div className="container lecture-breadcrumb"><Link to="/?section=lectures"><ArrowLeft size={16}/> Дәрістер тізімі</Link><span>/</span><span>{String(lecture.number).padStart(2,'0')}-дәріс</span></div>
    <div className="lecture-header-area"><div className="container lecture-header-grid">
      <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:.5}}>
        <div className="section-eyebrow"><span className="small-dash"/> {String(lecture.number).padStart(2,'0')} / {String(database.lectures.length).padStart(2,'0')} · ОҚУ МОДУЛІ</div>
        <h1>{lecture.title}</h1><p>{lecture.introduction}</p>
        <div className="lecture-header-tags"><span><BookOpen size={16}/> {lecture.number}-дәріс</span><span className={ready ? 'tag-ready' : ''}><Layers3 size={15}/>{ready ? 'Материалдар жарияланған' : 'Материалдар толықтырылады'}</span></div>
      </motion.div>
      <div className="lecture-hero-mark" aria-hidden="true"><div className="lecture-mark-ring"><span>{String(lecture.number).padStart(2,'0')}</span></div><small>IDSAI · DRONE CENTER</small></div>
    </div></div>
    <div className="container lecture-content-container">
      <div className="lecture-overview-grid">
        <section className="overview-card"><div className="overview-icon"><ClipboardList size={21}/></div><h2>Дәріс мазмұны</h2><ul className="topic-list">{lecture.topics.map((topic,i) => <li key={i}><span>{String(i+1).padStart(2,'0')}</span>{topic}</li>)}</ul></section>
        <section className="overview-card"><div className="overview-icon"><CheckCircle2 size={21}/></div><h2>Оқу нәтижелері</h2><ul className="outcome-list">{lecture.outcomes.map((outcome,i) => <li key={i}><CheckCircle2 size={17}/>{outcome}</li>)}</ul></section>
      </div>
      <MaterialSection title="Презентация" subtitle="Дәріс слайдтары және теориялық материалдар" kind="presentations" materials={sections.presentations}/>
      <MaterialSection title="Бейнематериалдар" subtitle="Оқыту видеолары және YouTube дәрістері" kind="videos" materials={sections.videos}/>
      <MaterialSection title="Интерактивті 3D материалдар" subtitle="Виртуалды модельдер мен зерттеу ортасы" kind="models" materials={sections.models}>
        {lecture.number === 1 ? <DroneLabPreview /> : undefined}
      </MaterialSection>
      <MaterialSection title="Виртуалды турлар" subtitle="Үшөлшемді кеңістіктер мен онлайн симуляторлар" kind="virtualTours" materials={sections.virtualTours}/>
      <MaterialSection title="Практикалық тапсырмалар" subtitle="Зертханалық және өздік жұмыс материалдары" kind="practices" materials={sections.practices}/>
      <MaterialSection title="Қосымша ресурстар" subtitle="Әдебиеттер, сілтемелер және анықтамалықтар" kind="additional" materials={sections.additional}/>
      <div className="lecture-page-end"><div><FileText size={21}/><span>Оқу материалдары жаңартылған сайын осы бетте пайда болады.</span></div>
        <Link to="/?section=lectures">Дәрістерге қайту <ArrowUpRight size={17}/></Link>
      </div>
    </div>
  </main>
}
