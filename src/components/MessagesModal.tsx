import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { X, Mail, CheckCircle2, XCircle, Handshake, AlertTriangle, ShieldCheck, Trophy, Award, Building2, Clock, Trash2 } from 'lucide-react';
import { GameMessage } from '../types';
import { SponsorLogo } from './SponsorLogo';

interface MessagesModalProps {
  onClose: () => void;
}

export const MessagesModal: React.FC<MessagesModalProps> = ({ onClose }) => {
  const { messages, markMessageAsRead, acceptSponsorOffer, rejectSponsorOffer, proposals, approveProposal, rejectProposal, renegotiateProposal, userClub, deleteMessage, clearReadMessages } = useGame();
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);

  const selectedMessage = messages.find(m => m.id === selectedMessageId) || null;

  // Check if there is an active transfer proposal linked to current message or selected
  const activeProposal = proposals.length > 0 ? proposals[0] : null;

  const calculateSuccessChance = () => {
    if (!userClub || !userClub.dt) return 50;
    const dt = userClub.dt;
    let divBonus = userClub.divisionId === 'div1' ? 15 : (userClub.divisionId === 'div2' ? 5 : 0);
    const repBonus = Math.round((dt.reputation - 50) * 0.4);
    const moraleBonus = Math.round((dt.morale - 50) * 0.2);
    return Math.min(85, Math.max(25, 50 + repBonus + divBonus + moraleBonus));
  };

  const handleSelectMessage = (msg: GameMessage) => {
    setSelectedMessageId(msg.id);
    if (!msg.read) {
      markMessageAsRead(msg.id);
    }
  };

  const formatCurrency = (val: number) => '€' + val.toLocaleString('es-ES');

  const getPlacementBadge = (placement: string) => {
    switch (placement) {
      case 'CHEST':
        return { label: 'Pecho (Equipación)', color: '#2563eb', bg: 'rgba(37, 99, 235, 0.1)' };
      case 'SLEEVE':
        return { label: 'Manga Camiseta', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' };
      case 'STADIUM':
        return { label: 'Vallas / Estadio', color: '#16a34a', bg: 'rgba(22, 163, 74, 0.1)' };
      case 'DIGITAL':
        return { label: 'Redes y Web', color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.1)' };
      default:
        return { label: placement, color: '#64748b', bg: '#f1f5f9' };
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.65)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(4px)',
      padding: '1rem'
    }}>
      <div className="modal-container" onClick={e => e.stopPropagation()} style={{
        width: '100%',
        maxWidth: '920px',
        height: '82vh',
        backgroundColor: 'var(--bg-card)',
        borderRadius: '16px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
        border: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '1.2rem 1.5rem',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-input)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'rgba(37, 99, 235, 0.15)',
              color: '#3b82f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Mail size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Centro de Mensajes
              </h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Comunicaciones oficiales de patrocinadores, renovaciones y directiva
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            {messages.some(m => m.read) && (
              <button
                onClick={clearReadMessages}
                className="btn"
                style={{
                  padding: '0.4rem 0.75rem',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  background: 'rgba(239, 68, 68, 0.1)',
                  color: '#f43f5e',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  cursor: 'pointer'
                }}
                title="Eliminar todos los mensajes leídos"
              >
                <Trash2 size={14} />
                <span>Limpiar Leídos</span>
              </button>
            )}

            <button onClick={onClose} className="btn-icon" style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: '0.4rem',
              borderRadius: '50%'
            }}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Content - Split View */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Left Panel: Message List */}
          <div style={{
            width: '330px',
            borderRight: '1px solid var(--border-color)',
            overflowY: 'auto',
            background: 'var(--bg-card)'
          }}>
            {messages.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <Mail size={32} style={{ opacity: 0.3, marginBottom: '0.5rem' }} />
                <p>No tienes mensajes en la bandeja de entrada.</p>
              </div>
            ) : (
              messages.map(msg => {
                const isSelected = msg.id === selectedMessageId;
                return (
                  <div
                    key={msg.id}
                    onClick={() => handleSelectMessage(msg)}
                    style={{
                      padding: '1rem',
                      borderBottom: '1px solid var(--border-color)',
                      cursor: 'pointer',
                      background: isSelected ? 'rgba(37, 99, 235, 0.08)' : (!msg.read ? 'rgba(234, 179, 8, 0.05)' : 'transparent'),
                      borderLeft: isSelected ? '4px solid #3b82f6' : (!msg.read ? '4px solid #eab308' : '4px solid transparent'),
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: msg.senderColor || '#3b82f6',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem'
                      }}>
                        <Handshake size={14} />
                        {msg.sender}
                      </span>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                          Jornada {msg.dateWeek}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteMessage(msg.id);
                            if (isSelected) {
                              const nextMsg = messages.find(m => m.id !== msg.id);
                              setSelectedMessageId(nextMsg ? nextMsg.id : null);
                            }
                          }}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-secondary)',
                            cursor: 'pointer',
                            padding: '2px',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            opacity: 0.7
                          }}
                          title="Eliminar este mensaje"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    <h4 style={{
                      margin: '0 0 0.25rem 0',
                      fontSize: '0.9rem',
                      fontWeight: msg.read ? 600 : 800,
                      color: 'var(--text-primary)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {!msg.read && <span style={{
                        display: 'inline-block',
                        width: '7px',
                        height: '7px',
                        borderRadius: '50%',
                        background: '#eab308',
                        marginRight: '6px'
                      }}></span>}
                      {msg.title}
                    </h4>

                    <p style={{
                      margin: 0,
                      fontSize: '0.8rem',
                      color: 'var(--text-secondary)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {msg.content}
                    </p>
                  </div>
                );
              })
            )}
          </div>

          {/* Right Panel: Message Detail */}
          <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', background: 'var(--bg-main)' }}>
            {selectedMessage ? (
              <div>
                {/* Detail Header */}
                <div style={{
                  paddingBottom: '1rem',
                  marginBottom: '1.25rem',
                  borderBottom: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <span style={{
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: selectedMessage.senderColor || '#3b82f6',
                      background: 'var(--bg-input)',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '6px',
                      display: 'inline-block',
                      marginBottom: '0.5rem'
                    }}>
                      {selectedMessage.sender}
                    </span>
                    <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {selectedMessage.title}
                    </h2>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      Temporada {selectedMessage.dateSeason} | Jornada {selectedMessage.dateWeek}
                    </span>
                    <button
                      onClick={() => {
                        deleteMessage(selectedMessage.id);
                        const nextMsg = messages.find(m => m.id !== selectedMessage.id);
                        setSelectedMessageId(nextMsg ? nextMsg.id : null);
                      }}
                      style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        color: '#f43f5e',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        padding: '0.35rem 0.65rem',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem'
                      }}
                      title="Eliminar mensaje"
                    >
                      <Trash2 size={14} />
                      <span>Borrar</span>
                    </button>
                  </div>
                </div>

                {/* Message Body Text */}
                <div style={{
                  fontSize: '0.95rem',
                  color: 'var(--text-primary)',
                  lineHeight: '1.6',
                  whiteSpace: 'pre-line',
                  marginBottom: '1.5rem'
                }}>
                  {selectedMessage.content}
                </div>

                {/* Action Card: Sponsor Offer or Renewal */}
                {(selectedMessage.actionData?.type === 'SPONSOR_NEGOTIATION' || selectedMessage.actionData?.type === 'SPONSOR_RENEWAL') && selectedMessage.actionData.sponsor && (
                  <div style={{
                    background: 'var(--bg-card)',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    border: '1px solid var(--border-color)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        <SponsorLogo sponsor={selectedMessage.actionData.sponsor} size={48} />
                        <div>
                          <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                            {selectedMessage.actionData.sponsor.name}
                          </h4>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            {selectedMessage.actionData.sponsor.industry}
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <span style={{
                          padding: '0.3rem 0.65rem',
                          borderRadius: '20px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          color: '#ca8a04',
                          background: 'rgba(234, 179, 8, 0.12)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}>
                          <Clock size={13} />
                          {selectedMessage.actionData.sponsor.contractSeasons} {selectedMessage.actionData.sponsor.contractSeasons === 1 ? 'Temporada' : 'Temporadas'}
                        </span>

                        {(() => {
                          const b = getPlacementBadge(selectedMessage.actionData.sponsor.placement);
                          return (
                            <span style={{
                              padding: '0.3rem 0.65rem',
                              borderRadius: '20px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              color: b.color,
                              background: b.bg
                            }}>
                              {b.label}
                            </span>
                          );
                        })()}
                      </div>
                    </div>

                    {/* Proposal Financial Grid */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: '0.75rem',
                      marginBottom: '1.25rem',
                      background: 'var(--bg-input)',
                      padding: '0.85rem',
                      borderRadius: '8px'
                    }}>
                      <div>
                        <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Pago Fijo Semanal</span>
                        <strong style={{ fontSize: '1.05rem', color: '#16a34a' }}>
                          {formatCurrency(selectedMessage.actionData.sponsor.baseWeeklyPay)} / sem
                        </strong>
                      </div>

                      <div>
                        <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Premio Cumplimiento</span>
                        <strong style={{ fontSize: '1.05rem', color: '#2563eb' }}>
                          +{formatCurrency(selectedMessage.actionData.sponsor.bonusReward)}
                        </strong>
                      </div>

                      <div>
                        <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Penalización Incumplimiento</span>
                        <strong style={{ fontSize: '1.05rem', color: '#dc2626' }}>
                          -{formatCurrency(selectedMessage.actionData.sponsor.penaltyFine)}
                        </strong>
                      </div>
                    </div>

                    {/* Objective Box */}
                    <div style={{
                      background: 'rgba(234, 179, 8, 0.1)',
                      border: '1px solid rgba(234, 179, 8, 0.3)',
                      borderRadius: '8px',
                      padding: '0.85rem 1rem',
                      marginBottom: '1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem'
                    }}>
                      <Trophy size={20} style={{ color: '#ca8a04', flexShrink: 0 }} />
                      <div>
                        <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#ca8a04', textTransform: 'uppercase' }}>
                          Requisito Revelado del Contrato
                        </span>
                        <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {selectedMessage.actionData.sponsor.objective.description}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => rejectSponsorOffer(selectedMessage.id)}
                        className="btn"
                        style={{
                          padding: '0.6rem 1.25rem',
                          background: 'rgba(220, 38, 38, 0.1)',
                          color: '#dc2626',
                          border: '1px solid rgba(220, 38, 38, 0.3)',
                          borderRadius: '8px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem'
                        }}
                      >
                        <XCircle size={17} />
                        Rechazar Oferta
                      </button>

                      <button
                        onClick={() => acceptSponsorOffer(selectedMessage.id)}
                        className="btn btn-primary"
                        style={{
                          padding: '0.6rem 1.5rem',
                          borderRadius: '8px',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem'
                        }}
                      >
                        <CheckCircle2 size={17} />
                        Aceptar Contrato ({selectedMessage.actionData.sponsor.contractSeasons} {selectedMessage.actionData.sponsor.contractSeasons === 1 ? 'Temp' : 'Temps'})
                      </button>
                    </div>
                  </div>
                )}

                {/* Action Card: DT Transfer Proposal (BUY / SELL) */}
                {activeProposal && (
                  <div style={{
                    background: 'var(--bg-card)',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    marginTop: '1.25rem',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '10px',
                          background: activeProposal.type === 'BUY' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                          color: activeProposal.type === 'BUY' ? '#10b981' : '#f59e0b',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 900,
                          fontSize: '1.1rem'
                        }}>
                          {activeProposal.player.position}
                        </div>
                        <div>
                          <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                            {activeProposal.type === 'BUY' ? 'Fichaje Propuesto' : 'Venta Propuesta'}: {activeProposal.player.name}
                          </h4>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            {activeProposal.player.ovr} OVR | {activeProposal.player.age} años | Valor: {formatCurrency(activeProposal.player.value)}
                          </span>
                        </div>
                      </div>

                      <span style={{
                        padding: '0.3rem 0.65rem',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        color: activeProposal.type === 'BUY' ? '#10b981' : '#f59e0b',
                        background: activeProposal.type === 'BUY' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)'
                      }}>
                        {activeProposal.type === 'BUY' ? 'Propuesta Fichaje' : 'Propuesta Venta'}
                      </span>
                    </div>

                    {/* Financial details */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '0.75rem',
                      marginBottom: '1rem',
                      background: 'var(--bg-input)',
                      padding: '0.85rem',
                      borderRadius: '8px'
                    }}>
                      <div>
                        <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Precio Traspaso</span>
                        <strong style={{ fontSize: '1.1rem', color: activeProposal.type === 'BUY' ? '#f43f5e' : '#10b981' }}>
                          {formatCurrency(activeProposal.transferFee)}
                        </strong>
                      </div>
                      <div>
                        <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Ficha / Sueldo Anual</span>
                        <strong style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                          {formatCurrency(activeProposal.offeredSalary)} / año
                        </strong>
                      </div>
                    </div>

                    {/* DT Notes */}
                    {activeProposal.notes && (
                      <div style={{
                        background: 'rgba(59, 130, 246, 0.08)',
                        border: '1px solid rgba(59, 130, 246, 0.25)',
                        borderRadius: '8px',
                        padding: '0.75rem',
                        marginBottom: '1.25rem',
                        fontSize: '0.85rem',
                        color: 'var(--text-primary)'
                      }}>
                        💡 <strong>Nota del DT:</strong> {activeProposal.notes}
                      </div>
                    )}

                    {/* Action Buttons with Renegotiate */}
                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => rejectProposal(activeProposal.id)}
                        className="btn"
                        style={{
                          padding: '0.6rem 1rem',
                          background: 'rgba(244, 63, 94, 0.1)',
                          color: '#f43f5e',
                          border: '1px solid rgba(244, 63, 94, 0.3)',
                          borderRadius: '8px',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        <XCircle size={16} />
                        Rechazar
                      </button>

                      <button
                        onClick={() => renegotiateProposal(activeProposal.id)}
                        className="btn"
                        style={{
                          padding: '0.6rem 1.1rem',
                          background: 'rgba(245, 158, 11, 0.12)',
                          color: '#ca8a04',
                          border: '1px solid rgba(245, 158, 11, 0.4)',
                          borderRadius: '8px',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem'
                        }}
                        title={`Pedir al DT que negocié un precio mejor (Éxito estimado: ${calculateSuccessChance()}%)`}
                      >
                        <Handshake size={16} />
                        Pedir Renegociar al DT ({calculateSuccessChance()}% éxito)
                      </button>

                      <button
                        onClick={() => approveProposal(activeProposal.id)}
                        className="btn btn-primary"
                        style={{
                          padding: '0.6rem 1.25rem',
                          borderRadius: '8px',
                          fontWeight: 800,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem'
                        }}
                      >
                        <CheckCircle2 size={16} />
                        Aceptar Traspaso
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <Mail size={44} style={{ color: 'var(--text-secondary)', marginBottom: '0.85rem', opacity: 0.4 }} />
                <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Bandeja de Entrada
                </h4>
                <p style={{ margin: 0, fontSize: '0.82rem', maxWidth: '320px', lineHeight: '1.4' }}>
                  Selecciona cualquier mensaje de la lista izquierda para abrir y leer su contenido.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

