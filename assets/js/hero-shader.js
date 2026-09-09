/**
 * Anant Nova — Master Ambient Generative 3D Light Fluid WebGL Shader
 * Aesthetic: Apple-grade Minimalist Light Field, Illuminated Silk / Fluid Ribbons
 * Palette: 60% Sage Green (from Primary Logo), Ocean Blue refractions, Luxury Ivory canvas, and Nova Orange warmth
 * Capabilities: Full-viewport fixed ambient background with scroll-driven scrollytelling parallax,
 * mouse responsiveness, and silky smooth 60fps performance across the entire web page.
 */

(function () {
  'use strict';

  const canvas = document.getElementById('ambient-canvas') || document.getElementById('hero-canvas');
  if (!canvas) return;

  const gl = canvas.getContext('webgl', { powerPreference: 'high-performance', alpha: true }) ||
    canvas.getContext('experimental-webgl', { alpha: true });
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

  // Precision fragment shader generating smooth full-viewport 3D illuminated ribbons with soft bloom & scroll parallax
  const fragmentShaderSource = `
    precision highp float;

    varying vec2 v_uv;
    uniform vec2 u_resolution;
    uniform float u_time;
    uniform vec2 u_mouse;
    uniform float u_scroll;

    // 2D Rotation matrix
    mat2 rotate2D(float angle) {
      float s = sin(angle);
      float c = cos(angle);
      return mat2(c, -s, s, c);
    }

    void main() {
      // Normalized coordinates keeping aspect ratio
      vec2 st = (gl_FragCoord.xy * 2.0 - u_resolution) / min(u_resolution.x, u_resolution.y);
      
      // Interactive cursor parallax
      vec2 mouseInfluence = (u_mouse - 0.5) * 0.25;
      st += mouseInfluence * 0.12;

      // Slow meditative time scale
      float t = u_time * 0.20;

      // Continuous scroll progression across all sections
      float scrollPhase = u_scroll * 4.5;

      // Base canvas: Luxury Ivory (#FAF8F5) with living ambient fluid warmth (never plain white!)
      vec3 ivoryBg = vec3(0.978, 0.970, 0.958);
      float ambientMotion = sin(st.x * 0.7 + t * 0.25 + scrollPhase * 0.4) * cos(st.y * 0.7 - t * 0.2);
      vec3 col = mix(ivoryBg, vec3(0.940, 0.955, 0.942), ambientMotion * 0.25 + 0.20);

      // Elegant 32-degree diagonal rotation
      st = rotate2D(-0.55) * st;

      // Brand color palette (60% Sage Green, Ocean Blue, Luxury Ivory, Nova Orange)
      vec3 sageDeep     = vec3(0.125, 0.290, 0.243); // #204A3E (Deep forest shadow)
      vec3 sagePrimary  = vec3(0.247, 0.435, 0.369); // #3F6F5E (Primary Sage Green from Logo)
      vec3 sageLight    = vec3(0.655, 0.722, 0.624); // #A7B89F (Pale Sage Sheen)
      vec3 oceanBlue    = vec3(0.259, 0.620, 0.741); // #429EBD (Ocean Blue)
      vec3 oceanIce     = vec3(0.624, 0.906, 0.961); // #9FE7F5 (Ocean Ice highlight)
      vec3 novaOrange   = vec3(0.949, 0.498, 0.047); // #F27F0C (Nova Orange warmth)

      // 5 broad, voluptuous 3D illuminated silk ribbons spanning the entire viewport
      for (float i = 0.0; i < 5.0; i += 1.0) {
        float vPos = (i - 2.0) * 0.55; // Spans vertical range -1.1 to +1.1
        
        // Fluid harmonic wave formula
        float wave = sin(st.x * 1.25 + t * (0.35 + i * 0.05) + scrollPhase * 0.5 + i * 1.1) * 0.36;
        wave += cos(st.x * 0.75 - t * 0.22 - scrollPhase * 0.3 + i * 1.6) * 0.22;
        
        // Dynamic fold distortion
        float fold = sin(st.y * 1.6 + t * 0.3 + i * 0.8) * 0.14;
        
        // Distance to ribbon fold center
        float ribbonY = vPos + wave + fold;
        float dist = abs(st.y - ribbonY);
        
        // Broad silk ribbon body with soft falloff
        float ribbonAlpha = smoothstep(0.40, 0.02, dist);
        
        if (ribbonAlpha > 0.005) {
          // Color progression along the wave (predominantly 60% Primary Sage Green)
          float colorProg = sin(st.x * 0.9 + t * 0.25 + scrollPhase + i * 1.3) * 0.5 + 0.5;
          vec3 baseRibbon = mix(sagePrimary, sageLight, colorProg);
          
          // Deepen lower fold edge to create real 3D depth and shadow
          float shadowFold = smoothstep(0.0, 0.35, (st.y - ribbonY));
          baseRibbon = mix(sageDeep, baseRibbon, shadowFold * 0.8 + 0.2);
          
          // Layer-specific accent reflections: Ocean Blue and Nova Orange
          if (i == 1.0 || i == 3.0) {
            float blueRim = smoothstep(0.12, 0.30, dist) * (1.0 - smoothstep(0.30, 0.40, dist));
            baseRibbon = mix(baseRibbon, oceanBlue, blueRim * 0.65);
          } else if (i == 0.0 || i == 4.0) {
            float orangeGlow = max(0.0, sin(t * 0.6 + st.x * 1.8 + i)) * 0.38;
            baseRibbon = mix(baseRibbon, novaOrange, orangeGlow);
          } else {
            // Central ribbon: soft ocean ice sheen
            float iceSheen = smoothstep(0.02, 0.12, dist) * (1.0 - smoothstep(0.12, 0.25, dist));
            baseRibbon = mix(baseRibbon, oceanIce, iceSheen * 0.35);
          }
          
          // Silky 3D specular highlight along fold ridge
          float specular = exp(-dist * dist * 32.0) * 0.40;
          baseRibbon += vec3(0.98, 0.98, 0.95) * specular;
          
          // Soft luminous blend into canvas (gives translucent, illuminated silk look)
          col = mix(col, baseRibbon, ribbonAlpha * 0.60);
        }
      }

      // Output final illuminated canvas
      gl_FragColor = vec4(col, 1.0);
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
      -1.0, 1.0,
      -1.0, 1.0,
      1.0, -1.0,
      1.0, 1.0,
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
  const uScrollLocation = gl.getUniformLocation(program, 'u_scroll');

  let mouseX = 0.5;
  let mouseY = 0.5;
  let targetMouseX = 0.5;
  let targetMouseY = 0.5;

  window.addEventListener('mousemove', (e) => {
    targetMouseX = e.clientX / window.innerWidth;
    targetMouseY = 1.0 - (e.clientY / window.innerHeight);
  }, { passive: true });

  // Scroll tracking for scrollytelling parallax
  let currentScroll = 0.0;
  let targetScroll = 0.0;

  function updateScrollProgress() {
    const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    targetScroll = Math.min(Math.max(window.scrollY / maxScroll, 0.0), 1.0);
  }

  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();

  // Resize handler for full-viewport canvas
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const displayWidth = Math.floor((canvas.clientWidth || window.innerWidth) * dpr);
    const displayHeight = Math.floor((canvas.clientHeight || window.innerHeight) * dpr);

    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
      canvas.width = displayWidth;
      canvas.height = displayHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
  }

  window.addEventListener('resize', resize, { passive: true });
  resize();

  // Animation Loop with Visibility Control & 60fps smoothing
  let startTime = performance.now();
  let isVisible = true;

  document.addEventListener('visibilitychange', () => {
    isVisible = !document.hidden;
  });

  function render(now) {
    if (isVisible) {
      // Smooth interpolation for mouse and scroll uniforms
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;
      currentScroll += (targetScroll - currentScroll) * 0.06;

      const elapsedTime = (now - startTime) * 0.001;

      gl.uniform2f(uResolutionLocation, canvas.width, canvas.height);
      gl.uniform1f(uTimeLocation, elapsedTime);
      gl.uniform2f(uMouseLocation, mouseX, mouseY);
      gl.uniform1f(uScrollLocation, currentScroll);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
})();