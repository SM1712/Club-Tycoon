import { Club, Player, WeeklyFinancialSummary, SeasonalFinancialProjection } from '../types';

export class EconomySystem {
  /**
   * Calculate realistic weekly finances for home vs away matches
   */
  static calculateWeeklyFinances(club: Club, squad: Player[], isHomeMatch: boolean = true): WeeklyFinancialSummary {
    const effectiveCapacity = club.isRentingStadium ? 1500 : club.stadiumCapacity;
    const stadiumRentExpense = (isHomeMatch && club.isRentingStadium) ? club.stadiumRentFee : 0;

    // Reference base ticket price according to division level
    let referencePrice = 45;
    if (club.divisionId === 'div2') referencePrice = 22;
    if (club.divisionId === 'div3') referencePrice = 12;

    // Demand elasticity curve (Laffer Curve for ticketing):
    // Overcharging beyond referencePrice drops demand exponentially (exponent 2.8).
    // Undercharging increases attendance up to stadium capacity.
    const priceRatio = club.ticketPrice / Math.max(1, referencePrice);
    let demandFactor = 1.0;

    if (priceRatio <= 1.0) {
      // Cheap / Fair prices boost attendance up to +25%
      demandFactor = 1.0 + 0.25 * (1.0 - priceRatio);
    } else {
      // Overpriced tickets severely collapse attendance with no artificial floor
      demandFactor = Math.max(0, Math.pow(1 / priceRatio, 2.8));
    }

    // Base attendance factor from fan base and fan approval
    const baseFanTurnout = club.fans * 0.70 * (club.fanApproval / 100);
    const rawAttendance = Math.round(baseFanTurnout * demandFactor);
    const estimatedAttendance = Math.min(effectiveCapacity, Math.max(0, rawAttendance));

    const ticketIncomeRaw = isHomeMatch ? estimatedAttendance * club.ticketPrice : 0;

    // Jersey & Merchandising sales (raw)
    const starCount = squad.filter(p => p.ovr >= 78).length;
    const rawJerseyIncome = Math.round((starCount * 5000 + club.fans * 0.04) * (isHomeMatch ? 1.2 : 0.8));
    const rawMerchIncome = Math.round(club.fans * 0.03 + (isHomeMatch ? estimatedAttendance * 1.5 : 0));

    // Active Sponsors weekly income
    const vipBonus = (club.vipSuitesLevel || 0) * (isHomeMatch ? 25000 : 5000);
    const museumBonus = (club.museumLevel || 0) * 15000;
    const sponsorsIncome = (club.activeSponsors || []).reduce((sum, contract) => sum + contract.sponsor.baseWeeklyPay, 0) + vipBonus;

    // Socios Program finances and cannibalization math
    let sociosIncome = 0;
    let sociosTicketDiscountLoss = 0;
    let sociosMerchDiscountLoss = 0;

    if (club.sociosData && club.sociosData.isProgramActive && club.fans >= 10000) {
      const { sociosCount, membershipFee, ticketDiscountPercent, merchDiscountPercent } = club.sociosData;
      sociosIncome = Math.round(sociosCount * membershipFee);

      if (isHomeMatch && estimatedAttendance > 0) {
        // Proportion of crowd that are Socios
        const sociosAttending = Math.min(sociosCount, Math.round(estimatedAttendance * 0.65));
        sociosTicketDiscountLoss = Math.round(sociosAttending * club.ticketPrice * (ticketDiscountPercent / 100));
      }

      const totalRawMerch = rawJerseyIncome + rawMerchIncome;
      sociosMerchDiscountLoss = Math.round(totalRawMerch * 0.40 * (merchDiscountPercent / 100));
    }

    const ticketIncome = Math.max(0, ticketIncomeRaw - sociosTicketDiscountLoss);
    const jerseyIncome = Math.max(0, Math.round(rawJerseyIncome - sociosMerchDiscountLoss * 0.6));
    const merchIncome = Math.max(0, Math.round(rawMerchIncome - sociosMerchDiscountLoss * 0.4)) + museumBonus;

    // Expenses (Weekly division of annual salaries)
    const dtSalaryExpense = club.dt ? Math.round(club.dt.salary / 38) : 0;
    const squadSalaryExpense = Math.round(squad.reduce((sum, p) => sum + p.salary, 0) / 38);
    const maintenanceExpense = club.isRentingStadium
      ? 1200
      : Math.round(club.stadiumCapacity * 6 + club.trainingLevel * 8000 + club.youthLevel * 10000);

    const totalIncome = ticketIncome + jerseyIncome + merchIncome + sponsorsIncome + sociosIncome;
    const totalExpense = stadiumRentExpense + dtSalaryExpense + squadSalaryExpense + maintenanceExpense;
    const netTotal = totalIncome - totalExpense;

    return {
      isHomeMatch,
      estimatedAttendance,
      ticketIncome,
      jerseyIncome,
      merchIncome,
      sponsorsIncome,
      sociosIncome,
      sociosTicketDiscountLoss,
      sociosMerchDiscountLoss,
      stadiumRentExpense,
      dtSalaryExpense,
      squadSalaryExpense,
      maintenanceExpense,
      netTotal
    };
  }

  /**
   * Calculate 38-week full seasonal projection for predictable long-term management
   */
  static calculateSeasonalProjection(club: Club, squad: Player[]): SeasonalFinancialProjection {
    const homeWeek = this.calculateWeeklyFinances(club, squad, true);
    const awayWeek = this.calculateWeeklyFinances(club, squad, false);

    const projectedHomeGateIncome = homeWeek.ticketIncome * 19;
    const projectedJerseyMerchIncome = (homeWeek.jerseyIncome + homeWeek.merchIncome) * 19 + (awayWeek.jerseyIncome + awayWeek.merchIncome) * 19;
    const projectedSponsorsIncome = homeWeek.sponsorsIncome * 38;
    const projectedSociosIncome = homeWeek.sociosIncome * 38;
    const totalProjectedIncome = projectedHomeGateIncome + projectedJerseyMerchIncome + projectedSponsorsIncome + projectedSociosIncome;

    const projectedStadiumRentExpense = club.isRentingStadium ? club.stadiumRentFee * 19 : 0;
    const annualSquadSalaries = squad.reduce((sum, p) => sum + p.salary, 0);
    const annualDtSalary = club.dt ? club.dt.salary : 0;
    const annualMaintenance = homeWeek.maintenanceExpense * 38;
    const dtAllocatedFunds = (club.dtTransferBudget || 0) + (club.dtRenewalBudget || 0);

    // Total projected expense includes recurring operations PLUS delegated DT capital allocation
    const totalProjectedExpense = projectedStadiumRentExpense + annualSquadSalaries + annualDtSalary + annualMaintenance + dtAllocatedFunds;
    const projectedNetBalance = totalProjectedIncome - totalProjectedExpense;
    const freeUnreservedBudget = club.budget - dtAllocatedFunds;

    const weeklySquadSalaries = Math.round(annualSquadSalaries / 38);
    const weeklyDtSalary = Math.round(annualDtSalary / 38);
    const weeklyMaintenance = homeWeek.maintenanceExpense;
    const weeklyFixedExpenses = weeklySquadSalaries + weeklyDtSalary + weeklyMaintenance + (club.isRentingStadium ? Math.round(club.stadiumRentFee / 2) : 0);

    let healthStatus: 'HEALTHY' | 'WARNING' | 'CRITICAL' = 'HEALTHY';
    if (projectedNetBalance < -500000 || freeUnreservedBudget < 0) {
      healthStatus = 'CRITICAL';
    } else if (projectedNetBalance < 0) {
      healthStatus = 'WARNING';
    }

    return {
      totalProjectedIncome,
      totalProjectedExpense,
      projectedNetBalance,
      weeklyFixedExpenses,
      weeklySquadSalaries,
      weeklyDtSalary,
      weeklyMaintenance,
      projectedHomeGateIncome,
      projectedJerseyMerchIncome,
      projectedSponsorsIncome,
      projectedSociosIncome,
      projectedStadiumRentExpense,
      dtAllocatedFunds,
      freeUnreservedBudget,
      healthStatus
    };
  }
}

