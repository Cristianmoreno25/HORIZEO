/* ================================================================
   HORIZEO · Data layer — Supabase
   - DESTINATIONS y EXPERIENCE_OPTIONS: constantes JS para UI/filtros
   - StoreProvider: estado global respaldado por Supabase (async)
   - Todas las acciones retornan { ok, data?, error? }
   ================================================================ */

// ---------------------- Destinos (constantes para UI) ----------------------

const DESTINATIONS = [
  {
    id: 'cartagena',
    name: 'Cartagena de Indias',
    country: 'Colombia',
    region: 'Caribe',
    tagline: 'Calles empedradas, balcones de buganvilia y mar turquesa.',
    description: 'La ciudad amurallada late con el ritmo del Caribe. Sus plazas coloniales y atardeceres frente al mar la convirtieron en patrimonio de la humanidad. Recorre Getsemaní, naveguega hasta las Islas del Rosario y termina el día con cocteles sobre las murallas.',
    image: 'https://images.unsplash.com/photo-1599581137827-2c64b8c4dc26?w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1599581137827-2c64b8c4dc26?w=1200&q=80',
      'https://images.unsplash.com/photo-1583531352515-8884af319dc4?w=1200&q=80',
      'https://images.unsplash.com/photo-1568632234157-ce7aecd03d0d?w=1200&q=80',
    ],
    priceFrom: 1200000,
    avgDays: 5,
    experience: 'cultural',
    rating: 4.7,
    available: true,
    highlights: ['Ciudad amurallada', 'Islas del Rosario', 'Café en Getsemaní', 'Atardeceres del Café del Mar'],
  },
  {
    id: 'eje-cafetero',
    name: 'Eje Cafetero',
    country: 'Colombia',
    region: 'Andes',
    tagline: 'Cordilleras verdes, fincas cafeteras y palmas de cera.',
    description: 'Entre montañas que respiran café, el Eje Cafetero te invita a recorrer fincas centenarias, despertar entre niebla y caminar bajo las palmas más altas del mundo en el Valle de Cocora.',
    image: 'https://images.unsplash.com/photo-1626197031507-c17099753b86?w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1626197031507-c17099753b86?w=1200&q=80',
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&q=80',
      'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=1200&q=80',
    ],
    priceFrom: 900000,
    avgDays: 4,
    experience: 'naturaleza',
    rating: 4.8,
    available: true,
    highlights: ['Valle de Cocora', 'Tour del café', 'Salento', 'Termales de Santa Rosa'],
  },
  {
    id: 'medellin',
    name: 'Medellín',
    country: 'Colombia',
    region: 'Andes',
    tagline: 'La ciudad de la eterna primavera reinventada.',
    description: 'Entre cerros y metrocables, Medellín ofrece arte urbano en la Comuna 13, jardines botánicos, gastronomía paisa y una vida nocturna vibrante en El Poblado.',
    image: 'https://images.unsplash.com/photo-1697745575737-a32c0c8e4707?w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1697745575737-a32c0c8e4707?w=1200&q=80',
      'https://images.unsplash.com/photo-1599309329365-50e58c9cf64b?w=1200&q=80',
      'https://images.unsplash.com/photo-1568632234157-ce7aecd03d0d?w=1200&q=80',
    ],
    priceFrom: 750000,
    avgDays: 3,
    experience: 'urbano',
    rating: 4.5,
    available: true,
    highlights: ['Comuna 13', 'Guatapé', 'Plaza Botero', 'Metrocable'],
  },
  {
    id: 'san-andres',
    name: 'San Andrés',
    country: 'Colombia',
    region: 'Caribe',
    tagline: 'El mar de los siete colores.',
    description: 'Una isla diminuta con un océano que cambia de azul a turquesa según la luz. Buceo en arrecifes, ciclismo costero y reggae en West View.',
    image: 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=1200&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&q=80',
    ],
    priceFrom: 1500000,
    avgDays: 5,
    experience: 'playa',
    rating: 4.4,
    available: true,
    highlights: ['Johnny Cay', 'Hoyo Soplador', 'Buceo en La Piscinita', 'Vuelta a la isla'],
  },
  {
    id: 'cusco',
    name: 'Cusco & Machu Picchu',
    country: 'Perú',
    region: 'Andes',
    tagline: 'Capital del imperio Inca, puerta de Machu Picchu.',
    description: 'A 3.400 metros de altura, Cusco fusiona piedra inca con barroco español. Desde aquí parte el camino a Machu Picchu, una de las siete maravillas del mundo.',
    image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1200&q=80',
      'https://images.unsplash.com/photo-1580619305218-8423a7ef79b4?w=1200&q=80',
      'https://images.unsplash.com/photo-1531968455001-5c5272a41129?w=1200&q=80',
    ],
    priceFrom: 2400000,
    avgDays: 7,
    experience: 'cultural',
    rating: 4.9,
    available: true,
    highlights: ['Machu Picchu', 'Valle Sagrado', 'Sacsayhuamán', 'Mercado de San Pedro'],
  },
  {
    id: 'buenos-aires',
    name: 'Buenos Aires',
    country: 'Argentina',
    region: 'Cono Sur',
    tagline: 'Tango, parrillas y librerías centenarias.',
    description: 'La París del Sur seduce con sus barrios diversos: el aire bohemio de San Telmo, el color de La Boca, la elegancia de Recoleta. Carne, vino y noches que se estiran.',
    image: 'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=1200&q=80',
      'https://images.unsplash.com/photo-1612294037637-ec931d278a8d?w=1200&q=80',
      'https://images.unsplash.com/photo-1573053884310-d057f6c5fac6?w=1200&q=80',
    ],
    priceFrom: 1800000,
    avgDays: 5,
    experience: 'urbano',
    rating: 4.6,
    available: true,
    highlights: ['Caminito', 'Teatro Colón', 'Cementerio de Recoleta', 'Milonga en San Telmo'],
  },
  {
    id: 'tulum',
    name: 'Tulum',
    country: 'México',
    region: 'Caribe',
    tagline: 'Ruinas mayas frente al mar Caribe.',
    description: 'Playas blancas, cenotes selváticos y un castillo maya colgando sobre acantilados. Tulum es ritual lento, yoga al amanecer y mezcal al ocaso.',
    image: 'https://images.unsplash.com/photo-1518638150340-f706e86654de?w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1518638150340-f706e86654de?w=1200&q=80',
      'https://images.unsplash.com/photo-1552074284-5e88ef1aef18?w=1200&q=80',
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&q=80',
    ],
    priceFrom: 2100000,
    avgDays: 6,
    experience: 'playa',
    rating: 4.5,
    available: false,
    highlights: ['Ruinas de Tulum', 'Cenote Dos Ojos', 'Sian Ka\'an', 'Yoga al amanecer'],
  },
  {
    id: 'cdmx',
    name: 'Ciudad de México',
    country: 'México',
    region: 'Norteamérica',
    tagline: 'Megaciudad que fusiona azteca, colonial y moderno.',
    description: 'Murales de Diego Rivera, tacos al pastor, Frida en Coyoacán y pirámides en Teotihuacán. Una ciudad inagotable donde cada barrio es un mundo.',
    image: 'https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=1200&q=80',
      'https://images.unsplash.com/photo-1585464231875-d9ef1f5ad396?w=1200&q=80',
      'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200&q=80',
    ],
    priceFrom: 1600000,
    avgDays: 5,
    experience: 'cultural',
    rating: 4.7,
    available: true,
    highlights: ['Teotihuacán', 'Casa Azul de Frida', 'Xochimilco', 'Bellas Artes'],
  },
  {
    id: 'patagonia',
    name: 'Patagonia',
    country: 'Chile',
    region: 'Cono Sur',
    tagline: 'Torres graníticas, glaciares azules, vientos infinitos.',
    description: 'El sur del mundo. Trekking entre montañas que parecen pintadas, glaciares que crujen y guanacos que cruzan el horizonte. Aventura pura.',
    image: 'https://images.unsplash.com/photo-1531176175280-33e81d8e6c41?w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1531176175280-33e81d8e6c41?w=1200&q=80',
      'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=1200&q=80',
      'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=1200&q=80',
    ],
    priceFrom: 3200000,
    avgDays: 8,
    experience: 'aventura',
    rating: 4.9,
    available: true,
    highlights: ['Torres del Paine', 'Glaciar Grey', 'Trekking W', 'Puerto Natales'],
  },
  {
    id: 'lisboa',
    name: 'Lisboa',
    country: 'Portugal',
    region: 'Europa',
    tagline: 'Azulejos, tranvías amarillos y fado al anochecer.',
    description: 'La capital portuguesa baila entre colinas y el río Tajo. Pasteles de Belém, miradores con vistas infinitas y el fado que cuenta historias de mar.',
    image: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=1200&q=80',
      'https://images.unsplash.com/photo-1588535537514-19255e7a4ca8?w=1200&q=80',
      'https://images.unsplash.com/photo-1513735718075-2e6c39cd62ee?w=1200&q=80',
    ],
    priceFrom: 3800000,
    avgDays: 6,
    experience: 'cultural',
    rating: 4.6,
    available: true,
    highlights: ['Belém', 'Alfama', 'Tranvía 28', 'Sintra'],
  },
  {
    id: 'kyoto',
    name: 'Kioto',
    country: 'Japón',
    region: 'Asia',
    tagline: 'Templos en pétalos de cerezo, geishas y jardines zen.',
    description: 'Antigua capital imperial donde el tiempo conserva su forma. Mil torii rojos en Fushimi Inari, jardines de musgo y la elegancia silenciosa de Gion.',
    image: 'https://images.unsplash.com/photo-1492571350019-22de08371fd3?w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1492571350019-22de08371fd3?w=1200&q=80',
      'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=1200&q=80',
      'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1200&q=80',
    ],
    priceFrom: 5400000,
    avgDays: 7,
    experience: 'cultural',
    rating: 4.9,
    available: true,
    highlights: ['Fushimi Inari', 'Bambú de Arashiyama', 'Gion', 'Kinkaku-ji'],
  },
  {
    id: 'amazonas',
    name: 'Amazonas',
    country: 'Colombia',
    region: 'Amazonía',
    tagline: 'Selva infinita, ríos color té, comunidades ancestrales.',
    description: 'Leticia es la puerta al pulmón del planeta. Caminatas nocturnas en la selva, delfines rosados y comunidades indígenas que protegen este ecosistema único.',
    image: 'https://images.unsplash.com/photo-1592276713921-c4d75c8f8b1b?w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1592276713921-c4d75c8f8b1b?w=1200&q=80',
      'https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=1200&q=80',
      'https://images.unsplash.com/photo-1559825481-12a05750d6fe?w=1200&q=80',
    ],
    priceFrom: 1900000,
    avgDays: 5,
    experience: 'naturaleza',
    rating: 4.7,
    available: true,
    highlights: ['Isla de los Micos', 'Puerto Nariño', 'Delfines rosados', 'Comunidad Tikuna'],
  },
];

const EXPERIENCE_OPTIONS = [
  { value: 'cultural', label: 'Cultural' },
  { value: 'naturaleza', label: 'Naturaleza' },
  { value: 'playa', label: 'Playa' },
  { value: 'urbano', label: 'Urbano' },
  { value: 'aventura', label: 'Aventura' },
  { value: 'gastronomico', label: 'Gastronómico' },
];

// Mantenido para compatibilidad de exportación — los datos reales vienen del DB
const SEED_REVIEWS = [
  { id: 'r-seed-1', destId: 'cartagena', author: 'Mariana Vélez', rating: 5, comment: 'El atardecer desde el Café del Mar es uno de esos momentos que te recuerdan por qué viajas.', createdAt: Date.now() - 86400000 * 12 },
  { id: 'r-seed-2', destId: 'cartagena', author: 'Andrés Restrepo', rating: 4, comment: 'Hermosa pero atestada en temporada alta. Recomiendo ir entre semana.', createdAt: Date.now() - 86400000 * 45 },
  { id: 'r-seed-3', destId: 'eje-cafetero', author: 'Laura Mejía', rating: 5, comment: 'El Valle de Cocora superó todas mis expectativas.', createdAt: Date.now() - 86400000 * 7 },
  { id: 'r-seed-4', destId: 'cusco', author: 'Diego Quintero', rating: 5, comment: 'Machu Picchu al amanecer, con la niebla disipándose lentamente, te deja sin palabras.', createdAt: Date.now() - 86400000 * 22 },
  { id: 'r-seed-5', destId: 'kyoto', author: 'Sofía Ramírez', rating: 5, comment: 'Cada templo es una experiencia distinta. Fushimi Inari de madrugada es casi espiritual.', createdAt: Date.now() - 86400000 * 30 },
  { id: 'r-seed-6', destId: 'medellin', author: 'Camilo Ospina', rating: 4, comment: 'La energía de la ciudad es contagiosa. La Comuna 13 con un guía local te abre los ojos.', createdAt: Date.now() - 86400000 * 60 },
  { id: 'r-seed-7', destId: 'patagonia', author: 'Valentina Soto', rating: 5, comment: 'Los vientos son brutales pero el paisaje compensa. Trekking W cambia la perspectiva.', createdAt: Date.now() - 86400000 * 90 },
];

// ---------------------- Mappers DB → JS ----------------------

function mapProfile(row, session) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    prefs: { budget: row.budget || 2000000, experiences: row.experiences || [] },
    sessionToken: session?.access_token || 'active',
  };
}

function mapItinerary(row) {
  return {
    id: row.id,
    name: row.name,
    start: row.start_date,
    end: row.end_date,
    items: (row.itinerary_items || []).map(mapItem),
    createdAt: new Date(row.created_at).getTime(),
  };
}

function mapItem(row) {
  return {
    id: row.id,
    itineraryId: row.itinerary_id,
    type: row.type,
    name: row.name,
    date: row.item_date,
    time: row.item_time ? row.item_time.slice(0, 5) : '',
    cost: row.cost || 0,
    notes: row.notes || '',
    destId: row.dest_id || null,
  };
}

function mapReservation(row) {
  return {
    id: row.id,
    destId: row.dest_id,
    destName: row.dest_name,
    name: row.dest_name,
    guests: row.guests,
    cost: row.cost,
    date: row.travel_date,
    status: row.status,
    createdAt: new Date(row.created_at).getTime(),
  };
}

function mapReview(row) {
  return {
    id: row.id,
    destId: row.dest_id,
    author: row.author_name,
    rating: row.rating,
    comment: row.comment || '',
    userId: row.user_id,
    createdAt: new Date(row.created_at).getTime(),
  };
}

// ---------------------- StoreContext ----------------------

const StoreContext = React.createContext(null);

function StoreProvider({ children }) {
  const [state, setState] = React.useState({
    user: null,
    session: null,
    itineraries: [],
    reservations: [],
    reviews: [],
    loading: true,
    emailVerified: false,
    emailVerifyError: null,
  });

  // Refs estables para acceder al estado actual desde las acciones (sin recrearlas)
  const sessionRef = React.useRef(null);
  const userRef = React.useRef(null);
  const emailVerifiedRef = React.useRef(false);

  const loadUserData = React.useCallback(async (session) => {
    sessionRef.current = session;
    try {
      const [profileRes, itinRes, resRes, revRes] = await Promise.all([
        sb.from('profiles').select('*').eq('id', session.user.id).single(),
        sb.from('itineraries').select('*, itinerary_items(*)').order('created_at', { ascending: false }),
        sb.from('reservations').select('*').order('created_at', { ascending: false }),
        sb.from('reviews').select('*').order('created_at', { ascending: false }),
      ]);

      const user = profileRes.data
        ? mapProfile(profileRes.data, session)
        : {
            id: session.user.id,
            name: session.user.user_metadata?.name || session.user.email.split('@')[0],
            email: session.user.email,
            prefs: { budget: 2000000, experiences: [] },
            sessionToken: session.access_token,
          };

      userRef.current = user;

      setState(prev => ({
        ...prev,
        session,
        user,
        itineraries: (itinRes.data || []).map(mapItinerary),
        reservations: (resRes.data || []).map(mapReservation),
        reviews: (revRes.data || []).map(mapReview),
        loading: false,
      }));
    } catch (e) {
      console.error('Error cargando datos de usuario:', e);
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  React.useEffect(() => {
    const { data: { subscription } } = sb.auth.onAuthStateChange(async (event, session) => {
      try {
      // Caso: link de verificación de correo expirado/inválido (INITIAL_SESSION sin sesión)
      if (event === 'INITIAL_SESSION' && !session && window.__horizeoAuthError) {
        const errType = window.__horizeoAuthError.toLowerCase().includes('expir') ? 'expired' : 'invalid';
        window.__horizeoAuthError = null;
        setState(prev => ({ ...prev, loading: false, emailVerifyError: errType }));
        return;
      }

      if (event === 'PASSWORD_RECOVERY') {
        if (session) await loadUserData(session);
        else setState(s => ({ ...s, loading: false }));
        window.location.hash = '/reset-password';
        return;
      }

      // Caso: usuario llegó desde el link de verificación de correo → redirigir al login
      if (event === 'SIGNED_IN' && window.__horizeoAuthType === 'signup') {
        window.__horizeoAuthType = null;
        emailVerifiedRef.current = true;
        await sb.auth.signOut();
        return;
      }

      if (session) {
        await loadUserData(session);
      } else {
        sessionRef.current = null;
        userRef.current = null;
        const verified = emailVerifiedRef.current;
        emailVerifiedRef.current = false;
        setState(prev => ({
          user: null, session: null,
          itineraries: [], reservations: [], reviews: [],
          loading: false,
          emailVerified: verified,
          emailVerifyError: prev.emailVerifyError,
        }));
      }
      } catch (e) {
        console.error('onAuthStateChange error:', e);
        setState(prev => ({ ...prev, loading: false }));
      }
    });
    return () => subscription.unsubscribe();
  }, [loadUserData]);

  // Acciones: estables (deps=[]), usan refs y setState funcional
  const actions = React.useMemo(() => ({

    // -------- Itinerarios --------
    async createItinerary({ name, start, end }) {
      const userId = sessionRef.current?.user?.id;
      if (!userId) return { ok: false, error: 'No autenticado' };
      const { data, error } = await sb.from('itineraries').insert({
        user_id: userId,
        name: name.trim(),
        start_date: start,
        end_date: end,
      }).select('*, itinerary_items(*)').single();
      if (error) return { ok: false, error: error.message };
      const it = mapItinerary(data);
      setState(prev => ({ ...prev, itineraries: [it, ...prev.itineraries] }));
      return { ok: true, data: it };
    },

    async addItineraryItem(itId, item) {
      const { data, error } = await sb.from('itinerary_items').insert({
        itinerary_id: itId,
        type: item.type,
        name: item.name,
        item_date: item.date,
        item_time: item.time || '09:00',
        cost: item.cost || 0,
        notes: item.notes || null,
        dest_id: item.destId || null,
      }).select().single();
      if (error) return { ok: false, error: error.message };
      const newItem = mapItem(data);
      setState(prev => ({
        ...prev,
        itineraries: prev.itineraries.map(it =>
          it.id === itId ? { ...it, items: [...it.items, newItem] } : it
        ),
      }));
      return { ok: true, data: newItem };
    },

    async updateItineraryItem(itId, itemId, patch) {
      const dbPatch = {};
      if (patch.type !== undefined) dbPatch.type = patch.type;
      if (patch.name !== undefined) dbPatch.name = patch.name;
      if (patch.date !== undefined) dbPatch.item_date = patch.date;
      if (patch.time !== undefined) dbPatch.item_time = patch.time;
      if (patch.cost !== undefined) dbPatch.cost = patch.cost;
      if (patch.notes !== undefined) dbPatch.notes = patch.notes || null;
      const { error } = await sb.from('itinerary_items').update(dbPatch).eq('id', itemId);
      if (error) return { ok: false, error: error.message };
      setState(prev => ({
        ...prev,
        itineraries: prev.itineraries.map(it =>
          it.id === itId
            ? { ...it, items: it.items.map(x => x.id === itemId ? { ...x, ...patch } : x) }
            : it
        ),
      }));
      return { ok: true };
    },

    async removeItineraryItem(itId, itemId) {
      const { error } = await sb.from('itinerary_items').delete().eq('id', itemId);
      if (error) return { ok: false, error: error.message };
      setState(prev => ({
        ...prev,
        itineraries: prev.itineraries.map(it =>
          it.id === itId ? { ...it, items: it.items.filter(x => x.id !== itemId) } : it
        ),
      }));
      return { ok: true };
    },

    async deleteItinerary(itId) {
      const { error } = await sb.from('itineraries').delete().eq('id', itId);
      if (error) return { ok: false, error: error.message };
      setState(prev => ({ ...prev, itineraries: prev.itineraries.filter(it => it.id !== itId) }));
      return { ok: true };
    },

    async renameItinerary(itId, patch) {
      const dbPatch = {};
      if (patch.name) dbPatch.name = patch.name.trim();
      if (patch.start) dbPatch.start_date = patch.start;
      if (patch.end) dbPatch.end_date = patch.end;
      const { error } = await sb.from('itineraries').update(dbPatch).eq('id', itId);
      if (error) return { ok: false, error: error.message };
      setState(prev => ({
        ...prev,
        itineraries: prev.itineraries.map(it => it.id === itId ? { ...it, ...patch } : it),
      }));
      return { ok: true };
    },

    // -------- Reservas --------
    async createReservation({ destId, name, cost, date, guests = 1 }) {
      const userId = sessionRef.current?.user?.id;
      if (!userId) return { ok: false, error: 'No autenticado' };
      const dest = DESTINATIONS.find(d => d.id === destId);
      const { data, error } = await sb.from('reservations').insert({
        user_id: userId,
        dest_id: destId,
        dest_name: dest ? dest.name : (name || destId),
        guests: Math.max(1, Math.min(10, guests)),
        cost,
        travel_date: date,
        status: 'pending',
      }).select().single();
      if (error) return { ok: false, error: error.message };
      const r = mapReservation(data);
      setState(prev => ({ ...prev, reservations: [r, ...prev.reservations] }));
      // Auto-confirmación tras 2.2 s (simula flujo del prototipo)
      const rid = data.id;
      setTimeout(async () => {
        await sb.from('reservations').update({ status: 'confirmed' }).eq('id', rid);
        setState(prev => ({
          ...prev,
          reservations: prev.reservations.map(x => x.id === rid ? { ...x, status: 'confirmed' } : x),
        }));
      }, 2200);
      return { ok: true, data: r };
    },

    async cancelReservation(id) {
      const { error } = await sb.from('reservations').update({ status: 'cancelled' }).eq('id', id);
      if (error) return { ok: false, error: error.message };
      setState(prev => ({
        ...prev,
        reservations: prev.reservations.map(r => r.id === id ? { ...r, status: 'cancelled' } : r),
      }));
      return { ok: true };
    },

    // -------- Reseñas --------
    async addReview({ destId, rating, comment }) {
      const userId = sessionRef.current?.user?.id;
      if (!userId) return { ok: false, error: 'No autenticado' };
      const authorName = userRef.current?.name || 'Viajero';
      const { data, error } = await sb.from('reviews').insert({
        user_id: userId,
        dest_id: destId,
        author_name: authorName,
        rating,
        comment: comment ? comment.slice(0, 500) : null,
      }).select().single();
      if (error) return { ok: false, error: error.message };
      const r = mapReview(data);
      setState(prev => ({ ...prev, reviews: [r, ...prev.reviews] }));
      return { ok: true, data: r };
    },

    // -------- Perfil --------
    async updateProfile(patch) {
      const userId = sessionRef.current?.user?.id;
      if (!userId) return { ok: false, error: 'No autenticado' };
      const dbPatch = {};
      if (patch.name !== undefined) dbPatch.name = patch.name;
      if (patch.prefs?.budget !== undefined) dbPatch.budget = patch.prefs.budget;
      if (patch.prefs?.experiences !== undefined) dbPatch.experiences = patch.prefs.experiences;
      const { error } = await sb.from('profiles').update(dbPatch).eq('id', userId);
      if (error) return { ok: false, error: error.message };
      // Actualizar ref del nombre para futuros addReview
      if (patch.name && userRef.current) userRef.current = { ...userRef.current, name: patch.name };
      setState(prev => ({
        ...prev,
        user: prev.user ? {
          ...prev.user,
          ...(patch.name !== undefined ? { name: patch.name } : {}),
          prefs: { ...prev.user.prefs, ...(patch.prefs || {}) },
        } : null,
      }));
      return { ok: true };
    },

    // -------- Sesión --------
    async logout() {
      await sb.auth.signOut(); // limpia la sesión local (localStorage) siempre, incluso sin red
      sessionRef.current = null;
      userRef.current = null;
      setState({
        user: null, session: null,
        itineraries: [], reservations: [], reviews: [],
        loading: false,
        emailVerified: false,
        emailVerifyError: null,
      });
    },

    async resetAll() {
      await sb.auth.signOut();
      sessionRef.current = null;
      userRef.current = null;
      setState({
        user: null, session: null,
        itineraries: [], reservations: [], reviews: [],
        loading: false,
        emailVerified: false,
        emailVerifyError: null,
      });
    },

    clearVerificationState() {
      setState(prev => ({ ...prev, emailVerified: false, emailVerifyError: null }));
    },

  }), []); // deps=[] — usa refs y setState funcional (ambos estables)

  return (
    <StoreContext.Provider value={{ state, actions }}>
      {children}
    </StoreContext.Provider>
  );
}

function useStore() {
  const ctx = React.useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be inside StoreProvider');
  return ctx;
}

// ---------------------- Format helpers ----------------------

function formatCOP(n) {
  if (n == null) return '';
  return '$' + Math.round(n).toLocaleString('es-CO');
}

function formatDate(d) {
  if (!d) return '';
  // Parsear strings YYYY-MM-DD como fecha local (evitar desfase UTC)
  if (typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d)) {
    const [y, m, day] = d.split('-').map(Number);
    return new Date(y, m - 1, day).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' });
  }
  const date = typeof d === 'string' ? new Date(d) : d;
  if (isNaN(date)) return '';
  return date.toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatDateShort(d) {
  if (!d) return '';
  if (typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d)) {
    const [y, m, day] = d.split('-').map(Number);
    return new Date(y, m - 1, day).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' });
  }
  const date = typeof d === 'string' ? new Date(d) : d;
  if (isNaN(date)) return '';
  return date.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' });
}

function formatDay(d) {
  if (!d) return '';
  const date = typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d)
    ? (() => { const [y, m, day] = d.split('-').map(Number); return new Date(y, m - 1, day); })()
    : (typeof d === 'string' ? new Date(d) : d);
  if (isNaN(date)) return '';
  const wd = date.toLocaleDateString('es-CO', { weekday: 'long' });
  return wd.charAt(0).toUpperCase() + wd.slice(1);
}

function daysBetween(start, end) {
  if (!start || !end) return 0;
  const parseLocal = (s) => {
    if (typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s)) {
      const [y, m, d] = s.split('-').map(Number);
      return new Date(y, m - 1, d);
    }
    return new Date(s);
  };
  return Math.max(1, Math.round((parseLocal(end) - parseLocal(start)) / 86400000) + 1);
}

function relativeTime(ts) {
  const diff = Date.now() - ts;
  const d = Math.floor(diff / 86400000);
  if (d < 1) return 'hoy';
  if (d < 7) return `hace ${d} día${d > 1 ? 's' : ''}`;
  if (d < 30) return `hace ${Math.floor(d / 7)} semana${Math.floor(d / 7) > 1 ? 's' : ''}`;
  if (d < 365) return `hace ${Math.floor(d / 30)} mes${Math.floor(d / 30) > 1 ? 'es' : ''}`;
  return `hace ${Math.floor(d / 365)} año${Math.floor(d / 365) > 1 ? 's' : ''}`;
}

// ---------------------- Aggregate helpers ----------------------

function getDestinationById(id) {
  return DESTINATIONS.find(d => d.id === id);
}

// Con Supabase todas las reseñas (seed + usuario) vienen en state.reviews
function getReviewsForDest(destId, allReviews = []) {
  return allReviews.filter(r => r.destId === destId);
}

function getRatingForDest(destId, allReviews = []) {
  const reviews = allReviews.filter(r => r.destId === destId);
  if (!reviews.length) {
    const d = getDestinationById(destId);
    return d ? d.rating : 0;
  }
  return reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
}

// ---------------------- Export to window ----------------------

Object.assign(window, {
  DESTINATIONS,
  EXPERIENCE_OPTIONS,
  SEED_REVIEWS,
  StoreContext,
  StoreProvider,
  useStore,
  formatCOP,
  formatDate,
  formatDateShort,
  formatDay,
  daysBetween,
  relativeTime,
  getDestinationById,
  getReviewsForDest,
  getRatingForDest,
});
