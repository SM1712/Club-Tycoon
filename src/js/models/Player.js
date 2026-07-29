/**
 * Player Domain Model
 */
export class Player {
  constructor(data) {
    this.id = data.id || `p_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    this.name = data.name;
    this.clubId = data.clubId;
    this.position = data.position; // POR, DFC, LI, LD, MCD, MC, MCO, EI, ED, DC
    this.age = data.age;
    this.ovr = data.ovr;
    this.potential = data.potential || data.ovr;
    this.value = data.value || this.calculateValue();
    this.salary = data.salary || Math.round(this.value * 0.08);
    this.contractYears = data.contractYears || Math.floor(Math.random() * 4) + 1;
    this.isRetiring = false;
    this.morale = data.morale || 85;
    this.isYouthTalent = data.isYouthTalent || false;
  }

  calculateValue() {
    let base = Math.pow(this.ovr - 50, 3) * 350;
    if (this.age < 22) base *= 1.4;
    else if (this.age > 32) base *= 0.6;
    return Math.max(250000, Math.round(base / 100000) * 100000);
  }

  // End of season aging logic & retirement evaluation
  processSeasonEnd(trainingFacilityLevel = 1) {
    this.age += 1;
    this.contractYears = Math.max(0, this.contractYears - 1);

    // Hard ceiling cap at 45 years old as requested by the user
    if (this.age >= 45) {
      this.isRetiring = true;
      return { retired: true, reason: "Llegó al límite máximo de edad (45 años)." };
    }

    // Player Development vs Decline Curve
    if (this.age <= 23) {
      // Youth growth boosted by training facilities
      const growthBoost = Math.floor(Math.random() * 3) + (trainingFacilityLevel > 5 ? 2 : 1);
      this.ovr = Math.min(this.potential, this.ovr + growthBoost);
    } else if (this.age >= 33) {
      // Physical decline for veterans
      const decline = Math.floor(Math.random() * 3) + 1;
      this.ovr = Math.max(50, this.ovr - decline);

      // Organic retirement decision based on age, OVR decline and contract
      const retireProbability = (this.age - 33) * 0.18 + (this.ovr < 70 ? 0.25 : 0.05);
      if (Math.random() < retireProbability || this.age >= 42) {
        this.isRetiring = true;
        return { retired: true, reason: `Decidió colgar las botas a los ${this.age} años.` };
      }
    } else {
      // Prime years (24-32)
      if (this.ovr < this.potential && Math.random() > 0.4) {
        this.ovr += 1;
      }
    }

    // Recalculate market value after age & OVR update
    this.value = this.calculateValue();
    return { retired: false };
  }
}
