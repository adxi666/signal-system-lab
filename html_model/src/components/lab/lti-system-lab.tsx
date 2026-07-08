'use client'

import { useEffect, useState, useCallback } from 'react'

import dynamic from 'next/dynamic'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FormulaDisplay, LabPanel, ParamSlider } from '@/components/lab/lab-controls'
import { generateSignalLocal, convolveLocal, linspace } from '@/lib/signals'
import { fetchLTI } from '@/lib/api'

const DualSignalScene3D = dynamic(
  () => import('@/components/lab/signal-scene-3d').then(m => ({ default: m.DualSignalScene3D })),
  { ssr: false }
)
const SignalScene3D = dynamic(() => import('@/components/lab/signal-scene-3d'), { ssr: false })

export default function LTISystemLab() {
  const [tau, setTau] = useState(1)
  const [inputType, setInputType] = useState<'step' | 'impulse'>('step')
  const [t, setT] = useState<number[]>([])
  const [input, setInput] = useState<number[]>([])
  const [h, setH] = useState<number[]>([])
  const [output, setOutput] = useState<number[]>([])
  const [label, setLabel] = useState('')

  const compute = useCallback(async () => {
    try {
      const data = await fetchLTI('rc_lowpass', inputType, { tau }, {}, 0, 5, 500)
      setT(data.t)
      setInput(data.input)
      setH(data.impulse_response)
      setOutput(data.output)
      setLabel(data.system_label)
    } catch {
      const tArr = linspace(0, 5, 500)
      const dt = tArr[1] - tArr[0]
      const xSig = generateSignalLocal(inputType, {}, 0, 5, 500)
      const hArr = tArr.map(v => (v >= 0 ? (1 / tau) * Math.exp(-v / tau) : 0))
      const yArr = convolveLocal(xSig.y, hArr, dt).slice(0, 500)
      setT(tArr)
      setInput(xSig.y)
      setH(hArr)
      setOutput(yArr)
      setLabel(`RC lowpass τ=${tau}`)
    }
  }, [tau, inputType])

  useEffect(() => {
    compute()
  }, [compute])

  return (
    <LabPanel
      title='LTI 系统参数'
      side={
        <Card>
          <CardContent className='space-y-4 pt-6'>
            <ParamSlider label='时间常数 τ' value={tau} min={0.2} max={3} step={0.1} onChange={setTau} />
            <div className='space-y-2'>
              <label className='text-sm font-medium'>输入信号</label>
              <select
                value={inputType}
                onChange={e => setInputType(e.target.value as 'step' | 'impulse')}
                className='border-input bg-background w-full rounded-md border px-3 py-2 text-sm'
              >
                <option value='step'>阶跃 u(t)</option>
                <option value='impulse'>冲激 δ(t)</option>
              </select>
            </div>
            <FormulaDisplay formula={`H(s)=1/(τs+1) — ${label}`} />
          </CardContent>
        </Card>
      }
    >
      <div className='space-y-6'>
        <Card>
          <CardHeader>
            <CardTitle>输入与冲激响应</CardTitle>
          </CardHeader>
          <CardContent>
            <DualSignalScene3D t={t} y1={input} y2={h} label1='x(t)' label2='h(t)' color2='#ef4444' />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>零状态响应 y(t) = x(t)*h(t)</CardTitle>
          </CardHeader>
          <CardContent>
            <SignalScene3D t={t} y={output} color='#22c55e' />
          </CardContent>
        </Card>
      </div>
    </LabPanel>
  )
}
