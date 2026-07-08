'use client'

import { useEffect, useState, useCallback } from 'react'

import dynamic from 'next/dynamic'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FormulaDisplay, LabPanel, ParamSlider } from '@/components/lab/lab-controls'
import { fourierSeriesLocal } from '@/lib/signals'
import { fetchFourierSeries } from '@/lib/api'

const HarmonicStack3D = dynamic(
  () => import('@/components/lab/signal-scene-3d').then(m => ({ default: m.HarmonicStack3D })),
  { ssr: false }
)
const SignalScene3D = dynamic(() => import('@/components/lab/signal-scene-3d'), { ssr: false })

export default function FourierSeriesLab() {
  const [T, setT] = useState(2)
  const [nHarmonics, setNHarmonics] = useState(5)
  const [t, setTArr] = useState<number[]>([])
  const [y, setY] = useState<number[]>([])
  const [harmonics, setHarmonics] = useState<{ k: number; amplitude: number; component: number[] }[]>([])

  const compute = useCallback(async () => {
    try {
      const data = await fetchFourierSeries(T, nHarmonics)
      setTArr(data.t)
      setY(data.y)
      setHarmonics(data.harmonics)
    } catch {
      const local = fourierSeriesLocal(T, nHarmonics)
      setTArr(local.t)
      setY(local.y)
      setHarmonics(local.harmonics)
    }
  }, [T, nHarmonics])

  useEffect(() => {
    compute()
  }, [compute])

  return (
    <LabPanel
      title='傅里叶级数参数'
      side={
        <Card>
          <CardContent className='space-y-4 pt-6'>
            <ParamSlider label='周期 T' value={T} min={0.5} max={4} step={0.1} onChange={setT} unit=' s' />
            <ParamSlider
              label='谐波次数 (奇数)'
              value={nHarmonics}
              min={1}
              max={21}
              step={2}
              onChange={v => setNHarmonics(v % 2 === 0 ? v + 1 : v)}
            />
            <FormulaDisplay formula='x(t) = Σ (4/kπ) cos(kω₀t), k=1,3,5...' />
            <p className='text-muted-foreground text-xs'>
              对应教材第3章周期信号的频谱分解，方波仅含奇次谐波。
            </p>
          </CardContent>
        </Card>
      }
    >
      <div className='space-y-6'>
        <Card>
          <CardHeader>
            <CardTitle>谐波分量三维堆叠</CardTitle>
          </CardHeader>
          <CardContent>
            <HarmonicStack3D t={t} harmonics={harmonics} totalY={y} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>合成波形</CardTitle>
          </CardHeader>
          <CardContent>
            <SignalScene3D t={t} y={y} color='#22c55e' animated />
          </CardContent>
        </Card>
      </div>
    </LabPanel>
  )
}
