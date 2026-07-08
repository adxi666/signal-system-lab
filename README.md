# Signal Lab — 信号与系统交互式仿真实验室

基于郑君里《信号与系统》（第二版）教材内容的交互式三维可视化实验室。集成 FastAPI 数值计算后端与 Three.js 三维渲染前端，支持独立打包为 Windows 可执行程序。

## 功能模块

| 模块 | 章节 | 内容 |
|------|------|------|
| 科学计算器 | — | 三角函数、对数、指数、幂运算等 |
| 基本信号可视化 | 第1章 | 阶跃、冲激、指数、正弦、矩形脉冲 |
| 卷积积分 | 第2章 | 滑动窗口动画演示卷积过程 |
| 傅里叶级数 | 第3章 | 方波谐波叠加三维可视化 |
| 傅里叶变换 | 第4章 | 时域-频域对照，幅频/相频曲线 |
| LTI 系统响应 | 第2章 | RC 低通、二阶系统零输入/零状态响应 |

## 技术栈

- **后端**：Python 3.11+ / FastAPI / NumPy / SciPy
- **前端**：Next.js 16 / React 19 / Three.js / React Three Fiber / Tailwind CSS / shadcn/ui
- **打包**：PyInstaller（单文件 exe）

## 项目结构

```
signal&system/
├── app.py                # 整合版入口（FastAPI + 前端静态资源服务）
├── SignalLab.spec        # PyInstaller 打包配置
├── build-simple.ps1      # 一键打包脚本
├── start-dev.ps1         # 开发模式快速启动
├── requirements.txt      # Python 依赖
├── backend/
│   ├── main.py           # 独立 API 服务
│   ├── signals.py        # 信号处理算法库
│   └── requirements.txt
└── html_model/
    ├── src/
    │   ├── app/           # Next.js 页面路由
    │   ├── components/
    │   │   ├── lab/       # 实验室交互组件
    │   │   ├── blocks/    # 页面区块组件
    │   │   └── ui/        # shadcn/ui 基础组件
    │   ├── lib/           # 前端信号算法 / API 客户端
    │   └── assets/        # 静态资源与数据
    ├── next.config.ts
    └── package.json
```

## 快速开始

### 开发模式

```bash
# 1. 安装 Python 依赖
pip install -r requirements.txt

# 2. 安装前端依赖
cd html_model
npm install

# 3. 一键启动（PowerShell）
cd ..
.\start-dev.ps1
```

或分别启动：

```bash
# 后端 (http://localhost:8000)
cd backend
python main.py

# 前端 (http://localhost:3000)
cd html_model
npm run dev
```

### 打包为 exe

```powershell
.\build-simple.ps1
```

生成的文件位于 `dist/SignalLab.exe`，双击运行即可。

## 离线模式

当前端无法连接后端 API 时，自动切换至纯前端本地计算模式（`lib/signals.ts`），无需后端即可完成所有实验。

## 教材对应

- 第1章：基本连续时间信号（阶跃、冲激、指数、正弦）
- 第2章：卷积积分与 LTI 系统时域分析
- 第3章：傅里叶级数
- 第4章：傅里叶变换

## 系统要求

| 环境 | 要求 |
|------|------|
| 开发 | Python 3.11+ / Node.js 18+ |
| 运行（exe） | Windows 10/11, 4GB+ 内存, 支持 WebGL 的浏览器 |

## 许可证

MIT License
