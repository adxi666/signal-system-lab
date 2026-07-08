"""FastAPI server for Signal Lab computation."""

from __future__ import annotations

from typing import Any

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

import signals

app = FastAPI(title="Signal Lab API", version="1.0.0")

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


@app.get("/")
def root():
    return {
        "name": "Signal Lab API",
        "textbook": "信号与系统（郑君里 第二版）",
        "endpoints": [
            "/api/signal",
            "/api/convolve",
            "/api/fourier-series",
            "/api/fourier-transform",
            "/api/lti",
        ],
    }


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


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
