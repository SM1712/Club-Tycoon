import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { EconomySystem } from '../systems/EconomySystem';
import { 
  Wallet, TrendingUp, TrendingDown, DollarSign, Ticket, Users, 
  AlertCircle, CheckCircle2, ShieldAlert, Sparkles, Building2, 
  Lock, Landmark, Scale, AlertTriangle, Ban, ShoppingBag, 
  UserCheck, ArrowUpRight, ArrowDownRight, Layers, Award, Handshake, ChevronRight, Sliders, Info
} from 'lucide-react';

export const EconomyTab: React.FC = () => {
  const { userClub, updateBudgetAllocations, updateTicketPrice, players, notify } = useGame();

  if (!userClub) return null;

  const userSquad = players.filter(p => p.clubId === userClub.id);
  const [transferVal, setTransferVal] = useState(userClub.dtTransferBudget);
  const [renewalVal, setRenewalVal] = useState(userClub.dtRenewalBudget);
  const [ticketPriceVal, setTicketPriceVal] = useState(userClub.ticketPrice);

  const formatCurr = (val: number) => '€' + val.toLocaleString('es-ES');

  // Compute seasonal projection and weekly simulation dynamically
  const tempClub = { ...userClub, ticketPrice: ticketPriceVal, dtTransferBudget: transferVal, dtRenewalBudget: renewalVal };
  const seasonalProj = EconomySystem.calculateSeasonalProjection(tempClub, userSquad);
  const weeklySim = EconomySystem.calculateWeeklyFinances(tempClub, userSquad, true);

  const capacity = userClub.isRentingStadium ? 1500 : userClub.stadiumCapacity;
  const occupancyRate = Math.min(100, Math.round((weeklySim.estimatedAttendance / Math.max(1, capacity)) * 100));

  const annualSquadSalaries = userSquad.reduce((sum, p) => sum + p.salary, 0);
  const annualDtSalary = userClub.dt ? userClub.dt.salary : 0;
  const annualMaintenance = weeklySim.maintenanceExpense * 38;
  const totalExpense = seasonalProj.totalProjectedExpense;

  const squadSalaryPct = Math.min(100, Math.round((annualSquadSalaries / Math.max(1, totalExpense)) * 100));
  const dtSalaryPct = Math.min(100, Math.round((annualDtSalary / Math.max(1, totalExpense)) * 100));
  const maintenancePct = Math.min(100, Math.round((annualMaintenance / Math.max(1, totalExpense)) * 100));

  const totalReservedForDT = transferVal + renewalVal;
  const freeLiquidTreasury = userClub.budget - totalReservedForDT;

  const handleSaveBudget = () => {
    if (totalReservedForDT > userClub.budget) {
      notify(`No puedes asignar €${totalReservedForDT.toLocaleString('es-ES')} al DT si tu tesorería total es de €${userClub.budget.toLocaleString('es-ES')}.`, 'error');
      return;
    }
    updateBudgetAllocations(transferVal, renewalVal);
    notify("Partidas de presupuesto asignadas y reservadas para el Director Técnico.", 'success');
  };

  return (
    <section className="tab-pane active" style={{ paddingBottom: '3rem' }}>
      {/* HEADER TITLE DOODLE */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.25rem',
        background: '#ffffff',
        padding: '1.1rem 1.4rem',
        borderRadius: '12px',
        border: '2px solid #18181b',
        boxShadow: '2.5px 3px 0px #18181b'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: '#fef08a',
            border: '2px solid #18181b',
            color: '#18181b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '2px 2px 0px #18181b'
          }}>
            <Landmark size={22} />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, color: '#18181b', fontFamily: "'Kalam', cursive" }}>
              Presupuesto, Tesorería & Finanzas Institucionales
            </h2>
            <span style={{ fontSize: '0.82rem', color: '#52525b', fontFamily: "'Patrick Hand', cursive" }}>
              Gestión de caja, reserva de fondos para el DT, política de entradas y proyecciones de temporada
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{
            padding: '0.4rem 0.85rem',
            borderRadius: '16px',
            fontSize: '0.82rem',
            fontWeight: 800,
            fontFamily: "'Patrick Hand', cursive",
            background: seasonalProj.healthStatus === 'HEALTHY' ? '#bbf7d0' : (seasonalProj.healthStatus === 'WARNING' ? '#fef08a' : '#fecaca'),
            color: '#18181b',
            border: '1.5px solid #18181b',
            boxShadow: '1.5px 1.5px 0px #18181b',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}>
            {seasonalProj.healthStatus === 'HEALTHY' && <CheckCircle2 size={15} style={{ color: '#15803d' }} />}
            {seasonalProj.healthStatus === 'WARNING' && <AlertCircle size={15} style={{ color: '#b45309' }} />}
            {seasonalProj.healthStatus === 'CRITICAL' && <ShieldAlert size={15} style={{ color: '#dc2626' }} />}
            <span>Salud Financiera: {seasonalProj.healthStatus === 'HEALTHY' ? 'Excelente' : (seasonalProj.healthStatus === 'WARNING' ? 'Aceptable' : 'Déficit Crítico')}</span>
          </span>
        </div>
      </div>

      {/* EXPLANATORY ALERT BANNER ON HOW DT FUNDS WORK */}
      <div className="card shadow-sm" style={{
        padding: '1rem 1.25rem',
        marginBottom: '1.5rem',
        background: 'rgba(59, 130, 246, 0.08)',
        border: '1px solid rgba(59, 130, 246, 0.25)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.85rem'
      }}>
        <Info size={22} style={{ color: '#3b82f6', flexShrink: 0, marginTop: '2px' }} />
        <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: '1.5' }}>
          <strong>¿Cómo funciona la reserva de fondos para el Director Técnico (DT)?</strong>
          <p style={{ margin: '0.2rem 0 0 0', color: 'var(--text-secondary)' }}>
            Cuando asignas presupuesto al DT para Fichajes o Renovaciones, ese dinero se <strong>bloquea de la liquidez libre de la Directiva</strong> para que el DT tenga garantizado su presupuesto de mercado. Cuando apruebes una propuesta de fichaje del DT, el dinero se consumirá directamente de su Fondo Reservado y reducirá la tesorería total del club.
          </p>
        </div>
      </div>

      {/* TOP 4 EXECUTIVE KPI CARDS */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        {/* KPI 1: Tesorería Total */}
        <div className="card shadow-sm" style={{
          padding: '1.1rem',
          background: '#ffffff',
          border: '1.5px solid #18181b',
          borderRadius: '10px',
          boxShadow: '2px 2.5px 0px #18181b'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#3f3f46', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Tesorería Total Caja
            </span>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: '#fef08a',
              border: '1.5px solid #18181b',
              color: '#18181b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Wallet size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.55rem', fontWeight: 900, color: '#18181b', fontFamily: "'Kalam', cursive", marginBottom: '0.2rem' }}>
            {formatCurr(userClub.budget)}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#52525b', fontFamily: "'Patrick Hand', cursive" }}>
            Dinero bruto en cuenta bancaria del club
          </span>
        </div>

        {/* KPI 2: Reservado al DT */}
        <div className="card shadow-sm" style={{
          padding: '1.1rem',
          background: '#ffffff',
          border: '1.5px solid #18181b',
          borderRadius: '10px',
          boxShadow: '2.5px 2.5px 0px #18181b'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#3f3f46', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Reservado para el DT
            </span>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: '#e0e7ff',
              border: '1.5px solid #18181b',
              color: '#18181b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Lock size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.55rem', fontWeight: 900, color: '#4338ca', fontFamily: "'Kalam', cursive", marginBottom: '0.2rem' }}>
            {formatCurr(totalReservedForDT)}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#52525b', fontFamily: "'Patrick Hand', cursive" }}>
            Fondo Fichajes (€{transferVal.toLocaleString('es-ES')}) + Renov. (€{renewalVal.toLocaleString('es-ES')})
          </span>
        </div>

        {/* KPI 3: Liquidez Libre Directiva */}
        <div className="card shadow-sm" style={{
          padding: '1.1rem',
          background: '#ffffff',
          border: '1.5px solid #18181b',
          borderRadius: '10px',
          boxShadow: '2.5px 2.5px 0px #18181b'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#3f3f46', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Liquidez Libre Directiva
            </span>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: '#bbf7d0',
              border: '1.5px solid #18181b',
              color: '#18181b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Landmark size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.55rem', fontWeight: 900, color: freeLiquidTreasury >= 0 ? '#15803d' : '#b91c1c', fontFamily: "'Kalam', cursive", marginBottom: '0.2rem' }}>
            {formatCurr(freeLiquidTreasury)}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#52525b', fontFamily: "'Patrick Hand', cursive" }}>
            Disponible para estadios, cantera y mejoras
          </span>
        </div>

        {/* KPI 4: Balance Neto Proyectado */}
        <div className="card shadow-sm" style={{
          padding: '1.1rem',
          background: '#ffffff',
          border: '1.5px solid #18181b',
          borderRadius: '10px',
          boxShadow: '2.5px 2.5px 0px #18181b'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#3f3f46', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Balance Neto Proyectado
            </span>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: '#bfdbfe',
              border: '1.5px solid #18181b',
              color: '#18181b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <DollarSign size={16} />
            </div>
          </div>
          <div style={{
            fontSize: '1.55rem',
            fontWeight: 900,
            color: seasonalProj.projectedNetBalance >= 0 ? '#15803d' : '#b91c1c',
            fontFamily: "'Kalam', cursive",
            marginBottom: '0.2rem'
          }}>
            {seasonalProj.projectedNetBalance >= 0 ? '+' : ''}{formatCurr(seasonalProj.projectedNetBalance)}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#52525b', fontFamily: "'Patrick Hand', cursive" }}>
            Resultado neto estimado a 38 semanas
          </span>
        </div>
      </div>

      {/* MAIN TWO-COLUMN LAYOUT */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        
        {/* ======================================================== */}
        {/* LEFT COLUMN: TICKETING & REVENUE BREAKDOWN */}
        {/* ======================================================== */}
        <div className="card shadow-sm" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.85rem' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Ticket size={20} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Política de Taquilla & Entradas
                </h3>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  Ajusta el precio por partido y analiza la curva de demanda de espectadores
                </span>
              </div>
            </div>

            {/* Slider: Ticket Pricing */}
            {(() => {
              let refPrice = 12;
              let maxSlider = 45;
              if (userClub.divisionId === 'div2') { refPrice = 22; maxSlider = 85; }
              if (userClub.divisionId === 'div1') { refPrice = 45; maxSlider = 180; }

              return (
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <label style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      Precio de Entrada por Partido
                    </label>
                    <span style={{ fontSize: '1.15rem', fontWeight: 900, color: '#10b981' }}>
                      {formatCurr(ticketPriceVal)} <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>/ entrada</span>
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max={maxSlider}
                    step="1"
                    value={ticketPriceVal}
                    onChange={e => {
                      const val = Number(e.target.value);
                      setTicketPriceVal(val);
                      updateTicketPrice(val);
                    }}
                    style={{ width: '100%', accentColor: '#10b981', cursor: 'pointer' }}
                  />

                  {/* Feedback Banner based on price */}
                  <div style={{
                    marginTop: '0.65rem',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-color)'
                  }}>
                    {ticketPriceVal <= refPrice && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontWeight: 700 }}>
                        <CheckCircle2 size={16} />
                        <span>Tarifa Popular: Alta asistencia ({occupancyRate}% aforo) y afición entusiasmada.</span>
                      </div>
                    )}
                    {ticketPriceVal > refPrice && ticketPriceVal <= refPrice * 1.5 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#3b82f6', fontWeight: 700 }}>
                        <Scale size={16} />
                        <span>Tarifa Óptima: Recaudación maximizada ({formatCurr(weeklySim.ticketIncome)} / partido).</span>
                      </div>
                    )}
                    {ticketPriceVal > refPrice * 1.5 && ticketPriceVal <= refPrice * 2.5 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b', fontWeight: 700 }}>
                        <AlertTriangle size={16} />
                        <span>Tarifa Elevada: Caída de aforo ({occupancyRate}% aforo).</span>
                      </div>
                    )}
                    {ticketPriceVal > refPrice * 2.5 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f43f5e', fontWeight: 800 }}>
                        <Ban size={16} />
                        <span>Tarifario Abusivo: Gradas desiertas ({weeklySim.estimatedAttendance} espectadores).</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* Income Breakdown Bars */}
            <div>
              <h4 style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.75rem' }}>
                Desglose de Fuentes de Ingreso Semanales
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {/* Line 1: Ticket Income */}
                <div style={{ background: '#f8fafc', border: '1px solid #18181b', padding: '0.65rem 0.85rem', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.25rem' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: '#18181b' }}>
                      <Ticket size={14} style={{ color: '#15803d' }} /> Taquilla de Estadio ({weeklySim.estimatedAttendance.toLocaleString('es-ES')} espectadores)
                    </span>
                    <strong style={{ color: '#15803d', fontFamily: "'Kalam', cursive" }}>+{formatCurr(weeklySim.ticketIncome)}</strong>
                  </div>
                  <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden', border: '1px solid #18181b' }}>
                    <div style={{ width: `${occupancyRate}%`, height: '100%', background: '#22c55e' }}></div>
                  </div>
                </div>

                {/* Line 2: Merchandising */}
                <div style={{ background: '#f8fafc', border: '1px solid #18181b', padding: '0.65rem 0.85rem', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.25rem' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: '#18181b' }}>
                      <ShoppingBag size={14} style={{ color: '#2563eb' }} /> Camisetas Oficiales & Tienda del Club
                    </span>
                    <strong style={{ color: '#15803d', fontFamily: "'Kalam', cursive" }}>+{formatCurr(weeklySim.jerseyIncome + weeklySim.merchIncome)}</strong>
                  </div>
                  <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden', border: '1px solid #18181b' }}>
                    <div style={{ width: '55%', height: '100%', background: '#3b82f6' }}></div>
                  </div>
                </div>

                {/* Line 3: Active Sponsors */}
                <div style={{ background: '#f8fafc', border: '1px solid #18181b', padding: '0.65rem 0.85rem', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.25rem' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: '#18181b' }}>
                      <Handshake size={14} style={{ color: '#7c3aed' }} /> Patrocinadores Comerciales ({userClub.activeSponsors?.length || 0} activos)
                    </span>
                    <strong style={{ color: '#15803d', fontFamily: "'Kalam', cursive" }}>+{formatCurr(weeklySim.sponsorsIncome)}</strong>
                  </div>
                  <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden', border: '1px solid #18181b' }}>
                    <div style={{ width: '70%', height: '100%', background: '#a855f7' }}></div>
                  </div>
                </div>

                {/* Line 4: Socios Income */}
                <div style={{ background: '#f8fafc', border: '1px solid #18181b', padding: '0.65rem 0.85rem', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.25rem' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: '#18181b' }}>
                      <Users size={14} style={{ color: '#b45309' }} /> Cuotas de Socios ({userClub.sociosData?.isProgramActive ? `${userClub.sociosData.sociosCount.toLocaleString('es-ES')} socios` : 'Programa no activo'})
                    </span>
                    <strong style={{ color: '#15803d', fontFamily: "'Kalam', cursive" }}>+{formatCurr(weeklySim.sociosIncome)}</strong>
                  </div>
                  <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden', border: '1px solid #18181b' }}>
                    <div style={{ width: `${Math.min(100, Math.round(((userClub.sociosData?.sociosCount || 0) / Math.max(1, userClub.fans)) * 100))}%`, height: '100%', background: '#eab308' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* RIGHT COLUMN: EXPENSES & DT BUDGET ALLOCATION */}
        {/* ======================================================== */}
        <div className="card shadow-sm" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', borderBottom: '1.5px solid #18181b', paddingBottom: '0.85rem' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#fecaca', border: '1.5px solid #18181b', color: '#18181b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <DollarSign size={20} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#18181b', fontFamily: "'Kalam', cursive" }}>
                  Gastos Operativos & Delegación DT
                </h3>
                <span style={{ fontSize: '0.78rem', color: '#52525b', fontFamily: "'Patrick Hand', cursive" }}>
                  Estructura salarial, costes de instalaciones y presupuesto asignado al entrenador
                </span>
              </div>
            </div>

            {/* Expense Breakdown Progress Bars */}
            <div style={{ marginBottom: '1.25rem' }}>
              <h4 style={{ fontSize: '0.8rem', fontWeight: 800, color: '#18181b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.75rem' }}>
                Estructura de Gastos Anuales
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.2rem' }}>
                    <span style={{ fontWeight: 700, color: '#18181b' }}>Masa Salarial Plantilla ({squadSalaryPct}%)</span>
                    <strong style={{ color: '#b91c1c', fontFamily: "'Kalam', cursive" }}>{formatCurr(annualSquadSalaries)} / año</strong>
                  </div>
                  <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden', border: '1px solid #18181b' }}>
                    <div style={{ width: `${squadSalaryPct}%`, height: '100%', background: '#ef4444' }}></div>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.2rem' }}>
                    <span style={{ fontWeight: 700, color: '#18181b' }}>Sueldo del DT / Cuerpo Técnico ({dtSalaryPct}%)</span>
                    <strong style={{ color: '#b91c1c', fontFamily: "'Kalam', cursive" }}>{formatCurr(annualDtSalary)} / año</strong>
                  </div>
                  <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden', border: '1px solid #18181b' }}>
                    <div style={{ width: `${dtSalaryPct}%`, height: '100%', background: '#71717a' }}></div>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.2rem' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Mantenimiento & Instalaciones ({maintenancePct}%)</span>
                    <strong style={{ color: '#f43f5e' }}>{formatCurr(annualMaintenance)} / año</strong>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(0,0,0,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${maintenancePct}%`, height: '100%', background: '#94a3b8' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* DT Allocation Controls */}
            <div style={{ background: 'var(--bg-input)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <h4 style={{ margin: '0 0 0.85rem 0', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Presupuesto Delegado al Director Técnico (DT)
              </h4>

              <div style={{ marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.3rem' }}>
                  <span>Fondo Fichajes (DT):</span>
                  <strong style={{ color: '#3b82f6' }}>{formatCurr(transferVal)}</strong>
                </div>
                <input
                  type="range"
                  min="0"
                  max={userClub.budget}
                  step="25000"
                  value={transferVal}
                  onChange={e => setTransferVal(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#3b82f6', cursor: 'pointer' }}
                />
              </div>

              <div style={{ marginBottom: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.3rem' }}>
                  <span>Fondo Renovaciones (DT):</span>
                  <strong style={{ color: '#8b5cf6' }}>{formatCurr(renewalVal)}</strong>
                </div>
                <input
                  type="range"
                  min="0"
                  max={userClub.budget}
                  step="25000"
                  value={renewalVal}
                  onChange={e => setRenewalVal(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#8b5cf6', cursor: 'pointer' }}
                />
              </div>

              {/* Live Satisfaction / Liquidity feedback */}
              {(() => {
                const ratio = totalReservedForDT / Math.max(1, userClub.budget);

                return (
                  <div style={{ fontSize: '0.78rem', paddingTop: '0.5rem', borderTop: '1px dashed var(--border-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Liquidez Libre Directiva:</span>
                      <strong style={{ color: freeLiquidTreasury >= 0 ? '#10b981' : '#f43f5e' }}>{formatCurr(freeLiquidTreasury)}</strong>
                    </div>
                    <div style={{ color: ratio >= 0.35 ? '#10b981' : (ratio >= 0.15 ? '#3b82f6' : '#f43f5e'), fontWeight: 700 }}>
                      {ratio >= 0.35 && "✓ Reacción DT: Entusiasmado con la confianza depositada."}
                      {ratio >= 0.15 && ratio < 0.35 && "✓ Reacción DT: Conforme con la partida disponible."}
                      {ratio < 0.15 && "⚠ Reacción DT: Preocupado por la escasez de fondos."}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          <button
            onClick={handleSaveBudget}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.7rem', fontWeight: 800, marginTop: '1rem' }}
          >
            Guardar y Reservar Fondos del DT
          </button>
        </div>
      </div>

      {/* STRATEGIC ADVISOR CARD */}
      <div className="card shadow-sm" style={{
        padding: '1.25rem 1.5rem',
        background: 'linear-gradient(135deg, var(--bg-card) 0%, rgba(59, 130, 246, 0.05) 100%)',
        border: '1px solid rgba(59, 130, 246, 0.25)',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <div style={{
          width: '46px',
          height: '46px',
          borderRadius: '12px',
          background: 'rgba(59, 130, 246, 0.15)',
          color: '#3b82f6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <Sparkles size={24} />
        </div>
        <div>
          <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Informe Estratégico del Asesor Financiero
          </h4>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.45' }}>
            {userClub.isRentingStadium ? (
              <>Tu club abona <strong>€{userClub.stadiumRentFee.toLocaleString('es-ES')}/partido</strong> por alquiler del estadio municipal. Se recomienda construir un estadio propio en Instalaciones para erradicar este coste fijo y aumentar drásticamente el aforo.</>
            ) : (
              <>Contar con estadio propio te otorga un margen neto superior en cada partido de local. Ajustar la entrada según el rendimiento deportivo garantizará el superávit continuo del club.</>
            )}
          </p>
        </div>
      </div>
    </section>
  );
};
