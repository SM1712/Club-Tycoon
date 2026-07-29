import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Player } from '../types';
import { 
  Users, 
  Search, 
  Sparkles, 
  DollarSign, 
  Award, 
  Clock, 
  AlertTriangle, 
  Grid, 
  List, 
  RefreshCw, 
  UserMinus, 
  X, 
  ShieldAlert, 
  ShieldCheck, 
  Zap,
  TrendingUp
} from 'lucide-react';

export const SquadTab: React.FC = () => {
  const { userClub, players, renewPlayerContract, releasePlayer } = useGame();

  if (!userClub) return null;

  const [search, setSearch] = useState('');
  const [posFilter, setPosFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [renewalYears, setRenewalYears] = useState<number>(3);

  const squad = players.filter(p => p.clubId === userClub.id);

  // Filter logic
  const filteredSquad = squad.filter(player => {
    const matchName = player.name.toLowerCase().includes(search.toLowerCase());

    // Position filter
    let matchPos = true;
    if (posFilter === 'POR') matchPos = player.position === 'POR';
    else if (posFilter === 'DEF') matchPos = ['DFC', 'LI', 'LD'].includes(player.position);
    else if (posFilter === 'MED') matchPos = ['MCD', 'MC', 'MCO', 'MI', 'MD'].includes(player.position);
    else if (posFilter === 'DEL') matchPos = ['EI', 'ED', 'DC'].includes(player.position);

    // Status filter
    let matchStatus = true;
    if (statusFilter === 'YOUTH') matchStatus = !!player.isYouthTalent;
    else if (statusFilter === 'EXPIRING') matchStatus = player.contractYears <= 1;
    else if (statusFilter === 'RETIREMENT') matchStatus = player.age >= 38;

    return matchName && matchPos && matchStatus;
  });

  // Squad metrics
  const totalSquadValue = squad.reduce((sum, p) => sum + p.value, 0);
  const totalWageBill = squad.reduce((sum, p) => sum + p.salary, 0);
  const avgOvr = squad.length > 0 ? (squad.reduce((sum, p) => sum + p.ovr, 0) / squad.length).toFixed(1) : '0';
  const avgAge = squad.length > 0 ? (squad.reduce((sum, p) => sum + p.age, 0) / squad.length).toFixed(1) : '0';
  const expiringContractsCount = squad.filter(p => p.contractYears <= 1).length;
  const retiringSoonCount = squad.filter(p => p.age >= 38).length;

  const getPosBadgeClass = (pos: string) => {
    if (pos === 'POR') return 'squad-badge-pos por';
    if (['DFC', 'LI', 'LD'].includes(pos)) return 'squad-badge-pos def';
    if (['MCD', 'MC', 'MCO', 'MI', 'MD'].includes(pos)) return 'squad-badge-pos med';
    return 'squad-badge-pos del';
  };

  const getOvrTierClass = (ovr: number) => {
    if (ovr >= 85) return 'ovr-tier-master';
    if (ovr >= 80) return 'ovr-tier-gold';
    if (ovr >= 75) return 'ovr-tier-purple';
    if (ovr >= 70) return 'ovr-tier-emerald';
    if (ovr >= 60) return 'ovr-tier-blue';
    return 'ovr-tier-slate';
  };

  const getContractBadge = (years: number) => {
    if (years <= 1) {
      return (
        <span className="contract-pill contract-critical">
          <AlertTriangle size={11} /> 1 año ⚠️
        </span>
      );
    }
    if (years === 2) {
      return <span className="contract-pill contract-warning">{years} años</span>;
    }
    if (years >= 4) {
      return <span className="contract-pill contract-long">{years} años</span>;
    }
    return <span className="contract-pill contract-normal">{years} años</span>;
  };

  const formatCurr = (val: number) => '€' + val.toLocaleString('es-ES');

  const handleRenewContract = () => {
    if (!selectedPlayer) return;
    renewPlayerContract(selectedPlayer.id, renewalYears);
    setSelectedPlayer(null);
  };

  const handleReleasePlayer = () => {
    if (!selectedPlayer) return;
    if (window.confirm(`¿Estás seguro de rescindir el contrato de ${selectedPlayer.name}?`)) {
      releasePlayer(selectedPlayer.id);
      setSelectedPlayer(null);
    }
  };

  return (
    <section className="tab-pane active squad-tab-root">
      {/* Header Banner */}
      <div className="squad-header-card">
        <div className="squad-header-content">
          <div className="squad-title-area">
            <div className="squad-icon-badge">
              <Users size={24} />
            </div>
            <div>
              <h2>Plantilla</h2>
              <p>Supervisa el rendimiento, contratos (1 a 5 años), masa salarial y retiros institucionales (máximo 45 años).</p>
            </div>
          </div>
          <div className="squad-count-chip">
            <span>{squad.length} Futbolistas</span>
          </div>
        </div>

        {/* 4 KPI Summary Cards */}
        <div className="squad-kpi-grid">
          <div className="squad-kpi-card">
            <div className="kpi-icon-wrapper wage">
              <DollarSign size={20} />
            </div>
            <div className="kpi-data">
              <span className="kpi-label">Masa Salarial Anual</span>
              <span className="kpi-value highlight-emerald">{formatCurr(totalWageBill)}</span>
              <span className="kpi-subtext">€{(totalWageBill / 52).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")} / semana</span>
            </div>
          </div>

          <div className="squad-kpi-card">
            <div className="kpi-icon-wrapper value">
              <TrendingUp size={20} />
            </div>
            <div className="kpi-data">
              <span className="kpi-label">Valor de Mercado Total</span>
              <span className="kpi-value highlight-blue">{formatCurr(totalSquadValue)}</span>
              <span className="kpi-subtext">Promedio: {formatCurr(Math.round(totalSquadValue / (squad.length || 1)))}</span>
            </div>
          </div>

          <div className="squad-kpi-card">
            <div className="kpi-icon-wrapper rating">
              <Award size={20} />
            </div>
            <div className="kpi-data">
              <span className="kpi-label">Media OVR / Edad</span>
              <div className="kpi-dual-values">
                <span className="kpi-value">{avgOvr} OVR</span>
                <span className="kpi-badge-age">{avgAge} yrs</span>
              </div>
              <span className="kpi-subtext">Potencial plantilla óptimo</span>
            </div>
          </div>

          <div className="squad-kpi-card">
            <div className={`kpi-icon-wrapper ${expiringContractsCount > 0 || retiringSoonCount > 0 ? 'alert' : 'stable'}`}>
              <Clock size={20} />
            </div>
            <div className="kpi-data">
              <span className="kpi-label">Contratos y Retiros</span>
              <div className="kpi-dual-values">
                <span className={`kpi-value ${expiringContractsCount > 0 ? 'text-warn' : ''}`}>{expiringContractsCount} por vencer</span>
                {retiringSoonCount > 0 && <span className="kpi-badge-retire">{retiringSoonCount} retiro</span>}
              </div>
              <span className="kpi-subtext">Límite edad: 45 años</span>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar & Filters */}
      <div className="squad-toolbar-card">
        <div className="toolbar-search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Buscar por nombre de futbolista..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="toolbar-input"
          />
          {search && (
            <button className="btn-clear-search" onClick={() => setSearch('')}>
              <X size={14} />
            </button>
          )}
        </div>

        <div className="toolbar-filters-group">
          {/* Position Selector */}
          <select value={posFilter} onChange={e => setPosFilter(e.target.value)} className="toolbar-select">
            <option value="ALL">Todas las posiciones ({squad.length})</option>
            <option value="POR">Porteros ({squad.filter(p => p.position === 'POR').length})</option>
            <option value="DEF">Defensas ({squad.filter(p => ['DFC', 'LI', 'LD'].includes(p.position)).length})</option>
            <option value="MED">Centrocampistas ({squad.filter(p => ['MCD', 'MC', 'MCO', 'MI', 'MD'].includes(p.position)).length})</option>
            <option value="DEL">Delanteros ({squad.filter(p => ['EI', 'ED', 'DC'].includes(p.position)).length})</option>
          </select>

          {/* Status Selector */}
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="toolbar-select">
            <option value="ALL">Todos los estados</option>
            <option value="YOUTH">✨ Canteranos</option>
            <option value="EXPIRING">⚠️ Contrato en riesgo (≤1 año)</option>
            <option value="RETIREMENT">👴 Retiro Próximo (≥38 años)</option>
          </select>

          {/* View Mode Toggle */}
          <div className="view-mode-toggle">
            <button
              className={`btn-toggle-view ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              title="Vista Lista Tabla"
            >
              <List size={16} />
              <span>Tabla</span>
            </button>
            <button
              className={`btn-toggle-view ${viewMode === 'cards' ? 'active' : ''}`}
              onClick={() => setViewMode('cards')}
              title="Vista Cromos Futbolísticos"
            >
              <Grid size={16} />
              <span>Cromos</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area: Table View or Cards View */}
      {filteredSquad.length === 0 ? (
        <div className="squad-empty-state card">
          <Users size={40} />
          <h3>No se encontraron futbolistas</h3>
          <p>Prueba a modificar los filtros de búsqueda o restablecer la selección.</p>
          <button className="btn-reset-filters" onClick={() => { setSearch(''); setPosFilter('ALL'); setStatusFilter('ALL'); }}>
            Restablecer Filtros
          </button>
        </div>
      ) : viewMode === 'table' ? (
        <div className="squad-table-container card">
          <div className="table-responsive">
            <table className="squad-data-table">
              <thead>
                <tr>
                  <th>FUTBOLISTA</th>
                  <th>POS</th>
                  <th>EDAD</th>
                  <th>OVR</th>
                  <th>EXP (XP)</th>
                  <th>VALOR</th>
                  <th>SALARIO/AÑO</th>
                  <th>CONTRATO</th>
                  <th>ESTADO</th>
                  <th style={{ textAlign: 'center' }}>ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {filteredSquad.map(player => (
                  <tr key={player.id} className="squad-row-hover">
                    {/* Player Info */}
                    <td>
                      <div className="player-cell">
                        <div className={`player-avatar-circle ${getOvrTierClass(player.ovr)}`}>
                          <span>{player.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}</span>
                        </div>
                        <div className="player-cell-details">
                          <strong className="player-name-text">{player.name}</strong>
                          {player.isYouthTalent && (
                            <span className="youth-tag-pill">
                              <Sparkles size={10} /> Cantera
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Position */}
                    <td>
                      <span className={getPosBadgeClass(player.position)}>
                        {player.position}
                      </span>
                    </td>

                    {/* Age */}
                    <td>
                      <div className="age-cell-wrapper">
                        <span>{player.age}a</span>
                        {player.age >= 38 ? (
                          <span className="dot-indicator dot-red" title="Retiro próximo"></span>
                        ) : player.age >= 33 ? (
                          <span className="dot-indicator dot-amber" title="Veterano"></span>
                        ) : (
                          <span className="dot-indicator dot-green" title="En desarrollo/plena forma"></span>
                        )}
                      </div>
                    </td>

                    {/* OVR */}
                    <td>
                      <span className={`badge-ovr-pill ${getOvrTierClass(player.ovr)}`}>
                        {player.ovr}
                      </span>
                    </td>

                    {/* XP Progress Bar */}
                    <td>
                      <div className="xp-progress-wrapper">
                        <div className="xp-bar-bg">
                          <div className="xp-bar-fill" style={{ width: `${player.xp || 0}%` }}></div>
                        </div>
                        <span className="xp-text">{player.xp || 0}%</span>
                      </div>
                    </td>

                    {/* Estimated Market Value */}
                    <td className="currency-cell font-medium">
                      {formatCurr(player.value)}
                    </td>

                    {/* Yearly Salary */}
                    <td className="currency-cell text-emerald">
                      {formatCurr(player.salary)}
                    </td>

                    {/* Contract Duration (1 to 5 years) */}
                    <td>
                      {getContractBadge(player.contractYears)}
                    </td>

                    {/* Retirement & Age Status */}
                    <td>
                      {player.age >= 38 ? (
                        <span className="status-badge status-retire">
                          <ShieldAlert size={11} /> Retiro Próximo
                        </span>
                      ) : player.age >= 33 ? (
                        <span className="status-badge status-veteran">
                          <Clock size={11} /> Veterano
                        </span>
                      ) : (
                        <span className="status-badge status-active">
                          <ShieldCheck size={11} /> En Activo
                        </span>
                      )}
                    </td>

                    {/* Management Action Button */}
                    <td style={{ textAlign: 'center' }}>
                      <button
                        className="btn-action-renew"
                        onClick={() => { setSelectedPlayer(player); setRenewalYears(Math.min(5, Math.max(1, player.contractYears + 1))); }}
                      >
                        <RefreshCw size={13} />
                        <span>Gestionar</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Cards View (Ultimate Team Style Trading Cards) */
        <div className="squad-cards-grid">
          {filteredSquad.map(player => (
            <div key={player.id} className={`player-card-fut ${getOvrTierClass(player.ovr)}`}>
              <div className="fut-card-header">
                <span className="fut-ovr">{player.ovr}</span>
                <span className={getPosBadgeClass(player.position)}>{player.position}</span>
              </div>

              <div className="fut-card-avatar">
                <div className="fut-avatar-inner">
                  {player.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
              </div>

              <div className="fut-card-info">
                <h4 className="fut-name">{player.name}</h4>
                {player.isYouthTalent && (
                  <span className="fut-youth-chip"><Sparkles size={10} /> Canterano</span>
                )}
                
                <div className="fut-stats-row">
                  <div className="fut-stat">
                    <span className="fut-stat-label">EDAD</span>
                    <span className="fut-stat-val">{player.age}a</span>
                  </div>
                  <div className="fut-stat">
                    <span className="fut-stat-label">CONTRATO</span>
                    <span className="fut-stat-val">{player.contractYears}a</span>
                  </div>
                  <div className="fut-stat">
                    <span className="fut-stat-label">XP</span>
                    <span className="fut-stat-val">{player.xp || 0}%</span>
                  </div>
                </div>

                <div className="fut-financials">
                  <div>
                    <span className="fut-lbl">VALOR:</span>
                    <strong className="fut-val-val">{formatCurr(player.value)}</strong>
                  </div>
                  <div>
                    <span className="fut-lbl">SALARIO:</span>
                    <strong className="fut-sal-val">{formatCurr(player.salary)}/a</strong>
                  </div>
                </div>
              </div>

              <div className="fut-card-footer">
                <button
                  className="btn-fut-manage"
                  onClick={() => { setSelectedPlayer(player); setRenewalYears(Math.min(5, Math.max(1, player.contractYears + 1))); }}
                >
                  <RefreshCw size={13} />
                  <span>Gestionar Contrato</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Contract Management Modal */}
      {selectedPlayer && (
        <div className="modal-backdrop">
          <div className="squad-modal-card card">
            <div className="modal-header">
              <div className="modal-title-flex">
                <div className={`modal-avatar ${getOvrTierClass(selectedPlayer.ovr)}`}>
                  {selectedPlayer.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3>Ficha del Futbolista</h3>
                  <span className="modal-subname">{selectedPlayer.name} ({selectedPlayer.position} • {selectedPlayer.age} años)</span>
                </div>
              </div>
              <button className="btn-close-modal" onClick={() => setSelectedPlayer(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body-squad">
              {/* Detailed Metrics */}
              <div className="modal-stats-grid">
                <div className="m-stat-box">
                  <span className="m-stat-lbl">VALOR DE MERCADO</span>
                  <span className="m-stat-val highlight-blue">{formatCurr(selectedPlayer.value)}</span>
                </div>
                <div className="m-stat-box">
                  <span className="m-stat-lbl">SALARIO ANUAL</span>
                  <span className="m-stat-val highlight-emerald">{formatCurr(selectedPlayer.salary)}</span>
                </div>
                <div className="m-stat-box">
                  <span className="m-stat-lbl">VALORACIÓN (OVR)</span>
                  <span className="m-stat-val">{selectedPlayer.ovr} / 100</span>
                </div>
                <div className="m-stat-box">
                  <span className="m-stat-lbl">POTENCIAL ESTIMADO</span>
                  <span className="m-stat-val">{selectedPlayer.potential || selectedPlayer.ovr}</span>
                </div>
              </div>

              {/* Renewal Section */}
              <div className="modal-renewal-box">
                <h4><RefreshCw size={16} /> Renovación de Contrato (1 a 5 años)</h4>
                <p>Contrato actual: <strong>{selectedPlayer.contractYears} {selectedPlayer.contractYears === 1 ? 'año restante' : 'años restantes'}</strong>.</p>
                
                <div className="renewal-years-selector">
                  <label>Nueva Duración del Contrato:</label>
                  <div className="years-btn-group">
                    {[1, 2, 3, 4, 5].map(yr => (
                      <button
                        key={yr}
                        type="button"
                        className={`btn-year-opt ${renewalYears === yr ? 'active' : ''}`}
                        onClick={() => setRenewalYears(yr)}
                      >
                        {yr} {yr === 1 ? 'Año' : 'Años'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="modal-actions-footer">
                <button className="btn-release-player" onClick={handleReleasePlayer}>
                  <UserMinus size={16} />
                  <span>Rescindir Contrato</span>
                </button>
                <button className="btn-confirm-renewal" onClick={handleRenewContract}>
                  <Zap size={16} />
                  <span>Firmar Renovación por {renewalYears} {renewalYears === 1 ? 'Año' : 'Años'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
