import React, { createContext, useContext, useState, useEffect } from 'react';
import { Club, Player, Match, Standing, TransferProposal, WeeklyFinancialSummary, ManagerDT, Division, GameMessage, ActiveSponsorContract, Sponsor } from '../types';
import { SPANISH_DIVISIONS, INITIAL_CLUBS } from '../data/spanishLeagues';
import { INITIAL_PLAYERS } from '../data/laligaPlayers';
import { EconomySystem } from '../systems/EconomySystem';
import { MatchSimulationSystem } from '../systems/MatchSimulationSystem';
import { AgingSystem } from '../systems/AgingSystem';
import { AVAILABLE_MANAGERS } from '../data/availableManagers';
import { ALL_SPONSORS, getMaxSponsorsForDivision, getAvailableSponsorsForDivision } from '../data/sponsorsData';
import { TransferSystem } from '../systems/TransferSystem';
import { ToastMessage } from '../components/NotificationToast';
import { ImportantModalData } from '../components/ImportantEventModal';
import { getRandomPlayerName, getRandomContractYears, calculateBalancedPlayerValueAndSalary } from '../data/namesData';
import { MatchdayLiveModal } from '../components/MatchdayLiveModal';
import { OffseasonHubModal } from '../components/OffseasonHubModal';
import { PresidentEventModal } from '../components/PresidentEventModal';
import { TrophyRoomModal } from '../components/TrophyRoomModal';
import { PRESIDENT_EVENTS, PresidentEvent, PresidentEventOption } from '../data/presidentEvents';

interface GameContextType {
  presidentName: string;
  isOnboarded: boolean;
  currentSeason: string;
  currentWeek: number;
  divisions: Division[];
  userClub: Club | null;
  clubs: Club[];
  players: Player[];
  matches: Match[];
  standings: Standing[];
  proposals: TransferProposal[];
  weeklyFinances: WeeklyFinancialSummary | null;
  lastMatch: Match | null;
  availableManagers: ManagerDT[];
  activeTab: string;
  toasts: ToastMessage[];
  importantModal: ImportantModalData | null;
  themeMode: 'dark' | 'light';

  messages: GameMessage[];
  unreadMessagesCount: number;
  isMessagesModalOpen: boolean;

  openMessagesModal: () => void;
  closeMessagesModal: () => void;
  markMessageAsRead: (messageId: string) => void;
  deleteMessage: (messageId: string) => void;
  clearReadMessages: () => void;
  negotiateSponsor: (sponsorId: string) => void;
  acceptSponsorOffer: (messageId: string) => void;
  rejectSponsorOffer: (messageId: string) => void;
  cancelSponsorContract: (contractId: string) => void;
  updateSociosSettings: (membershipFee: number, ticketDiscountPercent: number, merchDiscountPercent: number) => void;
  activateSociosProgram: () => void;

  toggleTheme: () => void;
  openTrophyRoom: () => void;
  setActiveTab: (tab: string) => void;
  notify: (message: string, type?: ToastMessage['type']) => void;
  dismissToast: (id: string) => void;
  showModal: (modal: ImportantModalData) => void;
  closeModal: () => void;

  startNewGame: (presidentName: string, mode: 'EXISTING' | 'CUSTOM', selectedClubId?: string, customData?: Partial<Club>, presidentProfile?: 'empresario' | 'leyenda' | 'inversor' | 'canterano') => void;
  advanceWeek: () => void;
  updateBudgetAllocations: (transferBudget: number, renewalBudget: number) => void;
  updateTicketPrice: (price: number) => void;
  renameStadium: (newName: string) => void;
  upgradeFacility: (facilityType: 'stadium' | 'training' | 'youth' | 'vip' | 'museum') => void;
  buildOwnedStadium: () => void;
  hireManager: (dt: ManagerDT) => void;
  fireManager: () => void;
  renewManagerContract: () => void;
  isTransferWindowOpen: boolean;
  renegotiateProposal: (proposalId: string) => void;
  approveProposal: (proposalId: string) => void;
  rejectProposal: (proposalId: string) => void;
  buyPlayerDirectly: (player: Player) => void;
  submitCustomOffer: (player: Player, transferFee: number, salary: number, years: number) => void;
  listPlayerForSale: (playerId: string, askingPrice: number) => void;
  removeFromTransferList: (playerId: string) => void;
  respondToIncomingOffer: (proposalId: string, action: 'ACCEPT' | 'REJECT' | 'COUNTER', counterFee?: number) => void;
  renewPlayerContract: (playerId: string, years: number) => void;
  releasePlayer: (playerId: string) => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [presidentName, setPresidentName] = useState<string>('');
  const [isOnboarded, setIsOnboarded] = useState<boolean>(false);
  const [currentSeason, setCurrentSeason] = useState('2024/25');
  const [currentWeek, setCurrentWeek] = useState(1);
  const [clubs, setClubs] = useState<Club[]>(INITIAL_CLUBS);
  const [players, setPlayers] = useState<Player[]>(INITIAL_PLAYERS);
  const [userClubId, setUserClubId] = useState<string>('');
  const [matches, setMatches] = useState<Match[]>([]);
  const [proposals, setProposals] = useState<TransferProposal[]>([]);
  const [lastMatch, setLastMatch] = useState<Match | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [availableManagers, setAvailableManagers] = useState<ManagerDT[]>(AVAILABLE_MANAGERS);
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>('dark');

  // Matchday, Offseason, President Event and Trophy Room Modals State
  const [isMatchdayModalOpen, setIsMatchdayModalOpen] = useState(false);
  const [isOffseasonModalOpen, setIsOffseasonModalOpen] = useState(false);
  const [offseasonData, setOffseasonData] = useState<{ seasonEnded: string; nextSeason: string } | null>(null);
  const [isPresidentEventModalOpen, setIsPresidentEventModalOpen] = useState(false);
  const [currentPresidentEvent, setCurrentPresidentEvent] = useState<PresidentEvent | null>(null);
  const [isTrophyRoomModalOpen, setIsTrophyRoomModalOpen] = useState(false);

  const openTrophyRoom = () => setIsTrophyRoomModalOpen(true);

  const handleSelectPresidentEventOption = (opt: PresidentEventOption) => {
    if (!userClubId) return;
    setClubs(prev => prev.map(c => {
      if (c.id === userClubId) {
        return {
          ...c,
          budget: Math.max(0, c.budget + (opt.moneyChange || 0)),
          dtTransferBudget: Math.max(0, c.dtTransferBudget + (opt.dtTransferBudgetChange || 0)),
          fanApproval: Math.min(100, Math.max(0, (c.fanApproval || 90) + (opt.fanApprovalChange || 0))),
          dt: c.dt ? {
            ...c.dt,
            morale: Math.min(100, Math.max(0, c.dt.morale + (opt.dtMoraleChange || 0)))
          } : c.dt
        };
      }
      return c;
    }));

    setIsPresidentEventModalOpen(false);
    notify(`🏛️ Decisión directiva: ${opt.effectLabel}`, 'info');
  };

  const toggleTheme = () => {
    setThemeMode(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      return next;
    });
  };

  const handlePlayFriendlyMatch = (opponentName: string, prize: number) => {
    if (!userClubId) return;
    setClubs(prev => prev.map(c => c.id === userClubId ? {
      ...c,
      budget: c.budget + prize,
      fans: c.fans + 350
    } : c));
    notify(`⚽ ¡Partido Amistoso disputado! Tesorería: +€${prize.toLocaleString('es-ES')} | +350 nuevos fans.`, 'success');
  };

  // Notification states
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [importantModal, setImportantModal] = useState<ImportantModalData | null>(null);

  // Messages and Sponsors state
  const [messages, setMessages] = useState<GameMessage[]>([]);
  const [isMessagesModalOpen, setIsMessagesModalOpen] = useState<boolean>(false);

  const unreadMessagesCount = messages.filter(m => !m.read).length;

  const divisions = SPANISH_DIVISIONS;
  const userClub = clubs.find(c => c.id === userClubId) || null;
  const squad = players.filter(p => p.clubId === userClubId);

  const nextMatch = userClub ? matches.find(m => m.week === currentWeek && (m.homeTeamId === userClub.id || m.awayTeamId === userClub.id)) : null;
  const isHomeMatch = nextMatch ? nextMatch.homeTeamId === userClub?.id : true;

  const standings = userClub ? MatchSimulationSystem.calculateStandings(
    clubs.filter(c => c.divisionId === userClub.divisionId),
    matches
  ) : [];

  const weeklyFinances = userClub ? EconomySystem.calculateWeeklyFinances(userClub, squad, isHomeMatch) : null;

  const openMessagesModal = () => setIsMessagesModalOpen(true);
  const closeMessagesModal = () => setIsMessagesModalOpen(false);

  const markMessageAsRead = (messageId: string) => {
    setMessages(prev => prev.map(m => m.id === messageId ? { ...m, read: true } : m));
  };

  const negotiateSponsor = (sponsorId: string) => {
    if (!userClub) return;

    const sponsor = ALL_SPONSORS.find(s => s.id === sponsorId);
    if (!sponsor) return;

    const currentDiv = divisions.find(d => d.id === userClub.divisionId);
    const divLevel = currentDiv ? currentDiv.level : 3;

    if (sponsor.tier < divLevel) {
      notify(`El patrocinador ${sponsor.name} solo negocia con clubes de categorías superiores.`, 'error');
      return;
    }

    const maxActive = getMaxSponsorsForDivision(divLevel);
    const currentActiveCount = userClub.activeSponsors?.length || 0;
    if (currentActiveCount >= maxActive) {
      notify(`Tu club ha alcanzado el límite máximo de ${maxActive} patrocinadores en ${currentDiv?.name || 'tu división'}.`, 'warning');
      return;
    }

    if (sponsor.requiresOwnedStadium && userClub.isRentingStadium) {
      notify(`Este patrocinador exige presencia en Estadio Propio. Debes construir tu estadio primero.`, 'error');
      return;
    }

    const activePlacements = (userClub.activeSponsors || []).map(c => c.sponsor.placement);
    if (activePlacements.includes(sponsor.placement)) {
      notify(`Ya tienes un patrocinador activo ocupando la ubicación de ${sponsor.placement}.`, 'warning');
      return;
    }

    const alreadyPending = messages.some(m => m.actionData?.sponsorId === sponsorId);
    if (alreadyPending) {
      notify(`Ya tienes una propuesta pendiente de ${sponsor.name} en tu Centro de Mensajes.`, 'info');
      openMessagesModal();
      return;
    }

    const newMsg: GameMessage = {
      id: `msg_sp_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      sender: sponsor.name,
      senderColor: sponsor.brandColor,
      title: `Propuesta Comercial: ${sponsor.name}`,
      content: `Estimado Presidente ${presidentName || 'Presidente'},\n\nNos ponemos en contacto desde la dirección de ${sponsor.name} (${sponsor.industry}). Queremos formalizar una propuesta de patrocinio para el club en la ubicación de ${sponsor.placement}.\n\nTérminos contractuales:\n• Pago fijo semanal: €${sponsor.baseWeeklyPay.toLocaleString('es-ES')}/semana\n• Requisito de la temporada: ${sponsor.objective.description}\n• Bonificación por objetivo: +€${sponsor.bonusReward.toLocaleString('es-ES')}\n• Penalización por incumplimiento: -€${sponsor.penaltyFine.toLocaleString('es-ES')}\n\nQuedamos a la espera de su respuesta en esta bandeja de mensajes.`,
      dateWeek: currentWeek,
      dateSeason: currentSeason,
      type: 'SPONSOR_OFFER',
      read: false,
      actionData: {
        type: 'SPONSOR_NEGOTIATION',
        sponsorId: sponsor.id,
        sponsor: sponsor
      }
    };

    setMessages(prev => [newMsg, ...prev]);
    notify(`📩 Propuesta de ${sponsor.name} recibida en tu Centro de Mensajes.`, 'success');
    openMessagesModal();
  };

  const acceptSponsorOffer = (messageId: string) => {
    const msg = messages.find(m => m.id === messageId);
    if (!msg || !msg.actionData || !msg.actionData.sponsor || !userClub) return;

    const sponsor = msg.actionData.sponsor;
    const currentDiv = divisions.find(d => d.id === userClub.divisionId);
    const divLevel = currentDiv ? currentDiv.level : 3;
    const maxActive = getMaxSponsorsForDivision(divLevel);
    const currentActiveCount = userClub.activeSponsors?.length || 0;

    if (currentActiveCount >= maxActive) {
      notify(`No puedes firmar más patrocinadores (Límite: ${maxActive}).`, 'error');
      return;
    }

    const currentStanding = standings.find(s => s.clubId === userClub.id);
    const contractSeasons = sponsor.contractSeasons || 1;

    const newContract: ActiveSponsorContract = {
      id: `cont_${Date.now()}`,
      sponsorId: sponsor.id,
      sponsor,
      signedWeek: currentWeek,
      signedSeason: currentSeason,
      weeksRemaining: sponsor.contractWeeks * contractSeasons,
      totalSeasons: contractSeasons,
      seasonsRemaining: contractSeasons,
      startWins: currentStanding ? currentStanding.won : 0,
      startGoals: currentStanding ? currentStanding.gf : 0,
      isObjectiveMet: false
    };

    setClubs(prev => prev.map(c => c.id === userClub.id ? {
      ...c,
      activeSponsors: [...(c.activeSponsors || []), newContract]
    } : c));

    setMessages(prev => prev.filter(m => m.id !== messageId));
    notify(`¡Acuerdo firmado! ${sponsor.name} es ahora patrocinador oficial por ${contractSeasons} ${contractSeasons === 1 ? 'temporada' : 'temporadas'}.`, 'success');
  };

  const rejectSponsorOffer = (messageId: string) => {
    setMessages(prev => prev.filter(m => m.id !== messageId));
    notify('Propuesta de patrocinio rechazada.', 'info');
  };

  const deleteMessage = (messageId: string) => {
    setMessages(prev => prev.filter(m => m.id !== messageId));
    notify('Mensaje eliminado.', 'info');
  };

  const clearReadMessages = () => {
    setMessages(prev => prev.filter(m => !m.read));
    notify('Mensajes leídos eliminados.', 'info');
  };

  const cancelSponsorContract = (contractId: string) => {
    if (!userClub) return;
    const contract = (userClub.activeSponsors || []).find(c => c.id === contractId);
    if (!contract) return;

    const penaltyFee = Math.round(contract.sponsor.penaltyFine * 0.5);
    if (userClub.budget < penaltyFee) {
      notify(`Necesitas €${penaltyFee.toLocaleString('es-ES')} para abonar la rescisión del contrato.`, 'error');
      return;
    }

    setClubs(prev => prev.map(c => c.id === userClub.id ? {
      ...c,
      budget: c.budget - penaltyFee,
      activeSponsors: (c.activeSponsors || []).filter(sc => sc.id !== contractId)
    } : c));

    notify(`Contrato con ${contract.sponsor.name} rescindido. Cláusula abonada: €${penaltyFee.toLocaleString('es-ES')}.`, 'warning');
  };

  const updateSociosSettings = (fee: number, ticketDiscount: number, merchDiscount: number) => {
    if (!userClub) return;

    setClubs(prev => prev.map(c => {
      if (c.id === userClub.id) {
        let baseRate = 0.08;
        if (fee <= 3) baseRate += 0.04;
        else if (fee >= 7) baseRate -= 0.03;

        if (ticketDiscount >= 50) baseRate += 0.03;
        if (merchDiscount >= 30) baseRate += 0.02;

        const newConversion = Math.max(0.02, Math.min(0.25, baseRate));
        const newSociosCount = Math.round(c.fans * newConversion);

        notify("Configuración del Programa de Socios actualizada.", 'success');

        return {
          ...c,
          sociosData: {
            isProgramActive: true,
            membershipFee: fee,
            ticketDiscountPercent: ticketDiscount,
            merchDiscountPercent: merchDiscount,
            sociosCount: newSociosCount,
            conversionRate: newConversion
          }
        };
      }
      return c;
    }));
  };

  const activateSociosProgram = () => {
    if (!userClub) return;
    if (userClub.fans < 10000) {
      notify("Se requieren al menos 10.000 aficionados para inaugurar la masa de socios del club.", 'warning');
      return;
    }

    setClubs(prev => prev.map(c => {
      if (c.id === userClub.id) {
        const currentData = c.sociosData || {
          membershipFee: 4,
          ticketDiscountPercent: 50,
          merchDiscountPercent: 15,
          sociosCount: Math.round(c.fans * 0.08),
          conversionRate: 0.08
        };

        return {
          ...c,
          sociosData: {
            ...currentData,
            isProgramActive: true,
            sociosCount: Math.max(100, Math.round(c.fans * currentData.conversionRate))
          }
        };
      }
      return c;
    }));

    notify("🎉 ¡Programa de Socios inaugurado oficialmente! Se han emitido los primeros carnés de abonados.", 'success');
  };

  const notify = (message: string, type: ToastMessage['type'] = 'info') => {
    const id = `t_${Date.now()}_${Math.random()}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const showModal = (modal: ImportantModalData) => {
    setImportantModal(modal);
  };

  const closeModal = () => {
    setImportantModal(null);
  };

  const generateAllDivisionFixtures = (allClubs: Club[]): Match[] => {
    let allFixtures: Match[] = [];
    SPANISH_DIVISIONS.forEach(div => {
      const divClubs = allClubs.filter(c => c.divisionId === div.id);
      const divFixtures = MatchSimulationSystem.generateSeasonFixtures(divClubs, div.id, div.name);
      allFixtures = [...allFixtures, ...divFixtures];
    });
    return allFixtures;
  };

  const startNewGame = (pName: string, mode: 'EXISTING' | 'CUSTOM', selectedClubId?: string, customData?: Partial<Club>, profile: 'empresario' | 'leyenda' | 'inversor' | 'canterano' = 'empresario') => {
    setPresidentName(pName);

    const targetId = mode === 'EXISTING' ? selectedClubId! : `custom_${Date.now()}`;

    if (mode === 'EXISTING' && selectedClubId) {
      setUserClubId(selectedClubId);
      const generated = generateAllDivisionFixtures(clubs);
      setMatches(generated);
    } else if (mode === 'CUSTOM' && customData) {
      const customClubId = targetId;
      const newCustomClub: Club = {
        id: customClubId,
        divisionId: 'div3',
        name: customData.name || 'Mi Club FC',
        shortName: customData.name || 'Mi Club',
        abbr: (customData.abbr || 'MCF').toUpperCase().slice(0, 3),
        logo: undefined,
        stadium: 'Campo Municipal (Alquilado)',
        stadiumCapacity: 1500,
        isRentingStadium: true,
        stadiumRentFee: 2500,
        fans: 1200,
        budget: 350000,
        color1: customData.color1 || '#2563eb',
        color2: customData.color2 || '#ffffff',
        ticketPrice: 12,
        trainingLevel: 1,
        youthLevel: 1,
        dtTransferBudget: 80000,
        dtRenewalBudget: 50000,
        fanApproval: 90,
        dt: null
      };

      const posArray: Player['position'][] = ['POR', 'POR', 'DFC', 'DFC', 'DFC', 'LI', 'LD', 'MCD', 'MC', 'MC', 'MCO', 'EI', 'ED', 'DC', 'DC', 'DC'];
      const starterSquad: Player[] = posArray.map((pos, idx) => {
        const age = 18 + Math.floor(Math.random() * 10);
        const ovr = 54 + Math.floor(Math.random() * 8);
        const potential = ovr + 6 + Math.floor(Math.random() * 8);
        const { value, salary } = calculateBalancedPlayerValueAndSalary(ovr, age, potential);
        const contractYears = (idx % 5) + 1;

        return {
          id: `p_cust_${idx}_${Date.now()}`,
          name: getRandomPlayerName(),
          clubId: customClubId,
          position: pos,
          age,
          ovr,
          potential,
          value,
          salary,
          contractYears,
          xp: Math.floor(Math.random() * 25),
          morale: 85
        };
      });

      const updatedClubs = [newCustomClub, ...clubs];
      setClubs(updatedClubs);
      setPlayers(prev => [...prev, ...starterSquad]);
      setUserClubId(customClubId);

      const generated = generateAllDivisionFixtures(updatedClubs);
      setMatches(generated);
    }

    // Apply Presidential Profile Bonuses to the user club
    setClubs(prev => prev.map(c => {
      if (c.id === targetId) {
        let budgetBonus = c.budget;
        let fanApprovalBonus = c.fanApproval;
        let dtBudgetBonus = c.dtTransferBudget;
        let youthBonus = c.youthLevel;

        if (profile === 'empresario') {
          budgetBonus = Math.round(c.budget * 1.15); // +15% starting budget
        } else if (profile === 'leyenda') {
          fanApprovalBonus = 95; // 95% starting approval
        } else if (profile === 'inversor') {
          budgetBonus = Math.round(c.budget * 1.25); // +25% starting budget
          dtBudgetBonus = Math.round(c.dtTransferBudget * 1.25);
        } else if (profile === 'canterano') {
          youthBonus = Math.max(c.youthLevel, 2); // Youth level 2
        }

        return {
          ...c,
          dt: null,
          presidentProfile: profile,
          budget: budgetBonus,
          fanApproval: fanApprovalBonus,
          dtTransferBudget: dtBudgetBonus,
          youthLevel: youthBonus
        };
      }
      return c;
    }));

    // Send urgent hiring message
    const welcomeDtMsg: GameMessage = {
      id: `msg_dt_urgent_hire_${Date.now()}`,
      sender: "Junta Directiva",
      senderColor: "#ef4444",
      title: "⚠️ URGENTE: Contratación de Director Técnico (DT)",
      content: `Estimado Presidente ${pName},\n\nBienvenido a la dirección del club. Actualmente el equipo NO cuenta con un Director Técnico oficial.\n\nPara poder estructurar tácticas, analizar la plantilla y operar profesionalmente en el mercado de fichajes, debes contratar a un entrenador en el apartado "Director Técnico".`,
      dateWeek: 1,
      dateSeason: '2024/25',
      type: 'GENERAL',
      read: false
    };
    setMessages([welcomeDtMsg]);

    setIsOnboarded(true);
    notify(`¡Presidencia iniciada con éxito! Bienvenido, ${pName}.`, 'success');
  };

  const advanceWeek = () => {
    if (!userClub) return;

    // Block advancing week without a hired Manager (DT)
    if (!userClub.dt) {
      notify('⚠️ Bloqueado: No puedes avanzar la jornada sin un Director Técnico oficial contratado.', 'error');
      showModal({
        title: '⚠️ Sin Director Técnico Contratado',
        description: 'El club no puede disputar la jornada sin un entrenador oficial al frente del banquillo.\n\nPor favor, dirígete al panel de "Director Técnico" y contrata a un estratega para comenzar la competición.',
        badge: 'Obligación Institucional',
        buttonText: 'Ir a Contratar DT'
      });
      setActiveTab('manager');
      return;
    }

    const currentWeekMatches = matches.filter(m => m.week === currentWeek && !m.played);
    let updatedMatches = [...matches];
    let currentPlayers = [...players];
    let userMatchResult: Match | null = null;
    let userHomeFanChange = 0;
    let userAwayFanChange = 0;
    let isHomeMatch = false;

    currentWeekMatches.forEach(match => {
      const matchDivId = match.divisionId || userClub.divisionId;
      const matchDivClubs = clubs.filter(c => c.divisionId === matchDivId);
      const { updatedMatch, updatedPlayers, homeFanChange, awayFanChange } = MatchSimulationSystem.simulateMatch(match, matchDivClubs, currentPlayers);
      currentPlayers = updatedPlayers;
      const index = updatedMatches.findIndex(m => m.id === match.id);
      if (index !== -1) updatedMatches[index] = updatedMatch;

      if (updatedMatch.homeTeamId === userClub.id) {
        userMatchResult = updatedMatch;
        userHomeFanChange = homeFanChange;
        isHomeMatch = true;
      } else if (updatedMatch.awayTeamId === userClub.id) {
        userMatchResult = updatedMatch;
        userAwayFanChange = awayFanChange;
        isHomeMatch = false;
      }
    });

    setMatches(updatedMatches);
    setPlayers(currentPlayers);
    if (userMatchResult) {
      setLastMatch(userMatchResult);
      setIsMatchdayModalOpen(true);
    }

    // President Event trigger: Every 3 weeks
    if (currentWeek > 1 && currentWeek % 3 === 0 && Math.random() < 0.75) {
      const randomEvt = PRESIDENT_EVENTS[Math.floor(Math.random() * PRESIDENT_EVENTS.length)];
      setCurrentPresidentEvent(randomEvt);
      setIsPresidentEventModalOpen(true);
    }

    const userSquad = currentPlayers.filter(p => p.clubId === userClub.id);
    const userWeeklyFinances = EconomySystem.calculateWeeklyFinances(userClub, userSquad, isHomeMatch);

    setClubs(prev => prev.map(c => {
      if (c.id === userClub.id) {
        const net = userWeeklyFinances.netTotal;
        const fanDelta = isHomeMatch ? userHomeFanChange : userAwayFanChange;
        const newFans = Math.max(500, c.fans + fanDelta);

        const sData = c.sociosData || {
          membershipFee: 4,
          ticketDiscountPercent: 50,
          merchDiscountPercent: 15,
          sociosCount: Math.round(newFans * 0.08),
          conversionRate: 0.08
        };

        const updatedSociosCount = Math.round(newFans * sData.conversionRate);

        return {
          ...c,
          budget: Math.max(0, c.budget + net),
          fans: newFans,
          sociosData: {
            ...sData,
            sociosCount: updatedSociosCount
          }
        };
      }
      return c;
    }));

    // Spontaneous sponsor outreach: Every 5 weeks with 50% chance
    if (currentWeek > 1 && currentWeek % 5 === 0 && Math.random() < 0.55) {
      const currentDiv = divisions.find(d => d.id === userClub.divisionId);
      const divLevel = currentDiv ? currentDiv.level : 3;
      const available = getAvailableSponsorsForDivision(divLevel);

      const activeSponsorIds = (userClub.activeSponsors || []).map(a => a.sponsorId);
      const pendingSponsorIds = messages.map(m => m.actionData?.sponsorId).filter(Boolean);
      const activePlacements = (userClub.activeSponsors || []).map(a => a.sponsor.placement);

      const candidateSponsors = available.filter((s: Sponsor) =>
        !activeSponsorIds.includes(s.id) &&
        !pendingSponsorIds.includes(s.id) &&
        !activePlacements.includes(s.placement) &&
        (!s.requiresOwnedStadium || !userClub.isRentingStadium)
      );

      if (candidateSponsors.length > 0) {
        const spontaneousSponsor = candidateSponsors[Math.floor(Math.random() * candidateSponsors.length)];
        const spontaneousMsg: GameMessage = {
          id: `msg_spont_${Date.now()}`,
          sender: spontaneousSponsor.name,
          senderColor: spontaneousSponsor.brandColor,
          title: `¡Oferta Espontánea! ${spontaneousSponsor.name} te busca`,
          content: `Estimado Presidente ${presidentName || 'Presidente'},\n\nHemos estado siguiendo el rendimiento de tu equipo esta temporada. La dirección comercial de ${spontaneousSponsor.name} (${spontaneousSponsor.industry}) ha tomado la iniciativa de presentarte una oferta directa de patrocinio en la ubicación de ${spontaneousSponsor.placement}.\n\nTérminos ofrecidos:\n• Pago semanal fijo: €${spontaneousSponsor.baseWeeklyPay.toLocaleString('es-ES')}/semana\n• Duración: ${spontaneousSponsor.contractSeasons || 1} ${(spontaneousSponsor.contractSeasons || 1) === 1 ? 'temporada' : 'temporadas'}\n\nAbre la propuesta para conocer los requisitos exigidos.`,
          dateWeek: currentWeek,
          dateSeason: currentSeason,
          type: 'SPONSOR_OFFER',
          read: false,
          actionData: {
            type: 'SPONSOR_NEGOTIATION',
            sponsorId: spontaneousSponsor.id,
            sponsor: spontaneousSponsor
          }
        };
        setMessages(prev => [spontaneousMsg, ...prev]);
        notify(`📩 ¡${spontaneousSponsor.name} te busca! Te ha enviado una propuesta de patrocinio directa.`, 'info');
      }
    }

    // Active DT Communication System
    if (userClub.dt) {
      const dt = userClub.dt;

      // 1. Post-Match Report Message
      if (userMatchResult) {
        const m = userMatchResult as Match;
        const isWin = (isHomeMatch && (m.homeScore || 0) > (m.awayScore || 0)) || (!isHomeMatch && (m.awayScore || 0) > (m.homeScore || 0));
        const isDraw = m.homeScore === m.awayScore;
        const oppId = isHomeMatch ? m.awayTeamId : m.homeTeamId;
        const opponent = clubs.find(c => c.id === oppId)?.name || 'el rival';

        let msgTitle = `Informe DT: Derrota en la Jornada ${currentWeek}`;
        let msgContent = `Estimado Presidente ${presidentName || 'Presidente'},\n\nAsumo la responsabilidad táctica tras caer ante ${opponent}. Necesitamos intensificar los entrenamientos y corregir desajustes en la zaga defensiva.`;
        let msgColor = '#ef4444';

        if (isWin) {
          msgTitle = `Informe DT: ¡Victoria en la Jornada ${currentWeek}!`;
          msgContent = `Estimado Presidente ${presidentName || 'Presidente'},\n\n¡Enhorabuena! El equipo ha logrado una importante victoria ante ${opponent}. El planteamiento táctico funcionó a la perfección y los jugadores mostraron máxima entrega.`;
          msgColor = '#10b981';
        } else if (isDraw) {
          msgTitle = `Informe DT: Empate en la Jornada ${currentWeek}`;
          msgContent = `Estimado Presidente,\n\nHemos sumado un punto disputado frente a ${opponent}. Aunque el equipo compitió bien, hay aspectos de definición que debemos pulir para los próximos encuentros.`;
          msgColor = '#f59e0b';
        }

        const matchReportMsg: GameMessage = {
          id: `msg_dt_match_${currentWeek}_${Date.now()}`,
          sender: `DT ${dt.name}`,
          senderColor: msgColor,
          title: msgTitle,
          content: msgContent,
          dateWeek: currentWeek,
          dateSeason: currentSeason,
          type: 'GENERAL',
          read: false
        };

        setMessages(prev => [matchReportMsg, ...prev]);
      }

      // 2. Budget Alert Request during Transfer Window
      const transferWindowActive = (currentWeek >= 1 && currentWeek <= 6) || (currentWeek >= 19 && currentWeek <= 23);

      if (transferWindowActive && (userClub.dtTransferBudget || 0) < 60000 && (currentWeek === 2 || currentWeek === 20)) {
        const budgetAlertMsg: GameMessage = {
          id: `msg_dt_budget_alert_${currentWeek}_${Date.now()}`,
          sender: `DT ${dt.name}`,
          senderColor: '#f59e0b',
          title: `⚠️ Solicitud de Presupuesto: Fondos Insuficientes`,
          content: `Estimado Presidente ${presidentName || 'Presidente'},\n\nLe escribo para informarle que el Fondo Delegado para Fichajes (€${(userClub.dtTransferBudget || 0).toLocaleString('es-ES')}) resulta muy ajustado para competir en este mercado.\n\nLe solicito aumentar la partida asignada al DT en el panel de Finanzas para poder cerrar refuerzos de garantías.`,
          dateWeek: currentWeek,
          dateSeason: currentSeason,
          type: 'GENERAL',
          read: false
        };
        setMessages(prev => [budgetAlertMsg, ...prev]);
      }

      // 3. Transfer Window End Report
      if (currentWeek === 7 || currentWeek === 24) {
        const endWindowMsg: GameMessage = {
          id: `msg_dt_end_window_${currentWeek}_${Date.now()}`,
          sender: `DT ${dt.name}`,
          senderColor: '#3b82f6',
          title: `📋 Balance de Cierre del Mercado de Fichajes`,
          content: `Estimado Presidente,\n\nHa concluido la ventana de transferencias. La plantilla queda configurada con ${userSquad.length} futbolistas. Afrontamos el calendario enfocados 100% en conseguir los objetivos marcados.`,
          dateWeek: currentWeek,
          dateSeason: currentSeason,
          type: 'GENERAL',
          read: false
        };
        setMessages(prev => [endWindowMsg, ...prev]);
      }

      // 4. High Frequency Spontaneous Transfer Proposals (75% chance per week in Transfer Window)
      if (transferWindowActive && Math.random() < 0.75) {
        const isBuyProposal = Math.random() < 0.6;
        if (isBuyProposal && (userClub.dtTransferBudget || 0) > 30000) {
          const otherPlayers = currentPlayers.filter(p => p.clubId !== userClub.id && p.value <= (userClub.dtTransferBudget || 0) * 1.3);
          if (otherPlayers.length > 0) {
            const targetPlayer = otherPlayers[Math.floor(Math.random() * otherPlayers.length)];
            const proposedFee = Math.round(targetPlayer.value * (0.9 + Math.random() * 0.2));
            const proposedSalary = Math.round(targetPlayer.salary * (1.1 + Math.random() * 0.15));

            const propId = `prop_buy_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
            const newProp: TransferProposal = {
              id: propId,
              player: targetPlayer,
              fromClubId: targetPlayer.clubId,
              toClubId: userClub.id,
              transferFee: proposedFee,
              offeredSalary: proposedSalary,
              type: 'BUY',
              status: 'PENDING',
              notes: `Propuesta del DT ${dt.name} para reforzar el equipo en la posición de ${targetPlayer.position}.`
            };

            setProposals(prev => [newProp, ...prev]);

            const dtMsg: GameMessage = {
              id: `msg_dt_prop_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
              sender: `DT ${dt.name}`,
              senderColor: '#3b82f6',
              title: `Propuesta de Fichaje: ${targetPlayer.name} (${targetPlayer.position})`,
              content: `Estimado Presidente ${presidentName || 'Presidente'},\n\nTras evaluar nuestra plantilla, sugiero incorporar a ${targetPlayer.name} (${targetPlayer.ovr} OVR, ${targetPlayer.position}).\n\n• Precio de traspaso: €${proposedFee.toLocaleString('es-ES')}\n• Ficha ofrecida: €${proposedSalary.toLocaleString('es-ES')}/año\n\nPuedes aceptar, rechazar o pedirme renegociar las condiciones en el buzón.`,
              dateWeek: currentWeek,
              dateSeason: currentSeason,
              type: 'GENERAL',
              read: false
            };
            setMessages(prev => [dtMsg, ...prev]);
            notify(`📋 El DT ${dt.name} te ha enviado una propuesta de fichaje por ${targetPlayer.name}.`, 'info');
          }
        } else if (!isBuyProposal && userSquad.length > 14) {
          const surplusCandidates = userSquad.filter(p => p.ovr < 76 && p.contractYears <= 2);
          if (surplusCandidates.length > 0) {
            const sellCandidate = surplusCandidates[Math.floor(Math.random() * surplusCandidates.length)];
            const offeredFee = Math.round(sellCandidate.value * (0.85 + Math.random() * 0.3));

            const propId = `prop_sell_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
            const newProp: TransferProposal = {
              id: propId,
              player: sellCandidate,
              fromClubId: userClub.id,
              toClubId: 'other_buyer',
              transferFee: offeredFee,
              offeredSalary: sellCandidate.salary,
              type: 'SELL',
              status: 'PENDING',
              notes: `Oferta conseguida por el DT ${dt.name} para ingresar dinero por ${sellCandidate.name}.`
            };

            setProposals(prev => [newProp, ...prev]);

            const dtMsg: GameMessage = {
              id: `msg_dt_sell_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
              sender: `DT ${dt.name}`,
              senderColor: '#f59e0b',
              title: `Oferta de Venta: ${sellCandidate.name}`,
              content: `Estimado Presidente,\n\nHemos recibido una oferta de €${offeredFee.toLocaleString('es-ES')} por ${sellCandidate.name} (${sellCandidate.position}). Recomiendo cerrar la venta para aumentar la tesorería del club.`,
              dateWeek: currentWeek,
              dateSeason: currentSeason,
              type: 'GENERAL',
              read: false
            };
            setMessages(prev => [dtMsg, ...prev]);
            notify(`📋 Oferta recibida por ${sellCandidate.name}: €${offeredFee.toLocaleString('es-ES')}.`, 'info');
          }
        }
      }

      // Check for incoming bids on user's transfer-listed players
      const listedPlayers = userSquad.filter(p => p.isTransferListed);
      if (listedPlayers.length > 0) {
        listedPlayers.forEach(p => {
          if (Math.random() < 0.40) {
            const asking = p.askingPrice || p.value;
            const offerFee = Math.round(asking * (0.9 + Math.random() * 0.2));
            const buyerClubNames = ['Sevilla FC', 'Real Betis', 'Valencia CF', 'Rayo Vallecano', 'RCD Espanyol', 'Getafe CF', 'Real Oviedo', 'Real Zaragoza', 'RC Deportivo'];
            const buyerName = buyerClubNames[Math.floor(Math.random() * buyerClubNames.length)];

            const propId = `incoming_bid_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
            const newProp: TransferProposal = {
              id: propId,
              player: p,
              fromClubId: userClub.id,
              toClubId: 'ai_buyer',
              transferFee: offerFee,
              offeredSalary: p.salary,
              type: 'SELL',
              status: 'PENDING',
              isIncomingOffer: true,
              buyerClubName: buyerName,
              notes: `Oferta formal de ${buyerName} por ${p.name}.`
            };

            setProposals(prev => [newProp, ...prev]);

            const msg: GameMessage = {
              id: `msg_bid_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
              sender: buyerName,
              senderColor: '#3b82f6',
              title: `📩 Oferta Entrante: ${buyerName} quiere a ${p.name}`,
              content: `El club ${buyerName} ha presentado una oferta de traspaso formal de €${offerFee.toLocaleString('es-ES')} por ${p.name} (${p.position}, ${p.ovr} OVR).\n\nPuedes aceptar, rechazar o contraofertar en la pestaña de Negociaciones.`,
              dateWeek: currentWeek,
              dateSeason: currentSeason,
              type: 'GENERAL',
              read: false
            };
            setMessages(prev => [msg, ...prev]);
            notify(`📩 ¡Oferta entrante de ${buyerName} por ${p.name}: €${offerFee.toLocaleString('es-ES')}!`, 'success');
          }
        });
      }
    }

    if (currentWeek >= 38) {
      processSeasonEnd(updatedMatches);
    } else {
      setCurrentWeek(prev => prev + 1);
    }
  };

  const processSeasonEnd = (seasonMatches: Match[]) => {
    const { updatedPlayers, retiredPlayers, newYouth } = AgingSystem.processSeasonEnd(players, userClub?.youthLevel || 1);
    const formattedYouth = newYouth.map(y => ({ ...y, clubId: userClubId }));
    setPlayers([...updatedPlayers, ...formattedYouth]);

    // Calculate standings for all 3 divisions
    const div1Clubs = clubs.filter(c => c.divisionId === 'div1');
    const div2Clubs = clubs.filter(c => c.divisionId === 'div2');
    const div3Clubs = clubs.filter(c => c.divisionId === 'div3');

    const div1Matches = seasonMatches.filter(m => m.divisionId === 'div1');
    const div2Matches = seasonMatches.filter(m => m.divisionId === 'div2');
    const div3Matches = seasonMatches.filter(m => m.divisionId === 'div3');

    const div1Standings = MatchSimulationSystem.calculateStandings(div1Clubs, div1Matches);
    const div2Standings = MatchSimulationSystem.calculateStandings(div2Clubs, div2Matches);
    const div3Standings = MatchSimulationSystem.calculateStandings(div3Clubs, div3Matches);

    // Evaluate active sponsor contracts at season end
    let sponsorNetBonus = 0;
    const remainingActiveSponsors: ActiveSponsorContract[] = [];

    if (userClub && userClub.activeSponsors && userClub.activeSponsors.length > 0) {
      let evalSummary = "";
      userClub.activeSponsors.forEach(contract => {
        const obj = contract.sponsor.objective;
        let divStandings = div3Standings;
        if (userClub.divisionId === 'div1') divStandings = div1Standings;
        else if (userClub.divisionId === 'div2') divStandings = div2Standings;

        const userStanding = divStandings.find(s => s.clubId === userClub.id);
        const totalWins = userStanding ? userStanding.won : 0;
        const totalGoals = userStanding ? userStanding.gf : 0;
        const rank = divStandings.findIndex(s => s.clubId === userClub.id) + 1;

        let isMet = false;
        if (obj.type === 'WINS') isMet = totalWins >= obj.targetValue;
        else if (obj.type === 'GOALS') isMet = totalGoals >= obj.targetValue;
        else if (obj.type === 'TOP_RANK') isMet = rank > 0 && rank <= obj.targetValue;
        else if (obj.type === 'STADIUM_CAPACITY') isMet = userClub.stadiumCapacity >= obj.targetValue;

        const seasonsLeft = (contract.seasonsRemaining || 1) - 1;

        if (seasonsLeft > 0) {
          // Contract continues for next season
          remainingActiveSponsors.push({
            ...contract,
            seasonsRemaining: seasonsLeft,
            weeksRemaining: 38 * seasonsLeft
          });
          evalSummary += `\n• ${contract.sponsor.name}: Contrato multianual en vigor (${seasonsLeft} temp restante).`;
        } else {
          // Contract expired this season
          if (isMet) {
            sponsorNetBonus += contract.sponsor.bonusReward;
            evalSummary += `\n• ${contract.sponsor.name}: ¡OBJETIVO CUMPLIDO! Bonus: +€${contract.sponsor.bonusReward.toLocaleString('es-ES')}`;

            // Send Renewal proposal with +15% pay boost
            const renewedSponsor: Sponsor = {
              ...contract.sponsor,
              baseWeeklyPay: Math.round(contract.sponsor.baseWeeklyPay * 1.15),
              bonusReward: Math.round(contract.sponsor.bonusReward * 1.15)
            };

            const renewalMsg: GameMessage = {
              id: `msg_sp_renew_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
              sender: contract.sponsor.name,
              senderColor: contract.sponsor.brandColor,
              title: `Propuesta de Renovación: ${contract.sponsor.name}`,
              content: `Estimado Presidente ${presidentName || 'Presidente'},\n\nTras el excelente rendimiento y haber cumplido los objetivos, en ${contract.sponsor.name} queremos renovar nuestro contrato de patrocinio por ${renewedSponsor.contractSeasons || 1} ${(renewedSponsor.contractSeasons || 1) === 1 ? 'temporada' : 'temporadas'}.\n\nOfrecemos un incremento del +15% en el pago fijo (€${renewedSponsor.baseWeeklyPay.toLocaleString('es-ES')}/semana).\n\n¿Aceptas la renovación?`,
              dateWeek: 38,
              dateSeason: currentSeason,
              type: 'SPONSOR_RENEWAL',
              read: false,
              actionData: {
                type: 'SPONSOR_RENEWAL',
                sponsorId: renewedSponsor.id,
                sponsor: renewedSponsor
              }
            };
            setMessages(prev => [renewalMsg, ...prev]);

          } else {
            sponsorNetBonus -= contract.sponsor.penaltyFine;
            evalSummary += `\n• ${contract.sponsor.name}: INCUMPLIDO. Penalización: -€${contract.sponsor.penaltyFine.toLocaleString('es-ES')}`;

            // Send Farewell notice
            const farewellMsg: GameMessage = {
              id: `msg_sp_farewell_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
              sender: contract.sponsor.name,
              senderColor: contract.sponsor.brandColor,
              title: `Comunicado de Fin de Contrato: ${contract.sponsor.name}`,
              content: `Estimado Presidente,\n\nAl no haberse alcanzado los objetivos deportivos pactados esta temporada, desde la directiva de ${contract.sponsor.name} notificamos la no renovación de nuestro acuerdo de patrocinio. Agradecemos el esfuerzo y aplicamos la clausula de ajuste fijada.`,
              dateWeek: 38,
              dateSeason: currentSeason,
              type: 'SPONSOR_RESULT',
              read: false
            };
            setMessages(prev => [farewellMsg, ...prev]);
          }
        }
      });

      if (evalSummary) {
        const resultMsg: GameMessage = {
          id: `msg_sp_res_${Date.now()}`,
          sender: "Auditoría de Patrocinios",
          senderColor: "#3b82f6",
          title: `Balance Final de Sponsors (${currentSeason})`,
          content: `Resumen de metas de patrocinio al cierre de temporada:${evalSummary}\n\nAjuste neto abonado a tesorería: ${sponsorNetBonus >= 0 ? '+' : ''}€${sponsorNetBonus.toLocaleString('es-ES')}.`,
          dateWeek: 38,
          dateSeason: currentSeason,
          type: 'SPONSOR_RESULT',
          read: false
        };
        setMessages(prev => [resultMsg, ...prev]);
      }
    }

    const div3Promoted = div3Standings.slice(0, 3).map(s => s.clubId);
    const div2Relegated = div2Standings.slice(-3).map(s => s.clubId);
    const div2Promoted = div2Standings.slice(0, 3).map(s => s.clubId);
    const div1Relegated = div1Standings.slice(-3).map(s => s.clubId);

    // Apply promotions & relegations
    const updatedClubs = clubs.map(c => {
      let newDivId = c.divisionId;

      if (c.divisionId === 'div3' && div3Promoted.includes(c.id)) {
        newDivId = 'div2';
      } else if (c.divisionId === 'div2') {
        if (div2Promoted.includes(c.id)) newDivId = 'div1';
        else if (div2Relegated.includes(c.id)) newDivId = 'div3';
      } else if (c.divisionId === 'div1' && div1Relegated.includes(c.id)) {
        newDivId = 'div2';
      }

      // Preserve active multi-season contracts for user club
      return { ...c, divisionId: newDivId, activeSponsors: c.id === userClub?.id ? remainingActiveSponsors : c.activeSponsors };
    });

    let prizeMoney = sponsorNetBonus;
    let rewardTitle = `Fin de Temporada ${currentSeason}`;
    let rewardMessage = `Avanzamos a la siguiente temporada.\n• Jugadores retirados: ${retiredPlayers.length}\n• Canteranos promocionados: ${newYouth.length}`;

    if (userClub) {
      let userStandings: Standing[] = [];
      if (userClub.divisionId === 'div1') userStandings = div1Standings;
      else if (userClub.divisionId === 'div2') userStandings = div2Standings;
      else if (userClub.divisionId === 'div3') userStandings = div3Standings;

      const userRank = userStandings.findIndex(s => s.clubId === userClub.id) + 1;
      const prevDiv = userClub.divisionId;

      if (prevDiv === 'div3') {
        if (userRank <= 3) {
          prizeMoney += 3000000;
          rewardTitle = "¡ASCENSO CONSEGUIDO A 2ª DIVISIÓN!";
          rewardMessage += `\n\n¡Felicidades! Has terminado #${userRank} en 3ª División y el club ASCIENDE oficialmente a LaLiga Hypermotion (2ª Div).\nPremio por ascenso: €3.000.000.`;
        } else {
          rewardTitle = "Fin de Temporada en 3ª División";
          rewardMessage += `\n\nPosición final: #${userRank}. Permaneces en 3ª División para la próxima temporada.`;
        }
      } else if (prevDiv === 'div2') {
        if (userRank <= 3) {
          prizeMoney += 10000000;
          rewardTitle = "¡HISTÓRICO ASCENSO A 1ª DIVISIÓN!";
          rewardMessage += `\n\n¡Hazaña Cumplida! Has terminado #${userRank} en 2ª División y ASCIENDES a LaLiga EA Sports (1ª Div).\nPremio institucional: €10.000.000.`;
        } else if (userRank >= 18) {
          rewardTitle = "DESCENSO DE CATEGORÍA";
          rewardMessage += `\n\nAviso: Al finalizar en la posición #${userRank} de 2ª División, el club DESCIENDE a 3ª División.`;
        } else {
          rewardTitle = "Permanencia en 2ª División";
          rewardMessage += `\n\nPosición final: #${userRank}. El club se mantiene en LaLiga Hypermotion.`;
        }
      } else if (prevDiv === 'div1') {
        if (userRank === 1) {
          prizeMoney += 25000000;
          rewardTitle = "¡CAMPEÓN DE LALIGA EA SPORTS!";
          rewardMessage += `\n\n¡Título de Campeón! El club se corona Rey de España.\nPremio de Campeón: €25.000.000.`;
        } else if (userRank >= 18) {
          rewardTitle = "DESCENSO A 2ª DIVISIÓN";
          rewardMessage += `\n\nDescenso: Al finalizar en la posición #${userRank} en 1ª División, el club desciende a 2ª División.`;
        } else {
          const rankPrize = Math.max(0, (21 - userRank) * 500000);
          prizeMoney += rankPrize;
          rewardTitle = "Temporada Completada en 1ª División";
          rewardMessage += `\n\nPosición final: #${userRank} en LaLiga EA Sports.\nIngreso por mérito de televisión/liga: €${rankPrize.toLocaleString('es-ES')}.`;
        }
      }

      setClubs(prev => prev.map(c => c.id === userClub.id ? {
        ...c,
        budget: Math.max(0, c.budget + prizeMoney),
        divisionId: updatedClubs.find(uc => uc.id === c.id)?.divisionId || c.divisionId,
        activeSponsors: []
      } : c));
    } else {
      setClubs(updatedClubs);
    }

    showModal({
      title: rewardTitle,
      description: rewardMessage,
      badge: "Balance de Temporada",
      buttonText: "Comenzar Nueva Temporada"
    });

    const newFixtures = generateAllDivisionFixtures(updatedClubs);
    setMatches(newFixtures);

    setCurrentWeek(1);
    const nextSeasonYear = parseInt(currentSeason.split('/')[0]) + 1;
    const nextSeasonStr = `${nextSeasonYear}/${(nextSeasonYear + 1).toString().slice(2)}`;
    
    setOffseasonData({
      seasonEnded: currentSeason,
      nextSeason: nextSeasonStr
    });
    setIsOffseasonModalOpen(true);
    setCurrentSeason(nextSeasonStr);
  };

  const updateBudgetAllocations = (transferBudget: number, renewalBudget: number) => {
    setClubs(prev => prev.map(c => {
      if (c.id === userClubId) {
        const totalDelegated = transferBudget + renewalBudget;
        const totalBudget = Math.max(1, c.budget);
        const ratio = totalDelegated / totalBudget;

        let moraleChange = 0;
        let msg = "Presupuestos delegados al DT asignados.";
        if (ratio >= 0.35) {
          moraleChange = 8;
          msg = "Presupuesto generoso: El DT se muestra entusiasmado con los fondos asignados.";
        } else if (ratio >= 0.15) {
          moraleChange = 3;
          msg = "Presupuesto equilibrado: El DT acepta la partida presupuestaria.";
        } else {
          moraleChange = -8;
          msg = "Presupuesto reducido: El DT muestra preocupación por la falta de fondos.";
        }

        const updatedDt = c.dt ? {
          ...c.dt,
          morale: Math.min(100, Math.max(20, c.dt.morale + moraleChange))
        } : null;

        notify(msg, ratio < 0.15 ? 'info' : 'success');

        return {
          ...c,
          dtTransferBudget: transferBudget,
          dtRenewalBudget: renewalBudget,
          dt: updatedDt
        };
      }
      return c;
    }));
  };

  const updateTicketPrice = (price: number) => {
    setClubs(prev => prev.map(c => c.id === userClubId ? { ...c, ticketPrice: price } : c));
  };

  const buildOwnedStadium = () => {
    if (!userClub) return;
    const cost = 1200000;
    const reserved = (userClub.dtTransferBudget || 0) + (userClub.dtRenewalBudget || 0);
    const freeBudget = userClub.budget - reserved;

    if (freeBudget < cost) {
      if (userClub.budget >= cost) {
        notify(`Liquidez libre insuficiente (€${freeBudget.toLocaleString('es-ES')}). Tienes €${reserved.toLocaleString('es-ES')} reservados para el DT. Reduce la asignación al DT en Finanzas para liberar dinero.`, 'error');
      } else {
        notify("Necesitas €1,200,000 para construir tu primer estadio propio.", 'error');
      }
      return;
    }

    setClubs(prev => prev.map(c => c.id === userClubId ? {
      ...c,
      budget: c.budget - cost,
      stadium: `Estadio de ${c.name}`,
      stadiumCapacity: 2500,
      isRentingStadium: false,
      stadiumRentFee: 0,
      fans: c.fans + 3000
    } : c));

    showModal({
      title: "Estadio Propio Inaugurado",
      description: `¡Felicidades, Presidente ${presidentName}!\n\nTu club ha financiado exitosamente la construcción de su primer estadio propio de 2,500 localidades. Se ha eliminado el costo de alquiler municipal por partido y ahora tienes acceso a patrocinadores exclusivos de Estadio.`,
      badge: "Hito Histórico del Club",
      buttonText: "Entendido"
    });
  };

  const renameStadium = (newName: string) => {
    if (!userClub) return;
    const trimmed = newName.trim();
    if (!trimmed) {
      notify('El nombre del estadio no puede estar vacío.', 'error');
      return;
    }
    setClubs(prev => prev.map(c => c.id === userClubId ? { ...c, stadium: trimmed } : c));
    notify(`🏟️ Estadio renombrado oficialmente a "${trimmed}".`, 'success');
  };

  const upgradeFacility = (type: 'stadium' | 'training' | 'youth' | 'vip' | 'museum') => {
    if (!userClub) return;

    const reserved = (userClub.dtTransferBudget || 0) + (userClub.dtRenewalBudget || 0);
    const freeBudget = userClub.budget - reserved;

    if (type === 'stadium') {
      if (userClub.isRentingStadium) {
        buildOwnedStadium();
        return;
      }
      const cost = userClub.stadiumCapacity * 120;
      if (freeBudget < cost) {
        if (userClub.budget >= cost) {
          notify(`Liquidez libre insuficiente (€${freeBudget.toLocaleString('es-ES')}). Reduzca los fondos asignados al DT en Finanzas para liberar capital.`, 'error');
        } else {
          notify("Fondos insuficientes para ampliar el aforo del estadio.", 'error');
        }
        return;
      }
      setClubs(prev => prev.map(c => c.id === userClubId ? {
        ...c,
        budget: c.budget - cost,
        stadiumCapacity: c.stadiumCapacity + 2500,
        fans: c.fans + 5000
      } : c));
      notify("¡Estadio ampliado en +2,500 localidades!", 'success');
    } else if (type === 'training') {
      const cost = Math.round(300000 * Math.pow(1.5, userClub.trainingLevel - 1));
      if (freeBudget < cost) {
        if (userClub.budget >= cost) {
          notify(`Liquidez libre insuficiente (€${freeBudget.toLocaleString('es-ES')}). Reduzca los fondos asignados al DT en Finanzas.`, 'error');
        } else {
          notify("Fondos insuficientes para mejorar entrenamiento.", 'error');
        }
        return;
      }
      setClubs(prev => prev.map(c => c.id === userClubId ? {
        ...c,
        budget: c.budget - cost,
        trainingLevel: Math.min(10, c.trainingLevel + 1)
      } : c));
      notify("Canchas de entrenamiento mejoradas.", 'success');
    } else if (type === 'youth') {
      const cost = Math.round(400000 * Math.pow(1.6, userClub.youthLevel - 1));
      if (freeBudget < cost) {
        if (userClub.budget >= cost) {
          notify(`Liquidez libre insuficiente (€${freeBudget.toLocaleString('es-ES')}). Reduzca los fondos asignados al DT en Finanzas.`, 'error');
        } else {
          notify("Fondos insuficientes para mejorar la cantera.", 'error');
        }
        return;
      }
      setClubs(prev => prev.map(c => c.id === userClubId ? {
        ...c,
        budget: c.budget - cost,
        youthLevel: Math.min(10, c.youthLevel + 1)
      } : c));
      notify("Cantera del filial mejorada.", 'success');
    } else if (type === 'vip') {
      const currentVip = userClub.vipSuitesLevel || 0;
      if (currentVip >= 5) {
        notify("Has alcanzado el nivel máximo de Palcos VIP (Nivel 5).", 'info');
        return;
      }
      const cost = Math.round(400000 * Math.pow(1.6, currentVip));
      if (freeBudget < cost) {
        notify(`Liquidez libre insuficiente (€${freeBudget.toLocaleString('es-ES')}) para construir Palcos VIP.`, 'error');
        return;
      }
      setClubs(prev => prev.map(c => c.id === userClubId ? {
        ...c,
        budget: c.budget - cost,
        vipSuitesLevel: currentVip + 1,
        fans: c.fans + 1500
      } : c));
      notify(`🥂 Palcos VIP y Hospedaje Ejecutivo ampliado a Nivel ${currentVip + 1}.`, 'success');
    } else if (type === 'museum') {
      const currentMuseum = userClub.museumLevel || 0;
      if (currentMuseum >= 5) {
        notify("Has alcanzado el nivel máximo de Museo & Megastore (Nivel 5).", 'info');
        return;
      }
      const cost = Math.round(350000 * Math.pow(1.5, currentMuseum));
      if (freeBudget < cost) {
        notify(`Liquidez libre insuficiente (€${freeBudget.toLocaleString('es-ES')}) para ampliar el Museo del Club.`, 'error');
        return;
      }
      setClubs(prev => prev.map(c => c.id === userClubId ? {
        ...c,
        budget: c.budget - cost,
        museumLevel: currentMuseum + 1,
        fans: c.fans + 2000
      } : c));
      notify(`🏛️ Museo & Megastore Oficial mejorado a Nivel ${currentMuseum + 1}.`, 'success');
    }
  };

  const hireManager = (dt: ManagerDT) => {
    if (!userClub) return;
    setClubs(prev => prev.map(c => c.id === userClubId ? { ...c, dt } : c));
    setAvailableManagers(prev => prev.filter(m => m.id !== dt.id));

    // Send Presentation Greeting Message
    const welcomeMsg: GameMessage = {
      id: `msg_dt_presentation_${Date.now()}`,
      sender: `DT ${dt.name}`,
      senderColor: '#3b82f6',
      title: `👔 Presentación Oficial del DT ${dt.name}`,
      content: `Estimado Presidente ${presidentName || 'Presidente'},\n\nEs un verdadero honor asumir la dirección técnica de ${userClub.name}.\n\nMi filosofía táctica se basa en '${dt.style}'. Comenzaré de inmediato a analizar las virtudes de la plantilla, estructurar los entrenamientos y trabajar conjuntamente con la directiva para alcanzar los máximos objetivos.`,
      dateWeek: currentWeek,
      dateSeason: currentSeason,
      type: 'GENERAL',
      read: false
    };

    setMessages(prev => [welcomeMsg, ...prev]);
    notify(`¡${dt.name} ha sido contratado como nuevo DT del club! Mensaje de presentación recibido en el buzón.`, 'success');
  };

  const renewManagerContract = () => {
    if (!userClub || !userClub.dt) return;
    const dt = userClub.dt;

    setClubs(prev => prev.map(c => c.id === userClubId ? {
      ...c,
      dt: {
        ...c.dt!,
        morale: Math.min(100, c.dt!.morale + 15)
      }
    } : c));

    const renewalMsg: GameMessage = {
      id: `msg_dt_renew_confirm_${Date.now()}`,
      sender: `DT ${dt.name}`,
      senderColor: '#10b981',
      title: `🤝 Renovación Firmada: DT ${dt.name}`,
      content: `¡Excelente noticia Presidente ${presidentName || 'Presidente'}!\n\nHe firmado formalmente la prórroga de mi contrato para la próxima temporada. Seguimos trabajando juntos para llevar a ${userClub.name} a lo más alto.`,
      dateWeek: currentWeek,
      dateSeason: currentSeason,
      type: 'GENERAL',
      read: false
    };

    setMessages(prev => [renewalMsg, ...prev]);
    notify(`¡Contrato de ${dt.name} renovado exitosamente para la nueva temporada!`, 'success');
  };

  const fireManager = () => {
    if (!userClub || !userClub.dt) return;
    const firedDt = userClub.dt;
    const severanceFee = Math.round(firedDt.salary / 2);

    const reserved = (userClub.dtTransferBudget || 0) + (userClub.dtRenewalBudget || 0);
    const freeBudget = userClub.budget - reserved;

    if (freeBudget < severanceFee) {
      notify(`Liquidez libre insuficiente para abonar la indemnización por destitución anticipada (€${severanceFee.toLocaleString('es-ES')}). Ajusta las asignaciones presupuestarias en Finanzas.`, 'error');
      return;
    }

    setClubs(prev => prev.map(c => c.id === userClubId ? {
      ...c,
      budget: Math.max(0, c.budget - severanceFee),
      dt: null
    } : c));

    const farewellMsg: GameMessage = {
      id: `msg_dt_fire_${Date.now()}`,
      sender: `DT ${firedDt.name}`,
      senderColor: '#ef4444',
      title: `👋 Rescisión de Contrato: Despedida de ${firedDt.name}`,
      content: `Estimado Presidente,\n\nTras la decisión de la directiva de rescindir mi contrato de forma anticipada, me despido del club. Se ha abonado la indemnización correspondiente de €${severanceFee.toLocaleString('es-ES')}. Les deseo suerte para el futuro.`,
      dateWeek: currentWeek,
      dateSeason: currentSeason,
      type: 'GENERAL',
      read: false
    };

    setMessages(prev => [farewellMsg, ...prev]);
    setAvailableManagers(prev => [firedDt, ...prev]);
    notify(`Has destituido a ${firedDt.name}. Indemnización de €${severanceFee.toLocaleString('es-ES')} abonada.`, 'warning');
  };

  const isTransferWindowOpen = (currentWeek >= 1 && currentWeek <= 6) || (currentWeek >= 19 && currentWeek <= 23);

  const renegotiateProposal = (proposalId: string) => {
    const prop = proposals.find(p => p.id === proposalId);
    if (!prop || !userClub || !userClub.dt) return;

    const dt = userClub.dt;
    let divBonus = 0;
    if (userClub.divisionId === 'div1') divBonus = 15;
    if (userClub.divisionId === 'div2') divBonus = 5;

    const repBonus = Math.round((dt.reputation - 50) * 0.4);
    const moraleBonus = Math.round((dt.morale - 50) * 0.2);
    const successChance = Math.min(85, Math.max(25, 50 + repBonus + divBonus + moraleBonus));

    const roll = Math.random() * 100;
    const isSuccess = roll <= successChance;

    if (isSuccess) {
      if (prop.type === 'BUY') {
        const discountPct = 0.15 + Math.random() * 0.10;
        const newFee = Math.round(prop.transferFee * (1 - discountPct));
        const newSalary = Math.round(prop.offeredSalary * (1 - discountPct * 0.5));

        setProposals(prev => prev.map(p => p.id === proposalId ? {
          ...p,
          transferFee: newFee,
          offeredSalary: newSalary,
          isRenegotiated: true,
          notes: `¡El DT ${dt.name} negoció con éxito! Cláusula rebajada un ${Math.round(discountPct * 100)}%.`
        } : p));

        notify(`🎉 ¡Renegociación exitosa! ${dt.name} logró rebajar el fichaje de ${prop.player.name} a €${newFee.toLocaleString('es-ES')}.`, 'success');

      } else if (prop.type === 'SELL') {
        const boostPct = 0.15 + Math.random() * 0.15;
        const newFee = Math.round(prop.transferFee * (1 + boostPct));

        setProposals(prev => prev.map(p => p.id === proposalId ? {
          ...p,
          transferFee: newFee,
          isRenegotiated: true,
          notes: `¡El DT ${dt.name} sacó una mejor oferta! Precio de venta incrementado un ${Math.round(boostPct * 100)}%.`
        } : p));

        notify(`🎉 ¡Renegociación exitosa! ${dt.name} consiguió €${newFee.toLocaleString('es-ES')} por la venta de ${prop.player.name}.`, 'success');
      }
    } else {
      const breakdownRisk = Math.random() < 0.35;
      if (breakdownRisk) {
        setProposals(prev => prev.filter(p => p.id !== proposalId));
        notify(`❌ Negociación rota. El otro club retiró su propuesta por ${prop.player.name}.`, 'error');
      } else {
        setProposals(prev => prev.map(p => p.id === proposalId ? {
          ...p,
          isRenegotiated: true,
          notes: `La negociación no tuvo éxito. El otro club se mantiene firme en la cifra original.`
        } : p));
        notify(`⚠️ El otro club rechazó la contraoferta de ${dt.name}. Se mantienen los términos iniciales.`, 'warning');
      }
    }
  };

  const approveProposal = (proposalId: string) => {
    const prop = proposals.find(p => p.id === proposalId);
    if (!prop || !userClub) return;

    if (prop.type === 'BUY') {
      const dtFund = userClub.dtTransferBudget || 0;
      if (dtFund < prop.transferFee) {
        notify(`El Fondo Delegado de Fichajes del DT (€${dtFund.toLocaleString('es-ES')}) es insuficiente para pagar €${prop.transferFee.toLocaleString('es-ES')}. Incrementa la asignación al DT en la pestaña de Finanzas.`, 'error');
        return;
      }

      setClubs(prev => prev.map(c => c.id === userClubId ? {
        ...c,
        budget: Math.max(0, c.budget - prop.transferFee),
        dtTransferBudget: Math.max(0, c.dtTransferBudget - prop.transferFee)
      } : c));

      setPlayers(prev => prev.map(p => p.id === prop.player.id ? {
        ...p,
        clubId: userClubId,
        salary: prop.offeredSalary,
        contractYears: 3
      } : p));

      notify(`¡Fichaje ejecutado! ${prop.player.name} firmado. Se han consumido €${prop.transferFee.toLocaleString('es-ES')} del Fondo del DT.`, 'success');

    } else if (prop.type === 'SELL') {
      setClubs(prev => prev.map(c => c.id === userClubId ? {
        ...c,
        budget: c.budget + prop.transferFee
      } : c));

      setPlayers(prev => prev.filter(p => p.id !== prop.player.id));
      notify(`¡Venta completada! ${prop.player.name} traspasado por €${prop.transferFee.toLocaleString('es-ES')}. Ingresados en tesorería.`, 'success');

    } else if (prop.type === 'RENEW') {
      setPlayers(prev => prev.map(p => p.id === prop.player.id ? {
        ...p,
        contractYears: 3,
        salary: prop.offeredSalary
      } : p));
      notify(`Contrato renovado para ${prop.player.name}.`, 'success');
    }

    setProposals(prev => prev.filter(p => p.id !== proposalId));
  };

  const rejectProposal = (proposalId: string) => {
    setProposals(prev => prev.filter(p => p.id !== proposalId));
    notify("Propuesta descartada.", 'info');
  };

  const buyPlayerDirectly = (player: Player) => {
    if (!userClub) return;
    const reserved = (userClub.dtTransferBudget || 0) + (userClub.dtRenewalBudget || 0);
    const freeBudget = userClub.budget - reserved;

    if (freeBudget < player.value) {
      if (userClub.budget >= player.value) {
        notify(`Liquidez libre insuficiente (€${freeBudget.toLocaleString('es-ES')}). Tienes €${reserved.toLocaleString('es-ES')} reservados para el DT. Ajusta la asignación al DT en Finanzas para liberar capital.`, 'error');
      } else {
        notify(`Tesorería insuficiente para realizar el fichaje (€${player.value.toLocaleString('es-ES')}).`, 'error');
      }
      return;
    }

    setClubs(prev => prev.map(c => c.id === userClubId ? { ...c, budget: c.budget - player.value } : c));
    setPlayers(prev => prev.map(p => p.id === player.id ? { ...p, clubId: userClubId, contractYears: 3 } : p));
    notify(`¡Fichaje completado por la directiva! ${player.name} se ha incorporado.`, 'success');
  };

  const submitCustomOffer = (player: Player, transferFee: number, salary: number, years: number) => {
    if (!userClub) return;

    const userDiv = divisions.find(d => d.id === userClub.divisionId);
    const divLevel = userDiv ? userDiv.level : 3;

    // Check willingness
    const willingness = TransferSystem.calculateWillingness(player, divLevel);
    if (willingness.status === 'REFUSE') {
      notify(`❌ ${willingness.reason}`, 'error');
      return;
    }

    const isFreeAgent = player.clubId === '';
    const feeToPay = isFreeAgent ? 0 : transferFee;

    // Budget check
    const reserved = (userClub.dtTransferBudget || 0) + (userClub.dtRenewalBudget || 0);
    const freeBudget = userClub.budget - reserved;
    const availableTotal = freeBudget + (userClub.dtTransferBudget || 0);

    if (availableTotal < feeToPay) {
      notify(`Fondos insuficientes para abonar €${feeToPay.toLocaleString('es-ES')}.`, 'error');
      return;
    }

    // Evaluation logic
    const requiredSalary = Math.round(player.salary * willingness.salaryMultiplier);
    const feeAcceptable = isFreeAgent || transferFee >= player.value * 0.88;
    const salaryAcceptable = salary >= requiredSalary * 0.92;

    if (feeAcceptable && salaryAcceptable) {
      let remainingFee = feeToPay;
      let usedDtFund = Math.min(userClub.dtTransferBudget || 0, remainingFee);
      remainingFee -= usedDtFund;

      setClubs(prev => prev.map(c => c.id === userClub.id ? {
        ...c,
        budget: Math.max(0, c.budget - remainingFee),
        dtTransferBudget: Math.max(0, (c.dtTransferBudget || 0) - usedDtFund)
      } : c));

      setPlayers(prev => prev.map(p => p.id === player.id ? {
        ...p,
        clubId: userClub.id,
        salary: salary,
        contractYears: years,
        isTransferListed: false
      } : p));

      notify(`🎉 ¡Fichaje cerrado! ${player.name} firma con ${userClub.name} por ${years} ${years === 1 ? 'año' : 'años'} a €${salary.toLocaleString('es-ES')}/año.`, 'success');
    } else {
      let failMsg = "El jugador o su club han considerado insuficiente tu propuesta.";
      if (!feeAcceptable) failMsg = `El club vendedor rechaza la oferta de €${transferFee.toLocaleString('es-ES')}. Exigen al menos €${Math.round(player.value * 0.88).toLocaleString('es-ES')}.`;
      else if (!salaryAcceptable) failMsg = `El agente de ${player.name} exige un salario mínimo de €${requiredSalary.toLocaleString('es-ES')}/año.`;

      notify(`⚠️ ${failMsg}`, 'warning');
    }
  };

  const listPlayerForSale = (playerId: string, askingPrice: number) => {
    setPlayers(prev => prev.map(p => p.id === playerId ? { ...p, isTransferListed: true, askingPrice } : p));
    const target = players.find(p => p.id === playerId);
    notify(`🏷️ ${target?.name || 'El jugador'} colocado en la Lista de Transferibles por €${askingPrice.toLocaleString('es-ES')}.`, 'success');
  };

  const removeFromTransferList = (playerId: string) => {
    setPlayers(prev => prev.map(p => p.id === playerId ? { ...p, isTransferListed: false } : p));
    const target = players.find(p => p.id === playerId);
    notify(`Retirado de la lista de transferibles: ${target?.name}.`, 'info');
  };

  const respondToIncomingOffer = (proposalId: string, action: 'ACCEPT' | 'REJECT' | 'COUNTER', counterFee?: number) => {
    const prop = proposals.find(p => p.id === proposalId);
    if (!prop || !userClub) return;

    if (action === 'ACCEPT') {
      setClubs(prev => prev.map(c => c.id === userClub.id ? { ...c, budget: c.budget + prop.transferFee } : c));
      setPlayers(prev => prev.filter(p => p.id !== prop.player.id));
      setProposals(prev => prev.filter(p => p.id !== proposalId));
      notify(`💰 Venta cerrada: ${prop.player.name} traspasado por €${prop.transferFee.toLocaleString('es-ES')}. Ingresados en tesorería.`, 'success');
    } else if (action === 'REJECT') {
      setProposals(prev => prev.filter(p => p.id !== proposalId));
      notify(`Oferta por ${prop.player.name} rechazada.`, 'info');
    } else if (action === 'COUNTER' && counterFee) {
      if (counterFee <= prop.transferFee * 1.25) {
        setClubs(prev => prev.map(c => c.id === userClub.id ? { ...c, budget: c.budget + counterFee } : c));
        setPlayers(prev => prev.filter(p => p.id !== prop.player.id));
        setProposals(prev => prev.filter(p => p.id !== proposalId));
        notify(`🎉 ¡Contraoferta aceptada! Venta de ${prop.player.name} cerrada por €${counterFee.toLocaleString('es-ES')}.`, 'success');
      } else {
        setProposals(prev => prev.filter(p => p.id !== proposalId));
        notify(`❌ El comprador rechazó tu contraoferta de €${counterFee.toLocaleString('es-ES')} y retiró la propuesta.`, 'error');
      }
    }
  };

  const resetGame = () => {
    setIsOnboarded(false);
    setPresidentName('');
    setUserClubId('');
    setCurrentWeek(1);
    setCurrentSeason('2024/25');
  };

  // Auto-sanitize existing squad players and ensure free agents market pool exists
  useEffect(() => {
    setPlayers(prev => {
      let modified = false;
      const updated = prev.map((p, idx) => {
        let pName = p.name;
        let pValue = p.value;
        let pSalary = p.salary;
        let pContract = p.contractYears;

        if (pName.includes('Jugador Genérico')) {
          pName = getRandomPlayerName();
          modified = true;
        }
        if (pValue === 120000 && pSalary === 28000) {
          const balanced = calculateBalancedPlayerValueAndSalary(p.ovr, p.age, p.potential || p.ovr);
          pValue = balanced.value;
          pSalary = balanced.salary;
          modified = true;
        }
        if (!pContract || (p.clubId.startsWith('custom_') && pContract === 2 && prev.filter(x => x.clubId === p.clubId && x.contractYears === 2).length > 8)) {
          pContract = (idx % 5) + 1; // Distribute contract lengths between 1 and 5 years
          modified = true;
        }

        if (modified) {
          return {
            ...p,
            name: pName,
            value: pValue,
            salary: pSalary,
            contractYears: pContract
          };
        }
        return p;
      });

      const hasFreeAgents = updated.some(p => p.clubId === '');
      if (!hasFreeAgents) {
        const extra = TransferSystem.generateMarketPlayersPool();
        return [...updated, ...extra];
      }

      return modified ? updated : prev;
    });
  }, []);

  const renewPlayerContract = (playerId: string, years: number) => {
    setPlayers(prev => prev.map(p => p.id === playerId ? { ...p, contractYears: years } : p));
    notify(`Contrato renovado exitosamente por ${years} ${years === 1 ? 'año' : 'años'}.`, 'success');
  };

  const releasePlayer = (playerId: string) => {
    const p = players.find(x => x.id === playerId);
    setPlayers(prev => prev.filter(x => x.id !== playerId));
    notify(`El jugador ${p?.name || 'seleccionado'} ha sido desvinculado de la plantilla.`, 'info');
  };

  return (
    <GameContext.Provider value={{
      presidentName,
      isOnboarded,
      currentSeason,
      currentWeek,
      divisions,
      userClub,
      clubs,
      players,
      matches,
      standings,
      proposals,
      weeklyFinances,
      lastMatch,
      availableManagers,
      activeTab,
      toasts,
      importantModal,
      themeMode,
      messages,
      unreadMessagesCount,
      isMessagesModalOpen,
      openMessagesModal,
      closeMessagesModal,
      markMessageAsRead,
      deleteMessage,
      clearReadMessages,
      negotiateSponsor,
      acceptSponsorOffer,
      rejectSponsorOffer,
      cancelSponsorContract,
      updateSociosSettings,
      activateSociosProgram,
      toggleTheme,
      setActiveTab,
      notify,
      dismissToast,
      showModal,
      closeModal,
      startNewGame,
      advanceWeek,
      updateBudgetAllocations,
      updateTicketPrice,
      renameStadium,
      upgradeFacility,
      buildOwnedStadium,
      hireManager,
      fireManager,
      renewManagerContract,
      isTransferWindowOpen,
      renegotiateProposal,
      approveProposal,
      rejectProposal,
      buyPlayerDirectly,
      submitCustomOffer,
      listPlayerForSale,
      removeFromTransferList,
      respondToIncomingOffer,
      renewPlayerContract,
      releasePlayer,
      resetGame,
      openTrophyRoom
    }}>
      {children}

      {/* Live Matchday Simulation Modal */}
      <MatchdayLiveModal
        isOpen={isMatchdayModalOpen}
        onClose={() => setIsMatchdayModalOpen(false)}
        userMatch={lastMatch}
        weekMatches={matches.filter(m => (m.divisionId === (userClub?.divisionId || lastMatch?.divisionId)) && m.week === (lastMatch?.week || currentWeek))}
        allMatches={matches}
        clubs={clubs}
        weekNumber={lastMatch?.week || currentWeek}
        season={currentSeason}
        standings={standings}
        weeklyFinances={weeklyFinances}
        userClub={userClub}
      />

      {/* Offseason & Preseason Hub Modal */}
      <OffseasonHubModal
        isOpen={isOffseasonModalOpen}
        onClose={() => setIsOffseasonModalOpen(false)}
        seasonEnded={offseasonData?.seasonEnded || currentSeason}
        nextSeason={offseasonData?.nextSeason || currentSeason}
        userClub={userClub}
        standings={standings}
        clubs={clubs}
        players={players}
        onPlayFriendlyMatch={handlePlayFriendlyMatch}
      />

      {/* President Interactive Event Modal */}
      <PresidentEventModal
        isOpen={isPresidentEventModalOpen}
        event={currentPresidentEvent}
        onSelectOption={handleSelectPresidentEventOption}
      />

      {/* Trophy Room Modal */}
      <TrophyRoomModal
        isOpen={isTrophyRoomModalOpen}
        onClose={() => setIsTrophyRoomModalOpen(false)}
        userClub={userClub}
        standings={standings}
      />
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within GameProvider');
  return context;
};
