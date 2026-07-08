'use client'

import { useEffect, useState, useCallback } from 'react'

import dynamic from 'next/dynamic'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FormulaDisplay, LabPanel, ParamSlider } from '@/components/lab/lab-controls'
import { generateSignalLocal, convolveLocal, linspace } from '@/lib/signals'

const SignalScene3D = dynamic(() => import('@/components/lab/signal-scene-3d'), { ssr: false })
const DualSignalScene3D = dynamic(
  () => import('@/components/lab/signal-scene-3d').then(m => ({ default: m.DualSignalScene3D })),
  { ssr: false }
)

export default function ConvolutionLab() {
  const [tau, setTau] = useState(0.5)
  const [slidePos, setSlidePos] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [t, setT] = useState<number[]>([])
  const [x, setX] = useState<number[]>([])
  const [h, setH] = useState<number[]>([])
  const [y, setY] = useState<number[]>([])

  const compute = useCallback(() => {
    const tArr = linspace(-1, 4, 400)
    const xSig = generateSignalLocal('rect', { t1: 0, t2: 1 }, -1, 4, 400)
    const hSig = generateSignalLocal('exponential', { a: -1 / tau }, -1, 4, 400)
    const dt = tArr[1] - tArr[0]
    const yFull = convolveLocal(xSig.y, hSig.y, dt)
    const yTrim = yFull.slice(0, tArr.length)

    setT(tArr)
    setX(xSig.y)
    setH(hSig.y)
    setY(yTrim)
  }, [tau])

  useEffect(() => {
    compute()
  }, [compute])

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => {
      setSlidePos(p => (p >= 3 ? 0 : p + 0.05))
    }, 50)
    return () => clearInterval(id)
  }, [playing])

  const shiftedH = h.map((_, i) => {
    const ti = t[i]
    if (ti === undefined) return 0
    const shifted = ti - slidePos
    return shifted >= 0 ? Math.exp(-shifted / tau) : 0
  })

  return (
    <LabPanel
      title='卷积参数'
      side={
        <Card>
          <CardContent className='space-y-4 pt-6'>
            <ParamSlider label='系统时间常数 τ' value={tau} min={0.1} max={2} step={0.05} onChange={setTau} />
            <ParamSlider label='滑动位置 t' value={slidePos} min={0} max={3} step={0.05} onChange={setSlidePos} />
            <button
              type='button'
              onClick={() => setPlaying(p => !p)}
              className='bg-primary text-primary-foreground w-full rounded-md px-4 py-2 text-sm'
            >
              {playing ? '暂停动画' : '播放动画'}
            </button>
            <FormulaDisplay formula='y(t) = ∫ x(τ)h(t−τ)dτ' />
          </CardContent>
        </Card>
      }
    >
      <div className='space-y-6'>
        <Card>
          <CardHeader>
            <CardTitle>输入 x(t) 与 h(t−τ) 滑动</CardTitle>
          </CardHeader>
          <CardContent>
            <DualSignalScene3D t={t} y1={x} y2={shiftedH} label1='x(τ)' label2='h(t−τ)' />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>卷积输出 y(t)</CardTitle>
          </CardHeader>
          <CardContent>
            <SignalScene3D t={t} y={y} color='#22c55e' animated={false} />
          </CardContent>
        </Card>
      </div>
    </LabPanel>
  )
}
