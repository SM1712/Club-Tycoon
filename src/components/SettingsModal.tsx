import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Settings, Moon, Sun, RefreshCw, Save, ShieldAlert, CheckCircle2, X, Database } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { themeMode, toggleTheme, resetGame, notify } = useGame();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  if (!isOpen) return null;

  const handleSync = () => {
    notify("El estado de la partida se encuentra sincronizado en el almacenamiento local.", "success");
  };

  const handleConfirmReset = () => {
    resetGame();
    setShowResetConfirm(false);
    onClose();
    notify("Partida reiniciada correctamente.", "info");
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: '640px', padding: '1.75rem' }}>
        {/* MODAL HEADER */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Settings size={22} />
            </div>
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                Configuración General
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                Ajustes de interfaz, tema visual, sincronización y control de partida
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '6px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            className="btn-icon-hover"
          >
            <X size={20} />
          </button>
        </div>

        {/* MODAL BODY */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* THEME & APPEARANCE */}
          <div style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '1.1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '3px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {themeMode === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
                  <span>Tema Visual de Interfaz</span>
                </h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0 }}>
                  {themeMode === 'dark' ? 'Modo Oscuro Ejecutivo Slate (Por defecto para reducir fatiga visual).' : 'Modo Claro Directivo.'}
                </p>
              </div>

              <button
                onClick={toggleTheme}
                className="btn btn-secondary"
                style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                {themeMode === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
                <span>{themeMode === 'dark' ? 'Cambiar a Claro' : 'Cambiar a Oscuro'}</span>
              </button>
            </div>
          </div>

          {/* STORAGE & AUTO-SAVE */}
          <div style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '1.1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '3px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Database size={16} />
                  <span>Almacenamiento y Sincronización</span>
                </h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0 }}>
                  Tu partida se guarda automáticamente en tiempo real en la memoria local.
                </p>
              </div>

              <button
                onClick={handleSync}
                className="btn btn-secondary"
                style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <Save size={15} />
                <span>Sincronizar</span>
              </button>
            </div>
          </div>

          {/* DANGER ZONE / RESET */}
          <div style={{ background: 'rgba(220, 38, 38, 0.06)', border: '1px solid rgba(220, 38, 38, 0.3)', borderRadius: '10px', padding: '1.1rem' }}>
            {!showResetConfirm ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#ef4444', marginBottom: '3px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ShieldAlert size={16} />
                    <span>Reiniciar Trayectoria Presidencial</span>
                  </h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0 }}>
                    Restablece el progreso del club y vuelve a la pantalla inicial de onboarding.
                  </p>
                </div>

                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="btn btn-danger"
                  style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}
                >
                  <RefreshCw size={14} />
                  <span>Reiniciar Partida</span>
                </button>
              </div>
            ) : (
              <div>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#ef4444', marginBottom: '0.4rem' }}>
                  ¿Confirmas que deseas reiniciar la partida?
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.85rem' }}>
                  Esta acción borrará los datos guardados de tu club actual y no se podrá deshacer.
                </p>
                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  <button className="btn btn-danger" onClick={handleConfirmReset} style={{ fontSize: '0.8rem' }}>
                    Sí, Reiniciar Todo
                  </button>
                  <button className="btn btn-secondary" onClick={() => setShowResetConfirm(false)} style={{ fontSize: '0.8rem' }}>
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* MODAL FOOTER */}
        <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
          <button className="btn btn-primary" onClick={onClose} style={{ padding: '0.5rem 1.25rem' }}>
            <CheckCircle2 size={16} />
            <span>Cerrar Configuración</span>
          </button>
        </div>
      </div>
    </div>
  );
};
