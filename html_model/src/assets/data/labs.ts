export type LabModule = {
  id: string
  slug: string
  title: string
  chapter: string
  description: string
  formula: string
  featured: boolean
}

export const labModules: LabModule[] = [
  {
    id: '0',
    slug: 'calculator',
    title: '科学计算器',
    chapter: '工具',
    description: '信号与系统专用科学计算器，支持三角函数、对数、指数等运算。',
    formula: '科学计算工具',
    featured: true
  },
  {
    id: '1',
    slug: 'basic-signals',
    title: '基本连续时间信号',
    chapter: '第1章',
    description: '可视化单位阶跃 u(t)、冲激 δ(t)、指数 e^{at} 与正弦信号，理解信号的基本分类与性质。',
    formula: 'x(t) = A·cos(ωt + φ)',
    featured: true
  },
  {
    id: '2',
    slug: 'convolution',
    title: '卷积积分',
    chapter: '第2章',
    description: '通过滑动窗口动画理解 y(t) = x(t)*h(t)，观察 LTI 系统的零状态响应。',
    formula: 'y(t) = ∫ x(τ)h(t−τ)dτ',
    featured: true
  },
  {
    id: '3',
    slug: 'fourier-series',
    title: '傅里叶级数',
    chapter: '第3章',
    description: '方波信号的谐波叠加合成，观察各次谐波分量如何逼近周期信号。',
    formula: 'x(t) = Σ a_k cos(kω₀t)',
    featured: false
  },
  {
    id: '4',
    slug: 'fourier-transform',
    title: '傅里叶变换',
    chapter: '第4章',
    description: '时域与频域的三维对照视图，理解幅度谱与相位谱的物理意义。',
    formula: 'X(jω) = ∫ x(t)e^{−jωt}dt',
    featured: true
  },
  {
    id: '5',
    slug: 'lti-system',
    title: 'LTI 系统响应',
    chapter: '第2章',
    description: 'RC 低通与二阶系统的冲激响应与阶跃响应，验证卷积-乘法对应关系。',
    formula: 'Y(jω) = H(jω)X(jω)',
    featured: false
  }
]

export function getLabBySlug(slug: string): LabModule | undefined {
  return labModules.find(l => l.slug === slug)
}
