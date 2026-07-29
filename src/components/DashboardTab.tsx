import React from 'react';
import { useGame } from '../context/GameContext';
import { MatchSimulationSystem } from '../systems/MatchSimulationSystem';
import { EconomySystem } from '../systems/EconomySystem';
import { ClubCrest } from './ClubCrest';
import { DTPhoto } from './DTPhoto';
import { Calendar, TrendingUp, UserCheck, DollarSign, ShieldAlert, CheckCircle2, AlertTriangle, MapPin, Building2 } from 'lucide-react';

export const DashboardTab: React.FC = () => {
  const { userClub, presidentName, players, matches, currentWeek, standings, lastMatch, clubs, divisions } = useGame();

  if (!userClub) return null;

  const userSquad = players.filter(p => p.clubId === userClub.id);
  const teamOvr = MatchSimulationSystem.calculateTeamOvr(userClub.id, players);
  const userStanding = standings.findIndex(s => s.clubId === userClub.id) + 1;
  const currentDivision = divisions.find(d => d.id === userClub.divisionId);

  const nextMatch = matches.find(m => m.week === currentWeek && (m.homeTeamId === userClub.id || m.awayTeamId === userClub.id));
  const homeTeam = nextMatch ? clubs.find(c => c.id === nextMatch.homeTeamId) : null;
  const awayTeam = nextMatch ? clubs.find(c => c.id === nextMatch.awayTeamId) : null;
  const isHomeUser = nextMatch?.homeTeamId === userClub.id;

  const seasonalProjection = EconomySystem.calculateSeasonalProjection(userClub, userSquad);
  const formatCurr = (val: number) => '€' + val.toLocaleString('es-ES');

  return (
    <section className="tab-pane active">
      <div className="dashboard-grid">
        {/* HERO CARD */}
        <div className="card card-hero">
          <div className="card-hero-header">
            <ClubCrest
              logo={userClub.logo}
              name={userClub.name}
              abbr={userClub.abbr}
              color1={userClub.color1}
              color2={userClub.color2}
              size={64}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.66rem', flexWrap: 'wrap' }}>
                <h2 className="club-title" style={{ fontSize: '1.45rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>{userClub.name}</h2>
                <span className="pill pill-blue" style={{ background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.3)', color: 'var(--accent-cyan)', fontWeight: 800 }}>
                  {currentDivision?.name || 'Liga Española'}
                </span>
              </div>
              <p className="president-title" style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                Presidente: <strong style={{ color: 'var(--text-primary)' }}>{presidentName || 'Institucional'}</strong> • {userClub.stadium}
              </p>
              {userClub.isRentingStadium && (
                <span className="pill pill-blue" style={{ marginTop: '8px', display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(59, 130, 246, 0.15)', border: '1px solid rgba(59, 130, 246, 0.3)', color: '#60a5fa', fontWeight: 700, fontSize: '0.78rem' }}>
                  <Building2 size={13} />
                  Terreno Municipal Alquilado (€{userClub.stadiumRentFee.toLocaleString()}/partido de local)
                </span>
              )}
            </div>
          </div>

          <div className="hero-stats-row">
            <div className="hero-stat">
              <span className="stat-num" style={{ color: 'var(--accent-cyan)' }}>{teamOvr}</span>
              <span className="stat-desc">OVR Plantilla</span>
            </div>
            <div className="hero-stat">
              <span className="stat-num" style={{ color: 'var(--text-primary)' }}>{userStanding > 0 ? `${userStanding}º` : '--'}</span>
              <span className="stat-desc">Posición Liga</span>
            </div>
            <div className="hero-stat">
              <span className="stat-num" style={{ color: 'var(--accent-emerald)' }}>{userClub.fanApproval}%</span>
              <span className="stat-desc">Aprobación Fans</span>
            </div>
            <div className="hero-stat">
              <span className="stat-num" style={{ color: 'var(--accent-emerald)' }}>{userClub.dt ? userClub.dt.morale + '%' : '--'}</span>
              <span className="stat-desc">Confianza DT</span>
            </div>
          </div>
        </div>

        {/* NEXT MATCH CARD */}
        <div className="card card-next-match">
          <div className="card-title" style={{ justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)' }}>
              <Calendar size={18} color="var(--accent-cyan)" />
              <span style={{ fontWeight: 800 }}>Próximo Encuentro</span>
            </div>
            {nextMatch && (
              <span className="pill pill-blue" style={{ fontSize: '0.72rem', background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.3)', color: 'var(--accent-cyan)', fontWeight: 800 }}>
                Jornada {nextMatch.week} • {nextMatch.competitionName || 'Liga'}
              </span>
            )}
          </div>

          {nextMatch && homeTeam && awayTeam ? (
            <div>
              <div className="match-fixture-view">
                <div className="match-team home">
                  <ClubCrest logo={homeTeam.logo} name={homeTeam.name} abbr={homeTeam.abbr} color1={homeTeam.color1} size={40} />
                  <span className="team-name" style={{ marginTop: '6px', fontWeight: homeTeam.id === userClub.id ? 800 : 600, color: 'var(--text-primary)' }}>
                    {homeTeam.shortName}
                  </span>
                </div>

                <div className="match-vs-box" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span className="match-vs-tag" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#ffffff', padding: '2px 10px', borderRadius: '4px', fontWeight: 900, fontSize: '0.82rem' }}>
                    VS
                  </span>
                  <span className={`pill ${isHomeUser ? 'pill-green' : 'pill-blue'}`} style={{ fontSize: '0.7rem', marginTop: '6px', fontWeight: 800, background: isHomeUser ? 'rgba(16, 185, 129, 0.18)' : 'rgba(56, 189, 248, 0.18)', color: isHomeUser ? '#10b981' : '#38bdf8', border: '1px solid currentColor' }}>
                    {isHomeUser ? 'Local' : 'Visitante'}
                  </span>
                </div>

                <div className="match-team away">
                  <ClubCrest logo={awayTeam.logo} name={awayTeam.name} abbr={awayTeam.abbr} color1={awayTeam.color1} size={40} />
                  <span className="team-name" style={{ marginTop: '6px', fontWeight: awayTeam.id === userClub.id ? 800 : 600, color: 'var(--text-primary)' }}>
                    {awayTeam.shortName}
                  </span>
                </div>
              </div>

              <div className="match-details-sub" style={{ marginTop: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.82rem' }}>
                <MapPin size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle', color: 'var(--accent-cyan)' }} />
                {homeTeam.stadium}
              </div>
            </div>
          ) : (
            <div className="no-data" style={{ color: 'var(--text-secondary)' }}>Temporada regular completada</div>
          )}
        </div>

        {/* RECENT RESULT */}
        <div className="card card-results">
          <div className="card-title" style={{ color: 'var(--text-primary)', marginBottom: '0.65rem' }}>
            <TrendingUp size={18} color="var(--accent-cyan)" />
            <span style={{ fontWeight: 800 }}>Último Resultado</span>
          </div>

          {lastMatch ? (() => {
            const home = clubs.find(c => c.id === lastMatch.homeTeamId);
            const away = clubs.find(c => c.id === lastMatch.awayTeamId);
            return (
              <div style={{
                background: 'var(--bg-input)',
                border: '1px solid var(--border-color)',
                borderRadius: '10px',
                padding: '0.65rem 0.85rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  {home && <ClubCrest logo={home.logo} name={home.name} abbr={home.abbr} color1={home.color1} size={32} />}
                  <span style={{ fontSize: '0.78rem', fontWeight: home?.id === userClub.id ? 900 : 600, color: 'var(--text-primary)', marginTop: '4px', maxWidth: '85px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {home?.shortName || 'Local'}
                  </span>
                </div>

                <div style={{
                  background: '#fef08a',
                  border: '1.5px solid #18181b',
                  padding: '0.35rem 0.85rem',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: '1.5px 2px 0px #18181b'
                }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#18181b', fontFamily: "'Kalam', cursive" }}>{lastMatch.homeScore}</span>
                  <span style={{ fontSize: '1rem', fontWeight: 700, color: '#18181b' }}>-</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#18181b', fontFamily: "'Kalam', cursive" }}>{lastMatch.awayScore}</span>
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  {away && <ClubCrest logo={away.logo} name={away.name} abbr={away.abbr} color1={away.color1} size={32} />}
                  <span style={{ fontSize: '0.78rem', fontWeight: away?.id === userClub.id ? 900 : 600, color: 'var(--text-primary)', marginTop: '4px', maxWidth: '85px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {away?.shortName || 'Visitante'}
                  </span>
                </div>
              </div>
            );
          })() : (
            <div className="no-data" style={{ color: 'var(--text-secondary)' }}>Temporada lista para iniciar</div>
          )}
        </div>

        {/* SEASONAL FINANCIAL PROJECTION DOODLE */}
        <div className="card card-finances-glance">
          <div className="card-title" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
              <DollarSign size={18} style={{ color: '#15803d' }} />
              <span style={{ fontWeight: 800, color: '#18181b', fontFamily: "'Kalam', cursive" }}>Presupuesto Temporada</span>
            </div>
            {seasonalProjection.healthStatus === 'HEALTHY' && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '0.72rem', flexShrink: 0, background: '#bbf7d0', color: '#15803d', border: '1.5px solid #18181b', borderRadius: '12px', padding: '2px 8px', fontWeight: 800, boxShadow: '1px 1px 0px #18181b', fontFamily: "'Patrick Hand', cursive" }}>
                <CheckCircle2 size={12} /> Sostenible
              </span>
            )}
            {seasonalProjection.healthStatus === 'WARNING' && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '0.72rem', flexShrink: 0, background: '#fef08a', color: '#854d0e', border: '1.5px solid #18181b', borderRadius: '12px', padding: '2px 8px', fontWeight: 800, boxShadow: '1px 1px 0px #18181b', fontFamily: "'Patrick Hand', cursive" }}>
                <AlertTriangle size={12} /> Precaución
              </span>
            )}
            {seasonalProjection.healthStatus === 'CRITICAL' && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '0.72rem', flexShrink: 0, background: '#fecaca', color: '#991b1b', border: '1.5px solid #18181b', borderRadius: '12px', padding: '2px 8px', fontWeight: 800, boxShadow: '1px 1px 0px #18181b', fontFamily: "'Patrick Hand', cursive" }}>
                <ShieldAlert size={12} /> Alerta Déficit
              </span>
            )}
          </div>

          <div className="finance-breakdown-list">
            <div className="finance-row positive" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '4px 0' }}>
              <span style={{ color: '#27272a', fontSize: '0.82rem', fontWeight: 700, fontFamily: "'Patrick Hand', cursive" }}>+ Ingresos Estacionales (Taquilla & Tienda):</span>
              <strong style={{ color: '#15803d', fontSize: '0.92rem', fontWeight: 800, fontFamily: "'Kalam', cursive" }}>{formatCurr(seasonalProjection.totalProjectedIncome)}</strong>
            </div>

            <div className="finance-row negative" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '4px 0' }}>
              <span style={{ color: '#27272a', fontSize: '0.82rem', fontWeight: 700, fontFamily: "'Patrick Hand', cursive" }}>- Gastos Estacionales (Sueldos & Operación):</span>
              <strong style={{ color: '#b91c1c', fontSize: '0.92rem', fontWeight: 800, fontFamily: "'Kalam', cursive" }}>{formatCurr(seasonalProjection.totalProjectedExpense - seasonalProjection.dtAllocatedFunds)}</strong>
            </div>

            <div className="finance-row negative" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '4px 0' }}>
              <span style={{ color: '#27272a', fontSize: '0.82rem', fontWeight: 700, fontFamily: "'Patrick Hand', cursive" }}>- Fondos Reservados DT (Fichajes & Renovación):</span>
              <strong style={{ color: '#b91c1c', fontSize: '0.92rem', fontWeight: 800, fontFamily: "'Kalam', cursive" }}>{formatCurr(seasonalProjection.dtAllocatedFunds)}</strong>
            </div>

            <hr className="divider" style={{ margin: '0.55rem 0', borderColor: '#18181b', borderWidth: '1px' }} />

            <div className="finance-row total" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#18181b', fontWeight: 800, fontSize: '0.9rem', fontFamily: "'Kalam', cursive" }}>Resultado Neto Estacional:</span>
              <strong style={{ color: seasonalProjection.projectedNetBalance >= 0 ? '#15803d' : '#b91c1c', fontSize: '1rem', fontWeight: 900, fontFamily: "'Kalam', cursive" }}>
                {formatCurr(seasonalProjection.projectedNetBalance)}
              </strong>
            </div>
          </div>
        </div>

        {/* MANAGER OVERVIEW */}
        <div className="card card-dt-overview">
          <div className="card-title" style={{ color: 'var(--text-primary)' }}>
            <UserCheck size={18} color="var(--accent-cyan)" />
            <span style={{ fontWeight: 800 }}>Director Técnico (DT)</span>
          </div>

          {userClub.dt ? (
            <div className="dt-info-box" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <DTPhoto photo={userClub.dt.photo} name={userClub.dt.name} size={54} />
              <div className="dt-details">
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>{userClub.dt.name}</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>Estilo: <strong style={{ color: 'var(--text-primary)' }}>{userClub.dt.style}</strong></p>
                <div className="dt-alloc-pills" style={{ marginTop: '8px', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span className="pill pill-green" style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#10b981', fontWeight: 800, fontSize: '0.72rem' }}>
                    Fichajes: {formatCurr(userClub.dtTransferBudget)}
                  </span>
                  <span className="pill pill-blue" style={{ background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.3)', color: '#38bdf8', fontWeight: 800, fontSize: '0.72rem' }}>
                    Renovaciones: {formatCurr(userClub.dtRenewalBudget)}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="no-data" style={{ color: 'var(--text-secondary)' }}>Sin DT contratado actualmente</div>
          )}
        </div>
      </div>
    </section>
  );
};
