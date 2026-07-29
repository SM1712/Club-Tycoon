import React from 'react';
import { useGame } from '../context/GameContext';
import { ClubCrest } from './ClubCrest';
import { LayoutDashboard, DollarSign, UserCheck, Building2, Users, ArrowLeftRight, Trophy, Settings, PlusCircle, Handshake } from 'lucide-react';

interface SidebarProps {
  onOpenClubModal: () => void;
  onOpenSettingsModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenClubModal, onOpenSettingsModal }) => {
  const { userClub, activeTab, setActiveTab, proposals, divisions } = useGame();

  const pendingProposalsCount = proposals.filter(p => p.status === 'PENDING').length;
  const currentDivision = userClub ? divisions.find(d => d.id === userClub.divisionId) : null;

  return (
    <aside className="sidebar" style={{
      width: '270px',
      height: '100vh',
      maxHeight: '100vh',
      backgroundColor: '#ffffff',
      borderRight: '2px solid #18181b',
      display: 'flex',
      flexDirection: 'column',
      padding: '1rem 0.85rem',
      flexShrink: 0,
      boxShadow: '3px 0px 0px #18181b',
      zIndex: 20,
      overflow: 'hidden',
      fontFamily: "'Patrick Hand', 'Kalam', cursive, sans-serif"
    }}>
      {/* BRAND HEADER DOODLE */}
      <div className="brand" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.2rem 0.4rem 0.85rem 0.4rem',
        borderBottom: '2px solid #18181b',
        marginBottom: '0.85rem',
        flexShrink: 0
      }}>
        <div className="brand-logo" style={{
          width: '38px',
          height: '38px',
          background: '#facc15',
          border: '2px solid #18181b',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '2px 2px 0px #18181b',
          flexShrink: 0,
          overflow: 'hidden'
        }}>
          <img src="/logo.jpg" alt="Club Tycoon Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div className="brand-text" style={{ display: 'flex', flexDirection: 'column' }}>
          <span className="brand-title" style={{ fontFamily: "'Kalam', cursive", fontSize: '1.15rem', fontWeight: 800, color: '#18181b', lineHeight: 1.1 }}>
            PRESIDENTE
          </span>
          <span className="brand-subtitle" style={{ fontSize: '0.66rem', fontWeight: 700, color: '#52525b', letterSpacing: '1px' }}>
            CLUB TYCOON
          </span>
        </div>
      </div>

      {/* SIDEBAR CLUB CARD DOODLE */}
      {userClub && (
        <div 
          className="sidebar-club-card"
          onClick={onOpenClubModal}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            background: '#fef08a',
            border: '2px solid #18181b',
            borderRadius: '10px',
            padding: '0.65rem 0.75rem',
            marginBottom: '0.85rem',
            boxShadow: '2.5px 3px 0px #18181b',
            cursor: 'pointer',
            transition: 'all 0.12s ease',
            flexShrink: 0
          }}
          title="Ver Ficha Completa del Club"
        >
          <div className="club-crest-wrapper">
            <ClubCrest
              logo={userClub.logo}
              name={userClub.name}
              abbr={userClub.abbr}
              color1={userClub.color1}
              color2={userClub.color2}
              size={36}
            />
          </div>
          <div className="club-info" style={{ flex: 1, minWidth: 0 }}>
            <h4 style={{ fontSize: '0.92rem', fontWeight: 800, margin: 0, color: '#18181b', fontFamily: "'Kalam', cursive", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {userClub.name}
            </h4>
            <span className="league-badge" style={{ fontSize: '0.68rem', fontWeight: 700, color: '#15803d', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span className="league-dot" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e' }} />
              {currentDivision?.shortName || 'Liga Española'}
            </span>
          </div>
        </div>
      )}

      {/* MENÚ DE NAVEGACIÓN ESTILO DOODLE */}
      <nav className="nav-menu" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', overflowY: 'auto', flex: 1, paddingRight: '2px' }}>
        
        {/* SECCIÓN PRINCIPAL */}
        <div className="nav-section" style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <span className="nav-section-title" style={{ fontSize: '0.68rem', fontWeight: 800, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.5px', paddingLeft: '0.4rem', marginBottom: '2px' }}>
            PRINCIPAL
          </span>
          
          <button
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              width: '100%',
              padding: '0.45rem 0.75rem',
              borderRadius: '8px',
              border: activeTab === 'dashboard' ? '1.5px solid #18181b' : '1.5px solid transparent',
              background: activeTab === 'dashboard' ? '#fef08a' : 'transparent',
              color: '#18181b',
              fontSize: '0.9rem',
              fontWeight: 700,
              fontFamily: "'Patrick Hand', cursive",
              cursor: 'pointer',
              boxShadow: activeTab === 'dashboard' ? '2px 2px 0px #18181b' : 'none',
              transition: 'all 0.12s ease',
              textAlign: 'left'
            }}
          >
            <LayoutDashboard size={17} className="nav-icon" />
            <span>Panel Principal</span>
          </button>
        </div>

        {/* SECCIÓN GESTIÓN CLUB */}
        <div className="nav-section" style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <span className="nav-section-title" style={{ fontSize: '0.68rem', fontWeight: 800, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.5px', paddingLeft: '0.4rem', marginBottom: '2px' }}>
            GESTIÓN CLUB
          </span>

          <button
            className={`nav-item ${activeTab === 'economy' ? 'active' : ''}`}
            onClick={() => setActiveTab('economy')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              width: '100%',
              padding: '0.45rem 0.75rem',
              borderRadius: '8px',
              border: activeTab === 'economy' ? '1.5px solid #18181b' : '1.5px solid transparent',
              background: activeTab === 'economy' ? '#fef08a' : 'transparent',
              color: '#18181b',
              fontSize: '0.9rem',
              fontWeight: 700,
              fontFamily: "'Patrick Hand', cursive",
              cursor: 'pointer',
              boxShadow: activeTab === 'economy' ? '2px 2px 0px #18181b' : 'none',
              transition: 'all 0.12s ease',
              textAlign: 'left'
            }}
          >
            <DollarSign size={17} className="nav-icon" />
            <span>Presupuesto y Finanzas</span>
          </button>

          <button
            className={`nav-item ${activeTab === 'sponsors' ? 'active' : ''}`}
            onClick={() => setActiveTab('sponsors')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              width: '100%',
              padding: '0.45rem 0.75rem',
              borderRadius: '8px',
              border: activeTab === 'sponsors' ? '1.5px solid #18181b' : '1.5px solid transparent',
              background: activeTab === 'sponsors' ? '#fef08a' : 'transparent',
              color: '#18181b',
              fontSize: '0.9rem',
              fontWeight: 700,
              fontFamily: "'Patrick Hand', cursive",
              cursor: 'pointer',
              boxShadow: activeTab === 'sponsors' ? '2px 2px 0px #18181b' : 'none',
              transition: 'all 0.12s ease',
              textAlign: 'left'
            }}
          >
            <Handshake size={17} className="nav-icon" />
            <span>Sponsors y Patrocinio</span>
          </button>

          <button
            className={`nav-item ${activeTab === 'manager' ? 'active' : ''}`}
            onClick={() => setActiveTab('manager')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              width: '100%',
              padding: '0.45rem 0.75rem',
              borderRadius: '8px',
              border: activeTab === 'manager' ? '1.5px solid #18181b' : '1.5px solid transparent',
              background: activeTab === 'manager' ? '#fef08a' : 'transparent',
              color: '#18181b',
              fontSize: '0.9rem',
              fontWeight: 700,
              fontFamily: "'Patrick Hand', cursive",
              cursor: 'pointer',
              boxShadow: activeTab === 'manager' ? '2px 2px 0px #18181b' : 'none',
              transition: 'all 0.12s ease',
              textAlign: 'left'
            }}
          >
            <UserCheck size={17} className="nav-icon" />
            <span>Director Técnico (DT)</span>
          </button>

          <button
            className={`nav-item ${activeTab === 'stadium' ? 'active' : ''}`}
            onClick={() => setActiveTab('stadium')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              width: '100%',
              padding: '0.45rem 0.75rem',
              borderRadius: '8px',
              border: activeTab === 'stadium' ? '1.5px solid #18181b' : '1.5px solid transparent',
              background: activeTab === 'stadium' ? '#fef08a' : 'transparent',
              color: '#18181b',
              fontSize: '0.9rem',
              fontWeight: 700,
              fontFamily: "'Patrick Hand', cursive",
              cursor: 'pointer',
              boxShadow: activeTab === 'stadium' ? '2px 2px 0px #18181b' : 'none',
              transition: 'all 0.12s ease',
              textAlign: 'left'
            }}
          >
            <Building2 size={17} className="nav-icon" />
            <span>Estadio e Instalaciones</span>
          </button>
        </div>

        {/* SECCIÓN DEPORTIVO */}
        <div className="nav-section" style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <span className="nav-section-title" style={{ fontSize: '0.68rem', fontWeight: 800, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.5px', paddingLeft: '0.4rem', marginBottom: '2px' }}>
            DEPORTIVO
          </span>

          <button
            className={`nav-item ${activeTab === 'squad' ? 'active' : ''}`}
            onClick={() => setActiveTab('squad')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              width: '100%',
              padding: '0.45rem 0.75rem',
              borderRadius: '8px',
              border: activeTab === 'squad' ? '1.5px solid #18181b' : '1.5px solid transparent',
              background: activeTab === 'squad' ? '#fef08a' : 'transparent',
              color: '#18181b',
              fontSize: '0.9rem',
              fontWeight: 700,
              fontFamily: "'Patrick Hand', cursive",
              cursor: 'pointer',
              boxShadow: activeTab === 'squad' ? '2px 2px 0px #18181b' : 'none',
              transition: 'all 0.12s ease',
              textAlign: 'left'
            }}
          >
            <Users size={17} className="nav-icon" />
            <span>Plantilla de Jugadores</span>
          </button>

          <button
            className={`nav-item ${activeTab === 'transfers' ? 'active' : ''}`}
            onClick={() => setActiveTab('transfers')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              padding: '0.45rem 0.75rem',
              borderRadius: '8px',
              border: activeTab === 'transfers' ? '1.5px solid #18181b' : '1.5px solid transparent',
              background: activeTab === 'transfers' ? '#fef08a' : 'transparent',
              color: '#18181b',
              fontSize: '0.9rem',
              fontWeight: 700,
              fontFamily: "'Patrick Hand', cursive",
              cursor: 'pointer',
              boxShadow: activeTab === 'transfers' ? '2px 2px 0px #18181b' : 'none',
              transition: 'all 0.12s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <ArrowLeftRight size={17} className="nav-icon" />
              <span>Mercado Fichajes</span>
            </div>
            {pendingProposalsCount > 0 && (
              <span className="badge-count" style={{
                background: '#ef4444',
                color: '#ffffff',
                border: '1px solid #18181b',
                borderRadius: '10px',
                padding: '1px 6px',
                fontSize: '0.68rem',
                fontWeight: 800
              }}>
                {pendingProposalsCount}
              </span>
            )}
          </button>

          <button
            className={`nav-item ${activeTab === 'league' ? 'active' : ''}`}
            onClick={() => setActiveTab('league')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              width: '100%',
              padding: '0.45rem 0.75rem',
              borderRadius: '8px',
              border: activeTab === 'league' ? '1.5px solid #18181b' : '1.5px solid transparent',
              background: activeTab === 'league' ? '#fef08a' : 'transparent',
              color: '#18181b',
              fontSize: '0.9rem',
              fontWeight: 700,
              fontFamily: "'Patrick Hand', cursive",
              cursor: 'pointer',
              boxShadow: activeTab === 'league' ? '2px 2px 0px #18181b' : 'none',
              transition: 'all 0.12s ease',
              textAlign: 'left'
            }}
          >
            <Trophy size={17} className="nav-icon" />
            <span>Liga y Calendario</span>
          </button>

          <button
            className={`nav-item ${activeTab === 'social' ? 'active' : ''}`}
            onClick={() => setActiveTab('social')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              width: '100%',
              padding: '0.45rem 0.75rem',
              borderRadius: '8px',
              border: activeTab === 'social' ? '1.5px solid #18181b' : '1.5px solid transparent',
              background: activeTab === 'social' ? '#fef08a' : 'transparent',
              color: '#18181b',
              fontSize: '0.9rem',
              fontWeight: 700,
              fontFamily: "'Patrick Hand', cursive",
              cursor: 'pointer',
              boxShadow: activeTab === 'social' ? '2px 2px 0px #18181b' : 'none',
              transition: 'all 0.12s ease',
              textAlign: 'left'
            }}
          >
            <Handshake size={17} className="nav-icon" />
            <span>Redes Sociales & Memes</span>
          </button>
        </div>

      </nav>

      {/* FOOTER BOTÓN CONFIGURACIÓN */}
      <div style={{ paddingTop: '0.65rem', borderTop: '2px solid #18181b', marginTop: 'auto', flexShrink: 0 }}>
        <button
          onClick={onOpenSettingsModal}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            width: '100%',
            padding: '0.45rem 0.75rem',
            borderRadius: '8px',
            border: '1.5px solid #18181b',
            background: '#ffffff',
            color: '#18181b',
            fontSize: '0.88rem',
            fontWeight: 700,
            fontFamily: "'Patrick Hand', cursive",
            cursor: 'pointer',
            boxShadow: '1.5px 2px 0px #18181b',
            transition: 'all 0.12s ease'
          }}
        >
          <Settings size={16} />
          <span>Configuración</span>
        </button>
      </div>
    </aside>
  );
};
