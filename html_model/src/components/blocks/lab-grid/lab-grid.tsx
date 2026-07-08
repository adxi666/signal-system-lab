'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowUpRightIcon, FlaskConicalIcon } from 'lucide-react'

import { labModules } from '@/assets/data/labs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export type LabPost = {
  id: number
  slug: string
  title: string
  description: string
  chapter: string
  formula: string
  featured: boolean
}

const LabGrid = () => {
  const router = useRouter()

  return (
    <section id='labs' className='bg-muted py-12 sm:py-16 lg:py-24'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between'>
          <div>
            <Badge variant='outline' className='mb-3'>
              <FlaskConicalIcon className='mr-1 size-4' />
              全部实验
            </Badge>
            <h2 className='text-2xl font-semibold sm:text-3xl'>仿真实验模块</h2>
            <p className='text-muted-foreground mt-2 max-w-xl'>
              涵盖教材核心章节：基本信号、卷积、傅里叶级数/变换、LTI 系统分析。
            </p>
          </div>
          <Button variant='outline' asChild>
            <Link href='/lab'>查看全部</Link>
          </Button>
        </div>

        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {labModules.map(lab => (
            <Card
              key={lab.id}
              className='group cursor-pointer bg-background py-0 shadow-sm transition-all hover:shadow-lg hover:-translate-y-0.5'
              onClick={() => router.push(`/lab/${lab.slug}`)}
            >
              <CardContent className='flex flex-col gap-3 p-6'>
                <div className='flex items-center justify-between'>
                  <Badge variant='secondary'>{lab.chapter}</Badge>
                  {lab.featured && (
                    <Badge className='bg-primary/10 text-primary border-0 text-xs'>推荐</Badge>
                  )}
                </div>
                <h3 className='text-lg font-medium'>{lab.title}</h3>
                <p className='text-muted-foreground line-clamp-2 text-sm'>{lab.description}</p>
                <code className='bg-muted rounded px-2 py-1 font-mono text-xs'>{lab.formula}</code>
                <div className='flex justify-end pt-1'>
                  <Button size='icon' variant='outline' asChild>
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

export default LabGrid
