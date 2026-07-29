import { Club, Match, MatchEvent, Player, Standing } from '../types';

export class MatchSimulationSystem {
  static getMatchDateForWeek(week: number): string {
    const startDate = new Date(2026, 7, 16); // August 16, 2026
    const daysToAdd = (week - 1) * 7;
    const matchDate = new Date(startDate.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
    const dayStr = String(matchDate.getDate()).padStart(2, '0');
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const monthStr = months[matchDate.getMonth()];
    return `${dayStr} ${monthStr} ${matchDate.getFullYear()}`;
  }

  /**
   * Generate 38-week Round Robin Fixtures for 20 clubs (19 Home, 19 Away)
   */
  static generateSeasonFixtures(clubs: Club[], divisionId?: string, divisionName?: string): Match[] {
    const fixtures: Match[] = [];
    const teamIds = clubs.map(c => c.id);
    let matchIdCount = 1;

    const n = teamIds.length;
    if (n < 2) return [];

    const rounds = (n - 1) * 2; // 38 rounds for 20 teams
    const half = n / 2;
    const teams = [...teamIds];

    for (let round = 1; round <= rounds; round++) {
      const matchDateStr = this.getMatchDateForWeek(round);

      for (let i = 0; i < half; i++) {
        const home = round <= (n - 1) ? teams[i] : teams[n - 1 - i];
        const away = round <= (n - 1) ? teams[n - 1 - i] : teams[i];
        const homeClub = clubs.find(c => c.id === home);

        fixtures.push({
          id: `m_${divisionId || 'div'}_w${round}_${matchIdCount++}`,
          week: round,
          divisionId: divisionId || (clubs[0]?.divisionId),
          competitionType: 'LEAGUE',
          competitionName: divisionName || 'Liga Española',
          homeTeamId: home,
          awayTeamId: away,
          played: false,
          events: [],
          matchDate: matchDateStr,
          stadiumName: homeClub ? homeClub.stadium : undefined
        });
      }

      teams.splice(1, 0, teams.pop()!);
    }

    return fixtures;
  }

  static calculateTeamOvr(clubId: string, players: Player[]): number {
    const clubSquad = players.filter(p => p.clubId === clubId);
    if (clubSquad.length === 0) return 60;
    const sorted = [...clubSquad].sort((a, b) => b.ovr - a.ovr);
    const top11 = sorted.slice(0, 11);
    const avg = top11.reduce((sum, p) => sum + p.ovr, 0) / top11.length;
    return Math.round(avg);
  }

  /**
   * Simulate a match and return updated match, players (with XP gain) and club fan impact
   */
  static simulateMatch(
    match: Match,
    clubs: Club[],
    players: Player[]
  ): { updatedMatch: Match; updatedPlayers: Player[]; homeFanChange: number; awayFanChange: number } {
    const homeClub = clubs.find(c => c.id === match.homeTeamId);
    const awayClub = clubs.find(c => c.id === match.awayTeamId);

    if (!homeClub || !awayClub) {
      return { updatedMatch: match, updatedPlayers: players, homeFanChange: 0, awayFanChange: 0 };
    }

    const homeOvrBase = this.calculateTeamOvr(homeClub.id, players);
    const awayOvrBase = this.calculateTeamOvr(awayClub.id, players);

    // Morale calculation
    const homeSquad = players.filter(p => p.clubId === homeClub.id);
    const awaySquad = players.filter(p => p.clubId === awayClub.id);

    const homeAvgMorale = homeSquad.length > 0 ? (homeSquad.reduce((sum, p) => sum + (p.morale ?? 80), 0) / homeSquad.length) : 80;
    const awayAvgMorale = awaySquad.length > 0 ? (awaySquad.reduce((sum, p) => sum + (p.morale ?? 80), 0) / awaySquad.length) : 80;

    const homeMoraleBoost = (homeAvgMorale - 75) * 0.1;
    const awayMoraleBoost = (awayAvgMorale - 75) * 0.1;

    // Stadium & Socios Home Boost (+3 to +6)
    const sociosCount = homeClub.sociosData?.sociosCount || Math.round(homeClub.fans * 0.08);
    const stadiumBoost = Math.min(3, Math.floor((homeClub.stadiumCapacity / 10000) + (sociosCount / 6000)));
    const totalHomeAdvantage = 3 + stadiumBoost;

    // DT Tactical Bonus
    const homeDtBonus = homeClub.dt ? (homeClub.dt.morale > 70 ? 1.5 : 0.5) : 0;
    const awayDtBonus = awayClub.dt ? (awayClub.dt.morale > 70 ? 1.5 : 0.5) : 0;

    const homeOvr = homeOvrBase + totalHomeAdvantage + homeMoraleBoost + homeDtBonus;
    const awayOvr = awayOvrBase + awayMoraleBoost + awayDtBonus;

    const ovrDiff = homeOvr - awayOvr;
    const expectedHomeGoals = Math.max(0, 1.35 + ovrDiff * 0.085 + (Math.random() * 0.6 - 0.3));
    const expectedAwayGoals = Math.max(0, 0.95 - ovrDiff * 0.085 + (Math.random() * 0.6 - 0.3));

    const homeScore = Math.floor(expectedHomeGoals + (Math.random() > 0.5 ? Math.random() : 0));
    const awayScore = Math.floor(expectedAwayGoals + (Math.random() > 0.5 ? Math.random() : 0));

    const events: MatchEvent[] = [];

    // Goal Events
    for (let g = 0; g < homeScore; g++) {
      const scorer = homeSquad[Math.floor(Math.random() * Math.min(6, homeSquad.length))]?.name || homeClub.name;
      events.push({ minute: Math.floor(Math.random() * 88) + 1, type: 'GOAL', playerName: scorer, teamId: homeClub.id });
    }

    for (let g = 0; g < awayScore; g++) {
      const scorer = awaySquad[Math.floor(Math.random() * Math.min(6, awaySquad.length))]?.name || awayClub.name;
      events.push({ minute: Math.floor(Math.random() * 88) + 1, type: 'GOAL', playerName: scorer, teamId: awayClub.id });
    }

    // Yellow Card Events (1 to 3 per match)
    const numYellows = Math.floor(Math.random() * 4);
    for (let y = 0; y < numYellows; y++) {
      const isHomeCard = Math.random() > 0.5;
      const cardSquad = isHomeCard ? homeSquad : awaySquad;
      const cardClubId = isHomeCard ? homeClub.id : awayClub.id;
      if (cardSquad.length > 0) {
        const player = cardSquad[Math.floor(Math.random() * cardSquad.length)];
        events.push({ minute: Math.floor(Math.random() * 85) + 5, type: 'YELLOW', playerName: player.name, teamId: cardClubId });
      }
    }

    // Rare Red Card (5% chance)
    if (Math.random() < 0.05) {
      const isHomeRed = Math.random() > 0.5;
      const redSquad = isHomeRed ? homeSquad : awaySquad;
      const redClubId = isHomeRed ? homeClub.id : awayClub.id;
      if (redSquad.length > 0) {
        const player = redSquad[Math.floor(Math.random() * redSquad.length)];
        events.push({ minute: Math.floor(Math.random() * 70) + 20, type: 'RED', playerName: player.name, teamId: redClubId });
      }
    }

    events.sort((a, b) => a.minute - b.minute);

    // Player XP System
    const updatedPlayers = players.map(p => {
      if (p.clubId === homeClub.id || p.clubId === awayClub.id) {
        const newXp = (p.xp || 0) + 25;
        let newOvr = p.ovr;
        let finalXp = newXp;

        if (newXp >= 100 && p.ovr < p.potential) {
          newOvr += 1;
          finalXp = newXp - 100;
        }

        return { ...p, xp: finalXp, ovr: newOvr };
      }
      return p;
    });

    // Fan dynamics
    let homeFanChange = 0;
    let awayFanChange = 0;

    if (homeScore > awayScore) {
      homeFanChange = Math.round(homeClub.fans * 0.03);
      awayFanChange = -Math.round(awayClub.fans * 0.01);
    } else if (awayScore > homeScore) {
      awayFanChange = Math.round(awayClub.fans * 0.04);
      homeFanChange = -Math.round(homeClub.fans * 0.01);
    }

    const updatedMatch: Match = {
      ...match,
      homeScore,
      awayScore,
      played: true,
      events
    };

    return { updatedMatch, updatedPlayers, homeFanChange, awayFanChange };
  }

  static calculateStandings(clubs: Club[], matches: Match[]): Standing[] {
    const tableMap = new Map<string, Standing>();

    clubs.forEach(c => {
      tableMap.set(c.id, { clubId: c.id, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, pts: 0 });
    });

    matches.filter(m => m.played && m.homeScore !== undefined && m.awayScore !== undefined).forEach(m => {
      const home = tableMap.get(m.homeTeamId);
      const away = tableMap.get(m.awayTeamId);

      if (home && away) {
        home.played += 1;
        away.played += 1;
        home.gf += m.homeScore!;
        home.ga += m.awayScore!;
        away.gf += m.awayScore!;
        away.ga += m.homeScore!;

        if (m.homeScore! > m.awayScore!) {
          home.won += 1;
          home.pts += 3;
          away.lost += 1;
        } else if (m.homeScore! < m.awayScore!) {
          away.won += 1;
          away.pts += 3;
          home.lost += 1;
        } else {
          home.drawn += 1;
          away.drawn += 1;
          home.pts += 1;
          away.pts += 1;
        }
      }
    });

    return Array.from(tableMap.values()).sort((a, b) => {
      if (b.pts !== a.pts) return b.pts - a.pts;
      const diffB = b.gf - b.ga;
      const diffA = a.gf - a.ga;
      if (diffB !== diffA) return diffB - diffA;
      return b.gf - a.gf;
    });
  }
}
