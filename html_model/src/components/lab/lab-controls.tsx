'use client'

import type { ReactNode } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

type ParamSliderProps = {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (v: number) => void
  unit?: string
}

export function ParamSlider({ label, value, min, max, step, onChange, unit }: ParamSliderProps) {
  return (
    <div className='space-y-2'>
      <div className='flex items-center justify-between'>
        <Label className='text-sm'>{label}</Label>
        <span className='text-muted-foreground font-mono text-xs'>
          {value.toFixed(3)}
          {unit ?? ''}
        </span>
      </div>
      <input
        type='range'
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className='accent-primary w-full'
      />
    </div>
  )
}

type SignalTypeSelectProps = {
  value: string
  onChange: (v: string) => void
}

export function SignalTypeSelect({ value, onChange }: SignalTypeSelectProps) {
  return (
    <div className='space-y-2'>
      <Label htmlFor='signal-type'>信号类型</Label>
      <select
        id='signal-type'
        value={value}
        onChange={e => onChange(e.target.value)}
        className='border-input bg-background w-full rounded-md border px-3 py-2 text-sm'
      >
        <option value='step'>单位阶跃 u(t)</option>
        <option value='impulse'>单位冲激 δ(t)</option>
        <option value='exponential'>指数 e^&#123;at&#125;</option>
        <option value='sinusoid'>正弦 A·cos(ωt+φ)</option>
        <option value='rect'>矩形脉冲</option>
      </select>
    </div>
  )
}

export function FormulaDisplay({ formula }: { formula: string }) {
  return (
    <div className='bg-muted rounded-lg px-4 py-3 font-mono text-sm'>
      <span className='text-muted-foreground mr-2'>当前:</span>
      <span className='text-primary'>{formula}</span>
    </div>
  )
}

export function LabPanel({
  title,
  children,
  side
}: {
  title: string
  children: ReactNode
  side?: ReactNode
}) {
  return (
    <div className='grid gap-6 lg:grid-cols-[320px_1fr]'>
      <div className='space-y-4'>
        <h3 className='rounded-lg bg-primary/10 px-4 py-3 text-lg font-semibold'>{title}</h3>
        <div className='rounded-lg border bg-background p-4 shadow-sm'>{side}</div>
      </div>
      <div className='min-h-[500px]'>{children}</div>
    </div>
  )
}

export { Tabs, TabsContent, TabsList, TabsTrigger, Label, Input }
