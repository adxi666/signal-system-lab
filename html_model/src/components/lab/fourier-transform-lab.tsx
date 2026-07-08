'use client'

import { useEffect, useState, useCallback } from 'react'

import dynamic from 'next/dynamic'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FormulaDisplay, LabPanel, ParamSlider, SignalTypeSelect } from '@/components/lab/lab-controls'
import { generateSignalLocal, linspace, fftLocal } from '@/lib/signals'
import { fetchFourierTransform } from '@/lib/api'

const SignalScene3D = dynamic(() => import('@/components/lab/signal-scene-3d'), { ssr: false })

export default function FourierTransformLab() {
  const [signalType, setSignalType] = useState('rect')
  const [omega, setOmega] = useState(6.28)
  const [t, setT] = useState<number[]>([])
  const [y, setY] = useState<number[]>([])
  const [freqs, setFreqs] = useState<number[]>([])
  const [magnitude, setMagnitude] = useState<number[]>([])
  const [formula, setFormula] = useState('')

  const compute = useCallback(async () => {
    const params = { omega, t1: -0.5, t2: 0.5 }
    try {
      const data = await fetchFourierTransform(signalType, params, -2, 5, 512)
      setT(data.time.t)
      setY(data.time.y)
      setFormula(data.time.formula)
      setFreqs(data.frequency.f)
      setMagnitude(data.frequency.magnitude)
    } catch {
      const local = generateSignalLocal(signalType, params, -2, 5, 512)
      setT(local.t)
      setY(local.y)
      setFormula(local.formula)
      const dt = 7 / 512
      const fft = fftLocal(local.y)
      const fArr = linspace(-0.5 / dt, 0.5 / dt, 512)
      setFreqs(fArr)
      setMagnitude(fft.magnitude)
    }
  }, [signalType, omega])

  useEffect(() => {
    compute()
  }, [compute])

  return (
    <LabPanel
      title='傅里叶变换参数'
      side={
        <Card>
          <CardContent className='space-y-4 pt-6'>
            <SignalTypeSelect value={signalType} onChange={setSignalType} />
            {signalType === 'sinusoid' && (
              <ParamSlider label='角频率 ω' value={omega} min={1} max={30} step={0.5} onChange={setOmega} />
            )}
            <FormulaDisplay formula={formula || 'X(jω) = ∫ x(t)e^{-jωt}dt'} />
          </CardContent>
        </Card>
      }
    >
      <div className='grid gap-6 lg:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>时域 x(t)</CardTitle>
          </CardHeader>
          <CardContent>
            <SignalScene3D t={t} y={y} mode='time' color='#3b82f6' />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>频域 |X(f)|</CardTitle>
          </CardHeader>
          <CardContent>
            <SignalScene3D t={t} y={y} mode='spectrum' freqs={freqs} magnitude={magnitude} color='#8b5cf6' />
          </CardContent>
        </Card>
      </div>
    </LabPanel>
  )
}
