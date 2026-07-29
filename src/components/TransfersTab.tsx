import React, { useState, useMemo } from 'react';
import { useGame } from '../context/GameContext';
import { TransferSystem, PlayerWillingness } from '../systems/TransferSystem';
import { Player, Position, TransferProposal } from '../types';
import {
  ArrowLeftRight, Search, CheckCircle, XCircle, ShoppingBag, FileText,
  AlertTriangle, Filter, Sparkles, Tag, RefreshCw, Send, Check, X,
  UserCheck, DollarSign, Award, SlidersHorizontal
} from 'lucide-react';

export const TransfersTab: React.FC = () => {
  const {
    userClub, players, proposals, approveProposal, rejectProposal,
    renegotiateProposal, submitCustomOffer, listPlayerForSale,
    removeFromTransferList, respondToIncomingOffer, isTransferWindowOpen,
    clubs, divisions
  } = useGame();

  if (!userClub) return null;

  // Navigation Sub-Tabs
  const [activeSubTab, setActiveSubTab] = useState<'DT_OFFICE' | 'MARKET' | 'NEGOTIATIONS' | 'TRANSFER_LIST'>('DT_OFFICE');

  // Filters state for Market
  const [searchQuery, setSearchQuery] = useState('');
  const [positionFilter, setPositionFilter] = useState<string>('ALL');
  const [maxPriceFilter, setMaxPriceFilter] = useState<number>(150000000);
  const [onlyAffordable, setOnlyAffordable] = useState<boolean>(false);
  const [onlyFreeAgents, setOnlyFreeAgents] = useState<boolean>(false);
  const [onlySuitableForDiv, setOnlySuitableForDiv] = useState<boolean>(true);

  // Offer Modal State
  const [selectedPlayerForOffer, setSelectedPlayerForOffer] = useState<Player | null>(null);
  const [offerFee, setOfferFee] = useState<number>(0);
  const [offerSalary, setOfferSalary] = useState<number>(0);
  const [offerYears, setOfferYears] = useState<number>(3);

  // List for Sale Modal State
  const [selectedPlayerForSale, setSelectedPlayerForSale] = useState<Player | null>(null);
  const [askingPriceInput, setAskingPriceInput] = useState<number>(0);

  // Counter offer state
  const [counterProposalId, setCounterProposalId] = useState<string | null>(null);
  const [counterFeeInput, setCounterFeeInput] = useState<number>(0);

  const formatCurr = (val: number) => '€' + (val || 0).toLocaleString('es-ES');

  const currentDiv = divisions.find(d => d.id === userClub.divisionId);
  const divLevel = currentDiv ? currentDiv.level : 3;

  // Squad and Market Players calculation
  const squad = useMemo(() => players.filter(p => p.clubId === userClub.id), [players, userClub.id]);
  const marketPlayers = useMemo(() => players.filter(p => p.clubId !== userClub.id), [players, userClub.id]);
  const transferListedSquad = useMemo(() => squad.filter(p => p.isTransferListed), [squad]);

  // DT Scouting recommendations
  const dtRecommendations = useMemo(() => {
    return TransferSystem.generateDtRecommendations(userClub, squad, marketPlayers, divLevel);
  }, [userClub, squad, marketPlayers, divLevel]);

  // Squad position needs
  const squadNeeds = useMemo(() => {
    return TransferSystem.analyzeSquadNeeds(squad);
  }, [squad]);

  // Filtered market players
  const filteredMarketPlayers = useMemo(() => {
    return marketPlayers.filter(p => {
      // Search
      if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      // Position
      if (positionFilter !== 'ALL' && p.position !== positionFilter) return false;
      // Free agent filter
      if (onlyFreeAgents && p.clubId !== '') return false;
      // Max price
      const price = p.clubId === '' ? 0 : p.value;
      if (price > maxPriceFilter) return false;
      // Affordable filter
      if (onlyAffordable) {
        const availableBudget = (userClub.dtTransferBudget > 0 ? userClub.dtTransferBudget : userClub.budget);
        if (price > availableBudget) return false;
      }
      // Division suitability filter
      if (onlySuitableForDiv) {
        const willingness = TransferSystem.calculateWillingness(p, divLevel);
        if (willingness.status === 'REFUSE') return false;
      }

      return true;
    });
  }, [marketPlayers, searchQuery, positionFilter, maxPriceFilter, onlyAffordable, onlyFreeAgents, onlySuitableForDiv, divLevel, userClub]);

  // Handle open offer modal
  const handleOpenOfferModal = (player: Player) => {
    setSelectedPlayerForOffer(player);
    const willingness = TransferSystem.calculateWillingness(player, divLevel);
    const defaultFee = player.clubId === '' ? 0 : player.value;
    const defaultSalary = Math.round(player.salary * willingness.salaryMultiplier);

    setOfferFee(defaultFee);
    setOfferSalary(defaultSalary);
    setOfferYears(3);
  };

  const handleOpenSaleModal = (player: Player) => {
    setSelectedPlayerForSale(player);
    setAskingPriceInput(player.askingPrice || Math.round(player.value * 1.1));
  };

  const handleSendCustomOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlayerForOffer) return;
    submitCustomOffer(selectedPlayerForOffer, offerFee, offerSalary, offerYears);
    setSelectedPlayerForOffer(null);
  };

  const handleConfirmListForSale = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlayerForSale) return;
    listPlayerForSale(selectedPlayerForSale.id, askingPriceInput);
    setSelectedPlayerForSale(null);
  };

  // Helper badge renderers with premium styling
  const renderWillingnessBadge = (willingness: PlayerWillingness) => {
    switch (willingness.status) {
      case 'HIGH':
        return (
          <span style={{ background: '#dcfce7', border: '1px solid #18181b', color: '#15803d', padding: '3px 9px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px' }} title={willingness.reason}>
            🟢 {willingness.label}
          </span>
        );
      case 'MEDIUM':
        return (
          <span style={{ background: '#fef3c7', border: '1px solid #18181b', color: '#b45309', padding: '3px 9px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px' }} title={willingness.reason}>
            🟡 {willingness.label}
          </span>
        );
      case 'REFUSE':
      default:
        return (
          <span style={{ background: '#fee2e2', border: '1px solid #18181b', color: '#b91c1c', padding: '3px 9px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px' }} title={willingness.reason}>
            🔴 {willingness.label}
          </span>
        );
    }
  };

  const renderPositionBadge = (pos: Position) => {
    let bg = '#dbeafe';
    let color = '#1d4ed8';

    if (pos === 'POR') {
      bg = '#fef3c7';
      color = '#b45309';
    } else if (['DFC', 'LI', 'LD'].includes(pos)) {
      bg = '#dbeafe';
      color = '#1d4ed8';
    } else if (['MCD', 'MC', 'MCO'].includes(pos)) {
      bg = '#dcfce7';
      color = '#15803d';
    } else if (['EI', 'ED', 'DC'].includes(pos)) {
      bg = '#fee2e2';
      color = '#b91c1c';
    }

    return (
      <span style={{ background: bg, border: '1px solid #18181b', color: color, padding: '2px 7px', borderRadius: '5px', fontSize: '0.72rem', fontWeight: 800 }}>
        {pos}
      </span>
    );
  };

  const renderOvrBadge = (ovr: number) => {
    let bg = '#ffffff';
    let color = '#18181b';

    if (ovr >= 85) {
      bg = '#fef08a';
    } else if (ovr >= 75) {
      bg = '#bbf7d0';
    } else if (ovr >= 65) {
      bg = '#bfdbfe';
    }

    return (
      <span style={{ background: bg, color: color, border: '1.5px solid #18181b', padding: '3px 9px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 800, fontFamily: "'Kalam', cursive", boxShadow: '1.5px 1.5px 0px #18181b' }}>
        {ovr}
      </span>
    );
  };

  return (
    <section className="tab-pane active" style={{ paddingBottom: '2rem' }}>
      {/* SECTION HEADER & STATUS BANNER */}
      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.6rem' }}>
            <ArrowLeftRight size={28} className="text-primary" />
            Mercado de Pases y Centro de Fichajes
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '4px' }}>
            Supervisa las oportunidades de mercado, gestiona negociaciones contractuales e interactúa con el ojeo proactivo del DT.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ background: isTransferWindowOpen ? '#bbf7d0' : '#fecaca', border: '1.5px solid #18181b', padding: '8px 16px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '1.5px 2px 0px #18181b' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: isTransferWindowOpen ? '#15803d' : '#b91c1c', border: '1px solid #18181b' }} />
            <div>
              <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', color: '#52525b', fontWeight: 800 }}>Ventana de Fichajes</div>
              <strong style={{ fontSize: '0.85rem', color: '#18181b', fontFamily: "'Patrick Hand', cursive" }}>
                {isTransferWindowOpen ? 'ABIERTA (Operaciones Activas)' : 'CERRADA (Próxima Apertura)'}
              </strong>
            </div>
          </div>

          <div style={{ background: '#bfdbfe', border: '1.5px solid #18181b', padding: '8px 16px', borderRadius: '10px', boxShadow: '1.5px 2px 0px #18181b' }}>
            <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', color: '#52525b', fontWeight: 800 }}>Fondo Delegado al DT</div>
            <strong style={{ fontSize: '0.95rem', color: '#18181b', fontFamily: "'Kalam', cursive" }}>{formatCurr(userClub.dtTransferBudget)}</strong>
          </div>
        </div>
      </div>

      {/* TOP SUB-TAB NAVIGATION DOODLE */}
      <div className="tab-nav" style={{ display: 'flex', gap: '10px', borderBottom: '2px solid #18181b', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '8px' }}>
        <button
          className={`btn ${activeSubTab === 'DT_OFFICE' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveSubTab('DT_OFFICE')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 18px',
            borderRadius: '10px',
            fontWeight: 800,
            fontFamily: "'Patrick Hand', cursive",
            background: activeSubTab === 'DT_OFFICE' ? '#fef08a' : '#ffffff',
            border: '1.5px solid #18181b',
            color: '#18181b',
            boxShadow: activeSubTab === 'DT_OFFICE' ? '2px 2px 0px #18181b' : 'none'
          }}
        >
          <Sparkles size={18} />
          <span>Despacho & Ojear DT</span>
        </button>

        <button
          className={`btn ${activeSubTab === 'MARKET' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveSubTab('MARKET')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 18px',
            borderRadius: '10px',
            fontWeight: 800,
            fontFamily: "'Patrick Hand', cursive",
            background: activeSubTab === 'MARKET' ? '#fef08a' : '#ffffff',
            border: '1.5px solid #18181b',
            color: '#18181b',
            boxShadow: activeSubTab === 'MARKET' ? '2px 2px 0px #18181b' : 'none'
          }}
        >
          <Search size={18} />
          <span>Mercado Global & Ojear</span>
        </button>

        <button
          className={`btn ${activeSubTab === 'NEGOTIATIONS' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveSubTab('NEGOTIATIONS')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 18px',
            borderRadius: '10px',
            fontWeight: 800,
            fontFamily: "'Patrick Hand', cursive",
            background: activeSubTab === 'NEGOTIATIONS' ? '#fef08a' : '#ffffff',
            border: '1.5px solid #18181b',
            color: '#18181b',
            boxShadow: activeSubTab === 'NEGOTIATIONS' ? '2px 2px 0px #18181b' : 'none'
          }}
        >
          <ArrowLeftRight size={18} />
          <span>Negociaciones Activas</span>
          {proposals.length > 0 && (
            <span style={{ background: '#ef4444', color: '#fff', border: '1px solid #18181b', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800 }}>
              {proposals.length}
            </span>
          )}
        </button>

        <button
          className={`btn ${activeSubTab === 'TRANSFER_LIST' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveSubTab('TRANSFER_LIST')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 18px',
            borderRadius: '10px',
            fontWeight: 800,
            fontFamily: "'Patrick Hand', cursive",
            background: activeSubTab === 'TRANSFER_LIST' ? '#fef08a' : '#ffffff',
            border: '1.5px solid #18181b',
            color: '#18181b',
            boxShadow: activeSubTab === 'TRANSFER_LIST' ? '2px 2px 0px #18181b' : 'none'
          }}
        >
          <Tag size={18} />
          <span>Lista de Transferibles ({transferListedSquad.length})</span>
        </button>
      </div>

      {/* SUB-TAB 1: DT OFFICE & RECOMMENDATIONS DOODLE */}
      {activeSubTab === 'DT_OFFICE' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* DT BANNER DOODLE */}
          <div className="card" style={{ background: '#ffffff', border: '2px solid #18181b', padding: '1.25rem 1.5rem', borderRadius: '12px', boxShadow: '2.5px 3px 0px #18181b' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '54px', height: '54px', borderRadius: '50%', background: '#fef08a', border: '2px solid #18181b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: 'bold', color: '#18181b', boxShadow: '2px 2px 0px #18181b' }}>
                  {userClub.dt ? userClub.dt.name.charAt(0) : 'DT'}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.3rem', color: '#18181b', fontFamily: "'Kalam', cursive" }}>
                    {userClub.dt ? `Dirección Técnica: ${userClub.dt.name}` : 'Sin Director Técnico Contratado'}
                  </h3>
                  <p style={{ margin: '4px 0 0 0', color: '#52525b', fontSize: '0.88rem', fontFamily: "'Patrick Hand', cursive" }}>
                    {userClub.dt ? `Estilo Táctico: ${userClub.dt.style} • Reputación: ${userClub.dt.reputation}/100 • Moral DT: ${userClub.dt.morale}%` : 'Contrata un DT para habilitar el ojeo proactivo de plantilla.'}
                  </p>
                </div>
              </div>

              {userClub.dt && (
                <div style={{ background: '#bfdbfe', border: '1.5px solid #18181b', padding: '8px 16px', borderRadius: '10px', textAlign: 'right', boxShadow: '1.5px 2px 0px #18181b' }}>
                  <div style={{ fontSize: '0.72rem', color: '#52525b', textTransform: 'uppercase', fontWeight: 800 }}>Fondo Delegado Fichajes</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#18181b', fontFamily: "'Kalam', cursive" }}>{formatCurr(userClub.dtTransferBudget)}</div>
                </div>
              )}
            </div>
          </div>

          {/* SQUAD NEEDS ANALYSIS DOODLE */}
          <div className="card" style={{ padding: '1.25rem 1.5rem', borderRadius: '12px', border: '2px solid #18181b', boxShadow: '2.5px 3px 0px #18181b' }}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px', color: '#18181b', fontFamily: "'Kalam', cursive" }}>
              <AlertTriangle size={20} color="#b45309" />
              Análisis del DT: Prioridades de la Plantilla
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              {squadNeeds.map((need, idx) => (
                <div key={idx} style={{ background: '#ffffff', border: '1.5px solid #18181b', borderRadius: '10px', padding: '1rem', boxShadow: '1.5px 2px 0px #18181b' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {renderPositionBadge(need.position)}
                      <span style={{ fontWeight: 800, color: '#18181b', fontFamily: "'Kalam', cursive" }}>{need.position}</span>
                    </div>
                    <span style={{ fontSize: '0.8rem', color: '#52525b', fontWeight: 700 }}>OVR Medio: {need.avgOvr}</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#3f3f46', margin: 0, lineHeight: 1.4, fontFamily: "'Patrick Hand', cursive" }}>{need.reason}</p>
                </div>
              ))}
            </div>
          </div>

          {/* PROACTIVE DT SCOUTING RECOMMENDATIONS */}
          <div className="card" style={{ background: '#ffffff', border: '2px solid #18181b', padding: '1.25rem 1.5rem', borderRadius: '14px', boxShadow: '2.5px 3px 0px #18181b' }}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px', color: '#18181b', fontFamily: "'Kalam', cursive", fontWeight: 800 }}>
              <Sparkles size={20} color="#16a34a" />
              Recomendaciones del DT para {currentDiv?.name || 'tu categoría'}
            </h3>

            {dtRecommendations.length === 0 ? (
              <div className="no-data" style={{ padding: '2.5rem', textAlign: 'center', color: '#52525b', fontFamily: "'Patrick Hand', cursive" }}>
                El DT no ha encontrado objetivos compatibles dentro de tu presupuesto asignado. Incrementa el Fondo Delegado al DT en Finanzas para liberar opciones.
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
                {dtRecommendations.map((rec, idx) => {
                  const target = rec.targetPlayer;
                  const willingness = TransferSystem.calculateWillingness(target, divLevel);
                  const isFree = target.clubId === '';

                  return (
                    <div key={idx} style={{ background: '#ffffff', border: '2px solid #18181b', borderRadius: '12px', padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '2.5px 3px 0px #18181b' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                          <div>
                            <h4 style={{ margin: 0, fontSize: '1.15rem', color: '#18181b', fontWeight: 800, fontFamily: "'Kalam', cursive" }}>{target.name}</h4>
                            <div style={{ fontSize: '0.82rem', color: '#52525b', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
                              {renderPositionBadge(target.position)}
                              <span>{target.age} años</span> • <span>Pot: {target.potential}</span>
                            </div>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                            {renderOvrBadge(target.ovr)}
                            {renderWillingnessBadge(willingness)}
                          </div>
                        </div>

                        <p style={{ fontSize: '0.85rem', color: '#3f3f46', background: '#faf7f2', padding: '10px 12px', borderRadius: '8px', margin: '10px 0 14px 0', border: '1.5px solid #18181b', lineHeight: 1.4, fontFamily: "'Patrick Hand', cursive" }}>
                          "{rec.reason}"
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.85rem', marginBottom: '1.2rem', background: '#fef08a', border: '1.5px solid #18181b', padding: '10px', borderRadius: '8px' }}>
                          <div>
                            <span style={{ color: '#52525b', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>Traspaso Estimado:</span><br />
                            <strong style={{ color: isFree ? '#15803d' : '#18181b', fontSize: '0.95rem', fontFamily: "'Kalam', cursive" }}>{isFree ? 'Agente Libre (€0)' : formatCurr(rec.fee)}</strong>
                          </div>
                          <div>
                            <span style={{ color: '#52525b', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>Ficha Solicitada:</span><br />
                            <strong style={{ fontSize: '0.95rem', color: '#18181b', fontFamily: "'Kalam', cursive" }}>{formatCurr(rec.salary)}/año</strong>
                          </div>
                        </div>
                      </div>

                      <button
                        className="btn btn-primary btn-sm btn-full"
                        onClick={() => handleOpenOfferModal(target)}
                        style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', fontWeight: 800, borderRadius: '8px', background: '#fef08a', color: '#18181b', border: '1.5px solid #18181b', boxShadow: '1.5px 1.5px 0px #18181b' }}
                      >
                        <Send size={15} /> Iniciar Negociación del DT
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: GLOBAL MARKET & SCOUTING */}
      {activeSubTab === 'MARKET' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* FILTERS PANEL */}
          <div className="card" style={{ background: '#ffffff', border: '2px solid #18181b', padding: '1.35rem', borderRadius: '14px', boxShadow: '2.5px 3px 0px #18181b' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem', fontWeight: 800, color: '#18181b', fontSize: '1.1rem', fontFamily: "'Kalam', cursive" }}>
              <SlidersHorizontal size={18} color="#2563eb" />
              Filtros y Búsqueda Avanzada de Jugadores
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
              {/* Search input */}
              <div>
                <label style={{ fontSize: '0.78rem', color: '#52525b', display: 'block', marginBottom: '6px', fontWeight: 800 }}>Buscar por nombre</label>
                <input
                  type="text"
                  placeholder="Ej: Saviola, Mbappé..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="search-input"
                  style={{ width: '100%', border: '1.5px solid #18181b', borderRadius: '8px', padding: '0.4rem 0.75rem', fontWeight: 700, color: '#18181b' }}
                />
              </div>

              {/* Position filter */}
              <div>
                <label style={{ fontSize: '0.78rem', color: '#52525b', display: 'block', marginBottom: '6px', fontWeight: 800 }}>Posición</label>
                <select
                  value={positionFilter}
                  onChange={e => setPositionFilter(e.target.value)}
                  className="search-input"
                  style={{ width: '100%', background: '#ffffff', border: '1.5px solid #18181b', borderRadius: '8px', padding: '0.4rem 0.75rem', fontWeight: 700, color: '#18181b' }}
                >
                  <option value="ALL">Todas las posiciones</option>
                  <option value="POR">Porteros (POR)</option>
                  <option value="DFC">Defensa Central (DFC)</option>
                  <option value="LI">Lateral Izquierdo (LI)</option>
                  <option value="LD">Lateral Derecho (LD)</option>
                  <option value="MCD">Medio Defensivo (MCD)</option>
                  <option value="MC">Mediocentro (MC)</option>
                  <option value="MCO">Mediapunta (MCO)</option>
                  <option value="EI">Extremo Izquierdo (EI)</option>
                  <option value="ED">Extremo Derecho (ED)</option>
                  <option value="DC">Delantero Centro (DC)</option>
                </select>
              </div>

              {/* Max price filter slider */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.78rem', color: '#52525b', fontWeight: 800 }}>Precio Máximo de Traspaso</label>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#2563eb', fontFamily: "'Kalam', cursive" }}>{formatCurr(maxPriceFilter)}</span>
                </div>
                <input
                  type="range"
                  min={50000}
                  max={180000000}
                  step={250000}
                  value={maxPriceFilter}
                  onChange={e => setMaxPriceFilter(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#2563eb', cursor: 'pointer' }}
                />
              </div>
            </div>

            {/* QUICK PRESETS */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '1rem', paddingTop: '0.85rem', borderTop: '1.5px solid #18181b' }}>
              <span style={{ fontSize: '0.78rem', color: '#52525b', alignSelf: 'center', marginRight: '4px', fontWeight: 800 }}>Ajuste Rápido:</span>

              <button
                type="button"
                className={`btn btn-sm ${!onlyFreeAgents && maxPriceFilter >= 150000000 ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => {
                  setOnlyFreeAgents(false);
                  setMaxPriceFilter(180000000);
                  setOnlyAffordable(false);
                }}
                style={{
                  padding: '4px 12px',
                  borderRadius: '6px',
                  border: '1.5px solid #18181b',
                  fontWeight: 800,
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  background: (!onlyFreeAgents && maxPriceFilter >= 150000000) ? '#2563eb' : '#ffffff',
                  color: (!onlyFreeAgents && maxPriceFilter >= 150000000) ? '#ffffff' : '#18181b',
                  boxShadow: (!onlyFreeAgents && maxPriceFilter >= 150000000) ? '1.5px 1.5px 0px #18181b' : 'none'
                }}
              >
                Todos
              </button>

              <button
                type="button"
                className={`btn btn-sm ${onlyFreeAgents ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => {
                  setOnlyFreeAgents(true);
                  setOnlyAffordable(false);
                }}
                style={{
                  padding: '4px 12px',
                  borderRadius: '6px',
                  border: '1.5px solid #18181b',
                  fontWeight: 800,
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  background: onlyFreeAgents ? '#2563eb' : '#ffffff',
                  color: onlyFreeAgents ? '#ffffff' : '#18181b',
                  boxShadow: onlyFreeAgents ? '1.5px 1.5px 0px #18181b' : 'none'
                }}
              >
                ⚽ Libres (€0)
              </button>

              <button
                type="button"
                className="btn btn-sm btn-outline"
                onClick={() => {
                  setOnlyFreeAgents(false);
                  setMaxPriceFilter(500000);
                }}
                style={{
                  padding: '4px 12px',
                  borderRadius: '6px',
                  border: '1.5px solid #18181b',
                  fontWeight: 800,
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  background: '#ffffff',
                  color: '#18181b'
                }}
              >
                💎 Económicos (&lt; €500k)
              </button>

              <button
                type="button"
                className="btn btn-sm btn-outline"
                onClick={() => {
                  setOnlyFreeAgents(false);
                  setMaxPriceFilter(5000000);
                }}
                style={{
                  padding: '4px 12px',
                  borderRadius: '6px',
                  border: '1.5px solid #18181b',
                  fontWeight: 800,
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  background: '#ffffff',
                  color: '#18181b'
                }}
              >
                🚀 Nivel Medio (&lt; €5M)
              </button>
            </div>

            {/* Checkbox filters */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginTop: '0.85rem', fontSize: '0.82rem', color: '#3f3f46', fontWeight: 700 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <input type="checkbox" checked={onlySuitableForDiv} onChange={e => setOnlySuitableForDiv(e.target.checked)} />
                <span>Ocultar Inalcanzables (Filtrar nivel de <strong style={{ color: '#18181b' }}>{currentDiv?.name || 'mi división'}</strong>)</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <input type="checkbox" checked={onlyAffordable} onChange={e => setOnlyAffordable(e.target.checked)} />
                <span>Solo Asequibles para mi Presupuesto</span>
              </label>
            </div>
          </div>

          {/* MARKET TABLE */}
          <div className="card" style={{ background: '#ffffff', border: '2px solid #18181b', borderRadius: '14px', overflow: 'hidden', boxShadow: '2.5px 3px 0px #18181b' }}>
            <div style={{ padding: '0.85rem 1.25rem', borderBottom: '2px solid #18181b', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fef08a' }}>
              <span style={{ fontWeight: 800, fontSize: '0.92rem', color: '#18181b', fontFamily: "'Kalam', cursive" }}>
                Resultados del mercado: <strong style={{ color: '#2563eb' }}>{filteredMarketPlayers.length}</strong> futbolistas disponibles
              </span>
            </div>

            <div className="table-responsive max-h-500">
              <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#faf7f2', borderBottom: '1.5px solid #18181b' }}>
                    <th style={{ color: '#18181b', fontWeight: 800, padding: '0.65rem 0.85rem', textAlign: 'left' }}>Jugador</th>
                    <th style={{ color: '#18181b', fontWeight: 800, padding: '0.65rem 0.85rem', textAlign: 'left' }}>Club Actual</th>
                    <th style={{ color: '#18181b', fontWeight: 800, padding: '0.65rem 0.85rem', textAlign: 'left' }}>Pos</th>
                    <th style={{ color: '#18181b', fontWeight: 800, padding: '0.65rem 0.85rem', textAlign: 'left' }}>Edad</th>
                    <th style={{ color: '#18181b', fontWeight: 800, padding: '0.65rem 0.85rem', textAlign: 'left' }}>OVR</th>
                    <th style={{ color: '#18181b', fontWeight: 800, padding: '0.65rem 0.85rem', textAlign: 'left' }}>Valor</th>
                    <th style={{ color: '#18181b', fontWeight: 800, padding: '0.65rem 0.85rem', textAlign: 'left' }}>Disposición</th>
                    <th style={{ color: '#18181b', fontWeight: 800, padding: '0.65rem 0.85rem', textAlign: 'left' }}>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMarketPlayers.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ textAlign: 'center', padding: '2.5rem', color: '#52525b', fontFamily: "'Patrick Hand', cursive", fontSize: '0.95rem' }}>
                        No se encontraron jugadores que coincidan con los filtros aplicados.
                      </td>
                    </tr>
                  ) : (
                    filteredMarketPlayers.slice(0, 50).map(player => {
                      const club = clubs.find(c => c.id === player.clubId);
                      const willingness = TransferSystem.calculateWillingness(player, divLevel);
                      const isFree = player.clubId === '';

                      return (
                        <tr key={player.id} style={{ borderBottom: '1px solid #e4e4e7' }}>
                          <td style={{ padding: '0.6rem 0.85rem' }}>
                            <strong style={{ color: '#18181b', fontSize: '0.92rem', fontFamily: "'Kalam', cursive", fontWeight: 800 }}>{player.name}</strong>
                            {player.isYouthTalent && <span style={{ marginLeft: '6px', fontSize: '0.7rem', background: '#dbeafe', color: '#1d4ed8', border: '1px solid #18181b', padding: '1px 6px', borderRadius: '4px', fontWeight: 800 }}>Cantera</span>}
                          </td>
                          <td style={{ color: '#18181b', fontWeight: 700, padding: '0.6rem 0.85rem' }}>{isFree ? <span style={{ color: '#15803d', fontWeight: 800 }}>Sin Club (Agente Libre)</span> : (club ? club.shortName : 'Club Rival')}</td>
                          <td style={{ padding: '0.6rem 0.85rem' }}>{renderPositionBadge(player.position)}</td>
                          <td style={{ color: '#18181b', fontWeight: 700, padding: '0.6rem 0.85rem' }}>{player.age}</td>
                          <td style={{ padding: '0.6rem 0.85rem' }}>{renderOvrBadge(player.ovr)}</td>
                          <td style={{ padding: '0.6rem 0.85rem' }}>{isFree ? <strong style={{ color: '#15803d' }}>€0 (Libre)</strong> : <strong style={{ color: '#18181b', fontFamily: "'Kalam', cursive" }}>{formatCurr(player.value)}</strong>}</td>
                          <td style={{ padding: '0.6rem 0.85rem' }}>{renderWillingnessBadge(willingness)}</td>
                          <td style={{ padding: '0.6rem 0.85rem' }}>
                            {willingness.status === 'REFUSE' ? (
                              <button className="btn btn-outline btn-sm" disabled style={{ opacity: 0.6, cursor: 'not-allowed', background: '#f4f4f5', border: '1px solid #18181b', color: '#71717a', padding: '3px 8px', borderRadius: '6px', fontWeight: 700, fontSize: '0.75rem' }}>
                                No Interesado
                              </button>
                            ) : (
                              <button className="btn btn-primary btn-sm" onClick={() => handleOpenOfferModal(player)} style={{ fontWeight: 800, background: '#fef08a', color: '#18181b', border: '1.5px solid #18181b', padding: '3px 10px', borderRadius: '6px', boxShadow: '1.5px 1.5px 0px #18181b' }}>
                                <Send size={13} /> Ofertar
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: ACTIVE NEGOTIATIONS */}
      {activeSubTab === 'NEGOTIATIONS' && (
        <div className="card" style={{ background: '#ffffff', border: '2px solid #18181b', padding: '1.5rem', borderRadius: '14px', boxShadow: '2.5px 3px 0px #18181b' }}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px', color: '#18181b', fontFamily: "'Kalam', cursive", fontWeight: 800 }}>
            <ArrowLeftRight size={20} color="#2563eb" />
            Propuestas y Ofertas en Curso ({proposals.length})
          </h3>

          {proposals.length === 0 ? (
            <div className="no-data" style={{ padding: '3.5rem 1rem', textAlign: 'center', color: '#52525b', fontFamily: "'Patrick Hand', cursive" }}>
              No tienes ofertas ni negociaciones pendientes en este momento. Explora el mercado global o consulta el despacho del DT para iniciar conversaciones.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {proposals.map(prop => {
                const isIncoming = prop.isIncomingOffer;
                const getBadgeLabel = () => {
                  if (isIncoming) return `Oferta Entrante de ${prop.buyerClubName || 'Club Rival'}`;
                  if (prop.type === 'SELL') return 'Venta de Jugador';
                  if (prop.type === 'BUY') return 'Fichaje Propuesto';
                  return 'Renovación';
                };

                const badgeBg = isIncoming ? '#dbeafe' : (prop.type === 'SELL' ? '#dcfce7' : (prop.type === 'BUY' ? '#fef08a' : '#e0e7ff'));
                const badgeColor = isIncoming ? '#1d4ed8' : (prop.type === 'SELL' ? '#15803d' : (prop.type === 'BUY' ? '#b45309' : '#4338ca'));

                return (
                  <div key={prop.id} style={{ background: '#ffffff', border: '2px solid #18181b', borderRadius: '12px', padding: '1.25rem', boxShadow: '2.5px 3px 0px #18181b', color: '#18181b' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                      <div>
                        <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: badgeColor, background: badgeBg, border: '1px solid #18181b', padding: '3px 8px', borderRadius: '5px' }}>
                          {getBadgeLabel()}
                        </span>
                        <h4 style={{ margin: '8px 0 0 0', fontSize: '1.15rem', color: '#18181b', fontFamily: "'Kalam', cursive", fontWeight: 800 }}>
                          {prop.player.name} ({prop.player.position} • {prop.player.ovr} OVR)
                        </h4>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.75rem', color: '#52525b', fontWeight: 800 }}>Monto Traspaso</div>
                        <strong style={{ fontSize: '1.15rem', color: '#18181b', fontFamily: "'Kalam', cursive" }}>{formatCurr(prop.transferFee)}</strong>
                      </div>
                    </div>

                    <p style={{ fontSize: '0.88rem', color: '#3f3f46', margin: '8px 0', fontFamily: "'Patrick Hand', cursive" }}>
                      Ficha Anual Propuesta: <strong style={{ color: '#18181b' }}>{formatCurr(prop.offeredSalary)}/año</strong> {prop.notes && `• ${prop.notes}`}
                    </p>

                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '1rem' }}>
                      {isIncoming ? (
                        <>
                          <button className="btn btn-primary btn-sm" onClick={() => respondToIncomingOffer(prop.id, 'ACCEPT')} style={{ fontWeight: 800, background: '#22c55e', color: '#ffffff', border: '1.5px solid #18181b' }}>
                            <Check size={15} /> Aceptar Oferta (€{formatCurr(prop.transferFee)})
                          </button>
                          <button className="btn btn-outline btn-sm" onClick={() => {
                            setCounterProposalId(prop.id);
                            setCounterFeeInput(Math.round(prop.transferFee * 1.15));
                          }} style={{ fontWeight: 800, background: '#ffffff', color: '#18181b', border: '1.5px solid #18181b' }}>
                            Contraofertar
                          </button>
                          <button className="btn btn-danger btn-sm" onClick={() => respondToIncomingOffer(prop.id, 'REJECT')} style={{ fontWeight: 800, background: '#ef4444', color: '#ffffff', border: '1.5px solid #18181b' }}>
                            <X size={15} /> Rechazar
                          </button>
                        </>
                      ) : (
                        <>
                          <button className="btn btn-primary btn-sm" onClick={() => approveProposal(prop.id)} style={{ fontWeight: 800, background: '#fef08a', color: '#18181b', border: '1.5px solid #18181b' }}>
                            <CheckCircle size={15} /> Aprobar Operación
                          </button>
                          <button className="btn btn-outline btn-sm" onClick={() => renegotiateProposal(prop.id)} style={{ fontWeight: 800, background: '#ffffff', color: '#18181b', border: '1.5px solid #18181b' }}>
                            <RefreshCw size={15} /> Pedir al DT que Renegocie
                          </button>
                          <button className="btn btn-danger btn-sm" onClick={() => rejectProposal(prop.id)} style={{ fontWeight: 800, background: '#ef4444', color: '#ffffff', border: '1.5px solid #18181b' }}>
                            <XCircle size={15} /> Descartar
                          </button>
                        </>
                      )}
                    </div>

                    {/* Counter offer inline form */}
                    {counterProposalId === prop.id && (
                      <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1.5px dashed #18181b', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.85rem', color: '#18181b', fontWeight: 800 }}>Exigir Precio de Venta:</span>
                        <input
                          type="number"
                          value={counterFeeInput}
                          onChange={e => setCounterFeeInput(Number(e.target.value))}
                          className="search-input"
                          style={{ width: '160px', border: '1.5px solid #18181b', borderRadius: '8px', padding: '0.4rem 0.75rem', fontWeight: 700, color: '#18181b' }}
                        />
                        <button className="btn btn-primary btn-sm" onClick={() => {
                          respondToIncomingOffer(prop.id, 'COUNTER', counterFeeInput);
                          setCounterProposalId(null);
                        }} style={{ fontWeight: 800, background: '#2563eb', color: '#ffffff', border: '1.5px solid #18181b' }}>
                          Enviar Contraoferta
                        </button>
                        <button className="btn btn-outline btn-sm" onClick={() => setCounterProposalId(null)} style={{ fontWeight: 800, background: '#ffffff', color: '#18181b', border: '1.5px solid #18181b' }}>
                          Cancelar
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 4: TRANSFER LISTED SQUAD PLAYERS */}
      {activeSubTab === 'TRANSFER_LIST' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* TRANSFER LISTED PLAYERS CARD */}
          <div className="card" style={{ background: '#ffffff', border: '2px solid #18181b', padding: '1.5rem', borderRadius: '14px', boxShadow: '2.5px 3px 0px #18181b' }}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px', color: '#18181b', fontFamily: "'Kalam', cursive", fontWeight: 800 }}>
              <Tag size={20} color="#2563eb" />
              Jugadores en la Lista de Transferibles del Club ({transferListedSquad.length})
            </h3>

            {transferListedSquad.length === 0 ? (
              <div className="no-data" style={{ padding: '2.5rem', textAlign: 'center', color: '#52525b', fontFamily: "'Patrick Hand', cursive" }}>
                No has colocado a ningún jugador en la lista de transferibles. Selecciona un futbolista de tu plantilla más abajo para ponerlo a la venta.
              </div>
            ) : (
              <div className="table-responsive">
                <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#faf7f2', borderBottom: '1.5px solid #18181b' }}>
                      <th style={{ color: '#18181b', fontWeight: 800, padding: '0.65rem 0.85rem', textAlign: 'left' }}>Jugador</th>
                      <th style={{ color: '#18181b', fontWeight: 800, padding: '0.65rem 0.85rem', textAlign: 'left' }}>Pos</th>
                      <th style={{ color: '#18181b', fontWeight: 800, padding: '0.65rem 0.85rem', textAlign: 'left' }}>Edad</th>
                      <th style={{ color: '#18181b', fontWeight: 800, padding: '0.65rem 0.85rem', textAlign: 'left' }}>OVR</th>
                      <th style={{ color: '#18181b', fontWeight: 800, padding: '0.65rem 0.85rem', textAlign: 'left' }}>Valor de Mercado</th>
                      <th style={{ color: '#18181b', fontWeight: 800, padding: '0.65rem 0.85rem', textAlign: 'left' }}>Precio Solicitado</th>
                      <th style={{ color: '#18181b', fontWeight: 800, padding: '0.65rem 0.85rem', textAlign: 'left' }}>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transferListedSquad.map(player => (
                      <tr key={player.id} style={{ borderBottom: '1px solid #e4e4e7' }}>
                        <td style={{ padding: '0.6rem 0.85rem' }}><strong style={{ color: '#18181b', fontFamily: "'Kalam', cursive", fontWeight: 800 }}>{player.name}</strong></td>
                        <td style={{ padding: '0.6rem 0.85rem' }}>{renderPositionBadge(player.position)}</td>
                        <td style={{ color: '#18181b', fontWeight: 700, padding: '0.6rem 0.85rem' }}>{player.age}</td>
                        <td style={{ padding: '0.6rem 0.85rem' }}>{renderOvrBadge(player.ovr)}</td>
                        <td style={{ color: '#18181b', fontWeight: 700, padding: '0.6rem 0.85rem' }}>{formatCurr(player.value)}</td>
                        <td style={{ padding: '0.6rem 0.85rem' }}><strong style={{ color: '#2563eb', fontSize: '0.95rem', fontFamily: "'Kalam', cursive" }}>{formatCurr(player.askingPrice || player.value)}</strong></td>
                        <td style={{ padding: '0.6rem 0.85rem' }}>
                          <button className="btn btn-outline btn-sm" onClick={() => removeFromTransferList(player.id)} style={{ fontWeight: 800, background: '#ffffff', color: '#18181b', border: '1.5px solid #18181b' }}>
                            Retirar de Venta
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* SQUAD PLAYERS LIST TO PUT ON SALE */}
          <div className="card" style={{ background: '#ffffff', border: '2px solid #18181b', padding: '1.5rem', borderRadius: '14px', boxShadow: '2.5px 3px 0px #18181b' }}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', color: '#18181b', fontFamily: "'Kalam', cursive", fontWeight: 800 }}>
              Poner Futbolistas de tu Plantilla a la Venta
            </h3>

            <div className="table-responsive max-h-400">
              <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#faf7f2', borderBottom: '1.5px solid #18181b' }}>
                    <th style={{ color: '#18181b', fontWeight: 800, padding: '0.65rem 0.85rem', textAlign: 'left' }}>Jugador</th>
                    <th style={{ color: '#18181b', fontWeight: 800, padding: '0.65rem 0.85rem', textAlign: 'left' }}>Pos</th>
                    <th style={{ color: '#18181b', fontWeight: 800, padding: '0.65rem 0.85rem', textAlign: 'left' }}>Edad</th>
                    <th style={{ color: '#18181b', fontWeight: 800, padding: '0.65rem 0.85rem', textAlign: 'left' }}>OVR</th>
                    <th style={{ color: '#18181b', fontWeight: 800, padding: '0.65rem 0.85rem', textAlign: 'left' }}>Valor</th>
                    <th style={{ color: '#18181b', fontWeight: 800, padding: '0.65rem 0.85rem', textAlign: 'left' }}>Sueldo</th>
                    <th style={{ color: '#18181b', fontWeight: 800, padding: '0.65rem 0.85rem', textAlign: 'left' }}>Contrato</th>
                    <th style={{ color: '#18181b', fontWeight: 800, padding: '0.65rem 0.85rem', textAlign: 'left' }}>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {squad.filter(p => !p.isTransferListed).map(player => (
                    <tr key={player.id} style={{ borderBottom: '1px solid #e4e4e7' }}>
                      <td style={{ padding: '0.6rem 0.85rem' }}><strong style={{ color: '#18181b', fontFamily: "'Kalam', cursive", fontWeight: 800 }}>{player.name}</strong></td>
                      <td style={{ padding: '0.6rem 0.85rem' }}>{renderPositionBadge(player.position)}</td>
                      <td style={{ color: '#18181b', fontWeight: 700, padding: '0.6rem 0.85rem' }}>{player.age}</td>
                      <td style={{ padding: '0.6rem 0.85rem' }}>{renderOvrBadge(player.ovr)}</td>
                      <td style={{ color: '#18181b', fontWeight: 700, padding: '0.6rem 0.85rem' }}>{formatCurr(player.value)}</td>
                      <td style={{ color: '#18181b', fontWeight: 700, padding: '0.6rem 0.85rem' }}>{formatCurr(player.salary)}/año</td>
                      <td style={{ color: '#18181b', fontWeight: 700, padding: '0.6rem 0.85rem' }}>{player.contractYears} {player.contractYears === 1 ? 'año' : 'años'}</td>
                      <td style={{ padding: '0.6rem 0.85rem' }}>
                        <button className="btn btn-primary btn-sm" onClick={() => handleOpenSaleModal(player)} style={{ fontWeight: 800, background: '#fef08a', color: '#18181b', border: '1.5px solid #18181b', padding: '3px 10px', borderRadius: '6px', boxShadow: '1.5px 1.5px 0px #18181b' }}>
                          Poner a la Venta
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CUSTOM TRANSFER OFFER */}
      {selectedPlayerForOffer && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: '540px', background: '#ffffff', border: '2.5px solid #18181b', borderRadius: '16px', boxShadow: '4px 6px 0px #18181b' }}>
            <div className="modal-header" style={{ borderBottom: '2px solid #18181b', paddingBottom: '0.75rem' }}>
              <h3 style={{ color: '#18181b', fontSize: '1.2rem', fontFamily: "'Kalam', cursive", fontWeight: 800 }}>Negociar Fichaje: {selectedPlayerForOffer.name}</h3>
              <button className="close-btn" onClick={() => setSelectedPlayerForOffer(null)} style={{ color: '#18181b', fontWeight: 800 }}>×</button>
            </div>

            <form onSubmit={handleSendCustomOffer} style={{ padding: '1rem 0 0 0' }}>
              <div style={{ background: '#fef08a', border: '1.5px solid #18181b', padding: '14px', borderRadius: '10px', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {renderPositionBadge(selectedPlayerForOffer.position)}
                    <span style={{ color: '#18181b', fontWeight: 800 }}>{selectedPlayerForOffer.age} años</span>
                  </div>
                  {renderOvrBadge(selectedPlayerForOffer.ovr)}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#18181b', fontWeight: 700 }}>
                  <span>Valor de traspaso: {selectedPlayerForOffer.clubId === '' ? <strong style={{ color: '#15803d' }}>€0 (Libre)</strong> : formatCurr(selectedPlayerForOffer.value)}</span>
                  <span>Ficha actual: {formatCurr(selectedPlayerForOffer.salary)}/año</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                {selectedPlayerForOffer.clubId !== '' && (
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#52525b', display: 'block', marginBottom: '4px', fontWeight: 800 }}>Oferta Traspaso al Club Vendedor (€)</label>
                    <input
                      type="number"
                      value={offerFee}
                      onChange={e => setOfferFee(Number(e.target.value))}
                      className="search-input"
                      style={{ width: '100%', border: '1.5px solid #18181b', borderRadius: '8px', padding: '0.45rem 0.75rem', fontWeight: 700, color: '#18181b' }}
                      required
                    />
                  </div>
                )}

                <div>
                  <label style={{ fontSize: '0.8rem', color: '#52525b', display: 'block', marginBottom: '4px', fontWeight: 800 }}>Ficha Salarial Anual Ofrecida (€/año)</label>
                  <input
                    type="number"
                    value={offerSalary}
                    onChange={e => setOfferSalary(Number(e.target.value))}
                    className="search-input"
                    style={{ width: '100%', border: '1.5px solid #18181b', borderRadius: '8px', padding: '0.45rem 0.75rem', fontWeight: 700, color: '#18181b' }}
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: '#52525b', display: 'block', marginBottom: '4px', fontWeight: 800 }}>Duración del Contrato</label>
                  <select
                    value={offerYears}
                    onChange={e => setOfferYears(Number(e.target.value))}
                    className="search-input"
                    style={{ width: '100%', background: '#ffffff', border: '1.5px solid #18181b', borderRadius: '8px', padding: '0.45rem 0.75rem', fontWeight: 700, color: '#18181b' }}
                  >
                    <option value={1}>1 Año</option>
                    <option value={2}>2 Años</option>
                    <option value={3}>3 Años</option>
                    <option value={4}>4 Años</option>
                    <option value={5}>5 Años</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '1.75rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setSelectedPlayerForOffer(null)} style={{ fontWeight: 800, background: '#ffffff', color: '#18181b', border: '1.5px solid #18181b' }}>Cancelar</button>
                <button type="submit" className="btn btn-primary" style={{ fontWeight: 800, background: '#2563eb', color: '#ffffff', border: '1.5px solid #18181b' }}>Enviar Oferta de Fichaje</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: PUT PLAYER ON SALE */}
      {selectedPlayerForSale && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: '460px', background: '#ffffff', border: '2.5px solid #18181b', borderRadius: '16px', boxShadow: '4px 6px 0px #18181b' }}>
            <div className="modal-header" style={{ borderBottom: '2px solid #18181b', paddingBottom: '0.75rem' }}>
              <h3 style={{ color: '#18181b', fontSize: '1.2rem', fontFamily: "'Kalam', cursive", fontWeight: 800 }}>Poner a la Venta: {selectedPlayerForSale.name}</h3>
              <button className="close-btn" onClick={() => setSelectedPlayerForSale(null)} style={{ color: '#18181b', fontWeight: 800 }}>×</button>
            </div>

            <form onSubmit={handleConfirmListForSale} style={{ padding: '1rem 0 0 0' }}>
              <p style={{ fontSize: '0.9rem', color: '#3f3f46', lineHeight: 1.4, fontFamily: "'Patrick Hand', cursive" }}>
                Define el precio que solicitas por {selectedPlayerForSale.name} ({selectedPlayerForSale.position}, {selectedPlayerForSale.ovr} OVR). Los clubes interesados enviarán ofertas semanales en el mercado.
              </p>

              <div style={{ marginTop: '1.25rem' }}>
                <label style={{ fontSize: '0.8rem', color: '#52525b', display: 'block', marginBottom: '6px', fontWeight: 800 }}>Precio de Salida Solicitado (€)</label>
                <input
                  type="number"
                  value={askingPriceInput}
                  onChange={e => setAskingPriceInput(Number(e.target.value))}
                  className="search-input"
                  style={{ width: '100%', border: '1.5px solid #18181b', borderRadius: '8px', padding: '0.45rem 0.75rem', fontWeight: 700, color: '#18181b' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '1.75rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setSelectedPlayerForSale(null)} style={{ fontWeight: 800, background: '#ffffff', color: '#18181b', border: '1.5px solid #18181b' }}>Cancelar</button>
                <button type="submit" className="btn btn-primary" style={{ fontWeight: 800, background: '#2563eb', color: '#ffffff', border: '1.5px solid #18181b' }}>Confirmar Lista de Venta</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
