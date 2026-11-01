import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, ArrowUpRight } from 'lucide-react'

const menu = [
  { id: 'home', label: 'Басты бет' },
  { id: 'lectures', label: 'Дәрістер' },
  { id: 'contact', label: 'Байланыс' },
]
export function Header() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const go = (id: string) => {
    setOpen(false)
    if (location.pathname !== '/') {
      navigate(`/?section=${id}`)
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }
  return (
    <header className="site-header">
      <div className="container header-inner">
        <button type="button" onClick={() => go('home')} className="brand" aria-label="ENU DroneLab — басты бет">
          <span className="brand-emblem"><span className="emblem-cross">✦</span></span>
          <span className="brand-label"><strong>ENU <em>DroneLab</em></strong><small>UAS EDUCATION PLATFORM</small></span>
        </button>
        <nav className={`site-nav ${open ? 'nav-open' : ''}`} aria-label="Негізгі навигация">
          {menu.map(item => <button key={item.id} type="button" onClick={() => go(item.id)}>{item.label}</button>)}
          <button type="button" className="nav-cta" onClick={() => go('lectures')}>Оқуды бастау <ArrowUpRight size={16} /></button>
        </nav>
        <button className="menu-toggle" type="button" aria-label={open ? 'Мәзірді жабу' : 'Мәзірді ашу'}
          aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X size={23} /> : <Menu size={23} />}</button>
      </div>
    </header>
  )
}
