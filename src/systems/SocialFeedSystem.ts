import { Club, Match } from '../types';

export interface SocialPost {
  id: string;
  authorName: string;
  handle: string;
  avatarBg: string;
  content: string;
  likes: number;
  retweets: number;
  timeAgo: string;
  tag?: string;
}

export const HILARIOUS_RUMORS = [
  "Se rumorea que el presidente del rival invirtió el presupuesto del estadio en un viaje a Turquía para un implante de pelo. 💇‍♂️⚽",
  "Dicen en el pueblo que el 9 rival cenó 2 kebabs con picante a 3 horas del partido de hoy. ¡Habrá sorpresa en la 2ª parte! 🥙",
  "Un aficionado en la grada intentó pagar el bocata de tortilla con cromos repetidos del equipo. La cantina aceptó. 🥪",
  "El linier acaba de pedirle un autógrafo al utillero porque pensaba que era una leyenda de los 80. ✍️",
  "La megafonía del estadio ha reproducido sin querer el audio de WhatsApp de la suegra del presidente. 🔊😂",
  "Nuestros juveniles han fundado la Peña 'Los del Fondo' y prometen tirar confeti fabricado con las facturas de la luz. 🎉"
];

export class SocialFeedSystem {
  static generatePosts(userClub: Club, lastMatch: Match | null, week: number): SocialPost[] {
    const posts: SocialPost[] = [];

    // 1. Post from local fan account
    if (lastMatch && lastMatch.played && lastMatch.homeScore !== undefined && lastMatch.awayScore !== undefined) {
      const isUserHome = lastMatch.homeTeamId === userClub.id;
      const userGoals = isUserHome ? lastMatch.homeScore : lastMatch.awayScore;
      const oppGoals = isUserHome ? lastMatch.awayScore : lastMatch.homeScore;

      if (userGoals > oppGoals) {
        posts.push({
          id: `post_${week}_1`,
          authorName: 'Peña La Grada Animada',
          handle: '@LagradaAnimada',
          avatarBg: '#fef08a',
          content: `¡MENUDO PARTIDAZO DE HOY! ¡3 PUNTOS AL SERRÓN Y A CELEBRARLO A LA PLAZA DEL PUEBLO! 🥳⚽ #Vamos${userClub.abbr}`,
          likes: Math.floor(Math.random() * 200) + 120,
          retweets: Math.floor(Math.random() * 45) + 15,
          timeAgo: 'Hace 2h',
          tag: 'Victoria'
        });
      } else if (userGoals < oppGoals) {
        posts.push({
          id: `post_${week}_1`,
          authorName: 'El Crítico del Femenino y Masculino',
          handle: '@OpinionComarcal',
          avatarBg: '#fee2e2',
          content: `Hoy no ha salido nada. Toca apretar los dientes en los entrenamientos y que el míster cambie el esquema el domingo. 😤`,
          likes: Math.floor(Math.random() * 90) + 40,
          retweets: Math.floor(Math.random() * 15) + 5,
          timeAgo: 'Hace 3h',
          tag: 'Post-Partido'
        });
      } else {
        posts.push({
          id: `post_${week}_1`,
          authorName: 'Voces de la Cantera',
          handle: '@FútbolLocal',
          avatarBg: '#dbeafe',
          content: `Empate trabajado en un partido muy disputado. ¡Sumar siempre es bueno fuera de casa! 🤝`,
          likes: Math.floor(Math.random() * 110) + 60,
          retweets: Math.floor(Math.random() * 20) + 8,
          timeAgo: 'Hace 1h',
          tag: 'Empate'
        });
      }
    }

    // 2. Hilarious Rumor post
    const randomRumor = HILARIOUS_RUMORS[week % HILARIOUS_RUMORS.length];
    posts.push({
      id: `post_${week}_2`,
      authorName: 'Noticias & Memes del Barro',
      handle: '@MemesFútbolBarro',
      avatarBg: '#fed7aa',
      content: randomRumor,
      likes: Math.floor(Math.random() * 450) + 300,
      retweets: Math.floor(Math.random() * 120) + 80,
      timeAgo: 'Hace 5h',
      tag: 'VIRAL 🔥'
    });

    // 3. President Fan Club Post
    posts.push({
      id: `post_${week}_3`,
      authorName: 'Diario Deportivo Comarcal',
      handle: '@DeporteRegional',
      avatarBg: '#dcfce7',
      content: `El presupuesto de ${userClub.name} alcanza los €${userClub.budget.toLocaleString('es-ES')}. La directiva evalúa los próximos pasos antes de la siguiente fecha. 📊`,
      likes: Math.floor(Math.random() * 180) + 90,
      retweets: Math.floor(Math.random() * 30) + 12,
      timeAgo: 'Hace 8h',
      tag: 'Institucional'
    });

    return posts;
  }
}
