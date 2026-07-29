import { Club, Division } from '../types';

export const SPANISH_DIVISIONS: Division[] = [
  {
    id: "div1",
    name: "1ª División (LaLiga EA Sports)",
    shortName: "1ª Div",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/LaLiga_EA_Sports_2023_Logo.svg/512px-LaLiga_EA_Sports_2023_Logo.svg.png",
    level: 1
  },
  {
    id: "div2",
    name: "2ª División (LaLiga Hypermotion)",
    shortName: "2ª Div",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/LaLiga_Hypermotion_2023_Logo.svg/512px-LaLiga_Hypermotion_2023_Logo.svg.png",
    level: 2
  },
  {
    id: "div3",
    name: "3ª División (Primera RFEF)",
    shortName: "3ª Div",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Logotipo_de_la_Primera_Federaci%C3%B3n.svg/512px-Logotipo_de_la_Primera_Federaci%C3%B3n.svg.png",
    level: 3
  }
];

// Helper to build 20 teams for each division
export const INITIAL_CLUBS: Club[] = [
  // ================= 1ª DIVISIÓN (20 REAL TEAMS) =================
  { id: "rma", divisionId: "div1", name: "Real Madrid", shortName: "R. Madrid", abbr: "RMA", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/5/56/Real_Madrid_CF.svg/512px-Real_Madrid_CF.svg.png", stadium: "Estadio Santiago Bernabéu", stadiumCapacity: 84000, isRentingStadium: false, stadiumRentFee: 0, fans: 1200000, budget: 120000000, color1: "#3b82f6", color2: "#ffffff", ticketPrice: 65, trainingLevel: 8, youthLevel: 7, dtTransferBudget: 50000000, dtRenewalBudget: 20000000, fanApproval: 92, dt: { id: "dt_rma", name: "Carlo Ancelotti", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Carlo_Ancelotti_2016.jpg/440px-Carlo_Ancelotti_2016.jpg", style: "Galáctico & Flexible", salary: 7500000, reputation: 95, morale: 90 } },
  { id: "bar", divisionId: "div1", name: "FC Barcelona", shortName: "Barcelona", abbr: "BAR", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/4/47/FC_Barcelona_%28crest%29.svg/512px-FC_Barcelona_%28crest%29.svg.png", stadium: "Spotify Camp Nou", stadiumCapacity: 99354, isRentingStadium: false, stadiumRentFee: 0, fans: 1100000, budget: 65000000, color1: "#a855f7", color2: "#ef4444", ticketPrice: 60, trainingLevel: 7, youthLevel: 9, dtTransferBudget: 25000000, dtRenewalBudget: 15000000, fanApproval: 88, dt: { id: "dt_bar", name: "Hansi Flick", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Hansi_Flick_2019.jpg/440px-Hansi_Flick_2019.jpg", style: "Presión Alta y Vertical", salary: 6000000, reputation: 92, morale: 88 } },
  { id: "atm", divisionId: "div1", name: "Atlético de Madrid", shortName: "Atlético", abbr: "ATM", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f4/Atletico_Madrid_2017_logo.svg/512px-Atletico_Madrid_2017_logo.svg.png", stadium: "Riyadh Air Metropolitano", stadiumCapacity: 70460, isRentingStadium: false, stadiumRentFee: 0, fans: 650000, budget: 55000000, color1: "#ef4444", color2: "#3b82f6", ticketPrice: 50, trainingLevel: 7, youthLevel: 6, dtTransferBudget: 20000000, dtRenewalBudget: 10000000, fanApproval: 86, dt: { id: "dt_atm", name: "Diego Simeone", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Diego_Simeone_2016.jpg/440px-Diego_Simeone_2016.jpg", style: "Intenso y Defensivo", salary: 9000000, reputation: 90, morale: 85 } },
  { id: "ath", divisionId: "div1", name: "Athletic Club", shortName: "Athletic", abbr: "ATH", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/7/75/Athletic_Club_bitmap.svg/512px-Athletic_Club_bitmap.svg.png", stadium: "San Mamés", stadiumCapacity: 53331, isRentingStadium: false, stadiumRentFee: 0, fans: 350000, budget: 35000000, color1: "#dc2626", color2: "#ffffff", ticketPrice: 45, trainingLevel: 6, youthLevel: 8, dtTransferBudget: 12000000, dtRenewalBudget: 8000000, fanApproval: 89, dt: { id: "dt_ath", name: "Ernesto Valverde", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Ernesto_Valverde_2015.jpg/440px-Ernesto_Valverde_2015.jpg", style: "Equilibrado y Cantera", salary: 4000000, reputation: 85, morale: 87 } },
  { id: "rso", divisionId: "div1", name: "Real Sociedad", shortName: "R. Sociedad", abbr: "RSO", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f1/Real_Sociedad_logo.svg/512px-Real_Sociedad_logo.svg.png", stadium: "Reale Arena", stadiumCapacity: 39500, isRentingStadium: false, stadiumRentFee: 0, fans: 280000, budget: 30000000, color1: "#2563eb", color2: "#ffffff", ticketPrice: 40, trainingLevel: 6, youthLevel: 7, dtTransferBudget: 10000000, dtRenewalBudget: 6000000, fanApproval: 85, dt: { id: "dt_rso", name: "Imanol Alguacil", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Imanol_Alguacil.jpg/440px-Imanol_Alguacil.jpg", style: "Posesión y Jóvenes", salary: 3200000, reputation: 84, morale: 84 } },
  { id: "bet", divisionId: "div1", name: "Real Betis", shortName: "Real Betis", abbr: "BET", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/1/13/Real_betis_logo.svg/512px-Real_betis_logo.svg.png", stadium: "Estadio Benito Villamarín", stadiumCapacity: 60721, isRentingStadium: false, stadiumRentFee: 0, fans: 400000, budget: 25000000, color1: "#16a34a", color2: "#ffffff", ticketPrice: 40, trainingLevel: 5, youthLevel: 5, dtTransferBudget: 8000000, dtRenewalBudget: 5000000, fanApproval: 84, dt: { id: "dt_bet", name: "Manuel Pellegrini", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Manuel_Pellegrini_2015.jpg/440px-Manuel_Pellegrini_2015.jpg", style: "Técnico y Ofensivo", salary: 3800000, reputation: 86, morale: 83 } },
  { id: "vil", divisionId: "div1", name: "Villarreal CF", shortName: "Villarreal", abbr: "VIL", stadium: "Estadio de la Cerámica", stadiumCapacity: 23500, isRentingStadium: false, stadiumRentFee: 0, fans: 180000, budget: 28000000, color1: "#eab308", color2: "#2563eb", ticketPrice: 38, trainingLevel: 6, youthLevel: 7, dtTransferBudget: 9000000, dtRenewalBudget: 5000000, fanApproval: 82, dt: { id: "dt_vil", name: "Marcelino García", style: "Transición Rápida", salary: 3000000, reputation: 83, morale: 82 } },
  { id: "gir", divisionId: "div1", name: "Girona FC", shortName: "Girona", abbr: "GIR", stadium: "Estadi Montilivi", stadiumCapacity: 14600, isRentingStadium: false, stadiumRentFee: 0, fans: 120000, budget: 22000000, color1: "#dc2626", color2: "#ffffff", ticketPrice: 35, trainingLevel: 4, youthLevel: 4, dtTransferBudget: 7000000, dtRenewalBudget: 4000000, fanApproval: 86, dt: { id: "dt_gir", name: "Míchel Sánchez", style: "Posesión Dinámica", salary: 2500000, reputation: 85, morale: 86 } },
  { id: "sev", divisionId: "div1", name: "Sevilla FC", shortName: "Sevilla", abbr: "SEV", stadium: "Ramón Sánchez-Pizjuán", stadiumCapacity: 43883, isRentingStadium: false, stadiumRentFee: 0, fans: 380000, budget: 20000000, color1: "#ffffff", color2: "#dc2626", ticketPrice: 42, trainingLevel: 5, youthLevel: 5, dtTransferBudget: 6000000, dtRenewalBudget: 4000000, fanApproval: 76, dt: { id: "dt_sev", name: "García Pimienta", style: "Control y Pase", salary: 2200000, reputation: 78, morale: 78 } },
  { id: "val", divisionId: "div1", name: "Valencia CF", shortName: "Valencia", abbr: "VAL", stadium: "Mestalla", stadiumCapacity: 49430, isRentingStadium: false, stadiumRentFee: 0, fans: 360000, budget: 18000000, color1: "#ffffff", color2: "#000000", ticketPrice: 38, trainingLevel: 4, youthLevel: 6, dtTransferBudget: 5000000, dtRenewalBudget: 3000000, fanApproval: 75, dt: { id: "dt_val", name: "Rubén Baraja", style: "Juventud y Sacrificio", salary: 2000000, reputation: 80, morale: 80 } },
  { id: "cel", divisionId: "div1", name: "RC Celta de Vigo", shortName: "Celta", abbr: "CEL", stadium: "Abanca-Balaídos", stadiumCapacity: 29000, isRentingStadium: false, stadiumRentFee: 0, fans: 190000, budget: 16000000, color1: "#38bdf8", color2: "#ffffff", ticketPrice: 35, trainingLevel: 4, youthLevel: 5, dtTransferBudget: 4500000, dtRenewalBudget: 2500000, fanApproval: 79, dt: { id: "dt_cel", name: "Claudio Giráldez", style: "Ofensivo de Cantera", salary: 1800000, reputation: 77, morale: 81 } },
  { id: "osa", divisionId: "div1", name: "CA Osasuna", shortName: "Osasuna", abbr: "OSA", stadium: "El Sadar", stadiumCapacity: 23576, isRentingStadium: false, stadiumRentFee: 0, fans: 170000, budget: 14000000, color1: "#dc2626", color2: "#1e3a8a", ticketPrice: 35, trainingLevel: 4, youthLevel: 5, dtTransferBudget: 4000000, dtRenewalBudget: 2000000, fanApproval: 82, dt: { id: "dt_osa", name: "Vicente Moreno", style: "Directo y Físico", salary: 1600000, reputation: 76, morale: 79 } },
  { id: "get", divisionId: "div1", name: "Getafe CF", shortName: "Getafe", abbr: "GET", stadium: "Coliseum", stadiumCapacity: 16500, isRentingStadium: false, stadiumRentFee: 0, fans: 110000, budget: 12000000, color1: "#2563eb", color2: "#ffffff", ticketPrice: 32, trainingLevel: 3, youthLevel: 3, dtTransferBudget: 3500000, dtRenewalBudget: 2000000, fanApproval: 80, dt: { id: "dt_get", name: "José Bordalás", style: "Bloque Bajo e Intensidad", salary: 2200000, reputation: 81, morale: 83 } },
  { id: "ray", divisionId: "div1", name: "Rayo Vallecano", shortName: "Rayo", abbr: "RAY", stadium: "Estadio de Vallecas", stadiumCapacity: 14708, isRentingStadium: false, stadiumRentFee: 0, fans: 130000, budget: 11000000, color1: "#ffffff", color2: "#dc2626", ticketPrice: 30, trainingLevel: 3, youthLevel: 3, dtTransferBudget: 3000000, dtRenewalBudget: 1800000, fanApproval: 83, dt: { id: "dt_ray", name: "Iñigo Pérez", style: "Presión Asfixiante", salary: 1500000, reputation: 75, morale: 80 } },
  { id: "mll", divisionId: "div1", name: "RCD Mallorca", shortName: "Mallorca", abbr: "MLL", stadium: "Estadi Mallorca Son Moix", stadiumCapacity: 23000, isRentingStadium: false, stadiumRentFee: 0, fans: 125000, budget: 13000000, color1: "#dc2626", color2: "#000000", ticketPrice: 35, trainingLevel: 3, youthLevel: 4, dtTransferBudget: 3500000, dtRenewalBudget: 2000000, fanApproval: 81, dt: { id: "dt_mll", name: "Jagoba Arrasate", style: "Solidez y Contraataque", salary: 1900000, reputation: 79, morale: 82 } },
  { id: "lpa", divisionId: "div1", name: "UD Las Palmas", shortName: "Las Palmas", abbr: "LPA", stadium: "Estadio de Gran Canaria", stadiumCapacity: 32400, isRentingStadium: false, stadiumRentFee: 0, fans: 150000, budget: 12000000, color1: "#eab308", color2: "#2563eb", ticketPrice: 30, trainingLevel: 3, youthLevel: 4, dtTransferBudget: 3000000, dtRenewalBudget: 1800000, fanApproval: 78, dt: { id: "dt_lpa", name: "Diego Martínez", style: "Organizado", salary: 1500000, reputation: 76, morale: 77 } },
  { id: "ala", divisionId: "div1", name: "Deportivo Alavés", shortName: "Alavés", abbr: "ALA", stadium: "Mendizorroza", stadiumCapacity: 19840, isRentingStadium: false, stadiumRentFee: 0, fans: 115000, budget: 10000000, color1: "#2563eb", color2: "#ffffff", ticketPrice: 30, trainingLevel: 3, youthLevel: 3, dtTransferBudget: 2500000, dtRenewalBudget: 1500000, fanApproval: 79, dt: { id: "dt_ala", name: "Luis García Plaza", style: "Combativo", salary: 1400000, reputation: 75, morale: 78 } },
  { id: "esp", divisionId: "div1", name: "RCD Espanyol", shortName: "Espanyol", abbr: "ESP", stadium: "Stage Front Stadium", stadiumCapacity: 40000, isRentingStadium: false, stadiumRentFee: 0, fans: 180000, budget: 12000000, color1: "#2563eb", color2: "#ffffff", ticketPrice: 35, trainingLevel: 4, youthLevel: 5, dtTransferBudget: 3000000, dtRenewalBudget: 1800000, fanApproval: 77, dt: { id: "dt_esp", name: "Manolo González", style: "Pragmático", salary: 1300000, reputation: 74, morale: 76 } },
  { id: "leg", divisionId: "div1", name: "CD Leganés", shortName: "Leganés", abbr: "LEG", stadium: "Estadio Municipal de Butarque", stadiumCapacity: 12450, isRentingStadium: false, stadiumRentFee: 0, fans: 95000, budget: 9500000, color1: "#2563eb", color2: "#ffffff", ticketPrice: 28, trainingLevel: 2, youthLevel: 3, dtTransferBudget: 2200000, dtRenewalBudget: 1200000, fanApproval: 80, dt: { id: "dt_leg", name: "Borja Jiménez", style: "Táctico", salary: 1200000, reputation: 73, morale: 79 } },
  { id: "vll", divisionId: "div1", name: "Real Valladolid", shortName: "Valladolid", abbr: "VLL", stadium: "Estadio José Zorrilla", stadiumCapacity: 27618, isRentingStadium: false, stadiumRentFee: 0, fans: 140000, budget: 9000000, color1: "#9333ea", color2: "#ffffff", ticketPrice: 28, trainingLevel: 3, youthLevel: 3, dtTransferBudget: 2000000, dtRenewalBudget: 1200000, fanApproval: 76, dt: { id: "dt_vll", name: "Paulo Pezzolano", style: "Intensidad", salary: 1200000, reputation: 72, morale: 75 } },

  // ================= 2ª DIVISIÓN (20 REAL TEAMS) =================
  { id: "zrg", divisionId: "div2", name: "Real Zaragoza", shortName: "Zaragoza", abbr: "ZRG", stadium: "Estadio La Romareda", stadiumCapacity: 33608, isRentingStadium: false, stadiumRentFee: 0, fans: 180000, budget: 12000000, color1: "#2563eb", color2: "#ffffff", ticketPrice: 25, trainingLevel: 4, youthLevel: 5, dtTransferBudget: 3000000, dtRenewalBudget: 1500000, fanApproval: 82, dt: { id: "dt_zrg", name: "Víctor Fernández", style: "Histórico y Posesión", salary: 1500000, reputation: 78, morale: 80 } },
  { id: "ovi", divisionId: "div2", name: "Real Oviedo", shortName: "R. Oviedo", abbr: "OVI", stadium: "Estadio Carlos Tartiere", stadiumCapacity: 30500, isRentingStadium: false, stadiumRentFee: 0, fans: 140000, budget: 9500000, color1: "#1d4ed8", color2: "#ffffff", ticketPrice: 24, trainingLevel: 4, youthLevel: 4, dtTransferBudget: 2200000, dtRenewalBudget: 1200000, fanApproval: 84, dt: { id: "dt_ovi", name: "Javi Calleja", style: "Pragmático", salary: 1200000, reputation: 76, morale: 79 } },
  { id: "spo", divisionId: "div2", name: "Sporting de Gijón", shortName: "Sporting", abbr: "SPO", stadium: "Estadio El Molinón", stadiumCapacity: 30000, isRentingStadium: false, stadiumRentFee: 0, fans: 150000, budget: 10000000, color1: "#dc2626", color2: "#ffffff", ticketPrice: 25, trainingLevel: 4, youthLevel: 6, dtTransferBudget: 2500000, dtRenewalBudget: 1300000, fanApproval: 83, dt: { id: "dt_spo", name: "Rubén Albés", style: "Intenso y Vertical", salary: 1300000, reputation: 77, morale: 81 } },
  { id: "dep", divisionId: "div2", name: "Deportivo de La Coruña", shortName: "Deportivo", abbr: "DEP", stadium: "Estadio Abanca-Riazor", stadiumCapacity: 32490, isRentingStadium: false, stadiumRentFee: 0, fans: 160000, budget: 11000000, color1: "#2563eb", color2: "#ffffff", ticketPrice: 25, trainingLevel: 4, youthLevel: 5, dtTransferBudget: 2800000, dtRenewalBudget: 1400000, fanApproval: 88, dt: { id: "dt_dep", name: "Imanol Idiakez", style: "Combinativo", salary: 1200000, reputation: 75, morale: 85 } },
  { id: "rac", divisionId: "div2", name: "Racing de Santander", shortName: "Racing", abbr: "RAC", stadium: "El Sardinero", stadiumCapacity: 22222, isRentingStadium: false, stadiumRentFee: 0, fans: 120000, budget: 8500000, color1: "#16a34a", color2: "#ffffff", ticketPrice: 22, trainingLevel: 3, youthLevel: 4, dtTransferBudget: 2000000, dtRenewalBudget: 1000000, fanApproval: 85, dt: { id: "dt_rac", name: "José Alberto López", style: "Ofensivo", salary: 1000000, reputation: 74, morale: 82 } },
  { id: "elc", divisionId: "div2", name: "Elche CF", shortName: "Elche", abbr: "ELC", stadium: "Manuel Martínez Valero", stadiumCapacity: 33732, isRentingStadium: false, stadiumRentFee: 0, fans: 110000, budget: 9000000, color1: "#16a34a", color2: "#ffffff", ticketPrice: 23, trainingLevel: 4, youthLevel: 4, dtTransferBudget: 2100000, dtRenewalBudget: 1100000, fanApproval: 80, dt: { id: "dt_elc", name: "Eder Sarabia", style: "Posesión", salary: 1100000, reputation: 75, morale: 80 } },
  { id: "lev", divisionId: "div2", name: "Levante UD", shortName: "Levante", abbr: "LEV", stadium: "Ciutat de València", stadiumCapacity: 26354, isRentingStadium: false, stadiumRentFee: 0, fans: 130000, budget: 9200000, color1: "#2563eb", color2: "#dc2626", ticketPrice: 24, trainingLevel: 4, youthLevel: 4, dtTransferBudget: 2200000, dtRenewalBudget: 1200000, fanApproval: 81, dt: { id: "dt_lev", name: "Julián Calero", style: "Organizado", salary: 1150000, reputation: 76, morale: 81 } },
  { id: "eib", divisionId: "div2", name: "SD Eibar", shortName: "Eibar", abbr: "EIB", stadium: "Ipurua", stadiumCapacity: 8164, isRentingStadium: false, stadiumRentFee: 0, fans: 70000, budget: 8000000, color1: "#2563eb", color2: "#dc2626", ticketPrice: 22, trainingLevel: 4, youthLevel: 3, dtTransferBudget: 1800000, dtRenewalBudget: 900000, fanApproval: 83, dt: { id: "dt_eib", name: "Joseba Etxeberria", style: "Presión Alta", salary: 1000000, reputation: 75, morale: 80 } },
  { id: "ten", divisionId: "div2", name: "CD Tenerife", shortName: "Tenerife", abbr: "TEN", stadium: "Heliodoro Rodríguez López", stadiumCapacity: 22824, isRentingStadium: false, stadiumRentFee: 0, fans: 100000, budget: 7500000, color1: "#2563eb", color2: "#ffffff", ticketPrice: 20, trainingLevel: 3, youthLevel: 3, dtTransferBudget: 1600000, dtRenewalBudget: 800000, fanApproval: 78, dt: { id: "dt_ten", name: "Oscar Cano", style: "Combinativo", salary: 900000, reputation: 72, morale: 76 } },
  { id: "mlg", divisionId: "div2", name: "Málaga CF", shortName: "Málaga", abbr: "MLG", stadium: "La Rosaleda", stadiumCapacity: 30044, isRentingStadium: false, stadiumRentFee: 0, fans: 160000, budget: 8800000, color1: "#38bdf8", color2: "#ffffff", ticketPrice: 22, trainingLevel: 4, youthLevel: 5, dtTransferBudget: 2000000, dtRenewalBudget: 1000000, fanApproval: 86, dt: { id: "dt_mlg", name: "Sergio Pellicer", style: "Cantera e Intensidad", salary: 950000, reputation: 74, morale: 83 } },
  { id: "cad", divisionId: "div2", name: "Cádiz CF", shortName: "Cádiz", abbr: "CAD", stadium: "Nuevo Mirandilla", stadiumCapacity: 20724, isRentingStadium: false, stadiumRentFee: 0, fans: 120000, budget: 9000000, color1: "#eab308", color2: "#2563eb", ticketPrice: 23, trainingLevel: 3, youthLevel: 3, dtTransferBudget: 2100000, dtRenewalBudget: 1100000, fanApproval: 79, dt: { id: "dt_cad", name: "Paco López", style: "Ofensivo", salary: 1100000, reputation: 76, morale: 78 } },
  { id: "grn", divisionId: "div2", name: "Granada CF", shortName: "Granada", abbr: "GRN", stadium: "Nuevo Los Cármenes", stadiumCapacity: 19336, isRentingStadium: false, stadiumRentFee: 0, fans: 110000, budget: 9200000, color1: "#dc2626", color2: "#ffffff", ticketPrice: 23, trainingLevel: 3, youthLevel: 3, dtTransferBudget: 2200000, dtRenewalBudget: 1100000, fanApproval: 77, dt: { id: "dt_grn", name: "Guillermo Abascal", style: "Táctico", salary: 1000000, reputation: 73, morale: 75 } },
  { id: "alb", divisionId: "div2", name: "Albacete Balompié", shortName: "Albacete", abbr: "ALB", stadium: "Carlos Belmonte", stadiumCapacity: 17524, isRentingStadium: false, stadiumRentFee: 0, fans: 80000, budget: 6500000, color1: "#ffffff", color2: "#000000", ticketPrice: 20, trainingLevel: 3, youthLevel: 3, dtTransferBudget: 1300000, dtRenewalBudget: 700000, fanApproval: 80, dt: { id: "dt_alb", name: "Alberto González", style: "Combativo", salary: 800000, reputation: 71, morale: 80 } },
  { id: "bur", divisionId: "div2", name: "Burgos CF", shortName: "Burgos", abbr: "BUR", stadium: "El Plantío", stadiumCapacity: 12194, isRentingStadium: false, stadiumRentFee: 0, fans: 75000, budget: 6800000, color1: "#ffffff", color2: "#000000", ticketPrice: 20, trainingLevel: 3, youthLevel: 2, dtTransferBudget: 1400000, dtRenewalBudget: 750000, fanApproval: 81, dt: { id: "dt_bur", name: "Bolo", style: "Defensivo", salary: 850000, reputation: 72, morale: 80 } },
  { id: "car", divisionId: "div2", name: "FC Cartagena", shortName: "Cartagena", abbr: "CAR", stadium: "Cartagonova", stadiumCapacity: 15105, isRentingStadium: false, stadiumRentFee: 0, fans: 65000, budget: 6000000, color1: "#000000", color2: "#ffffff", ticketPrice: 18, trainingLevel: 2, youthLevel: 2, dtTransferBudget: 1100000, dtRenewalBudget: 600000, fanApproval: 78, dt: { id: "dt_car", name: "Abelardo Fernández", style: "Pragmático", salary: 800000, reputation: 73, morale: 77 } },
  { id: "eld", divisionId: "div2", name: "CD Eldense", shortName: "Eldense", abbr: "ELD", stadium: "Nuevo Pepico Amat", stadiumCapacity: 4036, isRentingStadium: false, stadiumRentFee: 0, fans: 40000, budget: 5000000, color1: "#dc2626", color2: "#2563eb", ticketPrice: 18, trainingLevel: 2, youthLevel: 2, dtTransferBudget: 900000, dtRenewalBudget: 500000, fanApproval: 82, dt: { id: "dt_eld", name: "Dani Ponz", style: "Ordenado", salary: 700000, reputation: 69, morale: 80 } },
  { id: "hue", divisionId: "div2", name: "SD Huesca", shortName: "Huesca", abbr: "HUE", stadium: "El Alcoraz", stadiumCapacity: 9128, isRentingStadium: false, stadiumRentFee: 0, fans: 55000, budget: 5800000, color1: "#dc2626", color2: "#2563eb", ticketPrice: 19, trainingLevel: 3, youthLevel: 2, dtTransferBudget: 1000000, dtRenewalBudget: 550000, fanApproval: 79, dt: { id: "dt_hue", name: "Antonio Hidalgo", style: "Equilibrado", salary: 750000, reputation: 71, morale: 79 } },
  { id: "mir", divisionId: "div2", name: "CD Mirandés", shortName: "Mirandés", abbr: "MIR", stadium: "Anduva", stadiumCapacity: 5759, isRentingStadium: false, stadiumRentFee: 0, fans: 35000, budget: 4800000, color1: "#dc2626", color2: "#000000", ticketPrice: 18, trainingLevel: 2, youthLevel: 2, dtTransferBudget: 800000, dtRenewalBudget: 450000, fanApproval: 84, dt: { id: "dt_mir", name: "Alessio Lisci", style: "Jóvenes de Cesión", salary: 650000, reputation: 70, morale: 82 } },
  { id: "fer", divisionId: "div2", name: "Racing Ferrol", shortName: "Ferrol", abbr: "FER", stadium: "A Malata", stadiumCapacity: 12043, isRentingStadium: false, stadiumRentFee: 0, fans: 50000, budget: 5500000, color1: "#16a34a", color2: "#ffffff", ticketPrice: 19, trainingLevel: 2, youthLevel: 2, dtTransferBudget: 950000, dtRenewalBudget: 500000, fanApproval: 81, dt: { id: "dt_fer", name: "Cristóbal Parralo", style: "Táctico", salary: 750000, reputation: 72, morale: 80 } },
  { id: "cor", divisionId: "div2", name: "Córdoba CF", shortName: "Córdoba", abbr: "COR", stadium: "El Arcángel", stadiumCapacity: 20989, isRentingStadium: false, stadiumRentFee: 0, fans: 90000, budget: 6200000, color1: "#16a34a", color2: "#ffffff", ticketPrice: 20, trainingLevel: 3, youthLevel: 3, dtTransferBudget: 1200000, dtRenewalBudget: 650000, fanApproval: 85, dt: { id: "dt_cor", name: "Iván Ania", style: "Ofensivo", salary: 800000, reputation: 72, morale: 83 } },

  // ================= 3ª DIVISIÓN (20 100% GENERIC TEAMS) =================
  ...generateGeneric3rdDivClubs()
];

// Helper to generate 20 generic 3rd division clubs
function generateGeneric3rdDivClubs(): Club[] {
  const genericNames = [
    { name: "CD Ribera del Duero", abbr: "RBD", color1: "#dc2626" },
    { name: "Atlético Numancia Sur", abbr: "ANS", color1: "#2563eb" },
    { name: "Sporting de Guadiana", abbr: "SGD", color1: "#16a34a" },
    { name: "Unión Deportiva Alcarria", abbr: "UDA", color1: "#eab308" },
    { name: "Estrella de Levante CF", abbr: "ELC", color1: "#7c3aed" },
    { name: "CD Vallecas Sur", abbr: "CVS", color1: "#38bdf8" },
    { name: "Real Iberia CF", abbr: "IBC", color1: "#dc2626" },
    { name: "CF Ciudad de Ronda", abbr: "CDR", color1: "#2563eb" },
    { name: "CD Campiña Alta", abbr: "CCA", color1: "#16a34a" },
    { name: "Deportivo Mar Menor", abbr: "DMM", color1: "#0284c7" },
    { name: "Unión Sierra Morena", abbr: "USM", color1: "#b45309" },
    { name: "CD Hoya de Alcoy", abbr: "HAX", color1: "#059669" },
    { name: "Atlético Vegas Bajas", abbr: "AVB", color1: "#ef4444" },
    { name: "CF Campo de Calatrava", abbr: "CCC", color1: "#7c3aed" },
    { name: "CD Valdeorras", abbr: "VDR", color1: "#2563eb" },
    { name: "Sporting Costa Cálida", abbr: "SCC", color1: "#eab308" },
    { name: "CD Montes de Toledo", abbr: "MDT", color1: "#16a34a" },
    { name: "Real Murcia B", abbr: "RMB", color1: "#dc2626" },
    { name: "Hércules B", abbr: "HCF", color1: "#2563eb" },
    { name: "CD Recreativo Filial", abbr: "RFIL", color1: "#0284c7" }
  ];

  return genericNames.map((item, idx) => ({
    id: `gen_div3_${idx + 1}`,
    divisionId: "div3",
    name: item.name,
    shortName: item.name.replace("Deportivo ", "").replace("Unión ", "").replace("Sporting de ", "").replace("Atlético ", ""),
    abbr: item.abbr,
    stadium: `Campo Municipal de ${item.abbr}`,
    stadiumCapacity: 1500,
    isRentingStadium: true,
    stadiumRentFee: 2500,
    fans: 1200 + Math.floor(Math.random() * 800),
    budget: 350000 + Math.floor(Math.random() * 200000),
    color1: item.color1,
    color2: "#ffffff",
    ticketPrice: 12,
    trainingLevel: 1,
    youthLevel: 1,
    dtTransferBudget: 60000,
    dtRenewalBudget: 40000,
    fanApproval: 85,
    dt: {
      id: `dt_gen_${idx}`,
      name: `Entrenador Genérico ${idx + 1}`,
      style: "Pragmático y Regional",
      salary: 45000,
      reputation: 60,
      morale: 80
    }
  }));
}
