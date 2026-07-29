import React, { useState, useMemo } from 'react';
import { useGame } from '../context/GameContext';
import { Trophy, Calendar, ChevronLeft, ChevronRight, Award, Flame, Clock, Zap, Filter } from 'lucide-react';
import { ClubCrest } from './ClubCrest';
import { Match, Player } from '../types';

export const LeagueTab: React.FC = () => {
  const { standings, clubs, matches, currentWeek, userClub, divisions, players } = useGame();
  
  // Subtab navigation: Standings, Calendar, Stats (only active, real features)
  const [activeSubTab, setActiveSubTab] = useState<'STANDINGS' | 'CALENDAR' | 'STATS'>('STANDINGS');
  
  // Calendar specific state
  const [calendarViewMode, setCalendarViewMode] = useState<'TIMELINE' | 'MONTH' | 'FIXTURES'>('TIMELINE');
  const [selectedWeek, setSelectedWeek] = useState<number>(currentWeek);
  const [selectedMonth, setSelectedMonth] = useState<number>(7); // 7 = August (start of season)
  const [onlyUserMatches, setOnlyUserMatches] = useState<boolean>(true);
  const [selectedMatchDetail, setSelectedMatchDetail] = useState<Match | null>(null);

  const currentDivision = userClub ? divisions.find(d => d.id === userClub.divisionId) : divisions[0];

  // Season months list (August to May for 38 rounds)
  const seasonMonths = [
    { name: 'Agosto 2026', monthIndex: 7, startWeek: 1, endWeek: 3 },
    { name: 'Septiembre 2026', monthIndex: 8, startWeek: 4, endWeek: 7 },
    { name: 'Octubre 2026', monthIndex: 9, startWeek: 8, endWeek: 11 },
    { name: 'Noviembre 2026', monthIndex: 10, startWeek: 12, endWeek: 15 },
    { name: 'Diciembre 2026', monthIndex: 11, startWeek: 16, endWeek: 19 },
    { name: 'Enero 2027', monthIndex: 0, startWeek: 20, endWeek: 23 },
    { name: 'Febrero 2027', monthIndex: 1, startWeek: 24, endWeek: 27 },
    { name: 'Marzo 2027', monthIndex: 2, startWeek: 28, endWeek: 31 },
    { name: 'Abril 2027', monthIndex: 3, startWeek: 32, endWeek: 35 },
    { name: 'Mayo 2027', monthIndex: 4, startWeek: 36, endWeek: 38 },
  ];

  // User's matches filtered and sorted
  const userMatches = useMemo(() => {
    if (!userClub) return [];
    return matches.filter(m => m.homeTeamId === userClub.id || m.awayTeamId === userClub.id)
                  .sort((a, b) => a.week - b.week);
  }, [matches, userClub]);

  // Next upcoming match for user
  const nextUserMatch = useMemo(() => {
    return userMatches.find(m => m.week >= currentWeek) || userMatches[userMatches.length - 1];
  }, [userMatches, currentWeek]);

  // Form guide (last 5 played matches) for each club
  const clubForms = useMemo(() => {
    const formMap = new Map<string, ('W' | 'D' | 'L')[]>();
    clubs.forEach(c => formMap.set(c.id, []));

    const playedMatches = matches.filter(m => m.played && m.homeScore !== undefined && m.awayScore !== undefined)
                                 .sort((a, b) => a.week - b.week);

    playedMatches.forEach(m => {
      const homeForm = formMap.get(m.homeTeamId) || [];
      const awayForm = formMap.get(m.awayTeamId) || [];

      if (m.homeScore! > m.awayScore!) {
        homeForm.push('W');
        awayForm.push('L');
      } else if (m.homeScore! < m.awayScore!) {
        awayForm.push('W');
        homeForm.push('L');
      } else {
        homeForm.push('D');
        awayForm.push('D');
      }

      formMap.set(m.homeTeamId, homeForm);
      formMap.set(m.awayTeamId, awayForm);
    });

    // Keep last 5
    const resultMap = new Map<string, ('W' | 'D' | 'L')[]>();
    formMap.forEach((form, clubId) => {
      resultMap.set(clubId, form.slice(-5));
    });

    return resultMap;
  }, [matches, clubs]);

  // Top scorers (Pichichi) calculation from match events & player stats (filtered by user division)
  const topScorers = useMemo(() => {
    if (!userClub) return [];
    const divClubIds = clubs.filter(c => c.divisionId === userClub.divisionId).map(c => c.id);
    const divPlayers = players.filter(p => divClubIds.includes(p.clubId));

    const scorerMap = new Map<string, { playerName: string; goals: number; clubId: string; player?: Player }>();

    matches.filter(m => m.played && (m.divisionId === userClub.divisionId || divClubIds.includes(m.homeTeamId))).forEach(m => {
      m.events.filter(e => e.type === 'GOAL').forEach(e => {
        const key = `${e.playerName}_${e.teamId}`;
        const existing = scorerMap.get(key);
        if (existing) {
          existing.goals += 1;
        } else {
          const foundPlayer = divPlayers.find(p => p.name === e.playerName && p.clubId === e.teamId);
          scorerMap.set(key, { playerName: e.playerName, goals: 1, clubId: e.teamId, player: foundPlayer });
        }
      });
    });

    // Fallback top scorers from division players only
    if (scorerMap.size < 5) {
      divPlayers.filter(p => p.position === 'DC' || p.position === 'EI' || p.position === 'ED' || p.position === 'MCO').slice(0, 10).forEach(p => {
        const key = `${p.name}_${p.clubId}`;
        if (!scorerMap.has(key)) {
          const estimatedGoals = Math.max(1, Math.floor((p.ovr - 50) / 4) + Math.floor(Math.random() * 2));
          scorerMap.set(key, { playerName: p.name, goals: estimatedGoals, clubId: p.clubId, player: p });
        }
      });
    }

    return Array.from(scorerMap.values()).sort((a, b) => b.goals - a.goals).slice(0, 10);
  }, [matches, players, clubs, userClub]);

  // Handlers for week navigation
  const handlePrevWeek = () => setSelectedWeek(prev => Math.max(1, prev - 1));
  const handleNextWeek = () => setSelectedWeek(prev => Math.min(38, prev + 1));

  // Current week matches for selected week
  const weekMatches = useMemo(() => {
    let filtered = matches.filter(m => m.week === selectedWeek);
    if (onlyUserMatches && userClub) {
      filtered = filtered.filter(m => m.homeTeamId === userClub.id || m.awayTeamId === userClub.id);
    }
    return filtered;
  }, [matches, selectedWeek, onlyUserMatches, userClub]);

  // User position in standings
  const userRankIndex = standings.findIndex(s => s.clubId === userClub?.id);
  const userStanding = userRankIndex >= 0 ? standings[userRankIndex] : null;

  return (
    <section className="tab-pane active league-tab-root">
      {/* SECTION HEADER */}
      <div className="section-header" style={{ marginBottom: '0.2rem' }}>
        <div>
          <h2>Liga & Partidos — {currentDivision?.name || 'Liga Nacional'}</h2>
          <p>Gestión completa de clasificación de la Liga, calendario de fechas y líderes de goleo.</p>
        </div>
      </div>

      {/* SUB-NAV TABS */}
      <div className="league-subnav">
        <button
          className={`league-subnav-btn ${activeSubTab === 'STANDINGS' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('STANDINGS')}
        >
          <Trophy size={18} />
          <span>Tabla de Posiciones</span>
        </button>

        <button
          className={`league-subnav-btn ${activeSubTab === 'CALENDAR' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('CALENDAR')}
        >
          <Calendar size={18} />
          <span>Calendario Interactivo</span>
        </button>

        <button
          className={`league-subnav-btn ${activeSubTab === 'STATS' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('STATS')}
        >
          <Award size={18} />
          <span>Líderes & Pichichi</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SUB-TAB 1: TABLA DE POSICIONES (STANDINGS) */}
      {/* ========================================================================= */}
      {activeSubTab === 'STANDINGS' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          {/* User Club Performance Banner Doodle */}
          {userClub && userStanding && (
            <div style={{
              background: '#ffffff',
              border: '2px solid #18181b',
              borderRadius: '12px',
              boxShadow: '2.5px 3px 0px #18181b',
              padding: '1.1rem 1.4rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <ClubCrest logo={userClub.logo} name={userClub.name} abbr={userClub.abbr} color1={userClub.color1} size={46} />
                  <div>
                    <h3 style={{ fontFamily: "'Kalam', cursive", fontSize: '1.3rem', fontWeight: 800, margin: 0, color: '#18181b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {userClub.name}
                      <span style={{ background: '#fef08a', color: '#18181b', border: '1.5px solid #18181b', borderRadius: '12px', padding: '2px 8px', fontSize: '0.75rem', fontWeight: 800, fontFamily: "'Patrick Hand', cursive" }}>
                        {userRankIndex + 1}º Clasificado
                      </span>
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: '#52525b', margin: '2px 0 0 0', fontFamily: "'Patrick Hand', cursive" }}>
                      {userStanding.pts} Puntos | {userStanding.played} PJ ({userStanding.won}G - {userStanding.drawn}E - {userStanding.lost}P) | Dif: {userStanding.gf - userStanding.ga > 0 ? `+${userStanding.gf - userStanding.ga}` : userStanding.gf - userStanding.ga}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <span style={{ fontSize: '0.7rem', color: '#52525b', fontWeight: 800, textTransform: 'uppercase' }}>Racha Reciente</span>
                    <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                      {(clubForms.get(userClub.id) || ['W', 'W', 'D', 'L', 'W']).map((res, i) => (
                        <span
                          key={i}
                          style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.68rem',
                            fontWeight: 800,
                            border: '1px solid #18181b',
                            background: res === 'W' ? '#bbf7d0' : res === 'D' ? '#fef08a' : '#fecaca',
                            color: '#18181b'
                          }}
                        >
                          {res}
                        </span>
                      ))}
                    </div>
                  </div>

                  {nextUserMatch && (
                    <div style={{ background: '#fef08a', border: '1.5px solid #18181b', borderRadius: '10px', padding: '0.5rem 0.85rem', display: 'flex', alignItems: 'center', gap: '0.6rem', boxShadow: '1.5px 2px 0px #18181b' }}>
                      <Zap size={18} color="#18181b" />
                      <div>
                        <div style={{ fontSize: '0.68rem', color: '#52525b', fontWeight: 800 }}>Próxima Jornada {nextUserMatch.week}</div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#18181b', fontFamily: "'Kalam', cursive" }}>
                          vs {nextUserMatch.homeTeamId === userClub.id ? clubs.find(c => c.id === nextUserMatch.awayTeamId)?.shortName : clubs.find(c => c.id === nextUserMatch.homeTeamId)?.shortName}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STANDINGS CARD */}
          <div className="card">
            <div className="card-title" style={{ justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Trophy size={20} color="#eab308" />
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#18181b', fontFamily: "'Kalam', cursive" }}>Clasificación Oficial — {currentDivision?.name}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ background: '#bbf7d0', color: '#18181b', border: '1.5px solid #18181b', borderRadius: '12px', padding: '2px 8px', fontSize: '0.75rem', fontWeight: 800, fontFamily: "'Patrick Hand', cursive" }}>
                  Jornada {currentWeek} / 38
                </span>
              </div>
            </div>

            <div className="table-responsive" style={{ marginTop: '0.5rem' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width: '45px' }}>Pos</th>
                    <th>Club</th>
                    <th style={{ textAlign: 'center' }}>Forma</th>
                    <th>PJ</th>
                    <th>PG</th>
                    <th>PE</th>
                    <th>PP</th>
                    <th>GF</th>
                    <th>GC</th>
                    <th>DIF</th>
                    <th>Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {standings.map((st, index) => {
                    const club = clubs.find(c => c.id === st.clubId);
                    const isUser = userClub && club && club.id === userClub.id;
                    const rank = index + 1;
                    const formList: string[] = clubForms.get(st.clubId) || ['W', 'D', 'W', 'L', 'W'];

                    let rankBadgeClass = '';
                    if (rank <= 3) rankBadgeClass = 'rank-promoted';
                    else if (rank >= 18) rankBadgeClass = 'rank-relegated';

                    return (
                      <tr
                        key={st.clubId}
                        style={{
                          backgroundColor: isUser ? '#fef08a' : undefined,
                          borderLeft: isUser ? '4px solid #18181b' : undefined,
                          fontWeight: isUser ? 800 : 500
                        }}
                      >
                        <td>
                          <span className={`rank-tag ${rankBadgeClass}`}>
                            {rank}º
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            {club && <ClubCrest logo={club.logo} name={club.name} abbr={club.abbr} color1={club.color1} size={24} />}
                            <div>
                              <strong style={{ color: '#18181b', fontWeight: isUser ? 900 : 700, fontSize: '0.9rem' }}>
                                {club ? club.name : st.clubId}
                              </strong>
                              {isUser && <span style={{ fontSize: '0.72rem', color: '#15803d', fontWeight: 800, marginLeft: '6px' }}>(Tu Club)</span>}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '3px', alignItems: 'center', justifyContent: 'center' }}>
                            {formList.map((res, i) => (
                              <span
                                key={i}
                                title={res === 'W' ? 'Victoria' : res === 'D' ? 'Empate' : 'Derrota'}
                                style={{
                                  width: '8px',
                                  height: '8px',
                                  borderRadius: '50%',
                                  background: res === 'W' ? '#10b981' : res === 'D' ? '#f59e0b' : '#ef4444'
                                }}
                              />
                            ))}
                          </div>
                        </td>
                        <td>{st.played}</td>
                        <td style={{ color: '#10b981', fontWeight: 700 }}>{st.won}</td>
                        <td style={{ color: '#f59e0b' }}>{st.drawn}</td>
                        <td style={{ color: '#ef4444' }}>{st.lost}</td>
                        <td>{st.gf}</td>
                        <td>{st.ga}</td>
                        <td style={{ fontWeight: 700, color: st.gf - st.ga > 0 ? '#10b981' : st.gf - st.ga < 0 ? '#ef4444' : 'var(--text-muted)' }}>
                          {st.gf - st.ga > 0 ? `+${st.gf - st.ga}` : st.gf - st.ga}
                        </td>
                        <td>
                          <strong style={{ color: '#f59e0b', fontSize: '1.02rem', fontFamily: 'var(--font-heading)' }}>
                            {st.pts}
                          </strong>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Zone Legend */}
            <div style={{ padding: '0.85rem 1.25rem', display: 'flex', gap: '1.5rem', fontSize: '0.78rem', color: 'var(--text-secondary)', borderTop: '1px solid var(--border-color)', flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '4px', background: '#dcfce7', border: '1px solid #16a34a' }}></span>
                <strong>1º - 3º</strong>: Ascenso / Título de Liga
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '4px', background: '#fee2e2', border: '1px solid #dc2626' }}></span>
                <strong>18º - 20º</strong>: Zona de Descenso
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 2: CALENDARIO INTERACTIVO ("MÁS CALENDARIO") */}
      {/* ========================================================================= */}
      {activeSubTab === 'CALENDAR' && (
        <div className="calendar-hub">
          {/* Calendar View Control Bar */}
          <div className="calendar-control-bar">
            <div className="calendar-view-toggle">
              <button
                className={`calendar-view-btn ${calendarViewMode === 'TIMELINE' ? 'active' : ''}`}
                onClick={() => setCalendarViewMode('TIMELINE')}
              >
                <Clock size={16} />
                <span>Timeline & Días de Descanso</span>
              </button>

              <button
                className={`calendar-view-btn ${calendarViewMode === 'MONTH' ? 'active' : ''}`}
                onClick={() => setCalendarViewMode('MONTH')}
              >
                <Calendar size={16} />
                <span>Vista Cuadrícula Mensual</span>
              </button>

              <button
                className={`calendar-view-btn ${calendarViewMode === 'FIXTURES' ? 'active' : ''}`}
                onClick={() => setCalendarViewMode('FIXTURES')}
              >
                <Filter size={16} />
                <span>Jornada por Jornada (1-38)</span>
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', cursor: 'pointer', fontWeight: 600, color: 'var(--text-secondary)' }}>
                <input
                  type="checkbox"
                  checked={onlyUserMatches}
                  onChange={(e) => setOnlyUserMatches(e.target.checked)}
                />
                Solo partidos de mi club
              </label>

              <button
                className="btn btn-outline"
                style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
                onClick={() => setSelectedWeek(currentWeek)}
              >
                Ir a Jornada Actual ({currentWeek})
              </button>
            </div>
          </div>

          {/* VIEW A: TIMELINE & REST DAYS */}
          {calendarViewMode === 'TIMELINE' && (
            <div className="rest-timeline-container">
              <div className="card-title" style={{ justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Clock size={18} color="#3b82f6" />
                  <span>Calendario de Partidos y Tiempo de Descanso Entre Encuentros</span>
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Visualiza el descanso disponible entre cada fecha
                </span>
              </div>

              {userMatches.map((m, index) => {
                const home = clubs.find(c => c.id === m.homeTeamId);
                const away = clubs.find(c => c.id === m.awayTeamId);
                const isUserMatch = userClub && (m.homeTeamId === userClub.id || m.awayTeamId === userClub.id);
                const isCurrent = m.week === currentWeek;
                const isPast = m.week < currentWeek;

                // Calculate rest days from previous match
                const restDays = index === 0 ? 7 : (m.week - userMatches[index - 1].week) * 7;
                
                let restStatusClass = 'rest-ok';
                let restStatusLabel = `${restDays} Días de descanso — Óptimo`;
                if (restDays <= 3) {
                  restStatusClass = 'rest-critical';
                  restStatusLabel = `${restDays} Días — ⚡ ALERTA: Calendario apretado`;
                } else if (restDays <= 5) {
                  restStatusClass = 'rest-warning';
                  restStatusLabel = `${restDays} Días — Carga de partidos normal`;
                }

                return (
                  <div
                    key={m.id}
                    className={`rest-timeline-card ${isUserMatch ? 'is-user-match' : ''}`}
                    style={{
                      borderLeft: isCurrent ? '4px solid #3b82f6' : isPast ? '4px solid #64748b' : '4px solid #10b981',
                      opacity: isPast ? 0.85 : 1
                    }}
                  >
                    {/* Left: Round & Date */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: '120px' }}>
                      <span className="pill pill-blue" style={{ fontSize: '0.7rem', width: 'fit-content' }}>
                        Jornada {m.week} {isCurrent && '(Actual)'}
                      </span>
                      <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
                        {m.matchDate || `Fecha Jornada ${m.week}`}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {m.stadiumName ? `Estadio: ${m.stadiumName}` : 'Estadio Oficial'}
                      </span>
                    </div>

                    {/* Center: Rest Days Indicator */}
                    <div style={{ display: 'flex', flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <div className={`rest-gap-banner ${restStatusClass}`}>
                        {restStatusLabel}
                      </div>

                      {/* Score / Teams vs */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginTop: '0.6rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: home?.id === userClub?.id ? 800 : 600 }}>
                          {home && <ClubCrest logo={home.logo} name={home.name} abbr={home.abbr} color1={home.color1} size={28} />}
                          <span style={{ fontSize: '0.95rem' }}>{home?.name}</span>
                        </div>

                        <div style={{
                          background: m.played ? '#fef08a' : '#bbf7d0',
                          border: '1.5px solid #18181b',
                          padding: '0.4rem 1.1rem',
                          fontFamily: "'Kalam', cursive",
                          fontSize: '1.1rem',
                          fontWeight: 800,
                          color: '#18181b',
                          borderRadius: '8px',
                          boxShadow: '1.5px 2px 0px #18181b'
                        }}>
                          {m.played ? `${m.homeScore} - ${m.awayScore}` : 'VS'}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: away?.id === userClub?.id ? 800 : 600 }}>
                          <span style={{ fontSize: '0.95rem' }}>{away?.name}</span>
                          {away && <ClubCrest logo={away.logo} name={away.name} abbr={away.abbr} color1={away.color1} size={28} />}
                        </div>
                      </div>
                    </div>

                    {/* Right: Details button */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                      <span className="comp-badge-pill league">
                        Liga Nacional
                      </span>
                      {m.played && (
                        <button
                          className="btn btn-outline"
                          style={{ padding: '2px 8px', fontSize: '0.72rem' }}
                          onClick={() => setSelectedMatchDetail(m)}
                        >
                          Ver Ficha
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* VIEW B: CUADRÍCULA MENSUAL (MONTH GRID) */}
          {calendarViewMode === 'MONTH' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Month Selector Bar */}
              <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.4rem' }}>
                {seasonMonths.map((m) => (
                  <button
                    key={m.name}
                    className={`btn ${selectedMonth === m.monthIndex ? 'btn-primary' : 'btn-outline'}`}
                    style={{ fontSize: '0.8rem', padding: '0.45rem 0.9rem', whiteSpace: 'nowrap' }}
                    onClick={() => setSelectedMonth(m.monthIndex)}
                  >
                    {m.name} (J{m.startWeek}-J{m.endWeek})
                  </button>
                ))}
              </div>

              {/* Month Calendar Grid */}
              <div className="calendar-month-grid">
                {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => (
                  <div key={day} className="calendar-weekday-header">{day}</div>
                ))}

                {/* Generate 28 Day Tiles for selected month */}
                {Array.from({ length: 28 }).map((_, dayIdx) => {
                  const dayNum = dayIdx + 1;
                  const currentMonthConfig = seasonMonths.find(sm => sm.monthIndex === selectedMonth) || seasonMonths[0];
                  
                  const weekInMonth = Math.floor(dayIdx / 7);
                  const estimatedWeek = currentMonthConfig.startWeek + weekInMonth;

                  // Unique matchday allocation per week (Sábado, Domingo o Miércoles)
                  const dayOfWeek = dayIdx % 7; // 0=Lun, 1=Mar, 2=Mié, 3=Jue, 4=Vie, 5=Sáb, 6=Dom
                  const targetDayOfWeek = (estimatedWeek % 3 === 0) ? 2 : (estimatedWeek % 2 === 0 ? 5 : 6);
                  const isMatchDay = dayOfWeek === targetDayOfWeek && estimatedWeek <= 38;
                  
                  const monthMatch = isMatchDay ? matches.find(m => m.week === estimatedWeek && (
                    !onlyUserMatches || (userClub && (m.homeTeamId === userClub.id || m.awayTeamId === userClub.id))
                  )) : null;

                  const isUserDay = monthMatch && userClub && (monthMatch.homeTeamId === userClub.id || monthMatch.awayTeamId === userClub.id);

                  return (
                    <div
                      key={dayIdx}
                      className={`calendar-day-tile ${estimatedWeek === currentWeek && isMatchDay ? 'is-today' : ''}`}
                    >
                      <div className="calendar-day-num">{dayNum}</div>

                      {isMatchDay && monthMatch ? (
                        <div className={`calendar-match-badge ${isUserDay ? 'badge-user' : 'badge-general'}`}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>J{monthMatch.week}</span>
                            <span>{monthMatch.played ? `${monthMatch.homeScore}-${monthMatch.awayScore}` : 'VS'}</span>
                          </div>
                          <div style={{ fontSize: '0.65rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {clubs.find(c => c.id === monthMatch.homeTeamId)?.shortName} vs {clubs.find(c => c.id === monthMatch.awayTeamId)?.shortName}
                          </div>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Descanso</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* VIEW C: JORNADA POR JORNADA (FIXTURES BY ROUND) */}
          {calendarViewMode === 'FIXTURES' && (
            <div className="card">
              <div className="card-title" style={{ justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Calendar size={18} />
                  <span>Calendario por Jornada</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <button className="btn btn-outline" style={{ padding: '2px 8px', height: '28px' }} onClick={handlePrevWeek} disabled={selectedWeek <= 1}>
                    <ChevronLeft size={16} />
                  </button>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, padding: '0 0.5rem' }}>
                    Jornada {selectedWeek} de 38 {selectedWeek === currentWeek && '(Jornada Actual)'}
                  </span>
                  <button className="btn btn-outline" style={{ padding: '2px 8px', height: '28px' }} onClick={handleNextWeek} disabled={selectedWeek >= 38}>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              <div className="proposals-list" style={{ marginTop: '0.75rem' }}>
                {weekMatches.length > 0 ? (
                  weekMatches.map(m => {
                    const home = clubs.find(c => c.id === m.homeTeamId);
                    const away = clubs.find(c => c.id === m.awayTeamId);
                    const isUserMatch = userClub && (m.homeTeamId === userClub.id || m.awayTeamId === userClub.id);

                    return (
                      <div
                        key={m.id}
                        className="dt-card-item"
                        style={{
                          padding: '0.75rem 1rem',
                          background: isUserMatch ? 'rgba(37, 99, 235, 0.08)' : undefined,
                          border: isUserMatch ? '1px solid #93c5fd' : undefined
                        }}
                      >
                        <div style={{ flex: 1, textAlign: 'right', fontWeight: home?.id === userClub?.id ? 800 : 600, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                          <span>{home?.name}</span>
                          {home && <ClubCrest logo={home.logo} name={home.name} abbr={home.abbr} color1={home.color1} size={24} />}
                        </div>

                        <div style={{
                          margin: '0 1rem',
                          background: m.played ? 'var(--bg-input)' : '#eff6ff',
                          padding: '4px 12px',
                          borderRadius: '8px',
                          fontFamily: 'var(--font-heading)',
                          fontSize: '1rem',
                          fontWeight: 800,
                          color: m.played ? 'var(--text-primary)' : '#2563eb'
                        }}>
                          {m.played ? `${m.homeScore} - ${m.awayScore}` : 'VS'}
                        </div>

                        <div style={{ flex: 1, textAlign: 'left', fontWeight: away?.id === userClub?.id ? 800 : 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {away && <ClubCrest logo={away.logo} name={away.name} abbr={away.abbr} color1={away.color1} size={24} />}
                          <span>{away?.name}</span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="no-data">No hay partidos para mostrar en esta jornada con los filtros aplicados</div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 3: LÍDERES Y ESTADÍSTICAS (PICHICHI) */}
      {/* ========================================================================= */}
      {activeSubTab === 'STATS' && (
        <div className="leaderboards-container">
          {/* Pichichi / Top Scorers */}
          <div className="leaderboard-card">
            <div className="card-title">
              <Flame size={20} color="#f59e0b" />
              <span>Trofeo Pichichi — Máximos Goleadores de la Liga</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '0.5rem' }}>
              {topScorers.map((scorer, index) => {
                const club = clubs.find(c => c.id === scorer.clubId);
                const rank = index + 1;

                return (
                  <div key={index} className="leaderboard-row">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span className={`leaderboard-rank-circle rank-${rank <= 3 ? rank : 'other'}`}>
                        {rank}º
                      </span>
                      {club && <ClubCrest logo={club.logo} name={club.name} abbr={club.abbr} color1={club.color1} size={22} />}
                      <div>
                        <strong style={{ fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                          {scorer.playerName}
                        </strong>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                          {club?.shortName} {scorer.player ? `• ${scorer.player.position} (${scorer.player.ovr} OVR)` : ''}
                        </div>
                      </div>
                    </div>

                    <div className="leaderboard-stat-badge">
                      {scorer.goals} <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Goles</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Assists */}
          <div className="leaderboard-card">
            <div className="card-title">
              <Award size={20} color="#3b82f6" />
              <span>Máximos Asistidores de la Liga</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '0.5rem' }}>
              {(() => {
                const divClubIds = clubs.filter(c => c.divisionId === userClub?.divisionId).map(c => c.id);
                const divAssisters = players.filter(p => divClubIds.includes(p.clubId) && (p.position === 'MC' || p.position === 'MCO' || p.position === 'EI' || p.position === 'ED')).slice(0, 8);

                return divAssisters.map((player, index) => {
                  const club = clubs.find(c => c.id === player.clubId);
                  const rank = index + 1;
                  const estimatedAssists = Math.max(1, Math.floor((player.ovr - 50) / 3));

                  return (
                    <div key={player.id} className="leaderboard-row">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span className={`leaderboard-rank-circle rank-${rank <= 3 ? rank : 'other'}`}>
                          {rank}º
                        </span>
                        {club && <ClubCrest logo={club.logo} name={club.name} abbr={club.abbr} color1={club.color1} size={22} />}
                        <div>
                          <strong style={{ fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                            {player.name}
                          </strong>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                            {club?.shortName} • {player.position} ({player.ovr} OVR)
                          </div>
                        </div>
                      </div>

                      <div className="leaderboard-stat-badge" style={{ color: '#2563eb' }}>
                        {estimatedAssists} <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Asist.</span>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </div>
      )}

      {/* MATCH EVENTS MODAL */}
      {selectedMatchDetail && (
        <div className="modal-backdrop" onClick={() => setSelectedMatchDetail(null)}>
          <div className="squad-modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '460px' }}>
            <div className="modal-header">
              <div className="modal-title-flex">
                <Calendar size={22} color="#3b82f6" />
                <div>
                  <h3>Ficha del Partido — Jornada {selectedMatchDetail.week}</h3>
                  <div className="modal-subname">{selectedMatchDetail.matchDate || 'Liga Nacional'}</div>
                </div>
              </div>
              <button className="btn-close-modal" onClick={() => setSelectedMatchDetail(null)}>✕</button>
            </div>

            <div className="modal-body-squad">
              {/* Score banner */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', background: 'rgba(15, 23, 42, 0.7)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 800, fontSize: '1rem' }}>{clubs.find(c => c.id === selectedMatchDetail.homeTeamId)?.name}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Local</div>
                </div>

                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 900, color: '#f59e0b' }}>
                  {selectedMatchDetail.homeScore} - {selectedMatchDetail.awayScore}
                </div>

                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 800, fontSize: '1rem' }}>{clubs.find(c => c.id === selectedMatchDetail.awayTeamId)?.name}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Visitante</div>
                </div>
              </div>

              {/* Events list */}
              <div>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Acontecimientos del Partido</h4>
                {selectedMatchDetail.events && selectedMatchDetail.events.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {selectedMatchDetail.events.map((ev, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.4rem 0.75rem', background: 'rgba(255, 255, 255, 0.04)', borderRadius: '6px', fontSize: '0.8rem' }}>
                        <span>⚽ Gol min {ev.minute}' — <strong>{ev.playerName}</strong></span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{clubs.find(c => c.id === ev.teamId)?.shortName}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1rem 0' }}>
                    Sin eventos destacables registrados en la ficha oficial.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
