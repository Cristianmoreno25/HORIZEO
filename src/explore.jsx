/* ================================================================
   HORIZEO · Explorar destinos
   - HU04: búsqueda por nombre (case-insensitive)
   - HU05: filtros combinables (presupuesto, duración, experiencia)
   - HU06: tarjetas con nombre, imagen, precio
   ================================================================ */

function ExploreScreen({ onOpenDest }) {
  const { state } = useStore();
  const [query, setQuery] = React.useState('');
  const [budget, setBudget] = React.useState([500000, 6000000]);
  const [duration, setDuration] = React.useState([1, 14]);
  const [experiences, setExperiences] = React.useState([]);
  const [filtersOpen, setFiltersOpen] = React.useState(false);
  const [sort, setSort] = React.useState('curated');

  const userPrefs = state.user && state.user.prefs;

  // HU04: búsqueda — case-insensitive sobre name y country
  // HU05: filtros combinables
  const results = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    let r = DESTINATIONS.filter((d) => {
      if (q && !(d.name.toLowerCase().includes(q) || d.country.toLowerCase().includes(q) || d.region.toLowerCase().includes(q))) return false;
      if (d.priceFrom < budget[0] || d.priceFrom > budget[1]) return false;
      if (d.avgDays < duration[0] || d.avgDays > duration[1]) return false;
      if (experiences.length && !experiences.includes(d.experience)) return false;
      return true;
    });

    if (sort === 'price-low') r = [...r].sort((a, b) => a.priceFrom - b.priceFrom);
    else if (sort === 'price-high') r = [...r].sort((a, b) => b.priceFrom - a.priceFrom);
    else if (sort === 'rating') r = [...r].sort((a, b) => b.rating - a.rating);
    else if (sort === 'curated' && userPrefs && userPrefs.experiences && userPrefs.experiences.length) {
      // Boost destinos cuya experiencia esté en preferencias
      r = [...r].sort((a, b) => {
        const aMatch = userPrefs.experiences.includes(a.experience) ? 1 : 0;
        const bMatch = userPrefs.experiences.includes(b.experience) ? 1 : 0;
        return bMatch - aMatch;
      });
    }
    return r;
  }, [query, budget, duration, experiences, sort, userPrefs]);

  const resetFilters = () => {
    setBudget([500000, 6000000]);
    setDuration([1, 14]);
    setExperiences([]);
    setQuery('');
  };

  const activeFilterCount = (
    (experiences.length) +
    (budget[0] !== 500000 || budget[1] !== 6000000 ? 1 : 0) +
    (duration[0] !== 1 || duration[1] !== 14 ? 1 : 0)
  );

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 80 }}>

      {/* Header editorial */}
      <header style={exploreStyles.header}>
        <p style={exploreStyles.eyebrow}>Catálogo</p>
        <h1 style={{ fontSize: 'clamp(2.6rem, 6vw, 4.5rem)', marginBottom: 14, maxWidth: 900 }}>
          Destinos curados para
          <br />
          <span className="serif-i">viajeros con intención.</span>
        </h1>
        <p style={{ color: 'var(--ink-soft)', fontSize: 17, maxWidth: 580, margin: 0 }}>
          {state.user && state.user.prefs.experiences.length > 0
            ? `Hemos priorizado destinos alineados a tus preferencias: ${state.user.prefs.experiences.map((e) => EXPERIENCE_OPTIONS.find((o) => o.value === e).label.toLowerCase()).join(', ')}.`
            : 'Doce lugares cuidadosamente seleccionados. Filtra por presupuesto, duración o el tipo de experiencia que buscas.'}
        </p>
      </header>

      {/* Search bar */}
      <div style={exploreStyles.searchBar}>
        <div style={exploreStyles.searchInputWrap}>
          <Icon name="search" size={18} style={{ color: 'var(--ink-soft)' }} />
          <input
            className="explore-search"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por destino, país o región…"
            style={exploreStyles.searchInput}
          />
          {query && (
            <button onClick={() => setQuery('')} style={exploreStyles.searchClear}>
              <Icon name="close" size={14} />
            </button>
          )}
        </div>
        <button
          className={'btn ' + (filtersOpen ? 'btn-primary' : 'btn-ghost')}
          onClick={() => setFiltersOpen((s) => !s)}
        >
          <Icon name="sliders" size={15} />
          Filtros
          {activeFilterCount > 0 && (
            <span style={{
              background: filtersOpen ? 'var(--card)' : 'var(--ink)',
              color: filtersOpen ? 'var(--ink)' : 'var(--card)',
              borderRadius: 999, padding: '1px 7px', fontSize: 11, fontWeight: 600,
              marginLeft: 2,
            }}>
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Filters panel (HU05) */}
      {filtersOpen && (
        <div className="fade-in" style={exploreStyles.filtersPanel}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 32 }}>
            <div>
              <label className="field-label" style={{ marginBottom: 12, display: 'block' }}>Presupuesto (COP)</label>
              <PriceRange min={500000} max={6000000} value={budget} onChange={setBudget} />
            </div>
            <div>
              <label className="field-label" style={{ marginBottom: 12, display: 'block' }}>Duración (días)</label>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--ink-soft)', marginBottom: 8 }}>
                <span>{duration[0]} día{duration[0] > 1 ? 's' : ''}</span>
                <span>{duration[1]} días</span>
              </div>
              <PriceRange min={1} max={14} step={1} value={duration} onChange={setDuration} />
            </div>
            <div>
              <label className="field-label" style={{ marginBottom: 12, display: 'block' }}>Tipo de experiencia</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {EXPERIENCE_OPTIONS.map((opt) => {
                  const active = experiences.includes(opt.value);
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setExperiences((prev) => prev.includes(opt.value) ? prev.filter((x) => x !== opt.value) : [...prev, opt.value])}
                      style={{
                        padding: '6px 12px', borderRadius: 999, fontSize: 13,
                        border: '1px solid ' + (active ? 'var(--ink)' : 'var(--border)'),
                        background: active ? 'var(--ink)' : 'transparent',
                        color: active ? 'var(--card)' : 'var(--ink)',
                        transition: 'all 0.15s',
                      }}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          {/* HU05 criterio 4: restablecer con un clic */}
          {activeFilterCount > 0 && (
            <button onClick={resetFilters} className="btn btn-ghost btn-sm" style={{ marginTop: 20 }}>
              Restablecer filtros
            </button>
          )}
        </div>
      )}

      {/* Result count + sort */}
      <div style={exploreStyles.resultsBar}>
        <p style={{ margin: 0, color: 'var(--ink-soft)', fontSize: 14 }}>
          <span style={{ color: 'var(--ink)', fontWeight: 600 }}>{results.length}</span> {results.length === 1 ? 'destino encontrado' : 'destinos encontrados'}
          {query && <> para "<span className="serif-i" style={{ color: 'var(--ink)' }}>{query}</span>"</>}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 }}>
          <span style={{ color: 'var(--ink-soft)' }}>Ordenar:</span>
          <select className="select" value={sort} onChange={(e) => setSort(e.target.value)} style={{ padding: '6px 10px', fontSize: 13, width: 'auto' }}>
            <option value="curated">Curado para ti</option>
            <option value="price-low">Precio: menor a mayor</option>
            <option value="price-high">Precio: mayor a menor</option>
            <option value="rating">Mejor calificados</option>
          </select>
        </div>
      </div>

      {/* Results grid */}
      {results.length === 0 ? (
        // HU04 criterio 3: mensaje si no hay coincidencias
        <EmptyState
          icon="search"
          title="No se encontraron destinos"
          description="Intenta ajustar los filtros o buscar otro lugar. Quizá quieras ampliar el rango de presupuesto."
          action={<button className="btn btn-ghost" onClick={resetFilters}>Restablecer filtros</button>}
        />
      ) : (
        <div style={exploreStyles.grid}>
          {results.map((d, i) => (
            <DestCard key={d.id} dest={d} onClick={() => onOpenDest(d.id)} index={i} userReviews={state.reviews} />
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------- Destination Card (HU06) ----------------------

function DestCard({ dest, onClick, index = 0, userReviews }) {
  const rating = getRatingForDest(dest.id, userReviews);
  return (
    <article
      onClick={onClick}
      className="dest-card"
      style={{
        ...exploreStyles.card,
        animationDelay: `${Math.min(index * 40, 400)}ms`,
      }}
    >
      <div style={exploreStyles.cardImageWrap}>
        <FallbackImage src={dest.image} alt={dest.name} style={exploreStyles.cardImage} />
        {!dest.available && (
          <div style={exploreStyles.unavailableBadge}>Sin disponibilidad</div>
        )}
        <div style={exploreStyles.cardRegion}>{dest.region} · {dest.country}</div>
      </div>
      <div style={exploreStyles.cardBody}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <h3 style={{ fontSize: '1.5rem', lineHeight: 1.1 }}>{dest.name}</h3>
          <Stars value={rating} size={12} showNumber />
        </div>
        <p style={{ color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.5, margin: '8px 0 18px', textWrap: 'pretty' }}>
          {dest.tagline}
        </p>
        <div style={exploreStyles.cardMeta}>
          <div>
            <div style={exploreStyles.cardMetaLabel}>Desde</div>
            <div className="serif" style={{ fontSize: 22 }}>{formatCOP(dest.priceFrom)}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={exploreStyles.cardMetaLabel}>Duración típica</div>
            <div className="serif" style={{ fontSize: 22 }}>{dest.avgDays} días</div>
          </div>
        </div>
      </div>
    </article>
  );
}

// ---------------------- Styles ----------------------

const exploreStyles = {
  header: {
    paddingTop: 40,
    paddingBottom: 32,
    maxWidth: 980,
  },
  eyebrow: {
    fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase',
    color: 'var(--ink-soft)', margin: '0 0 14px',
  },
  searchBar: {
    display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16,
    flexWrap: 'wrap',
  },
  searchInputWrap: {
    flex: 1, minWidth: 240,
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '0 18px',
    background: 'var(--card-elev)',
    border: '1px solid var(--border)',
    borderRadius: 999,
    height: 52,
    transition: 'border-color 0.15s',
  },
  searchInput: {
    flex: 1, border: 'none', background: 'none', outline: 'none',
    fontSize: 16, color: 'var(--ink)',
    fontFamily: 'var(--sans)',
  },
  searchClear: {
    width: 24, height: 24, borderRadius: 999, background: 'var(--bg-soft)',
    display: 'grid', placeItems: 'center', color: 'var(--ink-soft)',
  },
  filtersPanel: {
    background: 'var(--card)',
    border: '1px solid var(--border-soft)',
    borderRadius: 'var(--r-lg)',
    padding: 28,
    marginBottom: 16,
  },
  resultsBar: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    margin: '24px 0 24px', flexWrap: 'wrap', gap: 12,
  },
  grid: {
    display: 'grid', gap: 24,
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
  },
  card: {
    background: 'var(--card)',
    border: '1px solid var(--border-soft)',
    borderRadius: 'var(--r-lg)',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'transform 0.25s cubic-bezier(0.2, 0, 0.1, 1), box-shadow 0.25s, border-color 0.15s',
    display: 'flex', flexDirection: 'column',
    animation: 'fade-in 0.5s both',
  },
  cardImageWrap: {
    position: 'relative', paddingBottom: '70%', overflow: 'hidden',
  },
  cardImage: {
    position: 'absolute', inset: 0, width: '100%', height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.6s cubic-bezier(0.2, 0, 0.1, 1)',
  },
  cardRegion: {
    position: 'absolute', bottom: 12, left: 12,
    background: 'rgba(26, 24, 22, 0.7)', color: 'var(--card)',
    padding: '4px 10px', borderRadius: 999, fontSize: 11,
    backdropFilter: 'blur(6px)',
    fontWeight: 500,
    letterSpacing: '0.04em',
  },
  unavailableBadge: {
    position: 'absolute', top: 12, right: 12,
    background: 'rgba(139, 42, 42, 0.92)', color: 'var(--card)',
    padding: '4px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600,
    letterSpacing: '0.04em', textTransform: 'uppercase',
  },
  cardBody: {
    padding: 22,
    display: 'flex', flexDirection: 'column', flex: 1,
  },
  cardMeta: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
    marginTop: 'auto', paddingTop: 16,
    borderTop: '1px solid var(--border-soft)',
  },
  cardMetaLabel: {
    fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase',
    color: 'var(--ink-mute)', marginBottom: 4,
  },
};

// Hover + a11y styles
{
  const id = 'horizeo-explore-style';
  if (!document.getElementById(id)) {
    const s = document.createElement('style');
    s.id = id;
    s.textContent = `
      .dest-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); border-color: var(--border); }
      .dest-card:hover img { transform: scale(1.04); }
    `;
    document.head.appendChild(s);
  }
}

Object.assign(window, { ExploreScreen, DestCard });
