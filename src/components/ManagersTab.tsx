import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { AVAILABLE_MANAGERS } from '../data/availableManagers';
import { DTPhoto } from './DTPhoto';
import { 
  UserCheck, Award, Sparkles, Search, 
  Lock, AlertCircle, UserX, Clock, Star
} from 'lucide-react';

export const ManagersTab: React.FC = () => {
  const { userClub, players, hireManager, fireManager, renewManagerContract, currentWeek, isTransferWindowOpen } = useGame();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTierFilter, setSelectedTierFilter] = useState<'ALL' | '1' | '2' | '3'>('ALL');
  const [selectedStyleFilter, setSelectedStyleFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'SALARY_ASC' | 'SALARY_DESC' | 'REP_DESC' | 'NAME_ASC'>('REP_DESC');

  if (!userClub) return null;

  const currentDivLevel = userClub.divisionId === 'div1' ? 1 : (userClub.divisionId === 'div2' ? 2 : 3);
  const userSquad = players.filter(p => p.clubId === userClub.id);

  // Squad Diagnostics
  const avgOvr = userSquad.length > 0 ? Math.round(userSquad.reduce((sum, p) => sum + p.ovr, 0) / userSquad.length) : 0;
  
  const positionCounts: Record<string, number> = {};
  userSquad.forEach(p => {
    positionCounts[p.position] = (positionCounts[p.position] || 0) + 1;
  });

  const missingPositions = ['POR', 'DFC', 'MC', 'DC'].filter(pos => (positionCounts[pos] || 0) < (pos === 'DFC' ? 2 : 1));
  const weakestPos = missingPositions.length > 0 ? missingPositions[0] : 'Delantero Centro';

  // Filter available managers
  const filteredManagers = AVAILABLE_MANAGERS.filter(dt => {
    if (userClub.dt && dt.id === userClub.dt.id) return false;

    const matchesSearch = dt.name.toLowerCase().includes(searchQuery.toLowerCase()) || dt.style.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTier = selectedTierFilter === 'ALL' || dt.tier === parseInt(selectedTierFilter);
    const matchesStyle = selectedStyleFilter === 'ALL' || dt.style.includes(selectedStyleFilter);

    return matchesSearch && matchesTier && matchesStyle;
  }).sort((a, b) => {
    if (sortBy === 'SALARY_ASC') return a.salary - b.salary;
    if (sortBy === 'SALARY_DESC') return b.salary - a.salary;
    if (sortBy === 'REP_DESC') return b.reputation - a.reputation;
    return a.name.localeCompare(b.name);
  });

  const formatCurr = (val: number) => '€' + val.toLocaleString('es-ES');

  const getTierBadge = (tier?: number) => {
    switch (tier) {
      case 1:
        return { label: '1ª División (Élite)', bg: 'rgba(234, 179, 8, 0.18)', color: '#facc15' };
      case 2:
        return { label: '2ª División (Pro)', bg: 'rgba(56, 189, 248, 0.18)', color: '#38bdf8' };
      default:
        return { label: '3ª División (Local)', bg: 'rgba(16, 185, 129, 0.18)', color: '#34d399' };
    }
  };

  return (
    <section className="tab-pane active" style={{ height: 'calc(100vh - 110px)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* HEADER BAR */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1rem',
        background: '#ffffff',
        padding: '0.85rem 1.25rem',
        borderRadius: '12px',
        border: '2px solid #18181b',
        boxShadow: '2.5px 3px 0px #18181b',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
          }}>
            <UserCheck size={20} />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Dirección Técnica & Mercado de Entrenadores
            </h2>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Gestión del cuerpo técnico, diagnóstico de plantilla y contrataciones por categorías
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <span style={{
            padding: '0.4rem 0.85rem',
            borderRadius: '20px',
            fontSize: '0.78rem',
            fontWeight: 800,
            background: isTransferWindowOpen ? 'rgba(16, 185, 129, 0.15)' : 'rgba(100, 116, 139, 0.15)',
            color: isTransferWindowOpen ? '#10b981' : '#94a3b8',
            border: `1px solid ${isTransferWindowOpen ? 'rgba(16, 185, 129, 0.3)' : 'rgba(100, 116, 139, 0.3)'}`,
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}>
            <Clock size={14} />
            <span>Mercado de Fichajes: {isTransferWindowOpen ? 'ABIERTO (Jornada ' + currentWeek + ')' : 'CERRADO'}</span>
          </span>
        </div>
      </div>

      {/* DASHBOARD SPLIT VIEW */}
      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '1.1rem', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        
        {/* LEFT COLUMN: HIRED DT & DIAGNOSTICS (FLEXIBLE WITH HIDDEN SMOOTH SCROLL) */}
        <div className="no-scrollbar" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', overflowY: 'auto', msOverflowStyle: 'none', scrollbarWidth: 'none', paddingRight: '0.15rem' }}>
          {userClub.dt ? (
            <div className="card shadow-sm" style={{ padding: '0.85rem 1rem', border: '1px solid rgba(59, 130, 246, 0.3)', background: 'linear-gradient(135deg, var(--bg-card) 0%, rgba(59, 130, 246, 0.05) 100%)', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                  Director Técnico Oficial
                </span>
                <span style={{
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  padding: '0.15rem 0.45rem',
                  borderRadius: '12px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#10b981'
                }}>
                  En Funciones
                </span>
              </div>

              {/* DT Photo & Info Header using DTPhoto */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <DTPhoto photo={userClub.dt.photo} name={userClub.dt.name} size={48} />

                <div>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                    {userClub.dt.name}
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', margin: '1px 0' }}>
                    {userClub.dt.style}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#facc15', fontSize: '0.75rem', fontWeight: 800 }}>
                    <Star size={12} fill="#facc15" />
                    <span>{userClub.dt.reputation} Reputación</span>
                  </div>
                </div>
              </div>

              {/* Financial & Morale stats */}
              <div style={{
                background: 'var(--bg-input)',
                borderRadius: '8px',
                padding: '0.5rem 0.65rem',
                marginBottom: '0.65rem',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.4rem',
                fontSize: '0.75rem'
              }}>
                <div>
                  <span style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Sueldo Anual</span>
                  <strong style={{ fontSize: '0.88rem', color: '#10b981' }}>{formatCurr(userClub.dt.salary)}</strong>
                </div>
                <div>
                  <span style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Moral del DT</span>
                  <strong style={{ fontSize: '0.88rem', color: userClub.dt.morale >= 75 ? '#10b981' : '#f59e0b' }}>
                    {userClub.dt.morale}% ({userClub.dt.morale >= 75 ? 'Alta' : 'Normal'})
                  </strong>
                </div>
              </div>

              {/* Action Buttons: Renovar & Destituir */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <button
                  onClick={renewManagerContract}
                  className="btn"
                  style={{
                    background: 'rgba(16, 185, 129, 0.12)',
                    color: '#10b981',
                    border: '1px solid rgba(16, 185, 129, 0.35)',
                    fontWeight: 700,
                    fontSize: '0.74rem',
                    padding: '0.45rem',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.3rem'
                  }}
                  title="Renovar contrato por 1 temporada adicional"
                >
                  <UserCheck size={14} />
                  Renovar DT
                </button>

                <button
                  onClick={fireManager}
                  className="btn"
                  style={{
                    background: 'rgba(244, 63, 94, 0.1)',
                    color: '#f43f5e',
                    border: '1px solid rgba(244, 63, 94, 0.3)',
                    fontWeight: 700,
                    fontSize: '0.74rem',
                    padding: '0.45rem',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.3rem'
                  }}
                  title={`Indemnización por rescisión: €${Math.round(userClub.dt.salary / 2).toLocaleString('es-ES')}`}
                >
                  <UserX size={14} />
                  Destituir
                </button>
              </div>
            </div>
          ) : (
            <div className="card shadow-sm text-center" style={{ padding: '1.25rem 0.85rem', border: '1px dashed rgba(244, 63, 94, 0.4)', flexShrink: 0 }}>
              <AlertCircle size={28} style={{ color: '#f43f5e', margin: '0 auto 0.4rem auto' }} />
              <h4 style={{ margin: '0 0 0.2rem 0', fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Sin Director Técnico Contratado
              </h4>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.3' }}>
                Tu equipo está acéfalo. Contrata a un DT del mercado disponible para dirigir al grupo.
              </p>
            </div>
          )}

          {/* ACTIVE DT SQUAD DIAGNOSTICS CARD */}
          <div className="card shadow-sm" style={{ padding: '0.85rem 1rem', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flexShrink: 0 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.65rem' }}>
                <Sparkles size={16} style={{ color: '#3b82f6' }} />
                <h4 style={{ margin: 0, fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Diagnóstico Táctico del DT
                </h4>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', background: 'var(--bg-input)', padding: '0.45rem 0.65rem', borderRadius: '6px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Media OVR Plantilla:</span>
                  <strong style={{ color: 'var(--text-primary)' }}>{avgOvr} OVR</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', background: 'var(--bg-input)', padding: '0.45rem 0.65rem', borderRadius: '6px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Posición Débil a Reforzar:</span>
                  <strong style={{ color: '#f59e0b' }}>{weakestPos}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', background: 'var(--bg-input)', padding: '0.45rem 0.65rem', borderRadius: '6px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Fondo Fichajes DT:</span>
                  <strong style={{ color: '#10b981' }}>{formatCurr(userClub.dtTransferBudget || 0)}</strong>
                </div>
              </div>
            </div>

            <p style={{ margin: '0.65rem 0 0 0', fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: '1.3' }}>
              {isTransferWindowOpen ? (
                <span style={{ color: '#10b981', fontWeight: 700 }}>
                  ✓ El mercado está abierto. El DT enviará propuestas de compra y venta a tu buzón.
                </span>
              ) : (
                <span>
                  ⌛ Mercado cerrado. El DT prepara objetivos para el próximo período de transferencias.
                </span>
              )}
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: MANAGERS MARKETPLACE */}
        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Controls Bar */}
          <div className="card shadow-sm" style={{ padding: '0.75rem 1rem', marginBottom: '0.85rem', flexShrink: 0 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ position: 'relative', flex: '1 1 180px' }}>
                <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <input
                  type="text"
                  placeholder="Buscar DT por nombre o estilo..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.4rem 0.4rem 0.4rem 2.1rem',
                    borderRadius: '6px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-input)',
                    color: 'var(--text-primary)',
                    fontSize: '0.8rem'
                  }}
                />
              </div>

              {/* Division Tier Filter Buttons */}
              <div style={{ display: 'flex', gap: '0.3rem' }}>
                {(['ALL', '3', '2', '1'] as const).map(t => {
                  const labelMap = { ALL: 'Todos', '3': '3ª Div', '2': '2ª Div', '1': '1ª Div' };
                  return (
                    <button
                      key={t}
                      onClick={() => setSelectedTierFilter(t)}
                      style={{
                        padding: '0.3rem 0.6rem',
                        borderRadius: '14px',
                        border: '1px solid var(--border-color)',
                        background: selectedTierFilter === t ? 'var(--text-primary)' : 'var(--bg-card)',
                        color: selectedTierFilter === t ? 'var(--bg-card)' : 'var(--text-secondary)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      {labelMap[t]}
                    </button>
                  );
                })}
              </div>

              {/* Sort selector */}
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                style={{
                  padding: '0.35rem 0.6rem',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-input)',
                  color: 'var(--text-primary)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <option value="REP_DESC">Reputación (Mayor a Menor)</option>
                <option value="SALARY_ASC">Sueldo (Menor a Mayor)</option>
                <option value="SALARY_DESC">Sueldo (Mayor a Menor)</option>
                <option value="NAME_ASC">Nombre (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Scrollable Managers Grid Container (Hidden Scrollbar) */}
          <div className="no-scrollbar" style={{ flex: 1, overflowY: 'auto', paddingRight: '0.25rem', msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '0.85rem' }}>
              {filteredManagers.map(dt => {
                const tierBadge = getTierBadge(dt.tier);
                const isTierLocked = dt.tier && dt.tier < currentDivLevel;

                return (
                  <div key={dt.id} className="card shadow-sm" style={{
                    padding: '0.95rem',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    opacity: isTierLocked ? 0.75 : 1
                  }}>
                    <div>
                      {/* Top Header Badge & Rep */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                        <span style={{
                          padding: '0.2rem 0.5rem',
                          borderRadius: '12px',
                          fontSize: '0.68rem',
                          fontWeight: 800,
                          color: tierBadge.color,
                          background: tierBadge.bg
                        }}>
                          {tierBadge.label}
                        </span>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#facc15', fontSize: '0.78rem', fontWeight: 800 }}>
                          <Star size={13} fill="#facc15" />
                          <span>{dt.reputation} Rep.</span>
                        </div>
                      </div>

                      {/* Photo Avatar & Manager Name */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                        <DTPhoto photo={dt.photo} name={dt.name} size={46} />

                        <div style={{ minWidth: 0, flex: 1 }}>
                          <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {dt.name}
                          </h4>
                          <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {dt.style}
                          </span>
                        </div>
                      </div>

                      {/* Salary Box */}
                      <div style={{ background: 'var(--bg-input)', padding: '0.5rem 0.7rem', borderRadius: '6px', marginBottom: '0.75rem' }}>
                        <span style={{ display: 'block', fontSize: '0.66rem', color: 'var(--text-secondary)' }}>Sueldo Pretendido</span>
                        <strong style={{ fontSize: '0.9rem', color: '#10b981' }}>{formatCurr(dt.salary)} / año</strong>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div>
                      {isTierLocked ? (
                        <div style={{
                          fontSize: '0.72rem',
                          color: '#ef4444',
                          background: 'rgba(239, 68, 68, 0.1)',
                          border: '1px solid rgba(239, 68, 68, 0.25)',
                          padding: '0.45rem',
                          borderRadius: '6px',
                          textAlign: 'center',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.3rem'
                        }}>
                          <Lock size={13} />
                          <span>Exige dirigir en {dt.tier}ª División</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => hireManager(dt)}
                          className="btn btn-primary"
                          style={{
                            width: '100%',
                            padding: '0.45rem',
                            fontWeight: 700,
                            fontSize: '0.8rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.35rem'
                          }}
                        >
                          <UserCheck size={14} />
                          Contratar Entrenador
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
