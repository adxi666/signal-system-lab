# Signal Lab 快速启动脚本
# 用于开发模式下同时启动前后端

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  信号与系统实验室 - 快速启动" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendDir = Join-Path $projectRoot "backend"
$htmlModelDir = Join-Path $projectRoot "html_model"

# 创建临时目录存放日志
$logDir = Join-Path $projectRoot "logs"
if (-not (Test-Path $logDir)) {
    New-Item -ItemType Directory -Path $logDir | Out-Null
}

Write-Host "项目目录: $projectRoot" -ForegroundColor Yellow
Write-Host ""

# 启动后端
Write-Host "启动后端服务..." -ForegroundColor Cyan
$backendLog = Join-Path $logDir "backend.log"
$backendProcess = Start-Process python -ArgumentList "main.py" -WorkingDirectory $backendDir -NoNewWindow -RedirectStandardOutput $backendLog -PassThru

Start-Sleep -Seconds 3

if ($backendProcess.HasExited) {
    Write-Host "[X] 后端启动失败！" -ForegroundColor Red
    Write-Host "日志内容:" -ForegroundColor Yellow
    Get-Content $backendLog
    exit 1
}

Write-Host "[OK] 后端已启动 (PID: $($backendProcess.Id))" -ForegroundColor Green
Write-Host "  后端地址: http://localhost:8000" -ForegroundColor Gray
Write-Host ""

# 启动前端
Write-Host "启动前端服务..." -ForegroundColor Cyan
Write-Host "前端将在新窗口中启动..." -ForegroundColor Yellow
Write-Host ""

# 检查是否已安装依赖
if (-not (Test-Path (Join-Path $htmlModelDir "node_modules"))) {
    Write-Host "首次运行，正在安装前端依赖..." -ForegroundColor Yellow
    Set-Location $htmlModelDir
    npm install
    Set-Location $projectRoot
}

# 打开浏览器
Start-Sleep -Seconds 2
Write-Host "正在打开浏览器..." -ForegroundColor Cyan
Start-Process "http://localhost:3000"

# 启动前端
Set-Location $htmlModelDir
npm run dev

# 清理
Write-Host ""
Write-Host "正在清理..." -ForegroundColor Cyan
Stop-Process -Id $backendProcess.Id -Force -ErrorAction SilentlyContinue
Write-Host "完成!" -ForegroundColor Green
