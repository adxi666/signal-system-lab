import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRightIcon, FlaskConicalIcon } from 'lucide-react'

import { labModules } from '@/assets/data/labs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = {
  title: '实验模块',
  description: '信号与系统交互式仿真实验'
}

export default function LabIndexPage() {
  return (
    <section className='relative -mt-16 overflow-hidden pt-32 pb-16'>
      <div className='from-primary/5 via-background to-background absolute inset-0 bg-gradient-to-b' />
      <div className='relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='mb-12 flex max-w-3xl flex-col gap-4'>
          <Badge variant='outline' className='w-fit'>
            <FlaskConicalIcon className='mr-1 size-4' />
            仿真实验
          </Badge>
          <h1 className='text-3xl font-semibold sm:text-4xl'>信号分析 Lab</h1>
          <p className='text-muted-foreground text-lg'>
            基于《信号与系统》（郑君里 第二版）教材章节，提供可交互的三维动画计算器。
            调节参数实时观察时域、频域与系统响应变化。
          </p>
        </div>

        <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {labModules.map(lab => (
            <Card key={lab.id} className='group bg-background shadow-sm transition-all hover:shadow-lg hover:-translate-y-0.5'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <Badge variant='secondary'>{lab.chapter}</Badge>
                  {lab.featured && <Badge className='bg-primary/10 text-primary border-0'>推荐</Badge>}
                </div>
                <CardTitle className='text-xl'>{lab.title}</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <p className='text-muted-foreground text-sm'>{lab.description}</p>
                <code className='bg-background block rounded px-2 py-1 font-mono text-xs'>{lab.formula}</code>
                <Button asChild className='w-full'>
                  <Link href={`/lab/${lab.slug}`}>
                    进入实验
                    <ArrowUpRightIcon className='ml-1 size-4' />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
