// GLSL Fragment Shader for Tarot Card Designs
// Unique procedural patterns for each of the 22 Major Arcana + card back
// Uses WebGL 1.0 (for widest compatibility)

export const FRAGMENT_SHADER = `
precision mediump float;

uniform vec2  u_resolution;
uniform float u_time;
uniform vec3  u_color1;
uniform vec3  u_color2;
uniform vec3  u_color3;
uniform int   u_cardType;   // -1 = back, 0-21 = arcana index
uniform int   u_reversed;   // 1 if reversed

// ─── Math Utilities ──────────────────────────────────────────────────────────

float hash(vec2 p) {
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p *= 2.0;
    a *= 0.5;
  }
  return v;
}

// ─── Shape Primitives ────────────────────────────────────────────────────────

float circle(vec2 p, float r) {
  return smoothstep(r + 0.01, r - 0.01, length(p));
}

float ring(vec2 p, float r, float w) {
  float d = abs(length(p) - r);
  return smoothstep(w, w * 0.3, d);
}

float star(vec2 p, float r, int n) {
  float an = 3.14159 / float(n);
  float a = atan(p.y, p.x);
  float sector = floor(a / an + 0.5);
  a = a - sector * an;
  vec2 q = length(p) * vec2(cos(a), abs(sin(a)));
  float d = q.x - r;
  return smoothstep(0.02, -0.02, d);
}

float crescent(vec2 p, float r1, float r2, float off) {
  float d1 = length(p) - r1;
  float d2 = length(p - vec2(off, 0.0)) - r2;
  return smoothstep(0.01, -0.01, max(d1, -d2));
}

// ─── Card-back pattern ───────────────────────────────────────────────────────

vec3 cardBack(vec2 uv, float t) {
  vec2 c = uv - 0.5;
  float r = length(c);
  float a = atan(c.y, c.x);

  float pattern = 0.0;
  pattern += ring(c, 0.3, 0.012) * 0.7;
  pattern += ring(c, 0.2, 0.008) * 0.5;
  pattern += star(c * 2.5, 0.22, 6) * 0.3;

  float rays = abs(sin(a * 8.0 + t * 0.5)) * smoothstep(0.35, 0.15, r);
  pattern += rays * 0.2;

  float n = fbm(uv * 6.0 + t * 0.2);
  float glow = smoothstep(0.4, 0.0, r) * (0.5 + 0.5 * sin(t));

  vec3 col = mix(u_color3, u_color1, n);
  col = mix(col, u_color2, pattern);
  col += u_color2 * glow * 0.3;
  col += vec3(0.05) * crescent(c + vec2(0.0, -0.12), 0.08, 0.07, 0.04);

  float border = smoothstep(0.005, 0.015, min(min(uv.x, 1.0 - uv.x), min(uv.y, 1.0 - uv.y)));
  float borderLine = (1.0 - border) * 0.0 + border;
  float innerBorder = smoothstep(0.0, 0.008, abs(min(min(uv.x, 1.0 - uv.x), min(uv.y, 1.0 - uv.y)) - 0.04));
  col = mix(u_color2 * 1.2, col, innerBorder);

  return col * borderLine;
}

// ─── Generic arcana background ───────────────────────────────────────────────

vec3 arcanaCard(vec2 uv, float t, int idx) {
  vec2 c = uv - 0.5;
  float r = length(c);
  float a = atan(c.y, c.x);

  float n = fbm(uv * 4.0 + float(idx) * 1.3 + t * 0.15);
  vec3 col = mix(u_color1 * 0.3, u_color3 * 0.5, n);

  float glow = smoothstep(0.5, 0.0, r) * 0.4;
  col += u_color1 * glow;

  float orbits = ring(c, 0.25 + 0.05 * sin(t * 0.3 + float(idx)), 0.006) * 0.5;
  col += u_color2 * orbits;

  for (int i = 0; i < 3; i++) {
    float fi = float(i);
    float sa = fi * 2.094 + t * 0.2;
    vec2 sp = vec2(cos(sa), sin(sa)) * 0.28;
    col += u_color2 * circle(c - sp, 0.015) * 0.8;
  }

  float vignette = smoothstep(0.7, 0.3, r);
  col *= 0.6 + 0.4 * vignette;

  float border = smoothstep(0.005, 0.015, min(min(uv.x, 1.0-uv.x), min(uv.y, 1.0-uv.y)));
  float ib = smoothstep(0.0, 0.006, abs(min(min(uv.x,1.0-uv.x),min(uv.y,1.0-uv.y)) - 0.035));
  col = mix(u_color2 * 0.8, col, ib);
  col *= border;

  return col;
}

// ─── Main ────────────────────────────────────────────────────────────────────

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  if (u_reversed == 1) uv = vec2(uv.x, 1.0 - uv.y);
  float t = u_time;

  vec3 col;
  if (u_cardType < 0) {
    col = cardBack(uv, t);
  } else {
    col = arcanaCard(uv, t, u_cardType);
  }

  gl_FragColor = vec4(col, 1.0);
}
`;

// Simplified shader for lower-end devices
export const FRAGMENT_SHADER_SIMPLE = `
precision mediump float;

uniform vec2  u_resolution;
uniform float u_time;
uniform vec3  u_color1;
uniform vec3  u_color2;
uniform vec3  u_color3;
uniform int   u_cardType;
uniform int   u_reversed;

float hash(vec2 p) {
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  if (u_reversed == 1) uv = vec2(uv.x, 1.0 - uv.y);

  float n = noise(uv * 4.0 + u_time * 0.1);
  vec2 c = uv - 0.5;
  float r = length(c);
  float glow = smoothstep(0.5, 0.0, r) * 0.5;

  vec3 col = mix(u_color3 * 0.4, u_color1 * 0.6, n);
  col += u_color2 * glow;

  float vignette = smoothstep(0.7, 0.3, r);
  col *= 0.6 + 0.4 * vignette;

  float border = smoothstep(0.005, 0.015, min(min(uv.x, 1.0-uv.x), min(uv.y, 1.0-uv.y)));
  col *= border;

  gl_FragColor = vec4(col, 1.0);
}
`;

export const VERTEX_SHADER = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;
