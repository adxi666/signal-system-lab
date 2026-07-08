'use client'

import Link from 'next/link'
import { FlaskConicalIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'

const CTA = () => {
  return (
    <section className='py-12 sm:py-16 lg:py-24'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='from-primary/15 via-primary/10 to-primary/5 flex flex-col items-center gap-6 rounded-2xl border border-primary/25 bg-gradient-to-br px-6 py-14 text-center shadow-sm sm:px-12'>
          <h2 className='text-2xl font-semibold sm:text-3xl'>开始你的信号分析之旅</h2>
          <p className='text-muted-foreground max-w-xl'>
            Python 后端提供精确数值计算，前端 Three.js 呈现三维动画。支持离线本地计算模式。
          </p>
          <Button size='lg' asChild>
            <Link href='/lab/basic-signals'>
              <FlaskConicalIcon className='mr-2 size-5' />
              打开基本信号实验
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

export default CTA
