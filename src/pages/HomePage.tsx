import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowDown, ArrowRight, ArrowUpRight, BookOpenText, GraduationCap, Layers3, MapPin, Mail, MoveUpRight, RadioTower, ShieldCheck } from 'lucide-react'
import type { LectureDatabase } from '../types/lecture'
import { HeroDroneScene } from '../components/scene/HeroDroneScene'
import { LectureCard } from '../components/lectures/LectureCard'

export function HomePage({ database }: { database: LectureDatabase }) {
  const location = useLocation()
  useEffect(() => {
    const section = new URLSearchParams(location.search).get('section')
    if (section && ['home', 'lectures', 'contact'].includes(section)) {
      const raf = requestAnimationFrame(() => document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' }))
      return () => cancelAnimationFrame(raf)
    }
  }, [location.search])
  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  return <main>
    <section id="home" className="hero-section">
      <div className="hero-bubble bubble-a" aria-hidden="true" />
      <div className="hero-bubble bubble-b" aria-hidden="true" />
      <div className="container hero-grid">
        <motion.div className="hero-copy" initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .75 }}>
          <div className="eyebrow"><span className="eyebrow-line" /> </div>
          <div className="hero-kicker"><span className="kicker-icon"><GraduationCap size={15} /></span> Пилотсыз авиациялық жүйелер операторы (1-санат)</div>
          <h1><span>ENU</span><br/><span className="heading-accent">DroneLab</span><span className="heading-period">.</span></h1>
          <h2>Пилотсыз авиациялық жүйелерді оқыту</h2>
          <p>Дрондардың құрылысын зерттеңіз, ұшу қағидаларын меңгеріңіз және интерактивті ортада практикалық дағдыларыңызды дамытыңыз.</p>
          <div className="hero-actions"><button className="primary-button" type="button" onClick={() => go('lectures')}>Дәрістерді қарау <ArrowUpRight size={19} /></button>
            <span className="hero-microcopy"><span className="micro-icon"><Layers3 size={17}/></span> 10 оқу модулі</span>
          </div>
          <div className="hero-meta"><span><span className="status-light" /> </span><i />
            <span></span></div>
        </motion.div>
        <motion.div className="hero-visual" initial={{ opacity: 0, scale: .94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: .15 }}>
          <div className="hero-topography" aria-hidden="true" />
          <HeroDroneScene />
          <div className="hero-chip chip-top"><RadioTower size={17} /><span>FLIGHT SYSTEMS<small>UAS / QUADCOPTER</small></span></div>
          <div className="hero-chip chip-bottom"><ShieldCheck size={17} /><span>EDUCATION MODE<small>3D MODEL · LIVE</small></span></div>
        </motion.div>
      </div>
      <button onClick={() => go('lectures')} type="button" className="scroll-indicator"><span>ТӨМЕН ЖЫЛЖЫТЫҢЫЗ</span><span className="scroll-indicator-icon"><ArrowDown size={18}/></span></button>
      <div className="hero-rail" aria-hidden="true">UNMANNED AIRCRAFT SYSTEMS / 2026</div>
    </section>

    <section id="lectures" className="lectures-section">
      <div className="container">
        <div className="lectures-topline"><div className="section-eyebrow"><span className="small-dash" /> КУРС ҚҰРЫЛЫМЫ / 01—10</div><span className="section-number">01 / БІЛІМ БЕРУ</span></div>
        <div className="section-title-row"><div><h2>Оқу <span>материалдары</span></h2><p>ПАЖ операторы (1-санат) курсының дәрістері мен практикалық материалдары</p></div>
          <div className="section-title-aside"><BookOpenText size={24} /><span>10 дәріс<br/>Бір цифрлық орта</span></div>
        </div>
        <div className="lecture-grid">{database.lectures.map((lecture, index) => <LectureCard lecture={lecture} index={index} key={lecture.id} />)}</div>
        <div className="lectures-bottom-note"><span><span className="note-dot"/> Дәрістер кезең-кезеңімен толықтырылады</span><span>2026 / ENU DRONELAB <ArrowRight size={16}/></span></div>
      </div>
    </section>

    <section id="contact" className="about-section">
      <div className="container about-grid">
        <div className="about-intro"><div className="section-eyebrow"><span className="small-dash"/> БІЗ ТУРАЛЫ</div>
          <h2>Білім мен<br/><span>технология тоғысқан орта.</span></h2>
          <p>ENU DroneLab — пилотсыз авиациялық жүйелерді оқытуға арналған интерактивті цифрлық оқу платформасы.</p>
          <div className="about-badge"><MoveUpRight size={19}/> Future of UAS Education</div>
        </div>
        <div className="about-info">
          <div className="about-info-line"><span className="about-info-icon"><GraduationCap size={22}/></span><div><small>УНИВЕРСИТЕТ</small><strong>{database.university}</strong></div></div>
          <div className="about-info-line"><span className="about-info-icon"><MapPin size={21}/></span><div><small>ОРНАЛАСҚАН ЖЕРІ</small><strong>Астана, Қазақстан</strong></div></div>
          <div className="about-info-line"><span className="about-info-icon"><Mail size={21}/></span><div><small>БАЙЛАНЫС</small><a href={`mailto:${database.contactEmail}`}>{database.contactEmail}</a></div></div>
        </div>
      </div>
      <div className="container"><div className="site-footer"><strong>ENU <span>DroneLab</span></strong><span>© 2026 ENU DroneLab. Барлық құқықтар қорғалған.</span><button type="button" onClick={() => go('home')}>Жоғарыға <ArrowUpRight size={16}/></button></div></div>
    </section>
  </main>
}
