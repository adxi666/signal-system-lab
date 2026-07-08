'use client'

import { useMemo, useState, useEffect, useRef } from 'react'

import { Canvas, useFrame } from '@react-three/fiber'
import { Line, OrbitControls, Grid, Text, PerspectiveCamera, Stars } from '@react-three/drei'
import * as THREE from 'three'

type SignalCurve3DProps = {
  t: number[]
  y: number[]
  color?: string
  animated?: boolean
  label?: string
  width?: number
}

function SignalCurve({ t, y, color = '#3b82f6', animated = true, width = 2 }: SignalCurve3DProps) {
  const [drawProgress, setDrawProgress] = useState(animated ? 0 : 1)
  const materialRef = useRef<THREE.LineBasicMaterial>(null)
  const [glowIntensity, setGlowIntensity] = useState(0)

  const points = useMemo(() => {
    if (t.length === 0) return []
    const maxT = Math.max(...t.map(Math.abs))
    const maxY = Math.max(...y.map(Math.abs), 0.01)
    const scale = 4 / Math.max(maxT, maxY)

    return t.map((ti, i) => new THREE.Vector3(ti * scale, y[i] * scale, 0))
  }, [t, y])

  useFrame((_, delta) => {
    if (animated && drawProgress < 1) {
      setDrawProgress(p => Math.min(1, p + delta * 0.5))
    }
    setGlowIntensity(0.3 + 0.2 * Math.sin(Date.now() * 0.002))
  })

  useEffect(() => {
    setDrawProgress(animated ? 0 : 1)
  }, [t, y, animated])

  const count = Math.max(2, Math.floor(drawProgress * points.length))
  const displayPoints = points.slice(0, count)

  if (displayPoints.length < 2) return null

  return (
    <group>
      <Line 
        points={displayPoints} 
        color={color} 
        lineWidth={width} 
        renderOrder={1}
      />
      <Line 
        points={displayPoints} 
        color={color} 
        lineWidth={width + 3} 
        opacity={glowIntensity * 0.3}
        transparent
        renderOrder={0}
      />
    </group>
  )
}

function AxisLabels() {
  return (
    <group>
      <Text position={[4.5, 0, 0]} fontSize={0.25} color='#64748b' anchorX='left'>
        t
      </Text>
      <Text position={[0, 4.5, 0]} fontSize={0.25} color='#64748b' anchorY='bottom'>
        x(t)
      </Text>
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach='attributes-position'
            args={[new Float32Array([0, 0, 0, 5, 0, 0]), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color='#64748b' />
      </line>
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach='attributes-position'
            args={[new Float32Array([0, 0, 0, 0, 5, 0]), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color='#64748b' />
      </line>
    </group>
  )
}

type SpectrumBars3DProps = {
  freqs: number[]
  magnitude: number[]
  color?: string
  animated?: boolean
}

function SpectrumBars({ freqs, magnitude, color = '#8b5cf6', animated = true }: SpectrumBars3DProps) {
  const [heights, setHeights] = useState<number[]>([])
  const [time, setTime] = useState(0)

  const bars = useMemo(() => {
    const half = Math.floor(freqs.length / 2)
    const count = Math.min(60, half)
    const start = half - count / 2
    const maxMag = Math.max(...magnitude, 0.01)
    const scale = 3 / maxMag
    const fScale = 4 / Math.max(...freqs.map(Math.abs), 1)

    return Array.from({ length: count }, (_, i) => {
      const idx = start + i
      const h = magnitude[idx] * scale
      return {
        x: freqs[idx] * fScale,
        height: Math.max(h, 0.02),
        mag: magnitude[idx],
        index: i
      }
    })
  }, [freqs, magnitude])

  useEffect(() => {
    setHeights(bars.map(() => 0))
  }, [bars])

  useFrame((_, delta) => {
    setTime(t => t + delta)
    if (animated) {
      setHeights(prevHeights => 
        prevHeights.map((h, i) => {
          const targetH = bars[i]?.height || 0
          return h + (targetH - h) * 0.05
        })
      )
    }
  })

  return (
    <group>
      {bars.map((bar, i) => (
        <mesh 
          key={i} 
          position={[bar.x, (heights[i] || bar.height) / 2, 0]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[0.08, heights[i] || bar.height, 0.08]} />
          <meshStandardMaterial 
            color={color} 
            emissive={color} 
            emissiveIntensity={0.2 + 0.1 * Math.sin(time * 2 + i * 0.2)}
            metalness={0.3}
            roughness={0.4}
          />
        </mesh>
      ))}
    </group>
  )
}

type SignalSurface3DProps = {
  t: number[]
  y: number[]
  color?: string
}

function SignalSurface({ t, y, color = '#3b82f6' }: SignalSurface3DProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [time, setTime] = useState(0)

  const geometry = useMemo(() => {
    if (t.length === 0) return null
    const maxT = Math.max(...t.map(Math.abs))
    const maxY = Math.max(...y.map(Math.abs), 0.01)
    const scale = 4 / Math.max(maxT, maxY)
    
    const geo = new THREE.PlaneGeometry(8, 6, 50, 30)
    const positions = geo.attributes.position
    
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i)
      const z = positions.getZ(i)
      
      const tIdx = Math.floor(((x + 4) / 8) * (t.length - 1))
      const clampedIdx = Math.max(0, Math.min(t.length - 1, tIdx))
      const yVal = y[clampedIdx] * scale
      
      const wave = yVal * Math.exp(-Math.abs(z) / 2)
      positions.setY(i, wave)
    }
    
    geo.computeVertexNormals()
    return geo
  }, [t, y])

  useFrame((_, delta) => {
    setTime(t => t + delta)
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(time * 0.2) * 0.1
    }
  })

  if (!geometry) return null

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 4, 0, 0]} position={[0, -1, 0]}>
      <primitive object={geometry} />
      <meshStandardMaterial 
        color={color}
        side={THREE.DoubleSide}
        transparent
        opacity={0.8}
        metalness={0.2}
        roughness={0.3}
      />
    </mesh>
  )
}

type SignalScene3DProps = {
  t: number[]
  y: number[]
  mode?: 'time' | 'spectrum' | 'surface'
  freqs?: number[]
  magnitude?: number[]
  color?: string
  animated?: boolean
  showGrid?: boolean
  showStars?: boolean
}

export default function SignalScene3D({
  t,
  y,
  mode = 'time',
  freqs = [],
  magnitude = [],
  color,
  animated = true,
  showGrid = true,
  showStars = false
}: SignalScene3DProps) {
  return (
    <div className='h-[420px] w-full overflow-hidden rounded-lg border bg-background/50'>
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 2, 8]} fov={50} />
        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[5, 10, 5]} 
          intensity={1.2} 
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <pointLight position={[-5, 5, 5]} intensity={0.5} color='#8b5cf6' />
        <pointLight position={[5, 5, -5]} intensity={0.5} color='#3b82f6' />
        
        {showStars && <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />}
        
        {showGrid && (
          <Grid
            args={[10, 10]}
            cellSize={0.5}
            cellColor='#334155'
            sectionColor='#475569'
            fadeDistance={15}
            position={[0, -0.01, 0]}
          />
        )}
        
        {mode === 'time' && (
          <group>
            <SignalCurve t={t} y={y} color={color ?? '#3b82f6'} animated={animated} width={3} />
            <AxisLabels />
          </group>
        )}
        
        {mode === 'spectrum' && (
          <group>
            <SpectrumBars freqs={freqs} magnitude={magnitude} color={color ?? '#8b5cf6'} animated={animated} />
            <Text position={[4.5, 0, 0]} fontSize={0.25} color='#64748b' anchorX='left'>
              f
            </Text>
            <Text position={[0, 4, 0]} fontSize={0.25} color='#64748b' anchorY='bottom'>
              |X(f)|
            </Text>
          </group>
        )}
        
        {mode === 'surface' && (
          <SignalSurface t={t} y={y} color={color ?? '#3b82f6'} />
        )}
        
        <OrbitControls 
          enablePan 
          enableZoom 
          enableRotate 
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  )
}

function DualSignalCanvasContent({
  t,
  y1,
  y2,
  label1,
  label2,
  color1,
  color2
}: {
  t: number[]
  y1: number[]
  y2: number[]
  label1: string
  label2: string
  color1: string
  color2: string
}) {
  const [time, setTime] = useState(0)

  useFrame((_, delta) => {
    setTime(t => t + delta)
  })

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 3, 9]} fov={50} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
      <pointLight position={[-5, 5, 5]} intensity={0.5} color={color1} />
      <pointLight position={[5, 5, -5]} intensity={0.5} color={color2} />
      <Stars radius={50} depth={20} count={1000} factor={3} saturation={0} fade speed={0.5} />
      <Grid args={[10, 10]} cellSize={0.5} cellColor='#334155' sectionColor='#475569' fadeDistance={15} />
      <SignalCurve t={t} y={y1} color={color1} animated={false} width={2} />
      <group position={[0, 0, -1.5]} rotation={[0, Math.sin(time * 0.3) * 0.05, 0]}>
        <SignalCurve t={t} y={y2} color={color2} animated={false} width={2} />
      </group>
      <Text position={[-4, 3.5, 0]} fontSize={0.2} color={color1}>
        {label1}
      </Text>
      <Text position={[-4, 3.5, -1.5]} fontSize={0.2} color={color2}>
        {label2}
      </Text>
      <OrbitControls enablePan enableZoom enableRotate />
    </>
  )
}

export function DualSignalScene3D({
  t,
  y1,
  y2,
  label1 = 'x(t)',
  label2 = 'h(t)',
  color1 = '#3b82f6',
  color2 = '#f59e0b'
}: {
  t: number[]
  y1: number[]
  y2: number[]
  label1?: string
  label2?: string
  color1?: string
  color2?: string
}) {
  return (
    <div className='h-[420px] w-full overflow-hidden rounded-lg border bg-background/50'>
      <Canvas shadows>
        <DualSignalCanvasContent
          t={t}
          y1={y1}
          y2={y2}
          label1={label1}
          label2={label2}
          color1={color1}
          color2={color2}
        />
      </Canvas>
    </div>
  )
}

function HarmonicStackCanvasContent({
  t,
  harmonics,
  totalY
}: {
  t: number[]
  harmonics: { k: number; amplitude: number; component: number[] }[]
  totalY: number[]
}) {
  const zStep = 0.8
  const [time, setTime] = useState(0)

  useFrame((_, delta) => {
    setTime(t => t + delta)
  })

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 4, 10]} fov={50} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 5]} intensity={1.2} castShadow />
      <pointLight position={[0, 8, 0]} intensity={0.8} color='#22c55e' />
      <Stars radius={80} depth={30} count={2000} factor={4} saturation={0} fade speed={0.3} />
      <Grid args={[12, 12]} cellSize={0.5} cellColor='#334155' sectionColor='#475569' fadeDistance={18} />

      {harmonics.map((h, idx) => (
        <group
          key={h.k}
          position={[0, 0, -idx * zStep]}
          rotation={[0, Math.sin(time * 0.2 + idx * 0.3) * 0.02, 0]}
        >
          <SignalCurve t={t} y={h.component} color={`hsl(${220 + idx * 30}, 70%, 55%)`} animated={false} width={2} />
          <Text position={[-4.5, 3, 0]} fontSize={0.18} color='#94a3b8'>
            k={h.k}, a_k={h.amplitude.toFixed(3)}
          </Text>
        </group>
      ))}

      <group position={[0, -2, harmonics.length * zStep * 0.5]}>
        <SignalCurve t={t} y={totalY} color='#22c55e' animated={false} width={3} />
        <Text position={[-4.5, 3.5, 0]} fontSize={0.22} color='#22c55e'>
          合成信号
        </Text>
      </group>

      <OrbitControls enablePan enableZoom enableRotate />
    </>
  )
}

export function HarmonicStack3D({
  t,
  harmonics,
  totalY
}: {
  t: number[]
  harmonics: { k: number; amplitude: number; component: number[] }[]
  totalY: number[]
}) {
  return (
    <div className='h-[480px] w-full overflow-hidden rounded-lg border bg-background/50'>
      <Canvas shadows>
        <HarmonicStackCanvasContent t={t} harmonics={harmonics} totalY={totalY} />
      </Canvas>
    </div>
  )
}

export function TimeFrequencyView3D({
  t,
  y,
  freqs,
  magnitude
}: {
  t: number[]
  y: number[]
  freqs: number[]
  magnitude: number[]
}) {
  return (
    <div className='h-[500px] w-full overflow-hidden rounded-lg border bg-background/50'>
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[8, 4, 8]} fov={50} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1} castShadow />
        <pointLight position={[-5, 5, 5]} intensity={0.5} color='#3b82f6' />
        <pointLight position={[5, 5, -5]} intensity={0.5} color='#8b5cf6' />
        <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={0.4} />
        <Grid args={[20, 20]} cellSize={1} cellColor='#334155' sectionColor='#475569' fadeDistance={25} />
        
        <group position={[-6, 0, 0]}>
          <SignalCurve t={t} y={y} color='#3b82f6' animated={false} width={2} />
          <Text position={[4.5, 0, 0]} fontSize={0.2} color='#64748b' anchorX='left'>
            时域
          </Text>
        </group>
        
        <group position={[6, 0, 0]}>
          <SpectrumBars freqs={freqs} magnitude={magnitude} color='#8b5cf6' animated={false} />
          <Text position={[4.5, 0, 0]} fontSize={0.2} color='#64748b' anchorX='left'>
            频域
          </Text>
        </group>
        
        <OrbitControls enablePan enableZoom enableRotate />
      </Canvas>
    </div>
  )
}
