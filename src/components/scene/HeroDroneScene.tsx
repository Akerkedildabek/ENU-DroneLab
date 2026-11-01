import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { DroneModel } from './DroneModel'
import { useMotionPreferences } from '../../hooks/useMotionPreferences'
import { useIntersection } from '../../hooks/useIntersection'
import { Rotate3D, WifiOff } from 'lucide-react'

function canUseWebGL() {
  if (typeof document === 'undefined') return false
  try {
    const canvas = document.createElement('canvas')
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch { return false }
}

function FlyingDrone({ variant, active }: { variant: 'hero' | 'left' | 'right'; active: boolean }) {
  const mesh = useRef<THREE.Group>(null)
  const { pointer, viewport } = useThree()
  const offset = { hero: 0, left: 1.3, right: 3.7 }[variant]
  useFrame((state) => {
    if (!mesh.current || !active) return
    const t = state.clock.elapsedTime + offset
    const w = viewport.width
    if (variant === 'hero') {
      mesh.current.position.set(Math.sin(t * .38) * .26 + pointer.x * .09,
        Math.sin(t * .72) * .17 - .04 + pointer.y * .08, .1 + Math.cos(t * .41) * .12)
      mesh.current.rotation.set(-.045 + Math.sin(t * .48) * .055, -.19 + Math.sin(t * .30) * .16, Math.sin(t * .54) * .042)
    } else if (variant === 'left') {
      mesh.current.position.set(-Math.min(w * .37, 2.95) + Math.cos(t * .31) * .66,
        1.45 + Math.sin(t * .49) * .28, -3.4 + Math.sin(t * .27) * .30)
      mesh.current.rotation.set(-.06 + Math.cos(t * .31) * .075, Math.sin(t * .31) * .38, Math.sin(t * .31) * .10)
    } else {
      mesh.current.position.set(Math.min(w * .40, 3.2) + Math.sin(t * .35) * .57,
        -1.43 + Math.cos(t * .42) * .32, -3.0 + Math.sin(t * .19) * .25)
      mesh.current.rotation.set(-.04 + Math.cos(t * .35) * .06, -.56 + Math.sin(t * .35) * .3, -.06 + Math.cos(t * .35) * .09)
    }
  })
  return (
    <group ref={mesh}>
      <DroneModel scale={variant === 'hero' ? 1.03 : variant === 'left' ? .41 : .33}
        propellerSpeed={variant === 'hero' ? 42 : 38} animatePropellers={active}
        accent={variant === 'right' ? '#69b9db' : '#28B8D9'} />
    </group>
  )
}

function ScientificEnvironment() {
  return (
    <group>
      <gridHelper args={[15, 24, '#dbe9f2', '#edf3f8']} position={[0, -2.2, -2]} rotation={[0, 0, 0]} />
      {[2.5, 3.15, 3.8].map((radius, index) => (
        <mesh key={radius} position={[0, .08, -2.5]} rotation={[1.14 + index * .12, .21, .12]}>
          <torusGeometry args={[radius, .007, 3, 100]} />
          <meshBasicMaterial color="#b6dbe9" transparent opacity={index === 0 ? .33 : .17} depthWrite={false} />
        </mesh>
      ))}
      <mesh position={[-1.3, -1.74, -1.8]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.45, 1.49, 80]} />
        <meshBasicMaterial color="#bedfeb" transparent opacity={.34} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

function SceneContents({ active }: { active: boolean }) {
  return (
    <>
      <ambientLight intensity={2.05} />
      <hemisphereLight args={['#f8fcff', '#b2cad8', 2.3]} />
      <directionalLight position={[-3, 7, 5]} intensity={3.5} color="#ffffff" />
      <directionalLight position={[4, 1, -4]} intensity={2.5} color="#c1eaff" />
      <ScientificEnvironment />
      <FlyingDrone variant="left" active={active} />
      <FlyingDrone variant="right" active={active} />
      <FlyingDrone variant="hero" active={active} />
    </>
  )
}

function Fallback() {
  return (
    <div className="hero-3d-fallback" role="img" aria-label="3D көрсетуді қолдамайтын құрылғыға арналған дрон белгісі">
      <div className="fallback-orbit"><Rotate3D size={84} strokeWidth={1} /></div>
      <p>3D көрініс құрылғыңызда қолжетімсіз</p>
      <span><WifiOff size={14} /> WebGL қолдауы қажет</span>
    </div>
  )
}

export function HeroDroneScene() {
  const { ref, visible } = useIntersection<HTMLDivElement>(.05)
  const reduced = useMotionPreferences()
  const [supported, setSupported] = useState(true)
  useEffect(() => { setSupported(canUseWebGL()) }, [])
  const active = visible && !reduced
  return (
    <div ref={ref} className="hero-scene-wrap" aria-label="Үш дронның 3D ұшу анимациясы">
      {supported ? (
        <Suspense fallback={<div className="hero-scene-loading">3D дрондар жүктелуде...</div>}>
          <Canvas dpr={[1, 1.7]} camera={{ position: [0, 2.3, 9.4], fov: 43, near: .1, far: 100 }}
            frameloop={active ? 'always' : 'demand'} gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
            style={{ background: 'transparent' }}>
            <SceneContents active={active} />
          </Canvas>
        </Suspense>
      ) : <Fallback />}
      <div className="scene-marker scene-marker-top"><span className="pulsing-dot" /> 3D FLIGHT ENVIRONMENT</div>
      <div className="scene-marker scene-marker-bottom"><Rotate3D size={15} /> Нақты уақыттағы 3D көрініс</div>
      <span className="scene-crosshair" aria-hidden="true">+</span>
    </div>
  )
}
