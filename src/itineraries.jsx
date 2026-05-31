/* ================================================================
   HORIZEO · Itinerarios
   - HU07: crear con nombre, fecha inicio y fin (validación)
   - HU08: agregar actividad / alojamiento / transporte
   - HU09: timeline cronológica por días + iconos diferenciadores + costo total
   - HU11/HU12 indirecto: gestionar múltiples + editar/eliminar items
   ================================================================ */

const ITEM_TYPES = [
  { value: 'activity', label: 'Actividad', icon: 'compass', color: '#B5573E' },
  { value: 'lodging', label: 'Alojamiento', icon: 'bed', color: '#3D5A47' },
  { value: 'transport', label: 'Transporte', icon: 'airplane', color: '#5C544A' },
];

function ItineraryListScreen({ onOpenItinerary, onCreate }) {
  const { state, actions } = useStore();
  const [showCreate, setShowCreate] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState(null);

  const list = state.itineraries;

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 80 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16, paddingTop: 40, paddingBottom: 32, borderBottom: '1px solid var(--border-soft)' }}>
        <div style={{ maxWidth: 720 }}>
          <p style={itStyles.eyebrow}>Mis itinerarios</p>
          <h1 style={{ fontSize: 'clamp(2.4rem, 5vw, 3.6rem)', marginBottom: 12 }}>
            Cada viaje, <span className="serif-i">su propia línea de tiempo.</span>
          </h1>
          <p style={{ color: 'var(--ink-soft)', fontSize: 17, margin: 0 }}>
            Estructura tu próximo viaje día a día: actividades, alojamientos y transportes en un único hilo cronológico.
          </p>
        </div>
        <button className="btn btn-primary btn-lg" onClick={() => setShowCreate(true)}>
          <Icon name="plus" size={16} />
          Nuevo itinerario
        </button>
      </header>

      {list.length === 0 ? (
        <EmptyState
          icon="calendar"
          title="Aún no tienes itinerarios"
          description="Crea tu primer itinerario y comienza a construir tu próximo viaje."
          action={<button className="btn btn-primary" onClick={() => setShowCreate(true)}>
            <Icon name="plus" size={15} />
            Crear el primero
          </button>}
        />
      ) : (
        <div style={itStyles.listGrid}>
          {list.map((it) => (
            <ItineraryCard
              key={it.id}
              itinerary={it}
              onOpen={() => onOpenItinerary(it.id)}
              onDelete={() => setDeletingId(it.id)}
            />
          ))}
        </div>
      )}

      <Modal open={showCreate} onClose={() => setShowCreate(false)}>
        <CreateItineraryForm
          onClose={() => setShowCreate(false)}
          onCreated={(it) => {
            setShowCreate(false);
            onOpenItinerary(it.id);
          }}
        />
      </Modal>

      <ConfirmDialog
        open={!!deletingId}
        title="¿Eliminar este itinerario?"
        description="Esta acción no se puede deshacer. Se perderán todos los ítems del itinerario."
        confirmLabel="Eliminar"
        destructive
        onCancel={() => setDeletingId(null)}
        onConfirm={async () => {
          const res = await actions.deleteItinerary(deletingId);
          if (!res.ok) toast(res.error || 'Error al eliminar el itinerario', { type: 'error' });
          setDeletingId(null);
        }}
      />
    </div>
  );
}

function ItineraryCard({ itinerary, onOpen, onDelete }) {
  const days = daysBetween(itinerary.start, itinerary.end);
  const totalCost = itinerary.items.reduce((s, x) => s + (Number(x.cost) || 0), 0);
  const destItem = itinerary.items.find((i) => i.type === 'destination');
  const heroDest = destItem ? getDestinationById(destItem.destId) : null;

  return (
    <div style={itStyles.card} className="it-card">
      <div style={itStyles.cardThumb}>
        {heroDest ? (
          <FallbackImage src={heroDest.image} alt={heroDest.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, var(--bg-soft), #D4C7AC)', display: 'grid', placeItems: 'center', color: 'var(--ink-soft)' }}>
            <Icon name="map" size={32} stroke={1.4} />
          </div>
        )}
        <div style={itStyles.cardThumbOverlay} />
        <div style={itStyles.cardThumbContent}>
          <p style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(251,246,236,0.85)', margin: '0 0 6px' }}>
            {formatDateShort(itinerary.start)} – {formatDate(itinerary.end)} · {days} días
          </p>
          <h3 style={{ fontSize: '1.8rem', color: '#FBF6EC', lineHeight: 1.05 }}>{itinerary.name}</h3>
        </div>
      </div>
      <div style={itStyles.cardBody}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
          {ITEM_TYPES.map((t) => {
            const count = itinerary.items.filter((x) => x.type === t.value).length;
            if (!count) return null;
            return (
              <span key={t.value} className="pill pill-soft" style={{ background: 'transparent', border: '1px solid var(--border)' }}>
                <Icon name={t.icon} size={12} />
                {count} {t.label.toLowerCase()}{count > 1 ? 's' : ''}
              </span>
            );
          })}
          {itinerary.items.length === 0 && (
            <span style={{ fontSize: 13, color: 'var(--ink-mute)', fontStyle: 'italic' }}>Sin ítems aún</span>
          )}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 12 }}>
          <div>
            <div style={itStyles.metaLabel}>Costo estimado</div>
            <div className="serif" style={{ fontSize: 22 }}>{formatCOP(totalCost)}</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-icon btn-ghost" onClick={(e) => { e.stopPropagation(); onDelete(); }} aria-label="Eliminar">
              <Icon name="trash" size={15} />
            </button>
            <button className="btn btn-primary btn-sm" onClick={onOpen}>
              Ver itinerario
              <Icon name="arrowRight" size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------- Create itinerary form (HU07) ----------------------

function CreateItineraryForm({ onClose, onCreated }) {
  const { actions } = useStore();
  const toast = useToast();
  const today = new Date().toISOString().slice(0, 10);
  const inTwoWeeks = (() => { const d = new Date(); d.setDate(d.getDate() + 14); return d.toISOString().slice(0, 10); })();
  const inThreeWeeks = (() => { const d = new Date(); d.setDate(d.getDate() + 21); return d.toISOString().slice(0, 10); })();

  const [name, setName] = React.useState('');
  const [start, setStart] = React.useState(inTwoWeeks);
  const [end, setEnd] = React.useState(inThreeWeeks);
  const [errors, setErrors] = React.useState({});

  const submit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!name.trim()) errs.name = 'El nombre es obligatorio';
    if (!start) errs.start = 'Fecha de inicio requerida';
    if (!end) errs.end = 'Fecha de fin requerida';
    if (start && end && new Date(end) < new Date(start)) errs.end = 'La fecha de fin no puede ser anterior a la de inicio';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    const res = await actions.createItinerary({ name, start, end });
    if (!res.ok) { toast(res.error || 'Error al crear el itinerario', { type: 'error' }); return; }
    toast(`Itinerario "${res.data.name}" creado`, { type: 'success' });
    onCreated(res.data);
  };

  return (
    <form onSubmit={submit}>
      <ModalHeader title="Nuevo itinerario" subtitle="Define las bases del viaje. Podrás agregar actividades, alojamientos y transportes después." onClose={onClose} />
      <ModalBody>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="field">
            <label className="field-label">Nombre del itinerario *</label>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Por ej. Caribe en Octubre" autoFocus />
            {errors.name && <div className="field-error">{errors.name}</div>}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="field">
              <label className="field-label">Fecha de inicio *</label>
              <input className="input" type="date" value={start} min={today} onChange={(e) => setStart(e.target.value)} />
              {errors.start && <div className="field-error">{errors.start}</div>}
            </div>
            <div className="field">
              <label className="field-label">Fecha de fin *</label>
              <input className="input" type="date" value={end} min={start || today} onChange={(e) => setEnd(e.target.value)} />
              {errors.end && <div className="field-error">{errors.end}</div>}
            </div>
          </div>
          {start && end && new Date(end) >= new Date(start) && (
            <p style={{ fontSize: 13, color: 'var(--ink-soft)', margin: 0 }}>
              Duración: <strong>{daysBetween(start, end)} días</strong>
            </p>
          )}
        </div>
      </ModalBody>
      <ModalFooter>
        <button type="button" className="btn btn-ghost" onClick={onClose}>Cancelar</button>
        <button type="submit" className="btn btn-primary">Crear itinerario</button>
      </ModalFooter>
    </form>
  );
}

// ---------------------- Itinerary detail / editor (HU08, HU09) ----------------------

function ItineraryDetailScreen({ itineraryId, onBack, onReserve }) {
  const { state, actions } = useStore();
  const toast = useToast();
  const itinerary = state.itineraries.find((x) => x.id === itineraryId);
  const [addModal, setAddModal] = React.useState(null); // { day, type? } or null
  const [editingItem, setEditingItem] = React.useState(null);
  const [editingName, setEditingName] = React.useState(false);
  const [nameDraft, setNameDraft] = React.useState('');

  if (!itinerary) {
    return (
      <div className="container" style={{ paddingTop: 80 }}>
        <EmptyState title="Itinerario no encontrado" action={<button className="btn btn-primary" onClick={onBack}>Volver</button>} />
      </div>
    );
  }

  // Agrupar ítems por día
  const days = React.useMemo(() => {
    const totalDays = daysBetween(itinerary.start, itinerary.end);
    const startD = new Date(itinerary.start);
    return Array.from({ length: totalDays }).map((_, i) => {
      const d = new Date(startD); d.setDate(startD.getDate() + i);
      const iso = d.toISOString().slice(0, 10);
      const items = itinerary.items
        .filter((x) => x.date === iso || (i === 0 && !x.date))
        .sort((a, b) => (a.time || '').localeCompare(b.time || ''));
      return { date: d, iso, items };
    });
  }, [itinerary]);

  // HU09 criterio 3: costo total estimado
  const totalCost = itinerary.items.reduce((s, x) => s + (Number(x.cost) || 0), 0);

  const startName = () => { setNameDraft(itinerary.name); setEditingName(true); };

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 80 }}>
      <button className="btn btn-ghost btn-sm" onClick={onBack} style={{ marginBottom: 24 }}>
        <Icon name="arrowLeft" size={14} />
        Mis itinerarios
      </button>

      {/* Header */}
      <div style={{ marginBottom: 40, borderBottom: '1px solid var(--border-soft)', paddingBottom: 28 }}>
        <p style={itStyles.eyebrow}>
          {formatDate(itinerary.start)} – {formatDate(itinerary.end)} · {days.length} día{days.length > 1 ? 's' : ''}
        </p>
        {editingName ? (
          <form onSubmit={async (e) => { e.preventDefault(); const res = await actions.renameItinerary(itinerary.id, { name: nameDraft.trim() || itinerary.name }); if (!res.ok) toast(res.error || 'Error al renombrar', { type: 'error' }); setEditingName(false); }}>
            <input
              className="input"
              value={nameDraft}
              autoFocus
              onChange={(e) => setNameDraft(e.target.value)}
              onBlur={async () => { const res = await actions.renameItinerary(itinerary.id, { name: nameDraft.trim() || itinerary.name }); if (!res.ok) toast(res.error || 'Error al renombrar', { type: 'error' }); setEditingName(false); }}
              style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(2.4rem, 5vw, 3.6rem)', padding: 0, background: 'transparent', border: 'none', borderBottom: '2px solid var(--ink)', borderRadius: 0, marginBottom: 12 }}
            />
          </form>
        ) : (
          <h1 onDoubleClick={startName} style={{ fontSize: 'clamp(2.4rem, 5vw, 3.6rem)', marginBottom: 12, cursor: 'text' }}>
            {itinerary.name}
            <button onClick={startName} className="btn btn-icon btn-ghost" style={{ marginLeft: 12, verticalAlign: 'middle' }} aria-label="Renombrar">
              <Icon name="edit" size={14} />
            </button>
          </h1>
        )}

        <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap', marginTop: 20, alignItems: 'baseline' }}>
          <div>
            <div style={itStyles.metaLabel}>Costo total estimado</div>
            <div className="serif" style={{ fontSize: 28 }}>{formatCOP(totalCost)}</div>
          </div>
          <div>
            <div style={itStyles.metaLabel}>Ítems en el plan</div>
            <div className="serif" style={{ fontSize: 28 }}>{itinerary.items.length}</div>
          </div>
          {ITEM_TYPES.map((t) => {
            const c = itinerary.items.filter((x) => x.type === t.value).length;
            if (!c) return null;
            return (
              <div key={t.value}>
                <div style={itStyles.metaLabel}>{t.label}s</div>
                <div className="serif" style={{ fontSize: 28 }}>{c}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Timeline */}
      <div style={itStyles.timeline}>
        {days.map((day, di) => (
          <DayBlock
            key={di}
            day={day}
            dayIndex={di}
            itineraryId={itinerary.id}
            onAdd={(type) => setAddModal({ day: day.iso, type })}
            onEdit={(item) => setEditingItem({ ...item, _day: day.iso })}
            onDelete={(item) => {
              if (confirm('¿Eliminar este ítem del itinerario?')) {
                actions.removeItineraryItem(itinerary.id, item.id);
                toast('Ítem eliminado', { type: 'default' });
              }
            }}
          />
        ))}
      </div>

      <Modal open={!!addModal} onClose={() => setAddModal(null)} size="lg">
        {addModal && (
          <ItemForm
            day={addModal.day}
            defaultType={addModal.type}
            onClose={() => setAddModal(null)}
            onSubmit={async (data) => {
              await actions.addItineraryItem(itinerary.id, data);
              setAddModal(null);
              toast('Ítem agregado al itinerario', { type: 'success' });
            }}
          />
        )}
      </Modal>

      <Modal open={!!editingItem} onClose={() => setEditingItem(null)} size="lg">
        {editingItem && (
          <ItemForm
            existing={editingItem}
            day={editingItem._day}
            onClose={() => setEditingItem(null)}
            onSubmit={async (data) => {
              await actions.updateItineraryItem(itinerary.id, editingItem.id, data);
              setEditingItem(null);
              toast('Cambios guardados', { type: 'success' });
            }}
          />
        )}
      </Modal>
    </div>
  );
}

// ---------------------- DayBlock ----------------------

function DayBlock({ day, dayIndex, onAdd, onEdit, onDelete }) {
  return (
    <section style={itStyles.dayBlock}>
      <div style={itStyles.dayHeader}>
        <div style={itStyles.dayNumber}>
          <span className="serif" style={{ fontSize: 32 }}>{String(dayIndex + 1).padStart(2, '0')}</span>
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: 16 }}>{formatDay(day.date)}</div>
          <div style={{ fontSize: 14, color: 'var(--ink-soft)' }}>{formatDate(day.date)}</div>
        </div>
      </div>

      <div style={itStyles.dayContent}>
        {day.items.length === 0 ? (
          <div style={itStyles.emptyDay}>
            <p style={{ color: 'var(--ink-mute)', fontSize: 14, margin: '0 0 12px', fontStyle: 'italic' }}>
              Día libre. Agrega actividades, transporte o alojamiento.
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {ITEM_TYPES.map((t) => (
                <button key={t.value} className="btn btn-soft btn-sm" onClick={() => onAdd(t.value)}>
                  <Icon name={t.icon} size={13} />
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {day.items.map((item) => (
                <ItineraryItem key={item.id} item={item} onEdit={onEdit} onDelete={onDelete} />
              ))}
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => onAdd()} style={{ marginTop: 12 }}>
              <Icon name="plus" size={13} />
              Agregar ítem a este día
            </button>
          </>
        )}
      </div>
    </section>
  );
}

// ---------------------- ItineraryItem ----------------------

function ItineraryItem({ item, onEdit, onDelete }) {
  const typeMeta = item.type === 'destination'
    ? { label: 'Destino', icon: 'map', color: '#7A3622' }
    : ITEM_TYPES.find((t) => t.value === item.type) || ITEM_TYPES[0];

  return (
    <div style={itStyles.item} className="it-item">
      <div style={{ ...itStyles.itemIcon, background: typeMeta.color }}>
        <Icon name={typeMeta.icon} size={16} stroke={2} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={itStyles.itemTime}>{item.time || '—'}</span>
              <span style={{ fontSize: 11, color: 'var(--ink-mute)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{typeMeta.label}</span>
            </div>
            <h4 style={{ fontFamily: 'var(--sans)', fontWeight: 600, fontSize: 15, margin: '0 0 4px' }}>{item.name}</h4>
            {item.notes && (
              <p style={{ margin: 0, color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.45, textWrap: 'pretty' }}>{item.notes}</p>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
            <span className="serif" style={{ fontSize: 18 }}>{formatCOP(item.cost || 0)}</span>
            <div className="it-item-actions" style={itStyles.itemActions}>
              <button className="btn btn-icon btn-ghost" onClick={() => onEdit(item)} aria-label="Editar">
                <Icon name="edit" size={13} />
              </button>
              <button className="btn btn-icon btn-ghost" onClick={() => onDelete(item)} aria-label="Eliminar">
                <Icon name="trash" size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------- ItemForm (HU08) ----------------------

function ItemForm({ existing, day, defaultType, onClose, onSubmit }) {
  const [type, setType] = React.useState(existing ? existing.type : (defaultType || 'activity'));
  const [name, setName] = React.useState(existing ? existing.name : '');
  const [date, setDate] = React.useState(existing ? existing.date : day);
  const [time, setTime] = React.useState(existing ? existing.time : '10:00');
  const [cost, setCost] = React.useState(existing ? (existing.cost || 0) : 0);
  const [notes, setNotes] = React.useState(existing ? (existing.notes || '') : '');
  const [errors, setErrors] = React.useState({});

  const isDestination = type === 'destination';

  const submit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!name.trim()) errs.name = 'Requerido';
    if (!date) errs.date = 'Requerido';
    if (!time) errs.time = 'Requerido';
    if (cost < 0) errs.cost = 'Inválido';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSubmit({ type, name: name.trim(), date, time, cost: +cost, notes: notes.trim() });
  };

  return (
    <form onSubmit={submit}>
      <ModalHeader
        title={existing ? 'Editar ítem' : 'Agregar al itinerario'}
        subtitle={existing ? null : 'Define el tipo, fecha, hora y costo del ítem.'}
        onClose={onClose}
      />
      <ModalBody>
        {!isDestination && (
          <div style={{ marginBottom: 18 }}>
            <label className="field-label" style={{ marginBottom: 10, display: 'block' }}>Tipo</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {ITEM_TYPES.map((t) => {
                const active = t.value === type;
                return (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setType(t.value)}
                    style={{
                      padding: '14px 12px', border: '1px solid ' + (active ? 'var(--ink)' : 'var(--border)'),
                      background: active ? 'var(--ink)' : 'var(--card-elev)',
                      color: active ? 'var(--card)' : 'var(--ink)',
                      borderRadius: 'var(--r-md)', display: 'flex', flexDirection: 'column',
                      alignItems: 'center', gap: 8, transition: 'all 0.15s',
                    }}
                  >
                    <Icon name={t.icon} size={20} stroke={1.6} />
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="field">
            <label className="field-label">Nombre *</label>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder={type === 'activity' ? 'Tour por la ciudad amurallada' : type === 'lodging' ? 'Hotel Casa San Agustín' : 'Vuelo Bogotá → Cartagena'} />
            {errors.name && <div className="field-error">{errors.name}</div>}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <div className="field">
              <label className="field-label">Fecha *</label>
              <input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              {errors.date && <div className="field-error">{errors.date}</div>}
            </div>
            <div className="field">
              <label className="field-label">Hora *</label>
              <input className="input" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
              {errors.time && <div className="field-error">{errors.time}</div>}
            </div>
            <div className="field">
              <label className="field-label">Costo (COP)</label>
              <input className="input" type="number" min="0" step="10000" value={cost} onChange={(e) => setCost(e.target.value)} />
            </div>
          </div>
          <div className="field">
            <label className="field-label">Notas (opcional)</label>
            <textarea className="textarea" value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder="Detalles, dirección, código de reserva…" />
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <button type="button" className="btn btn-ghost" onClick={onClose}>Cancelar</button>
        <button type="submit" className="btn btn-primary">{existing ? 'Guardar cambios' : 'Agregar al día'}</button>
      </ModalFooter>
    </form>
  );
}

// ---------------------- Styles ----------------------

const itStyles = {
  eyebrow: {
    fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase',
    color: 'var(--ink-soft)', margin: '0 0 14px',
  },
  metaLabel: {
    fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase',
    color: 'var(--ink-mute)', marginBottom: 4,
  },
  listGrid: {
    display: 'grid', gap: 24, marginTop: 32,
    gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
  },
  card: {
    background: 'var(--card)', borderRadius: 'var(--r-lg)',
    border: '1px solid var(--border-soft)',
    overflow: 'hidden',
    display: 'flex', flexDirection: 'column',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  cardThumb: {
    position: 'relative', height: 180, overflow: 'hidden',
  },
  cardThumbOverlay: {
    position: 'absolute', inset: 0,
    background: 'linear-gradient(180deg, transparent 30%, rgba(26,24,22,0.85) 100%)',
  },
  cardThumbContent: {
    position: 'absolute', bottom: 16, left: 18, right: 18,
  },
  cardBody: {
    padding: 22,
  },
  timeline: {
    display: 'flex', flexDirection: 'column', gap: 8, position: 'relative',
  },
  dayBlock: {
    display: 'grid', gridTemplateColumns: '120px 1fr', gap: 24,
    padding: '20px 0',
    borderBottom: '1px dashed var(--border)',
  },
  dayHeader: {
    display: 'flex', flexDirection: 'column', gap: 4,
    position: 'sticky', top: 24, alignSelf: 'flex-start',
  },
  dayNumber: {
    color: 'var(--accent)',
  },
  dayContent: {
    minWidth: 0,
  },
  emptyDay: {
    padding: '20px 24px', background: 'var(--card)', borderRadius: 'var(--r-md)',
    border: '1px dashed var(--border)',
  },
  item: {
    display: 'flex', gap: 14, alignItems: 'flex-start',
    padding: '16px 18px', background: 'var(--card)',
    border: '1px solid var(--border-soft)', borderRadius: 'var(--r-md)',
    transition: 'border-color 0.15s, box-shadow 0.15s',
  },
  itemIcon: {
    width: 36, height: 36, borderRadius: 'var(--r-sm)',
    display: 'grid', placeItems: 'center', color: '#FBF6EC',
    flexShrink: 0,
  },
  itemTime: {
    fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--ink-soft)',
    background: 'var(--bg-soft)', padding: '2px 7px', borderRadius: 4,
  },
  itemActions: {
    display: 'flex', gap: 2, opacity: 0, transition: 'opacity 0.15s',
    marginLeft: 8,
  },
};

// hover effects
{
  const id = 'horizeo-it-style';
  if (!document.getElementById(id)) {
    const s = document.createElement('style');
    s.id = id;
    s.textContent = `
      .it-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }
      .it-item:hover { border-color: var(--border); }
      .it-item:hover .it-item-actions { opacity: 1; }
      @media (max-width: 768px) {
        .it-day-block { grid-template-columns: 1fr !important; gap: 12px !important; }
      }
    `;
    document.head.appendChild(s);
  }
}

Object.assign(window, {
  ItineraryListScreen,
  ItineraryDetailScreen,
  ITEM_TYPES,
});
