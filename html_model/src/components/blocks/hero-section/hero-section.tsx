'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowUpRightIcon, FlaskConicalIcon, WavesIcon } from 'lucide-react'

import { labModules } from '@/assets/data/labs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const HeroSection = () => {
  const featured = labModules.filter(l => l.featured)
  const router = useRouter()

  return (
    <section id='home' className='relative -mt-16 overflow-hidden pt-32 pb-20 sm:pb-24 lg:pb-32'>
      <div className='from-primary/8 via-background to-background absolute inset-0 bg-gradient-to-b' />
      <div className='absolute -top-40 -right-40 size-96 rounded-full bg-primary/5 blur-3xl' />
      <div className='absolute -bottom-20 -left-20 size-80 rounded-full bg-primary/8 blur-3xl' />
      <div className='relative mx-auto flex h-full max-w-7xl flex-col gap-16 px-4 sm:px-6 lg:px-8'>
        <div className='flex max-w-4xl flex-col items-center gap-4 self-center text-center'>
          <Badge variant='outline' className='h-auto text-sm font-normal'>
            <WavesIcon className='mr-1 size-4' />
            信号与系统 · 郑君里 第二版
          </Badge>
          <h1 className='text-3xl leading-[1.29167] font-semibold text-balance sm:text-4xl lg:text-5xl'>
            三维动画信号分析仿真实验室
          </h1>
          <p className='text-muted-foreground mx-auto max-w-2xl text-xl'>
            交互式计算器与 Three.js 三维可视化，直观理解卷积、傅里叶变换与 LTI 系统响应。
          </p>
          <div className='flex gap-3 pt-2'>
            <Button size='lg' asChild>
              <Link href='/lab'>
                <FlaskConicalIcon className='mr-2 size-5' />
                进入实验
              </Link>
            </Button>
            <Button size='lg' variant='outline' asChild>
              <Link href='/lab/basic-signals'>快速体验</Link>
            </Button>
          </div>
        </div>

        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
          {featured.slice(0, 2).map(lab => (
            <Card
              key={lab.id}
              className='group cursor-pointer border-primary/20 bg-background/80 py-0 shadow-sm backdrop-blur transition-shadow hover:shadow-lg'
              onClick={() => router.push(`/lab/${lab.slug}`)}
            >
              <CardContent className='flex flex-col gap-4 p-6'>
                <div className='flex items-center justify-between'>
                  <Badge variant='secondary'>{lab.chapter}</Badge>
                  <Badge className='bg-primary/10 text-primary border-0'>3D 动画</Badge>
                </div>
                <h3 className='text-xl font-medium'>{lab.title}</h3>
                <p className='text-muted-foreground text-base'>{lab.description}</p>
                <code className='bg-muted rounded px-2 py-1 font-mono text-xs'>{lab.formula}</code>
                <div className='flex justify-end'>
                  <Button
                    size='icon'
                    variant='default'
                    className='group-hover:opacity-100 opacity-70 transition-opacity'
                    asChild
                  >
                    <Link href={`/lab/${lab.slug}`}>
                      <ArrowUpRightIcon />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HeroSection
