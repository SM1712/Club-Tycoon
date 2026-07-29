export interface PresidentEventOption {
  text: string;
  effectLabel: string;
  moneyChange?: number;
  dtMoraleChange?: number;
  fanApprovalChange?: number;
  reputationChange?: number;
  dtTransferBudgetChange?: number;
}

export interface PresidentEvent {
  id: string;
  title: string;
  type: 'POSITIVE' | 'NEGATIVE' | 'DILEMMA' | 'RARE';
  description: string;
  options: PresidentEventOption[];
}

export const PRESIDENT_EVENTS: PresidentEvent[] = [
  {
    id: 'evt_01',
    title: '🏺 Cuadro Antiguo en el Trastero',
    type: 'RARE',
    description: 'Limpiando el trastero del estadio, el utillero ha encontrado una pintura al óleo del primer presidente. ¡Un anticuario ofrece comprarlo!',
    options: [
      { text: 'Vender al anticuario local', effectLabel: '+€35.000 a la tesorería', moneyChange: 35000, fanApprovalChange: -2 },
      { text: 'Donar al museo del pueblo', effectLabel: '+8% Aprobación de la afición', fanApprovalChange: 8, reputationChange: 3 }
    ]
  },
  {
    id: 'evt_02',
    title: '💈 El Rumor de los Implantes',
    type: 'RARE',
    description: 'En redes circula el chisme de que el presidente del rival gastó el presupuesto del estadio en un viaje a Turquía para hacerse implantes de pelo.',
    options: [
      { text: 'Publicar una indirecta graciosa', effectLabel: '+12% Viralidad en redes y +€5.000 en merchandising', moneyChange: 5000, fanApprovalChange: 5 },
      { text: 'Mantener el decoro directivo', effectLabel: '+5 Reputación Institucional', reputationChange: 5 }
    ]
  },
  {
    id: 'evt_03',
    title: '🍿 La Patrocinadora de las Fiestas',
    type: 'POSITIVE',
    description: 'La churrería más famosa de la comarca quiere patrocinar los descansos del partido regalando chocolate con churros a la grada.',
    options: [
      { text: 'Aceptar el acuerdo folclórico', effectLabel: '+€15.000 e hinchada feliz (+5%)', moneyChange: 15000, fanApprovalChange: 5 },
      { text: 'Exigir patrocinador de salud', effectLabel: 'Sin cambios', reputationChange: 1 }
    ]
  },
  {
    id: 'evt_04',
    title: '🕳️ Invasión de Topos en el Césped',
    type: 'NEGATIVE',
    description: 'Una familia de topos ha dejado el campo lleno de hoyos a 48 horas del próximo partido.',
    options: [
      { text: 'Contratar fumigación exprés de lujo', effectLabel: '-€12.000 de tesorería', moneyChange: -12000 },
      { text: 'Que los juveniles tapen los hoyos con tierra', effectLabel: '-5% Moral del DT por jugar en patatal', dtMoraleChange: -5 }
    ]
  },
  {
    id: 'evt_05',
    title: '🍺 La Peña "El Penalty" Exige Barra',
    type: 'DILEMMA',
    description: 'La peña más ruidosa del estadio pide gestionar la cantina del estadio en exclusiva a cambio de animación ininterrumpida.',
    options: [
      { text: 'Conceder la cantina a la peña', effectLabel: '+10% Aprobación de afición, -€8.000 ingresos cantina', moneyChange: -8000, fanApprovalChange: 10 },
      { text: 'Mantener la licitación profesional', effectLabel: '+€12.000 ingresos comerciales', moneyChange: 12000, fanApprovalChange: -3 }
    ]
  },
  {
    id: 'evt_06',
    title: '📺 Grabación de un Documental Cómico',
    type: 'RARE',
    description: 'Una plataforma de televisión quiere grabar un capítulo sobre la vida de un club humilde. ¡Prometen difusión y dinero!',
    options: [
      { text: 'Permitir cámaras en el vestuario', effectLabel: '+€50.000 de televisión, -4% Moral del DT', moneyChange: 50000, dtMoraleChange: -4 },
      { text: 'Rechazar por privacidad táctica', effectLabel: '+5% Moral del DT', dtMoraleChange: 5 }
    ]
  },
  {
    id: 'evt_07',
    title: '⚡ Subidón en la Factura de la Luz',
    type: 'NEGATIVE',
    description: 'La compañía eléctrica ha enviado una rectificación de tarifa por los focos del estadio.',
    options: [
      { text: 'Pagar la factura de inmediato', effectLabel: '-€18.000 en tesorería', moneyChange: -18000 },
      { text: 'Instalar focos LED de bajo consumo', effectLabel: '-€25.000 hoy, pero ahorras a futuro', moneyChange: -25000, reputationChange: 3 }
    ]
  },
  {
    id: 'evt_08',
    title: '🥩 Donación del Pescador del Pueblo',
    type: 'POSITIVE',
    description: 'Un socio antiguo que ha ganado la lotería quiere regalar €40.000 al club para fichajes.',
    options: [
      { text: 'Aceptar el dinero para el DT', effectLabel: '+€40.000 al Fondo del DT', dtTransferBudgetChange: 40000 },
      { text: 'Destinarlo a pagar deudas del club', effectLabel: '+€40.000 al Presupuesto Libre', moneyChange: 40000 }
    ]
  },
  {
    id: 'evt_09',
    title: '🕺 El Peinado Neón del Extremo',
    type: 'DILEMMA',
    description: 'Tu extremo titular se ha teñido el pelo de amarillo neón brillante y la afición no para de hacer memes.',
    options: [
      { text: 'Sacar camisetas con la silueta del peinado', effectLabel: '+€10.000 por ventas de tienda', moneyChange: 10000 },
      { text: 'Exigirle discreción institucional', effectLabel: '-3% Moral del jugador', dtMoraleChange: 2 }
    ]
  },
  {
    id: 'evt_10',
    title: '🔊 Megafonía Estropeada',
    type: 'NEGATIVE',
    description: 'El altavoz del estadio se ha roto y ahora suena como un pato desafinado durante los alineaciones.',
    options: [
      { text: 'Comprar equipo de sonido nuevo', effectLabel: '-€6.000 de tesorería', moneyChange: -6000 },
      { text: 'Usar un megáfono manual a viva voz', effectLabel: '+4% Humor de la afición', fanApprovalChange: 4 }
    ]
  },
  {
    id: 'evt_11',
    title: '🏆 El Trofeo de 1982 Encontrado',
    type: 'RARE',
    description: 'Una taberna vecina tenía la Copa Regional de 1982 guardada detrás de los barriles de cerveza.',
    options: [
      { text: 'Comprarla por una cena e instalarla en el club', effectLabel: '-€500, +5% Afición feliz', moneyChange: -500, fanApprovalChange: 5 }
    ]
  },
  {
    id: 'evt_12',
    title: '🥐 Desayuno de Hermandad con la Prensa',
    type: 'POSITIVE',
    description: 'Invitas a los periodistas locales a un almuerzo en la sede del club.',
    options: [
      { text: 'Pagar el banquete comarcal', effectLabel: '-€2.000, +8 Reputación de prensa', moneyChange: -2000, reputationChange: 8 }
    ]
  },
  {
    id: 'evt_13',
    title: '🚌 Avería en el Autobús del Equipo',
    type: 'NEGATIVE',
    description: 'El motor del autocar del primer equipo echa humo a 2 días del desplazamiento de liga.',
    options: [
      { text: 'Alquilar autocar VIP con WiFi', effectLabel: '-€9.000 de tesorería', moneyChange: -9000 },
      { text: 'Viajar en coches particulares compartidos', effectLabel: '-4% Moral del DT', dtMoraleChange: -4 }
    ]
  },
  {
    id: 'evt_14',
    title: '🐕 El Perro Invasor del Entrenamiento',
    type: 'RARE',
    description: 'Un perro callejero simpático se ha colado en el entrenamiento y ha robado el balón al DT.',
    options: [
      { text: 'Adoptarlo como mascota oficial del club', effectLabel: '+10% Aprobación de la afición', fanApprovalChange: 10 },
      { text: 'Devolverlo amablemente al parque', effectLabel: 'Sin cambios', reputationChange: 1 }
    ]
  },
  {
    id: 'evt_15',
    title: '💎 Oferta del Magnate Excéntrico',
    type: 'RARE',
    description: 'Un inversor extranjero ofrece €200.000 inmediatos si le dejas tirar un penalti honorífico antes del derbi.',
    options: [
      { text: '¡Aceptar el espectáculo y el dinero!', effectLabel: '+€200.000 de tesorería, -4% Aprobación socios', moneyChange: 200000, fanApprovalChange: -4 },
      { text: 'Rechazar por seriedad competitiva', effectLabel: '+5 Reputación Institucional', reputationChange: 5 }
    ]
  },
  {
    id: 'evt_16',
    title: '🌧️ Tormenta y Goteras en el Vestuario',
    type: 'NEGATIVE',
    description: 'Ha llovido a cánticos y el vestuario local parece una piscina olímpica.',
    options: [
      { text: 'Reparar el tejado con impermeabilización', effectLabel: '-€15.000 de presupuesto', moneyChange: -15000 },
      { text: 'Poner cubos y fregona temporal', effectLabel: '-3% Moral del DT', dtMoraleChange: -3 }
    ]
  },
  {
    id: 'evt_17',
    title: '👕 Camiseta Vintage Agotada',
    type: 'POSITIVE',
    description: 'La reedición retro de la camiseta de los años 90 ha volado en la tienda online.',
    options: [
      { text: 'Hacer una tirada extra masiva', effectLabel: '+€28.000 de beneficio neto', moneyChange: 28000 }
    ]
  },
  {
    id: 'evt_18',
    title: '🎯 Patrocinio de la Barbería Local',
    type: 'POSITIVE',
    description: 'La barbería del barrio quiere poner su cartel en la banda lateral.',
    options: [
      { text: 'Firmar contrato de patrocinio', effectLabel: '+€8.000 de ingresos', moneyChange: 8000 }
    ]
  },
  {
    id: 'evt_19',
    title: '🚨 Multa por Bengala en la Grada',
    type: 'NEGATIVE',
    description: 'La Federación impone una sanción por el humo de celebración de los aficionados.',
    options: [
      { text: 'Pagar la multa federativa', effectLabel: '-€5.000 de tesorería', moneyChange: -5000 }
    ]
  },
  {
    id: 'evt_20',
    title: '🍕 Noche de Pizza tras la Victoria',
    type: 'POSITIVE',
    description: 'El vestuario celebra la racha positiva pidiendo 30 pizzas familiares.',
    options: [
      { text: 'Pagar la cuenta como incentivo', effectLabel: '-€800, +6% Moral del DT y equipo', moneyChange: -800, dtMoraleChange: 6 }
    ]
  }
];
