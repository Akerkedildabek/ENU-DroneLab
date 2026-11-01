import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { ThreeElements } from '@react-three/fiber'

export type DroneModelProps = ThreeElements['group'] & {
  propellerSpeed?: number
  animatePropellers?: boolean
  accent?: string
}

const ROTORS = [
  { x: -1.30, z: -1.13, direction: 1 },
  { x:  1.30, z: -1.13, direction: -1 },
  { x: -1.30, z:  1.13, direction: -1 },
  { x:  1.30, z:  1.13, direction: 1 },
]

function Beam({ start, end, radius = .075, color = '#6e8799' }: {
  start: [number, number, number]
  end: [number, number, number]
  radius?: number
  color?: string
}) {
  const a = useMemo(() => new THREE.Vector3(...start), [start[0], start[1], start[2]])
  const b = useMemo(() => new THREE.Vector3(...end), [end[0], end[1], end[2]])
  const midpoint = useMemo(() => a.clone().add(b).multiplyScalar(.5), [a, b])
  const quaternion = useMemo(() => new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize()), [a, b])
  return (
    <mesh position={midpoint} quaternion={quaternion} castShadow>
      <cylinderGeometry args={[radius, radius * 1.15, a.distanceTo(b), 10]} />
      <meshStandardMaterial color={color} roughness={.39} metalness={.68} />
    </mesh>
  )
}

function Propeller({ direction, speed, enabled }: { direction: number; speed: number; enabled: boolean }) {
  const spinning = useRef<THREE.Group>(null)
  useFrame((_, delta) => {
    if (spinning.current && enabled) spinning.current.rotation.y += Math.min(delta, .05) * speed * direction
  })
  return (
    <group>
      <mesh position={[0, .08, 0]} castShadow>
        <cylinderGeometry args={[.23, .26, .21, 24]} />
        <meshStandardMaterial color="#263c50" metalness={.75} roughness={.32} />
      </mesh>
      <mesh position={[0, .205, 0]}>
        <cylinderGeometry args={[.20, .20, .024, 24]} />
        <meshStandardMaterial color="#a0b4bd" metalness={.85} roughness={.19} />
      </mesh>
      <group ref={spinning} position={[0, .249, 0]}>
        <mesh position={[.39, 0, .014]} rotation={[0, -.11, 0]} castShadow>
          <boxGeometry args={[.77, .026, .13]} />
          <meshStandardMaterial color="#384c5d" metalness={.55} roughness={.35} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[-.39, 0, -.014]} rotation={[0, -.11, 0]} castShadow>
          <boxGeometry args={[.77, .026, .13]} />
          <meshStandardMaterial color="#384c5d" metalness={.55} roughness={.35} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, .021, 0]}>
          <cylinderGeometry args={[.065, .086, .075, 16]} />
          <meshStandardMaterial color="#e3edf1" metalness={.67} roughness={.3} />
        </mesh>
      </group>
    </group>
  )
}

/** A fully procedural, self-contained quadcopter: no network-loaded models. */
export function DroneModel({ propellerSpeed = 36, animatePropellers = true, accent = '#28B8D9', ...props }: DroneModelProps) {
  return (
    <group {...props} dispose={null}>
      {/* carbon-fiber chassis, white aerodynamic shell */}
      <mesh scale={[.95, .20, .77]} castShadow receiveShadow>
        <sphereGeometry args={[1, 28, 18]} />
        <meshStandardMaterial color="#526579" metalness={.55} roughness={.32} />
      </mesh>
      <mesh position={[0, .155, -.05]} scale={[.94, .25, .75]} castShadow>
        <sphereGeometry args={[1, 36, 24]} />
        <meshPhysicalMaterial color="#f5fafc" roughness={.24} metalness={.24} clearcoat={.7} clearcoatRoughness={.2} />
      </mesh>
      <mesh position={[0, .326, -.17]} scale={[.44, .035, .32]}>
        <sphereGeometry args={[1, 20, 10]} />
        <meshStandardMaterial color="#c6d3df" metalness={.68} roughness={.29} />
      </mesh>
      <mesh position={[0, .349, -.24]} rotation={[-.06, 0, 0]}>
        <boxGeometry args={[.25, .008, .45]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={.15} />
      </mesh>
      {/* aerodynamic nose and vent inserts */}
      <mesh position={[0, .07, -.78]} rotation={[-.19, 0, 0]} scale={[.31, .13, .22]}>
        <sphereGeometry args={[1, 20, 16]} />
        <meshStandardMaterial color="#d5e2e9" metalness={.47} roughness={.24} />
      </mesh>
      {[-1, 1].map((side) => (
        <group key={side}>
          <mesh position={[side * .72, .065, -.09]} rotation={[0, 0, side * .18]}>
            <boxGeometry args={[.035, .055, .50]} />
            <meshStandardMaterial color="#21394d" metalness={.45} roughness={.36} />
          </mesh>
          <mesh position={[side * .57, .21, .07]} rotation={[0, 0, side * .2]}>
            <boxGeometry args={[.10, .027, .27]} />
            <meshStandardMaterial color={accent} roughness={.38} />
          </mesh>
        </group>
      ))}
      {ROTORS.map((rotor, idx) => (
        <group key={idx}>
          <Beam start={[rotor.x * .24, .08, rotor.z * .2]} end={[rotor.x, .16, rotor.z]} radius={.085} />
          <Beam start={[rotor.x * .26, .06, rotor.z * .21]} end={[rotor.x * .89, .10, rotor.z * .88]} radius={.045} color="#adbeca" />
          <group position={[rotor.x, .16, rotor.z]}>
            <mesh position={[0, -.09, 0]} castShadow>
              <cylinderGeometry args={[.24, .19, .14, 20]} />
              <meshStandardMaterial color="#e2ecf1" roughness={.28} metalness={.45} />
            </mesh>
            <Propeller direction={rotor.direction} speed={propellerSpeed} enabled={animatePropellers} />
            <mesh position={[0, -.17, 0]}>
              <sphereGeometry args={[.052, 10, 8]} />
              <meshStandardMaterial color={rotor.z < 0 ? '#5ec1e5' : '#ed8c83'} emissive={rotor.z < 0 ? '#5ec1e5' : '#ed8c83'} emissiveIntensity={.8} />
            </mesh>
          </group>
        </group>
      ))}
      {/* landing struts + feet */}
      {[-1, 1].map((side) => (
        <group key={`leg-${side}`}>
          <Beam start={[side * .53, -.09, -.43]} end={[side * .72, -.66, -.48]} radius={.034} color="#8197a6" />
          <Beam start={[side * .53, -.09, .42]} end={[side * .72, -.66, .43]} radius={.034} color="#8197a6" />
          <Beam start={[side * .72, -.66, -.63]} end={[side * .72, -.66, .58]} radius={.044} color="#455969" />
          {[-.56, .51].map((z) => (
            <mesh position={[side * .72, -.68, z]} key={z}>
              <sphereGeometry args={[.065, 12, 8]} />
              <meshStandardMaterial color="#324958" roughness={.55} />
            </mesh>
          ))}
        </group>
      ))}
      {/* camera gimbal underneath forward-facing -Z nose */}
      <mesh position={[0, -.23, -.51]} castShadow>
        <cylinderGeometry args={[.23, .23, .16, 24]} />
        <meshStandardMaterial color="#d5e3eb" metalness={.55} roughness={.27} />
      </mesh>
      <mesh position={[0, -.39, -.59]} castShadow>
        <boxGeometry args={[.50, .29, .38]} />
        <meshStandardMaterial color="#eef4f7" metalness={.26} roughness={.26} />
      </mesh>
      <mesh position={[0, -.38, -.81]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[.145, .145, .055, 32]} />
        <meshStandardMaterial color="#243746" metalness={.62} roughness={.25} />
      </mesh>
      <mesh position={[0, -.38, -.85]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[.082, .082, .01, 24]} />
        <meshPhysicalMaterial color="#2c8bc1" metalness={.5} roughness={.12} clearcoat={1} />
      </mesh>
      {/* front optics / status lights */}
      {[-.25, .25].map(x => (
        <mesh position={[x, .09, -.75]} key={x}>
          <sphereGeometry args={[.05, 12, 8]} />
          <meshStandardMaterial color="#8cdbed" emissive="#28B8D9" emissiveIntensity={.65} />
        </mesh>
      ))}
    </group>
  )
}
