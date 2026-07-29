/**
 * Real LaLiga Players Roster
 */
export const INITIAL_PLAYERS = [
  // REAL MADRID
  { id: "p1", name: "Kylian Mbappé", clubId: "rma", position: "DC", age: 25, ovr: 91, potential: 94, value: 180000000, salary: 15000000 },
  { id: "p2", name: "Vinícius Júnior", clubId: "rma", position: "EI", age: 24, ovr: 90, potential: 93, value: 150000000, salary: 12000000 },
  { id: "p3", name: "Jude Bellingham", clubId: "rma", position: "MCO", age: 21, ovr: 90, potential: 94, value: 160000000, salary: 11000000 },
  { id: "p4", name: "Thibaut Courtois", clubId: "rma", position: "POR", age: 32, ovr: 89, potential: 89, value: 45000000, salary: 9000000 },
  { id: "p5", name: "Federico Valverde", clubId: "rma", position: "MC", age: 26, ovr: 88, potential: 90, value: 100000000, salary: 8000000 },
  { id: "p6", name: "Rodrygo Goes", clubId: "rma", position: "ED", age: 23, ovr: 86, potential: 90, value: 90000000, salary: 7500000 },
  { id: "p7", name: "Antonio Rüdiger", clubId: "rma", position: "DFC", age: 31, ovr: 87, potential: 87, value: 35000000, salary: 7000000 },
  { id: "p8", name: "Éder Militão", clubId: "rma", position: "DFC", age: 26, ovr: 85, potential: 88, value: 60000000, salary: 6500000 },
  { id: "p9", name: "Luka Modrić", clubId: "rma", position: "MC", age: 38, ovr: 85, potential: 85, value: 8000000, salary: 6000000 },
  { id: "p10", name: "Dani Carvajal", clubId: "rma", position: "LD", age: 32, ovr: 86, potential: 86, value: 20000000, salary: 5500000 },
  { id: "p11", name: "Ferland Mendy", clubId: "rma", position: "LI", age: 29, ovr: 83, potential: 83, value: 22000000, salary: 4500000 },
  { id: "p12", name: "Endrick", clubId: "rma", position: "DC", age: 18, ovr: 77, potential: 92, value: 40000000, salary: 2500000 },

  // BARCELONA
  { id: "p13", name: "Lamine Yamal", clubId: "bar", position: "ED", age: 17, ovr: 87, potential: 96, value: 150000000, salary: 5000000 },
  { id: "p14", name: "Robert Lewandowski", clubId: "bar", position: "DC", age: 35, ovr: 88, potential: 88, value: 20000000, salary: 13000000 },
  { id: "p15", name: "Pedri González", clubId: "bar", position: "MC", age: 21, ovr: 87, potential: 92, value: 90000000, salary: 7000000 },
  { id: "p16", name: "Gavi", clubId: "bar", position: "MC", age: 20, ovr: 84, potential: 90, value: 75000000, salary: 5500000 },
  { id: "p17", name: "Raphinha", clubId: "bar", position: "EI", age: 27, ovr: 86, potential: 87, value: 65000000, salary: 7500000 },
  { id: "p18", name: "Marc-André ter Stegen", clubId: "bar", position: "POR", age: 32, ovr: 88, potential: 88, value: 30000000, salary: 8500000 },
  { id: "p19", name: "Jules Koundé", clubId: "bar", position: "LD", age: 25, ovr: 85, potential: 88, value: 55000000, salary: 6000000 },
  { id: "p20", name: "Ronald Araújo", clubId: "bar", position: "DFC", age: 25, ovr: 85, potential: 89, value: 60000000, salary: 6500000 },
  { id: "p21", name: "Pau Cubarsí", clubId: "bar", position: "DFC", age: 17, ovr: 79, potential: 91, value: 40000000, salary: 2000000 },
  { id: "p22", name: "Alejandro Balde", clubId: "bar", position: "LI", age: 20, ovr: 81, potential: 88, value: 42000000, salary: 3500000 },
  { id: "p23", name: "Frenkie de Jong", clubId: "bar", position: "MCD", age: 27, ovr: 86, potential: 88, value: 70000000, salary: 11000000 },

  // ATLÉTICO DE MADRID
  { id: "p24", name: "Antoine Griezmann", clubId: "atm", position: "MCO", age: 33, ovr: 88, potential: 88, value: 30000000, salary: 9000000 },
  { id: "p25", name: "Julián Álvarez", clubId: "atm", position: "DC", age: 24, ovr: 85, potential: 90, value: 85000000, salary: 7000000 },
  { id: "p26", name: "Jan Oblak", clubId: "atm", position: "POR", age: 31, ovr: 87, potential: 87, value: 32000000, salary: 8000000 },
  { id: "p27", name: "Rodrigo De Paul", clubId: "atm", position: "MC", age: 30, ovr: 84, potential: 84, value: 30000000, salary: 5000000 },
  { id: "p28", name: "Koke Resurrección", clubId: "atm", position: "MCD", age: 32, ovr: 82, potential: 82, value: 12000000, salary: 4500000 },
  { id: "p29", name: "Robin Le Normand", clubId: "atm", position: "DFC", age: 27, ovr: 83, potential: 85, value: 40000000, salary: 4000000 },
  { id: "p30", name: "Marcos Llorente", clubId: "atm", position: "LD", age: 29, ovr: 83, potential: 83, value: 30000000, salary: 4500000 },

  // ATHLETIC CLUB
  { id: "p31", name: "Nico Williams", clubId: "ath", position: "EI", age: 22, ovr: 85, potential: 90, value: 70000000, salary: 6000000 },
  { id: "p32", name: "Iñaki Williams", clubId: "ath", position: "ED", age: 30, ovr: 82, potential: 82, value: 25000000, salary: 4500000 },
  { id: "p33", name: "Unai Simón", clubId: "ath", position: "POR", age: 27, ovr: 85, potential: 87, value: 35000000, salary: 4000000 },
  { id: "p34", name: "Oihan Sancet", clubId: "ath", position: "MCO", age: 24, ovr: 82, potential: 87, value: 38000000, salary: 3200000 },
  { id: "p35", name: "Daniel Vivian", clubId: "ath", position: "DFC", age: 25, ovr: 82, potential: 86, value: 30000000, salary: 2800000 },

  // REAL SOCIEDAD
  { id: "p36", name: "Mikel Oyarzabal", clubId: "rso", position: "DC", age: 27, ovr: 84, potential: 85, value: 45000000, salary: 4500000 },
  { id: "p37", name: "Takefusa Kubo", clubId: "rso", position: "ED", age: 23, ovr: 82, potential: 88, value: 50000000, salary: 3500000 },
  { id: "p38", name: "Martin Zubimendi", clubId: "rso", position: "MCD", age: 25, ovr: 84, potential: 88, value: 55000000, salary: 4000000 },
  { id: "p39", name: "Alex Remiro", clubId: "rso", position: "POR", age: 29, ovr: 83, potential: 84, value: 28000000, salary: 3000000 },

  // REAL BETIS
  { id: "p40", name: "Isco Alarcón", clubId: "bet", position: "MCO", age: 32, ovr: 84, potential: 84, value: 15000000, salary: 3800000 },
  { id: "p41", name: "Giovani Lo Celso", clubId: "bet", position: "MC", age: 28, ovr: 81, potential: 82, value: 20000000, salary: 3200000 },
  { id: "p42", name: "Marc Bartra", clubId: "bet", position: "DFC", age: 33, ovr: 77, potential: 77, value: 3500000, salary: 2000000 },

  // VILLARREAL CF
  { id: "p43", name: "Álex Baena", clubId: "vil", position: "MCO", age: 23, ovr: 82, potential: 88, value: 48000000, salary: 3000000 },
  { id: "p44", name: "Gerard Moreno", clubId: "vil", position: "DC", age: 32, ovr: 83, potential: 83, value: 18000000, salary: 3800000 },
  { id: "p45", name: "Ayoze Pérez", clubId: "vil", position: "EI", age: 31, ovr: 80, potential: 80, value: 10000000, salary: 2500000 },

  // GIRONA FC
  { id: "p46", name: "Viktor Tsygankov", clubId: "gir", position: "ED", age: 26, ovr: 82, potential: 84, value: 30000000, salary: 2800000 },
  { id: "p47", name: "Yangel Herrera", clubId: "gir", position: "MC", age: 26, ovr: 79, potential: 82, value: 18000000, salary: 2200000 },
  { id: "p48", name: "Daley Blind", clubId: "gir", position: "DFC", age: 34, ovr: 79, potential: 79, value: 4000000, salary: 2500000 },

  // SEVILLA FC
  { id: "p49", name: "Jesús Navas", clubId: "sev", position: "LD", age: 38, ovr: 78, potential: 78, value: 1500000, salary: 2000000 },
  { id: "p50", name: "Saúl Ñíguez", clubId: "sev", position: "MC", age: 29, ovr: 79, potential: 79, value: 12000000, salary: 2500000 },
  { id: "p51", name: "Loïc Badé", clubId: "sev", position: "DFC", age: 24, ovr: 80, potential: 85, value: 20000000, salary: 2200000 },

  // VALENCIA CF
  { id: "p52", name: "Giorgi Mamardashvili", clubId: "val", position: "POR", age: 23, ovr: 84, potential: 89, value: 45000000, salary: 3000000 },
  { id: "p53", name: "Javi Guerra", clubId: "val", position: "MC", age: 21, ovr: 78, potential: 86, value: 22000000, salary: 1800000 },
  { id: "p54", name: "Hugo Duro", clubId: "val", position: "DC", age: 24, ovr: 78, potential: 82, value: 15000000, salary: 1800000 },

  // RC CELTA DE VIGO
  { id: "p55", name: "Iago Aspas", clubId: "cel", position: "DC", age: 37, ovr: 82, potential: 82, value: 5000000, salary: 3500000 },
  { id: "p56", name: "Óscar Mingueza", clubId: "cel", position: "LD", age: 25, ovr: 78, potential: 82, value: 12000000, salary: 1800000 },

  // CA OSASUNA
  { id: "p57", name: "Ante Budimir", clubId: "osa", position: "DC", age: 33, ovr: 80, potential: 80, value: 8000000, salary: 2000000 },
  { id: "p58", name: "Jon Moncayola", clubId: "osa", position: "MC", age: 26, ovr: 77, potential: 80, value: 9000000, salary: 1500000 },

  // GETAFE CF
  { id: "p59", name: "Borja Mayoral", clubId: "get", position: "DC", age: 27, ovr: 78, potential: 79, value: 10000000, salary: 1900000 },
  { id: "p60", name: "David Soria", clubId: "get", position: "POR", age: 31, ovr: 80, potential: 80, value: 8000000, salary: 1800000 },

  // RAYO VALLECANO
  { id: "p61", name: "James Rodríguez", clubId: "ray", position: "MCO", age: 33, ovr: 81, potential: 81, value: 8000000, salary: 2500000 },
  { id: "p62", name: "Isi Palazón", clubId: "ray", position: "ED", age: 29, ovr: 78, potential: 78, value: 9000000, salary: 1600000 },

  // RCD MALLORCA
  { id: "p63", name: "Vedat Muriqi", clubId: "mll", position: "DC", age: 30, ovr: 80, potential: 80, value: 12000000, salary: 2200000 },
  { id: "p64", name: "Sergi Darder", clubId: "mll", position: "MC", age: 30, ovr: 78, potential: 78, value: 8000000, salary: 1800000 },

  // UD LAS PALMAS
  { id: "p65", name: "Alberto Moleiro", clubId: "lpa", position: "MCO", age: 20, ovr: 77, potential: 86, value: 18000000, salary: 1400000 },
  { id: "p66", name: "Kirian Rodríguez", clubId: "lpa", position: "MC", age: 28, ovr: 79, potential: 80, value: 12000000, salary: 1600000 },

  // DEPORTIVO ALAVÉS
  { id: "p67", name: "Kike García", clubId: "ala", position: "DC", age: 34, ovr: 74, potential: 74, value: 1500000, salary: 1000000 },
  { id: "p68", name: "Antonio Blanco", clubId: "ala", position: "MCD", age: 24, ovr: 76, potential: 82, value: 8000000, salary: 1200000 },

  // RCD ESPANYOL
  { id: "p69", name: "Javi Puado", clubId: "esp", position: "EI", age: 26, ovr: 77, potential: 80, value: 9000000, salary: 1400000 },
  { id: "p70", name: "Joan García", clubId: "esp", position: "POR", age: 23, ovr: 76, potential: 84, value: 12000000, salary: 1100000 },

  // CD LEGANÉS
  { id: "p71", name: "Marko Dmitrović", clubId: "leg", position: "POR", age: 32, ovr: 76, potential: 76, value: 3000000, salary: 1200000 },

  // REAL VALLADOLID
  { id: "p72", name: "Raúl Moro", clubId: "vll", position: "ED", age: 21, ovr: 75, potential: 83, value: 7000000, salary: 900000 }
];
