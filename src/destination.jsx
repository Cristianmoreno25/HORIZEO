/* ================================================================
   HORIZEO · Destination detail
   - HU06: galería, descripción, precio, calificación, reseñas
   - HU13: calificar (solo si tiene reserva confirmada)
   - Botón "Agregar al itinerario"
   - Botón "Reservar"
   ================================================================ */

function DestinationScreen({ destId, onBack, onAddToItinerary, onReserve }) {
  const { state, actions } = useStore();
  const dest = getDestinationById(destId);
  const toast = useToast();
  const [galleryIdx, setGalleryIdx] = React.useState(0);
  const [showReviewModal, setShowReviewModal] = React.useState(false);
  const [showAddModal, setShowAddModal] = React.useState(false);

  if (!dest) {
    return (
      <div className="container" style={{ paddingTop: 80 }}>
        <EmptyState title="Destino no encontrado" description="El destino solicitado no existe." action={<button className="btn btn-primary" onClick={onBack}>Volver al catálogo</button>} />
      </div>
    );
  }

  const reviews = getReviewsForDest(destId, state.reviews);
  const rating = getRatingForDest(destId, state.reviews);

  // HU13 criterio 1: solo puede calificarse si el usuario tiene reserva confirmada
  const hasConfirmedReservation = state.reservations.some((r) => r.destId === destId && r.status === 'confirmed');
  const alreadyReviewed = state.reviews.some((r) => r.destId === destId && r.userId === state.user.id);

  return (
    <div style={{ paddingBottom: 80 }}>

      {/* Hero full-bleed */}
      <div style={destStyles.hero}>
        <FallbackImage src={dest.gallery[galleryIdx]} alt={dest.name} style={destStyles.heroImage} />
        <div style={destStyles.heroGradient} />

        <div className="container" style={destStyles.heroOverlay}>
          <button className="btn btn-soft btn-sm" onClick={onBack} style={{ alignSelf: 'flex-start', background: 'rgba(251,246,236,0.9)', backdropFilter: 'blur(8px)' }}>
            <Icon name="arrowLeft" size={14} />
            Volver al catálogo
          </button>

          <div style={destStyles.heroContent}>
            <p style={destStyles.heroEyebrow}>{dest.region} · {dest.country}</p>
            <h1 style={destStyles.heroTitle}>{dest.name}</h1>
            <p style={destStyles.heroTagline}>{dest.tagline}</p>

            <div style={destStyles.heroMeta}>
              <div style={destStyles.heroMetaItem}>
                <Stars value={rating} size={14} showNumber />
                <span style={{ color: 'rgba(251,246,236,0.7)', fontSize: 13 }}>· {reviews.length} reseña{reviews.length !== 1 ? 's' : ''}</span>
              </div>
              <span style={destStyles.heroMetaSep}>·</span>
              <div style={destStyles.heroMetaItem}>
                <Icon name="clock" size={14} />
                <span style={{ fontSize: 13 }}>{dest.avgDays} días sugeridos</span>
              </div>
              <span style={destStyles.heroMetaSep}>·</span>
              <div style={destStyles.heroMetaItem}>
                <span style={{ fontSize: 13 }}>Experiencia <strong>{EXPERIENCE_OPTIONS.find((o) => o.value === dest.experience).label.toLowerCase()}</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Gallery thumbnails */}
        <div style={destStyles.thumbStrip}>
          {dest.gallery.map((src, i) => (
            <button
              key={i}
              onClick={() => setGalleryIdx(i)}
              style={{
                ...destStyles.thumb,
                outline: i === galleryIdx ? '2px solid #FBF6EC' : 'none',
                outlineOffset: 2,
                opacity: i === galleryIdx ? 1 : 0.7,
              }}
            >
              <FallbackImage src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </button>
          ))}
        </div>
      </div>

      <div className="container" style={{ paddingTop: 56 }}>
        <div style={destStyles.gridLayout}>

          {/* Left: content */}
          <div>
            <section style={{ marginBottom: 48 }}>
              <h2 className="serif-i" style={{ fontSize: '2rem', marginBottom: 20 }}>Sobre este destino</h2>
              <p style={{ fontSize: 18, lineHeight: 1.65, color: 'var(--ink)', maxWidth: 640, textWrap: 'pretty' }}>
                {dest.description}
              </p>
            </section>

            <section style={{ marginBottom: 48 }}>
              <h3 style={{ fontSize: '1.4rem', marginBottom: 18 }}>Imperdibles</h3>
              <ul style={destStyles.highlightList}>
                {dest.highlights.map((h, i) => (
                  <li key={i} style={destStyles.highlightItem}>
                    <span className="serif-i" style={destStyles.highlightNum}>{String(i + 1).padStart(2, '0')}</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
                <h3 style={{ fontSize: '1.4rem' }}>Reseñas de viajeros</h3>
                {/* HU13 — calificar */}
                {hasConfirmedReservation && !alreadyReviewed && (
                  <button className="btn btn-accent btn-sm" onClick={() => setShowReviewModal(true)}>
                    <Icon name="star" size={14} />
                    Escribir reseña
                  </button>
                )}
                {alreadyReviewed && (
                  <span className="pill pill-confirmed">
                    <Icon name="check" size={12} />
                    Ya reseñaste este destino
                  </span>
                )}
                {!hasConfirmedReservation && (
                  <span style={{ fontSize: 12, color: 'var(--ink-mute)', fontStyle: 'italic' }}>
                    Calificable tras una reserva confirmada
                  </span>
                )}
              </div>

              {/* Rating summary */}
              <div style={destStyles.ratingSummary}>
                <div>
                  <div className="serif" style={{ fontSize: 56, lineHeight: 1, marginBottom: 4 }}>
                    {rating.toFixed(1)}
                  </div>
                  <Stars value={rating} size={16} />
                </div>
                <div style={{ flex: 1 }}>
                  <RatingBars reviews={reviews} />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 28 }}>
                {reviews.length === 0 ? (
                  <p style={{ color: 'var(--ink-mute)', fontSize: 14 }}>Aún no hay reseñas para este destino.</p>
                ) : (
                  reviews.slice(0, 6).map((r) => (
                    <ReviewCard key={r.id} review={r} />
                  ))
                )}
              </div>
            </section>
          </div>

          {/* Right: sticky booking panel */}
          <aside style={destStyles.bookingAside}>
            <div style={destStyles.bookingCard}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 4 }}>
                <span style={{ fontSize: 11, color: 'var(--ink-mute)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Desde</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6 }}>
                <span className="serif" style={{ fontSize: 38, lineHeight: 1 }}>{formatCOP(dest.priceFrom)}</span>
                <span style={{ fontSize: 13, color: 'var(--ink-mute)' }}>COP / persona</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--ink-soft)', margin: 0 }}>
                Estimado para {dest.avgDays} días — incluye alojamiento y experiencias base.
              </p>

              <div style={{ height: 1, background: 'var(--border-soft)', margin: '24px 0' }} />

              <button
                className="btn btn-primary btn-lg"
                style={{ width: '100%', justifyContent: 'center', marginBottom: 10 }}
                onClick={() => setShowAddModal(true)}
              >
                <Icon name="plus" size={16} />
                Agregar al itinerario
              </button>
              <button
                className="btn btn-accent btn-lg"
                style={{ width: '100%', justifyContent: 'center' }}
                disabled={!dest.available}
                onClick={() => onReserve(dest)}
              >
                {dest.available ? (
                  <>
                    Reservar ahora
                    <Icon name="arrowRight" size={15} />
                  </>
                ) : 'Sin disponibilidad'}
              </button>

              {!dest.available && (
                <p style={{ fontSize: 12, color: 'var(--crimson)', margin: '10px 0 0', textAlign: 'center' }}>
                  Este destino no tiene cupos disponibles en este momento.
                </p>
              )}

              <div style={{ height: 1, background: 'var(--border-soft)', margin: '20px 0' }} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13, color: 'var(--ink-soft)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Icon name="check" size={14} style={{ color: 'var(--forest)' }} />
                  Cancelación flexible hasta 7 días antes
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Icon name="check" size={14} style={{ color: 'var(--forest)' }} />
                  Confirmación inmediata
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Icon name="check" size={14} style={{ color: 'var(--forest)' }} />
                  Asesoría de viaje incluida
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Modal: agregar a itinerario */}
      <AddToItineraryModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        dest={dest}
        onCreated={(it) => {
          setShowAddModal(false);
          toast(`Agregado a "${it.name}"`, { type: 'success' });
        }}
        onAddToItinerary={onAddToItinerary}
      />

      {/* Modal: reseña */}
      <Modal open={showReviewModal} onClose={() => setShowReviewModal(false)}>
        <ReviewForm
          destName={dest.name}
          onClose={() => setShowReviewModal(false)}
          onSubmit={async ({ rating, comment }) => {
            const res = await actions.addReview({ destId, rating, comment });
            if (res && !res.ok) { toast(res.error || 'Error al publicar la reseña', { type: 'error' }); return; }
            setShowReviewModal(false);
            toast('Gracias por compartir tu experiencia', { type: 'success' });
          }}
        />
      </Modal>
    </div>
  );
}

// ---------------------- ReviewCard ----------------------

function ReviewCard({ review }) {
  return (
    <div style={destStyles.reviewCard}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Avatar name={review.author} size={36} />
          <div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{review.author}</div>
            <div style={{ fontSize: 12, color: 'var(--ink-mute)' }}>{relativeTime(review.createdAt)}</div>
          </div>
        </div>
        <Stars value={review.rating} size={13} />
      </div>
      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: 'var(--ink)', textWrap: 'pretty' }}>
        {review.comment}
      </p>
    </div>
  );
}

// ---------------------- RatingBars ----------------------

function RatingBars({ reviews }) {
  const counts = [5, 4, 3, 2, 1].map((n) => reviews.filter((r) => Math.round(r.rating) === n).length);
  const max = Math.max(...counts, 1);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {counts.map((c, i) => {
        const n = 5 - i;
        return (
          <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 12, color: 'var(--ink-soft)' }}>
            <span style={{ width: 12, textAlign: 'right' }}>{n}</span>
            <Icon name="star" size={11} style={{ color: 'var(--amber)', fill: 'var(--amber)' }} stroke={0} />
            <div style={{ flex: 1, height: 6, background: 'var(--bg-soft)', borderRadius: 999, overflow: 'hidden' }}>
              <div style={{ width: `${(c / max) * 100}%`, height: '100%', background: 'var(--ink)', borderRadius: 999 }} />
            </div>
            <span style={{ width: 24, textAlign: 'right', color: 'var(--ink-mute)' }}>{c}</span>
          </div>
        );
      })}
    </div>
  );
}

// ---------------------- ReviewForm (HU13) ----------------------

function ReviewForm({ destName, onClose, onSubmit }) {
  const [rating, setRating] = React.useState(0);
  const [comment, setComment] = React.useState('');
  const [error, setError] = React.useState('');
  const MAX = 500;

  const submit = (e) => {
    e.preventDefault();
    if (rating < 1) { setError('Selecciona una calificación de 1 a 5 estrellas.'); return; }
    onSubmit({ rating, comment });
  };

  return (
    <form onSubmit={submit}>
      <ModalHeader
        title="¿Cómo fue tu experiencia?"
        subtitle={`Tu reseña ayudará a otros viajeros que están considerando ${destName}.`}
        onClose={onClose}
      />
      <ModalBody>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div>
            <label className="field-label" style={{ marginBottom: 12, display: 'block' }}>Calificación</label>
            <StarRater value={rating} onChange={(n) => { setRating(n); setError(''); }} />
            {error && <div className="field-error" style={{ marginTop: 8 }}>{error}</div>}
          </div>
          <div className="field">
            <label className="field-label">Comentario (opcional)</label>
            <textarea
              className="textarea"
              value={comment}
              onChange={(e) => setComment(e.target.value.slice(0, MAX))}
              placeholder="Cuéntanos qué te marcó del lugar, qué recomendarías, qué evitarías…"
              rows={5}
            />
            <div className="field-help" style={{ textAlign: 'right' }}>{comment.length} / {MAX}</div>
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <button type="button" className="btn btn-ghost" onClick={onClose}>Cancelar</button>
        <button type="submit" className="btn btn-primary">Publicar reseña</button>
      </ModalFooter>
    </form>
  );
}

// ---------------------- AddToItineraryModal ----------------------

function AddToItineraryModal({ open, onClose, dest, onCreated, onAddToItinerary }) {
  const { state, actions } = useStore();
  const toast = useToast();
  const [mode, setMode] = React.useState('select');
  const [itId, setItId] = React.useState(state.itineraries[0] && state.itineraries[0].id);
  const [newName, setNewName] = React.useState('');
  const [start, setStart] = React.useState('');
  const [end, setEnd] = React.useState('');

  React.useEffect(() => {
    if (open) {
      setMode(state.itineraries.length > 0 ? 'select' : 'create');
      setItId(state.itineraries[0] && state.itineraries[0].id);
      setNewName(`Viaje a ${dest.name.split(' ')[0]}`);
      const today = new Date();
      const startD = new Date(today); startD.setDate(today.getDate() + 14);
      const endD = new Date(startD); endD.setDate(startD.getDate() + (dest.avgDays - 1));
      setStart(startD.toISOString().slice(0, 10));
      setEnd(endD.toISOString().slice(0, 10));
    }
  }, [open, state.itineraries.length, dest]);

  if (!dest) return null;

  const submit = async (e) => {
    e.preventDefault();
    let chosen;
    if (mode === 'create') {
      if (!newName.trim() || !start || !end) return;
      if (new Date(end) < new Date(start)) {
        toast('La fecha de fin no puede ser anterior a la de inicio', { type: 'error' });
        return;
      }
      const res = await actions.createItinerary({ name: newName, start, end });
      if (!res.ok) { toast(res.error || 'Error al crear el itinerario', { type: 'error' }); return; }
      chosen = res.data;
    } else {
      chosen = state.itineraries.find((x) => x.id === itId);
    }
    if (!chosen) return;
    const addRes = await actions.addItineraryItem(chosen.id, {
      type: 'destination',
      name: dest.name,
      destId: dest.id,
      date: chosen.start,
      time: '09:00',
      cost: dest.priceFrom,
      notes: dest.tagline,
    });
    if (addRes && !addRes.ok) {
      toast(addRes.error || 'Error al agregar al itinerario', { type: 'error' });
      return;
    }
    onCreated && onCreated(chosen);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <form onSubmit={submit}>
        <ModalHeader
          title="Agregar al itinerario"
          subtitle={`${dest.name} se agregará como destino base.`}
          onClose={onClose}
        />
        <ModalBody>
          {state.itineraries.length > 0 && (
            <div style={{ marginBottom: 18 }}>
              <Tabs
                tabs={[
                  { value: 'select', label: 'Existente' },
                  { value: 'create', label: 'Nuevo itinerario' },
                ]}
                value={mode}
                onChange={setMode}
              />
            </div>
          )}

          {mode === 'select' && state.itineraries.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {state.itineraries.map((it) => (
                <label key={it.id} style={{
                  padding: 14, border: '1px solid ' + (itId === it.id ? 'var(--ink)' : 'var(--border)'),
                  borderRadius: 'var(--r-md)', cursor: 'pointer', display: 'flex', gap: 12, alignItems: 'center',
                  background: itId === it.id ? 'var(--card-elev)' : 'transparent',
                  transition: 'all 0.15s',
                }}>
                  <input type="radio" checked={itId === it.id} onChange={() => setItId(it.id)} style={{ accentColor: 'var(--ink)' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 15 }}>{it.name}</div>
                    <div style={{ fontSize: 13, color: 'var(--ink-soft)' }}>
                      {formatDateShort(it.start)} – {formatDate(it.end)} · {it.items.length} ítem{it.items.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="field">
                <label className="field-label">Nombre del itinerario</label>
                <input className="input" value={newName} onChange={(e) => setNewName(e.target.value)} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="field">
                  <label className="field-label">Inicio</label>
                  <input className="input" type="date" value={start} onChange={(e) => setStart(e.target.value)} required />
                </div>
                <div className="field">
                  <label className="field-label">Fin</label>
                  <input className="input" type="date" value={end} onChange={(e) => setEnd(e.target.value)} required />
                </div>
              </div>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <button type="button" className="btn btn-ghost" onClick={onClose}>Cancelar</button>
          <button type="submit" className="btn btn-primary">
            {mode === 'create' ? 'Crear y agregar' : 'Agregar'}
          </button>
        </ModalFooter>
      </form>
    </Modal>
  );
}

// ---------------------- Styles ----------------------

const destStyles = {
  hero: {
    position: 'relative',
    height: 'clamp(440px, 60vh, 600px)',
    overflow: 'hidden',
    background: 'var(--ink)',
  },
  heroImage: {
    position: 'absolute', inset: 0, width: '100%', height: '100%',
    objectFit: 'cover',
  },
  heroGradient: {
    position: 'absolute', inset: 0,
    background: 'linear-gradient(180deg, rgba(26,24,22,0.35) 0%, rgba(26,24,22,0.05) 35%, rgba(26,24,22,0.85) 100%)',
  },
  heroOverlay: {
    position: 'relative', height: '100%',
    display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
    paddingTop: 32, paddingBottom: 56,
    color: '#FBF6EC',
  },
  heroContent: { maxWidth: 760 },
  heroEyebrow: {
    fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase',
    color: 'rgba(251,246,236,0.85)', margin: '0 0 14px',
  },
  heroTitle: {
    fontFamily: 'var(--serif)', fontSize: 'clamp(3rem, 8vw, 5.5rem)',
    fontWeight: 400, lineHeight: 0.95, margin: 0, color: '#FBF6EC',
    textWrap: 'balance',
  },
  heroTagline: {
    fontFamily: 'var(--serif)', fontStyle: 'italic',
    fontSize: 'clamp(1.1rem, 2.2vw, 1.4rem)',
    color: 'rgba(251,246,236,0.85)', marginTop: 16, marginBottom: 24,
    maxWidth: 560, textWrap: 'pretty',
  },
  heroMeta: {
    display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
    color: 'rgba(251,246,236,0.9)',
  },
  heroMetaItem: { display: 'flex', alignItems: 'center', gap: 6 },
  heroMetaSep: { color: 'rgba(251,246,236,0.4)' },

  thumbStrip: {
    position: 'absolute', bottom: 24, right: 24,
    display: 'flex', gap: 8,
  },
  thumb: {
    width: 64, height: 64, borderRadius: 'var(--r-sm)', overflow: 'hidden',
    cursor: 'pointer', border: 'none', padding: 0,
    transition: 'opacity 0.15s',
  },

  gridLayout: {
    display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 360px', gap: 60,
  },

  highlightList: { listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 14, gridTemplateColumns: '1fr 1fr' },
  highlightItem: {
    display: 'flex', alignItems: 'center', gap: 14,
    padding: '14px 18px', background: 'var(--card)', borderRadius: 'var(--r-md)',
    border: '1px solid var(--border-soft)',
    fontSize: 14,
  },
  highlightNum: {
    fontSize: 22, color: 'var(--accent)', minWidth: 28,
  },

  ratingSummary: {
    display: 'flex', gap: 32, alignItems: 'center',
    padding: 24, background: 'var(--card)', borderRadius: 'var(--r-lg)',
    border: '1px solid var(--border-soft)',
  },

  reviewCard: {
    padding: 20, background: 'var(--card)', borderRadius: 'var(--r-md)',
    border: '1px solid var(--border-soft)',
  },

  bookingAside: {
    position: 'sticky', top: 24, alignSelf: 'flex-start',
  },
  bookingCard: {
    padding: 28, background: 'var(--card-elev)', borderRadius: 'var(--r-lg)',
    border: '1px solid var(--border)',
    boxShadow: 'var(--shadow-sm)',
  },
};

// Responsive
{
  const id = 'horizeo-dest-style';
  if (!document.getElementById(id)) {
    const s = document.createElement('style');
    s.id = id;
    s.textContent = `
      @media (max-width: 880px) {
        .dest-grid-layout { grid-template-columns: 1fr !important; gap: 32px !important; }
        .dest-highlight-list { grid-template-columns: 1fr !important; }
        .dest-booking-aside { position: static !important; }
      }
    `;
    document.head.appendChild(s);
  }
}

// Patch component to use classes for responsive
function DestinationScreenResp(props) {
  const tree = DestinationScreen(props);
  return tree;
}

Object.assign(window, { DestinationScreen, ReviewCard, AddToItineraryModal });
