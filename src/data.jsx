/* ================================================================
   HORIZEO · Data layer
   - Destinos mock
   - Helpers de storage (localStorage)
   - useStore: estado global mínimo (usuario, itinerarios, reservas, reseñas)
   ================================================================ */

const STORAGE_KEY = 'horizeo.v1';

// ---------------------- Destinos mock ----------------------

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

// Reseñas precargadas (de "otros viajeros")
const SEED_REVIEWS = [
  { id: 'r-seed-1', destId: 'cartagena', author: 'Mariana Vélez', rating: 5, comment: 'El atardecer desde el Café del Mar es uno de esos momentos que te recuerdan por qué viajas. La ciudad amurallada al atardecer es magia pura.', createdAt: Date.now() - 86400000 * 12 },
  { id: 'r-seed-2', destId: 'cartagena', author: 'Andrés Restrepo', rating: 4, comment: 'Hermosa pero atestada en temporada alta. Recomiendo ir entre semana y madrugar para recorrer las calles vacías.', createdAt: Date.now() - 86400000 * 45 },
  { id: 'r-seed-3', destId: 'eje-cafetero', author: 'Laura Mejía', rating: 5, comment: 'El Valle de Cocora superó todas mis expectativas. Caminar entre palmas de 60 metros es algo que recordaré toda la vida.', createdAt: Date.now() - 86400000 * 7 },
  { id: 'r-seed-4', destId: 'cusco', author: 'Diego Quintero', rating: 5, comment: 'Machu Picchu al amanecer, con la niebla disipándose lentamente, te deja sin palabras. Llevar tiempo para aclimatarse a la altura.', createdAt: Date.now() - 86400000 * 22 },
  { id: 'r-seed-5', destId: 'kyoto', author: 'Sofía Ramírez', rating: 5, comment: 'Cada templo es una experiencia distinta. Fushimi Inari de madrugada es casi espiritual.', createdAt: Date.now() - 86400000 * 30 },
  { id: 'r-seed-6', destId: 'medellin', author: 'Camilo Ospina', rating: 4, comment: 'La energía de la ciudad es contagiosa. La Comuna 13 con un guía local te abre los ojos a otra historia.', createdAt: Date.now() - 86400000 * 60 },
  { id: 'r-seed-7', destId: 'patagonia', author: 'Valentina Soto', rating: 5, comment: 'Los vientos son brutales pero el paisaje compensa. Trekking W cambia la perspectiva sobre lo que significa "naturaleza".', createdAt: Date.now() - 86400000 * 90 },
];

// ---------------------- Storage helpers ----------------------

const defaultState = {
  user: null,        // { id, name, email, password, prefs: { experiences: [], budget: 0 } }
  loginAttempts: {}, // { email: { count, lockedUntil } }
  itineraries: [],   // [{ id, name, start, end, items: [...] }]
  reservations: [],  // [{ id, destId, status, createdAt, cost, name }]
  reviews: [],       // user-added reviews
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultState };
    const parsed = JSON.parse(raw);
    return { ...defaultState, ...parsed };
  } catch (e) {
    return { ...defaultState };
  }
}

function saveState(state) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  catch (e) { console.warn('Storage failed', e); }
}

function resetState() {
  localStorage.removeItem(STORAGE_KEY);
}

// ---------------------- Hashing (mock bcrypt) ----------------------
// HU01 criterio 4: contraseña almacenada cifrada. Simulamos con un hash simple
// (no es bcrypt real, pero es un hash determinístico — sirve para el prototipo).
function mockHash(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = (h * 0x01000193) >>> 0;
  }
  return 'bcrypt$10$' + h.toString(16).padStart(16, '0') + Math.abs(h * 17).toString(16);
}

// ---------------------- useStore: estado global ----------------------

const StoreContext = React.createContext(null);

function StoreProvider({ children }) {
  const [state, setState] = React.useState(() => loadState());

  // Persist on every change
  React.useEffect(() => { saveState(state); }, [state]);

  const update = React.useCallback((updater) => {
    setState((prev) => (typeof updater === 'function' ? updater(prev) : { ...prev, ...updater }));
  }, []);

  // ---------------- Auth actions ----------------
  const actions = React.useMemo(() => ({
    register({ name, email, password }) {
      // HU01 criterio 1: validar email + min 8 caracteres
      const errors = {};
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Formato de correo inválido';
      if (password.length < 8) errors.password = 'La contraseña debe tener mínimo 8 caracteres';
      // HU01 criterio 2: correo ya registrado
      if (state.user && state.user.email === email.toLowerCase()) {
        errors.email = 'Este correo ya está registrado';
      }
      if (Object.keys(errors).length) return { ok: false, errors };

      const user = {
        id: 'u-' + Date.now(),
        name: name.trim(),
        email: email.toLowerCase().trim(),
        passwordHash: mockHash(password), // HU01 criterio 4
        prefs: { experiences: [], budget: 2000000 },
        createdAt: Date.now(),
      };
      update({ user });
      return { ok: true };
    },

    login({ email, password }) {
      const e = email.toLowerCase().trim();
      const now = Date.now();
      const attempt = state.loginAttempts[e] || { count: 0, lockedUntil: 0 };

      // HU02 criterio 2: tras 3 intentos, bloqueo de 5 min
      if (attempt.lockedUntil > now) {
        const minutes = Math.ceil((attempt.lockedUntil - now) / 60000);
        return { ok: false, errors: { _: `Cuenta bloqueada. Intenta en ${minutes} min.` } };
      }

      if (!state.user || state.user.email !== e) {
        // Registro implícito si no existe usuario alguno (UX cómoda en prototipo)
        return { ok: false, errors: { _: 'No existe una cuenta con ese correo.' } };
      }

      if (state.user.passwordHash !== mockHash(password)) {
        const next = { ...attempt, count: attempt.count + 1 };
        if (next.count >= 3) {
          next.lockedUntil = now + 5 * 60 * 1000;
          next.count = 0;
        }
        update({ loginAttempts: { ...state.loginAttempts, [e]: next } });
        return { ok: false, errors: { _: 'Credenciales incorrectas.' } };
      }

      // Login exitoso
      const newAttempts = { ...state.loginAttempts };
      delete newAttempts[e];
      update((prev) => ({
        ...prev,
        user: { ...prev.user, sessionToken: 'jwt.' + Math.random().toString(36).slice(2) },
        loginAttempts: newAttempts,
      }));
      return { ok: true };
    },

    logout() {
      // HU02 criterio 4: cerrar sesión
      update((prev) => ({
        ...prev,
        user: prev.user ? { ...prev.user, sessionToken: null } : null,
      }));
    },

    updateProfile(patch) {
      update((prev) => ({ ...prev, user: { ...prev.user, ...patch, prefs: { ...prev.user.prefs, ...(patch.prefs || {}) } } }));
    },

    // ---------------- Itinerarios ----------------
    createItinerary({ name, start, end }) {
      const it = {
        id: 'it-' + Date.now(),
        name: name.trim(),
        start, end,
        items: [],
        createdAt: Date.now(),
      };
      update((prev) => ({ ...prev, itineraries: [...prev.itineraries, it] }));
      return it;
    },

    addItineraryItem(itId, item) {
      const newItem = { id: 'item-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6), ...item };
      update((prev) => ({
        ...prev,
        itineraries: prev.itineraries.map((it) => it.id === itId ? { ...it, items: [...it.items, newItem] } : it),
      }));
      return newItem;
    },

    updateItineraryItem(itId, itemId, patch) {
      update((prev) => ({
        ...prev,
        itineraries: prev.itineraries.map((it) => it.id === itId
          ? { ...it, items: it.items.map((x) => x.id === itemId ? { ...x, ...patch } : x) }
          : it),
      }));
    },

    removeItineraryItem(itId, itemId) {
      update((prev) => ({
        ...prev,
        itineraries: prev.itineraries.map((it) => it.id === itId
          ? { ...it, items: it.items.filter((x) => x.id !== itemId) }
          : it),
      }));
    },

    deleteItinerary(itId) {
      update((prev) => ({ ...prev, itineraries: prev.itineraries.filter((it) => it.id !== itId) }));
    },

    renameItinerary(itId, patch) {
      update((prev) => ({
        ...prev,
        itineraries: prev.itineraries.map((it) => it.id === itId ? { ...it, ...patch } : it),
      }));
    },

    // ---------------- Reservas ----------------
    createReservation({ destId, name, cost, date }) {
      const dest = DESTINATIONS.find((d) => d.id === destId);
      const r = {
        id: 'rs-' + Date.now(),
        destId,
        destName: dest ? dest.name : name,
        name: name || (dest && dest.name),
        cost,
        date,
        status: 'pending',
        createdAt: Date.now(),
      };
      update((prev) => ({ ...prev, reservations: [r, ...prev.reservations] }));
      // Simular confirmación tras 2 segundos
      setTimeout(() => {
        setState((prev) => ({
          ...prev,
          reservations: prev.reservations.map((x) => x.id === r.id ? { ...x, status: 'confirmed' } : x),
        }));
      }, 2200);
      return r;
    },

    cancelReservation(id) {
      update((prev) => ({
        ...prev,
        reservations: prev.reservations.map((r) => r.id === id ? { ...r, status: 'cancelled' } : r),
      }));
    },

    // ---------------- Reseñas ----------------
    addReview({ destId, rating, comment }) {
      const r = {
        id: 'rv-' + Date.now(),
        destId,
        rating,
        comment: comment.slice(0, 500),
        author: state.user ? state.user.name : 'Viajero',
        userId: state.user && state.user.id,
        createdAt: Date.now(),
      };
      update((prev) => ({ ...prev, reviews: [r, ...prev.reviews] }));
      return r;
    },

    resetAll() {
      resetState();
      setState({ ...defaultState });
    },
  }), [state, update]);

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
  const date = typeof d === 'string' ? new Date(d) : d;
  if (isNaN(date)) return '';
  return date.toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatDateShort(d) {
  if (!d) return '';
  const date = typeof d === 'string' ? new Date(d) : d;
  if (isNaN(date)) return '';
  return date.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' });
}

function formatDay(d) {
  if (!d) return '';
  const date = typeof d === 'string' ? new Date(d) : d;
  if (isNaN(date)) return '';
  const wd = date.toLocaleDateString('es-CO', { weekday: 'long' });
  return wd.charAt(0).toUpperCase() + wd.slice(1);
}

function daysBetween(start, end) {
  if (!start || !end) return 0;
  const a = new Date(start), b = new Date(end);
  return Math.max(1, Math.round((b - a) / 86400000) + 1);
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
  return DESTINATIONS.find((d) => d.id === id);
}

function getReviewsForDest(destId, userReviews = []) {
  const seed = SEED_REVIEWS.filter((r) => r.destId === destId);
  const user = userReviews.filter((r) => r.destId === destId);
  return [...user, ...seed];
}

function getRatingForDest(destId, userReviews = []) {
  const all = getReviewsForDest(destId, userReviews);
  if (!all.length) {
    const d = getDestinationById(destId);
    return d ? d.rating : 0;
  }
  const sum = all.reduce((s, r) => s + r.rating, 0);
  return sum / all.length;
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
  mockHash,
});
