import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import {
  Building2,
  Activity,
  Sparkles,
  Hammer,
  Edit2,
  Check,
  X,
  Crown,
  ShoppingBag,
  TrendingUp,
  Award,
  Users,
  CircleDollarSign,
  ShieldCheck,
  Sliders,
  ChevronRight
} from 'lucide-react';

export const StadiumTab: React.FC = () => {
  const { userClub, upgradeFacility, buildOwnedStadium, renameStadium } = useGame();

  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'facilities' | 'projections'>('overview');
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(userClub?.stadium || '');

  if (!userClub) return null;

  const formatCurr = (val: number) => '€' + val.toLocaleString('es-ES');

  // Facility Costs & Levels
  const stadiumCost = userClub.isRentingStadium ? 1200000 : userClub.stadiumCapacity * 120;
  const trainingCost = Math.round(300000 * Math.pow(1.5, userClub.trainingLevel - 1));
  const youthCost = Math.round(400000 * Math.pow(1.6, userClub.youthLevel - 1));

  const currentVipLevel = userClub.vipSuitesLevel || 0;
  const vipCost = Math.round(400000 * Math.pow(1.6, currentVipLevel));

  const currentMuseumLevel = userClub.museumLevel || 0;
  const museumCost = Math.round(350000 * Math.pow(1.5, currentMuseumLevel));

  // Tier Badge text
  const getStadiumTier = () => {
    if (userClub.isRentingStadium) return { label: 'Terreno Alquilado', class: 'municipal' };
    if (userClub.stadiumCapacity < 5000) return { label: 'Estadio Local Tradicional', class: 'owned' };
    if (userClub.stadiumCapacity < 15000) return { label: 'Recinto Deportivo Profesional', class: 'owned' };
    if (userClub.stadiumCapacity < 35000) return { label: 'Gran Coliseo de la Liga', class: 'owned' };
    return { label: 'Megacolo de Élite Internacional', class: 'owned' };
  };

  const stadiumTier = getStadiumTier();

  // Financial Estimates per Home Match
  const estAttendance = userClub.isRentingStadium ? 1500 : Math.min(userClub.stadiumCapacity, Math.round(userClub.fans * 0.7));
  const estMatchTicketIncome = estAttendance * userClub.ticketPrice;
  const weeklyMaintenanceCost = userClub.isRentingStadium
    ? 1200
    : Math.round(userClub.stadiumCapacity * 6 + userClub.trainingLevel * 8000 + userClub.youthLevel * 10000);

  const vipExtraIncome = currentVipLevel * 25000;
  const museumExtraWeekly = currentMuseumLevel * 15000;

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim()) {
      renameStadium(nameInput.trim());
      setIsEditingName(false);
    }
  };

  return (
    <section className="tab-pane active stadium-hub">
      <div className="section-header">
        <h2>Estadio e Infraestructuras del Club</h2>
        <p>Gestiona, amplia y bautiza el estadio de tu club e invierte en instalaciones de alto rendimiento para maximizar tus ingresos y desarrollar talento.</p>
      </div>

      {/* HERO BANNER STADIUM */}
      <div className="stadium-hero-banner">
        <div className="stadium-title-row">
          <div className="stadium-title-left">
            <div className="stadium-icon-glow">
              <Building2 size={32} />
            </div>
            <div className="stadium-name-container">
              {isEditingName ? (
                <form onSubmit={handleSaveName} className="stadium-rename-form">
                  <input
                    type="text"
                    className="stadium-rename-input"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="Ej. Estadio Santiago Bernabéu"
                    autoFocus
                  />
                  <button type="submit" className="btn btn-primary btn-sm" title="Guardar Nombre">
                    <Check size={16} /> Guardar
                  </button>
                  <button type="button" className="btn btn-outline btn-sm" onClick={() => setIsEditingName(false)} title="Cancelar">
                    <X size={16} />
                  </button>
                </form>
              ) : (
                <div className="stadium-name-heading">
                  <span>{userClub.stadium}</span>
                  {!userClub.isRentingStadium && (
                    <button
                      className="btn-icon-rename"
                      onClick={() => {
                        setNameInput(userClub.stadium);
                        setIsEditingName(true);
                      }}
                      title="Cambiar Nombre del Estadio"
                    >
                      <Edit2 size={15} />
                    </button>
                  )}
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                <span className={`stadium-tier-badge ${stadiumTier.class}`}>
                  {stadiumTier.label}
                </span>
                {userClub.isRentingStadium && (
                  <span style={{ fontSize: '0.78rem', color: '#f59e0b', fontWeight: 'bold' }}>
                    Canon: {formatCurr(userClub.stadiumRentFee)}/partido en casa
                  </span>
                )}
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            {userClub.isRentingStadium ? (
              <button
                className="btn btn-primary"
                onClick={buildOwnedStadium}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '0.65rem 1.25rem' }}
              >
                <Hammer size={18} /> Construir Estadio Propio (€1.2M)
              </button>
            ) : (
              <button
                className="btn btn-primary"
                onClick={() => upgradeFacility('stadium')}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                <Hammer size={18} /> Ampliar Aforo (+2,500 Asientos)
              </button>
            )}
          </div>
        </div>

        {/* METRICS ROW */}
        <div className="stadium-metrics-row">
          <div className="stadium-mini-card">
            <span className="stadium-mini-label">Capacidad de Aforo</span>
            <span className="stadium-mini-val">
              {userClub.stadiumCapacity.toLocaleString('es-ES')} <small style={{ fontSize: '0.75rem', color: '#94a3b8' }}>asientos</small>
            </span>
          </div>
          <div className="stadium-mini-card">
            <span className="stadium-mini-label">Taquilla Est. / Partido</span>
            <span className="stadium-mini-val" style={{ color: '#10b981' }}>
              {formatCurr(estMatchTicketIncome)}
            </span>
          </div>
          <div className="stadium-mini-card">
            <span className="stadium-mini-label">Palcos VIP Activos</span>
            <span className="stadium-mini-val" style={{ color: '#818cf8' }}>
              Nivel {currentVipLevel} / 5
            </span>
          </div>
          <div className="stadium-mini-card">
            <span className="stadium-mini-label">Mantenimiento Semanal</span>
            <span className="stadium-mini-val" style={{ color: '#f87171' }}>
              {formatCurr(weeklyMaintenanceCost)}
            </span>
          </div>
        </div>
      </div>

      {/* SUB TABS NAVIGATION */}
      <div className="stadium-sub-tabs">
        <button
          className={`stadium-tab-btn ${activeSubTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('overview')}
        >
          <Building2 size={16} /> Recinto de Estadio & Mejoras
        </button>
        <button
          className={`stadium-tab-btn ${activeSubTab === 'facilities' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('facilities')}
        >
          <Activity size={16} /> Centro de Rendimiento & Cantera
        </button>
        <button
          className={`stadium-tab-btn ${activeSubTab === 'projections' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('projections')}
        >
          <TrendingUp size={16} /> Rendimiento Financiero & ROI
        </button>
      </div>

      {/* SUB-TAB 1: RECINTO Y MEJORAS DE ESTADIO */}
      {activeSubTab === 'overview' && (
        <div className="facilities-grid">
          {/* AFORO GENERAL CARD */}
          <div className="facility-card-advanced">
            <div>
              <div className="facility-title-area">
                <div className="facility-icon-circle emerald">
                  <Building2 size={24} />
                </div>
                <div>
                  <h3>Aforo & Asientos de Tribuna</h3>
                  <p>{userClub.isRentingStadium ? 'Terreno alquilado sin aforo propio' : `${userClub.stadiumCapacity.toLocaleString('es-ES')} localidades totales`}</p>
                </div>
              </div>

              <div className="facility-benefit-box" style={{ marginTop: '1rem' }}>
                <div className="benefit-row">
                  <span>Capacidad actual</span>
                  <strong>{userClub.stadiumCapacity.toLocaleString('es-ES')} espectadores</strong>
                </div>
                <div className="benefit-row">
                  <span>Incremento por ampliación</span>
                  <strong style={{ color: '#10b981' }}>+2,500 localidades</strong>
                </div>
                <div className="benefit-row">
                  <span>Impacto estimado en taquilla</span>
                  <strong style={{ color: '#38bdf8' }}>+{formatCurr(2500 * userClub.ticketPrice)} /partido en casa</strong>
                </div>
              </div>
            </div>

            <div className="facility-action">
              <div className="cost-tag">Costo de Inversión: {formatCurr(stadiumCost)}</div>
              {userClub.isRentingStadium ? (
                <button className="btn btn-primary btn-full" onClick={buildOwnedStadium}>
                  <Hammer size={16} /> Construir Estadio Propio (€1.2M)
                </button>
              ) : (
                <button className="btn btn-primary btn-full" onClick={() => upgradeFacility('stadium')}>
                  + Ampliar Aforo Estadio
                </button>
              )}
            </div>
          </div>

          {/* PALCOS VIP CARD */}
          <div className="facility-card-advanced">
            <div>
              <div className="facility-title-area">
                <div className="facility-icon-circle purple">
                  <Crown size={24} />
                </div>
                <div>
                  <h3>Palcos VIP & Suites Ejecutivas</h3>
                  <p>Nivel Actual: {currentVipLevel} / 5</p>
                </div>
              </div>

              <div className="facility-level-bar-bg">
                <div
                  className="facility-level-bar-fill"
                  style={{ width: `${(currentVipLevel / 5) * 100}%`, background: 'linear-gradient(90deg, #6366f1, #818cf8)' }}
                ></div>
              </div>

              <div className="facility-benefit-box" style={{ marginTop: '1rem' }}>
                <div className="benefit-row">
                  <span>Ingreso VIP por partido</span>
                  <strong style={{ color: '#818cf8' }}>+{formatCurr(vipExtraIncome)} /partido</strong>
                </div>
                <div className="benefit-row">
                  <span>Atracción de patrocinadores</span>
                  <strong>+{currentVipLevel * 10}% prestigio ejecutivo</strong>
                </div>
                <div className="benefit-row">
                  <span>Próximo nivel (+1)</span>
                  <strong style={{ color: '#10b981' }}>+{formatCurr(25000)} /partido adicional</strong>
                </div>
              </div>
            </div>

            <div className="facility-action">
              <div className="cost-tag">{currentVipLevel >= 5 ? 'Nivel Máximo' : `Costo de Mejora: ${formatCurr(vipCost)}`}</div>
              <button
                className="btn btn-primary btn-full"
                disabled={currentVipLevel >= 5}
                onClick={() => upgradeFacility('vip')}
              >
                {currentVipLevel >= 5 ? 'Nivel Máximo Alcanzado' : 'Construir / Ampliar Palcos VIP'}
              </button>
            </div>
          </div>

          {/* MUSEO & MEGASTORE CARD */}
          <div className="facility-card-advanced">
            <div>
              <div className="facility-title-area">
                <div className="facility-icon-circle gold">
                  <ShoppingBag size={24} />
                </div>
                <div>
                  <h3>Museo & Megastore del Club</h3>
                  <p>Nivel Actual: {currentMuseumLevel} / 5</p>
                </div>
              </div>

              <div className="facility-level-bar-bg">
                <div
                  className="facility-level-bar-fill"
                  style={{ width: `${(currentMuseumLevel / 5) * 100}%`, background: 'linear-gradient(90deg, #f59e0b, #fbbf24)' }}
                ></div>
              </div>

              <div className="facility-benefit-box" style={{ marginTop: '1rem' }}>
                <div className="benefit-row">
                  <span>Ingreso semanal pasivo</span>
                  <strong style={{ color: '#f59e0b' }}>+{formatCurr(museumExtraWeekly)} /semana</strong>
                </div>
                <div className="benefit-row">
                  <span>Venta de merchandising</span>
                  <strong>+{currentMuseumLevel * 15}% ingresos turísticos</strong>
                </div>
                <div className="benefit-row">
                  <span>Próximo nivel (+1)</span>
                  <strong style={{ color: '#10b981' }}>+{formatCurr(15000)} /semana</strong>
                </div>
              </div>
            </div>

            <div className="facility-action">
              <div className="cost-tag">{currentMuseumLevel >= 5 ? 'Nivel Máximo' : `Costo de Mejora: ${formatCurr(museumCost)}`}</div>
              <button
                className="btn btn-primary btn-full"
                disabled={currentMuseumLevel >= 5}
                onClick={() => upgradeFacility('museum')}
              >
                {currentMuseumLevel >= 5 ? 'Nivel Máximo Alcanzado' : 'Ampliar Museo & Megastore'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: CENTRO DE ALTO RENDIMIENTO Y CANTERA */}
      {activeSubTab === 'facilities' && (
        <div className="facilities-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
          {/* TRAINING GROUNDS */}
          <div className="facility-card-advanced">
            <div>
              <div className="facility-title-area">
                <div className="facility-icon-circle emerald">
                  <Activity size={26} />
                </div>
                <div>
                  <h3>Canchas de Entrenamiento & Rendimiento</h3>
                  <p>Nivel Actual: {userClub.trainingLevel} / 10</p>
                </div>
              </div>

              <div className="facility-level-bar-bg" style={{ marginTop: '0.85rem' }}>
                <div
                  className="facility-level-bar-fill"
                  style={{ width: `${(userClub.trainingLevel / 10) * 100}%`, background: 'linear-gradient(90deg, #059669, #10b981)' }}
                ></div>
              </div>

              <div className="facility-benefit-box" style={{ marginTop: '1.25rem' }}>
                <div className="benefit-row">
                  <span>Desarrollo de Plantel (OVR)</span>
                  <strong style={{ color: '#10b981' }}>+{userClub.trainingLevel * 5}% velocidad de mejora</strong>
                </div>
                <div className="benefit-row">
                  <span>Prevención de Lesiones</span>
                  <strong>-{userClub.trainingLevel * 3}% riesgo en partidos</strong>
                </div>
                <div className="benefit-row">
                  <span>Efectividad Táctica DT</span>
                  <strong>+{userClub.trainingLevel * 4}% adaptación táctica</strong>
                </div>
              </div>
            </div>

            <div className="facility-action" style={{ marginTop: '1.5rem' }}>
              <div className="cost-tag">{userClub.trainingLevel >= 10 ? 'Nivel Máximo' : `Costo de Mejora: ${formatCurr(trainingCost)}`}</div>
              <button
                className="btn btn-primary btn-full"
                disabled={userClub.trainingLevel >= 10}
                onClick={() => upgradeFacility('training')}
              >
                {userClub.trainingLevel >= 10 ? 'Nivel Máximo Alcanzado' : 'Mejorar Canchas de Entrenamiento'}
              </button>
            </div>
          </div>

          {/* YOUTH ACADEMY (FILIAL) */}
          <div className="facility-card-advanced">
            <div>
              <div className="facility-title-area">
                <div className="facility-icon-circle purple">
                  <Sparkles size={26} />
                </div>
                <div>
                  <h3>Equipo Filial y Cantera de Talentos</h3>
                  <p>Nivel Actual: {userClub.youthLevel} / 10</p>
                </div>
              </div>

              <div className="facility-level-bar-bg" style={{ marginTop: '0.85rem' }}>
                <div
                  className="facility-level-bar-fill"
                  style={{ width: `${(userClub.youthLevel / 10) * 100}%`, background: 'linear-gradient(90deg, #6366f1, #a855f7)' }}
                ></div>
              </div>

              <div className="facility-benefit-box" style={{ marginTop: '1.25rem' }}>
                <div className="benefit-row">
                  <span>OVR Promedio de Jóvenes</span>
                  <strong style={{ color: '#818cf8' }}>
                    {52 + userClub.youthLevel * 2} - {58 + userClub.youthLevel * 3} OVR
                  </strong>
                </div>
                <div className="benefit-row">
                  <span>Promesas de Élite al Fin de Temporada</span>
                  <strong>{userClub.youthLevel * 10}% probabilidad de talento top</strong>
                </div>
                <div className="benefit-row">
                  <span>Generación de Canteranos por Año</span>
                  <strong>{Math.min(5, 2 + Math.floor(userClub.youthLevel / 3))} jugadores nuevos</strong>
                </div>
              </div>
            </div>

            <div className="facility-action" style={{ marginTop: '1.5rem' }}>
              <div className="cost-tag">{userClub.youthLevel >= 10 ? 'Nivel Máximo' : `Costo de Mejora: ${formatCurr(youthCost)}`}</div>
              <button
                className="btn btn-primary btn-full"
                disabled={userClub.youthLevel >= 10}
                onClick={() => upgradeFacility('youth')}
              >
                {userClub.youthLevel >= 10 ? 'Nivel Máximo Alcanzado' : 'Mejorar Cantera del Filial'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: PROYECCIONES Y RETORNO DE INVERSIÓN */}
      {activeSubTab === 'projections' && (
        <div className="facilities-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <div className="card">
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CircleDollarSign color="#10b981" size={20} /> Balance de Taquilla en Casa
            </h3>
            <p className="card-help">Desglose estimado de recaudación por partido en casa a pleno rendimiento.</p>

            <div className="facility-benefit-box">
              <div className="benefit-row">
                <span>Venta de Entradas General</span>
                <strong>{formatCurr(estMatchTicketIncome)}</strong>
              </div>
              <div className="benefit-row">
                <span>Palcos VIP Ejecutivos</span>
                <strong style={{ color: '#818cf8' }}>+{formatCurr(vipExtraIncome)}</strong>
              </div>
              <div className="benefit-row">
                <span>Mantenimiento del Recinto</span>
                <strong style={{ color: '#f87171' }}>-{formatCurr(weeklyMaintenanceCost)}</strong>
              </div>
              <hr style={{ borderColor: 'var(--border-color)', margin: '0.4rem 0' }} />
              <div className="benefit-row" style={{ fontSize: '0.95rem' }}>
                <span>Beneficio Neto por Partido</span>
                <strong style={{ color: '#10b981', fontSize: '1.1rem' }}>
                  {formatCurr(estMatchTicketIncome + vipExtraIncome - weeklyMaintenanceCost)}
                </strong>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp color="#38bdf8" size={20} /> Retorno Estimado de Inversión (ROI)
            </h3>
            <p className="card-help">Tiempo aproximado para amortizar las inversiones en infraestructura.</p>

            <div className="facility-benefit-box">
              <div className="benefit-row">
                <span>Amortización de Ampliación (+2,500 Asientos)</span>
                <strong>~{Math.ceil(stadiumCost / Math.max(1, 2500 * userClub.ticketPrice))} partidos en casa</strong>
              </div>
              <div className="benefit-row">
                <span>Amortización Palcos VIP (Nivel Siguiente)</span>
                <strong>~{Math.ceil(vipCost / 25000)} partidos en casa</strong>
              </div>
              <div className="benefit-row">
                <span>Amortización Museo & Megastore</span>
                <strong>~{Math.ceil(museumCost / 15000)} semanas</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
