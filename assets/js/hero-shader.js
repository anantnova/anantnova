/**
 * Anant Nova — Generative 3D Light Fluid WebGL Shader
 * Aesthetic: Apple-grade Minimalist Light Field, Illuminated Silk / Fluid Ribbons
 * Palette: 60% Sage Green (from Primary Logo), Ocean Blue refractions, Luxury Ivory canvas, and Nova Orange warmth
 */

(function () {
  'use strict';

  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  if (!gl) {
    console.warn('WebGL not supported, falling back to CSS background.');
    return;
  }

  // --- Shaders ---
  const vertexShaderSource = `
    attribute vec2 a_position;
    varying vec2 v_uv;
    void main() {
      v_uv = (a_position + 1.0) * 0.5;
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `;

  // Precision fragment shader generating smooth 3D illuminated ribbons with soft bloom
  const fragmentShaderSource = `
    precision highp float;

    varying vec2 v_uv;
    uniform vec2 u_resolution;
    uniform float u_time;
    uniform vec2 u_mouse;

    // 2D Rotation matrix
    mat2 rotate2D(float angle) {
      float s = sin(angle);
      float c = cos(angle);
      return mat2(c, -s, s, c);
    }

    void main() {
      // Normalized coordinates keeping aspect ratio
      vec2 st = (gl_FragCoord.xy * 2.0 - u_resolution) / min(u_resolution.x, u_resolution.y);
      
      // Subtle mouse parallax influence
      vec2 mouseInfluence = (u_mouse - 0.5) * 0.35;
      st += mouseInfluence * 0.15;

      // Slow meditative time scale
      float t = u_time * 0.32;

      // Rotate st diagonally (~38 degrees) matching the reference video
      st = rotate2D(-0.65) * st;

      // Base canvas color: Luxury Ivory
      vec3 bgColor = vec3(0.980, 0.973, 0.960); // #FAF8F5
      
      // Subtle ambient vignette in the background
      float bgVignette = length(st * 0.35);
      vec3 color = mix(bgColor, vec3(0.945, 0.938, 0.920), smoothstep(0.0, 1.5, bgVignette));

      // Coordinate distortion for organic liquid/fabric folding
      vec2 uvFold = st;
      uvFold.x += sin(uvFold.y * 1.8 + t * 0.8) * 0.32;
      uvFold.y += cos(uvFold.x * 1.4 + t * 0.6) * 0.28;

      // Multi-layer ribbon accumulation
      float glowAccum = 0.0;
      float ribbonCore = 0.0;

      for (float i = 0.0; i < 4.0; i += 1.0) {
        float offset = i * 0.42;
        
        // Fluid wave formula with breathing frequency
        float wave = sin(uvFold.x * (1.6 + i * 0.4) + t * (0.5 + i * 0.15) + offset);
        wave += cos(uvFold.y * (1.2 + i * 0.3) - t * (0.4 + i * 0.1) + offset) * 0.5;
        
        // Distance to ribbon fold center
        float dist = abs(uvFold.y + wave * 0.35 - (st.x * 0.25) - (offset * 0.5 - 0.5));
        
        // Exponential bloom falloff (eliminates all hard edges)
        float glow = exp(-dist * dist * (4.5 + i * 1.2));
        glowAccum += glow * (0.35 / (1.0 + i * 0.2));

        // Core intensity
        ribbonCore += exp(-dist * 18.0) * 0.15;
      }

      // Breathing brightness pulsation
      float breath = sin(t * 0.7) * 0.08 + 1.0;
      glowAccum *= breath;

      // --- Color Definition (60% Sage Green, Ocean Blue, Luxury Ivory & Nova Orange) ---
      vec3 sageDeep     = vec3(0.125, 0.290, 0.243); // #204A3E (Deep forest sage)
      vec3 sagePrimary  = vec3(0.247, 0.435, 0.369); // #3F6F5E (Primary Sage Green from Logo)
      vec3 sageLight    = vec3(0.655, 0.722, 0.624); // #A7B89F (Pale Sage Sheen)
      vec3 luxuryIvory  = vec3(0.988, 0.980, 0.965); // #FAF8F5 (Luxury Ivory)
      vec3 oceanBlue    = vec3(0.259, 0.620, 0.741); // #429EBD (Ocean Blue)
      vec3 oceanIce     = vec3(0.624, 0.906, 0.961); // #9FE7F5 (Ocean Ice)
      vec3 novaOrange   = vec3(0.949, 0.498, 0.047); // #F27F0C (Nova Orange)

      // Gradient along the flowing ribbon: Sage Primary to Sage Light
      float colorRamp = smoothstep(-1.2, 1.2, uvFold.x + sin(t * 0.4) * 0.5);
      vec3 ribbonColor = mix(sagePrimary, sageLight, colorRamp);
      
      // Blend in Luxury Ivory highlights on high-intensity peaks
      ribbonColor = mix(ribbonColor, luxuryIvory, smoothstep(0.4, 0.85, glowAccum));

      // Iridescent chromatic edge rim in Ocean Blue / Ice
      float rim = smoothstep(0.18, 0.65, glowAccum) * (1.0 - smoothstep(0.65, 1.0, glowAccum));
      ribbonColor = mix(ribbonColor, oceanBlue, rim * 0.40);
      ribbonColor = mix(ribbonColor, oceanIce, rim * 0.20);

      // Warm Nova Orange internal refraction spark
      float orangeSpark = smoothstep(0.65, 0.95, glowAccum) * max(0.0, sin(t * 0.8 + uvFold.y * 2.5));
      ribbonColor = mix(ribbonColor, novaOrange, clamp(orangeSpark * 0.35, 0.0, 1.0));

      // Multiply-screen blend over Luxury Ivory canvas
      vec3 litResult = mix(color, ribbonColor, clamp(glowAccum * 0.88, 0.0, 1.0));
      
      // Silky sheen highlight in soft Sage/Ivory
      litResult += luxuryIvory * ribbonCore * 0.35;

      // Output with soft tone curve
      gl_FragColor = vec4(litResult, 1.0);
    }
  `;

  function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
  if (!vertexShader || !fragmentShader) return;

  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program linking error:', gl.getProgramInfoLog(program));
    return;
  }

  gl.useProgram(program);

  // Full-screen quad geometry
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      -1.0, -1.0,
       1.0, -1.0,
      -1.0,  1.0,
      -1.0,  1.0,
       1.0, -1.0,
       1.0,  1.0,
    ]),
    gl.STATIC_DRAW
  );

  const aPositionLocation = gl.getAttribLocation(program, 'a_position');
  gl.enableVertexAttribArray(aPositionLocation);
  gl.vertexAttribPointer(aPositionLocation, 2, gl.FLOAT, false, 0, 0);

  // Uniform locations
  const uResolutionLocation = gl.getUniformLocation(program, 'u_resolution');
  const uTimeLocation = gl.getUniformLocation(program, 'u_time');
  const uMouseLocation = gl.getUniformLocation(program, 'u_mouse');

  let mouseX = 0.5;
  let mouseY = 0.5;
  let targetMouseX = 0.5;
  let targetMouseY = 0.5;

  window.addEventListener('mousemove', (e) => {
    targetMouseX = e.clientX / window.innerWidth;
    targetMouseY = 1.0 - (e.clientY / window.innerHeight);
  });

  // Resize handler
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const displayWidth = Math.floor(canvas.clientWidth * dpr);
    const displayHeight = Math.floor(canvas.clientHeight * dpr);

    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
      canvas.width = displayWidth;
      canvas.height = displayHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
  }

  window.addEventListener('resize', resize);
  resize();

  // Animation Loop with Performance Throttling
  let startTime = performance.now();
  let isVisible = true;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        isVisible = entry.isIntersecting;
      });
    }, { threshold: 0.05 });
    observer.observe(canvas);
  }

  document.addEventListener('visibilitychange', () => {
    isVisible = !document.hidden;
  });

  function render(now) {
    if (isVisible) {
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      const elapsedTime = (now - startTime) * 0.001;

      gl.uniform2f(uResolutionLocation, canvas.width, canvas.height);
      gl.uniform1f(uTimeLocation, elapsedTime);
      gl.uniform2f(uMouseLocation, mouseX, mouseY);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
})();