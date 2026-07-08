'use client'

import { useEffect, useState, useCallback } from 'react'

import dynamic from 'next/dynamic'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  FormulaDisplay,
  LabPanel,
  ParamSlider,
  SignalTypeSelect
} from '@/components/lab/lab-controls'
import { generateSignalLocal } from '@/lib/signals'
import { fetchSignal, fetchFourierTransform } from '@/lib/api'

const SignalScene3D = dynamic(() => import('@/components/lab/signal-scene-3d'), { ssr: false })

type ViewMode = 'time' | 'surface' | 'combined'

export default function BasicSignalsLab() {
  const [signalType, setSignalType] = useState('sinusoid')
  const [omega, setOmega] = useState(6.28)
  const [phi, setPhi] = useState(0)
  const [amp, setAmp] = useState(1)
  const [a, setA] = useState(-0.5)
  const [width, setWidth] = useState(0.05)
  const [t, setT] = useState<number[]>([])
  const [y, setY] = useState<number[]>([])
  const [freqs, setFreqs] = useState<number[]>([])
  const [magnitude, setMagnitude] = useState<number[]>([])
  const [formula, setFormula] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('time')
  const [showStars, setShowStars] = useState(false)

  const params = { omega, phi, amp, a, width }

  const compute = useCallback(async () => {
    try {
      const data = await fetchSignal(signalType, params)
      setT(data.t)
      setY(data.y)
      setFormula(data.formula)
      
      const ftData = await fetchFourierTransform(signalType, params)
      setFreqs(ftData.frequency.f)
      setMagnitude(ftData.frequency.magnitude)
    } catch {
      const local = generateSignalLocal(signalType, params)
      setT(local.t)
      setY(local.y)
      setFormula(local.formula)
    }
  }, [signalType, omega, phi, amp, a, width])

  useEffect(() => {
    compute()
  }, [compute])

  const getViewTitle = () => {
    switch (viewMode) {
      case 'time': return '三维时域波形'
      case 'surface': return '三维曲面可视化'
      case 'combined': return '时域-频域对照'
      default: return '三维时域波形'
    }
  }

  return (
    <LabPanel
      title='参数控制'
      side={
        <Card>
          <CardContent className='space-y-4 pt-6'>
            <SignalTypeSelect value={signalType} onChange={setSignalType} />
            {signalType === 'sinusoid' && (
              <>
                <ParamSlider label='角频率 ω' value={omega} min={0.5} max={20} step={0.1} onChange={setOmega} unit=' rad/s' />
                <ParamSlider label='初相 φ' value={phi} min={-3.14} max={3.14} step={0.05} onChange={setPhi} unit=' rad' />
                <ParamSlider label='幅度 A' value={amp} min={0.1} max={3} step={0.1} onChange={setAmp} />
              </>
            )}
            {signalType === 'exponential' && (
              <ParamSlider label='指数 a' value={a} min={-3} max={1} step={0.1} onChange={setA} />
            )}
            {signalType === 'impulse' && (
              <ParamSlider label='脉冲宽度' value={width} min={0.01} max={0.3} step={0.01} onChange={setWidth} />
            )}
            <div className='space-y-2 pt-2'>
              <label className='text-sm font-medium'>显示效果</label>
              <Button
                variant={showStars ? 'default' : 'secondary'}
                size='sm'
                onClick={() => setShowStars(!showStars)}
                className='w-full'
              >
                {showStars ? '星空背景' : '纯色背景'}
              </Button>
            </div>
            <FormulaDisplay formula={formula} />
          </CardContent>
        </Card>
      }
    >
      <Card>
        <CardHeader>
          <CardTitle>{getViewTitle()}</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)} className='w-full'>
            <TabsList className='mb-4 w-full'>
              <TabsTrigger value='time' className='flex-1'>时域波形</TabsTrigger>
              <TabsTrigger value='surface' className='flex-1'>曲面效果</TabsTrigger>
              <TabsTrigger value='combined' className='flex-1'>时频对照</TabsTrigger>
            </TabsList>
            
            <TabsContent value='time'>
              <SignalScene3D 
                t={t} 
                y={y} 
                mode='time'
                animated 
                showStars={showStars}
              />
            </TabsContent>
            
            <TabsContent value='surface'>
              <SignalScene3D 
                t={t} 
                y={y} 
                mode='surface'
                animated={false}
                showStars={showStars}
              />
            </TabsContent>
            
            <TabsContent value='combined'>
              <div className='space-y-4'>
                <SignalScene3D 
                  t={t} 
                  y={y} 
                  mode='time'
                  animated={false}
                  showStars={showStars}
                />
                {freqs.length > 0 && (
                  <SignalScene3D 
                    t={[]}
                    y={[]}
                    mode='spectrum'
                    freqs={freqs}
                    magnitude={magnitude}
                    animated
                    showStars={showStars}
                    color='#8b5cf6'
                  />
                )}
              </div>
            </TabsContent>
          </Tabs>
          
          <p className='text-muted-foreground mt-4 text-sm'>
            拖动旋转视角，滚轮缩放。信号沿 t 轴展开，高度表示 x(t) 的幅度。
          </p>
        </CardContent>
      </Card>
    </LabPanel>
  )
}
