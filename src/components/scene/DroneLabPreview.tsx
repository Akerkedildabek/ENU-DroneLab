import { Suspense, useEffect, useRef, useState } from 'react'
import type { ComponentRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { DroneModel } from './DroneModel'
import { RotateCcw, Move3D, Gauge, Play, Pause } from 'lucide-react'
import { useIntersection } from '../../hooks/useIntersection'
import { useMotionPreferences } from '../../hooks/useMotionPreferences'

export function DroneLabPreview() {
  const [rotorSpeed, setRotorSpeed] = useState(55)
  const [running, setRunning] = useState(true)
  const [webgl, setWebgl] = useState(true)
  const controlRef = useRef<ComponentRef<typeof OrbitControls>>(null)
  const { ref, visible } = useIntersection<HTMLDivElement>(.04)
  const reduced = useMotionPreferences()
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas')
      setWebgl(!!(canvas.getContext('webgl2') || canvas.getContext('webgl')))
    } catch { setWebgl(false) }
  }, [])
  const active = running && visible && !reduced
  const resetCamera = () => controlRef.current?.reset()
  return (
    <div className="lab-demo" ref={ref}>
      <div className="lab-viewport">
        <div className="lab-float-label"><span className="pulsing-dot" /> INTERACTIVE MODEL · 01</div>
        {webgl ? (
          <Suspense fallback={<div className="viewer-loading">3D модель жүктелуде...</div>}>
            <Canvas dpr={[1, 1.7]} frameloop={visible && !reduced ? 'always' : 'demand'}
              camera={{ position: [4.5, 3.3, 5.8], fov: 43 }}
              gl={{ antialias: true, alpha: true }} style={{ background: 'transparent' }}>
              <ambientLight intensity={1.7} />
              <directionalLight position={[4, 7, 5]} intensity={3} />
              <directionalLight position={[-4, 2, -3]} intensity={2.2} color="#d2e9f6" />
              <gridHelper args={[10, 15, '#d7e9f3', '#eef4f9']} position={[0, -1.35, 0]} />
              <DroneModel position={[0, .12, 0]} scale={1} animatePropellers={active} propellerSpeed={rotorSpeed / 2.1} />
              <OrbitControls ref={controlRef} enablePan={false} enableDamping dampingFactor={.07}
                minDistance={4.1} maxDistance={11} minPolarAngle={.2} maxPolarAngle={Math.PI * .76} />
            </Canvas>
          </Suspense>
        ) : <div className="viewer-loading">Бұл құрылғыда WebGL қолжетімсіз.</div>}
        <div className="lab-viewport-caption"><Move3D size={14} /> Модельді айналдыру үшін тінтуірмен сүйреңіз</div>
      </div>
      <div className="lab-sidebar">
        <div className="lab-sidebar-kicker">ВИРТУАЛДЫ ЗЕРТХАНА</div>
        <h3>Квадрокоптердің 3D құрылысы</h3>
        <p>Модельді айналдырып зерттеңіз. Винттердің жұмысын бақылап, айналу жылдамдығын өзгертіңіз.</p>
        <div className="lab-param-header"><span><Gauge size={17} /> Винт жылдамдығы</span><strong>{rotorSpeed}%</strong></div>
        <input aria-label="Винттердің айналу жылдамдығы" className="lab-range" type="range" min="0" max="100"
          value={rotorSpeed} onChange={(event) => setRotorSpeed(Number(event.target.value))} />
        <div className="lab-ends"><span>0%</span><span>100%</span></div>
        <div className="lab-actions">
          <button className="lab-run" type="button" onClick={() => setRunning(!running)}>
            {running ? <Pause size={16} /> : <Play size={16} />}{running ? 'Тоқтату' : 'Жалғастыру'}
          </button>
          <button className="lab-reset" type="button" onClick={resetCamera}><RotateCcw size={16} /> Бастапқы көрініс</button>
        </div>
        <div className="lab-notice">Оқу демонстрациясы. Бұл модель нақты ұшу физикасын есептемейді.</div>
      </div>
    </div>
  )
}
