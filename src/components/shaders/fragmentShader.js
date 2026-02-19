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
  vec2  shift = vec2(100.0);
  mat2  rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p  = rot * p * 2.0 + shift;
    a *= 0.5;
  }
  return v;
}

// Domain-warped fbm for organic look
float warpedFbm(vec2 p, float t) {
  vec2 q = vec2(fbm(p + vec2(0.0, 0.0) + t * 0.1),
                fbm(p + vec2(5.2, 1.3) + t * 0.1));
  return fbm(p + 4.0 * q + t * 0.05);
}

mat2 rot2(float a) {
  float c = cos(a), s = sin(a);
  return mat2(c, -s, s, c);
}

float sdCircle(vec2 p, float r) { return length(p) - r; }
float sdBox(vec2 p, vec2 b) {
  vec2 d = abs(p) - b;
  return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
}
float sdLine(vec2 p, vec2 a, vec2 b) {
  vec2 pa = p - a, ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h);
}

// Star SDF (n-pointed)
float sdStar(vec2 p, float r, float rf, int n) {
  float an = 3.14159 / float(n);
  float en = 3.14159 / rf;
  vec2  acs = vec2(cos(an), sin(an));
  vec2  ecs = vec2(cos(en), sin(en));
  float bn = mod(atan(p.y, p.x), 2.0 * an) - an;
  p = length(p) * vec2(cos(bn), abs(sin(bn)));
  p -= r * acs;
  p += ecs * clamp(-dot(p, ecs), 0.0, r * acs.y / ecs.y);
  return length(p) * sign(p.x);
}

// Hexagonal tiling
vec2 hexCoord(vec2 p) {
  vec2 s = vec2(1.0, 1.732);
  vec2 a = mod(p, s) - s * 0.5;
  vec2 b = mod(p - s * 0.5, s) - s * 0.5;
  return dot(a, a) < dot(b, b) ? a : b;
}

// ─── Colour Helpers ───────────────────────────────────────────────────────────

vec3 palette(float t, vec3 c1, vec3 c2, vec3 c3) {
  if (t < 0.5) return mix(c1, c2, t * 2.0);
  return mix(c2, c3, (t - 0.5) * 2.0);
}

vec3 toLinear(vec3 c) { return c * c; }  // quick gamma correction

// ─── Card Back ────────────────────────────────────────────────────────────────
// Deep cosmic nebula + sacred-geometry mandala

vec3 pattern_back(vec2 uv, float t) {
  vec2 center = uv - 0.5;
  float dist  = length(center);
  float angle = atan(center.y, center.x);

  // Animated nebula via domain-warped fbm
  float n1 = warpedFbm(uv * 3.0, t);
  float n2 = warpedFbm(uv * 5.0 + 10.0, t * 0.7);

  vec3 deep   = vec3(0.04, 0.02, 0.12);
  vec3 nebula = mix(vec3(0.38, 0.18, 0.75), vec3(0.85, 0.72, 0.2), n2);
  vec3 col    = mix(deep, nebula, n1 * 0.7);

  // Mandala rings
  for (int i = 1; i <= 4; i++) {
    float r    = 0.08 * float(i) + 0.02 * sin(t * 0.5 + float(i));
    float ring = smoothstep(0.008, 0.0, abs(dist - r));
    col = mix(col, vec3(0.95, 0.85, 0.35), ring * 0.8);
  }

  // 8-fold radial spokes
  float spokes = abs(sin(angle * 8.0 + t * 0.3));
  spokes = smoothstep(0.92, 1.0, spokes) * smoothstep(0.42, 0.0, dist);
  col = mix(col, vec3(0.7, 0.55, 0.9), spokes * 0.4);

  // Central paw-print glow
  float glow = exp(-dist * 5.0) * (0.7 + 0.3 * sin(t * 1.2));
  col += vec3(0.5, 0.3, 0.9) * glow * 0.8;

  // Tiny twinkling stars
  vec2 stGrid = uv * 30.0;
  float starId  = hash(floor(stGrid));
  float starGlow = hash(floor(stGrid) + 0.5);
  float twinkle  = smoothstep(0.85, 1.0, starId) *
                   (0.5 + 0.5 * sin(t * (2.0 + starGlow * 4.0)));
  col += twinkle * 0.9;

  return col;
}

// ─── 0 · The Fool – Golden Retriever Puppy ───────────────────────────────────
// Airy sky: wind-swept clouds, golden sunrise, dancing butterflies

vec3 pattern_fool(vec2 uv, float t, vec3 c1, vec3 c2, vec3 c3) {
  // Sky gradient
  vec3 sky    = mix(vec3(0.53, 0.81, 0.98), vec3(1.0, 0.95, 0.75), uv.y);
  // Wind scrolling
  vec2 flow   = uv + vec2(t * 0.08, sin(uv.x * 5.0 + t) * 0.04);
  float cloud = fbm(flow * 4.0);
  vec3  col   = mix(sky, vec3(1.0), smoothstep(0.45, 0.7, cloud) * 0.9);

  // Sun disc at top-centre
  float sunD = sdCircle(uv - vec2(0.5, 0.88), 0.12);
  col = mix(col, vec3(1.0, 0.95, 0.5), smoothstep(0.01, -0.01, sunD));
  col += vec3(1.0, 0.85, 0.3) * exp(-max(sunD, 0.0) * 20.0) * 0.6;

  // Butterfly flutter
  for (int i = 0; i < 4; i++) {
    float phase = float(i) * 1.57;
    vec2  bpos  = vec2(0.5 + 0.35 * cos(t * 0.7 + phase),
                       0.5 + 0.25 * sin(t * 0.5 + phase * 1.3));
    float wing  = sdCircle(uv - bpos, 0.025 + 0.01 * sin(t * 5.0 + phase));
    col = mix(col, c2, smoothstep(0.005, -0.005, wing) * 0.9);
  }

  // Ground strip
  float ground = smoothstep(0.14, 0.0, uv.y);
  col = mix(col, mix(c1, c3, uv.x) * 0.6, ground);
  return col;
}

// ─── 1 · The Magician – Border Collie ────────────────────────────────────────
// Electric: arcs of lightning, infinity symbol, crackling aura

vec3 pattern_magician(vec2 uv, float t, vec3 c1, vec3 c2, vec3 c3) {
  vec2 center = uv - 0.5;
  vec3 col    = mix(vec3(0.04, 0.0, 0.12), c1 * 0.15, length(center));

  // Background crackle noise
  float crack = fbm(uv * 8.0 - t * 0.2);
  col += c2 * crack * 0.1;

  // Radial lightning arcs
  float angle = atan(center.y, center.x);
  float dist  = length(center);
  for (int i = 0; i < 6; i++) {
    float a   = float(i) * 1.047 + t * 0.4;
    float arc = abs(sin(angle * 3.0 - a));
    arc = pow(arc, 30.0) * smoothstep(0.5, 0.1, dist);
    col += c2 * arc * 1.5;
  }

  // Infinity lemniscate glow
  float sc = 0.22;
  vec2  q  = center / sc;
  float lem = abs((q.x * q.x + q.y * q.y) * (q.x * q.x + q.y * q.y) -
                  (q.x * q.x - q.y * q.y));
  float inf = smoothstep(0.12, 0.0, lem * sc * sc);
  col = mix(col, c3, inf * 0.8);

  // Central glow burst
  col += c2 * exp(-dist * 8.0) * (0.8 + 0.2 * sin(t * 3.0));
  return col;
}

// ─── 2 · The High Priestess – Shiba Inu ──────────────────────────────────────
// Still moonlit water: reflection columns, deep blue, lunar halo

vec3 pattern_high_priestess(vec2 uv, float t, vec3 c1, vec3 c2, vec3 c3) {
  vec3 dark  = vec3(0.02, 0.03, 0.12);
  vec3 col   = mix(dark, c1 * 0.3, uv.y);

  // Moon halo
  float moonD = sdCircle(uv - vec2(0.5, 0.82), 0.1);
  col = mix(col, vec3(0.95, 0.95, 1.0), smoothstep(0.005, -0.005, moonD));
  col += c2 * exp(-max(moonD, 0.0) * 18.0) * 0.7;

  // Water ripple reflections
  float ripple = sin((uv.x - 0.5) * 25.0 + sin(uv.y * 10.0 + t) * 0.5 + t * 1.2) * 0.5 + 0.5;
  float water  = smoothstep(0.35, 0.0, uv.y);
  col = mix(col, c1 * 0.8 + c2 * ripple * 0.3, water * ripple * 0.5);

  // Tall column silhouettes
  for (int i = 0; i < 2; i++) {
    float cx  = (float(i) == 0.0) ? 0.2 : 0.8;
    float col_ = sdBox(uv - vec2(cx, 0.4), vec2(0.055, 0.42));
    col = mix(col, c3 * 0.25, smoothstep(0.005, -0.005, col_));
  }

  // Veil of stars
  vec2 sg = uv * 28.0;
  float starBright = smoothstep(0.88, 1.0, hash(floor(sg)));
  starBright *= 0.5 + 0.5 * sin(t * 1.5 + hash(floor(sg) + 1.0) * 6.28);
  col += starBright * 0.9;
  return col;
}

// ─── 3 · The Empress – Corgi ─────────────────────────────────────────────────
// Lush garden: organic growth, blooming flowers, verdant vines

vec3 pattern_empress(vec2 uv, float t, vec3 c1, vec3 c2, vec3 c3) {
  float n = warpedFbm(uv * 3.5 + t * 0.06, t);
  vec3  col = mix(c1 * 0.4, c2 * 0.7, n);

  // Flower cluster petals using polar SDF
  for (int i = 0; i < 5; i++) {
    float ph  = float(i) * 1.256 + t * 0.15;
    vec2  fp  = uv - vec2(0.5 + 0.3 * cos(ph), 0.5 + 0.3 * sin(ph));
    float star = sdStar(fp * 8.0, 0.5, 2.0, 5);
    col = mix(col, c3, smoothstep(0.05, -0.05, star) * 0.85);
    // Petal centre
    float cent = sdCircle(fp, 0.018);
    col = mix(col, vec3(1.0, 0.95, 0.6), smoothstep(0.005, -0.005, cent));
  }

  // Vine tendrils
  for (int v = 0; v < 3; v++) {
    float vph  = float(v) * 2.09;
    float vine = sin(uv.x * 10.0 + sin(uv.y * 7.0 + vph + t * 0.2) + t * 0.1);
    vine = smoothstep(0.88, 1.0, abs(vine));
    col = mix(col, c2 * 0.9, vine * 0.6);
  }

  // Soft sky
  col = mix(col, mix(c1, vec3(0.9, 1.0, 0.9), 0.4), smoothstep(0.5, 1.0, uv.y) * 0.5);
  return col;
}

// ─── 4 · The Emperor – German Shepherd ───────────────────────────────────────
// Solid earth: fortress geometry, stone grid, authoritative red tones

vec3 pattern_emperor(vec2 uv, float t, vec3 c1, vec3 c2, vec3 c3) {
  // Stone grid
  vec2  grid = fract(uv * 7.0) - 0.5;
  float stone = sdBox(grid, vec2(0.42));
  vec3  col   = mix(c1 * 0.6, c1 * 0.85, smoothstep(-0.04, 0.0, stone));
  // Grout lines
  col = mix(col, c2 * 0.3, smoothstep(0.0, 0.03, stone) * smoothstep(0.06, 0.03, stone));

  // Battlement silhouette (top)
  float batt = step(0.78, uv.y);
  float tooth = step(0.5, fract(uv.x * 8.0)) * step(uv.y, 0.92);
  col = mix(col, c3 * 0.4, batt * (1.0 - tooth));

  // Eagle/mountain outline (peak at centre)
  vec2  mc  = uv - vec2(0.5, 0.35);
  float mnt = sdBox(mc * rot2(0.785), vec2(0.22, 0.18));
  col = mix(col, c2 * 0.5, smoothstep(0.01, -0.01, mnt) * 0.6);

  // Warm vignette
  float vig = 1.0 - dot(uv - 0.5, uv - 0.5) * 2.0;
  col *= clamp(vig, 0.0, 1.0);
  return col;
}

// ─── 5 · The Hierophant – Saint Bernard ──────────────────────────────────────
// Sacred geometry: nested pentagrams, golden ratios, divine light

vec3 pattern_hierophant(vec2 uv, float t, vec3 c1, vec3 c2, vec3 c3) {
  vec2  center = uv - 0.5;
  float dist   = length(center);
  float angle  = atan(center.y, center.x);
  vec3  col    = mix(c1 * 0.2, c3 * 0.15, dist);

  // Concentric pentagrams
  for (int i = 1; i <= 4; i++) {
    float r  = 0.08 * float(i);
    float st = sdStar(center, r, 2.618, 5);
    col = mix(col, c2, smoothstep(0.006, -0.006, st) * 0.85);
  }

  // Radiant light beams
  float beam = abs(sin(angle * 8.0 + t * 0.15));
  beam = pow(beam, 20.0) * smoothstep(0.5, 0.0, dist);
  col += c2 * 0.7 * beam;

  // Outer ring ornament
  float ring = smoothstep(0.008, 0.0, abs(dist - 0.45));
  col = mix(col, c2 * 0.9, ring);

  // Central divine glow
  col += c3 * exp(-dist * 12.0) * 0.9;
  return col;
}

// ─── 6 · The Lovers – Two Huskies ────────────────────────────────────────────
// Rose glow: intertwining hearts, warm gradient, rose petals raining

vec3 pattern_lovers(vec2 uv, float t, vec3 c1, vec3 c2, vec3 c3) {
  vec3 col = mix(c1 * 0.8, c3 * 0.5, uv.y);

  // Heart SDF (parametric)
  for (int h = 0; h < 2; h++) {
    float ox  = (float(h) == 0.0) ? -0.15 : 0.15;
    vec2  hc  = (uv - vec2(0.5 + ox, 0.55)) * 6.0;
    hc.y     -= sqrt(abs(hc.x)) * 0.7;
    float heart = length(hc) - 1.0;
    col = mix(col, c2, smoothstep(0.06, -0.06, heart) * 0.9);
    col += c2 * exp(-max(heart, 0.0) * 2.0) * 0.3;
  }

  // Falling rose petals
  for (int p = 0; p < 8; p++) {
    float ph   = float(p) * 0.785;
    float fall = fract(uv.y * 0.5 + t * 0.1 + ph * 0.1);
    vec2  pp   = vec2(0.1 + float(p) * 0.11, fall);
    float petal = sdCircle(uv - pp, 0.018);
    col = mix(col, c3, smoothstep(0.005, -0.005, petal) * 0.8);
  }

  // Warm glow in centre
  float glow = exp(-length(uv - 0.5) * 5.0);
  col += vec3(1.0, 0.8, 0.7) * glow * 0.3;
  return col;
}

// ─── 7 · The Chariot – Sled Dogs ─────────────────────────────────────────────
// Speed: motion blur streaks, chevron, night rush

vec3 pattern_chariot(vec2 uv, float t, vec3 c1, vec3 c2, vec3 c3) {
  vec3 col = mix(c1 * 0.15, c3 * 0.1, uv.y);

  // Horizontal speed streaks
  float speed = uv.x - t * 0.5;
  for (int i = 0; i < 9; i++) {
    float y   = 0.1 + float(i) * 0.1;
    float len = 0.3 + hash(vec2(float(i), 0.0)) * 0.4;
    float streak = sdBox(vec2(fract(speed + hash(vec2(float(i), 1.0))) - 0.5,
                              uv.y - y), vec2(len, 0.004));
    col = mix(col, c2, smoothstep(0.003, -0.003, streak) * 0.8);
  }

  // Chevron arrow
  vec2  ch = uv - vec2(0.5, 0.5);
  float arrow = abs(ch.y) - abs(ch.x) * 0.7 - 0.05;
  col = mix(col, c2, smoothstep(0.01, -0.01, arrow) * smoothstep(0.25, 0.0, abs(ch.x)) * 0.9);

  // Ground snow blur
  float snow = fbm(uv * 10.0 + vec2(-t * 0.6, 0.0));
  col = mix(col, vec3(0.9, 0.95, 1.0) * 0.6, smoothstep(0.1, 0.0, uv.y) * snow);

  return col;
}

// ─── 8 · Strength – Pit Bull ─────────────────────────────────────────────────
// Flame and courage: roiling fire, lion-like solar energy

vec3 pattern_strength(vec2 uv, float t, vec3 c1, vec3 c2, vec3 c3) {
  // Flame base
  float f1 = fbm(vec2(uv.x * 3.0, uv.y * 2.0 - t * 0.7));
  float f2 = fbm(vec2(uv.x * 4.0 + 10.0, uv.y * 2.5 - t * 1.0));
  float fire = f1 * 0.6 + f2 * 0.4;
  fire = smoothstep(0.3, 0.8, fire + uv.y * 0.4 - 0.15);

  vec3 col = mix(vec3(0.05, 0.01, 0.0), mix(c1, c2, uv.y), fire);
  col = mix(col, vec3(1.0, 1.0, 0.7), fire * fire * 0.7);

  // Infinity of strength: concentric growing circles
  float dist = length(uv - 0.5);
  for (int i = 1; i <= 3; i++) {
    float r   = float(i) * 0.12 + 0.02 * sin(t * 1.5 + float(i));
    float ring = smoothstep(0.01, 0.0, abs(dist - r));
    col = mix(col, c3, ring * 0.7);
  }

  return col;
}

// ─── 9 · The Hermit – Old Akita ──────────────────────────────────────────────
// A single lantern glowing in star-lit darkness, path of light

vec3 pattern_hermit(vec2 uv, float t, vec3 c1, vec3 c2, vec3 c3) {
  vec3 col = mix(c1 * 0.08, c3 * 0.05, uv.y);

  // Lantern glow
  vec2  lp   = uv - vec2(0.5, 0.45);
  float lamp = exp(-length(lp) * 7.0) * (0.9 + 0.1 * sin(t * 2.0));
  col += c2 * lamp * 2.0;

  // Lantern hex shape
  float hexD = sdBox(lp * vec2(11.0, 14.0), vec2(1.0, 1.0));
  col = mix(col, mix(c2, vec3(1.0, 0.9, 0.6), 0.7), smoothstep(0.06, -0.06, hexD) * 0.9);

  // Winding staff path
  float path = sin(uv.x * 12.0 + t * 0.3) * 0.03;
  float rod  = sdLine(uv, vec2(0.5 + path, 0.0), vec2(0.5, 1.0));
  col = mix(col, c1 * 0.7, smoothstep(0.006, -0.006, rod - 0.004) * 0.7);

  // Star trail
  vec2 sg = uv * 25.0;
  float s = smoothstep(0.9, 1.0, hash(floor(sg)));
  s *= 0.4 + 0.6 * sin(t * 0.8 + hash(floor(sg) + 2.0) * 6.28);
  col += s * 0.95;

  return col;
}

// ─── 10 · Wheel of Fortune – Dalmatian ───────────────────────────────────────
// Spinning mandala: golden ratio spiral, fate vortex

vec3 pattern_wheel(vec2 uv, float t, vec3 c1, vec3 c2, vec3 c3) {
  vec2  center = uv - 0.5;
  float dist   = length(center);
  float angle  = atan(center.y, center.x);

  // Rotating spiral bands
  float spiral = fract((angle / 6.283 + log(dist + 0.01) * 0.5) * 8.0 - t * 0.3);
  vec3  col    = mix(c1 * 0.3, c3 * 0.5, spiral);

  // Wheel spokes (8)
  float spokes = abs(sin(angle * 8.0 + t * 0.5));
  spokes = pow(spokes, 25.0) * smoothstep(0.5, 0.0, dist);
  col += c2 * spokes;

  // Concentric rings
  for (int i = 1; i <= 5; i++) {
    float r   = 0.08 * float(i);
    float ring = smoothstep(0.007, 0.0, abs(dist - r));
    col = mix(col, c2, ring * 0.9);
  }

  // Centre dot
  col = mix(col, vec3(1.0), smoothstep(0.02, 0.0, dist));

  return col;
}

// ─── 11 · Justice – Doberman ─────────────────────────────────────────────────
// Perfect balance: scales geometry, laser-precise lines, crystalline clarity

vec3 pattern_justice(vec2 uv, float t, vec3 c1, vec3 c2, vec3 c3) {
  vec3 col = mix(c1 * 0.15, c3 * 0.1, abs(uv.x - 0.5) * 2.0);

  // Perfect grid
  vec2 grid = fract(uv * 12.0);
  float lines = smoothstep(0.96, 1.0, max(grid.x, grid.y));
  col = mix(col, c2 * 0.5, lines * 0.4);

  // Scales beam (horizontal bar)
  float beam = sdBox(uv - vec2(0.5, 0.6), vec2(0.35, 0.005));
  col = mix(col, c2, smoothstep(0.003, -0.003, beam));

  // Left and right scale pans
  for (int p = 0; p < 2; p++) {
    float px   = (float(p) == 0.0) ? 0.17 : 0.83;
    float swing = 0.02 * sin(t * 0.7 + float(p) * 3.14159);
    vec2  sc    = uv - vec2(px, 0.52 + swing);
    float pan   = sdBox(sc, vec2(0.08, 0.005));
    col = mix(col, c3, smoothstep(0.003, -0.003, pan));
    // Chain
    float chain = sdLine(uv, vec2(px, 0.6), vec2(px, 0.52 + swing));
    col = mix(col, c2 * 0.9, smoothstep(0.003, -0.003, chain - 0.003));
  }

  // Sword blade
  float sword = sdBox((uv - vec2(0.5, 0.35)) * rot2(3.14159), vec2(0.005, 0.2));
  col = mix(col, mix(c2, vec3(1.0), 0.5), smoothstep(0.003, -0.003, sword));

  return col;
}

// ─── 12 · The Hanged Man – Basset Hound ──────────────────────────────────────
// Suspended crystal: water drops hanging, inverted world, serene stillness

vec3 pattern_hanged(vec2 uv, float t, vec3 c1, vec3 c2, vec3 c3) {
  vec3 col = mix(c3 * 0.2, c1 * 0.15, uv.y);

  // Hanging rope
  float rope = sdLine(uv, vec2(0.5, 1.0), vec2(0.5, 0.75));
  col = mix(col, c2 * 0.7, smoothstep(0.006, -0.006, rope - 0.004));

  // Crystal droplets falling (or hanging)
  for (int d = 0; d < 7; d++) {
    float ph = float(d) * 0.898;
    float hy = 0.75 - float(d) * 0.06 - 0.02 * sin(t * 0.5 + ph);
    float hx = 0.5 + (hash(vec2(float(d), 0.0)) - 0.5) * 0.6;
    vec2  dp = uv - vec2(hx, hy);
    // Teardrop (elongated downward)
    float drop = length(dp * vec2(1.0, 0.7)) - 0.022;
    col = mix(col, mix(c1, vec3(1.0), 0.6), smoothstep(0.005, -0.005, drop) * 0.9);
    // Glint
    col += exp(-length(dp) * 40.0) * 0.6;
  }

  // Reflective water plane at bottom
  float waterY = 0.18;
  float water  = smoothstep(waterY + 0.02, waterY, uv.y);
  float ripple = sin(uv.x * 20.0 + t * 2.0) * 0.005;
  vec3  refl   = mix(c1 * 0.5, c2 * 0.4, uv.x + ripple);
  col = mix(col, refl, water * 0.7);

  return col;
}

// ─── 13 · Death – Black Greyhound ────────────────────────────────────────────
// Transformation: chrysalis emerging, dark-to-light gradient, rebirth

vec3 pattern_death(vec2 uv, float t, vec3 c1, vec3 c2, vec3 c3) {
  // Dark horizon at bottom, light at top (transformation)
  vec3 col = mix(c1 * 0.05, c3 * 0.6, pow(uv.y, 0.7));

  // Rising transformation energy
  float energy = warpedFbm(uv * 3.0 - vec2(0.0, t * 0.15), t);
  col = mix(col, c2 * 0.7, energy * uv.y * 0.6);

  // White dawn at horizon centre
  vec2 dawn = uv - vec2(0.5, 0.3);
  col += vec3(1.0, 0.9, 0.8) * exp(-length(dawn) * 6.0) * 0.8;

  // Rising souls as spark points
  for (int s = 0; s < 8; s++) {
    float ph   = float(s) * 0.785;
    float rise = fract(uv.y * 0.3 + t * 0.07 + ph * 0.12);
    vec2  sp   = vec2(0.15 + float(s) * 0.1, rise);
    float soul = exp(-length(uv - sp) * 20.0);
    col += c3 * soul * 1.2;
  }

  // Skull-ish oval silhouette
  vec2  sk = uv - vec2(0.5, 0.2);
  float skull = sdCircle(sk, 0.06);
  col = mix(col, c1 * 0.2, smoothstep(0.005, -0.005, skull) * 0.7);

  return col;
}

// ─── 14 · Temperance – Australian Shepherd ───────────────────────────────────
// Harmony: two flows of colour merging, flowing rainbow, golden balance

vec3 pattern_temperance(vec2 uv, float t, vec3 c1, vec3 c2, vec3 c3) {
  // Base gradient
  vec3 col = mix(c1 * 0.4, c3 * 0.4, uv.x);

  // Two cups pouring into each other
  float leftFlow  = smoothstep(0.0, 1.0, uv.y) * smoothstep(0.5, 0.0, uv.x);
  float rightFlow = smoothstep(0.0, 1.0, uv.y) * smoothstep(0.5, 1.0, uv.x);
  col = mix(col, c2, leftFlow * 0.5);
  col = mix(col, c3, rightFlow * 0.5);

  // Flowing S-curve (mixing channel)
  float curve = sin(uv.y * 8.0 + t * 0.8) * 0.12 + 0.5;
  float flow  = smoothstep(0.015, -0.015, abs(uv.x - curve) - 0.02);
  col = mix(col, mix(c1, c2, uv.y), flow * 0.9);

  // Rainbow shimmer
  float ry = sin(uv.y * 6.0 - t * 0.4) * 0.5 + 0.5;
  vec3  rainbow = vec3(
    0.5 + 0.5 * sin(ry * 6.28),
    0.5 + 0.5 * sin(ry * 6.28 + 2.09),
    0.5 + 0.5 * sin(ry * 6.28 + 4.19)
  );
  col = mix(col, rainbow, flow * 0.5);

  // Angelic background glow
  col += exp(-length(uv - 0.5) * 4.0) * vec3(1.0, 1.0, 0.8) * 0.2;
  return col;
}

// ─── 15 · The Devil – Black Pomeranian ───────────────────────────────────────
// Shadows: interlocking chains, brimstone, obsidian geometry

vec3 pattern_devil(vec2 uv, float t, vec3 c1, vec3 c2, vec3 c3) {
  float n    = fbm(uv * 5.0 + t * 0.05);
  vec3  col  = mix(vec3(0.03, 0.0, 0.0), c1 * 0.4, n * 0.4);

  // Chain links
  for (int row = 0; row < 5; row++) {
    for (int col_ = 0; col_ < 4; col_++) {
      vec2  lc = uv * vec2(4.0, 5.0) - vec2(float(col_), float(row));
      // Oval link (alternating orientation)
      float rot  = (mod(float(row + col_), 2.0)) * 1.5708;
      vec2  lco  = lc * rot2(rot);
      float link = sdBox(lco, vec2(0.35, 0.14)) - 0.1;
      float hole = sdBox(lco, vec2(0.15, 0.0)) - 0.06;
      float chain = max(link, -hole);
      col = mix(col, c2 * 0.7, smoothstep(0.03, -0.03, chain) * 0.8);
    }
  }

  // Brimstone glow at bottom
  col += c3 * (1.0 - uv.y) * 0.3 * (0.8 + 0.2 * sin(t * 2.0));

  // Pentagram (inverted)
  float pent = sdStar((uv - 0.5) * rot2(3.14159), 0.18, 2.618, 5);
  col = mix(col, c3, smoothstep(0.01, -0.01, pent) * 0.7);

  return col;
}

// ─── 16 · The Tower – Chihuahua ──────────────────────────────────────────────
// Catastrophe: fractal lightning, shattering geometry, explosive red

vec3 pattern_tower(vec2 uv, float t, vec3 c1, vec3 c2, vec3 c3) {
  vec3 col = mix(c1 * 0.1, vec3(0.05, 0.0, 0.0), uv.y);

  // Multiple lightning bolts
  for (int i = 0; i < 6; i++) {
    float ph = float(i) * 1.047;
    vec2  p  = uv;
    float bolt = 1.0;
    float rx = 0.3 + hash(vec2(float(i), 0.0)) * 0.4;
    // Zig-zag path
    for (int j = 0; j < 4; j++) {
      float seg = float(j) * 0.25;
      float nx  = rx + (hash(vec2(float(i), float(j))) - 0.5) * 0.15;
      float ln  = sdLine(p, vec2(rx, 1.0 - seg), vec2(nx, 1.0 - seg - 0.25));
      bolt = min(bolt, ln);
      rx = nx;
    }
    float bv = smoothstep(0.012, -0.012, bolt - 0.008);
    col = mix(col, c2, bv * (0.6 + 0.4 * sin(t * 15.0 + ph)));
  }

  // Shatter fragments (cracked geometry)
  vec2 fgrid = fract(uv * 8.0 + fbm(uv * 4.0) * 0.3);
  float shard = sdBox(fgrid - 0.5, vec2(0.3 + hash(floor(uv * 8.0)) * 0.15));
  col = mix(col, c3 * 0.5, smoothstep(0.03, 0.0, shard) * smoothstep(0.0, 0.03, shard + 0.02));

  // Fire glow
  col += c3 * (1.0 - uv.y) * fbm(uv * 6.0 - t) * 0.6;

  return col;
}

// ─── 17 · The Star – Samoyed ─────────────────────────────────────────────────
// Hope: aurora borealis, silver-blue, pouring starlight

vec3 pattern_star(vec2 uv, float t, vec3 c1, vec3 c2, vec3 c3) {
  // Aurora curtains
  float aurora = 0.0;
  for (int i = 0; i < 3; i++) {
    float ph = float(i) * 2.09;
    aurora += sin(uv.x * 5.0 + ph + t * 0.3) * 0.2 + 0.5;
  }
  aurora /= 3.0;
  vec3 col = mix(c1 * 0.1, palette(aurora, c1, c2, c3), uv.y * 0.7);

  // Rippling curtain bands
  float band = sin(uv.x * 12.0 + t * 0.4) * 0.5 + 0.5;
  col = mix(col, c2 * 0.6, band * uv.y * 0.4);

  // Central eight-pointed star
  vec2  sc   = uv - vec2(0.5, 0.78);
  float bigStar = sdStar(sc, 0.12, 2.0, 8);
  col = mix(col, mix(c3, vec3(1.0), 0.6), smoothstep(0.01, -0.01, bigStar));
  col += mix(c2, vec3(1.0), 0.4) * exp(-max(bigStar, 0.0) * 15.0) * 0.7;

  // Scattered small stars
  vec2 sg = uv * 22.0;
  float s = smoothstep(0.9, 1.0, hash(floor(sg)));
  s *= 0.5 + 0.5 * sin(t * 1.2 + hash(floor(sg) + 3.0) * 6.28);
  col += s * 0.85;

  // Pouring water glow at bottom
  float water = fbm(uv * 5.0 + vec2(0.0, -t * 0.2)) * smoothstep(0.35, 0.0, uv.y);
  col = mix(col, c1 * 0.7 + c2 * 0.3, water * 0.5);

  return col;
}

// ─── 18 · The Moon – Malamute ────────────────────────────────────────────────
// Illusion: dual-reflection dreamscape, surreal psychedelic mirror

vec3 pattern_moon(vec2 uv, float t, vec3 c1, vec3 c2, vec3 c3) {
  // Reflection axis
  float mirror = abs(uv.y - 0.5);
  vec2  muv    = vec2(uv.x, mirror);

  float n = warpedFbm(muv * 3.0 + t * 0.08, t);
  vec3  col = mix(c1 * 0.2, c3 * 0.3, n);

  // Moon disc
  vec2  moonCenter = vec2(0.5, 0.75);
  float moonD = sdCircle(uv - moonCenter, 0.1);
  col = mix(col, mix(c3, vec3(1.0), 0.7), smoothstep(0.005, -0.005, moonD));
  col += c2 * exp(-max(moonD, 0.0) * 14.0) * 0.6;

  // Reflected moon in water
  vec2  rmoonCenter = vec2(0.5, 0.25);
  float rmoonD = sdCircle(uv - rmoonCenter, 0.08);
  float ripple = sin((uv.x - 0.5) * 30.0 + t * 2.5) * 0.01;
  col = mix(col, mix(c2, vec3(0.9, 0.9, 1.0), 0.5),
            smoothstep(0.012, -0.012, rmoonD + ripple) * 0.7);

  // Two paths (towers) silhouette
  for (int i = 0; i < 2; i++) {
    float px  = (float(i) == 0.0) ? 0.22 : 0.78;
    float tower = sdBox(uv - vec2(px, 0.38), vec2(0.04, 0.3));
    col = mix(col, c1 * 0.15, smoothstep(0.005, -0.005, tower));
  }

  return col;
}

// ─── 19 · The Sun – Labrador ─────────────────────────────────────────────────
// Radiance: sunburst, golden warmth, pure joy

vec3 pattern_sun(vec2 uv, float t, vec3 c1, vec3 c2, vec3 c3) {
  vec2  center = uv - 0.5;
  float dist   = length(center);
  float angle  = atan(center.y, center.x);

  // Warm sky
  vec3 col = mix(c3 * 0.8, c1 * 0.6, dist * 1.5);

  // Sunburst rays (16 rays)
  float rays = abs(sin(angle * 16.0 + t * 0.2));
  rays = pow(rays, 10.0) * smoothstep(0.7, 0.0, dist);
  col += c2 * rays * 0.6;

  // Wavy outer rays
  float waveRay = abs(sin(angle * 12.0 - t * 0.3 + dist * 8.0));
  waveRay = pow(waveRay, 15.0) * smoothstep(0.6, 0.15, dist) * smoothstep(0.15, 0.3, dist);
  col += c1 * waveRay * 0.5;

  // Sun disc
  col = mix(col, mix(c2, vec3(1.0, 1.0, 0.8), 0.5), smoothstep(0.18, 0.1, dist));
  col += vec3(1.0, 1.0, 0.7) * smoothstep(0.1, 0.0, dist) * 0.9;

  // Sunflowers (small dots)
  for (int f = 0; f < 5; f++) {
    float ph = float(f) * 1.256;
    vec2  fp = vec2(0.5 + 0.38 * cos(ph + t * 0.05),
                    0.5 + 0.38 * sin(ph + t * 0.05));
    float flower = sdCircle(uv - fp, 0.04);
    col = mix(col, mix(c1, vec3(1.0, 0.9, 0.2), 0.6), smoothstep(0.005, -0.005, flower));
  }

  return col;
}

// ─── 20 · Judgment – Angel Collie ────────────────────────────────────────────
// Awakening: rising light beams, angelic trumpets, resurrection wave

vec3 pattern_judgment(vec2 uv, float t, vec3 c1, vec3 c2, vec3 c3) {
  // Ocean wave at bottom
  float wave = sin(uv.x * 10.0 + t * 1.5) * 0.05 + 0.2;
  vec3  col  = mix(c1 * 0.4, c3 * 0.15, smoothstep(wave, wave + 0.05, uv.y));

  // Rising souls columns of light
  for (int i = 0; i < 5; i++) {
    float rx = 0.1 + float(i) * 0.2;
    float ht  = 0.4 + hash(vec2(float(i), 0.0)) * 0.4;
    float beam = sdBox(uv - vec2(rx, ht * 0.5), vec2(0.015, ht * 0.5));
    col = mix(col, mix(c2, vec3(1.0), 0.6), smoothstep(0.02, -0.02, beam) *
              (0.6 + 0.4 * sin(t * 1.5 + float(i))));
  }

  // Angel trumpet shapes
  for (int tr = 0; tr < 3; tr++) {
    float tx  = 0.2 + float(tr) * 0.3;
    float ta  = -0.4 + float(tr) * 0.2;
    vec2  tlo = (uv - vec2(tx, 0.7)) * rot2(ta);
    float horn = sdBox(tlo + vec2(0.0, -0.05), vec2(0.025 + tlo.y * 0.3, 0.08));
    col = mix(col, c3 * 0.9, smoothstep(0.01, -0.01, horn) * 0.8);
  }

  // Radiant cross at top
  vec2  cc  = uv - vec2(0.5, 0.82);
  float cross = min(sdBox(cc, vec2(0.03, 0.12)), sdBox(cc, vec2(0.12, 0.03)));
  col = mix(col, mix(c2, vec3(1.0), 0.7), smoothstep(0.005, -0.005, cross));
  col += exp(-length(cc) * 7.0) * vec3(1.0, 1.0, 0.8) * 0.5;

  return col;
}

// ─── 21 · The World – Dancing Shiba ──────────────────────────────────────────
// Completion: ouroboros cosmos, mandala of everything, galaxy spiral

vec3 pattern_world(vec2 uv, float t, vec3 c1, vec3 c2, vec3 c3) {
  vec2  center = uv - 0.5;
  float dist   = length(center);
  float angle  = atan(center.y, center.x);

  // Galaxy spiral arms
  float arm = fract((angle / 6.283 + log(dist + 0.01) * 0.8) * 3.0 + t * 0.1);
  float n   = noise(center * 8.0);
  vec3  col = palette(arm + n * 0.2, c1 * 0.4, c2 * 0.5, c3 * 0.4);

  // Wreath oval ring
  float wreath = smoothstep(0.01, 0.0, abs(dist - 0.4) - 0.008);
  col = mix(col, c3, wreath);

  // Four corner elemental symbols (tiny stars)
  vec2 corners[4];
  corners[0] = vec2(-0.35, 0.35);
  corners[1] = vec2( 0.35, 0.35);
  corners[2] = vec2(-0.35,-0.35);
  corners[3] = vec2( 0.35,-0.35);
  for (int i = 0; i < 4; i++) {
    float elem = sdStar(center - corners[i], 0.04, 2.0, 4);
    col = mix(col, c2, smoothstep(0.008, -0.008, elem));
  }

  // Complete cosmos glow at centre
  col += palette(dist, c2, c1, c3) * exp(-dist * 5.0) * 0.6;
  col += vec3(1.0) * exp(-dist * 12.0) * 0.5;

  // Slow rotation shimmer
  float shimmer = noise(vec2(angle * 5.0 + t * 0.4, dist * 10.0));
  col += c3 * shimmer * 0.15 * smoothstep(0.45, 0.0, dist);

  return col;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  // Flip Y to match canvas coordinates; handle reversed cards
  uv.y = 1.0 - uv.y;
  if (u_reversed == 1) { uv = 1.0 - uv; }

  float t   = u_time;
  vec3  c1  = toLinear(u_color1);
  vec3  c2  = toLinear(u_color2);
  vec3  c3  = toLinear(u_color3);
  vec3  col = vec3(0.0);

  if      (u_cardType == -1) col = pattern_back(uv, t);
  else if (u_cardType ==  0) col = pattern_fool(uv, t, c1, c2, c3);
  else if (u_cardType ==  1) col = pattern_magician(uv, t, c1, c2, c3);
  else if (u_cardType ==  2) col = pattern_high_priestess(uv, t, c1, c2, c3);
  else if (u_cardType ==  3) col = pattern_empress(uv, t, c1, c2, c3);
  else if (u_cardType ==  4) col = pattern_emperor(uv, t, c1, c2, c3);
  else if (u_cardType ==  5) col = pattern_hierophant(uv, t, c1, c2, c3);
  else if (u_cardType ==  6) col = pattern_lovers(uv, t, c1, c2, c3);
  else if (u_cardType ==  7) col = pattern_chariot(uv, t, c1, c2, c3);
  else if (u_cardType ==  8) col = pattern_strength(uv, t, c1, c2, c3);
  else if (u_cardType ==  9) col = pattern_hermit(uv, t, c1, c2, c3);
  else if (u_cardType == 10) col = pattern_wheel(uv, t, c1, c2, c3);
  else if (u_cardType == 11) col = pattern_justice(uv, t, c1, c2, c3);
  else if (u_cardType == 12) col = pattern_hanged(uv, t, c1, c2, c3);
  else if (u_cardType == 13) col = pattern_death(uv, t, c1, c2, c3);
  else if (u_cardType == 14) col = pattern_temperance(uv, t, c1, c2, c3);
  else if (u_cardType == 15) col = pattern_devil(uv, t, c1, c2, c3);
  else if (u_cardType == 16) col = pattern_tower(uv, t, c1, c2, c3);
  else if (u_cardType == 17) col = pattern_star(uv, t, c1, c2, c3);
  else if (u_cardType == 18) col = pattern_moon(uv, t, c1, c2, c3);
  else if (u_cardType == 19) col = pattern_sun(uv, t, c1, c2, c3);
  else if (u_cardType == 20) col = pattern_judgment(uv, t, c1, c2, c3);
  else if (u_cardType == 21) col = pattern_world(uv, t, c1, c2, c3);

  // Tone map
  col = col / (col + 0.8);
  // Vignette
  vec2 vd = gl_FragCoord.xy / u_resolution - 0.5;
  col *= 1.0 - dot(vd, vd) * 0.8;

  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;

export const VERTEX_SHADER = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;
