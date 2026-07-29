import React from 'react';
import { PresidentEvent, PresidentEventOption } from '../data/presidentEvents';
import { Sparkles, DollarSign, Users, AlertCircle, Award, CheckCircle2 } from 'lucide-react';

interface PresidentEventModalProps {
  isOpen: boolean;
  event: PresidentEvent | null;
  onSelectOption: (option: PresidentEventOption) => void;
}

export const PresidentEventModal: React.FC<PresidentEventModalProps> = ({
  isOpen,
  event,
  onSelectOption
}) => {
  if (!isOpen || !event) return null;

  const getTypeBadge = () => {
    switch (event.type) {
      case 'POSITIVE':
        return { label: 'Oportunidad Única', bg: '#dcfce7', color: '#15803d' };
      case 'NEGATIVE':
        return { label: 'Imprevisto Directivo', bg: '#fee2e2', color: '#b91c1c' };
      case 'RARE':
        return { label: '¡Evento Extraordinario!', bg: '#fef08a', color: '#b45309' };
      default:
        return { label: 'Dilema de Presidencia', bg: '#dbeafe', color: '#1d4ed8' };
    }
  };

  const badge = getTypeBadge();

  return (
    <div className="modal-overlay" style={{ padding: '1rem', zIndex: 1100 }}>
      <div
        className="modal-card"
        style={{
          maxWidth: '540px',
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
          <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', padding: '3px 10px', background: badge.bg, color: badge.color, border: '1px solid #18181b', borderRadius: '12px' }}>
            {badge.label}
          </span>
          <span style={{ fontSize: '0.75rem', color: '#71717a', fontWeight: 700 }}>Despacho Presidencial</span>
        </div>

        {/* Title & Description */}
        <div>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 900, margin: '0 0 0.4rem 0', color: '#18181b' }}>
            {event.title}
          </h3>
          <p style={{ fontFamily: 'var(--font-main)', fontSize: '0.92rem', color: '#3f3f46', lineHeight: 1.4, margin: 0 }}>
            {event.description}
          </p>
        </div>

        {/* Options List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginTop: '0.3rem' }}>
          {event.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => onSelectOption(opt)}
              style={{
                background: '#ffffff',
                border: '2px solid #18181b',
                borderRadius: '10px',
                padding: '0.85rem 1rem',
                textAlign: 'left',
                cursor: 'pointer',
                boxShadow: '2px 2.5px 0px #18181b',
                transition: 'all 0.12s ease',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem'
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#fffbeb'}
              onMouseLeave={e => e.currentTarget.style.background = '#ffffff'}
            >
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 800, color: '#18181b', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>{opt.text}</span>
                <CheckCircle2 size={18} color="#2563eb" />
              </div>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#16a34a' }}>
                Impacto: {opt.effectLabel}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
