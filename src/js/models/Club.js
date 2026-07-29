/**
 * Club Domain Model
 * Manages Stadium, Infrastructure (Training & Youth), Fans, Economy & DT Budget Allocation
 */
export class Club {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.shortName = data.shortName || data.name;
    this.abbr = data.abbr || data.name.substring(0, 3).toUpperCase();
    this.stadium = data.stadium;
    this.stadiumCapacity = data.stadiumCapacity || 25000;
    this.fans = data.fans || 150000;
    this.budget = data.budget || 30000000;
    this.color1 = data.color1 || "#3b82f6";
    this.color2 = data.color2 || "#ffffff";
    
    // Ticket & Pricing
    this.ticketPrice = data.ticketPrice || 45; // € average per ticket

    // Infrastructure Levels (1 to 10)
    this.trainingLevel = data.trainingLevel || 1; // Canchas de entrenamiento
    this.youthLevel = data.youthLevel || 1;       // Cantera / Equipo Filial

    // President's Budget Allocations to the DT
    this.dtTransferBudget = data.dtTransferBudget || Math.round(this.budget * 0.35);
    this.dtRenewalBudget = data.dtRenewalBudget || Math.round(this.budget * 0.20);

    // Current Manager (DT)
    this.dt = data.dt || null;

    // Club Stats & Reputation
    this.fanApproval = data.fanApproval || 85; // 0-100%
  }

  // Cost to expand stadium (+5,000 capacity)
  getStadiumExpansionCost() {
    return Math.round(this.stadiumCapacity * 120);
  }

  // Cost to upgrade training facilities
  getTrainingUpgradeCost() {
    return Math.round(1500000 * Math.pow(1.5, this.trainingLevel - 1));
  }

  // Cost to upgrade youth academy
  getYouthUpgradeCost() {
    return Math.round(2000000 * Math.pow(1.6, this.youthLevel - 1));
  }
}
