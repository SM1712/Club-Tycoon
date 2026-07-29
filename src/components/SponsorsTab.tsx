import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { getAvailableSponsorsForDivision, getMaxSponsorsForDivision } from '../data/sponsorsData';
import { Sponsor, SponsorPlacement } from '../types';
import { SponsorLogo } from './SponsorLogo';
import { Handshake, Building2, Wallet, Search, Lock, Award, AlertCircle, ArrowRight, ShieldAlert, CheckCircle2, Trophy, Sparkles, Users, Ticket, ShoppingBag, Clock, Sliders, ChevronRight } from 'lucide-react';

export const SponsorsTab: React.FC = () => {
  const { userClub, standings, negotiateSponsor, cancelSponsorContract, openMessagesModal, buildOwnedStadium, messages, updateSociosSettings, activateSociosProgram } = useGame();
  const [activeSubTab, setActiveSubTab] = useState<'active' | 'market' | 'socios'>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlacement, setSelectedPlacement] = useState<SponsorPlacement | 'ALL'>('ALL');

  if (!userClub) return null;

  const currentDivLevel = userClub.divisionId === 'div1' ? 1 : (userClub.divisionId === 'div2' ? 2 : 3);
  const maxSponsors = getMaxSponsorsForDivision(currentDivLevel);
  const activeContracts = userClub.activeSponsors || [];
  const availableSponsors = getAvailableSponsorsForDivision(currentDivLevel);

  const totalWeeklySponsorIncome = activeContracts.reduce((sum, c) => sum + c.sponsor.baseWeeklyPay, 0);

  const userStanding = standings.find(s => s.clubId === userClub.id);
  const currentWins = userStanding ? userStanding.won : 0;
  const currentGoals = userStanding ? userStanding.gf : 0;
  const currentRank = userStanding ? standings.findIndex(s => s.clubId === userClub.id) + 1 : 1;

  // Socios data
  const sociosData = userClub.sociosData || {
    membershipFee: 4,
    ticketDiscountPercent: 50,
    merchDiscountPercent: 15,
    sociosCount: Math.round(userClub.fans * 0.08),
    conversionRate: 0.08
  };

  const [tempFee, setTempFee] = useState(sociosData.membershipFee);
  const [tempTicketDiscount, setTempTicketDiscount] = useState(sociosData.ticketDiscountPercent);
  const [tempMerchDiscount, setTempMerchDiscount] = useState(sociosData.merchDiscountPercent);

  const filteredMarketSponsors = availableSponsors.filter(sponsor => {
    const matchesSearch = sponsor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          sponsor.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (sponsor.parodyOf && sponsor.parodyOf.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesPlacement = selectedPlacement === 'ALL' || sponsor.placement === selectedPlacement;
    return matchesSearch && matchesPlacement;
  });

  const formatCurrency = (val: number) => '€' + val.toLocaleString('es-ES');

  const getPlacementBadge = (placement: SponsorPlacement) => {
    switch (placement) {
      case 'CHEST':
        return { label: 'Pecho (Camiseta)', color: '#2563eb', bg: 'rgba(37, 99, 235, 0.12)' };
      case 'SLEEVE':
        return { label: 'Manga Camiseta', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.12)' };
      case 'STADIUM':
        return { label: 'Estadio / Vallas', color: '#16a34a', bg: 'rgba(22, 163, 74, 0.12)' };
      case 'DIGITAL':
        return { label: 'Redes y Web', color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.12)' };
    }
  };

  const calculateObjectiveProgress = (sponsor: Sponsor) => {
    const obj = sponsor.objective;
    let current = 0;
    let target = obj.targetValue;
    let unit = '';

    if (obj.type === 'WINS') {
      current = currentWins;
      unit = 'victorias';
    } else if (obj.type === 'GOALS') {
      current = currentGoals;
      unit = 'goles';
    } else if (obj.type === 'TOP_RANK') {
      current = currentRank;
      unit = `º puesto (meta Top ${target})`;
      const isMet = currentRank > 0 && currentRank <= target;
      return {
        text: `Posición actual: #${currentRank} (Meta: Top ${target})`,
        percent: isMet ? 100 : Math.max(10, Math.round(((20 - currentRank) / Math.max(1, 20 - target)) * 100)),
        isMet
      };
    } else if (obj.type === 'STADIUM_CAPACITY') {
      current = userClub.stadiumCapacity;
      unit = 'localidades';
    }

    const percent = Math.min(100, Math.round((current / Math.max(1, target)) * 100));
    const isMet = current >= target;

    return {
      text: `${current} / ${target} ${unit}`,
      percent,
      isMet
    };
  };

  const handleApplySociosSettings = () => {
    updateSociosSettings(tempFee, tempTicketDiscount, tempMerchDiscount);
  };

  return (
    <div className="tab-container" style={{ paddingBottom: '3rem' }}>
      {/* Top Banner Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        {/* Active Slots Banner */}
        <div className="card shadow-sm" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'rgba(37, 99, 235, 0.12)',
            color: '#3b82f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Handshake size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Contratos Activos</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {activeContracts.length} / {maxSponsors}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                ({currentDivLevel}ª División)
              </span>
            </div>
          </div>
        </div>

        {/* Weekly Income Banner */}
        <div className="card shadow-sm" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'rgba(22, 163, 74, 0.12)',
            color: '#16a34a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Wallet size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Ingreso Semanal Patrocinios</span>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#16a34a' }}>
              {formatCurrency(totalWeeklySponsorIncome)} <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>/ sem</span>
            </div>
          </div>
        </div>

        {/* Socios Count Banner */}
        <div className="card shadow-sm" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'rgba(234, 179, 8, 0.12)',
            color: '#eab308',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Users size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Masa de Socios del Club</span>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {sociosData.sociosCount.toLocaleString('es-ES')} <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>({Math.round(sociosData.conversionRate * 100)}% de afición)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.5rem',
        borderBottom: '1px solid var(--border-color)',
        paddingBottom: '0.75rem',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveSubTab('active')}
            className={`btn ${activeSubTab === 'active' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: '20px', padding: '0.5rem 1.25rem', fontSize: '0.88rem' }}
          >
            Patrocinadores Activos ({activeContracts.length})
          </button>

          <button
            onClick={() => setActiveSubTab('market')}
            className={`btn ${activeSubTab === 'market' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: '20px', padding: '0.5rem 1.25rem', fontSize: '0.88rem' }}
          >
            Mercado de Sponsors ({availableSponsors.length})
          </button>

          <button
            onClick={() => setActiveSubTab('socios')}
            className={`btn ${activeSubTab === 'socios' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: '20px', padding: '0.5rem 1.25rem', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <Users size={16} />
            <span>Socios y Afición</span>
          </button>
        </div>

        <button
          onClick={openMessagesModal}
          className="btn btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
        >
          <span>Bandeja de Mensajes</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: ACTIVE SPONSORS */}
      {/* ======================================================== */}
      {activeSubTab === 'active' && (
        <div>
          {activeContracts.length === 0 ? (
            <div className="card shadow-sm text-center" style={{ padding: '3.5rem 2rem', maxWidth: '600px', margin: '2rem auto' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(37, 99, 235, 0.1)',
                color: '#3b82f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem auto'
              }}>
                <Handshake size={32} />
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                Sin Patrocinadores Activos
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>
                Tu club no tiene acuerdos comerciales vigentes. Explora el mercado de sponsors e inicia negociaciones para financiar la tesorería.
              </p>
              <button onClick={() => setActiveSubTab('market')} className="btn btn-primary" style={{ margin: '0 auto' }}>
                Explorar Mercado de Sponsors
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.25rem' }}>
              {activeContracts.map(contract => {
                const placementBadge = getPlacementBadge(contract.sponsor.placement);
                const progress = calculateObjectiveProgress(contract.sponsor);

                return (
                  <div key={contract.id} className="card shadow-sm" style={{
                    padding: '1.35rem',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      {/* Sponsor Header */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <SponsorLogo sponsor={contract.sponsor} size={46} />
                          <div>
                            <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                              {contract.sponsor.name}
                            </h4>
                            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                              {contract.sponsor.industry}
                            </span>
                          </div>
                        </div>

                        <span style={{
                          padding: '0.3rem 0.65rem',
                          borderRadius: '20px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          color: placementBadge.color,
                          background: placementBadge.bg
                        }}>
                          {placementBadge.label}
                        </span>
                      </div>

                      {/* Pay & Objective info */}
                      <div style={{
                        background: 'var(--bg-input)',
                        borderRadius: '8px',
                        padding: '0.85rem',
                        marginBottom: '1rem',
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '0.5rem'
                      }}>
                        <div>
                          <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Pago Semanal</span>
                          <strong style={{ fontSize: '1.05rem', color: '#16a34a' }}>
                            {formatCurrency(contract.sponsor.baseWeeklyPay)}
                          </strong>
                        </div>
                        <div>
                          <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Duración Contrato</span>
                          <strong style={{ fontSize: '0.9rem', color: '#ca8a04', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                            <Clock size={14} />
                            {contract.totalSeasons || 1} {(contract.totalSeasons || 1) === 1 ? 'Temporada' : 'Temporadas'}
                          </strong>
                        </div>
                      </div>

                      {/* Objective Progress Box */}
                      <div style={{
                        background: 'rgba(234, 179, 8, 0.06)',
                        border: '1px solid rgba(234, 179, 8, 0.2)',
                        borderRadius: '8px',
                        padding: '0.85rem',
                        marginBottom: '1.25rem'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ca8a04', textTransform: 'uppercase' }}>
                            Objetivo Requerido
                          </span>
                          <span style={{
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            padding: '0.15rem 0.45rem',
                            borderRadius: '4px',
                            color: progress.isMet ? '#16a34a' : '#d97706',
                            background: progress.isMet ? 'rgba(22, 163, 74, 0.15)' : 'rgba(217, 119, 6, 0.15)'
                          }}>
                            {progress.isMet ? '¡Alcanzado!' : 'En Progreso'}
                          </span>
                        </div>

                        <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {contract.sponsor.objective.description}
                        </p>

                        {/* Progress Bar */}
                        <div style={{
                          height: '6px',
                          background: 'rgba(0,0,0,0.1)',
                          borderRadius: '3px',
                          overflow: 'hidden',
                          marginBottom: '0.35rem'
                        }}>
                          <div style={{
                            height: '100%',
                            width: `${progress.percent}%`,
                            background: progress.isMet ? '#16a34a' : '#f59e0b',
                            borderRadius: '3px',
                            transition: 'width 0.3s ease'
                          }} />
                        </div>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                          Progreso actual: {progress.text}
                        </span>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderTop: '1px solid var(--border-color)',
                      paddingTop: '0.85rem'
                    }}>
                      <div style={{ fontSize: '0.75rem' }}>
                        <span style={{ color: '#16a34a', fontWeight: 700 }}>+ {formatCurrency(contract.sponsor.bonusReward)}</span>
                        <span style={{ color: 'var(--text-secondary)', margin: '0 4px' }}>/</span>
                        <span style={{ color: '#dc2626', fontWeight: 700 }}>- {formatCurrency(contract.sponsor.penaltyFine)}</span>
                      </div>

                      <button
                        onClick={() => cancelSponsorContract(contract.id)}
                        className="btn"
                        style={{
                          fontSize: '0.75rem',
                          color: '#dc2626',
                          background: 'rgba(220, 38, 38, 0.08)',
                          border: '1px solid rgba(220, 38, 38, 0.2)',
                          padding: '0.35rem 0.75rem',
                          borderRadius: '6px'
                        }}
                      >
                        Rescindir
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: SPONSORS MARKETPLACE */}
      {/* ======================================================== */}
      {activeSubTab === 'market' && (
        <div>
          {/* Filters & Search Header */}
          <div className="card shadow-sm" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
              {/* Search Bar */}
              <div style={{ position: 'relative', flex: '1 1 260px' }}>
                <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <input
                  type="text"
                  placeholder="Buscar por nombre, sector o parodia..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.6rem 0.6rem 2.4rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-input)',
                    color: 'var(--text-primary)',
                    fontSize: '0.88rem'
                  }}
                />
              </div>

              {/* Placement Filters */}
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {(['ALL', 'CHEST', 'SLEEVE', 'STADIUM', 'DIGITAL'] as const).map(p => {
                  const labelMap = { ALL: 'Todos', CHEST: 'Pecho', SLEEVE: 'Manga', STADIUM: 'Estadio', DIGITAL: 'Digital' };
                  return (
                    <button
                      key={p}
                      onClick={() => setSelectedPlacement(p)}
                      style={{
                        padding: '0.4rem 0.85rem',
                        borderRadius: '16px',
                        border: '1px solid var(--border-color)',
                        background: selectedPlacement === p ? 'var(--text-primary)' : 'var(--bg-card)',
                        color: selectedPlacement === p ? 'var(--bg-card)' : 'var(--text-secondary)',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      {labelMap[p]}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sponsors Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
            {filteredMarketSponsors.map(sponsor => {
              const placementBadge = getPlacementBadge(sponsor.placement);

              const isSigned = activeContracts.some(c => c.sponsorId === sponsor.id);
              const isPendingInInbox = messages.some(m => m.actionData?.sponsorId === sponsor.id);
              const isPlacementTaken = activeContracts.some(c => c.sponsor.placement === sponsor.placement);
              const isStadiumLocked = sponsor.requiresOwnedStadium && userClub.isRentingStadium;
              const isLimitReached = activeContracts.length >= maxSponsors;

              return (
                <div key={sponsor.id} className="card shadow-sm" style={{
                  padding: '1.25rem',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  opacity: (isStadiumLocked || (isPlacementTaken && !isSigned)) ? 0.75 : 1
                }}>
                  <div>
                    {/* Header */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <SponsorLogo sponsor={sponsor} size={44} />
                        <div>
                          <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                            {sponsor.name}
                          </h4>
                          {sponsor.parodyOf && (
                            <span style={{ fontSize: '0.7rem', color: '#eab308', fontWeight: 700, display: 'block' }}>
                              Parodia de {sponsor.parodyOf}
                            </span>
                          )}
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                            {sponsor.industry}
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.2rem' }}>
                        <span style={{
                          padding: '0.2rem 0.5rem',
                          borderRadius: '16px',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          color: placementBadge.color,
                          background: placementBadge.bg
                        }}>
                          {placementBadge.label}
                        </span>
                        <span style={{ fontSize: '0.68rem', color: '#ca8a04', fontWeight: 700 }}>
                          {sponsor.contractSeasons || 1} {(sponsor.contractSeasons || 1) === 1 ? 'Temp' : 'Temps'}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <p style={{
                      fontSize: '0.82rem',
                      color: 'var(--text-secondary)',
                      margin: '0 0 1rem 0',
                      lineHeight: '1.4',
                      height: '38px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {sponsor.description}
                    </p>

                    {/* Financial Terms Teaser */}
                    <div style={{
                      background: 'var(--bg-input)',
                      borderRadius: '8px',
                      padding: '0.75rem',
                      marginBottom: '0.85rem',
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: '0.4rem',
                      textAlign: 'center'
                    }}>
                      <div>
                        <span style={{ display: 'block', fontSize: '0.68rem', color: 'var(--text-secondary)' }}>Pago Semanal</span>
                        <strong style={{ fontSize: '0.9rem', color: '#16a34a' }}>{formatCurrency(sponsor.baseWeeklyPay)}</strong>
                      </div>
                      <div>
                        <span style={{ display: 'block', fontSize: '0.68rem', color: 'var(--text-secondary)' }}>Bonus Max</span>
                        <strong style={{ fontSize: '0.9rem', color: '#2563eb' }}>+{formatCurrency(sponsor.bonusReward)}</strong>
                      </div>
                      <div>
                        <span style={{ display: 'block', fontSize: '0.68rem', color: 'var(--text-secondary)' }}>Ajuste</span>
                        <strong style={{ fontSize: '0.9rem', color: '#dc2626' }}>-{formatCurrency(sponsor.penaltyFine)}</strong>
                      </div>
                    </div>

                    {/* Requirement Teaser */}
                    <div style={{
                      background: 'rgba(234, 179, 8, 0.08)',
                      border: '1px solid rgba(234, 179, 8, 0.25)',
                      borderRadius: '6px',
                      padding: '0.65rem 0.85rem',
                      marginBottom: '1rem',
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <Trophy size={16} style={{ color: '#ca8a04', flexShrink: 0 }} />
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>
                        Requisito confidencial: <strong style={{ color: 'var(--text-primary)' }}>Se revela al abrir propuesta</strong>
                      </span>
                    </div>

                    {/* Stadium Lock Warning Badge */}
                    {isStadiumLocked && (
                      <div style={{
                        fontSize: '0.75rem',
                        color: '#ef4444',
                        background: 'rgba(239, 68, 68, 0.1)',
                        padding: '0.4rem 0.65rem',
                        borderRadius: '6px',
                        marginBottom: '0.85rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem'
                      }}>
                        <Lock size={14} />
                        <span>Requiere Estadio Propio (Construir en Instalaciones)</span>
                      </div>
                    )}
                  </div>

                  {/* Negotiation Action Button */}
                  <div>
                    {isSigned ? (
                      <button disabled className="btn" style={{
                        width: '100%',
                        background: 'rgba(22, 163, 74, 0.15)',
                        color: '#16a34a',
                        fontWeight: 700,
                        border: 'none',
                        cursor: 'default',
                        padding: '0.6rem'
                      }}>
                        ✓ CONTRATO FIRMADO
                      </button>
                    ) : isPendingInInbox ? (
                      <button onClick={openMessagesModal} className="btn" style={{
                        width: '100%',
                        background: 'rgba(234, 179, 8, 0.15)',
                        color: '#ca8a04',
                        fontWeight: 700,
                        border: '1px solid rgba(234, 179, 8, 0.4)',
                        cursor: 'pointer',
                        padding: '0.6rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.4rem'
                      }}>
                        📩 EN NEGOCIACIÓN (Ver Oferta)
                      </button>
                    ) : isStadiumLocked ? (
                      <button onClick={buildOwnedStadium} className="btn btn-secondary" style={{ width: '100%', fontSize: '0.82rem', padding: '0.6rem' }}>
                        Construir Estadio Propio
                      </button>
                    ) : isPlacementTaken ? (
                      <button disabled className="btn" style={{
                        width: '100%',
                        background: 'var(--bg-input)',
                        color: 'var(--text-secondary)',
                        fontSize: '0.8rem',
                        border: '1px solid var(--border-color)',
                        padding: '0.6rem'
                      }}>
                        Ubicación Ocupada
                      </button>
                    ) : isLimitReached ? (
                      <button disabled className="btn" style={{
                        width: '100%',
                        background: 'var(--bg-input)',
                        color: 'var(--text-secondary)',
                        fontSize: '0.8rem',
                        border: '1px solid var(--border-color)',
                        padding: '0.6rem'
                      }}>
                        Límite de Sponsors Alcanzado
                      </button>
                    ) : (
                      <button
                        onClick={() => negotiateSponsor(sponsor.id)}
                        className="btn btn-primary"
                        style={{
                          width: '100%',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.4rem',
                          padding: '0.6rem'
                        }}
                      >
                        <Handshake size={17} />
                        Iniciar Negociación
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: SOCIOS Y AFICIÓN */}
      {/* ======================================================== */}
      {activeSubTab === 'socios' && (
        <div>
          {userClub.fans < 10000 ? (
            <div className="card shadow-sm text-center" style={{ padding: '3.5rem 2rem', maxWidth: '600px', margin: '2rem auto' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(239, 68, 68, 0.1)',
                color: '#ef4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem auto'
              }}>
                <Lock size={32} />
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                Programa de Socios No Disponible
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>
                Tu club necesita construir una masa social sólida de al menos <strong>10.000 aficionados</strong> registrados antes de poder constituir legalmente la asamblea de abonados.
              </p>
              <span style={{ fontSize: '0.85rem', color: '#ef4444', fontWeight: 700 }}>
                Afición actual: {userClub.fans.toLocaleString('es-ES')} / 10.000 aficionados requeridos
              </span>
            </div>
          ) : !sociosData.isProgramActive ? (
            <div className="card shadow-sm text-center" style={{ padding: '3.5rem 2rem', maxWidth: '650px', margin: '2rem auto', background: 'linear-gradient(135deg, var(--bg-card) 0%, rgba(234, 179, 8, 0.05) 100%)', border: '1px solid rgba(234, 179, 8, 0.3)' }}>
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: 'rgba(234, 179, 8, 0.15)',
                color: '#ca8a04',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem auto'
              }}>
                <Users size={36} />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                ¡Tu Club cumple los requisitos para fundar la Masa Social!
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '1.75rem', lineHeight: '1.6' }}>
                Con <strong>{userClub.fans.toLocaleString('es-ES')} aficionados</strong>, tienes la opción voluntaria de inaugurar el <strong>Programa de Socios del Club</strong>. Esto generará cuotas semanales recurrentes, pero requerirá ofrecer ventajas de abonado en taquilla y tienda.
              </p>
              <button
                onClick={activateSociosProgram}
                className="btn btn-primary"
                style={{
                  margin: '0 auto',
                  padding: '0.85rem 2rem',
                  fontSize: '1rem',
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  borderRadius: '12px',
                  boxShadow: '0 4px 14px rgba(234, 179, 8, 0.3)'
                }}
              >
                <Sparkles size={20} />
                Fundar e Inaugurar Programa de Socios
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem' }}>
              {/* Left Column: Socios Configuration Panel */}
              <div className="card shadow-sm" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(234, 179, 8, 0.15)', color: '#ca8a04', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Sliders size={20} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      Gestión del Programa de Socios
                    </h3>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      Ajusta la cuota de membresía y los beneficios exclusivos de tus abonados
                    </span>
                  </div>
                </div>

                {/* Slider: Membership Fee */}
                <div style={{ marginBottom: '1.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <label style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      Cuota de Socio (€/semana)
                    </label>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#16a34a' }}>
                      €{tempFee} / semana <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>(€{tempFee * 38}/año)</span>
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="12"
                    step="1"
                    value={tempFee}
                    onChange={e => setTempFee(parseInt(e.target.value))}
                    style={{ width: '100%', accentColor: '#16a34a', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginTop: '0.25rem' }}>
                    Cuotas muy elevadas pueden reducir la atracción de nuevos socios.
                  </span>
                </div>

                {/* Benefits: Ticket Discount */}
                <div style={{ marginBottom: '1.75rem' }}>
                  <label style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '0.6rem' }}>
                    Beneficio: Descuento en Entradas de Estadio
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                    {[0, 20, 50, 100].map(val => (
                      <button
                        key={val}
                        onClick={() => setTempTicketDiscount(val)}
                        style={{
                          padding: '0.6rem 0.4rem',
                          borderRadius: '8px',
                          border: tempTicketDiscount === val ? '2px solid #2563eb' : '1px solid var(--border-color)',
                          background: tempTicketDiscount === val ? 'rgba(37, 99, 235, 0.12)' : 'var(--bg-input)',
                          color: tempTicketDiscount === val ? '#2563eb' : 'var(--text-primary)',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          cursor: 'pointer'
                        }}
                      >
                        {val === 100 ? '100% Gratis' : `${val}% Dcto`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Benefits: Merch Discount */}
                <div style={{ marginBottom: '2rem' }}>
                  <label style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '0.6rem' }}>
                    Beneficio: Descuento en Camisetas y Merchandising
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                    {[0, 15, 30, 50].map(val => (
                      <button
                        key={val}
                        onClick={() => setTempMerchDiscount(val)}
                        style={{
                          padding: '0.6rem 0.4rem',
                          borderRadius: '8px',
                          border: tempMerchDiscount === val ? '2px solid #8b5cf6' : '1px solid var(--border-color)',
                          background: tempMerchDiscount === val ? 'rgba(139, 92, 246, 0.12)' : 'var(--bg-input)',
                          color: tempMerchDiscount === val ? '#8b5cf6' : 'var(--text-primary)',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          cursor: 'pointer'
                        }}
                      >
                        {val}% Dcto
                      </button>
                    ))}
                  </div>
                </div>

                <button onClick={handleApplySociosSettings} className="btn btn-primary" style={{ width: '100%', padding: '0.75rem', fontWeight: 800 }}>
                  Guardar Configuración de Socios
                </button>
              </div>

              {/* Right Column: Financial Simulation & Cannibalization Math */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="card shadow-sm" style={{ padding: '1.25rem', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    Balance del Programa
                  </h4>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.88rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Masa de Socios Activos:</span>
                      <strong style={{ color: 'var(--text-primary)' }}>{sociosData.sociosCount.toLocaleString('es-ES')} socios</strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Ingreso Semanal Cuotas:</span>
                      <strong style={{ color: '#16a34a' }}>+{formatCurrency(sociosData.sociosCount * tempFee)}</strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Efecto Dcto. Taquilla (Local):</span>
                      <strong style={{ color: '#dc2626' }}>-{formatCurrency(Math.round(sociosData.sociosCount * userClub.ticketPrice * (tempTicketDiscount / 100) * 0.65))}</strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.65rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Efecto Dcto. Camisetas:</span>
                      <strong style={{ color: '#dc2626' }}>-{formatCurrency(Math.round(sociosData.sociosCount * 1.5 * (tempMerchDiscount / 100)))}</strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.25rem' }}>
                      <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>Balance Neto Semanal:</span>
                      <strong style={{
                        fontSize: '1.05rem',
                        color: (sociosData.sociosCount * tempFee - (sociosData.sociosCount * userClub.ticketPrice * (tempTicketDiscount / 100) * 0.35)) >= 0 ? '#16a34a' : '#dc2626'
                      }}>
                        {formatCurrency(Math.round(sociosData.sociosCount * tempFee - (sociosData.sociosCount * userClub.ticketPrice * (tempTicketDiscount / 100) * 0.35)))}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="card shadow-sm" style={{ padding: '1.25rem', background: 'rgba(234, 179, 8, 0.06)', border: '1px solid rgba(234, 179, 8, 0.25)' }}>
                  <h5 style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', fontWeight: 800, color: '#ca8a04', textTransform: 'uppercase' }}>
                    Consejo Presidencial de Afición
                  </h5>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                    Tus socios aportan un flujo de caja garantizado cada semana. Sin embargo, ofrecer entradas 100% gratis reduce los ingresos de taquilla en partidos clave. Ajusta los beneficios con prudencia.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
