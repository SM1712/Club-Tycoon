import { Player } from '../types';

export const INITIAL_PLAYERS: Player[] = [
  // REAL MADRID
  { id: "p1", name: "Kylian Mbappé", clubId: "rma", position: "DC", age: 25, ovr: 91, potential: 94, value: 180000000, salary: 15000000, contractYears: 5, morale: 95 },
  { id: "p2", name: "Vinícius Júnior", clubId: "rma", position: "EI", age: 24, ovr: 90, potential: 93, value: 150000000, salary: 12000000, contractYears: 4, morale: 92 },
  { id: "p3", name: "Jude Bellingham", clubId: "rma", position: "MCO", age: 21, ovr: 90, potential: 94, value: 160000000, salary: 11000000, contractYears: 5, morale: 94 },
  { id: "p4", name: "Thibaut Courtois", clubId: "rma", position: "POR", age: 32, ovr: 89, potential: 89, value: 45000000, salary: 9000000, contractYears: 3, morale: 88 },
  { id: "p5", name: "Federico Valverde", clubId: "rma", position: "MC", age: 26, ovr: 88, potential: 90, value: 100000000, salary: 8000000, contractYears: 4, morale: 90 },
  { id: "p6", name: "Rodrygo Goes", clubId: "rma", position: "ED", age: 23, ovr: 86, potential: 90, value: 90000000, salary: 7500000, contractYears: 4, morale: 87 },
  { id: "p7", name: "Antonio Rüdiger", clubId: "rma", position: "DFC", age: 31, ovr: 87, potential: 87, value: 35000000, salary: 7000000, contractYears: 2, morale: 89 },
  { id: "p8", name: "Éder Militão", clubId: "rma", position: "DFC", age: 26, ovr: 85, potential: 88, value: 60000000, salary: 6500000, contractYears: 3, morale: 86 },
  { id: "p9", name: "Luka Modrić", clubId: "rma", position: "MC", age: 38, ovr: 85, potential: 85, value: 8000000, salary: 6000000, contractYears: 1, morale: 92 },
  { id: "p10", name: "Dani Carvajal", clubId: "rma", position: "LD", age: 32, ovr: 86, potential: 86, value: 20000000, salary: 5500000, contractYears: 2, morale: 90 },
  { id: "p11", name: "Ferland Mendy", clubId: "rma", position: "LI", age: 29, ovr: 83, potential: 83, value: 22000000, salary: 4500000, contractYears: 2, morale: 85 },
  { id: "p12", name: "Endrick", clubId: "rma", position: "DC", age: 18, ovr: 77, potential: 92, value: 40000000, salary: 2500000, contractYears: 5, morale: 95 },

  // BARCELONA
  { id: "p13", name: "Lamine Yamal", clubId: "bar", position: "ED", age: 17, ovr: 87, potential: 96, value: 150000000, salary: 5000000, contractYears: 5, morale: 98 },
  { id: "p14", name: "Robert Lewandowski", clubId: "bar", position: "DC", age: 35, ovr: 88, potential: 88, value: 20000000, salary: 13000000, contractYears: 2, morale: 88 },
  { id: "p15", name: "Pedri González", clubId: "bar", position: "MC", age: 21, ovr: 87, potential: 92, value: 90000000, salary: 7000000, contractYears: 4, morale: 91 },
  { id: "p16", name: "Gavi", clubId: "bar", position: "MC", age: 20, ovr: 84, potential: 90, value: 75000000, salary: 5500000, contractYears: 4, morale: 92 },
  { id: "p17", name: "Raphinha", clubId: "bar", position: "EI", age: 27, ovr: 86, potential: 87, value: 65000000, salary: 7500000, contractYears: 3, morale: 89 },
  { id: "p18", name: "Marc-André ter Stegen", clubId: "bar", position: "POR", age: 32, ovr: 88, potential: 88, value: 30000000, salary: 8500000, contractYears: 3, morale: 87 },
  { id: "p19", name: "Jules Koundé", clubId: "bar", position: "LD", age: 25, ovr: 85, potential: 88, value: 55000000, salary: 6000000, contractYears: 3, morale: 86 },
  { id: "p20", name: "Ronald Araújo", clubId: "bar", position: "DFC", age: 25, ovr: 85, potential: 89, value: 60000000, salary: 6500000, contractYears: 3, morale: 85 },
  { id: "p21", name: "Pau Cubarsí", clubId: "bar", position: "DFC", age: 17, ovr: 79, potential: 91, value: 40000000, salary: 2000000, contractYears: 5, morale: 94 },
  { id: "p22", name: "Alejandro Balde", clubId: "bar", position: "LI", age: 20, ovr: 81, potential: 88, value: 42000000, salary: 3500000, contractYears: 4, morale: 88 },
  { id: "p23", name: "Frenkie de Jong", clubId: "bar", position: "MCD", age: 27, ovr: 86, potential: 88, value: 70000000, salary: 11000000, contractYears: 2, morale: 84 },

  // ATLÉTICO DE MADRID
  { id: "p24", name: "Antoine Griezmann", clubId: "atm", position: "MCO", age: 33, ovr: 88, potential: 88, value: 30000000, salary: 9000000, contractYears: 2, morale: 92 },
  { id: "p25", name: "Julián Álvarez", clubId: "atm", position: "DC", age: 24, ovr: 85, potential: 90, value: 85000000, salary: 7000000, contractYears: 5, morale: 90 },
  { id: "p26", name: "Jan Oblak", clubId: "atm", position: "POR", age: 31, ovr: 87, potential: 87, value: 32000000, salary: 8000000, contractYears: 3, morale: 87 },
  { id: "p27", name: "Rodrigo De Paul", clubId: "atm", position: "MC", age: 30, ovr: 84, potential: 84, value: 30000000, salary: 5000000, contractYears: 2, morale: 86 },
  { id: "p28", name: "Koke Resurrección", clubId: "atm", position: "MCD", age: 32, ovr: 82, potential: 82, value: 12000000, salary: 4500000, contractYears: 2, morale: 90 },
  { id: "p29", name: "Robin Le Normand", clubId: "atm", position: "DFC", age: 27, ovr: 83, potential: 85, value: 40000000, salary: 4000000, contractYears: 4, morale: 85 },
  { id: "p30", name: "Marcos Llorente", clubId: "atm", position: "LD", age: 29, ovr: 83, potential: 83, value: 30000000, salary: 4500000, contractYears: 3, morale: 86 },

  // ATHLETIC CLUB
  { id: "p31", name: "Nico Williams", clubId: "ath", position: "EI", age: 22, ovr: 85, potential: 90, value: 70000000, salary: 6000000, contractYears: 4, morale: 93 },
  { id: "p32", name: "Iñaki Williams", clubId: "ath", position: "ED", age: 30, ovr: 82, potential: 82, value: 25000000, salary: 4500000, contractYears: 3, morale: 89 },
  { id: "p33", name: "Unai Simón", clubId: "ath", position: "POR", age: 27, ovr: 85, potential: 87, value: 35000000, salary: 4000000, contractYears: 4, morale: 88 },
  { id: "p34", name: "Oihan Sancet", clubId: "ath", position: "MCO", age: 24, ovr: 82, potential: 87, value: 38000000, salary: 3200000, contractYears: 4, morale: 87 },
  { id: "p35", name: "Daniel Vivian", clubId: "ath", position: "DFC", age: 25, ovr: 82, potential: 86, value: 30000000, salary: 2800000, contractYears: 3, morale: 86 },

  // REAL SOCIEDAD
  { id: "p36", name: "Mikel Oyarzabal", clubId: "rso", position: "DC", age: 27, ovr: 84, potential: 85, value: 45000000, salary: 4500000, contractYears: 3, morale: 90 },
  { id: "p37", name: "Takefusa Kubo", clubId: "rso", position: "ED", age: 23, ovr: 82, potential: 88, value: 50000000, salary: 3500000, contractYears: 4, morale: 88 },
  { id: "p38", name: "Martin Zubimendi", clubId: "rso", position: "MCD", age: 25, ovr: 84, potential: 88, value: 55000000, salary: 4000000, contractYears: 3, morale: 89 },
  { id: "p39", name: "Alex Remiro", clubId: "rso", position: "POR", age: 29, ovr: 83, potential: 84, value: 28000000, salary: 3000000, contractYears: 3, morale: 86 },

  // REAL BETIS
  { id: "p40", name: "Isco Alarcón", clubId: "bet", position: "MCO", age: 32, ovr: 84, potential: 84, value: 15000000, salary: 3800000, contractYears: 2, morale: 91 },
  { id: "p41", name: "Giovani Lo Celso", clubId: "bet", position: "MC", age: 28, ovr: 81, potential: 82, value: 20000000, salary: 3200000, contractYears: 3, morale: 85 },
  { id: "p42", name: "Marc Bartra", clubId: "bet", position: "DFC", age: 33, ovr: 77, potential: 77, value: 3500000, salary: 2000000, contractYears: 1, morale: 82 },

  // VILLARREAL
  { id: "p43", name: "Álex Baena", clubId: "vil", position: "MCO", age: 23, ovr: 82, potential: 88, value: 48000000, salary: 3000000, contractYears: 4, morale: 88 },
  { id: "p44", name: "Gerard Moreno", clubId: "vil", position: "DC", age: 32, ovr: 83, potential: 83, value: 18000000, salary: 3800000, contractYears: 2, morale: 84 },

  // GIRONA
  { id: "p45", name: "Viktor Tsygankov", clubId: "gir", position: "ED", age: 26, ovr: 82, potential: 84, value: 30000000, salary: 2800000, contractYears: 3, morale: 86 },
  
  // SEVILLA
  { id: "p46", name: "Jesús Navas", clubId: "sev", position: "LD", age: 38, ovr: 78, potential: 78, value: 1500000, salary: 2000000, contractYears: 1, morale: 92 },
  { id: "p47", name: "Loïc Badé", clubId: "sev", position: "DFC", age: 24, ovr: 80, potential: 85, value: 20000000, salary: 2200000, contractYears: 3, morale: 83 },

  // VALENCIA
  { id: "p48", name: "Giorgi Mamardashvili", clubId: "val", position: "POR", age: 23, ovr: 84, potential: 89, value: 45000000, salary: 3000000, contractYears: 3, morale: 87 },
  { id: "p49", name: "Javi Guerra", clubId: "val", position: "MC", age: 21, ovr: 78, potential: 86, value: 22000000, salary: 1800000, contractYears: 4, morale: 85 },

  // CELTA
  { id: "p50", name: "Iago Aspas", clubId: "cel", position: "DC", age: 37, ovr: 82, potential: 82, value: 5000000, salary: 3500000, contractYears: 1, morale: 93 },

  // RAYO
  { id: "p51", name: "James Rodríguez", clubId: "ray", position: "MCO", age: 33, ovr: 81, potential: 81, value: 8000000, salary: 2500000, contractYears: 1, morale: 87 },

  // MARKET FREE AGENTS & PROSPECTS
  { id: "p52", name: "Javier Saviola (Cantera)", clubId: "", position: "DC", age: 17, ovr: 68, potential: 86, value: 4000000, salary: 500000, contractYears: 3, morale: 85, isYouthTalent: true },
  { id: "p53", name: "Mateo Kovacic", clubId: "", position: "MC", age: 30, ovr: 82, potential: 82, value: 22000000, salary: 4000000, contractYears: 2, morale: 80 },
  { id: "p54", name: "Thiago Silva (Veterano)", clubId: "", position: "DFC", age: 39, ovr: 80, potential: 80, value: 2000000, salary: 2000000, contractYears: 1, morale: 85 }
];
