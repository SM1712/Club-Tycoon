import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { ClubCrest } from './ClubCrest';
import { X, Building2, Shield } from 'lucide-react';

interface ClubModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ClubModal: React.FC<ClubModalProps> = ({ isOpen, onClose }) => {
  const { clubs, divisions, presidentName, startNewGame } = useGame();
  const [activeTab, setActiveTab] = useState<'EXISTING' | 'CUSTOM'>('EXISTING');
  const [selectedDiv, setSelectedDiv] = useState<string>('div1');

  // Form states for Custom Club
  const [name, setName] = useState('Deportivo Atlántico');
  const [abbr, setAbbr] = useState('DAF');
  const [color1, setColor1] = useState('#2563eb');
  const [color2, setColor2] = useState('#ffffff');

  if (!isOpen) return null;

  const handleSelectExisting = (clubId: string) => {
    startNewGame(presidentName || 'Presidente Institucional', 'EXISTING', clubId);
    onClose();
  };

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !abbr) return;

    startNewGame(presidentName || 'Presidente Fundador', 'CUSTOM', undefined, {
      name,
      abbr,
      color1,
      color2
    });

    onClose();
  };

  const filteredClubs = clubs.filter(c => c.divisionId === selectedDiv);

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: '750px', padding: '1.75rem' }}>
        <div className="modal-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 800, margin: 0 }}>Selección y Fundación de Club</h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>Toma la presidencia de una institución existente o funda un equipo propio.</p>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-tabs">
          <button
            className={`modal-tab-btn ${activeTab === 'EXISTING' ? 'active' : ''}`}
            onClick={() => setActiveTab('EXISTING')}
          >
            Elegir Club Existente
          </button>
          <button
            className={`modal-tab-btn ${activeTab === 'CUSTOM' ? 'active' : ''}`}
            onClick={() => setActiveTab('CUSTOM')}
          >
            Crear Club Nuevo (Desafío 3ª Div)
          </button>
        </div>

        <div className="modal-body">
          {activeTab === 'EXISTING' ? (
            <div>
              <div className="division-tabs" style={{ marginBottom: '1rem' }}>
                {divisions.map(div => (
                  <button
                    key={div.id}
                    className={`div-tab-btn ${selectedDiv === div.id ? 'active' : ''}`}
                    onClick={() => setSelectedDiv(div.id)}
                  >
                    <span>{div.name}</span>
                  </button>
                ))}
              </div>

              <div className="clubs-grid-select" style={{ maxHeight: '320px', overflowY: 'auto', paddingRight: '4px' }}>
                {filteredClubs.map(club => (
                  <div key={club.id} className="club-select-card" onClick={() => handleSelectExisting(club.id)}>
                    <ClubCrest
                      logo={club.logo}
                      name={club.name}
                      abbr={club.abbr}
                      color1={club.color1}
                      color2={club.color2}
                      size={46}
                    />
                    <h4 style={{ marginTop: '4px' }}>{club.name}</h4>
                    <p style={{ margin: 0 }}>{club.stadium}</p>
                    <span style={{ fontSize: '0.72rem', color: 'var(--accent-emerald)', fontWeight: 'bold' }}>
                      Presupuesto: €{(club.budget / 1000000).toFixed(1)}M
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <form onSubmit={handleCreateCustom}>
              <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '1.25rem', alignItems: 'center', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', padding: '1.1rem', borderRadius: '10px', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 800, marginBottom: '6px' }}>
                    Escudo Creado
                  </span>
                  <ClubCrest
                    name={name || 'Nuevo Club'}
                    abbr={abbr || 'NC'}
                    color1={color1}
                    color2={color2}
                    size={64}
                  />
                  <span style={{ fontSize: '0.82rem', fontWeight: 800, marginTop: '6px', color: 'var(--text-primary)' }}>
                    {abbr || 'NC'}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <div className="form-row">
                    <div className="form-group" style={{ margin: 0 }}>
                      <label>Nombre del Club Fundado</label>
                      <input
                        type="text"
                        placeholder="Ej. Real Atlántico FC"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                        className="text-input"
                      />
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                      <label>Abreviatura (3 Letras)</label>
                      <input
                        type="text"
                        placeholder="Ej. RAT"
                        maxLength={3}
                        value={abbr}
                        onChange={e => setAbbr(e.target.value)}
                        required
                        className="text-input"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group" style={{ margin: 0 }}>
                      <label>Color Principal</label>
                      <input type="color" value={color1} onChange={e => setColor1(e.target.value)} style={{ width: '100%', height: '38px', cursor: 'pointer', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '6px' }} />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label>Color Secundario</label>
                      <input type="color" value={color2} onChange={e => setColor2(e.target.value)} style={{ width: '100%', height: '38px', cursor: 'pointer', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '6px' }} />
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={onClose}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Fundar Club en 3ª Div y Comenzar
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
