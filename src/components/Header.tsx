import React from 'react';
import { useGame } from '../context/GameContext';
import { PlayCircle, Wallet, Users, Building2, Mail, Settings, Trophy } from 'lucide-react';

interface HeaderProps {
  onOpenSettingsModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSettingsModal }) => {
  const { userClub, advanceWeek, openMessagesModal, unreadMessagesCount, messages } = useGame();

  const formatCurrency = (val: number) => {
    return '€' + val.toLocaleString('es-ES');
  };

  const totalReserved = userClub ? ((userClub.dtTransferBudget || 0) + (userClub.dtRenewalBudget || 0)) : 0;
  const freeBudget = userClub ? (userClub.budget - totalReserved) : 0;

  return (
    <header className="top-header" style={{
      height: '50px',
      padding: '0 1.5rem',
      background: '#ffffff',
      borderBottom: '2px solid #18181b',
      boxShadow: '0 2px 0px #18181b',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      zIndex: 10,
      fontFamily: "'Patrick Hand', 'Kalam', cursive, sans-serif"
    }}>
      {userClub && (
        <div className="header-metrics" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          
          {/* TESORERÍA / PRESUPUESTO */}
          <div className="metric-card gold" style={{
            background: '#fef08a',
            border: '1.5px solid #18181b',
            borderRadius: '8px',
            padding: '0.3rem 0.7rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '1.5px 2px 0px #18181b'
          }} title={`Tesorería Total: ${formatCurrency(userClub.budget)}${totalReserved > 0 ? ` | Reservado DT: ${formatCurrency(totalReserved)}` : ''} | Liquidez: ${formatCurrency(freeBudget)}`}>
            <div className="metric-icon" style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#ffffff', border: '1.5px solid #18181b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#18181b' }}>
              <Wallet size={14} />
            </div>
            <div className="metric-data" style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="metric-label" style={{ fontSize: '0.64rem', fontWeight: 700, color: '#52525b', textTransform: 'uppercase' }}>
                {totalReserved > 0 ? 'Presupuesto Libre' : 'Presupuesto Club'}
              </span>
              <span className="metric-value" style={{ fontSize: '0.88rem', fontWeight: 800, color: '#18181b', fontFamily: "'Kalam', cursive" }}>
                {formatCurrency(freeBudget)}
              </span>
            </div>
          </div>

          {/* AFICIONADOS */}
          <div className="metric-card cyan" style={{
            background: '#bbf7d0',
            border: '1.5px solid #18181b',
            borderRadius: '8px',
            padding: '0.3rem 0.7rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '1.5px 2px 0px #18181b'
          }}>
            <div className="metric-icon" style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#ffffff', border: '1.5px solid #18181b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#18181b' }}>
              <Users size={14} />
            </div>
            <div className="metric-data" style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="metric-label" style={{ fontSize: '0.64rem', fontWeight: 700, color: '#52525b', textTransform: 'uppercase' }}>Masa Social</span>
              <span className="metric-value" style={{ fontSize: '0.88rem', fontWeight: 800, color: '#18181b', fontFamily: "'Kalam', cursive" }}>
                {userClub.fans.toLocaleString('es-ES')}
              </span>
            </div>
          </div>

          {/* ESTADIO */}
          <div className="metric-card emerald" style={{
            background: '#bfdbfe',
            border: '1.5px solid #18181b',
            borderRadius: '8px',
            padding: '0.3rem 0.7rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '1.5px 2px 0px #18181b'
          }}>
            <div className="metric-icon" style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#ffffff', border: '1.5px solid #18181b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#18181b' }}>
              <Building2 size={14} />
            </div>
            <div className="metric-data" style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="metric-label" style={{ fontSize: '0.64rem', fontWeight: 700, color: '#52525b', textTransform: 'uppercase' }}>Aforo Estadio</span>
              <span className="metric-value" style={{ fontSize: '0.88rem', fontWeight: 800, color: '#18181b', fontFamily: "'Kalam', cursive" }}>
                {userClub.stadiumCapacity.toLocaleString('es-ES')}
              </span>
            </div>
          </div>

          {/* MENSAJES */}
          <button 
            className="metric-card messages-header-btn" 
            onClick={openMessagesModal}
            style={{
              cursor: 'pointer',
              border: '1.5px solid #18181b',
              background: unreadMessagesCount > 0 ? '#fde047' : '#ffffff',
              borderRadius: '8px',
              padding: '0.3rem 0.7rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '1.5px 2px 0px #18181b',
              transition: 'all 0.12s ease'
            }}
            title="Centro de Mensajes"
          >
            <div className="metric-icon" style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: unreadMessagesCount > 0 ? '#ffffff' : '#f4f4f5',
              border: '1.5px solid #18181b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#18181b'
            }}>
              <Mail size={14} />
            </div>
            <div className="metric-data" style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
              <span className="metric-label" style={{ fontSize: '0.64rem', fontWeight: 700, color: '#52525b', textTransform: 'uppercase' }}>Buzón</span>
              <span className="metric-value" style={{
                fontSize: '0.82rem',
                color: '#18181b',
                fontWeight: 800,
                fontFamily: "'Kalam', cursive"
              }}>
                {unreadMessagesCount > 0 ? `${unreadMessagesCount} nuevos` : `${messages.length} msgs`}
              </span>
            </div>
          </button>
        </div>
      )}

      {/* ACCIONES DE CABECERA */}
      <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
        <button 
          className="btn btn-secondary" 
          onClick={useGame().openTrophyRoom}
          title="Ver Sala de Trofeos del Club"
          style={{
            padding: '0.4rem',
            background: '#fef08a',
            border: '1.5px solid #18181b',
            borderRadius: '8px',
            boxShadow: '1.5px 2px 0px #18181b',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Trophy size={17} style={{ color: '#18181b' }} />
        </button>

        {onOpenSettingsModal && (
          <button 
            className="btn btn-secondary" 
            onClick={onOpenSettingsModal}
            title="Configuración General"
            style={{
              padding: '0.4rem',
              background: '#ffffff',
              border: '1.5px solid #18181b',
              borderRadius: '8px',
              boxShadow: '1.5px 2px 0px #18181b',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Settings size={17} style={{ color: '#18181b' }} />
          </button>
        )}

        <button 
          className="btn btn-primary btn-advance" 
          onClick={advanceWeek}
          style={{
            background: '#22c55e',
            color: '#ffffff',
            border: '2px solid #18181b',
            padding: '0.42rem 1.05rem',
            borderRadius: '8px',
            fontSize: '0.9rem',
            fontWeight: 800,
            fontFamily: "'Kalam', cursive",
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            boxShadow: '2.5px 3px 0px #18181b',
            transition: 'all 0.12s ease'
          }}
          onMouseOver={e => e.currentTarget.style.transform = 'translateY(-1px)'}
          onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <span>AVANZAR 1 SEMANA</span>
          <PlayCircle size={17} />
        </button>
      </div>
    </header>
  );
};
