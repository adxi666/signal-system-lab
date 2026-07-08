import HeroSection from '@/components/blocks/hero-section/hero-section'
import LabGrid from '@/components/blocks/lab-grid/lab-grid'
import CTA from '@/components/blocks/cta-section/cta-section'

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      '@id': `${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}#app`,
      name: 'Signal Lab - 信号与系统仿真实验室',
      description:
        '基于郑君里《信号与系统》教材的交互式三维动画信号分析计算器，涵盖卷积、傅里叶变换与 LTI 系统。',
      url: `${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}`,
      applicationCategory: 'EducationalApplication',
      inLanguage: 'zh-CN'
    }
  ]
}

function WaveDivider({ flip = false }: { flip?: boolean }) {
  return (
    <div className='relative h-16 overflow-hidden'>
      <svg
        className={`absolute inset-0 h-full w-full ${flip ? '' : 'rotate-180'}`}
        preserveAspectRatio='none'
        viewBox='0 0 1200 120'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M0,30 C200,80 400,0 600,40 C800,80 1000,20 1200,50 L1200,120 L0,120 Z'
          className='fill-muted'
        />
      </svg>
    </div>
  )
}

const Home = () => {
  return (
    <div>
      <HeroSection />
      <WaveDivider />
      <LabGrid />
      <WaveDivider flip />
      <CTA />
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c')
        }}
      />
    </div>
  )
}

export default Home
