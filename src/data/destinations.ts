export interface Destination {
  id: string;
  place: string;
  title: string;
  title2: string;
  description: string;
  image: string;
  mood: 'nature' | 'mysterious' | 'urban' | 'culinary';
  colorTheme: {
    primary: string;       // HEX color
    accent: string;        // Tailwind text/bg class variant
    textAccent: string;    // CSS custom color
    bgGradient: string;    // Gradient background CSS
    glow: string;          // Glow effect shadow CSS
  };
  soundType: 'mountain-wind' | 'temple-bells' | 'desert-drone' | 'forest-birds' | 'ocean-waves' | 'cave-resonance';
  localsStory: {
    author: string;
    role: string;
    quote: string;
    text: string;
  };
  bentoWidgets: {
    weather: { temp: string; condition: string; desc: string };
    localTimeOffset: number; // GMT offset
    food: { name: string; desc: string; image: string };
    etiquette: { rule: string; explanation: string }[];
  };
  calendar: {
    bestMonths: number[]; // 1 to 12
    reason: string;
  };
  coordinates: {
    lat: number;
    lng: number;
  };
}

export const destinations: Destination[] = [
  {
    id: 'japan',
    place: 'Japan Alps',
    title: 'NAGANO',
    title2: 'PREFECTURE',
    description: 'Nagano Prefecture, set within the majestic Japan Alps, is a cultural treasure trove with its historic shrines and temples, particularly the famous Zenkō-ji. The region is also a hotspot for skiing and snowboarding, offering some of the country\'s best powder.',
    image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&q=80&w=1200', // Premium unspash image of Japan street/temple
    mood: 'mysterious',
    colorTheme: {
      primary: '#ff8a9e',
      accent: 'text-pink-400 border-pink-400/50 bg-pink-950/20',
      textAccent: 'rgb(244, 114, 182)',
      bgGradient: 'from-zinc-950 via-slate-900 to-rose-950/40',
      glow: 'shadow-[0_0_30px_rgba(244,114,182,0.15)]',
    },
    soundType: 'temple-bells',
    localsStory: {
      author: 'Hiroshi Sato',
      role: 'Local Tea Master',
      quote: '“In Nagano, time slows down. The wind passing through the cedars of Togakushi tells the history of a thousand years.”',
      text: 'To truly experience Nagano, you must step off the bullet train and walk the ancient pilgrimage routes. Listen to the morning chants at Zenkō-ji temple when the air is icy and the incense smoke hangs low in the mountain wind.'
    },
    bentoWidgets: {
      weather: { temp: '14°C', condition: 'Misty', desc: 'Cool mountain mist' },
      localTimeOffset: 9,
      food: {
        name: 'Shinshu Soba',
        desc: 'Buckwheat noodles prepared with pure alpine water, served cold with fresh wasabi.',
        image: '🍜'
      },
      etiquette: [
        { rule: 'Walk in silence near shrines', explanation: 'Shrines are places of deep spiritual rest; speak softly and avoid photography where posted.' },
        { rule: 'Slurping is a compliment', explanation: 'When eating hot soba noodles, slurp to aerate the broth and show the chef you appreciate their craft.' }
      ]
    },
    calendar: {
      bestMonths: [4, 5, 10, 11],
      reason: 'Spring brings cherry blossoms across the valleys, while Autumn transforms the slopes into a fiery mosaic of red and gold maples.'
    },
    coordinates: { lat: 36.6486, lng: 138.1942 }
  },
  {
    id: 'morocco',
    place: 'Sahara Desert - Morocco',
    title: 'MARRAKECH',
    title2: 'MERZOUGA',
    description: 'The journey from the vibrant souks and palaces of Marrakech to the tranquil, starlit sands of Merzouga showcases the diverse splendor of Morocco. Camel treks and desert camps offer an unforgettable immersion into the nomadic way of life.',
    image: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&q=80&w=1200', // Premium Sahara photo
    mood: 'mysterious',
    colorTheme: {
      primary: '#d35400',
      accent: 'text-amber-500 border-amber-500/50 bg-amber-950/20',
      textAccent: 'rgb(245, 158, 11)',
      bgGradient: 'from-zinc-950 via-zinc-900 to-amber-950/30',
      glow: 'shadow-[0_0_30px_rgba(245,158,11,0.15)]',
    },
    soundType: 'desert-drone',
    localsStory: {
      author: 'Youssef Ait',
      role: 'Berber Caravan Guide',
      quote: '“The desert does not speak, but it teaches those who know how to listen.”',
      text: 'In the dunes of Erg Chebbi, the wind is your guide. When you sleep under the stars, you realise the silence is not empty; it is a chorus of shifting sand and distant memories of caravans.'
    },
    bentoWidgets: {
      weather: { temp: '34°C', condition: 'Sunny', desc: 'Hot desert winds' },
      localTimeOffset: 1,
      food: {
        name: 'Tagine cooked in clay',
        desc: 'Slow-cooked stew of lamb, prunes, and toasted almonds, infused with saffron and ginger.',
        image: '🍲'
      },
      etiquette: [
        { rule: 'Accept Mint Tea always', explanation: 'It is a symbol of friendship and hospitality. Declining is seen as rejecting a personal connection.' },
        { rule: 'Eat only with your right hand', explanation: 'The left hand is traditionally reserved for personal hygiene. Always use the right hand for communal dining.' }
      ]
    },
    calendar: {
      bestMonths: [3, 4, 5, 9, 10, 11],
      reason: 'Mid-seasons offer warm, beautiful days and avoid the scorching, unbearable summer desert temperatures.'
    },
    coordinates: { lat: 31.0983, lng: -4.0033 }
  },
  {
    id: 'switzerland',
    place: 'Switzerland Alps',
    title: 'SAINT',
    title2: 'ANTÖNIEN',
    description: 'Tucked away in the Switzerland Alps, Saint Antönien offers an idyllic retreat for those seeking tranquility and adventure alike. It\'s a hidden gem for backcountry skiing in winter and boasts lush trails for hiking and mountain biking during the warmer months.',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1200', // Alps photo
    mood: 'nature',
    colorTheme: {
      primary: '#7ec0ee',
      accent: 'text-sky-400 border-sky-400/50 bg-sky-950/20',
      textAccent: 'rgb(56, 189, 248)',
      bgGradient: 'from-zinc-950 via-slate-900 to-sky-950/30',
      glow: 'shadow-[0_0_30px_rgba(56,189,248,0.15)]',
    },
    soundType: 'mountain-wind',
    localsStory: {
      author: 'Elsa Keller',
      role: 'Alpine Botanist',
      quote: '“Above the tree line, every flower is a small victory of life against the cold.”',
      text: 'Saint Antönien remains untouched by heavy tourism. Here, we still hear the whispers of the peaks. If you hike early, the morning dew carries the scent of wild thyme and glacier water.'
    },
    bentoWidgets: {
      weather: { temp: '6°C', condition: 'Chilly', desc: 'Fresh mountain breeze' },
      localTimeOffset: 2,
      food: {
        name: 'Alpine Alpkäse',
        desc: 'Hard raw-milk cheese aged in mountain caves, packed with herbal notes of alpine grass.',
        image: '🧀'
      },
      etiquette: [
        { rule: 'Close pasture gates', explanation: 'Cattle roam freely in alpine meadows. Always secure gates behind you to keep herds safe.' },
        { rule: 'Greet hikers with "Grüezi"', explanation: 'It is local custom to acknowledge everyone you pass on the high alpine trails.' }
      ]
    },
    calendar: {
      bestMonths: [6, 7, 8, 12, 1, 2],
      reason: 'Summer is paradise for wildflowers and hikers, while winter turns the valleys into a legendary snowy wonderland.'
    },
    coordinates: { lat: 46.9744, lng: 9.8144 }
  },
  {
    id: 'usa',
    place: 'Sierra Nevada - USA',
    title: 'YOSEMITE',
    title2: 'NATIONAL PARK',
    description: 'Yosemite National Park is a showcase of the American wilderness, revered for its towering granite monoliths, ancient giant sequoias, and thundering waterfalls. The park offers year-round recreational activities, from rock climbing to serene valley walks.',
    image: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&q=80&w=1200', // Yosemite photo
    mood: 'nature',
    colorTheme: {
      primary: '#2ecc71',
      accent: 'text-emerald-400 border-emerald-400/50 bg-emerald-950/20',
      textAccent: 'rgb(52, 211, 153)',
      bgGradient: 'from-zinc-950 via-zinc-900 to-emerald-950/30',
      glow: 'shadow-[0_0_30px_rgba(52,211,153,0.15)]',
    },
    soundType: 'forest-birds',
    localsStory: {
      author: 'John Muir (Legacy)',
      role: 'Wilderness Philosopher',
      quote: '“The clearest way into the Universe is through a forest wilderness.”',
      text: 'Yosemite is a temple of granite. Standing beneath El Capitan, the scale makes you feel microscopic yet deeply connected to the planet. The roar of Yosemite Falls in spring is nature\'s greatest symphony.'
    },
    bentoWidgets: {
      weather: { temp: '22°C', condition: 'Sunny', desc: 'Warm valley sun' },
      localTimeOffset: -7,
      food: {
        name: 'Campfire Dutch Oven Stew',
        desc: 'Hearty bean and root vegetable stew cooked slowly over charcoal under the redwood canopy.',
        image: '🍲'
      },
      etiquette: [
        { rule: 'Leave No Trace', explanation: 'Pack out everything you pack in. Secure food in bear-proof lockers to protect wildlife.' },
        { rule: 'Respect the speed limits', explanation: 'Winding park roads are active animal corridors. Drive slowly to protect crossing bears and deer.' }
      ]
    },
    calendar: {
      bestMonths: [5, 6, 9, 10],
      reason: 'Spring runoff fuels roaring waterfalls, while early autumn offers clear trails and fewer crowds.'
    },
    coordinates: { lat: 37.8651, lng: -119.5383 }
  },
  {
    id: 'spain',
    place: 'Tarifa - Spain',
    title: 'LOS LANCES',
    title2: 'BEACH',
    description: 'Los Lances Beach in Tarifa is a coastal paradise known for its consistent winds, making it a world-renowned spot for kitesurfing and windsurfing. The beach\'s long, sandy shores provide ample space for relaxation and sunbathing, with a vibrant atmosphere of beach bars and cafes.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200', // Tarifa beach photo
    mood: 'urban',
    colorTheme: {
      primary: '#3498db',
      accent: 'text-cyan-400 border-cyan-400/50 bg-cyan-950/20',
      textAccent: 'rgb(34, 211, 238)',
      bgGradient: 'from-zinc-950 via-slate-900 to-cyan-950/30',
      glow: 'shadow-[0_0_30px_rgba(34,211,238,0.15)]',
    },
    soundType: 'ocean-waves',
    localsStory: {
      author: 'Maria Sol',
      role: 'Kitesurfing Instructor',
      quote: '“Here, the wind has a name. Levante or Poniente. It shapes our daily life and fills the sky with colors.”',
      text: 'Tarifa is where Europe looks at Africa. At Los Lances, the ocean meets the Mediterranean. Walk along the wet sand in the late evening, and you can see the lights of Morocco sparkling across the strait.'
    },
    bentoWidgets: {
      weather: { temp: '26°C', condition: 'Windy', desc: 'Strong Levante wind' },
      localTimeOffset: 2,
      food: {
        name: 'Pescaíto Frito',
        desc: 'Crispy, flour-dusted fried local fish, served hot with a squeeze of fresh lemon.',
        image: '🐟'
      },
      etiquette: [
        { rule: 'Observe flag warnings', explanation: 'Strong currents and wind make swimming hazardous. Check flag colors carefully before entering the water.' },
        { rule: 'Tapia dinners start late', explanation: 'Do not head out for dinner before 9:30 PM. Join the locals as they hop from one bar to another.' }
      ]
    },
    calendar: {
      bestMonths: [5, 6, 7, 8, 9],
      reason: 'Summer provides the most consistent thermal winds and warm ocean waters ideal for wind sports.'
    },
    coordinates: { lat: 36.0142, lng: -5.6044 }
  },
  {
    id: 'turkey',
    place: 'Cappadocia - Turkey',
    title: 'GÖREME',
    title2: 'VALLEY',
    description: 'Göreme Valley in Cappadocia is a historical marvel set against a unique geological backdrop, where centuries of wind and water have sculpted the landscape into whimsical formations. The valley is also famous for its open-air museums, underground cities, and the enchanting experience of hot air ballooning.',
    image: 'https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&q=80&w=1200', // Cappadocia photo
    mood: 'culinary',
    colorTheme: {
      primary: '#e67e22',
      accent: 'text-orange-400 border-orange-400/50 bg-orange-950/20',
      textAccent: 'rgb(251, 146, 60)',
      bgGradient: 'from-zinc-950 via-zinc-900 to-orange-950/30',
      glow: 'shadow-[0_0_30px_rgba(251,146,60,0.15)]',
    },
    soundType: 'cave-resonance',
    localsStory: {
      author: 'Ahmet Yilmaz',
      role: 'Cave Artisan',
      quote: '“We carve our lives into this soft stone. It is cool in summer, warm in winter, and holds our history inside.”',
      text: 'Do not just watch the balloons at sunrise. Hike into the Red Valley at dusk. The fairy chimneys cast shadows that make you feel like you are walking on another planet.'
    },
    bentoWidgets: {
      weather: { temp: '18°C', condition: 'Sunny', desc: 'Clear steppe breeze' },
      localTimeOffset: 3,
      food: {
        name: 'Testi Kebabı',
        desc: 'Meat and vegetables sealed inside a clay pot, cooked over coals, and cracked open at your table.',
        image: '🏺'
      },
      etiquette: [
        { rule: 'Remove shoes in cave houses', explanation: 'Carpeted rooms are sacred spaces for families. Always leave your shoes at the entrance.' },
        { rule: 'Buy from small village weavers', explanation: 'Support local families keeping traditional Anatolian rug weaving and pottery crafts alive.' }
      ]
    },
    calendar: {
      bestMonths: [4, 5, 6, 9, 10],
      reason: 'Spring and Autumn present perfect weather for hot air balloon flights and comfortable trekking through the valleys.'
    },
    coordinates: { lat: 38.6431, lng: 34.8289 }
  }
];
