'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import { VERTEX_SHADER, FRAGMENT_SHADER } from './fragmentShader';

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
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader compile error:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl, vsSource, fsSource) {
  const vs = compileShader(gl, gl.VERTEX_SHADER, vsSource);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, fsSource);
  if (!vs || !fs) return null;
  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program link error:', gl.getProgramInfoLog(program));
    return null;
  }
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  return program;
}

/**
 * CardShaderCanvas
 *
 * Renders a single WebGL shader frame for a tarot card.
 *
 * Props:
 *   width, height  – pixel dimensions
 *   cardType       – integer: -1 = card back, 0-21 = arcana index
 *   colors         – array of 3 hex color strings from the card data
 *   reversed       – boolean
 *   animate        – boolean (default true); set false for static thumbnails
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

  // Initialise WebGL once
  const initGL = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return false;

    const gl = canvas.getContext('webgl', {
      antialias: false,
      alpha: false,
      depth: false,
      preserveDrawingBuffer: false,
    });
    if (!gl) return false;
    glRef.current = gl;

    const prog = createProgram(gl, VERTEX_SHADER, FRAGMENT_SHADER);
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

    return true;
  }, []);

  // Render one frame
  const render = useCallback((timestamp) => {
    const gl   = glRef.current;
    const prog = progRef.current;
    const u    = unifRef.current;
    if (!gl || !prog) return;

    if (startRef.current === null) startRef.current = timestamp;
    const t = (timestamp - startRef.current) / 1000;

    const c1 = hexToRgb(colors[0] || '#9c7cf4');
    const c2 = hexToRgb(colors[1] || '#f4cf7c');
    const c3 = hexToRgb(colors[2] || '#6b4bc1');

    gl.useProgram(prog);
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.uniform2f(u.resolution, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.uniform1f(u.time, t);
    gl.uniform3fv(u.color1, c1);
    gl.uniform3fv(u.color2, c2);
    gl.uniform3fv(u.color3, c3);
    gl.uniform1i(u.cardType, cardType);
    gl.uniform1i(u.reversed, reversed ? 1 : 0);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }, [colors, cardType, reversed]);

  // Animation loop
  const loop = useCallback((timestamp) => {
    if (!visibleRef.current) return;
    render(timestamp);
    if (animate) {
      rafRef.current = requestAnimationFrame(loop);
    }
  }, [render, animate]);

  useEffect(() => {
    const ok = initGL();
    if (!ok) return;

    // IntersectionObserver pauses rendering when the card is off-screen
    const observer = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting && animate) {
          startRef.current = null; // reset so time doesn't jump
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
      // Static: render once
      requestAnimationFrame((ts) => render(ts));
    }

    return () => {
      cancelAnimationFrame(rafRef.current);
      observer.disconnect();
      const gl = glRef.current;
      if (gl) {
        gl.getExtension('WEBGL_lose_context')?.loseContext();
      }
    };
  }, [initGL, loop, render, animate]);

  // Re-render on prop change (static mode)
  useEffect(() => {
    if (!animate && progRef.current) {
      requestAnimationFrame((ts) => render(ts));
    }
  }, [cardType, colors, reversed, animate, render]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ display: 'block', width: '100%', height: '100%' }}
    />
  );
}
