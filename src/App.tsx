import { Route, Routes } from 'react-router-dom'
import { Header } from './components/layout/Header'
import { useLectures } from './hooks/useLectures'
import { HomePage } from './pages/HomePage'
import { LecturePage } from './pages/LecturePage'
import { AlertCircle, LoaderCircle } from 'lucide-react'

export default function App() {
  const { data, loading, error } = useLectures()
  if (loading) return <div className="app-loading"><span className="brand-mini">IDSAI <b>Drone Center</b></span><LoaderCircle className="spinning" size={25}/><p>Оқу платформасы ашылуда...</p></div>
  if (!data || error) return <div className="app-loading"><AlertCircle size={29}/><h2>Оқу материалдарын жүктеу мүмкін болмады</h2>
    <p>{error || 'Мәліметтер файлы табылмады.'}</p><p>public/data/lectures.json файлын және сайттың BASE_URL параметрін тексеріңіз.</p></div>
  return <><Header/><Routes><Route path="/" element={<HomePage database={data}/>}/>
    <Route path="/lecture/:id" element={<LecturePage database={data}/>}/>
    <Route path="*" element={<HomePage database={data}/>}/></Routes></>
}
