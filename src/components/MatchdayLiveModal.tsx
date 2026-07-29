import React, { useState, useEffect } from 'react';
import { Match, Club, Standing, WeeklyFinancialSummary } from '../types';
import { ClubCrest } from './ClubCrest';
import { Trophy, CheckCircle2, Zap, Shield, DollarSign, Activity } from 'lucide-react';

interface MatchdayLiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  userMatch: Match | null;
  weekMatches: Match[];
  allMatches?: Match[];
  clubs: Club[];
  weekNumber: number;
  season: string;
  standings: Standing[];
  weeklyFinances: WeeklyFinancialSummary | null;
  userClub: Club | null;
}

export const MatchdayLiveModal: React.FC<MatchdayLiveModalProps> = ({
  isOpen,
  onClose,
  userMatch,
  weekMatches,
  allMatches,
  clubs,
  weekNumber,
  season,
  standings,
  weeklyFinances,
  userClub
}) => {
  const [minute, setMinute] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const homeClub = clubs.find(c => c.id === userMatch?.homeTeamId);
  const awayClub = clubs.find(c => c.id === userMatch?.awayTeamId);
  const isUserHome = userClub?.id === userMatch?.homeTeamId;

  useEffect(() => {
    if (isOpen) {
      setMinute(0);
      setIsSimulating(true);
      setIsFinished(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !isSimulating) return;

    const interval = setInterval(() => {
      setMinute(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          setIsSimulating(false);
          setIsFinished(true);
          return 90;
        }
        return prev + 1;
      });
    }, 220); // 220ms * 90 ticks = ~19.8s total duration

    return () => clearInterval(interval);
  }, [isOpen, isSimulating]);

  const handleSkipAnimation = () => {
    setMinute(90);
    setIsSimulating(false);
    setIsFinished(true);
  };

  if (!isOpen || !userMatch || !userClub || !homeClub || !awayClub) return null;

  const getLiveMatchData = (match: Match) => {
    const activeEvents = (match.events || []).filter(e => e.minute <= minute);
    const homeGoals = activeEvents.filter(e => e.type === 'GOAL' && e.teamId === match.homeTeamId).length;
    const awayGoals = activeEvents.filter(e => e.type === 'GOAL' && e.teamId === match.awayTeamId).length;

    const finalHomeScore = isFinished ? (match.homeScore ?? homeGoals) : homeGoals;
    const finalAwayScore = isFinished ? (match.awayScore ?? awayGoals) : awayGoals;

    return {
      homeScore: finalHomeScore,
      awayScore: finalAwayScore,
      activeEvents
    };
  };

  const userMatchLiveData = getLiveMatchData(userMatch);

  const computeLiveStandings = (): Standing[] => {
    const tableMap = new Map<string, Standing>();
    const targetDivisionId = userMatch.divisionId || userClub.divisionId;
    const divClubs = clubs.filter(c => c.divisionId === targetDivisionId);

    // Initialize clean base table for division clubs
    divClubs.forEach(c => {
      tableMap.set(c.id, { clubId: c.id, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, pts: 0 });
    });

    // 1. Process previous completed matches (week < weekNumber)
    if (allMatches && allMatches.length > 0) {
      allMatches
        .filter(m => m.divisionId === targetDivisionId && m.week < weekNumber && m.played && m.homeScore !== undefined && m.awayScore !== undefined)
        .forEach(m => {
          const home = tableMap.get(m.homeTeamId);
          const away = tableMap.get(m.awayTeamId);
          if (home && away) {
            home.played += 1;
            away.played += 1;
            home.gf += m.homeScore!;
            home.ga += m.awayScore!;
            away.gf += m.awayScore!;
            away.ga += m.homeScore!;

            if (m.homeScore! > m.awayScore!) {
              home.won += 1;
              home.pts += 3;
              away.lost += 1;
            } else if (m.homeScore! < m.awayScore!) {
              away.won += 1;
              away.pts += 3;
              home.lost += 1;
            } else {
              home.drawn += 1;
              home.pts += 1;
              away.drawn += 1;
              away.pts += 1;
            }
          }
        });
    }

    // 2. Process current week matches live based on minute tick
    weekMatches.forEach(m => {
      const hData = getLiveMatchData(m);
      const home = tableMap.get(m.homeTeamId);
      const away = tableMap.get(m.awayTeamId);

      if (home && away) {
        const hG = hData.homeScore;
        const aG = hData.awayScore;

        home.played += 1;
        away.played += 1;
        home.gf += hG;
        home.ga += aG;
        away.gf += aG;
        away.ga += hG;

        if (hG > aG) {
          home.pts += 3;
          home.won += 1;
          away.lost += 1;
        } else if (hG < aG) {
          away.pts += 3;
          away.won += 1;
          home.lost += 1;
        } else {
          home.pts += 1;
          away.pts += 1;
          home.drawn += 1;
          away.drawn += 1;
        }
      }
    });

    return Array.from(tableMap.values()).sort((a, b) => {
      if (b.pts !== a.pts) return b.pts - a.pts;
      const diffB = b.gf - b.ga;
      const diffA = a.gf - a.ga;
      if (diffB !== diffA) return diffB - diffA;
      return b.gf - a.gf;
    });
  };

  const liveStandings = computeLiveStandings();
  const userRankIndex = liveStandings.findIndex(s => s.clubId === userClub.id);
  const userRank = userRankIndex !== -1 ? userRankIndex + 1 : 1;

  const userGoals = isUserHome ? userMatchLiveData.homeScore : userMatchLiveData.awayScore;
  const oppGoals = isUserHome ? userMatchLiveData.awayScore : userMatchLiveData.homeScore;

  let resultBadge = { text: 'EMPATE', bg: '#fef3c7', color: '#b45309', border: '#f59e0b' };
  if (userGoals > oppGoals) {
    resultBadge = { text: '¡VICTORIA!', bg: '#dcfce7', color: '#15803d', border: '#22c55e' };
  } else if (userGoals < oppGoals) {
    resultBadge = { text: 'DERROTA', bg: '#fee2e2', color: '#b91c1c', border: '#ef4444' };
  }

  return (
    <div className="modal-overlay" style={{ padding: '0.75rem' }}>
      <div className="modal-card" style={{ maxWidth: '940px', padding: '0.85rem 1rem', background: '#faf7f2', border: '2px solid #18181b', borderRadius: '14px', boxShadow: '3px 4px 0px #18181b', maxHeight: '94vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        
        {/* Header Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem', borderBottom: '1.5px solid #18181b', paddingBottom: '0.4rem', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '34px', height: '34px', background: '#fef08a', border: '1.5px solid #18181b', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '1.5px 1.5px 0px #18181b' }}>
              <Trophy size={18} color="#18181b" />
            </div>
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#18181b', lineHeight: 1.1 }}>
                Simulador de Jornada {weekNumber}
              </h2>
              <p style={{ fontSize: '0.75rem', color: '#52525b', margin: 0, fontWeight: 600 }}>
                Temporada {season} • LaLiga
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {!isFinished && (
              <button
                onClick={handleSkipAnimation}
                style={{
                  background: '#ffffff',
                  border: '1.5px solid #18181b',
                  borderRadius: '6px',
                  padding: '0.35rem 0.75rem',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '1.5px 1.5px 0px #18181b',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  color: '#18181b'
                }}
              >
                <Zap size={14} color="#d97706" />
                Saltar
              </button>
            )}
            {isFinished && (
              <button
                onClick={onClose}
                style={{
                  background: '#22c55e',
                  color: '#ffffff',
                  border: '1.5px solid #18181b',
                  borderRadius: '6px',
                  padding: '0.4rem 0.9rem',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '2px 2px 0px #18181b',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <CheckCircle2 size={16} />
                Continuar a la Gestión
              </button>
            )}
          </div>
        </div>

        {/* Main Grid Content */}
        <div style={{ display: 'grid', gridTemplateColumns: '215px 1fr 200px', gap: '0.65rem', alignItems: 'start', flex: 1, overflow: 'hidden' }}>
          
          {/* Left Column: Live Matches Ticker */}
          <div style={{ background: '#ffffff', border: '1.5px solid #18181b', borderRadius: '10px', padding: '0.55rem', boxShadow: '2px 2px 0px #18181b', display: 'flex', flexDirection: 'column', gap: '0.4rem', height: '100%', maxHeight: '430px' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.85rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#18181b', borderBottom: '1px solid #18181b', paddingBottom: '0.3rem' }}>
              <Activity size={14} color="#2563eb" />
              Otros Marcadores (División)
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', overflowY: 'auto', maxHeight: '380px', paddingRight: '0.15rem' }}>
              {weekMatches.filter(m => m.id !== userMatch.id).map(m => {
                const hClub = clubs.find(c => c.id === m.homeTeamId);
                const aClub = clubs.find(c => c.id === m.awayTeamId);
                const lData = getLiveMatchData(m);

                return (
                  <div key={m.id} style={{ background: '#faf7f2', border: '1px solid #18181b', borderRadius: '6px', padding: '0.35rem 0.45rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 800, color: '#18181b', overflow: 'hidden' }}>
                      {hClub && <ClubCrest name={hClub.name} abbr={hClub.abbr} color1={hClub.color1} color2={hClub.color2} size={18} />}
                      <span style={{ fontSize: '0.75rem', fontWeight: 800 }}>{hClub?.abbr || 'HOM'}</span>
                      <span style={{ color: '#71717a', fontSize: '0.7rem', margin: '0 1px' }}>-</span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800 }}>{aClub?.abbr || 'AWY'}</span>
                      {aClub && <ClubCrest name={aClub.name} abbr={aClub.abbr} color1={aClub.color1} color2={aClub.color2} size={18} />}
                    </div>
                    <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, color: '#2563eb', background: '#fef08a', border: '1px solid #18181b', padding: '1px 5px', borderRadius: '4px', fontSize: '0.78rem', flexShrink: 0 }}>
                      {lData.homeScore} - {lData.awayScore}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Center Column: User Match & Live Feed */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
            
            {/* Match Board Banner */}
            <div style={{ background: '#ffffff', border: '1.5px solid #18181b', borderRadius: '10px', padding: '0.65rem 0.85rem', boxShadow: '2px 2.5px 0px #18181b', textAlign: 'center' }}>
              
              {/* Stadium & Minute Clock */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '2px 7px', background: '#e2e8f0', border: '1px solid #18181b', borderRadius: '4px', color: '#18181b' }}>
                  🏟️ {userMatch.stadiumName || homeClub.stadium}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: '#18181b', color: '#fef08a', padding: '2px 8px', borderRadius: '14px', fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '0.92rem' }}>
                  <span>{minute}' {isFinished && ' (FINAL)'}</span>
                </div>
              </div>

              {/* Teams & Scoreboard */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '0.35rem 0' }}>
                {/* Home */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem' }}>
                  <ClubCrest name={homeClub.name} abbr={homeClub.abbr} color1={homeClub.color1} color2={homeClub.color2} size={42} />
                  <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '0.92rem', color: '#18181b', lineHeight: 1.1, maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {homeClub.name}
                  </span>
                  <span style={{ fontSize: '0.65rem', fontWeight: 800, background: '#e2e8f0', border: '1px solid #18181b', padding: '0px 4px', borderRadius: '3px' }}>LOCAL</span>
                </div>

                {/* Score Big Display */}
                <div style={{ background: '#fef08a', border: '1.5px solid #18181b', borderRadius: '10px', padding: '0.3rem 0.85rem', boxShadow: '1.5px 2px 0px #18181b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 900, color: '#18181b', lineHeight: 1 }}>
                    {userMatchLiveData.homeScore}
                  </span>
                  <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 800, color: '#71717a' }}>-</span>
                  <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 900, color: '#18181b', lineHeight: 1 }}>
                    {userMatchLiveData.awayScore}
                  </span>
                </div>

                {/* Away */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem' }}>
                  <ClubCrest name={awayClub.name} abbr={awayClub.abbr} color1={awayClub.color1} color2={awayClub.color2} size={42} />
                  <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '0.92rem', color: '#18181b', lineHeight: 1.1, maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {awayClub.name}
                  </span>
                  <span style={{ fontSize: '0.65rem', fontWeight: 800, background: '#e2e8f0', border: '1px solid #18181b', padding: '0px 4px', borderRadius: '3px' }}>VISITANTE</span>
                </div>
              </div>

              {/* Progress bar */}
              <div style={{ width: '100%', height: '7px', background: '#e2e8f0', border: '1px solid #18181b', borderRadius: '4px', overflow: 'hidden', marginTop: '0.4rem' }}>
                <div
                  style={{
                    height: '100%',
                    background: 'linear-gradient(90deg, #2563eb, #22c55e)',
                    width: `${(minute / 90) * 100}%`,
                    transition: 'width 0.22s linear'
                  }}
                />
              </div>
            </div>

            {/* Events Stream / Post-Match View */}
            {!isFinished ? (
              <div style={{ background: '#ffffff', border: '1.5px solid #18181b', borderRadius: '10px', padding: '0.55rem 0.75rem', boxShadow: '2px 2px 0px #18181b', minHeight: '90px' }}>
                <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.82rem', fontWeight: 800, marginBottom: '0.3rem', color: '#18181b' }}>
                  Eventos del Partido en Directo
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', maxHeight: '75px', overflowY: 'auto' }}>
                  {userMatchLiveData.activeEvents.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '0.75rem', fontSize: '0.75rem', color: '#71717a', fontStyle: 'italic' }}>
                      Partido en juego... sin acciones destacadas aún.
                    </div>
                  ) : (
                    userMatchLiveData.activeEvents.map((ev, idx) => (
                      <div key={idx} style={{ background: '#faf7f2', border: '1px solid #18181b', padding: '0.25rem 0.5rem', borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, color: '#2563eb', background: '#e0f2fe', padding: '1px 4px', borderRadius: '3px', border: '1px solid #18181b', fontSize: '0.72rem' }}>
                            {ev.minute}'
                          </span>
                          <span style={{ fontWeight: 800, color: '#18181b' }}>
                            {ev.type === 'GOAL' && '⚽ ¡GOL!'}
                            {ev.type === 'YELLOW' && '🟨 Amarilla'}
                            {ev.type === 'RED' && '🟥 Roja'}
                          </span>
                          <span style={{ color: '#3f3f46' }}>({ev.playerName})</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ) : (
              /* Post Match Summary */
              <div style={{ background: '#ffffff', border: '1.5px solid #18181b', borderRadius: '10px', padding: '0.65rem 0.85rem', boxShadow: '2px 2px 0px #18181b', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #18181b', paddingBottom: '0.35rem' }}>
                  <span style={{ background: resultBadge.bg, color: resultBadge.color, border: `1px solid ${resultBadge.border}`, padding: '1px 8px', borderRadius: '5px', fontWeight: 800, fontSize: '0.78rem' }}>
                    {resultBadge.text}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#71717a', fontWeight: 700 }}>Resultado Definitivo</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.45rem' }}>
                  <div style={{ background: '#faf7f2', border: '1px solid #18181b', padding: '0.4rem 0.55rem', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <DollarSign size={16} color="#16a34a" />
                    <div>
                      <div style={{ fontSize: '0.62rem', color: '#71717a', fontWeight: 700, textTransform: 'uppercase' }}>Taquilla / Balance</div>
                      <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '0.85rem', color: '#18181b' }}>
                        {weeklyFinances ? `${weeklyFinances.netTotal >= 0 ? '+' : ''}€${weeklyFinances.netTotal.toLocaleString('es-ES')}` : '€0'}
                      </div>
                    </div>
                  </div>

                  <div style={{ background: '#faf7f2', border: '1px solid #18181b', padding: '0.4rem 0.55rem', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Shield size={16} color="#2563eb" />
                    <div>
                      <div style={{ fontSize: '0.62rem', color: '#71717a', fontWeight: 700, textTransform: 'uppercase' }}>Masa Social</div>
                      <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '0.85rem', color: '#18181b' }}>
                        {userClub.fans.toLocaleString('es-ES')} fans
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ background: '#e0f2fe', border: '1px solid #18181b', padding: '0.4rem 0.55rem', borderRadius: '6px', fontSize: '0.75rem', color: '#1e3a8a', fontStyle: 'italic' }}>
                  <strong>DT {userClub.dt?.name || 'Técnico'}: </strong>
                  "{userGoals > oppGoals ? 'Excelente esfuerzo del equipo. Tres puntos muy importantes.' : userGoals === oppGoals ? 'Sumamos un punto trabajado en un duelo parejo.' : 'Debemos trabajar más en los entrenamientos para corregir desajustes.'}"
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Live Standings Table */}
          <div style={{ background: '#ffffff', border: '1.5px solid #18181b', borderRadius: '10px', padding: '0.55rem', boxShadow: '2px 2px 0px #18181b', display: 'flex', flexDirection: 'column', gap: '0.4rem', height: '100%', maxHeight: '430px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #18181b', paddingBottom: '0.3rem' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.85rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#18181b' }}>
                <Trophy size={14} color="#d97706" />
                Tabla en Vivo
              </h3>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, background: '#dcfce7', color: '#15803d', border: '1px solid #18181b', padding: '1px 5px', borderRadius: '4px' }}>
                #{userRank} {userClub.shortName}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', overflowY: 'auto', maxHeight: '380px', paddingRight: '0.15rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '22px 1fr 26px 30px', fontSize: '0.65rem', fontWeight: 800, color: '#71717a', padding: '1px 3px' }}>
                <span>Pos</span>
                <span>Club</span>
                <span style={{ textAlign: 'center' }}>PJ</span>
                <span style={{ textAlign: 'right' }}>Pts</span>
              </div>
              {liveStandings.slice(0, 10).map((st, idx) => {
                const club = clubs.find(c => c.id === st.clubId);
                const isUser = st.clubId === userClub.id;

                return (
                  <div
                    key={st.clubId}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '22px 1fr 26px 30px',
                      fontSize: '0.75rem',
                      fontWeight: isUser ? 800 : 600,
                      padding: '3px 4px',
                      borderRadius: '5px',
                      background: isUser ? '#fef08a' : '#faf7f2',
                      border: isUser ? '1.5px solid #18181b' : '1px solid #e2e8f0',
                      color: '#18181b'
                    }}
                  >
                    <span style={{ fontWeight: 800 }}>{idx + 1}</span>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{club?.shortName || 'Club'}</span>
                    <span style={{ textAlign: 'center', color: '#71717a' }}>{st.played}</span>
                    <span style={{ textAlign: 'right', fontFamily: 'var(--font-heading)', fontWeight: 800, color: '#2563eb' }}>{st.pts}</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
