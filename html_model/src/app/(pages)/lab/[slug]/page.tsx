import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronLeftIcon } from 'lucide-react'

import type { ComponentType } from 'react'

import { getLabBySlug, labModules } from '@/assets/data/labs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import BasicSignalsLab from '@/components/lab/basic-signals-lab'
import ConvolutionLab from '@/components/lab/convolution-lab'
import FourierSeriesLab from '@/components/lab/fourier-series-lab'
import FourierTransformLab from '@/components/lab/fourier-transform-lab'
import LTISystemLab from '@/components/lab/lti-system-lab'
import SignalCalculator from '@/components/lab/signal-calculator'

const labComponents: Record<string, ComponentType> = {
  calculator: SignalCalculator,
  'basic-signals': BasicSignalsLab,
  convolution: ConvolutionLab,
  'fourier-series': FourierSeriesLab,
  'fourier-transform': FourierTransformLab,
  'lti-system': LTISystemLab
}

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return labModules.map(lab => ({ slug: lab.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const lab = getLabBySlug(slug)
  if (!lab) return { title: '实验未找到' }
  return {
    title: lab.title,
    description: lab.description
  }
}

export default async function LabDetailPage({ params }: Props) {
  const { slug } = await params
  const lab = getLabBySlug(slug)

  if (!lab) notFound()

  const LabComponent = labComponents[slug]
  if (!LabComponent) notFound()

  return (
    <section className='relative -mt-16 overflow-hidden pt-28 pb-16'>
      <div className='from-primary/5 via-background to-background absolute inset-0 bg-gradient-to-b' />
      <div className='relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='mb-8'>
          <Button variant='ghost' size='sm' asChild className='mb-4 -ml-3'>
            <Link href='/lab'>
              <ChevronLeftIcon className='mr-1 size-4' />
              返回实验列表
            </Link>
          </Button>
          <div className='flex flex-wrap items-center gap-3'>
            <Badge variant='outline'>{lab.chapter}</Badge>
            <h1 className='text-2xl font-semibold sm:text-3xl'>{lab.title}</h1>
          </div>
          <p className='text-muted-foreground mt-2 max-w-3xl'>{lab.description}</p>
          <code className='bg-primary/5 mt-3 inline-block rounded px-3 py-1 font-mono text-sm'>{lab.formula}</code>
        </div>

        <div className={lab.slug === 'calculator' ? 'flex justify-center' : ''}>
          <LabComponent />
        </div>
      </div>
    </section>
  )
}
