import { Component, Suspense, useState } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import { Canvas } from '@react-three/fiber'
import { Bounds, OrbitControls, useGLTF } from '@react-three/drei'
import { Maximize2, RotateCcw, TriangleAlert } from 'lucide-react'

type Props = { url: string; title: string }

class ModelErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch(error: Error, _info: ErrorInfo) { console.error('Model loading error:', error) }
  render() {
    if (this.state.failed) return <div className="viewer-error"><TriangleAlert size={24} /><strong>3D модель ашылмады</strong><span>Файлдың жолын және GLB/GLTF форматын тексеріңіз.</span></div>
    return this.props.children
  }
}

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url)
  return <primitive object={scene} />
}

export function ModelViewer({ url, title }: Props) {
  const [version, setVersion] = useState(0)
  const [webgl] = useState(() => {
    try { const canvas = document.createElement('canvas'); return !!(canvas.getContext('webgl2') || canvas.getContext('webgl')) }
    catch { return false }
  })
  return (
    <div className="embedded-model">
      <div className="viewer-heading"><strong>{title}</strong><button type="button" onClick={() => setVersion((n) => n + 1)}>
        <RotateCcw size={15} /> Камераны қалпына келтіру</button></div>
      <div className="model-canvas">
        {webgl ? (
          <ModelErrorBoundary key={`${url}:${version}`}>
            <Suspense fallback={<div className="viewer-loading">3D модель жүктелуде...</div>}>
              <Canvas key={version} dpr={[1, 1.6]} camera={{ position: [4, 3, 5], fov: 45 }}
                gl={{ antialias: true, alpha: true }} style={{ background: 'transparent' }}>
                <ambientLight intensity={1.8} />
                <directionalLight position={[5, 8, 6]} intensity={2.6} />
                <directionalLight position={[-4, 3, -4]} intensity={1.5} />
                <Bounds fit clip observe margin={1.35}><Model url={url} /></Bounds>
                <OrbitControls makeDefault enableDamping minDistance={.1} maxDistance={1000} />
              </Canvas>
            </Suspense>
          </ModelErrorBoundary>
        ) : <div className="viewer-error">Бұл құрылғыда WebGL жұмыс істемейді.</div>}
      </div>
      <div className="model-footer"><Maximize2 size={14} /> Айналдыру: сүйреу · Масштабтау: тінтуір дөңгелегі</div>
    </div>
  )
}
