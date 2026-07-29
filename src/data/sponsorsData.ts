import { Sponsor } from '../types';

export interface SponsorOffer {
  id: string;
  name: string;
  category: 'LOCAL' | 'PRO' | 'GLOBAL';
  basePay: number;
  clauseDescription: string;
  bonusAmount: number;
  penaltyAmount: number;
  conditionType: 'CLEAN_SHEET' | 'VICTORIES' | 'GOALS_CONCEDED';
}

export const LOCAL_SPONSORS: SponsorOffer[] = [
  {
    id: 'sp_01',
    name: 'Panadería El Bollo de Oro',
    category: 'LOCAL',
    basePay: 22000,
    clauseDescription: 'Premio al Cerrojo: +€10.000 si mantienes la portería a 0 en 3 partidos. Penalización de -€3.000 si encajas 4+ goles.',
    bonusAmount: 10000,
    penaltyAmount: 3000,
    conditionType: 'CLEAN_SHEET'
  },
  {
    id: 'sp_02',
    name: 'Embutidos La Abuela',
    category: 'LOCAL',
    basePay: 28000,
    clauseDescription: 'Bono de Fuerza Comarcal: +€15.000 por 3 victorias seguidas. Penalización de -€4.000 si pierdes en casa.',
    bonusAmount: 15000,
    penaltyAmount: 4000,
    conditionType: 'VICTORIES'
  },
  {
    id: 'sp_03',
    name: 'Desguaces y Grúas Paco',
    category: 'LOCAL',
    basePay: 35000,
    clauseDescription: 'Filosofía Leñera: Patrocinador oficial del juego duro regional. Recompensa el compromiso en el terreno de juego.',
    bonusAmount: 8000,
    penaltyAmount: 0,
    conditionType: 'VICTORIES'
  }
];

export const ALL_SPONSORS: Sponsor[] = [
  {
    id: 'sp_global_01',
    name: 'Embutidos La Abuela',
    tier: 3,
    brandColor: '#dc2626',
    industry: 'Alimentación Regional',
    baseWeeklyPay: 3500,
    contractWeeks: 38,
    contractSeasons: 1,
    placement: 'CHEST',
    logoIcon: 'ShoppingBag',
    bonusReward: 1500,
    penaltyFine: 500,
    objective: {
      type: 'WINS',
      targetValue: 10,
      description: 'Lograr al menos 10 victorias en la temporada'
    },
    description: 'Patrocinador oficial comarcal. Exige compromiso y entrega en cada choque.'
  },
  {
    id: 'sp_global_02',
    name: 'Panadería El Bollo de Oro',
    tier: 3,
    brandColor: '#d97706',
    industry: 'Comercio Local',
    baseWeeklyPay: 2800,
    contractWeeks: 38,
    contractSeasons: 1,
    placement: 'SLEEVE',
    logoIcon: 'Sparkles',
    bonusReward: 1000,
    penaltyFine: 300,
    objective: {
      type: 'WINS',
      targetValue: 8,
      description: 'Lograr al menos 8 victorias en la temporada'
    },
    description: 'Empresa local entusiasmada con apoyar al club de la comarca.'
  },
  {
    id: 'sp_global_03',
    name: 'Desguaces Paco',
    tier: 2,
    brandColor: '#2563eb',
    industry: 'Servicios Industriales',
    baseWeeklyPay: 4200,
    contractWeeks: 38,
    contractSeasons: 2,
    placement: 'STADIUM',
    logoIcon: 'Building2',
    bonusReward: 2500,
    penaltyFine: 1000,
    objective: {
      type: 'TOP_RANK',
      targetValue: 5,
      description: 'Terminar entre los 5 primeros de la liga'
    },
    description: 'Patrocinador leñero de carácter regional.'
  }
];

export const getMaxSponsorsForDivision = (divisionLevel: number): number => {
  if (divisionLevel === 1) return 4;
  if (divisionLevel === 2) return 3;
  return 2;
};

export const getAvailableSponsorsForDivision = (divisionLevel: number): Sponsor[] => {
  return ALL_SPONSORS;
};
