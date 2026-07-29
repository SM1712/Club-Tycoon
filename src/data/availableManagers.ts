import { ManagerDT } from '../types';

function generate100Managers(): ManagerDT[] {
  const managers: ManagerDT[] = [
    // Top Elite Managers (Tier 1)
    { id: "dt_m1", name: "Zinedine Zidane", style: "Manejo de Estrellas y Ofensivo", salary: 8500000, reputation: 94, morale: 90, tier: 1, photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Zinedine_Zidane_by_Tasnim_03.jpg/440px-Zinedine_Zidane_by_Tasnim_03.jpg" },
    { id: "dt_m2", name: "Jürgen Klopp", style: "Gegenpressing e Intensidad", salary: 9000000, reputation: 95, morale: 92, tier: 1, photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/J%C3%BCrgen_Klopp_2019.jpg/440px-J%C3%BCrgen_Klopp_2019.jpg" },
    { id: "dt_m3", name: "Xavi Hernández", style: "Tiki-Taka y Posesión", salary: 5000000, reputation: 87, morale: 85, tier: 1, photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Xavi_Hern%C3%A1ndez_2019.jpg/440px-Xavi_Hern%C3%A1ndez_2019.jpg" },
    { id: "dt_m4", name: "Mauricio Pochettino", style: "Presión Alta y Jóvenes", salary: 6000000, reputation: 86, morale: 84, tier: 1, photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Mauricio_Pochettino_2016.jpg/440px-Mauricio_Pochettino_2016.jpg" },
    { id: "dt_m5", name: "Rafa Benítez", style: "Táctico y Disciplinado", salary: 3500000, reputation: 82, morale: 80, tier: 1, photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Rafael_Ben%C3%ADtez_2015.jpg/440px-Rafael_Ben%C3%ADtez_2015.jpg" },
    { id: "dt_m6", name: "Quique Setién", style: "Posesión Extrema", salary: 2000000, reputation: 77, morale: 75, tier: 2 },
    { id: "dt_m7", name: "Guti Hernández", style: "Cantera y Talento", salary: 1200000, reputation: 74, morale: 85, tier: 2 }
  ];

  const spanishFirstNames = ["Carlos", "Javier", "Manuel", "Antonio", "Fernando", "Roberto", "David", "Álvaro", "Luis", "Ignacio", "Jorge", "Pablo", "Santiago", "Gonzalo", "Diego", "Miguel", "Enrique", "Ramón", "Vicente", "Marcos"];
  const spanishLastNames = ["García", "Fernández", "González", "Rodríguez", "López", "Martínez", "Sánchez", "Pérez", "Gómez", "Navarro", "Ruiz", "Díaz", "Serrano", "Muñoz", "Blanco", "Molina", "Morales", "Ortega", "Delgado", "Castro"];
  const styles = ["Ofensivo Directo", "Presión Alta", "Bloque Bajo y Contra", "Posesión y Control", "Pragmático y Físico", "Cantera e Intensidad", "Equilibrado", "Táctico Regional"];

  // Generate 95 regional and division-tiered managers
  for (let i = 8; i <= 105; i++) {
    const fname = spanishFirstNames[Math.floor(Math.random() * spanishFirstNames.length)];
    const lname1 = spanishLastNames[Math.floor(Math.random() * spanishLastNames.length)];
    const lname2 = spanishLastNames[Math.floor(Math.random() * spanishLastNames.length)];
    const style = styles[Math.floor(Math.random() * styles.length)];

    let salary = 35000;
    let rep = 60;
    let tier: 1 | 2 | 3 = 3;

    if (i > 70) {
      // 1st Div Tier
      salary = Math.round((800000 + Math.random() * 2500000) / 10000) * 10000;
      rep = 78 + Math.floor(Math.random() * 15);
      tier = 1;
    } else if (i > 35) {
      // 2nd Div Tier
      salary = Math.round((120000 + Math.random() * 450000) / 5000) * 5000;
      rep = 68 + Math.floor(Math.random() * 10);
      tier = 2;
    } else {
      // 3rd Div Tier (Modest & Accessible)
      salary = Math.round((25000 + Math.random() * 65000) / 2500) * 2500;
      rep = 55 + Math.floor(Math.random() * 10);
      tier = 3;
    }

    managers.push({
      id: `dt_gen_pool_${i}`,
      name: `${fname} ${lname1} ${lname2}`,
      style,
      salary,
      reputation: rep,
      morale: 80 + Math.floor(Math.random() * 15),
      tier
    });
  }

  return managers;
}

export const AVAILABLE_MANAGERS: ManagerDT[] = generate100Managers();
