const img = (icon, accent, label) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="110" viewBox="0 0 180 110"><rect width="180" height="110" rx="24" fill="#fff"/><rect x="14" y="14" width="152" height="82" rx="18" fill="${accent}"/><circle cx="56" cy="56" r="24" fill="rgba(255,255,255,0.24)"/><text x="90" y="64" text-anchor="middle" font-size="34">${icon}</text><text x="90" y="96" text-anchor="middle" font-size="13" fill="#334155">${label}</text></svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

const G = '#dcfce7'  // correct answer accent
const N = '#f8fafc'  // neutral accent

// ─── QUIZ (questions classiques à choix multiples) ────────────────────────────

const quizGeo = [
  { question: 'Quelle est la capitale de la France ?', tip: 'Paris est surnommée la "Ville Lumière".', answers: [
    { id:'A', label:'Londres',  image:img('🕒','#fde2e2','Londres'), isCorrect:false },
    { id:'B', label:'Paris',    image:img('🏰',G,'Paris'),           isCorrect:true  },
    { id:'C', label:'Rome',     image:img('🏛️',N,'Rome'),            isCorrect:false },
    { id:'D', label:'Madrid',   image:img('🌆',N,'Madrid'),          isCorrect:false },
  ]},
  { question: 'Quel est le plus grand océan du monde ?', tip: "L'océan Pacifique couvre plus du tiers de la surface du globe.", answers: [
    { id:'A', label:'Atlantique', image:img('🌊',N,'Atlantique'), isCorrect:false },
    { id:'B', label:'Pacifique',  image:img('🌊',G,'Pacifique'),  isCorrect:true  },
    { id:'C', label:'Arctique',   image:img('❄️',N,'Arctique'),   isCorrect:false },
    { id:'D', label:'Indien',     image:img('🌅',N,'Indien'),     isCorrect:false },
  ]},
  { question: 'Quel pays a la plus grande superficie ?', tip: "La Russie s'étend sur plus de 17 millions de km².", answers: [
    { id:'A', label:'Canada',     image:img('🇨🇦',N,'Canada'),   isCorrect:false },
    { id:'B', label:'Chine',      image:img('🇨🇳',N,'Chine'),    isCorrect:false },
    { id:'C', label:'États-Unis', image:img('🇺🇸',N,'USA'),      isCorrect:false },
    { id:'D', label:'Russie',     image:img('🇷🇺',G,'Russie'),   isCorrect:true  },
  ]},
]

const quizSci = [
  { question: "Quel élément chimique a pour symbole O ?", tip: "L'oxygène est indispensable à la respiration.", answers: [
    { id:'A', label:'Or',        image:img('🟡',N,'Or'),       isCorrect:false },
    { id:'B', label:'Argon',     image:img('⚪',N,'Argon'),    isCorrect:false },
    { id:'C', label:'Oxygène',   image:img('🔵',G,'Oxygène'),  isCorrect:true  },
    { id:'D', label:'Hydrogène', image:img('🔴',N,'Hydrog.'), isCorrect:false },
  ]},
  { question: 'Quelle planète est surnommée la planète rouge ?', tip: 'Mars doit sa couleur à l\'oxyde de fer présent à sa surface.', answers: [
    { id:'A', label:'Mars',    image:img('🔴',G,'Mars'),    isCorrect:true  },
    { id:'B', label:'Vénus',   image:img('🌙',N,'Vénus'),   isCorrect:false },
    { id:'C', label:'Mercure', image:img('☄️',N,'Mercure'), isCorrect:false },
    { id:'D', label:'Jupiter', image:img('🪐',N,'Jupiter'), isCorrect:false },
  ]},
  { question: 'Quel organe pompe le sang dans le corps ?', tip: 'Le cœur bat environ 100 000 fois par jour.', answers: [
    { id:'A', label:'Poumons', image:img('🫁',N,'Poumons'), isCorrect:false },
    { id:'B', label:'Cerveau', image:img('🧠',N,'Cerveau'), isCorrect:false },
    { id:'C', label:'Cœur',    image:img('❤️',G,'Cœur'),   isCorrect:true  },
    { id:'D', label:'Foie',    image:img('🫀',N,'Foie'),    isCorrect:false },
  ]},
]

const quizHis = [
  { question: 'Qui a peint la Joconde ?', tip: 'Léonard de Vinci a peint la Joconde vers 1503.', answers: [
    { id:'A', label:'Da Vinci', image:img('🎨',G,'Da Vinci'), isCorrect:true  },
    { id:'B', label:'Picasso',  image:img('🖼️',N,'Picasso'),  isCorrect:false },
    { id:'C', label:'Monet',    image:img('🌿',N,'Monet'),    isCorrect:false },
    { id:'D', label:'Van Gogh', image:img('🌌',N,'Van Gogh'), isCorrect:false },
  ]},
  { question: 'En quelle année a débuté la Révolution française ?', tip: 'La prise de la Bastille eut lieu le 14 juillet 1789.', answers: [
    { id:'A', label:'1776', image:img('🗓️',N,'1776'), isCorrect:false },
    { id:'B', label:'1789', image:img('⚔️',G,'1789'), isCorrect:true  },
    { id:'C', label:'1815', image:img('⚡',N,'1815'), isCorrect:false },
    { id:'D', label:'1945', image:img('🌍',N,'1945'), isCorrect:false },
  ]},
  { question: 'En quelle année a débuté la Première Guerre Mondiale ?', tip: 'La Grande Guerre a commencé en août 1914.', answers: [
    { id:'A', label:'1905', image:img('📅',N,'1905'), isCorrect:false },
    { id:'B', label:'1914', image:img('🏳️',G,'1914'), isCorrect:true  },
    { id:'C', label:'1918', image:img('✌️',N,'1918'), isCorrect:false },
    { id:'D', label:'1939', image:img('🌏',N,'1939'), isCorrect:false },
  ]},
]

const quizCult = [
  { question: 'Quel instrument se joue avec un archet ?', tip: 'Le violon est au cœur des orchestres classiques.', answers: [
    { id:'A', label:'Piano',    image:img('🎹',N,'Piano'),    isCorrect:false },
    { id:'B', label:'Violon',   image:img('🎻',G,'Violon'),   isCorrect:true  },
    { id:'C', label:'Batterie', image:img('🥁',N,'Batterie'), isCorrect:false },
    { id:'D', label:'Flûte',    image:img('🪈',N,'Flûte'),    isCorrect:false },
  ]},
  { question: 'Quel sport se joue avec un ballon ovale ?', tip: 'Le rugby est né en Angleterre au XIXe siècle.', answers: [
    { id:'A', label:'Football', image:img('⚽',N,'Football'), isCorrect:false },
    { id:'B', label:'Rugby',    image:img('🏉',G,'Rugby'),    isCorrect:true  },
    { id:'C', label:'Tennis',   image:img('🎾',N,'Tennis'),   isCorrect:false },
    { id:'D', label:'Basket',   image:img('🏀',N,'Basket'),   isCorrect:false },
  ]},
  { question: 'Combien de continents y a-t-il sur Terre ?', tip: 'Les 7 continents sont : Afrique, Amérique du Nord, Amérique du Sud, Antarctique, Asie, Europe, Océanie.', answers: [
    { id:'A', label:'5', image:img('5️⃣',N,'5'), isCorrect:false },
    { id:'B', label:'6', image:img('6️⃣',N,'6'), isCorrect:false },
    { id:'C', label:'7', image:img('7️⃣',G,'7'), isCorrect:true  },
    { id:'D', label:'8', image:img('8️⃣',N,'8'), isCorrect:false },
  ]},
]

const quizArts = [
  { question: 'Qui a peint "Les Tournesols" ?', tip: 'Van Gogh a peint cette série de tournesols en 1888.', answers: [
    { id:'A', label:'Monet',    image:img('🌸',N,'Monet'),    isCorrect:false },
    { id:'B', label:'Picasso',  image:img('🎭',N,'Picasso'),  isCorrect:false },
    { id:'C', label:'Van Gogh', image:img('🌻',G,'Van Gogh'), isCorrect:true  },
    { id:'D', label:'Renoir',   image:img('🖌️',N,'Renoir'),   isCorrect:false },
  ]},
  { question: 'Quel mouvement artistique est associé à Claude Monet ?', tip: "Le nom 'Impressionnisme' vient du tableau Impression, Soleil Levant.", answers: [
    { id:'A', label:'Cubisme',         image:img('🔷',N,'Cubisme'),         isCorrect:false },
    { id:'B', label:'Surréalisme',     image:img('🌀',N,'Surréalisme'),     isCorrect:false },
    { id:'C', label:'Impressionnisme', image:img('🌅',G,'Impres.'),         isCorrect:true  },
    { id:'D', label:'Baroque',         image:img('🏰',N,'Baroque'),         isCorrect:false },
  ]},
  { question: 'Qui a sculpté le David ?', tip: 'Michel-Ange a sculpté le David entre 1501 et 1504 à Florence.', answers: [
    { id:'A', label:'Rodin',        image:img('🗿',N,'Rodin'),       isCorrect:false },
    { id:'B', label:'Michel-Ange',  image:img('🏛️',G,'M.-Ange'),   isCorrect:true  },
    { id:'C', label:'Donatello',    image:img('🎨',N,'Donatello'),   isCorrect:false },
    { id:'D', label:'Bernini',      image:img('✨',N,'Bernini'),     isCorrect:false },
  ]},
]

const quizMus = [
  { question: 'Combien de touches un piano standard possède-t-il ?', tip: 'Un piano possède 52 touches blanches et 36 touches noires.', answers: [
    { id:'A', label:'72', image:img('7️⃣',N,'72'), isCorrect:false },
    { id:'B', label:'76', image:img('7️⃣',N,'76'), isCorrect:false },
    { id:'C', label:'88', image:img('8️⃣',G,'88'), isCorrect:true  },
    { id:'D', label:'96', image:img('9️⃣',N,'96'), isCorrect:false },
  ]},
  { question: 'Qui a composé la 5ème Symphonie ?', tip: 'Beethoven composa sa 5ème Symphonie entre 1804 et 1808.', answers: [
    { id:'A', label:'Mozart',     image:img('🎵',N,'Mozart'),     isCorrect:false },
    { id:'B', label:'Bach',       image:img('🎼',N,'Bach'),       isCorrect:false },
    { id:'C', label:'Beethoven',  image:img('🎹',G,'Beethoven'),  isCorrect:true  },
    { id:'D', label:'Chopin',     image:img('🎶',N,'Chopin'),     isCorrect:false },
  ]},
  { question: 'De quel pays est originaire le reggae ?', tip: 'Bob Marley est le symbole mondial du reggae jamaïcain.', answers: [
    { id:'A', label:'Cuba',       image:img('🇨🇺',N,'Cuba'),      isCorrect:false },
    { id:'B', label:'Jamaïque',   image:img('🇯🇲',G,'Jamaïque'), isCorrect:true  },
    { id:'C', label:'Brésil',     image:img('🇧🇷',N,'Brésil'),    isCorrect:false },
    { id:'D', label:'Haïti',      image:img('🇭🇹',N,'Haïti'),     isCorrect:false },
  ]},
]

// ─── RAPID (questions courtes et directes) ────────────────────────────────────

const rapidGeo = [
  { question: 'Capitale du Japon ?', tip: 'Tokyo est la mégapole la plus peuplée du monde.', answers: [
    { id:'A', label:'Séoul',   image:img('🏙️',N,'Séoul'),  isCorrect:false },
    { id:'B', label:'Pékin',   image:img('🏯',N,'Pékin'),   isCorrect:false },
    { id:'C', label:'Tokyo',   image:img('🗼',G,'Tokyo'),   isCorrect:true  },
    { id:'D', label:'Bangkok', image:img('🛕',N,'Bangkok'), isCorrect:false },
  ]},
  { question: 'Quel continent est le plus grand ?', tip: "L'Asie représente 30 % des terres émergées.", answers: [
    { id:'A', label:'Afrique',  image:img('🌍',N,'Afrique'),  isCorrect:false },
    { id:'B', label:'Asie',     image:img('🌏',G,'Asie'),     isCorrect:true  },
    { id:'C', label:'Amériques',image:img('🌎',N,'Amériques'),isCorrect:false },
    { id:'D', label:'Europe',   image:img('🗺️',N,'Europe'),   isCorrect:false },
  ]},
  { question: 'Fleuve le plus long du monde ?', tip: 'Le Nil traverse l\'Afrique du nord sur plus de 6 600 km.', answers: [
    { id:'A', label:'Amazone', image:img('🌿',N,'Amazone'), isCorrect:false },
    { id:'B', label:'Nil',     image:img('🏺',G,'Nil'),     isCorrect:true  },
    { id:'C', label:'Mississippi',image:img('🛶',N,'Mississipi'),isCorrect:false },
    { id:'D', label:'Yangtsé', image:img('🐉',N,'Yangtsé'), isCorrect:false },
  ]},
]

const rapidSci = [
  { question: 'H₂O = ?', tip: "L'eau couvre 71 % de la surface terrestre.", answers: [
    { id:'A', label:'Sel',    image:img('🧂',N,'Sel'),   isCorrect:false },
    { id:'B', label:'Eau',    image:img('💧',G,'Eau'),   isCorrect:true  },
    { id:'C', label:'Acide',  image:img('⚗️',N,'Acide'), isCorrect:false },
    { id:'D', label:'Sucre',  image:img('🍬',N,'Sucre'), isCorrect:false },
  ]},
  { question: 'Combien d\'os dans le corps humain adulte ?', tip: 'Le nourrisson en possède 270 ; certains fusionnent en grandissant.', answers: [
    { id:'A', label:'186', image:img('🦴',N,'186'), isCorrect:false },
    { id:'B', label:'206', image:img('🦴',G,'206'), isCorrect:true  },
    { id:'C', label:'226', image:img('🦴',N,'226'), isCorrect:false },
    { id:'D', label:'256', image:img('🦴',N,'256'), isCorrect:false },
  ]},
  { question: 'Vitesse approximative de la lumière ?', tip: 'Elle parcourt environ 300 000 km en une seconde.', answers: [
    { id:'A', label:'30 000 km/s',  image:img('💡',N,'30K'),  isCorrect:false },
    { id:'B', label:'150 000 km/s', image:img('💡',N,'150K'), isCorrect:false },
    { id:'C', label:'300 000 km/s', image:img('💡',G,'300K'), isCorrect:true  },
    { id:'D', label:'500 000 km/s', image:img('💡',N,'500K'), isCorrect:false },
  ]},
]

const rapidHis = [
  { question: 'Napoléon est né dans quelle île ?', tip: 'Napoléon Bonaparte est né à Ajaccio le 15 août 1769.', answers: [
    { id:'A', label:'Sardaigne', image:img('🏝️',N,'Sardaigne'), isCorrect:false },
    { id:'B', label:'Sicile',    image:img('🌋',N,'Sicile'),    isCorrect:false },
    { id:'C', label:'Corse',     image:img('🏔️',G,'Corse'),    isCorrect:true  },
    { id:'D', label:'Malte',     image:img('⛪',N,'Malte'),     isCorrect:false },
  ]},
  { question: 'En quelle année l\'homme a-t-il marché sur la Lune ?', tip: 'Neil Armstrong fit le premier pas lunaire le 21 juillet 1969.', answers: [
    { id:'A', label:'1961', image:img('🚀',N,'1961'), isCorrect:false },
    { id:'B', label:'1965', image:img('🚀',N,'1965'), isCorrect:false },
    { id:'C', label:'1969', image:img('🌕',G,'1969'), isCorrect:true  },
    { id:'D', label:'1972', image:img('🌕',N,'1972'), isCorrect:false },
  ]},
  { question: 'Qui était le premier président des États-Unis ?', tip: 'Washington présida de 1789 à 1797.', answers: [
    { id:'A', label:'Lincoln',    image:img('🎩',N,'Lincoln'),    isCorrect:false },
    { id:'B', label:'Washington', image:img('🦅',G,'Washington'), isCorrect:true  },
    { id:'C', label:'Jefferson',  image:img('📜',N,'Jefferson'),  isCorrect:false },
    { id:'D', label:'Roosevelt',  image:img('🏛️',N,'Roosevelt'),  isCorrect:false },
  ]},
]

const rapidCult = [
  { question: 'Couleurs du drapeau français ?', tip: 'Bleu, Blanc, Rouge — adopté lors de la Révolution.', answers: [
    { id:'A', label:'Rouge Blanc Vert', image:img('🚩',N,'RBV'),    isCorrect:false },
    { id:'B', label:'Bleu Blanc Rouge', image:img('🇫🇷',G,'BbR'), isCorrect:true  },
    { id:'C', label:'Bleu Jaune Rouge', image:img('🚩',N,'BJR'),    isCorrect:false },
    { id:'D', label:'Noir Blanc Rouge', image:img('🚩',N,'NBR'),    isCorrect:false },
  ]},
  { question: 'Jeux Olympiques d\'été 2024 : quelle ville ?', tip: 'Paris a organisé les JO pour la troisième fois.', answers: [
    { id:'A', label:'Los Angeles', image:img('🌴',N,'LA'),     isCorrect:false },
    { id:'B', label:'Tokyo',       image:img('🗼',N,'Tokyo'),  isCorrect:false },
    { id:'C', label:'Paris',       image:img('🏅',G,'Paris'),  isCorrect:true  },
    { id:'D', label:'Londres',     image:img('🎡',N,'Londres'),isCorrect:false },
  ]},
  { question: 'Quel est le sport le plus pratiqué au monde ?', tip: 'Plus de 4 milliards de personnes suivent le football.', answers: [
    { id:'A', label:'Basketball', image:img('🏀',N,'Basket'),   isCorrect:false },
    { id:'B', label:'Cricket',    image:img('🏏',N,'Cricket'),  isCorrect:false },
    { id:'C', label:'Football',   image:img('⚽',G,'Football'), isCorrect:true  },
    { id:'D', label:'Tennis',     image:img('🎾',N,'Tennis'),   isCorrect:false },
  ]},
]

const rapidArts = [
  { question: 'Guernica est une œuvre de ?', tip: 'Picasso peint Guernica en 1937 pour dénoncer les horreurs de la guerre.', answers: [
    { id:'A', label:'Dalí',    image:img('🎨',N,'Dalí'),    isCorrect:false },
    { id:'B', label:'Picasso', image:img('🖼️',G,'Picasso'), isCorrect:true  },
    { id:'C', label:'Matisse', image:img('🌈',N,'Matisse'), isCorrect:false },
    { id:'D', label:'Braque',  image:img('🔷',N,'Braque'),  isCorrect:false },
  ]},
  { question: 'Le Louvre se situe dans quelle ville ?', tip: "Avec 9 millions de visiteurs par an, c'est le musée le plus visité au monde.", answers: [
    { id:'A', label:'Rome',   image:img('🏛️',N,'Rome'),  isCorrect:false },
    { id:'B', label:'Madrid', image:img('🌆',N,'Madrid'),isCorrect:false },
    { id:'C', label:'Paris',  image:img('🏰',G,'Paris'), isCorrect:true  },
    { id:'D', label:'Berlin', image:img('🗼',N,'Berlin'),isCorrect:false },
  ]},
  { question: 'De quoi est composée une mosaïque ?', tip: 'Les mosaïques romaines utilisaient des tesselles de pierre ou de verre.', answers: [
    { id:'A', label:'Tissu',        image:img('🧵',N,'Tissu'),       isCorrect:false },
    { id:'B', label:'Petits morceaux',image:img('🔲',G,'Tesselles'), isCorrect:true  },
    { id:'C', label:'Peinture',     image:img('🖌️',N,'Peinture'),    isCorrect:false },
    { id:'D', label:'Sable coloré', image:img('🏖️',N,'Sable'),       isCorrect:false },
  ]},
]

const rapidMus = [
  { question: 'Note juste au-dessus du Do ?', tip: 'La gamme : Do Ré Mi Fa Sol La Si.', answers: [
    { id:'A', label:'Mi',  image:img('🎵',N,'Mi'),  isCorrect:false },
    { id:'B', label:'Si',  image:img('🎵',N,'Si'),  isCorrect:false },
    { id:'C', label:'Ré',  image:img('🎵',G,'Ré'),  isCorrect:true  },
    { id:'D', label:'Sol', image:img('🎵',N,'Sol'), isCorrect:false },
  ]},
  { question: 'La flûte est un instrument à ?', tip: 'On souffle dans une flûte pour produire un son.', answers: [
    { id:'A', label:'Cordes',     image:img('🎸',N,'Cordes'),    isCorrect:false },
    { id:'B', label:'Percussion', image:img('🥁',N,'Perc.'),     isCorrect:false },
    { id:'C', label:'Vent',       image:img('🪈',G,'Vent'),      isCorrect:true  },
    { id:'D', label:'Clavier',    image:img('🎹',N,'Clavier'),   isCorrect:false },
  ]},
  { question: 'Quel genre musical vient de la Jamaïque ?', tip: 'Bob Marley a popularisé le reggae dans le monde entier.', answers: [
    { id:'A', label:'Jazz',    image:img('🎷',N,'Jazz'),    isCorrect:false },
    { id:'B', label:'Reggae',  image:img('🎸',G,'Reggae'),  isCorrect:true  },
    { id:'C', label:'Tango',   image:img('💃',N,'Tango'),   isCorrect:false },
    { id:'D', label:'Cumbia',  image:img('🎺',N,'Cumbia'),  isCorrect:false },
  ]},
]

// ─── ENIGME (format devinette) ────────────────────────────────────────────────

const enigmeGeo = [
  { question: 'Je suis le plus froid des continents, sans aucun pays officiel. Les manchots habitent mes côtes. Qui suis-je ?', tip: "L'Antarctique est protégé par un traité international depuis 1959.", answers: [
    { id:'A', label:'Arctique',    image:img('🧊',N,'Arctique'),    isCorrect:false },
    { id:'B', label:'Antarctique', image:img('🐧',G,'Antarctique'), isCorrect:true  },
    { id:'C', label:'Groenland',   image:img('❄️',N,'Groenland'),   isCorrect:false },
    { id:'D', label:'Islande',     image:img('🌋',N,'Islande'),     isCorrect:false },
  ]},
  { question: 'Je suis la plus haute montagne du monde. Les alpinistes rêvent de me conquérir. Qui suis-je ?', tip: "L'Everest culmine à 8 849 mètres d'altitude.", answers: [
    { id:'A', label:'K2',       image:img('⛰️',N,'K2'),       isCorrect:false },
    { id:'B', label:'Everest',  image:img('🏔️',G,'Everest'),  isCorrect:true  },
    { id:'C', label:'Mont Blanc',image:img('🗻',N,'M. Blanc'), isCorrect:false },
    { id:'D', label:'Kilimandjaro',image:img('🌄',N,'Kiliman.'),isCorrect:false },
  ]},
  { question: 'Je suis à la fois un pays et un continent. Les kangourous y vivent. Qui suis-je ?', tip: "L'Australie est le seul pays qui occupe un continent entier.", answers: [
    { id:'A', label:'Nouvelle-Zélande', image:img('🥝',N,'NZ'),         isCorrect:false },
    { id:'B', label:'Papouasie',        image:img('🌺',N,'Papouasie'),   isCorrect:false },
    { id:'C', label:'Australie',        image:img('🦘',G,'Australie'),   isCorrect:true  },
    { id:'D', label:'Indonésie',        image:img('🌴',N,'Indonésie'),   isCorrect:false },
  ]},
]

const enigmeSci = [
  { question: "Je suis invisible, tu respires grâce à moi, mon symbole est O. Qui suis-je ?", tip: "L'oxygène représente 21 % de l'air que nous respirons.", answers: [
    { id:'A', label:'Azote',    image:img('💨',N,'Azote'),   isCorrect:false },
    { id:'B', label:'Oxygène',  image:img('🔵',G,'Oxygène'), isCorrect:true  },
    { id:'C', label:'Hélium',   image:img('🎈',N,'Hélium'),  isCorrect:false },
    { id:'D', label:'Carbone',  image:img('⚫',N,'Carbone'), isCorrect:false },
  ]},
  { question: "Je brille le jour, disparais la nuit, je suis l'étoile la plus proche de la Terre. Qui suis-je ?", tip: 'La lumière du Soleil met 8 minutes pour atteindre la Terre.', answers: [
    { id:'A', label:'Sirius',  image:img('⭐',N,'Sirius'), isCorrect:false },
    { id:'B', label:'Soleil',  image:img('☀️',G,'Soleil'), isCorrect:true  },
    { id:'C', label:'Véga',    image:img('🌟',N,'Véga'),   isCorrect:false },
    { id:'D', label:'Proxima', image:img('✨',N,'Proxima'),isCorrect:false },
  ]},
  { question: "Je cours dans tes veines. Mon groupe peut être A, B, AB ou O. Qui suis-je ?", tip: 'Le groupe O est dit donneur universel.', answers: [
    { id:'A', label:'Lymphe', image:img('💉',N,'Lymphe'), isCorrect:false },
    { id:'B', label:'Plasma', image:img('🩸',N,'Plasma'), isCorrect:false },
    { id:'C', label:'Sang',   image:img('🩸',G,'Sang'),   isCorrect:true  },
    { id:'D', label:'Sérum',  image:img('💊',N,'Sérum'),  isCorrect:false },
  ]},
]

const enigmeHis = [
  { question: "Je suis une tour construite en 1889 pour l'Exposition Universelle de Paris. Qui suis-je ?", tip: 'Gustave Eiffel a dirigé sa construction en seulement 2 ans.', answers: [
    { id:'A', label:'Big Ben',      image:img('🕰️',N,'Big Ben'),     isCorrect:false },
    { id:'B', label:'Tour Eiffel',  image:img('🗼',G,'Tour Eiffel'), isCorrect:true  },
    { id:'C', label:'Colisée',      image:img('🏛️',N,'Colisée'),     isCorrect:false },
    { id:'D', label:'Tour de Pise', image:img('🏗️',N,'T. de Pise'),  isCorrect:false },
  ]},
  { question: "Je suis un mur qui divisait une ville en deux de 1961 à 1989. Qui suis-je ?", tip: 'Sa chute le 9 novembre 1989 symbolisa la fin de la Guerre Froide.', answers: [
    { id:'A', label:'Muraille de Chine',  image:img('🇨🇳',N,'Muraille'),   isCorrect:false },
    { id:'B', label:'Mur de Berlin',      image:img('🧱',G,'Mur Berlin'),   isCorrect:true  },
    { id:'C', label:'Mur des Lamentations',image:img('✡️',N,'Jérusalem'),   isCorrect:false },
    { id:'D', label:'Mur d\'Hadrien',     image:img('🏴󠁧󠁢󠁥󠁮󠁧󠁿',N,'Hadrien'),   isCorrect:false },
  ]},
  { question: "Je suis l'explorateur qui a atteint les Amériques en 1492 en cherchant les Indes. Qui suis-je ?", tip: 'Il navigua sous pavillon espagnol depuis le port de Palos.', answers: [
    { id:'A', label:'Vasco de Gama',   image:img('⛵',N,'Vasco'),    isCorrect:false },
    { id:'B', label:'Magellan',        image:img('🌍',N,'Magellan'), isCorrect:false },
    { id:'C', label:'C. Colomb',       image:img('🧭',G,'Colomb'),   isCorrect:true  },
    { id:'D', label:'Amerigo Vespucci',image:img('🗺️',N,'Vespucci'), isCorrect:false },
  ]},
]

const enigmeCult = [
  { question: "J'ai 5 anneaux colorés et je rassemble le monde entier tous les 4 ans. Qui suis-je ?", tip: 'Les 5 anneaux représentent les 5 continents participants.', answers: [
    { id:'A', label:'Coupe du Monde',   image:img('🏆',N,'CM'),     isCorrect:false },
    { id:'B', label:'Jeux Olympiques',  image:img('🏅',G,'JO'),     isCorrect:true  },
    { id:'C', label:'Champions League', image:img('⭐',N,'UCL'),    isCorrect:false },
    { id:'D', label:'Commonwealth',     image:img('🌐',N,'CWG'),    isCorrect:false },
  ]},
  { question: "Je suis la langue la plus parlée au monde en nombre de locuteurs natifs. Qui suis-je ?", tip: 'Elle est parlée par plus d\'un milliard de personnes en Chine.', answers: [
    { id:'A', label:'Anglais',  image:img('🇬🇧',N,'Anglais'),  isCorrect:false },
    { id:'B', label:'Espagnol', image:img('🇪🇸',N,'Espagnol'), isCorrect:false },
    { id:'C', label:'Mandarin', image:img('🇨🇳',G,'Mandarin'), isCorrect:true  },
    { id:'D', label:'Hindi',    image:img('🇮🇳',N,'Hindi'),    isCorrect:false },
  ]},
  { question: "Je suis le livre le plus vendu de l'histoire de l'humanité. Qui suis-je ?", tip: 'Des milliards d\'exemplaires ont été distribués dans le monde entier.', answers: [
    { id:'A', label:'Le Coran',    image:img('📖',N,'Coran'),   isCorrect:false },
    { id:'B', label:'Don Quichotte',image:img('📚',N,'Quichotte'),isCorrect:false },
    { id:'C', label:'La Bible',    image:img('📕',G,'Bible'),   isCorrect:true  },
    { id:'D', label:'Harry Potter',image:img('🧙',N,'Harry'),  isCorrect:false },
  ]},
]

const enigmeArts = [
  { question: "Je suis le tableau le plus célèbre du monde, une femme au sourire mystérieux peinte vers 1503. Qui suis-je ?", tip: 'Elle est exposée au Louvre, à Paris, derrière un verre blindé.', answers: [
    { id:'A', label:'La Nuit Étoilée', image:img('🌌',N,'Nuit Ét.'), isCorrect:false },
    { id:'B', label:'La Joconde',      image:img('🖼️',G,'Joconde'),  isCorrect:true  },
    { id:'C', label:'Les Ménines',     image:img('👸',N,'Ménines'),   isCorrect:false },
    { id:'D', label:'Le Cri',          image:img('😱',N,'Le Cri'),    isCorrect:false },
  ]},
  { question: "Je suis un peintre hollandais qui se coupait l'oreille et peignait des tournesols. Qui suis-je ?", tip: 'Il n\'a vendu qu\'un seul tableau de son vivant.', answers: [
    { id:'A', label:'Rembrandt',  image:img('🎭',N,'Rembrandt'), isCorrect:false },
    { id:'B', label:'Vermeer',    image:img('💎',N,'Vermeer'),   isCorrect:false },
    { id:'C', label:'Van Gogh',   image:img('🌻',G,'Van Gogh'),  isCorrect:true  },
    { id:'D', label:'Mondrian',   image:img('🔳',N,'Mondrian'),  isCorrect:false },
  ]},
  { question: "Je suis un mouvement artistique né en France qui capte la lumière et les instants fugaces. Qui suis-je ?", tip: 'Monet, Renoir et Degas sont les figures de proue de ce mouvement.', answers: [
    { id:'A', label:'Surréalisme',     image:img('🌀',N,'Surrél.'),  isCorrect:false },
    { id:'B', label:'Cubisme',         image:img('🔷',N,'Cubisme'),  isCorrect:false },
    { id:'C', label:'Impressionnisme', image:img('🌅',G,'Impress.'), isCorrect:true  },
    { id:'D', label:'Expressionnisme', image:img('😱',N,'Express.'), isCorrect:false },
  ]},
]

const enigmeMus = [
  { question: "Je suis sourd mais j'ai composé parmi les plus belles symphonies du monde. Qui suis-je ?", tip: 'Il composa sa 9ème Symphonie alors qu\'il était totalement sourd.', answers: [
    { id:'A', label:'Mozart',    image:img('🎼',N,'Mozart'),    isCorrect:false },
    { id:'B', label:'Bach',      image:img('🎹',N,'Bach'),      isCorrect:false },
    { id:'C', label:'Beethoven', image:img('🎵',G,'Beethoven'), isCorrect:true  },
    { id:'D', label:'Schubert',  image:img('📯',N,'Schubert'),  isCorrect:false },
  ]},
  { question: "Je suis un instrument à 6 cordes, joué avec les doigts ou un médiator. Qui suis-je ?", tip: 'On me trouve aussi bien dans le flamenco que dans le rock.', answers: [
    { id:'A', label:'Mandoline', image:img('🪕',N,'Mandoline'), isCorrect:false },
    { id:'B', label:'Ukulélé',   image:img('🎸',N,'Ukulélé'),  isCorrect:false },
    { id:'C', label:'Guitare',   image:img('🎸',G,'Guitare'),   isCorrect:true  },
    { id:'D', label:'Banjo',     image:img('🪘',N,'Banjo'),     isCorrect:false },
  ]},
  { question: "Je suis le roi du rock, né à Memphis, Tennessee, et connu pour mon déhanchement. Qui suis-je ?", tip: 'Il est surnommé "The King" et est décédé en 1977.', answers: [
    { id:'A', label:'Chuck Berry', image:img('🎸',N,'C. Berry'), isCorrect:false },
    { id:'B', label:'Elvis',       image:img('👑',G,'Elvis'),    isCorrect:true  },
    { id:'C', label:'James Brown', image:img('🕺',N,'J. Brown'), isCorrect:false },
    { id:'D', label:'Little Richard',image:img('🎤',N,'L. Rich.'),isCorrect:false },
  ]},
]

// ─── INDEX PRINCIPAL ──────────────────────────────────────────────────────────

export const gameQuizData = {
  Quiz:       { geographie: quizGeo,   sciences: quizSci,   histoire: quizHis,   'culture-generale': quizCult,   arts: quizArts,   musique: quizMus   },
  Rapid:      { geographie: rapidGeo,  sciences: rapidSci,  histoire: rapidHis,  'culture-generale': rapidCult,  arts: rapidArts,  musique: rapidMus  },
  Enigme:     { geographie: enigmeGeo, sciences: enigmeSci, histoire: enigmeHis, 'culture-generale': enigmeCult, arts: enigmeArts, musique: enigmeMus },
}

// Jeux sans banque dédiée → fallback sur Quiz
const FALLBACK_GAME = 'Quiz'

export const getQuestions = (gameType, topicId) => {
  const bank = gameQuizData[gameType] ?? gameQuizData[FALLBACK_GAME]
  return bank[topicId] ?? gameQuizData[FALLBACK_GAME][topicId] ?? []
}

// ─── TOPICS ───────────────────────────────────────────────────────────────────

export const topics = [
  { id: 'geographie',      title: 'Géographie',      subtitle: 'Pays, capitales et continents', icon: '🌍', color: 'green'    },
  { id: 'sciences',        title: 'Sciences',         subtitle: 'Physique, chimie, biologie',    icon: '⚛️', color: 'darkgreen' },
  { id: 'histoire',        title: 'Histoire',         subtitle: 'Événements historiques',        icon: '📖', color: 'amber'    },
  { id: 'culture-generale',title: 'Culture Générale', subtitle: 'Un peu de tout !',              icon: '💡', color: 'coral'    },
  { id: 'arts',            title: 'Arts',             subtitle: 'Peinture, sculpture, artistes', icon: '🎨', color: 'red'      },
  { id: 'musique',         title: 'Musique',          subtitle: 'Instruments et compositeurs',   icon: '🎵', color: 'emerald'  },
]

// Compat avec l'ancien import (QuizPage existant)
export const getQuestionsByTopic = (topicId) => getQuestions('Quiz', topicId)
