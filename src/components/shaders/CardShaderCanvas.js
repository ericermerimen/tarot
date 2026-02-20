'use client';

import React, { useRef, useEffect, useCallback, useState } from 'react';
import { VERTEX_SHADER, FRAGMENT_SHADER, FRAGMENT_SHADER_SIMPLE } from './fragmentShader';

// Hex color string → [r, g, b] normalized (0-1)
function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return [
    parseInt(h.substring(0, 2), 16) / 255,
    parseInt(h.substring(2, 4), 16) / 255,
    parseInt(h.substring(4, 6), 16) / 255,
  ];
}

function compileShader(gl, type, source) {
  try {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  } catch {
    return null;
  }
}

function createProgram(gl, vsSource, fsSource) {
  try {
    const vs = compileShader(gl, gl.VERTEX_SHADER, vsSource);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) {
      if (vs) gl.deleteShader(vs);
      if (fs) gl.deleteShader(fs);
      return null;
    }
    const program = gl.createProgram();
    if (!program) return null;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      return null;
    }
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    return program;
  } catch {
    return null;
  }
}

/**
 * CardShaderCanvas
 *
 * Renders a single WebGL shader frame for a tarot card.
 * Falls back to a CSS gradient on devices where WebGL shaders fail to compile.
 */
export default function CardShaderCanvas({
  width = 180,
  height = 300,
  cardType = -1,
  colors = ['#9c7cf4', '#f4cf7c', '#6b4bc1'],
  reversed = false,
  animate = true,
}) {
  const canvasRef  = useRef(null);
  const glRef      = useRef(null);
  const progRef    = useRef(null);
  const unifRef    = useRef({});
  const bufRef     = useRef(null);
  const rafRef     = useRef(null);
  const startRef   = useRef(null);
  const visibleRef = useRef(true);
  const [webglFailed, setWebglFailed] = useState(false);

  // Stable color references to avoid unnecessary re-renders
  const c0 = colors[0] || '#9c7cf4';
  const c1 = colors[1] || '#f4cf7c';
  const c2 = colors[2] || '#6b4bc1';

  // Initialise WebGL once — tries full shader first, then simple fallback
  const initGL = useCallback(() => {
    try {
      const canvas = canvasRef.current;
      if (!canvas) return false;

      const gl = canvas.getContext('webgl', {
        antialias: false,
        alpha: false,
        depth: false,
        preserveDrawingBuffer: false,
        failIfMajorPerformanceCaveat: false,
      });
      if (!gl) return false;
      glRef.current = gl;

      // Try full shader first, fall back to simple shader for mobile
      let prog = createProgram(gl, VERTEX_SHADER, FRAGMENT_SHADER);
      if (!prog) {
        prog = createProgram(gl, VERTEX_SHADER, FRAGMENT_SHADER_SIMPLE);
      }
      if (!prog) return false;
      progRef.current = prog;

      // Cache uniform locations
      unifRef.current = {
        resolution: gl.getUniformLocation(prog, 'u_resolution'),
        time:       gl.getUniformLocation(prog, 'u_time'),
        color1:     gl.getUniformLocation(prog, 'u_color1'),
        color2:     gl.getUniformLocation(prog, 'u_color2'),
        color3:     gl.getUniformLocation(prog, 'u_color3'),
        cardType:   gl.getUniformLocation(prog, 'u_cardType'),
        reversed:   gl.getUniformLocation(prog, 'u_reversed'),
      };

      // Full-screen quad
      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
        gl.STATIC_DRAW
      );
      bufRef.current = buf;

      const posLoc = gl.getAttribLocation(prog, 'a_position');
      gl.enableVertexAttribArray(posLoc);
      gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

      // Handle context loss gracefully
      canvas.addEventListener('webglcontextlost', (e) => {
        e.preventDefault();
        cancelAnimationFrame(rafRef.current);
        glRef.current = null;
        progRef.current = null;
      });

      return true;
    } catch {
      return false;
    }
  }, []);

  // Render one frame
  const render = useCallback((timestamp) => {
    try {
      const gl   = glRef.current;
      const prog = progRef.current;
      const u    = unifRef.current;
      if (!gl || !prog || gl.isContextLost?.()) return;

      if (startRef.current === null) startRef.current = timestamp;
      const t = (timestamp - startRef.current) / 1000;

      const rgb1 = hexToRgb(c0);
      const rgb2 = hexToRgb(c1);
      const rgb3 = hexToRgb(c2);

      gl.useProgram(prog);
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.uniform2f(u.resolution, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.uniform1f(u.time, t);
      gl.uniform3fv(u.color1, rgb1);
      gl.uniform3fv(u.color2, rgb2);
      gl.uniform3fv(u.color3, rgb3);
      if (u.cardType !== null) gl.uniform1i(u.cardType, cardType);
      if (u.reversed !== null) gl.uniform1i(u.reversed, reversed ? 1 : 0);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    } catch {
      // WebGL error — stop rendering
      glRef.current = null;
    }
  }, [c0, c1, c2, cardType, reversed]);

  // Animation loop
  const loop = useCallback((timestamp) => {
    if (!visibleRef.current) return;
    render(timestamp);
    if (animate && glRef.current) {
      rafRef.current = requestAnimationFrame(loop);
    }
  }, [render, animate]);

  useEffect(() => {
    const ok = initGL();
    if (!ok) {
      setWebglFailed(true);
      return;
    }

    // IntersectionObserver pauses rendering when the card is off-screen
    const observer = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting && animate && glRef.current) {
          startRef.current = null;
          rafRef.current = requestAnimationFrame(loop);
        }
      },
      { threshold: 0.01 }
    );
    if (canvasRef.current) observer.observe(canvasRef.current);

    // Initial render
    if (animate) {
      rafRef.current = requestAnimationFrame(loop);
    } else {
      requestAnimationFrame((ts) => render(ts));
    }

    return () => {
      cancelAnimationFrame(rafRef.current);
      observer.disconnect();
      try {
        const gl = glRef.current;
        if (gl) {
          gl.getExtension('WEBGL_lose_context')?.loseContext();
        }
      } catch {
        // Ignore cleanup errors
      }
    };
  }, [initGL, loop, render, animate]);

  // Re-render on prop change (static mode)
  useEffect(() => {
    if (!animate && progRef.current) {
      requestAnimationFrame((ts) => render(ts));
    }
  }, [cardType, c0, c1, c2, reversed, animate, render]);

  // CSS gradient fallback when WebGL is not available
  if (webglFailed) {
    return (
      <div
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          background: `linear-gradient(135deg, ${c0} 0%, ${c2} 50%, ${c1} 100%)`,
          opacity: 0.85,
        }}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ display: 'block', width: '100%', height: '100%' }}
    />
  );
}
