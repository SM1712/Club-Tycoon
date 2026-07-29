export type Position = 'POR' | 'DFC' | 'LI' | 'LD' | 'MCD' | 'MC' | 'MCO' | 'EI' | 'ED' | 'DC';

export interface Division {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  level: number; // 1 = Primera, 2 = Segunda, 3 = Tercera
}

export interface Player {
  id: string;
  name: string;
  clubId: string;
  position: Position;
  age: number;
  ovr: number;
  potential: number;
  value: number;
  salary: number;
  contractYears: number;
  xp?: number; // Experience points for level up
  isRetiring?: boolean;
  morale?: number;
  isYouthTalent?: boolean;
  isTransferListed?: boolean;
  askingPrice?: number;
}

export interface ManagerDT {
  id: string;
  name: string;
  photo?: string;
  style: string;
  salary: number;
  reputation: number; // 1-100
  morale: number;     // 1-100
  tier?: 1 | 2 | 3;   // 1 = Primera, 2 = Segunda, 3 = Tercera
}

export interface ClubSociosData {
  isProgramActive?: boolean;
  membershipFee: number; // € per week (e.g. 4€/week)
  ticketDiscountPercent: number; // 0, 20, 50, 100 (Free)
  merchDiscountPercent: number; // 0, 15, 30, 50
  sociosCount: number;
  conversionRate: number; // 0.05 to 0.25 of total fans
}

export interface Club {
  id: string;
  divisionId: string;
  name: string;
  shortName: string;
  abbr: string;
  logo?: string;
  stadium: string;
  stadiumCapacity: number;
  isRentingStadium: boolean; // True if renting a municipal field
  stadiumRentFee: number;    // Rent cost per home match
  fans: number;
  budget: number;
  color1: string;
  color2: string;
  ticketPrice: number;
  trainingLevel: number; // 1 to 10
  youthLevel: number;    // 1 to 10
  vipSuitesLevel?: number; // 0 to 5
  museumLevel?: number;    // 0 to 5
  dtTransferBudget: number;
  dtRenewalBudget: number;
  dt: ManagerDT | null;
  fanApproval: number;   // 0-100%
  presidentProfile?: 'empresario' | 'leyenda' | 'inversor' | 'canterano';
  activeSponsors?: ActiveSponsorContract[];
  sociosData?: ClubSociosData;
}

export type SponsorTier = 3 | 2 | 1; // 3 = Tercera, 2 = Segunda, 1 = Primera
export type SponsorPlacement = 'CHEST' | 'SLEEVE' | 'STADIUM' | 'DIGITAL';

export interface SponsorObjective {
  type: 'WINS' | 'TOP_RANK' | 'GOALS' | 'STADIUM_CAPACITY';
  targetValue: number;
  description: string;
}

export interface Sponsor {
  id: string;
  name: string;
  parodyOf?: string;
  tier: SponsorTier;
  industry: string;
  description: string;
  logoIcon: string; // lucide icon identifier or visual SVG key
  brandColor: string;
  placement: SponsorPlacement;
  requiresOwnedStadium?: boolean;
  baseWeeklyPay: number;
  contractWeeks: number;
  contractSeasons: 1 | 2;
  bonusReward: number;
  penaltyFine: number;
  objective: SponsorObjective;
}

export interface ActiveSponsorContract {
  id: string;
  sponsorId: string;
  sponsor: Sponsor;
  signedWeek: number;
  signedSeason: string;
  weeksRemaining: number;
  totalSeasons: number;
  seasonsRemaining: number;
  startWins: number;
  startGoals: number;
  isObjectiveMet?: boolean;
}

export interface GameMessage {
  id: string;
  sender: string;
  senderLogo?: string;
  senderColor?: string;
  title: string;
  content: string;
  dateWeek: number;
  dateSeason: string;
  type: 'SPONSOR_OFFER' | 'SPONSOR_RESULT' | 'SPONSOR_RENEWAL' | 'GENERAL' | 'SYSTEM';
  read: boolean;
  actionData?: {
    type: 'SPONSOR_NEGOTIATION' | 'SPONSOR_RENEWAL';
    sponsorId: string;
    sponsor: Sponsor;
  };
}

export type CompetitionType = 'LEAGUE' | 'CUP' | 'SUPER_CUP' | 'INTERNATIONAL';

export interface MatchEvent {
  minute: number;
  type: 'GOAL' | 'YELLOW' | 'RED' | 'INJURY';
  playerName: string;
  teamId: string;
}

export interface Match {
  id: string;
  week: number; // Jornada / Fecha (1 a 38)
  divisionId?: string;
  competitionType?: CompetitionType;
  competitionName?: string;
  homeTeamId: string;
  awayTeamId: string;
  homeScore?: number;
  awayScore?: number;
  played: boolean;
  events: MatchEvent[];
  matchDate?: string;
  stadiumName?: string;
}

export interface Standing {
  clubId: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  pts: number;
}

export interface TransferProposal {
  id: string;
  player: Player;
  fromClubId: string;
  toClubId: string;
  transferFee: number;
  offeredSalary: number;
  type: 'BUY' | 'SELL' | 'RENEW';
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'RENEGOTIATING';
  renegotiateCount?: number;
  isRenegotiated?: boolean;
  notes?: string;
  offeredContractYears?: number;
  isIncomingOffer?: boolean;
  buyerClubName?: string;
}

export interface WeeklyFinancialSummary {
  isHomeMatch: boolean;
  estimatedAttendance: number;
  ticketIncome: number;
  jerseyIncome: number;
  merchIncome: number;
  sponsorsIncome: number;
  sociosIncome: number;
  sociosTicketDiscountLoss: number;
  sociosMerchDiscountLoss: number;
  stadiumRentExpense: number;
  dtSalaryExpense: number;
  squadSalaryExpense: number;
  maintenanceExpense: number;
  netTotal: number;
}

export interface SeasonalFinancialProjection {
  totalProjectedIncome: number;
  totalProjectedExpense: number;
  projectedNetBalance: number;
  weeklyFixedExpenses: number;
  weeklySquadSalaries: number;
  weeklyDtSalary: number;
  weeklyMaintenance: number;
  projectedHomeGateIncome: number;
  projectedJerseyMerchIncome: number;
  projectedSponsorsIncome: number;
  projectedSociosIncome: number;
  projectedStadiumRentExpense: number;
  dtAllocatedFunds: number;
  freeUnreservedBudget: number;
  healthStatus: 'HEALTHY' | 'WARNING' | 'CRITICAL';
}


