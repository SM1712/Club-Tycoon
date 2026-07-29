import React from 'react';
import { useGame } from '../context/GameContext';
import { RefreshCw, Save, ShieldAlert } from 'lucide-react';

export const SettingsTab: React.FC = () => {
  const { resetGame, notify } = useGame();

  const handleReset = () => {
    resetGame();
    notify("Partida reiniciada correctamente.", 'info');
  };

  return (
    <section className="tab-pane active">
      <div className="section-header">
        <h2>Opciones y Configuración de Partida</h2>
        <p>Gestiona tu partida guardada, reinicia tu trayectoria o sincroniza los datos.</p>
      </div>

      <div className="card max-w-600">
        <div className="card-title">
          <RefreshCw size={18} />
          <span>Reiniciar Presidencia</span>
        </div>

        <div className="alert-notice mb-3" style={{ background: 'rgba(220, 38, 38, 0.08)', borderColor: '#dc2626' }}>
          <ShieldAlert size={20} color="#dc2626" />
          <div>
            <strong style={{ color: '#dc2626' }}>Zona de Peligro:</strong>
            <p style={{ fontSize: '0.82rem', color: '#475569' }}>
              Reiniciar el juego borrará el progreso de tu club y te devolverá a la pantalla de bienvenida.
            </p>
          </div>
        </div>

        <button className="btn btn-danger" onClick={handleReset}>
          Reiniciar Partida
        </button>
      </div>

      <div className="card max-w-600">
        <div className="card-title">
          <Save size={18} />
          <span>Guardado Automático</span>
        </div>

        <p className="card-help">Tu partida se sincroniza en tiempo real en la memoria local de tu navegador.</p>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary" onClick={() => notify("El estado de la partida se encuentra sincronizado.", 'success')}>
            Sincronizar Datos Ahora
          </button>
        </div>
      </div>
    </section>
  );
};
