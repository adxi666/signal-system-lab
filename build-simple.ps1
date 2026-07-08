# Signal Lab 简化打包构建脚本
# 使用PyInstaller打包整合后的应用

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  信号与系统实验室 - 简化打包工具" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$ErrorActionPreference = "Stop"

# 检查Python是否安装
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✓ Python 已安装: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Python 未安装，请先安装 Python 3.8+" -ForegroundColor Red
    exit 1
}

# 设置工作目录
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$htmlModelDir = Join-Path $projectRoot "html_model"

Write-Host ""
Write-Host "项目根目录: $projectRoot" -ForegroundColor Yellow
Write-Host ""

# 步骤1: 构建前端
Write-Host "步骤1: 构建前端 (Next.js静态导出)" -ForegroundColor Cyan
Write-Host "----------------------------------------" -ForegroundColor Cyan

Set-Location $htmlModelDir

# 检查是否已安装依赖
if (-not (Test-Path "node_modules")) {
    Write-Host "安装前端依赖..." -ForegroundColor Yellow
    npm install
}

# 构建Next.js静态导出
Write-Host "构建Next.js应用..." -ForegroundColor Yellow
npm run build

Write-Host "✓ 前端构建完成!" -ForegroundColor Green
Write-Host ""

# 步骤2: 准备后端
Write-Host "步骤2: 准备后端依赖" -ForegroundColor Cyan
Write-Host "----------------------------------------" -ForegroundColor Cyan

Set-Location $projectRoot

# 复制signals.py到根目录
if (-not (Test-Path "signals.py")) {
    Copy-Item "backend\signals.py" . -Force
}

Write-Host "✓ 后端依赖已准备!" -ForegroundColor Green
Write-Host ""

# 步骤3: 使用PyInstaller打包
Write-Host "步骤3: 打包应用 (PyInstaller)" -ForegroundColor Cyan
Write-Host "----------------------------------------" -ForegroundColor Cyan

# 创建虚拟环境（如果不存在）
if (-not (Test-Path "venv")) {
    Write-Host "创建虚拟环境..." -ForegroundColor Yellow
    python -m venv venv
}

# 激活虚拟环境
Write-Host "激活虚拟环境..." -ForegroundColor Yellow
$venvScripts = Join-Path $projectRoot "venv\Scripts"
$activateScript = Join-Path $venvScripts "Activate.ps1"
. $activateScript

# 安装依赖
Write-Host "安装Python依赖..." -ForegroundColor Yellow
pip install -r requirements.txt

# 使用PyInstaller打包
Write-Host "打包应用..." -ForegroundColor Yellow
pyinstaller --clean SignalLab.spec

if (-not (Test-Path "dist\SignalLab.exe")) {
    Write-Host "✗ 打包失败！" -ForegroundColor Red
    exit 1
}

Write-Host "✓ 打包完成!" -ForegroundColor Green
Write-Host ""

# 步骤4: 清理临时文件
Write-Host "步骤4: 清理临时文件" -ForegroundColor Cyan
Write-Host "----------------------------------------" -ForegroundColor Cyan

# 清理临时文件
if (Test-Path "signals.py") {
    Remove-Item "signals.py" -Force
}

Write-Host "✓ 清理完成!" -ForegroundColor Green
Write-Host ""

# 完成
Write-Host "========================================" -ForegroundColor Green
Write-Host "  构建完成!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "可执行文件位置: $projectRoot\dist\SignalLab.exe" -ForegroundColor Yellow
Write-Host ""
Write-Host "使用说明:" -ForegroundColor Yellow
Write-Host "1. 直接运行 SignalLab.exe 即可启动应用"
Write-Host "2. 应用会自动打开默认浏览器"
Write-Host "3. 关闭控制台窗口即可退出应用"
Write-Host ""
Write-Host "系统要求:" -ForegroundColor Yellow
Write-Host "- Windows 10/11"
Write-Host "- 建议 4GB+ 内存"
Write-Host ""
