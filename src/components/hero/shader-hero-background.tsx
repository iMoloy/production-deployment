'use client'

import { useEffect, useRef } from 'react'

const VERT_SRC = `#version 300 es
in vec2 a_pos;
out vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`

const FRAG_SRC = `#version 300 es
precision highp float;
in vec2 v_uv;
out vec4 fragColor;

uniform float u_time;
uniform vec2 u_res;
uniform vec2 u_mouse;

mat2 rot2D(float a) {
  float s = sin(a), c = cos(a);
  return mat2(c, -s, s, c);
}

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise2D(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0, amp = 0.5, freq = 1.0;
  mat2 r = rot2D(0.5);
  for(int i = 0; i < 4; i++) {
    v += amp * noise2D(p * freq);
    p = r * p * 2.02 + vec2(1.7, 4.3);
    amp *= 0.5;
  }
  return v;
}

vec3 cosinePalette(float t) {
  // Obsidian Deep Tech palette: Indigo, slate blue, sapphire glow
  vec3 a = vec3(0.04, 0.06, 0.12);
  vec3 b = vec3(0.25, 0.30, 0.45);
  vec3 c = vec3(1.0, 1.0, 1.0);
  vec3 d = vec3(0.10, 0.25, 0.45);
  return a + b * cos(6.2831853 * (c * t + d));
}

void main() {
  vec2 uv = (gl_FragCoord.xy * 2.0 - u_res.xy) / min(u_res.x, u_res.y);
  vec2 m = (u_mouse * 2.0 - u_res.xy) / min(u_res.x, u_res.y);
  m.y = -m.y;

  vec2 toM = uv - m;
  float d = length(toM);
  vec2 pull = (toM / (d * d + 0.35)) * 0.15;

  float t = u_time * 0.25;
  vec2 p = uv * 1.5 + pull * 0.35;
  vec2 q = vec2(fbm(p + t * 0.12), fbm(p + vec2(5.2, 1.3) - t * 0.10));
  vec2 r = vec2(fbm(p + 3.0 * q + t * 0.15), fbm(p + 3.0 * q - t * 0.14));
  float f = fbm(p + 3.5 * r);

  float metric = f + length(q) * 0.35 + length(r) * 0.25;
  vec3 color = cosinePalette(metric);
  color *= (f * f * 2.0 + 0.5 * f);

  // Center contrast scrim for headline readability
  float centerDist = length(uv * vec2(1.0, 1.35));
  float scrim = smoothstep(0.2, 0.9, centerDist);
  color = mix(color * 0.4, color, scrim);

  // Edge vignette
  color *= smoothstep(1.7, 0.5, length(uv));

  fragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}`

export function ShaderHeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext('webgl2', {
      alpha: false,
      depth: false,
      stencil: false,
      antialias: false,
      powerPreference: 'high-performance',
    })

    if (!gl) return

    const compile = (src: string, type: number) => {
      const s = gl.createShader(type)
      if (!s) return null
      gl.shaderSource(s, src)
      gl.compileShader(s)
      return s
    }

    const vs = compile(VERT_SRC, gl.VERTEX_SHADER)
    const fs = compile(FRAG_SRC, gl.FRAGMENT_SHADER)
    if (!vs || !fs) return

    const prog = gl.createProgram()
    if (!prog) return
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)
    gl.useProgram(prog)

    const quad = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, quad)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    )

    const posLoc = gl.getAttribLocation(prog, 'a_pos')
    gl.enableVertexAttribArray(posLoc)
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0)

    const uTimeLoc = gl.getUniformLocation(prog, 'u_time')
    const uResLoc = gl.getUniformLocation(prog, 'u_res')
    const uMouseLoc = gl.getUniformLocation(prog, 'u_mouse')

    let animId: number | null = null
    const startTime = performance.now()
    const mouse = { currX: 0, currY: 0, targX: 0, targY: 0 }

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      mouse.targX = (e.clientX - rect.left) * dpr
      mouse.targY = (e.clientY - rect.top) * dpr
    }
    window.addEventListener('pointermove', onPointerMove)

    const render = (timeSec: number) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = Math.round(canvas.clientWidth * dpr)
      const h = Math.round(canvas.clientHeight * dpr)

      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
        gl.viewport(0, 0, w, h)
      }

      mouse.currX += (mouse.targX - mouse.currX) * 0.08
      mouse.currY += (mouse.targY - mouse.currY) * 0.08

      gl.uniform1f(uTimeLoc, timeSec)
      gl.uniform2f(uResLoc, w, h)
      gl.uniform2f(uMouseLoc, mouse.currX, mouse.currY)
      gl.drawArrays(gl.TRIANGLES, 0, 6)
    }

    const loop = (now: number) => {
      const elapsed = (now - startTime) * 0.001
      render(elapsed)
      if (!document.hidden) {
        animId = requestAnimationFrame(loop)
      }
    }

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (motionQuery.matches) {
      render(2.45) // Single static frame for reduced motion (0% GPU burn)
    } else {
      animId = requestAnimationFrame(loop)
    }

    const onVisibilityChange = () => {
      if (document.hidden) {
        if (animId !== null) cancelAnimationFrame(animId)
      } else if (!motionQuery.matches) {
        animId = requestAnimationFrame(loop)
      }
    }
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      if (animId !== null) cancelAnimationFrame(animId)
      window.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      gl.deleteBuffer(quad)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
      gl.deleteProgram(prog)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none -z-10 select-none opacity-80"
      aria-hidden="true"
    />
  )
}
