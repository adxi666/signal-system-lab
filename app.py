"""
Signal Lab 启动器
整合FastAPI后端和Web前端的独立应用
"""
import os
import sys
import threading
import time
import webbrowser
from pathlib import Path

# 添加后端路径
backend_path = Path(__file__).parent / "backend"
sys.path.insert(0, str(backend_path))

from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, HTMLResponse
from fastapi.exceptions import HTTPException
import uvicorn

# 导入信号处理模块
import signals

app = FastAPI(title="Signal Lab", version="1.0.0")

frontend_path = Path(__file__).parent / "html_model" / "out"

# 挂载 _next 静态资源目录（JS/CSS chunks）
next_static = frontend_path / "_next"
if next_static.exists():
    app.mount("/_next", StaticFiles(directory=str(next_static)), name="next_static")

# 挂载 public 资源目录
for pub_dir_name in ["favicon", "images"]:
    pub_dir = frontend_path / pub_dir_name
    if pub_dir.exists():
        app.mount(f"/{pub_dir_name}", StaticFiles(directory=str(pub_dir)), name=f"pub_{pub_dir_name}")

# API模型和端点
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Any

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SignalRequest(BaseModel):
    signal_type: str
    t_start: float = -2.0
    t_end: float = 5.0
    n: int = Field(default=500, ge=50, le=5000)
    params: dict[str, Any] = Field(default_factory=dict)

class ConvolveRequest(BaseModel):
    x_t: list[float]
    h_t: list[float]
    dt: float = 0.01

class FourierSeriesRequest(BaseModel):
    t_start: float = -2.0
    t_end: float = 2.0
    n: int = Field(default=500, ge=50, le=5000)
    T: float = 2.0
    n_harmonics: int = Field(default=5, ge=1, le=51)

class LTIRequest(BaseModel):
    system_type: str = "rc_lowpass"
    t_start: float = 0.0
    t_end: float = 5.0
    n: int = Field(default=500, ge=50, le=5000)
    input_type: str = "step"
    input_params: dict[str, Any] = Field(default_factory=dict)
    system_params: dict[str, Any] = Field(default_factory=dict)

@app.post("/api/signal")
def api_signal(req: SignalRequest):
    return signals.generate_signal(
        req.signal_type, req.t_start, req.t_end, req.n, req.params
    )

@app.post("/api/convolve")
def api_convolve(req: ConvolveRequest):
    return signals.convolve_signals(req.x_t, req.h_t, req.dt)

@app.post("/api/fourier-series")
def api_fourier_series(req: FourierSeriesRequest):
    return signals.fourier_series_square(
        req.t_start, req.t_end, req.n, req.T, req.n_harmonics
    )

@app.post("/api/fourier-transform")
def api_fourier_transform(req: SignalRequest):
    return signals.fourier_transform(
        req.signal_type, req.t_start, req.t_end, req.n, req.params
    )

@app.post("/api/lti")
def api_lti(req: LTIRequest):
    return signals.lti_response(
        req.system_type,
        req.t_start,
        req.t_end,
        req.n,
        req.input_type,
        req.input_params,
        req.system_params,
    )

# 前端路由 catch-all：优先匹配静态文件，其次 HTML 页面，最后 SPA 回退
@app.api_route("/{full_path:path}", methods=["GET", "HEAD"])
async def serve_frontend(full_path: str, request: Request):
    if not frontend_path.exists():
        return {
            "name": "Signal Lab API",
            "textbook": "信号与系统（郑君里 第二版）",
            "endpoints": [
                "/api/signal", "/api/convolve", "/api/fourier-series",
                "/api/fourier-transform", "/api/lti",
            ],
        }

    # 直接匹配文件（如 sitemap.xml, robots.txt, manifest.json 等）
    direct_file = frontend_path / full_path
    if direct_file.is_file():
        return FileResponse(str(direct_file))

    # 匹配 {path}.html（如 lab/calculator → lab/calculator.html）
    html_file = frontend_path / f"{full_path}.html"
    if html_file.is_file():
        return FileResponse(str(html_file))

    # 匹配 {path}/index.html（目录入口）
    index_in_dir = frontend_path / full_path / "index.html"
    if index_in_dir.is_file():
        return FileResponse(str(index_in_dir))

    # SPA 回退：返回根目录 index.html
    root_index = frontend_path / "index.html"
    if root_index.is_file():
        return FileResponse(str(root_index))

    raise HTTPException(status_code=404, detail="Not Found")


def open_browser():
    """在服务器启动后自动打开浏览器"""
    time.sleep(1.5)
    webbrowser.open("http://localhost:8000")

if __name__ == "__main__":
    print("=" * 50)
    print("  信号与系统实验室 - Signal Lab")
    print("=" * 50)
    print()
    print("正在启动服务器...")
    
    # 在新线程中打开浏览器
    browser_thread = threading.Thread(target=open_browser, daemon=True)
    browser_thread.start()
    
    # 启动服务器
    uvicorn.run(app, host="0.0.0.0", port=8000)
