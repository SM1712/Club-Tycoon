export const FIRST_NAMES: string[] = [
  "Mateo", "Lucas", "Alejandro", "Carlos", "Gabriel", "Diego", "Santiago", "Samuel", "Rodrigo", "Enzo",
  "Hugo", "Leo", "Daniel", "Marcos", "Bruno", "Álvaro", "Mario", "Manuel", "David", "Pablo",
  "Javier", "Adrián", "Sergio", "Gonzalo", "Ignacio", "Joan", "Marc", "Pau", "Pol", "Iker",
  "Alex", "Unai", "Ander", "Iñigo", "Mikel", "Aitor", "Jon", "Kepa", "Héctor", "Óscar",
  "Nicolás", "Martín", "Joaquín", "Fernando", "Rafael", "Guillermo", "Jaime", "Tomás", "Andrés", "Felipe",
  "Rubén", "Iván", "Cristian", "Raúl", "Antonio", "José", "Francisco", "Miguel", "Luis", "Jorge",
  "Ramón", "Alberto", "Esteban", "César", "Pedro", "Víctor", "Eduardo", "Roberto", "Agustín", "Alfonso",
  "Mauricio", "Sebastián", "Thiago", "Lautaro", "Julián", "Facundo", "Benjamín", "Emiliano", "Santino", "Valentín",
  "Juan", "Germán", "Damián", "Gastón", "Matías", "Franco", "Maximiliano", "Federico", "Luciano", "Alexis",
  "Fabricio", "Ezequiel", "Leandro", "Mariano", "Hernán", "Abel", "Adolfo", "Alan", "Albert", "Aldo",
  "Alonso", "Amador", "Ángel", "Arturo", "Asier", "Augusto", "Bartolomé", "Beltrán", "Bernardo", "Borja",
  "Carles", "Christian", "Cristóbal", "Dídac", "Domingo", "Eloy", "Emilio", "Enric", "Eric", "Ernesto",
  "Eugeni", "Eneko", "Fabián", "Félix", "Fidel", "Francesc", "Gaizka", "Gerard", "Gustavo", "Iñaki",
  "Ismael", "Jaume", "Jesús", "Josep", "Lluc", "Lorenzo", "Miquel", "Nahuel", "Noel", "Oriol",
  "Ramiro", "Ricardo", "Robert", "Salvador", "Santi", "Saúl", "Sergi", "Silvestre", "Telmo", "Urbano",
  "Vicente", "Xavier", "Yeray", "Brais", "Chema", "Cesc", "Dennis", "Derek", "Dylan", "Elias",
  "Ethan", "Ferran", "Fran", "Ian", "Isaac", "Jacobo", "Jan", "Joel", "Kerman", "Kike",
  "Lamine", "Manel", "Martí", "Nel", "Nico", "Néstor", "Oliver", "Otto", "Pep", "Quim",
  "Rafa", "Rene", "Ricard", "Roch", "Salva", "Samu", "Sebas", "Sira", "Tuto", "Uriel",
  "Valero", "Vidal", "Xavi", "Xabi", "Yago", "Zacarías", "Zaid", "Biel", "Arnau"
];

export const LAST_NAMES: string[] = [
  "García", "Rodríguez", "González", "Fernández", "López", "Martínez", "Sánchez", "Pérez", "Gómez", "Martín",
  "Jiménez", "Ruiz", "Hernández", "Díaz", "Moreno", "Muñoz", "Álvarez", "Romero", "Alonso", "Gutiérrez",
  "Navarro", "Torres", "Domínguez", "Vázquez", "Ramos", "Gil", "Ramírez", "Serrano", "Blanco", "Molina",
  "Morales", "Suárez", "Ortega", "Delgado", "Castro", "Ortiz", "Rubín", "Marín", "Sanz", "Núñez",
  "Iglesias", "Medina", "Garrido", "Santos", "Castillo", "Cortés", "Lozano", "Guerrero", "Cano", "Prieto",
  "Méndez", "Cruz", "Gallego", "Vidal", "Herrera", "Peña", "León", "Márquez", "Cabrera", "Flores",
  "Campos", "Vega", "Fuentes", "Carrasco", "Díez", "Reyes", "Caballero", "Nieto", "Aguilar", "Santana",
  "Pascual", "Herrero", "Montero", "Hidalgo", "Giménez", "Ibáñez", "Ferrero", "Lorenzo", "Santiago", "Soler",
  "Bravo", "Esteban", "Gallardo", "Durán", "Mora", "Vicente", "Arias", "Carmona", "Valero", "Sáez",
  "Paredes", "Villa", "Moya", "Calvo", "Pastor", "Merino", "Crespo", "Roldán", "Benítez", "Redondo",
  "Soriano", "Román", "Velasco", "Parra", "Lara", "Izquierdo", "Cordero", "Valls", "Sola", "Sáenz",
  "Font", "Oliver", "Bosch", "Pons", "Serra", "Vila", "Mas", "Pujol", "Roca", "Roig",
  "Coll", "Grau", "Solé", "Costa", "Ribas", "Riera", "Sala", "Pagès", "Prat", "Busquets",
  "Ventura", "Nadal", "Sabater", "Casals", "Ferrer", "Company", "Cardona", "Barberá", "Castells", "Domènech",
  "Figueras", "Gual", "Jané", "Llopis", "Martí", "Miralles", "Noguera", "Oliveras", "Padró", "Queralt",
  "Reig", "Salvat", "Torrent", "Urgell", "Xirau", "Yáñez", "Zamorano", "Zúñiga", "Abad", "Alarcón",
  "Alcaraz", "Alemán", "Amorós", "Angulo", "Aparicio", "Aragonés", "Arenas", "Aranda", "Armas", "Arribas",
  "Arroyo", "Asensio", "Azaña", "Badía", "Balaguer", "Ballester", "Barba", "Barrena", "Barrio", "Barros",
  "Bermejo", "Bernal", "Blázquez", "Botella", "Bueno", "Burgos", "Bustos", "Cabello", "Calero", "Calleja",
  "Cárdenas", "Carrión", "Casado", "Casas", "Castellano", "Cebrián", "Chamorro", "Clavero", "Clemente", "Cobo"
];

export function getRandomFirstName(): string {
  return FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
}

export function getRandomLastName(): string {
  return LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
}

export function getRandomPlayerName(): string {
  return `${getRandomFirstName()} ${getRandomLastName()}`;
}

export function getRandomContractYears(): number {
  return Math.floor(Math.random() * 5) + 1; // 1, 2, 3, 4, or 5 years
}

export function calculateBalancedPlayerValueAndSalary(
  ovr: number,
  age: number,
  potential: number = ovr
): { value: number; salary: number } {
  const normOvr = Math.max(45, ovr);
  const baseValue = Math.pow(normOvr / 10, 5.2) * 4.5 + (normOvr - 45) * 2000;

  let ageMultiplier = 1.0;
  if (age <= 21) {
    const potDiff = Math.max(0, potential - ovr);
    ageMultiplier = 1.25 + potDiff * 0.04;
  } else if (age >= 30) {
    ageMultiplier = Math.max(0.2, 1.0 - (age - 29) * 0.08);
  }

  const finalValueRaw = baseValue * ageMultiplier;

  let finalValue: number;
  if (finalValueRaw < 500000) {
    finalValue = Math.round(finalValueRaw / 5000) * 5000;
  } else if (finalValueRaw < 5000000) {
    finalValue = Math.round(finalValueRaw / 50000) * 50000;
  } else {
    finalValue = Math.round(finalValueRaw / 250000) * 250000;
  }
  finalValue = Math.max(25000, finalValue);

  let salaryRate = 0.14 - (normOvr / 1000);
  if (normOvr < 60) salaryRate = 0.18;

  let rawSalary = finalValue * salaryRate;

  if (normOvr <= 55) rawSalary = Math.min(rawSalary, 32000);
  if (normOvr <= 60) rawSalary = Math.min(rawSalary, 55000);

  let finalSalary: number;
  if (rawSalary < 100000) {
    finalSalary = Math.round(rawSalary / 1000) * 1000;
  } else {
    finalSalary = Math.round(rawSalary / 10000) * 10000;
  }
  finalSalary = Math.max(12000, finalSalary);

  return { value: finalValue, salary: finalSalary };
}
