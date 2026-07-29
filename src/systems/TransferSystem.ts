import { Club, Player, Position, TransferProposal } from '../types';
import { getRandomPlayerName, calculateBalancedPlayerValueAndSalary } from '../data/namesData';

export interface PlayerWillingness {
  status: 'HIGH' | 'MEDIUM' | 'LOW' | 'REFUSE';
  label: string;
  reason: string;
  salaryMultiplier: number;
}

export interface DtScoutingNeed {
  position: Position;
  reason: string;
  avgOvr: number;
}

export class TransferSystem {
  /**
   * Calculates player willingness to join a team based on player's OVR vs Club Division level
   * divLevel: 1 = Primera, 2 = Segunda, 3 = Tercera
   */
  static calculateWillingness(player: Player, divLevel: number): PlayerWillingness {
    const ovr = player.ovr;

    if (divLevel === 3) { // Tercera División
      if (ovr <= 70) {
        return {
          status: 'HIGH',
          label: 'Alta Disposición',
          reason: 'El jugador ve con excelentes ojos unirse a tu proyecto deportivo en 3ª División.',
          salaryMultiplier: 1.0
        };
      } else if (ovr <= 74) {
        return {
          status: 'MEDIUM',
          label: 'Exige Prima de Sueldo',
          reason: 'El jugador considera que la 3ª División está al límite de su categoría. Exigirá un 25% más de sueldo.',
          salaryMultiplier: 1.25
        };
      } else {
        return {
          status: 'REFUSE',
          label: 'Inalcanzable (Cat. Insuficiente)',
          reason: `El jugador (${ovr} OVR) rechaza categóricamente jugar en 3ª División por considerar que está muy por debajo de su nivel profesional.`,
          salaryMultiplier: 99.0
        };
      }
    } else if (divLevel === 2) { // Segunda División
      if (ovr <= 78) {
        return {
          status: 'HIGH',
          label: 'Alta Disposición',
          reason: 'El jugador está motivado para competir en LaLiga Hypermotion con tu club.',
          salaryMultiplier: 1.0
        };
      } else if (ovr <= 82) {
        return {
          status: 'MEDIUM',
          label: 'Exige Prima de Sueldo',
          reason: 'El jugador proviene o aspira a 1ª División. Aceptará si le ofreces un sueldo un 20% superior.',
          salaryMultiplier: 1.20
        };
      } else {
        return {
          status: 'REFUSE',
          label: 'Inalcanzable (Exige 1ª Div)',
          reason: `El jugador (${ovr} OVR) sólo acepta traspasos a clubes de Primera División con aspiraciones continentales.`,
          salaryMultiplier: 99.0
        };
      }
    } else { // Primera División (level 1)
      if (ovr <= 87) {
        return {
          status: 'HIGH',
          label: 'Alta Disposición',
          reason: 'El jugador está fascinado por la oportunidad de vestir la camiseta en 1ª División.',
          salaryMultiplier: 1.0
        };
      } else {
        return {
          status: 'MEDIUM',
          label: 'Fichaje de Élite',
          reason: 'Figura internacional de máximo nivel. Requiere oferta salarial alta y proyecto ambicioso.',
          salaryMultiplier: 1.15
        };
      }
    }
  }

  /**
   * Generates dynamic pool of Free Agents and lower/mid division market players
   */
  static generateMarketPlayersPool(): Player[] {
    const positions: Position[] = ['POR', 'DFC', 'LI', 'LD', 'MCD', 'MC', 'MCO', 'EI', 'ED', 'DC'];
    const extraPlayers: Player[] = [];

    // 1. Agentes Libres (Sin equipo - €0 Traspaso) for 3rd and 2nd division budgets
    for (let i = 0; i < 25; i++) {
      const pos = positions[Math.floor(Math.random() * positions.length)];
      const age = 19 + Math.floor(Math.random() * 16);
      const ovr = 52 + Math.floor(Math.random() * 20); // 52 to 72 OVR
      const potential = ovr + Math.floor(Math.random() * 8);
      const { salary } = calculateBalancedPlayerValueAndSalary(ovr, age, potential);

      extraPlayers.push({
        id: `free_agent_${Date.now()}_${i}`,
        name: getRandomPlayerName(),
        clubId: '', // Free agent!
        position: pos,
        age,
        ovr,
        potential,
        value: 0, // Free agent €0 transfer fee
        salary: Math.round(salary * 0.85),
        contractYears: 2,
        morale: 80,
        isYouthTalent: false
      });
    }

    // 2. Jugadores Económicos en Mercado (OVR 55 - 75)
    for (let i = 0; i < 30; i++) {
      const pos = positions[Math.floor(Math.random() * positions.length)];
      const age = 18 + Math.floor(Math.random() * 14);
      const ovr = 55 + Math.floor(Math.random() * 20); // 55 to 75 OVR
      const potential = ovr + Math.floor(Math.random() * 10);
      const { value, salary } = calculateBalancedPlayerValueAndSalary(ovr, age, potential);

      extraPlayers.push({
        id: `market_gen_${Date.now()}_${i}`,
        name: getRandomPlayerName(),
        clubId: `ai_club_${Math.floor(Math.random() * 10)}`,
        position: pos,
        age,
        ovr,
        potential,
        value,
        salary,
        contractYears: 2 + Math.floor(Math.random() * 3),
        morale: 85
      });
    }

    return extraPlayers;
  }

  /**
   * Analyzes user squad weaknesses and returns proactive DT recommendations
   */
  static analyzeSquadNeeds(squad: Player[]): DtScoutingNeed[] {
    const positions: Position[] = ['POR', 'DFC', 'LI', 'LD', 'MCD', 'MC', 'MCO', 'EI', 'ED', 'DC'];
    const needs: DtScoutingNeed[] = [];

    positions.forEach(pos => {
      const posSquad = squad.filter(p => p.position === pos);
      if (posSquad.length === 0) {
        needs.push({
          position: pos,
          reason: `No tenemos ningún jugador natural en la posición de ${pos}. ¡Prioridad Máxima!`,
          avgOvr: 0
        });
      } else {
        const avg = posSquad.reduce((sum, p) => sum + p.ovr, 0) / posSquad.length;
        if (avg < 72) {
          needs.push({
            position: pos,
            reason: `La posición de ${pos} tiene un nivel medio bajo (${Math.round(avg)} OVR).`,
            avgOvr: Math.round(avg)
          });
        }
      }
    });

    needs.sort((a, b) => a.avgOvr - b.avgOvr);
    return needs.slice(0, 3);
  }

  /**
   * Generates DT recommendations for transfer tab
   */
  static generateDtRecommendations(
    club: Club,
    squad: Player[],
    marketPlayers: Player[],
    divLevel: number
  ): { targetPlayer: Player; fee: number; salary: number; reason: string }[] {
    if (!club.dt) return [];

    const needs = this.analyzeSquadNeeds(squad);
    const recommendations: { targetPlayer: Player; fee: number; salary: number; reason: string }[] = [];

    needs.forEach(need => {
      const candidates = marketPlayers.filter(p => {
        if (p.clubId === club.id) return false;
        if (p.position !== need.position) return false;

        const willingness = this.calculateWillingness(p, divLevel);
        if (willingness.status === 'REFUSE') return false;

        const fee = p.clubId === '' ? 0 : p.value;
        const maxBudget = club.dtTransferBudget > 0 ? club.dtTransferBudget * 1.4 : club.budget * 0.4;
        return fee <= maxBudget;
      });

      if (candidates.length > 0) {
        // Pick best candidate
        candidates.sort((a, b) => b.ovr - a.ovr);
        const best = candidates[0];
        const fee = best.clubId === '' ? 0 : Math.round(best.value * (0.9 + Math.random() * 0.15));
        const willingness = this.calculateWillingness(best, divLevel);
        const salary = Math.round(best.salary * willingness.salaryMultiplier * 1.1);

        recommendations.push({
          targetPlayer: best,
          fee,
          salary,
          reason: `Analizado por el DT ${club.dt?.name || 'técnico'}: ${need.reason} ${best.name} (${best.ovr} OVR) encaja perfectamente.`
        });
      }
    });

    return recommendations;
  }
}
