-- ================================================================
--  HORIZEO · Supabase Migration
--  Esquema completo + RLS + Seed data
--  Proyecto: xtgqsawmcofpvfafsste
-- ================================================================

-- ================================================================
-- 1. TABLAS
-- ================================================================

-- ----------------------------------------------------------------
-- 1.1 profiles — extiende auth.users (trigger lo llena en signup)
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id           uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name         text NOT NULL DEFAULT '',
  email        text NOT NULL DEFAULT '',
  budget       integer NOT NULL DEFAULT 2000000,
  experiences  text[] NOT NULL DEFAULT '{}',
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------
-- 1.2 destinations — solo lectura pública, seed via service_role
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.destinations (
  id           text PRIMARY KEY,
  name         text NOT NULL,
  country      text NOT NULL,
  region       text NOT NULL,
  tagline      text,
  description  text,
  image        text,
  gallery      text[] NOT NULL DEFAULT '{}',
  price_from   integer NOT NULL,
  avg_days     integer NOT NULL,
  experience   text NOT NULL,
  rating       numeric(3,1) NOT NULL DEFAULT 4.5,
  available    boolean NOT NULL DEFAULT true,
  highlights   text[] NOT NULL DEFAULT '{}',
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------
-- 1.3 itineraries
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.itineraries (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name         text NOT NULL,
  start_date   date NOT NULL,
  end_date     date NOT NULL,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT itineraries_name_not_empty CHECK (length(trim(name)) > 0),
  CONSTRAINT itineraries_dates_valid    CHECK (end_date >= start_date)
);

-- ----------------------------------------------------------------
-- 1.4 itinerary_items
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.itinerary_items (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  itinerary_id    uuid NOT NULL REFERENCES public.itineraries(id) ON DELETE CASCADE,
  type            text NOT NULL,
  name            text NOT NULL,
  item_date       date NOT NULL,
  item_time       time,
  cost            integer NOT NULL DEFAULT 0,
  notes           text,
  dest_id         text REFERENCES public.destinations(id),
  created_at      timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT items_type_valid       CHECK (type IN ('activity','lodging','transport','destination')),
  CONSTRAINT items_name_not_empty   CHECK (length(trim(name)) > 0),
  CONSTRAINT items_cost_positive    CHECK (cost >= 0),
  CONSTRAINT items_notes_length     CHECK (notes IS NULL OR length(notes) <= 500)
);

-- ----------------------------------------------------------------
-- 1.5 reservations
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.reservations (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  dest_id      text NOT NULL REFERENCES public.destinations(id),
  dest_name    text NOT NULL,
  guests       integer NOT NULL DEFAULT 1,
  cost         integer NOT NULL,
  travel_date  date NOT NULL,
  status       text NOT NULL DEFAULT 'pending',
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT reservations_guests_range  CHECK (guests >= 1 AND guests <= 10),
  CONSTRAINT reservations_cost_positive CHECK (cost >= 0),
  CONSTRAINT reservations_status_valid  CHECK (status IN ('pending','confirmed','cancelled'))
);

-- ----------------------------------------------------------------
-- 1.6 reviews — user_id nullable para reseñas seed editoriales
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.reviews (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  dest_id      text NOT NULL REFERENCES public.destinations(id),
  author_name  text NOT NULL,
  rating       integer NOT NULL,
  comment      text,
  created_at   timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT reviews_rating_range   CHECK (rating >= 1 AND rating <= 5),
  CONSTRAINT reviews_comment_length CHECK (comment IS NULL OR length(comment) <= 500),
  -- Un usuario real solo puede tener una reseña por destino
  -- NULLs son distintos en PostgreSQL: múltiples reseñas seed (user_id=NULL) son válidas
  CONSTRAINT reviews_unique_user_dest UNIQUE (user_id, dest_id)
);

-- ================================================================
-- 2. TRIGGERS
-- ================================================================

-- ----------------------------------------------------------------
-- 2.1 Auto-crear perfil cuando se registra un usuario en auth.users
-- ----------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, budget, experiences)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.email, ''),
    2000000,
    '{}'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ----------------------------------------------------------------
-- 2.2 Auto-actualizar updated_at en profiles, itineraries, reservations
-- ----------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS itineraries_updated_at ON public.itineraries;
CREATE TRIGGER itineraries_updated_at
  BEFORE UPDATE ON public.itineraries
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS reservations_updated_at ON public.reservations;
CREATE TRIGGER reservations_updated_at
  BEFORE UPDATE ON public.reservations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ================================================================
-- 3. ÍNDICES DE RENDIMIENTO
-- ================================================================
CREATE INDEX IF NOT EXISTS idx_itineraries_user     ON public.itineraries(user_id);
CREATE INDEX IF NOT EXISTS idx_items_itinerary       ON public.itinerary_items(itinerary_id);
CREATE INDEX IF NOT EXISTS idx_reservations_user     ON public.reservations(user_id);
CREATE INDEX IF NOT EXISTS idx_reservations_dest     ON public.reservations(dest_id);
CREATE INDEX IF NOT EXISTS idx_reservations_status   ON public.reservations(user_id, status);
CREATE INDEX IF NOT EXISTS idx_reviews_dest          ON public.reviews(dest_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_dest     ON public.reviews(user_id, dest_id);

-- ================================================================
-- 4. ROW LEVEL SECURITY
-- ================================================================

ALTER TABLE public.profiles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.destinations    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itineraries     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itinerary_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews         ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------
-- 4.1 profiles
-- ----------------------------------------------------------------
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- INSERT solo vía trigger SECURITY DEFINER — clientes no pueden hacer INSERT directo
-- DELETE en cascade desde auth.users

-- ----------------------------------------------------------------
-- 4.2 destinations — lectura pública, sin escritura desde cliente
-- ----------------------------------------------------------------
DROP POLICY IF EXISTS "destinations_select_public" ON public.destinations;
CREATE POLICY "destinations_select_public" ON public.destinations
  FOR SELECT USING (true);

-- ----------------------------------------------------------------
-- 4.3 itineraries
-- ----------------------------------------------------------------
DROP POLICY IF EXISTS "itineraries_select_own" ON public.itineraries;
CREATE POLICY "itineraries_select_own" ON public.itineraries
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "itineraries_insert_own" ON public.itineraries;
CREATE POLICY "itineraries_insert_own" ON public.itineraries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "itineraries_update_own" ON public.itineraries;
CREATE POLICY "itineraries_update_own" ON public.itineraries
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "itineraries_delete_own" ON public.itineraries;
CREATE POLICY "itineraries_delete_own" ON public.itineraries
  FOR DELETE USING (auth.uid() = user_id);

-- ----------------------------------------------------------------
-- 4.4 itinerary_items — acceso vía join a itineraries
-- ----------------------------------------------------------------
DROP POLICY IF EXISTS "items_select_own" ON public.itinerary_items;
CREATE POLICY "items_select_own" ON public.itinerary_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.itineraries
      WHERE itineraries.id = itinerary_items.itinerary_id
        AND itineraries.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "items_insert_own" ON public.itinerary_items;
CREATE POLICY "items_insert_own" ON public.itinerary_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.itineraries
      WHERE itineraries.id = itinerary_items.itinerary_id
        AND itineraries.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "items_update_own" ON public.itinerary_items;
CREATE POLICY "items_update_own" ON public.itinerary_items
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.itineraries
      WHERE itineraries.id = itinerary_items.itinerary_id
        AND itineraries.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.itineraries
      WHERE itineraries.id = itinerary_items.itinerary_id
        AND itineraries.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "items_delete_own" ON public.itinerary_items;
CREATE POLICY "items_delete_own" ON public.itinerary_items
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.itineraries
      WHERE itineraries.id = itinerary_items.itinerary_id
        AND itineraries.user_id = auth.uid()
    )
  );

-- ----------------------------------------------------------------
-- 4.5 reservations
-- ----------------------------------------------------------------
DROP POLICY IF EXISTS "reservations_select_own" ON public.reservations;
CREATE POLICY "reservations_select_own" ON public.reservations
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "reservations_insert_own" ON public.reservations;
CREATE POLICY "reservations_insert_own" ON public.reservations
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.destinations
      WHERE destinations.id = reservations.dest_id
        AND destinations.available = true
    )
  );

-- UPDATE permite:
--   USING  → solo filas donde el usuario es dueño y el status es 'pending' o 'confirmed'
--   CHECK  → el nuevo status solo puede ser 'confirmed' o 'cancelled'
--   Esto cubre: pending→confirmed (auto-confirm), pending→cancelled, confirmed→cancelled
DROP POLICY IF EXISTS "reservations_update_own" ON public.reservations;
CREATE POLICY "reservations_update_own" ON public.reservations
  FOR UPDATE
  USING (auth.uid() = user_id AND status IN ('pending', 'confirmed'))
  WITH CHECK (auth.uid() = user_id AND status IN ('confirmed', 'cancelled'));

-- No DELETE: cancelar = UPDATE status a 'cancelled'

-- ----------------------------------------------------------------
-- 4.6 reviews
-- ----------------------------------------------------------------
DROP POLICY IF EXISTS "reviews_select_public" ON public.reviews;
CREATE POLICY "reviews_select_public" ON public.reviews
  FOR SELECT USING (true);

-- INSERT: autenticado + reserva confirmada para ese destino
DROP POLICY IF EXISTS "reviews_insert_own" ON public.reviews;
CREATE POLICY "reviews_insert_own" ON public.reviews
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.reservations
      WHERE reservations.user_id = auth.uid()
        AND reservations.dest_id = reviews.dest_id
        AND reservations.status = 'confirmed'
    )
  );

-- UPDATE bloqueado (reseñas son inmutables tras publicarse)

DROP POLICY IF EXISTS "reviews_delete_own" ON public.reviews;
CREATE POLICY "reviews_delete_own" ON public.reviews
  FOR DELETE USING (auth.uid() = user_id);

-- ================================================================
-- 5. SEED DATA
-- ================================================================

-- ----------------------------------------------------------------
-- 5.1 Destinos (12 destinos)
-- ----------------------------------------------------------------
INSERT INTO public.destinations (id, name, country, region, tagline, description, image, gallery, price_from, avg_days, experience, rating, available, highlights)
VALUES
(
  'cartagena', 'Cartagena de Indias', 'Colombia', 'Caribe',
  'Calles empedradas, balcones de buganvilia y mar turquesa.',
  'La ciudad amurallada late con el ritmo del Caribe. Sus plazas coloniales y atardeceres frente al mar la convirtieron en patrimonio de la humanidad. Recorre Getsemaní, navega hasta las Islas del Rosario y termina el día con cocteles sobre las murallas.',
  'https://images.unsplash.com/photo-1599581137827-2c64b8c4dc26?w=1200&q=80',
  ARRAY['https://images.unsplash.com/photo-1599581137827-2c64b8c4dc26?w=1200&q=80','https://images.unsplash.com/photo-1583531352515-8884af319dc4?w=1200&q=80','https://images.unsplash.com/photo-1568632234157-ce7aecd03d0d?w=1200&q=80'],
  1200000, 5, 'cultural', 4.7, true,
  ARRAY['Ciudad amurallada','Islas del Rosario','Café en Getsemaní','Atardeceres del Café del Mar']
),
(
  'eje-cafetero', 'Eje Cafetero', 'Colombia', 'Andes',
  'Cordilleras verdes, fincas cafeteras y palmas de cera.',
  'Entre montañas que respiran café, el Eje Cafetero te invita a recorrer fincas centenarias, despertar entre niebla y caminar bajo las palmas más altas del mundo en el Valle de Cocora.',
  'https://images.unsplash.com/photo-1626197031507-c17099753b86?w=1200&q=80',
  ARRAY['https://images.unsplash.com/photo-1626197031507-c17099753b86?w=1200&q=80','https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&q=80','https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=1200&q=80'],
  900000, 4, 'naturaleza', 4.8, true,
  ARRAY['Valle de Cocora','Tour del café','Salento','Termales de Santa Rosa']
),
(
  'medellin', 'Medellín', 'Colombia', 'Andes',
  'La ciudad de la eterna primavera reinventada.',
  'Entre cerros y metrocables, Medellín ofrece arte urbano en la Comuna 13, jardines botánicos, gastronomía paisa y una vida nocturna vibrante en El Poblado.',
  'https://images.unsplash.com/photo-1697745575737-a32c0c8e4707?w=1200&q=80',
  ARRAY['https://images.unsplash.com/photo-1697745575737-a32c0c8e4707?w=1200&q=80','https://images.unsplash.com/photo-1599309329365-50e58c9cf64b?w=1200&q=80','https://images.unsplash.com/photo-1568632234157-ce7aecd03d0d?w=1200&q=80'],
  750000, 3, 'urbano', 4.5, true,
  ARRAY['Comuna 13','Guatapé','Plaza Botero','Metrocable']
),
(
  'san-andres', 'San Andrés', 'Colombia', 'Caribe',
  'El mar de los siete colores.',
  'Una isla diminuta con un océano que cambia de azul a turquesa según la luz. Buceo en arrecifes, ciclismo costero y reggae en West View.',
  'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=1200&q=80',
  ARRAY['https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=1200&q=80','https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80','https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&q=80'],
  1500000, 5, 'playa', 4.4, true,
  ARRAY['Johnny Cay','Hoyo Soplador','Buceo en La Piscinita','Vuelta a la isla']
),
(
  'cusco', 'Cusco & Machu Picchu', 'Perú', 'Andes',
  'Capital del imperio Inca, puerta de Machu Picchu.',
  'A 3.400 metros de altura, Cusco fusiona piedra inca con barroco español. Desde aquí parte el camino a Machu Picchu, una de las siete maravillas del mundo.',
  'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1200&q=80',
  ARRAY['https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1200&q=80','https://images.unsplash.com/photo-1580619305218-8423a7ef79b4?w=1200&q=80','https://images.unsplash.com/photo-1531968455001-5c5272a41129?w=1200&q=80'],
  2400000, 7, 'cultural', 4.9, true,
  ARRAY['Machu Picchu','Valle Sagrado','Sacsayhuamán','Mercado de San Pedro']
),
(
  'buenos-aires', 'Buenos Aires', 'Argentina', 'Cono Sur',
  'Tango, parrillas y librerías centenarias.',
  'La París del Sur seduce con sus barrios diversos: el aire bohemio de San Telmo, el color de La Boca, la elegancia de Recoleta. Carne, vino y noches que se estiran.',
  'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=1200&q=80',
  ARRAY['https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=1200&q=80','https://images.unsplash.com/photo-1612294037637-ec931d278a8d?w=1200&q=80','https://images.unsplash.com/photo-1573053884310-d057f6c5fac6?w=1200&q=80'],
  1800000, 5, 'urbano', 4.6, true,
  ARRAY['Caminito','Teatro Colón','Cementerio de Recoleta','Milonga en San Telmo']
),
(
  'tulum', 'Tulum', 'México', 'Caribe',
  'Ruinas mayas frente al mar Caribe.',
  'Playas blancas, cenotes selváticos y un castillo maya colgando sobre acantilados. Tulum es ritual lento, yoga al amanecer y mezcal al ocaso.',
  'https://images.unsplash.com/photo-1518638150340-f706e86654de?w=1200&q=80',
  ARRAY['https://images.unsplash.com/photo-1518638150340-f706e86654de?w=1200&q=80','https://images.unsplash.com/photo-1552074284-5e88ef1aef18?w=1200&q=80','https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&q=80'],
  2100000, 6, 'playa', 4.5, false,
  ARRAY['Ruinas de Tulum','Cenote Dos Ojos','Sian Ka''an','Yoga al amanecer']
),
(
  'cdmx', 'Ciudad de México', 'México', 'Norteamérica',
  'Megaciudad que fusiona azteca, colonial y moderno.',
  'Murales de Diego Rivera, tacos al pastor, Frida en Coyoacán y pirámides en Teotihuacán. Una ciudad inagotable donde cada barrio es un mundo.',
  'https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=1200&q=80',
  ARRAY['https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=1200&q=80','https://images.unsplash.com/photo-1585464231875-d9ef1f5ad396?w=1200&q=80','https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200&q=80'],
  1600000, 5, 'cultural', 4.7, true,
  ARRAY['Teotihuacán','Casa Azul de Frida','Xochimilco','Bellas Artes']
),
(
  'patagonia', 'Patagonia', 'Chile', 'Cono Sur',
  'Torres graníticas, glaciares azules, vientos infinitos.',
  'El sur del mundo. Trekking entre montañas que parecen pintadas, glaciares que crujen y guanacos que cruzan el horizonte. Aventura pura.',
  'https://images.unsplash.com/photo-1531176175280-33e81d8e6c41?w=1200&q=80',
  ARRAY['https://images.unsplash.com/photo-1531176175280-33e81d8e6c41?w=1200&q=80','https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=1200&q=80','https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=1200&q=80'],
  3200000, 8, 'aventura', 4.9, true,
  ARRAY['Torres del Paine','Glaciar Grey','Trekking W','Puerto Natales']
),
(
  'lisboa', 'Lisboa', 'Portugal', 'Europa',
  'Azulejos, tranvías amarillos y fado al anochecer.',
  'La capital portuguesa baila entre colinas y el río Tajo. Pasteles de Belém, miradores con vistas infinitas y el fado que cuenta historias de mar.',
  'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=1200&q=80',
  ARRAY['https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=1200&q=80','https://images.unsplash.com/photo-1588535537514-19255e7a4ca8?w=1200&q=80','https://images.unsplash.com/photo-1513735718075-2e6c39cd62ee?w=1200&q=80'],
  3800000, 6, 'cultural', 4.6, true,
  ARRAY['Belém','Alfama','Tranvía 28','Sintra']
),
(
  'kyoto', 'Kioto', 'Japón', 'Asia',
  'Templos en pétalos de cerezo, geishas y jardines zen.',
  'Antigua capital imperial donde el tiempo conserva su forma. Mil torii rojos en Fushimi Inari, jardines de musgo y la elegancia silenciosa de Gion.',
  'https://images.unsplash.com/photo-1492571350019-22de08371fd3?w=1200&q=80',
  ARRAY['https://images.unsplash.com/photo-1492571350019-22de08371fd3?w=1200&q=80','https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=1200&q=80','https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1200&q=80'],
  5400000, 7, 'cultural', 4.9, true,
  ARRAY['Fushimi Inari','Bambú de Arashiyama','Gion','Kinkaku-ji']
),
(
  'amazonas', 'Amazonas', 'Colombia', 'Amazonía',
  'Selva infinita, ríos color té, comunidades ancestrales.',
  'Leticia es la puerta al pulmón del planeta. Caminatas nocturnas en la selva, delfines rosados y comunidades indígenas que protegen este ecosistema único.',
  'https://images.unsplash.com/photo-1592276713921-c4d75c8f8b1b?w=1200&q=80',
  ARRAY['https://images.unsplash.com/photo-1592276713921-c4d75c8f8b1b?w=1200&q=80','https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=1200&q=80','https://images.unsplash.com/photo-1559825481-12a05750d6fe?w=1200&q=80'],
  1900000, 5, 'naturaleza', 4.7, true,
  ARRAY['Isla de los Micos','Puerto Nariño','Delfines rosados','Comunidad Tikuna']
)
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------
-- 5.2 Reseñas editoriales seed (user_id = NULL, insertadas con service_role)
-- ----------------------------------------------------------------
INSERT INTO public.reviews (dest_id, author_name, rating, comment, created_at)
VALUES
  ('cartagena',    'Mariana Vélez',   5, 'El atardecer desde el Café del Mar es uno de esos momentos que te recuerdan por qué viajas. La ciudad amurallada al atardecer es magia pura.',                      now() - interval '12 days'),
  ('cartagena',    'Andrés Restrepo', 4, 'Hermosa pero atestada en temporada alta. Recomiendo ir entre semana y madrugar para recorrer las calles vacías.',                                                    now() - interval '45 days'),
  ('eje-cafetero', 'Laura Mejía',     5, 'El Valle de Cocora superó todas mis expectativas. Caminar entre palmas de 60 metros es algo que recordaré toda la vida.',                                            now() - interval '7 days'),
  ('cusco',        'Diego Quintero',  5, 'Machu Picchu al amanecer, con la niebla disipándose lentamente, te deja sin palabras. Llevar tiempo para aclimatarse a la altura.',                                 now() - interval '22 days'),
  ('kyoto',        'Sofía Ramírez',   5, 'Cada templo es una experiencia distinta. Fushimi Inari de madrugada es casi espiritual.',                                                                           now() - interval '30 days'),
  ('medellin',     'Camilo Ospina',   4, 'La energía de la ciudad es contagiosa. La Comuna 13 con un guía local te abre los ojos a otra historia.',                                                           now() - interval '60 days'),
  ('patagonia',    'Valentina Soto',  5, 'Los vientos son brutales pero el paisaje compensa. Trekking W cambia la perspectiva sobre lo que significa "naturaleza".',                                           now() - interval '90 days');
