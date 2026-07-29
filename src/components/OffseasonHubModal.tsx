import React, { useState } from 'react';
import { Club, Player, Standing } from '../types';
import { Trophy, Award, DollarSign, Users, Sparkles, ChevronRight, CheckCircle2, Flame, Star, Play } from 'lucide-react';

interface OffseasonHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  seasonEnded: string;
  nextSeason: string;
  userClub: Club | null;
  standings: Standing[];
  clubs: Club[];
  players: Player[];
  onPlayFriendlyMatch?: (opponentName: string, prize: number) => void;
}

export const OffseasonHubModal: React.FC<OffseasonHubModalProps> = ({
  isOpen,
  onClose,
  seasonEnded,
  nextSeason,
  userClub,
  standings,
  clubs,
  players,
  onPlayFriendlyMatch
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [friendliesPlayed, setFriendliesPlayed] = useState<string[]>([]);

  if (!isOpen || !userClub) return null;

  const userStanding = standings.find(s => s.clubId === userClub.id);
  const userRank = userStanding ? standings.findIndex(s => s.clubId === userClub.id) + 1 : 1;
  const isChampion = userRank === 1;
  const isPromoted = userRank <= 3 && userClub.divisionId !== 'div1';

  const squad = players.filter(p => p.clubId === userClub.id);
  const topScorer = [...squad].sort((a, b) => (b.ovr || 0) - (a.ovr || 0))[0];

  const handleFriendlyClick = (teamName: string, prize: number) => {
    if (friendliesPlayed.includes(teamName)) return;
    setFriendliesPlayed(prev => [...prev, teamName]);
    if (onPlayFriendlyMatch) {
      onPlayFriendlyMatch(teamName, prize);
    }
  };

  return (
    <div className="modal-overlay" style={{ padding: '0.75rem' }}>
      <div className="modal-card" style={{ maxWidth: '780px', padding: '0.85rem 1.1rem', background: '#faf7f2', border: '2px solid #18181b', borderRadius: '14px', boxShadow: '3px 4px 0px #18181b', maxHeight: '94vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        
        {/* Header Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem', borderBottom: '1.5px solid #18181b', paddingBottom: '0.4rem', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '34px', height: '34px', background: '#fef08a', border: '1.5px solid #18181b', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '1.5px 1.5px 0px #18181b' }}>
              <Trophy size={18} color="#18181b" />
            </div>
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#18181b', lineHeight: 1.1 }}>
                Gala de Transición de Temporada
              </h2>
              <p style={{ fontSize: '0.75rem', color: '#52525b', margin: 0, fontWeight: 600 }}>
                Cierre de {seasonEnded} • Preparación {nextSeason}
              </p>
            </div>
          </div>

          {/* Stepper indicators */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            {[1, 2, 3, 4].map(s => (
              <div
                key={s}
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.75rem',
                  border: '1.5px solid #18181b',
                  background: step === s ? '#fef08a' : step > s ? '#dcfce7' : '#ffffff',
                  color: '#18181b'
                }}
              >
                {step > s ? <CheckCircle2 size={13} color="#15803d" /> : s}
              </div>
            ))}
          </div>
        </div>

        {/* Modal Body Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1, overflowY: 'auto' }}>
          
          {/* STEP 1: GALA DE PREMIOS & RESULTADOS */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ textAlign: 'center', padding: '0.2rem 0' }}>
                {isChampion ? (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '2px 10px', borderRadius: '14px', background: '#fef08a', border: '1px solid #18181b', fontWeight: 800, fontSize: '0.78rem', color: '#18181b', marginBottom: '0.3rem' }}>
                    <Sparkles size={14} color="#d97706" /> ¡CAMPEONES DE LIGA!
                  </span>
                ) : isPromoted ? (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '2px 10px', borderRadius: '14px', background: '#dcfce7', border: '1px solid #18181b', fontWeight: 800, fontSize: '0.78rem', color: '#15803d', marginBottom: '0.3rem' }}>
                    <Award size={14} color="#15803d" /> ¡ASCENSO CONSEGUIDO!
                  </span>
                ) : (
                  <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '14px', background: '#e2e8f0', border: '1px solid #18181b', fontWeight: 800, fontSize: '0.78rem', color: '#18181b', marginBottom: '0.3rem' }}>
                    Balance de Temporada {seasonEnded}
                  </span>
                )}

                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 900, color: '#18181b', margin: '0.15rem 0' }}>
                  Posición Final: #{userRank} en la Clasificación
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#52525b', margin: 0 }}>
                  El club ha disputado 38 jornadas mostrando un gran nivel competitivo.
                </p>
              </div>

              {/* Awards Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.65rem' }}>
                <div style={{ background: '#ffffff', border: '1.5px solid #18181b', borderRadius: '10px', padding: '0.65rem', textAlign: 'center', boxShadow: '2px 2px 0px #18181b', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem' }}>
                  <Trophy size={24} color="#d97706" />
                  <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#71717a', textTransform: 'uppercase' }}>Mérito Deportivo</span>
                  <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 800, color: '#18181b' }}>
                    {userStanding ? `${userStanding.pts} Puntos` : '0 Pts'}
                  </span>
                  <span style={{ fontSize: '0.68rem', color: '#52525b', fontWeight: 600 }}>
                    {userStanding?.won}V / {userStanding?.drawn}E / {userStanding?.lost}D
                  </span>
                </div>

                <div style={{ background: '#ffffff', border: '1.5px solid #18181b', borderRadius: '10px', padding: '0.65rem', textAlign: 'center', boxShadow: '2px 2px 0px #18181b', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem' }}>
                  <Star size={24} color="#16a34a" />
                  <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#71717a', textTransform: 'uppercase' }}>Referente de la Plantilla</span>
                  <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', fontWeight: 800, color: '#18181b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '140px' }}>
                    {topScorer?.name || 'Capitán'}
                  </span>
                  <span style={{ fontSize: '0.68rem', color: '#16a34a', fontWeight: 800 }}>
                    {topScorer?.ovr || 75} OVR • {topScorer?.position}
                  </span>
                </div>

                <div style={{ background: '#ffffff', border: '1.5px solid #18181b', borderRadius: '10px', padding: '0.65rem', textAlign: 'center', boxShadow: '2px 2px 0px #18181b', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem' }}>
                  <Users size={24} color="#2563eb" />
                  <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#71717a', textTransform: 'uppercase' }}>Apoyo Social</span>
                  <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 800, color: '#18181b' }}>
                    {userClub.fans.toLocaleString('es-ES')}
                  </span>
                  <span style={{ fontSize: '0.68rem', color: '#2563eb', fontWeight: 800 }}>Aficionados Fieles</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: AUDITORÍA FINANCIERA & APROBACIÓN */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <div style={{ borderBottom: '1px solid #18181b', paddingBottom: '0.3rem' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#18181b' }}>
                  <DollarSign size={16} color="#16a34a" /> Auditoría Anual de la Junta Directiva
                </h3>
                <p style={{ fontSize: '0.75rem', color: '#52525b', margin: 0 }}>Evaluación del presupuesto y tesorería del club</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                <div style={{ background: '#ffffff', border: '1.5px solid #18181b', borderRadius: '10px', padding: '0.85rem', boxShadow: '2px 2px 0px #18181b', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#71717a', textTransform: 'uppercase' }}>Presupuesto Nueva Temporada</span>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 900, color: '#16a34a' }}>
                    €{userClub.budget.toLocaleString('es-ES')}
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#52525b', margin: 0 }}>
                    Incluye derechos televisivos, patrocinadores renovados e ingresos comerciales.
                  </p>
                </div>

                <div style={{ background: '#ffffff', border: '1.5px solid #18181b', borderRadius: '10px', padding: '0.85rem', boxShadow: '2px 2px 0px #18181b', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#71717a', textTransform: 'uppercase' }}>Aprobación de la Afición</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 900, color: '#d97706' }}>
                      {userClub.fanApproval || 90}%
                    </div>
                    <div style={{ flex: 1, background: '#e2e8f0', height: '9px', borderRadius: '4px', overflow: 'hidden', border: '1px solid #18181b' }}>
                      <div style={{ background: '#f59e0b', height: '100%', width: `${userClub.fanApproval || 90}%` }} />
                    </div>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#52525b', margin: 0 }}>
                    La junta directiva respalda tu gestión institucional para la temporada {nextSeason}.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: MERCADO DE VERANO & CANTERA */}
          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <div style={{ borderBottom: '1px solid #18181b', paddingBottom: '0.3rem' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#18181b' }}>
                  <Users size={16} color="#2563eb" /> Planificación de Plantilla y Cantera
                </h3>
                <p style={{ fontSize: '0.75rem', color: '#52525b', margin: 0 }}>Promociones automáticas para el curso {nextSeason}</p>
              </div>

              <div style={{ background: '#ffffff', border: '1.5px solid #18181b', borderRadius: '10px', padding: '0.85rem', boxShadow: '2px 2px 0px #18181b', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div style={{ width: '38px', height: '38px', background: '#e0f2fe', border: '1.5px solid #18181b', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Sparkles size={18} color="#2563eb" />
                  </div>
                  <div>
                    <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', fontWeight: 800, margin: 0, color: '#18181b' }}>Canteranos Promocionados</h4>
                    <p style={{ fontSize: '0.75rem', color: '#52525b', margin: 0 }}>Jóvenes de la academia han firmado su primer contrato profesional.</p>
                  </div>
                </div>
                <span style={{ padding: '3px 10px', background: '#dbeafe', border: '1px solid #18181b', borderRadius: '5px', fontWeight: 800, fontSize: '0.75rem', color: '#1d4ed8' }}>
                  Cantera Nivel {userClub.youthLevel || 1}
                </span>
              </div>
            </div>
          )}

          {/* STEP 4: PRETEMPORADA & AMISTOSOS */}
          {step === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <div style={{ borderBottom: '1px solid #18181b', paddingBottom: '0.3rem' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#18181b' }}>
                  <Flame size={16} color="#d97706" /> Gira de Pretemporada (Amistosos)
                </h3>
                <p style={{ fontSize: '0.75rem', color: '#52525b', margin: 0 }}>Disputa partidos veraniegos para ganar ingresos extra antes de arrancar la liga</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                {[
                  { name: 'Trofeo Ciudad Internacional', prize: 150000, opp: 'FC Porto (POR)' },
                  { name: 'Copa Confraternidad', prize: 250000, opp: 'Boca Juniors (ARG)' }
                ].map((f, i) => {
                  const played = friendliesPlayed.includes(f.name);

                  return (
                    <div key={i} style={{ background: '#ffffff', border: '1.5px solid #18181b', borderRadius: '10px', padding: '0.85rem', boxShadow: '2px 2px 0px #18181b', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '0.65rem' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                          <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#d97706', textTransform: 'uppercase' }}>{f.name}</span>
                          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, color: '#16a34a', fontSize: '0.82rem' }}>+€{f.prize.toLocaleString('es-ES')}</span>
                        </div>
                        <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 800, margin: 0, color: '#18181b' }}>Rival: {f.opp}</h4>
                      </div>

                      <button
                        onClick={() => handleFriendlyClick(f.name, f.prize)}
                        disabled={played}
                        style={{
                          width: '100%',
                          padding: '0.45rem 0.75rem',
                          borderRadius: '6px',
                          border: '1.5px solid #18181b',
                          fontWeight: 800,
                          fontSize: '0.78rem',
                          cursor: played ? 'default' : 'pointer',
                          background: played ? '#dcfce7' : '#fef08a',
                          color: played ? '#15803d' : '#18181b',
                          boxShadow: played ? 'none' : '1.5px 1.5px 0px #18181b',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.35rem'
                        }}
                      >
                        {played ? (
                          <>
                            <CheckCircle2 size={14} /> Amistoso Disputado (+€{f.prize.toLocaleString('es-ES')})
                          </>
                        ) : (
                          <>
                            <Play size={14} color="#18181b" /> Jugar Amistoso de Pretemporada
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Footer Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1.5px solid #18181b', paddingTop: '0.5rem', marginTop: '0.5rem', flexShrink: 0 }}>
          <button
            onClick={() => setStep(prev => Math.max(1, prev - 1) as any)}
            disabled={step === 1}
            style={{
              background: '#ffffff',
              border: '1.5px solid #18181b',
              borderRadius: '6px',
              padding: '0.35rem 0.85rem',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: step === 1 ? 'not-allowed' : 'pointer',
              opacity: step === 1 ? 0.4 : 1,
              color: '#18181b'
            }}
          >
            Anterior
          </button>

          {step < 4 ? (
            <button
              onClick={() => setStep(prev => Math.min(4, prev + 1) as any)}
              style={{
                background: '#fef08a',
                border: '1.5px solid #18181b',
                borderRadius: '6px',
                padding: '0.4rem 0.95rem',
                fontSize: '0.82rem',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '1.5px 1.5px 0px #18181b',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                color: '#18181b'
              }}
            >
              Siguiente Paso <ChevronRight size={16} />
            </button>
          ) : (
            <button
              onClick={onClose}
              style={{
                background: '#22c55e',
                color: '#ffffff',
                border: '1.5px solid #18181b',
                borderRadius: '6px',
                padding: '0.45rem 1.1rem',
                fontSize: '0.85rem',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '2px 2px 0px #18181b',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <CheckCircle2 size={16} />
              ¡Iniciar Temporada {nextSeason}!
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
