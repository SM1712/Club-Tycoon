import { Player } from '../types';
import { getRandomPlayerName, getRandomContractYears, calculateBalancedPlayerValueAndSalary } from '../data/namesData';

export class AgingSystem {
  /**
   * Process aging at season end for all players
   */
  static processSeasonEnd(players: Player[], youthFacilityLevel: number = 1): { updatedPlayers: Player[]; retiredPlayers: Player[]; newYouth: Player[] } {
    const updatedPlayers: Player[] = [];
    const retiredPlayers: Player[] = [];

    players.forEach(player => {
      const p = { ...player };
      p.age += 1;
      p.contractYears = Math.max(0, p.contractYears - 1);

      // 1. Strict Cap at 45 Years Old (User Requirement)
      if (p.age >= 45) {
        p.isRetiring = true;
        retiredPlayers.push(p);
        return;
      }

      // 2. Youth Development (Age <= 23)
      if (p.age <= 23) {
        const growth = Math.floor(Math.random() * 3) + 1;
        p.ovr = Math.min(p.potential, p.ovr + growth);
      } 
      // 3. Peak Years (24 - 32)
      else if (p.age >= 24 && p.age <= 32) {
        if (p.ovr < p.potential && Math.random() > 0.5) {
          p.ovr += 1;
        }
      } 
      // 4. Physical Decline & Retirement (Age 33+)
      else if (p.age >= 33) {
        const decline = Math.floor(Math.random() * 3) + 1;
        p.ovr = Math.max(50, p.ovr - decline);

        // Organic Retirement Chance (Increases with age & OVR drop)
        const retireProbability = (p.age - 32) * 0.16 + (p.ovr < 72 ? 0.3 : 0.05);
        if (Math.random() < retireProbability || p.age >= 42) {
          p.isRetiring = true;
          retiredPlayers.push(p);
          return;
        }
      }

      // Recalculate value after OVR / age change
      p.value = Math.max(250000, Math.round((Math.pow(p.ovr - 50, 3) * 300 * (p.age < 23 ? 1.4 : p.age > 32 ? 0.5 : 1.0)) / 100000) * 100000);
      updatedPlayers.push(p);
    });

    // 5. Generate Youth Prospects from Youth Academy (Filial)
    const newYouth: Player[] = [];
    const positions: Player['position'][] = ['POR', 'DFC', 'LI', 'LD', 'MCD', 'MC', 'MCO', 'EI', 'ED', 'DC'];
    const youthCount = Math.floor(youthFacilityLevel / 3) + 1;

    for (let i = 0; i < youthCount; i++) {
      const baseOvr = 55 + youthFacilityLevel * 2 + Math.floor(Math.random() * 6);
      const potential = Math.min(95, baseOvr + 15 + Math.floor(Math.random() * 10));
      const pos = positions[Math.floor(Math.random() * positions.length)];
      const { value, salary } = calculateBalancedPlayerValueAndSalary(baseOvr, 16, potential);
      
      newYouth.push({
        id: `youth_${Date.now()}_${i}`,
        name: getRandomPlayerName(),
        clubId: "",
        position: pos,
        age: 16,
        ovr: baseOvr,
        potential: potential,
        value,
        salary,
        contractYears: getRandomContractYears(),
        morale: 90,
        isYouthTalent: true
      });
    }

    return { updatedPlayers, retiredPlayers, newYouth };
  }
}
