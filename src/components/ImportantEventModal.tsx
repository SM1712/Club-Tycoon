import React from 'react';
import { Trophy, CheckCircle2 } from 'lucide-react';

export interface ImportantModalData {
  title: string;
  description: string;
  icon?: string;
  badge?: string;
  buttonText?: string;
}

interface ImportantEventModalProps {
  data: ImportantModalData | null;
  onClose: () => void;
}

export const ImportantEventModal: React.FC<ImportantEventModalProps> = ({ data, onClose }) => {
  if (!data) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: '520px', textAlign: 'center', padding: '2rem' }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '12px',
          background: '#fef08a',
          border: '2px solid #18181b',
          color: '#18181b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.25rem auto',
          boxShadow: '2.5px 3px 0px #18181b',
          fontSize: '1.5rem'
        }}>
          {data.icon || <Trophy size={28} />}
        </div>

        {data.badge && (
          <span className="pill pill-green" style={{ marginBottom: '0.75rem', display: 'inline-block', fontSize: '0.78rem' }}>
            {data.badge}
          </span>
        )}

        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
          {data.title}
        </h2>

        <div style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6, whiteSpace: 'pre-line', marginBottom: '1.75rem' }}>
          {data.description}
        </div>

        <button className="btn btn-primary btn-full" style={{ padding: '0.75rem', fontSize: '0.95rem' }} onClick={onClose}>
          <CheckCircle2 size={18} />
          <span>{data.buttonText || 'Entendido'}</span>
        </button>
      </div>
    </div>
  );
};
