"""Signal & System computation engine — aligned with Zheng Junli textbook topics."""

from __future__ import annotations

import numpy as np
from scipy import signal as sp_signal


def linspace(start: float, stop: float, n: int) -> np.ndarray:
    return np.linspace(start, stop, n)


def unit_step(t: np.ndarray) -> np.ndarray:
    return np.where(t >= 0, 1.0, 0.0)


def unit_impulse(t: np.ndarray, width: float = 0.05) -> np.ndarray:
    """Approximate δ(t) as narrow rectangular pulse (Ch.1)."""
    return np.where(np.abs(t) <= width / 2, 1.0 / width, 0.0)


def exponential_signal(t: np.ndarray, a: float) -> np.ndarray:
    """e^{at} u(t)"""
    return np.exp(a * t) * unit_step(t)


def sinusoid(t: np.ndarray, omega: float, phi: float = 0.0, amp: float = 1.0) -> np.ndarray:
    return amp * np.cos(omega * t + phi)


def rectangular_pulse(t: np.ndarray, t1: float, t2: float) -> np.ndarray:
    return np.where((t >= t1) & (t <= t2), 1.0, 0.0)


def generate_signal(
    signal_type: str,
    t_start: float,
    t_end: float,
    n: int,
    params: dict,
) -> dict:
    t = linspace(t_start, t_end, n)

    if signal_type == "step":
        y = unit_step(t)
        formula = "u(t)"
    elif signal_type == "impulse":
        width = float(params.get("width", 0.05))
        y = unit_impulse(t, width)
        formula = f"δ(t) ≈ rect({width})"
    elif signal_type == "exponential":
        a = float(params.get("a", -1.0))
        y = exponential_signal(t, a)
        formula = f"e^({a}t)·u(t)"
    elif signal_type == "sinusoid":
        omega = float(params.get("omega", 2 * np.pi))
        phi = float(params.get("phi", 0.0))
        amp = float(params.get("amp", 1.0))
        y = sinusoid(t, omega, phi, amp)
        formula = f"{amp}·cos({omega:.2f}t + {phi:.2f})"
    elif signal_type == "rect":
        t1 = float(params.get("t1", -0.5))
        t2 = float(params.get("t2", 0.5))
        y = rectangular_pulse(t, t1, t2)
        formula = f"rect({t1}, {t2})"
    else:
        raise ValueError(f"Unknown signal type: {signal_type}")

    return {
        "t": t.tolist(),
        "y": y.tolist(),
        "formula": formula,
    }


def convolve_signals(
    x_t: list[float],
    h_t: list[float],
    dt: float,
) -> dict:
    x = np.array(x_t)
    h = np.array(h_t)
    y = np.convolve(x, h) * dt
    n = len(y)
    t = np.arange(n) * dt + (x_t[0] if x_t else 0) + (h_t[0] if h_t else 0)
    return {"t": t.tolist(), "y": y.tolist()}


def fourier_series_square(
    t_start: float,
    t_end: float,
    n: int,
    T: float,
    n_harmonics: int,
) -> dict:
    """Fourier series synthesis for square wave (Ch.3)."""
    t = linspace(t_start, t_end, n)
    y = np.zeros_like(t)
    harmonics = []
    omega0 = 2 * np.pi / T

    for k in range(1, n_harmonics + 1, 2):
        ak = 4.0 / (k * np.pi)
        component = ak * np.cos(k * omega0 * t)
        y += component
        harmonics.append(
            {
                "k": k,
                "amplitude": float(ak),
                "omega": float(k * omega0),
                "component": component.tolist(),
            }
        )

    return {
        "t": t.tolist(),
        "y": y.tolist(),
        "harmonics": harmonics,
        "omega0": float(omega0),
    }


def fourier_transform(
    signal_type: str,
    t_start: float,
    t_end: float,
    n: int,
    params: dict,
) -> dict:
    """Numerical FFT (Ch.4)."""
    sig = generate_signal(signal_type, t_start, t_end, n, params)
    t = np.array(sig["t"])
    y = np.array(sig["y"])
    dt = t[1] - t[0] if len(t) > 1 else 1.0

    Y = np.fft.fftshift(np.fft.fft(y)) * dt
    freqs = np.fft.fftshift(np.fft.fftfreq(n, dt))

    magnitude = np.abs(Y)
    phase = np.angle(Y)

    return {
        "time": {"t": sig["t"], "y": sig["y"], "formula": sig["formula"]},
        "frequency": {
            "f": freqs.tolist(),
            "magnitude": magnitude.tolist(),
            "phase": phase.tolist(),
        },
    }


def lti_response(
    system_type: str,
    t_start: float,
    t_end: float,
    n: int,
    input_type: str,
    input_params: dict,
    system_params: dict,
) -> dict:
    """LTI system impulse/step response (Ch.2)."""
    t = linspace(t_start, t_end, n)
    dt = t[1] - t[0]

    if system_type == "rc_lowpass":
        tau = float(system_params.get("tau", 1.0))
        h = (1.0 / tau) * np.exp(-t / tau) * unit_step(t)
        sys_label = f"RC lowpass τ={tau}"
    elif system_type == "second_order":
        wn = float(system_params.get("wn", 5.0))
        zeta = float(system_params.get("zeta", 0.5))
        sys = sp_signal.TransferFunction([wn**2], [1, 2 * zeta * wn, wn**2])
        _, h = sp_signal.impulse(sys, T=t)
        sys_label = f"2nd-order ωn={wn}, ζ={zeta}"
    else:
        raise ValueError(f"Unknown system: {system_type}")

    x_sig = generate_signal(input_type, t_start, t_end, n, input_params)
    x = np.array(x_sig["y"])
    y = np.convolve(x, h)[:n] * dt

    return {
        "t": t.tolist(),
        "input": x.tolist(),
        "impulse_response": h.tolist(),
        "output": y.tolist(),
        "input_formula": x_sig["formula"],
        "system_label": sys_label,
    }
