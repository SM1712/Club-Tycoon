import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { ClubCrest } from './ClubCrest';
import { Shield, Trophy, Building2, User, PlayCircle, AlertCircle, Sparkles, Award, CheckCircle2, Paintbrush, Briefcase, TrendingUp, Sprout, Star, Edit3, Compass, Smile, Zap } from 'lucide-react';

// REAL GPU WEBGL PLAYFUL DOODLE SKETCHBOOK SHADER COMPONENT
const WebGLDoodleShader: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl') || (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null);
    if (!gl) return;

    const vsSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    // GLSL Fragment Shader: Hand-Drawn Paper Stipple & Floating Ink Doodles
    const fsSource = `
      precision mediump float;
      uniform vec2 u_resolution;
      uniform float u_time;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453123);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
          mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
          f.y
        );
      }

      void main() {
        vec2 st = gl_FragCoord.xy / u_resolution.xy;
        st.x *= u_resolution.x / u_resolution.y;

        float t = u_time * 0.15;

        // Paper Texture Stipple
        float stipple = noise(gl_FragCoord.xy * 0.9) * 0.035;

        // Floating doodle wave accents
        float wave1 = sin((st.x * 6.0 + st.y * 4.0 + t) * 3.0);
        float wave2 = cos((st.x * 4.0 - st.y * 6.0 + t * 0.8) * 3.0);
        float doodleLine = smoothstep(0.46, 0.5, abs(wave1 + wave2)) * 0.04;

        // Off-White Sketchbook Paper Base (#faf7f2) + Black Ink Dots + Yellow Warm Accent
        vec3 paperColor = vec3(0.98, 0.96, 0.93) - vec3(stipple);
        vec3 inkColor   = vec3(0.10, 0.10, 0.12);
        vec3 yellowInk  = vec3(0.98, 0.80, 0.18);

        vec3 color = mix(paperColor, inkColor, doodleLine);
        color = mix(color, yellowInk, noise(st * 3.0 - t * 0.2) * 0.05);

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    function createShader(gl: WebGLRenderingContext, type: number, source: string) {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
    const timeLocation = gl.getUniformLocation(program, 'u_time');

    let animationFrameId: number;
    let startTime = performance.now();

    function resize() {
      if (!canvas || !gl) return;
      const displayWidth  = window.innerWidth;
      const displayHeight = window.innerHeight;

      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width  = displayWidth;
        canvas.height = displayHeight;
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      }
    }

    function render() {
      resize();
      if (!gl || !program) return;

      gl.useProgram(program);
      gl.enableVertexAttribArray(positionLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

      const currentTime = (performance.now() - startTime) / 1000;
      gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);
      gl.uniform1f(timeLocation, currentTime);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrameId = requestAnimationFrame(render);
    }

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0
      }}
    />
  );
};

export const OnboardingWizard: React.FC = () => {
  const { divisions, clubs, startNewGame } = useGame();

  const [presidentName, setPresidentName] = useState<string>('Florentino Pérez');
  const [presidentProfile, setPresidentProfile] = useState<'empresario' | 'leyenda' | 'inversor' | 'canterano'>('empresario');
  const [mode, setMode] = useState<'EXISTING' | 'CUSTOM'>('EXISTING');
  const [selectedDivisionId, setSelectedDivisionId] = useState<string>('div1');
  const [selectedClubId, setSelectedClubId] = useState<string>('rma');
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Form states for Custom Club Creator
  const [customName, setCustomName] = useState<string>('Deportivo Atlántico FC');
  const [customAbbr, setCustomAbbr] = useState<string>('DAF');
  const [customColor1, setCustomColor1] = useState<string>('#047857'); // Verde Esmeralda
  const [customColor2, setCustomColor2] = useState<string>('#ffffff'); // Blanco
  const [customPattern, setCustomPattern] = useState<'sash' | 'stripes' | 'halves' | 'quarters' | 'cross' | 'chevron'>('sash');

  const filteredClubs = clubs.filter(c => c.divisionId === selectedDivisionId);
  const selectedClub = clubs.find(c => c.id === selectedClubId) || filteredClubs[0];

  const profileInfo = {
    empresario: {
      title: 'Empresario Tradicional',
      bonus: '+15% Presupuesto & Beneficios Comercial',
      icon: Briefcase
    },
    leyenda: {
      title: 'Leyenda del Club',
      bonus: '95% Aprobación Social de Afición',
      icon: Star
    },
    inversor: {
      title: 'Fondo Inversor',
      bonus: '+25% Presupuesto Fichajes Inicial',
      icon: TrendingUp
    },
    canterano: {
      title: 'Tradición y Cantera',
      bonus: 'Academia Nivel 2 & Desarrollo +20%',
      icon: Sprout
    }
  };

  const heraldicPatterns: { id: 'sash' | 'stripes' | 'halves' | 'quarters' | 'cross' | 'chevron'; name: string }[] = [
    { id: 'sash', name: 'Banda' },
    { id: 'stripes', name: 'Franjas' },
    { id: 'halves', name: 'Mitad' },
    { id: 'quarters', name: 'Cuarteles' },
    { id: 'cross', name: 'Cruz' },
    { id: 'chevron', name: 'Chevron' }
  ];

  const presetPalettes = [
    { name: 'Verde & Oro', c1: '#047857', c2: '#facc15' },
    { name: 'Rojo & Blanco', c1: '#dc2626', c2: '#ffffff' },
    { name: 'Marino & Amarillo', c1: '#1e3a8a', c2: '#facc15' },
    { name: 'Azul & Blanco', c1: '#2563eb', c2: '#ffffff' },
    { name: 'Morado & Blanco', c1: '#7c3aed', c2: '#ffffff' },
    { name: 'Carbón & Naranja', c1: '#18181b', c2: '#ea580c' }
  ];

  const handleStartGame = () => {
    setErrorMsg('');
    if (!presidentName.trim()) {
      setErrorMsg("Escribe tu nombre de Presidente para comenzar.");
      return;
    }

    if (mode === 'EXISTING') {
      if (!selectedClubId) {
        setErrorMsg("Selecciona un club de la lista.");
        return;
      }
      startNewGame(presidentName, 'EXISTING', selectedClubId, undefined, presidentProfile);
    } else {
      if (!customName.trim() || !customAbbr.trim()) {
        setErrorMsg("Ingresa nombre y siglas de tu club.");
        return;
      }
      startNewGame(presidentName, 'CUSTOM', undefined, {
        name: customName,
        abbr: customAbbr,
        color1: customColor1,
        color2: customColor2
      }, presidentProfile);
    }
  };

  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      maxHeight: '100vh',
      backgroundColor: '#faf7f2',
      color: '#18181b',
      fontFamily: "'Patrick Hand', 'Kalam', cursive, sans-serif",
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      boxSizing: 'border-box',
      position: 'relative'
    }}>
      {/* GPU WEBGL DOODLE SKETCHBOOK SHADER BACKGROUND */}
      <WebGLDoodleShader />

      {/* HEADER AJUSTADO Y PERFECTAMENTE ALINEADO (50PX) */}
      <header style={{
        height: '50px',
        padding: '0 1.5rem',
        borderBottom: '2px solid #18181b',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#ffffff',
        boxShadow: '0 2px 0px #18181b',
        flexShrink: 0,
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* BANDEROLA SVG COMPONENT ALINEADA INTEGRALMENTE CON TEXTO VECTORIAL */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <svg width="200" height="34" viewBox="0 0 200 34" fill="none" style={{ flexShrink: 0 }}>
              <path d="M 8 6 L 22 2 L 178 2 L 192 6 L 187 29 L 178 32 L 22 32 L 13 29 Z" fill="#facc15" stroke="#18181b" strokeWidth="2" strokeLinejoin="round" />
              <path d="M 4 10 L 17 7 L 13 25 Z" fill="#ffffff" stroke="#18181b" strokeWidth="1.5" />
              <path d="M 196 10 L 183 7 L 187 25 Z" fill="#ffffff" stroke="#18181b" strokeWidth="1.5" />
              <text x="100" y="22" textAnchor="middle" fill="#18181b" fontSize="14" fontWeight="800" fontFamily="'Kalam', cursive" letterSpacing="0.3">
                ¡PRESIDENTE DE CLUB!
              </text>
            </svg>
          </div>

          <span style={{ fontSize: '0.82rem', color: '#52525b', fontWeight: 600 }}>
            • Simulación & Gestión Directiva en Cómic •
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{
            fontSize: '0.78rem',
            background: '#fef08a',
            padding: '3px 12px',
            borderRadius: '16px',
            border: '2px solid #18181b',
            color: '#18181b',
            fontWeight: 700,
            boxShadow: '2px 2px 0px #18181b',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem'
          }}>
            <Smile size={15} />
            Estilo Doodle Comic
          </span>
        </div>
      </header>

      {/* ÁREA PRINCIPAL CON BORDES DE DIBUJO ELEGANTES (2PX) */}
      <main style={{
        flex: 1,
        minHeight: 0,
        height: 'calc(100vh - 96px)',
        padding: '0.65rem 1.5rem',
        display: 'grid',
        gridTemplateColumns: '1fr 350px',
        gap: '1rem',
        maxWidth: '1600px',
        width: '100%',
        margin: '0 auto',
        boxSizing: 'border-box',
        overflow: 'hidden',
        zIndex: 5
      }}>
        
        {/* COLUMNA IZQUIERDA: PASOS CON BORDES REFINADOS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', height: '100%', minHeight: 0, overflow: 'hidden', boxSizing: 'border-box' }}>
          
          {/* TARJETA 1: PERFIL DEL PRESIDENTE */}
          <div style={{
            background: '#ffffff',
            border: '2px solid #18181b',
            borderRadius: '12px',
            padding: '0.6rem 1rem',
            boxShadow: '3px 3px 0px #18181b',
            flexShrink: 0,
            boxSizing: 'border-box'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#facc15', border: '1.5px solid #18181b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#18181b', boxShadow: '1.5px 1.5px 0px #18181b' }}>
                <User size={15} />
              </div>
              <h3 style={{ fontSize: '1.08rem', fontWeight: 700, margin: 0, color: '#18181b', fontFamily: "'Kalam', cursive" }}>
                1. Perfil del Presidente
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.12rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#27272a' }}>Nombre y Apellidos del Presidente</label>
                <input
                  type="text"
                  placeholder="Ej. Florentino Pérez"
                  value={presidentName}
                  onChange={e => { setPresidentName(e.target.value); setErrorMsg(''); }}
                  style={{
                    width: '100%',
                    background: '#ffffff',
                    border: '1.5px solid #18181b',
                    borderRadius: '7px',
                    padding: '0.35rem 0.7rem',
                    color: '#18181b',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    fontFamily: "'Patrick Hand', cursive",
                    outline: 'none',
                    boxShadow: '1.5px 2px 0px #18181b',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* GRID INTERACTIVO DE PERFILES */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#27272a' }}>Estilo de Gestión Directiva (Ventajas Reales)</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.4rem' }}>
                  {(['empresario', 'leyenda', 'inversor', 'canterano'] as const).map(key => {
                    const info = profileInfo[key];
                    const IconComp = info.icon;
                    const isSelected = presidentProfile === key;

                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setPresidentProfile(key)}
                        style={{
                          background: isSelected ? '#fef08a' : '#ffffff',
                          border: '1.5px solid #18181b',
                          borderRadius: '8px',
                          padding: '0.4rem 0.5rem',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.12s ease',
                          boxShadow: isSelected ? '2.5px 2.5px 0px #18181b' : '1.5px 1.5px 0px #cbd5e1',
                          transform: isSelected ? 'translateY(-1px)' : 'none'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '1px' }}>
                          <IconComp size={14} style={{ color: '#18181b' }} />
                          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#18181b', fontFamily: "'Kalam', cursive" }}>
                            {info.title}
                          </span>
                        </div>
                        <span style={{ fontSize: '0.7rem', fontWeight: 600, color: isSelected ? '#15803d' : '#b45309', lineHeight: 1.1 }}>
                          {info.bonus}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* TARJETA 2: SELECCIÓN O CREADOR DE CLUB */}
          <div style={{
            background: '#ffffff',
            border: '2px solid #18181b',
            borderRadius: '12px',
            padding: '0.65rem 1rem',
            boxShadow: '3px 3px 0px #18181b',
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            minHeight: 0,
            overflow: 'hidden',
            boxSizing: 'border-box'
          }}>
            {/* SWITCHER MODO */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#86efac', border: '1.5px solid #18181b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#18181b', boxShadow: '1.5px 1.5px 0px #18181b' }}>
                  <Building2 size={15} />
                </div>
                <h3 style={{ fontSize: '1.08rem', fontWeight: 700, margin: 0, color: '#18181b', fontFamily: "'Kalam', cursive" }}>
                  2. Selección o Fundación de Club
                </h3>
              </div>

              <div style={{ display: 'flex', gap: '0.3rem' }}>
                <button
                  onClick={() => setMode('EXISTING')}
                  style={{
                    background: mode === 'EXISTING' ? '#fef08a' : '#ffffff',
                    border: '1.5px solid #18181b',
                    color: '#18181b',
                    padding: '0.3rem 0.75rem',
                    borderRadius: '7px',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    fontFamily: "'Kalam', cursive",
                    cursor: 'pointer',
                    boxShadow: mode === 'EXISTING' ? '2px 2px 0px #18181b' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}
                >
                  <Building2 size={13} />
                  <span>Club Oficial</span>
                </button>

                <button
                  onClick={() => setMode('CUSTOM')}
                  style={{
                    background: mode === 'CUSTOM' ? '#fef08a' : '#ffffff',
                    border: '1.5px solid #18181b',
                    color: '#18181b',
                    padding: '0.3rem 0.75rem',
                    borderRadius: '7px',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    fontFamily: "'Kalam', cursive",
                    cursor: 'pointer',
                    boxShadow: mode === 'CUSTOM' ? '2px 2px 0px #18181b' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}
                >
                  <Paintbrush size={13} />
                  <span>Fundar Club</span>
                </button>
              </div>
            </div>

            {mode === 'EXISTING' ? (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, overflow: 'hidden' }}>
                {/* DIVISION TABS */}
                <div style={{ display: 'flex', gap: '0.35rem', borderBottom: '1.5px solid #18181b', paddingBottom: '0.4rem', marginBottom: '0.5rem', flexShrink: 0 }}>
                  {divisions.map(div => (
                    <button
                      key={div.id}
                      onClick={() => {
                        setSelectedDivisionId(div.id);
                        const firstInDiv = clubs.find(c => c.divisionId === div.id);
                        if (firstInDiv) setSelectedClubId(firstInDiv.id);
                      }}
                      style={{
                        background: selectedDivisionId === div.id ? '#bbf7d0' : '#ffffff',
                        border: '1.5px solid #18181b',
                        color: '#18181b',
                        padding: '0.28rem 0.8rem',
                        borderRadius: '14px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        fontFamily: "'Patrick Hand', cursive",
                        cursor: 'pointer',
                        boxShadow: selectedDivisionId === div.id ? '1.5px 1.5px 0px #18181b' : 'none'
                      }}
                    >
                      {div.name}
                    </button>
                  ))}
                </div>

                {/* CLUBS GRID */}
                <div style={{
                  flex: 1,
                  minHeight: 0,
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(145px, 1fr))',
                  gap: '0.65rem',
                  overflowY: 'auto',
                  paddingRight: '4px',
                  alignContent: 'start'
                }}>
                  {filteredClubs.map(club => {
                    const isSelected = selectedClubId === club.id;

                    return (
                      <div
                        key={club.id}
                        onClick={() => setSelectedClubId(club.id)}
                        style={{
                          background: isSelected ? '#fef08a' : '#ffffff',
                          border: '1.5px solid #18181b',
                          borderRadius: '9px',
                          padding: '0.6rem 0.5rem',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          textAlign: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.12s ease',
                          boxShadow: isSelected ? '2.5px 2.5px 0px #18181b' : '1.5px 1.5px 0px #cbd5e1',
                          position: 'relative'
                        }}
                      >
                        {isSelected && (
                          <div style={{ position: 'absolute', top: '5px', right: '5px', color: '#18181b' }}>
                            <CheckCircle2 size={15} />
                          </div>
                        )}

                        <ClubCrest
                          logo={club.logo}
                          name={club.name}
                          abbr={club.abbr}
                          color1={club.color1}
                          color2={club.color2}
                          size={34}
                        />
                        
                        <h4 style={{ fontSize: '0.88rem', fontWeight: 700, margin: '0.3rem 0 1px 0', color: '#18181b', fontFamily: "'Kalam', cursive", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
                          {club.name}
                        </h4>

                        <span style={{ fontSize: '0.68rem', color: '#52525b', marginBottom: '0.3rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
                          {club.stadium}
                        </span>

                        <div style={{
                          marginTop: 'auto',
                          background: '#ffffff',
                          border: '1px solid #18181b',
                          padding: '2px 6px',
                          borderRadius: '5px',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          color: '#15803d'
                        }}>
                          €{(club.budget / 1000000).toFixed(1)}M Presupuesto
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* CREADOR DE CLUB CON BOTONES DE PATRÓN MÁS GRANDES */
              <div style={{ display: 'grid', gridTemplateColumns: '170px 1fr', gap: '0.85rem', flex: 1, minHeight: 0, alignItems: 'center' }}>
                
                {/* TARJETA ESCUDO PREVIEW */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  background: '#fef08a',
                  padding: '0.75rem 0.55rem',
                  borderRadius: '10px',
                  border: '1.5px solid #18181b',
                  boxShadow: '2.5px 2.5px 0px #18181b',
                  boxSizing: 'border-box'
                }}>
                  <span style={{ fontSize: '0.7rem', color: '#18181b', textTransform: 'uppercase', fontWeight: 700, fontFamily: "'Kalam', cursive", marginBottom: '0.25rem' }}>
                    Escudo Heráldico
                  </span>
                  
                  <div style={{ margin: '0.2rem 0' }}>
                    <ClubCrest
                      name={customName || 'Nuevo Club'}
                      abbr={customAbbr || 'NC'}
                      color1={customColor1}
                      color2={customColor2}
                      pattern={customPattern}
                      size={54}
                    />
                  </div>

                  <h4 style={{ fontSize: '0.88rem', fontWeight: 700, marginTop: '0.35rem', marginBottom: '1px', color: '#18181b', fontFamily: "'Kalam', cursive", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
                    {customName || 'Nombre Club'}
                  </h4>
                  
                  <span style={{ fontSize: '0.7rem', color: '#3f3f46', marginBottom: '0.35rem' }}>
                    Siglas: <strong style={{ color: '#18181b' }}>{customAbbr || 'NC'}</strong>
                  </span>

                  <div style={{ background: '#ffffff', border: '1px solid #18181b', padding: '2px 7px', borderRadius: '5px', fontSize: '0.68rem', fontWeight: 700, color: '#15803d' }}>
                    3ª Div RFEF • €0.35M
                  </div>
                </div>

                {/* FORMULARIO DOODLE REFINADO CON BOTONES MÁS GRANDES DE PATRÓN */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', justifyContent: 'center' }}>
                  
                  {/* FILA 1: NOMBRE Y SIGLAS */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 85px', gap: '0.6rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                      <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#27272a' }}>Nombre del Club Fundado</label>
                      <input
                        type="text"
                        placeholder="Ej. Deportivo Atlántico FC"
                        value={customName}
                        onChange={e => setCustomName(e.target.value)}
                        style={{ background: '#ffffff', border: '1.5px solid #18181b', borderRadius: '6px', padding: '0.38rem 0.6rem', color: '#18181b', fontSize: '0.85rem', fontWeight: 700, fontFamily: "'Patrick Hand', cursive", outline: 'none', boxShadow: '1.5px 1.5px 0px #18181b' }}
                      />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                      <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#27272a' }}>Siglas</label>
                      <input
                        type="text"
                        maxLength={3}
                        placeholder="DAF"
                        value={customAbbr}
                        onChange={e => setCustomAbbr(e.target.value.toUpperCase())}
                        style={{ background: '#ffffff', border: '1.5px solid #18181b', borderRadius: '6px', padding: '0.38rem 0.6rem', color: '#18181b', fontSize: '0.85rem', textAlign: 'center', fontWeight: 800, fontFamily: "'Patrick Hand', cursive", outline: 'none', boxShadow: '1.5px 1.5px 0px #18181b' }}
                      />
                    </div>
                  </div>

                  {/* FILA 2: PATRÓN DEL ESCUDO EN PÍLDORAS MÁS GRANDES */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                    <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#27272a' }}>Patrón Heráldico</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '0.4rem' }}>
                      {heraldicPatterns.map(pat => {
                        const isSelected = customPattern === pat.id;
                        return (
                          <button
                            key={pat.id}
                            type="button"
                            onClick={() => setCustomPattern(pat.id)}
                            style={{
                              background: isSelected ? '#fef08a' : '#ffffff',
                              border: '1.5px solid #18181b',
                              color: '#18181b',
                              padding: '0.45rem 0.25rem',
                              borderRadius: '8px',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              fontFamily: "'Kalam', cursive",
                              cursor: 'pointer',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              gap: '3px',
                              boxShadow: isSelected ? '2px 2px 0px #18181b' : '1px 1px 0px #cbd5e1',
                              transition: 'all 0.12s ease'
                            }}
                          >
                            <ClubCrest
                              name={customAbbr}
                              abbr={customAbbr}
                              color1={customColor1}
                              color2={customColor2}
                              pattern={pat.id}
                              size={24}
                            />
                            <span style={{ fontSize: '0.76rem', lineHeight: 1 }}>{pat.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* FILA 3: PALETAS RÁPIDAS & COLOR PICKERS */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: '0.6rem', alignItems: 'center' }}>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.18rem' }}>
                      <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#27272a' }}>Paletas Rápidas</label>
                      <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'nowrap' }}>
                        {presetPalettes.map((pal, idx) => {
                          const isSelected = customColor1 === pal.c1 && customColor2 === pal.c2;
                          return (
                            <button
                              key={idx}
                              type="button"
                              title={pal.name}
                              onClick={() => { setCustomColor1(pal.c1); setCustomColor2(pal.c2); }}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '2px',
                                background: isSelected ? '#fef08a' : '#ffffff',
                                border: '1.5px solid #18181b',
                                padding: '2px 5px',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                flexShrink: 0
                              }}
                            >
                              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: pal.c1, border: '1px solid #18181b' }} />
                              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: pal.c2, border: '1px solid #18181b' }} />
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.18rem' }}>
                      <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#27272a' }}>Colores</label>
                      <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                        <div style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: customColor1,
                          border: '1.5px solid #18181b',
                          boxShadow: '1px 1px 0px #18181b',
                          overflow: 'hidden',
                          position: 'relative',
                          cursor: 'pointer',
                          flexShrink: 0
                        }} title="Color Primario">
                          <input
                            type="color"
                            value={customColor1}
                            onChange={e => setCustomColor1(e.target.value)}
                            style={{ opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }}
                          />
                        </div>

                        <div style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: customColor2,
                          border: '1.5px solid #18181b',
                          boxShadow: '1px 1px 0px #18181b',
                          overflow: 'hidden',
                          position: 'relative',
                          cursor: 'pointer',
                          flexShrink: 0
                        }} title="Color Secundario">
                          <input
                            type="color"
                            value={customColor2}
                            onChange={e => setCustomColor2(e.target.value)}
                            style={{ opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }}
                          />
                        </div>
                      </div>
                    </div>

                  </div>

                </div>

              </div>
            )}
          </div>

          {errorMsg && (
            <div style={{ background: '#fee2e2', border: '1.5px solid #18181b', borderRadius: '7px', padding: '0.4rem 0.7rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#dc2626', fontSize: '0.78rem', fontWeight: 700, flexShrink: 0, boxShadow: '1.5px 1.5px 0px #18181b' }}>
              <AlertCircle size={14} />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* COLUMNA DERECHA: CREDENCIAL DIRECTIVA OFICIAL DOODLE REFINADA */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
          
          <div style={{
            background: '#ffffff',
            border: '2px solid #18181b',
            borderRadius: '12px',
            padding: '0.95rem',
            boxShadow: '3px 3px 0px #18181b',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',
            position: 'relative',
            overflow: 'hidden',
            boxSizing: 'border-box'
          }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
              {/* ENCABEZADO LICENCIA RFEF CON SELLO AMARILLO */}
              <div style={{
                borderBottom: '1.5px solid #18181b',
                paddingBottom: '0.4rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <span style={{ fontSize: '0.66rem', color: '#b45309', textTransform: 'uppercase', fontWeight: 800, fontFamily: "'Kalam', cursive" }}>
                    RFEF • LICENCIA OFICIAL
                  </span>
                  <h4 style={{ fontSize: '0.88rem', fontWeight: 700, margin: 0, color: '#18181b', fontFamily: "'Kalam', cursive" }}>
                    Credencial del Presidente
                  </h4>
                </div>
                <Award size={18} style={{ color: '#d97706' }} />
              </div>

              {/* FOTO & NOMBRE */}
              <div style={{
                background: '#fef08a',
                border: '1.5px solid #18181b',
                borderRadius: '9px',
                padding: '0.55rem 0.65rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                boxShadow: '1.5px 2px 0px #18181b'
              }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: '#ffffff',
                  border: '1.5px solid #18181b',
                  color: '#18181b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  boxShadow: '1.5px 1.5px 0px #18181b',
                  flexShrink: 0
                }}>
                  <User size={18} />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: '0.66rem', color: '#52525b', textTransform: 'uppercase', fontWeight: 700 }}>
                    Presidente Electo
                  </span>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '1px 0', color: '#18181b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: "'Kalam', cursive" }}>
                    {presidentName.trim() || 'Nombre Presidente'}
                  </h3>
                  <span style={{ fontSize: '0.72rem', color: '#15803d', fontWeight: 700 }}>
                    {profileInfo[presidentProfile].title}
                  </span>
                </div>
              </div>

              {/* FICHA CLUB */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <span style={{ fontSize: '0.66rem', fontWeight: 700, color: '#52525b', textTransform: 'uppercase' }}>
                  Detalles Institucionales
                </span>

                <div style={{ background: '#ffffff', border: '1.5px solid #18181b', borderRadius: '7px', padding: '0.5rem 0.65rem', display: 'flex', alignItems: 'center', gap: '0.6rem', boxShadow: '1.5px 1.5px 0px #18181b' }}>
                  {mode === 'EXISTING' && selectedClub && (
                    <>
                      <ClubCrest
                        logo={selectedClub.logo}
                        name={selectedClub.name}
                        abbr={selectedClub.abbr}
                        color1={selectedClub.color1}
                        color2={selectedClub.color2}
                        size={32}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h4 style={{ fontSize: '0.85rem', fontWeight: 700, margin: 0, color: '#18181b', fontFamily: "'Kalam', cursive", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {selectedClub.name}
                        </h4>
                        <span style={{ fontSize: '0.68rem', color: '#52525b' }}>
                          {selectedClub.stadium} • {divisions.find(d => d.id === selectedClub.divisionId)?.shortName}
                        </span>
                      </div>
                    </>
                  )}

                  {mode === 'CUSTOM' && (
                    <>
                      <ClubCrest
                        name={customName || 'Nuevo Club'}
                        abbr={customAbbr || 'NC'}
                        color1={customColor1}
                        color2={customColor2}
                        pattern={customPattern}
                        size={32}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h4 style={{ fontSize: '0.85rem', fontWeight: 700, margin: 0, color: '#18181b', fontFamily: "'Kalam', cursive", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {customName || 'Nuevo Club'} ({customAbbr || 'NC'})
                        </h4>
                        <span style={{ fontSize: '0.68rem', color: '#52525b' }}>
                          Club Fundado • 3ª División RFEF
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {/* PRESUPUESTO & TEMPORADA */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.35rem' }}>
                  <div style={{ background: '#bbf7d0', border: '1.5px solid #18181b', borderRadius: '7px', padding: '0.45rem 0.55rem', boxShadow: '1.5px 1.5px 0px #18181b' }}>
                    <span style={{ fontSize: '0.62rem', color: '#18181b', fontWeight: 700, textTransform: 'uppercase' }}>Presupuesto</span>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#15803d', fontFamily: "'Kalam', cursive", marginTop: '1px' }}>
                      {mode === 'EXISTING' && selectedClub ? `€${(selectedClub.budget / 1000000).toFixed(1)}M` : '€0.35M'}
                    </div>
                  </div>

                  <div style={{ background: '#fef08a', border: '1.5px solid #18181b', borderRadius: '7px', padding: '0.45rem 0.55rem', boxShadow: '1.5px 1.5px 0px #18181b' }}>
                    <span style={{ fontSize: '0.62rem', color: '#18181b', fontWeight: 700, textTransform: 'uppercase' }}>Temporada</span>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#b45309', fontFamily: "'Kalam', cursive", marginTop: '1px' }}>
                      2024 / 2025
                    </div>
                  </div>
                </div>

                {/* VISIÓN & BONO REAL */}
                <div style={{ background: '#bbf7d0', border: '1.5px solid #18181b', borderRadius: '7px', padding: '0.4rem 0.6rem', fontSize: '0.72rem', color: '#14532d', lineHeight: 1.25, boxShadow: '1.5px 1.5px 0px #18181b' }}>
                  <strong style={{ color: '#18181b' }}>Ventaja Directiva:</strong> {profileInfo[presidentProfile].bonus}
                </div>
              </div>
            </div>

            {/* BOTÓN ASUMIR PRESIDENCIA ESTILO CÓMIC DOODLE */}
            <div style={{ paddingTop: '0.55rem', borderTop: '1.5px solid #18181b', marginTop: 'auto' }}>
              <button
                onClick={handleStartGame}
                style={{
                  width: '100%',
                  background: '#22c55e',
                  color: '#ffffff',
                  border: '2px solid #18181b',
                  padding: '0.6rem 1rem',
                  borderRadius: '9px',
                  fontSize: '0.98rem',
                  fontWeight: 800,
                  fontFamily: "'Kalam', cursive",
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.45rem',
                  boxShadow: '2.5px 3px 0px #18181b',
                  transition: 'all 0.12s ease'
                }}
                onMouseOver={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <span>ASUMIR LA PRESIDENCIA</span>
                <PlayCircle size={17} />
              </button>
            </div>

          </div>
        </div>

      </main>

      {/* FOOTER BAR DOODLE (44PX) */}
      <footer style={{
        height: '44px',
        padding: '0 1.5rem',
        background: '#ffffff',
        borderTop: '2px solid #18181b',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
          {mode === 'EXISTING' && selectedClub && (
            <>
              <ClubCrest
                logo={selectedClub.logo}
                name={selectedClub.name}
                abbr={selectedClub.abbr}
                color1={selectedClub.color1}
                color2={selectedClub.color2}
                size={20}
              />
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#18181b', fontFamily: "'Patrick Hand', cursive" }}>
                Preparado para presidir a <strong>{selectedClub.name}</strong>
              </span>
            </>
          )}

          {mode === 'CUSTOM' && (
            <>
              <ClubCrest
                name={customName || 'Nuevo Club'}
                abbr={customAbbr || 'NC'}
                color1={customColor1}
                color2={customColor2}
                pattern={customPattern}
                size={20}
              />
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#18181b', fontFamily: "'Patrick Hand', cursive" }}>
                Preparado para fundar a <strong>{customName || 'Nuevo Club'}</strong>
              </span>
            </>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.74rem', color: '#52525b' }}>
          <span>Presidente de Club • Doodle Comic Style • RFEF 2024/25</span>
        </div>
      </footer>
    </div>
  );
};
