import React from 'react';
import { Club, Standing } from '../types';
import { Trophy, Award, Sparkles, X, CheckCircle2 } from 'lucide-react';
import { ClubCrest } from './ClubCrest';

interface TrophyRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  userClub: Club | null;
  standings: Standing[];
}

export const TrophyRoomModal: React.FC<TrophyRoomModalProps> = ({
  isOpen,
  onClose,
  userClub,
  standings
}) => {
  if (!isOpen || !userClub) return null;

  // Derive trophies won from club stats
  const trophies = [
    { title: 'Campeón de 3ª División (Primera RFEF)', count: userClub.divisionId === 'div2' || userClub.divisionId === 'div1' ? 1 : 0, color: '#d97706', bg: '#fef08a' },
    { title: 'Campeón de 2ª División (LaLiga Hypermotion)', count: userClub.divisionId === 'div1' ? 1 : 0, color: '#2563eb', bg: '#dbeafe' },
    { title: 'Campeón de 1ª División (LaLiga EA Sports)', count: 0, color: '#16a34a', bg: '#dcfce7' },
    { title: 'Trofeo Pretemporada Comarcal', count: 1, color: '#c026d3', bg: '#fae8ff' }
  ];

  return (
    <div className="modal-overlay" style={{ padding: '1rem', zIndex: 1100 }}>
      <div
        className="modal-card"
        style={{
          maxWidth: '680px',
          background: '#faf7f2',
          border: '2.5px solid #18181b',
          borderRadius: '16px',
          boxShadow: '4px 5px 0px #18181b',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1.5px solid #18181b', paddingBottom: '0.6rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <ClubCrest name={userClub.name} abbr={userClub.abbr} color1={userClub.color1} color2={userClub.color2} size={36} />
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 900, margin: 0, color: '#18181b' }}>
                Sala de Trofeos Oficial — {userClub.name}
              </h2>
              <span style={{ fontSize: '0.75rem', color: '#52525b', fontWeight: 600 }}>
                Palmarés de títulos y trofeos conseguidos en la historia del club
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: '#ffffff',
              border: '1.5px solid #18181b',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '1.5px 1.5px 0px #18181b'
            }}
          >
            <X size={18} color="#18181b" />
          </button>
        </div>

        {/* Trophy Cabinet Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.85rem' }}>
          {trophies.map((tr, idx) => (
            <div
              key={idx}
              style={{
                background: '#ffffff',
                border: '2px solid #18181b',
                borderRadius: '12px',
                padding: '1rem',
                boxShadow: '2.5px 3px 0px #18181b',
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                opacity: tr.count > 0 ? 1 : 0.55
              }}
            >
              <div style={{ width: '48px', height: '48px', background: tr.bg, border: '1.5px solid #18181b', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '1.5px 1.5px 0px #18181b' }}>
                <Trophy size={26} color={tr.color} />
              </div>

              <div>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#71717a', textTransform: 'uppercase' }}>
                  {tr.count > 0 ? `Ganados: x${tr.count}` : 'Pendiente de Conquistar'}
                </span>
                <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.98rem', fontWeight: 800, margin: '2px 0 0 0', color: '#18181b', lineHeight: 1.2 }}>
                  {tr.title}
                </h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
