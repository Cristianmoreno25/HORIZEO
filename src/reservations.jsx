/* ================================================================
   HORIZEO · Reservas
   - HU10: realizar reserva (modal con resumen + confirmación)
   - HU11: historial con filtro por estado
   - HU12: cancelar con confirmación previa
   ================================================================ */

const STATUS_META = {
  pending: { label: 'Pendiente', pillClass: 'pill-pending', color: 'var(--status-pending)' },
  confirmed: { label: 'Confirmada', pillClass: 'pill-confirmed', color: 'var(--status-confirmed)' },
  cancelled: { label: 'Cancelada', pillClass: 'pill-cancelled', color: 'var(--status-cancelled)' },
};

function ReservationsScreen({ onOpenDest }) {
  const { state, actions } = useStore();
  const toast = useToast();
  const [filter, setFilter] = React.useState('all');
  const [cancelTarget, setCancelTarget] = React.useState(null);

  const items = state.reservations;

  const filtered = filter === 'all' ? items : items.filter((r) => r.status === filter);

  const counts = {
    all: items.length,
    pending: items.filter((r) => r.status === 'pending').length,
    confirmed: items.filter((r) => r.status === 'confirmed').length,
    cancelled: items.filter((r) => r.status === 'cancelled').length,
  };

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 80 }}>
      <header style={{ paddingTop: 40, paddingBottom: 32 }}>
        <p style={resStyles.eyebrow}>Mis reservas</p>
        <h1 style={{ fontSize: 'clamp(2.4rem, 5vw, 3.6rem)', marginBottom: 12 }}>
          Tus compromisos <span className="serif-i">de viaje.</span>
        </h1>
        <p style={{ color: 'var(--ink-soft)', fontSize: 17, margin: 0, maxWidth: 580 }}>
          Sigue el estado de cada reserva, recibe confirmaciones y cancela cuando lo necesites.
        </p>
      </header>

      {items.length === 0 ? (
        <EmptyState
          icon="bookmark"
          title="Sin reservas aún"
          description="Cuando reserves un destino o actividad, aparecerá aquí con su estado."
        />
      ) : (
        <>
          <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <Tabs
              tabs={[
                { value: 'all', label: 'Todas', count: counts.all },
                { value: 'pending', label: 'Pendientes', count: counts.pending },
                { value: 'confirmed', label: 'Confirmadas', count: counts.confirmed },
                { value: 'cancelled', label: 'Canceladas', count: counts.cancelled },
              ]}
              value={filter}
              onChange={setFilter}
            />
          </div>

          {filtered.length === 0 ? (
            <EmptyState
              icon="bookmark"
              title={`Sin reservas ${STATUS_META[filter] ? STATUS_META[filter].label.toLowerCase() : ''}`}
              description="No hay reservas en este estado."
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {filtered.map((r) => (
                <ReservationRow
                  key={r.id}
                  reservation={r}
                  onOpen={() => onOpenDest && onOpenDest(r.destId)}
                  onCancel={() => setCancelTarget(r)}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* HU12 criterio 2: confirmación explícita */}
      <ConfirmDialog
        open={!!cancelTarget}
        title="¿Cancelar reserva?"
        description={cancelTarget ? `Estás a punto de cancelar la reserva de ${cancelTarget.destName}. Esta acción no se puede deshacer.` : ''}
        confirmLabel="Sí, cancelar"
        cancelLabel="Mantener reserva"
        destructive
        onCancel={() => setCancelTarget(null)}
        onConfirm={() => {
          actions.cancelReservation(cancelTarget.id);
          toast('Reserva cancelada · Notificación enviada', { type: 'default' });
          setCancelTarget(null);
        }}
      />
    </div>
  );
}

function ReservationRow({ reservation, onOpen, onCancel }) {
  const dest = getDestinationById(reservation.destId);
  const meta = STATUS_META[reservation.status];
  const canCancel = reservation.status === 'pending' || reservation.status === 'confirmed'; // HU12 criterio 1

  return (
    <article style={resStyles.row} className="reservation-row">
      <button onClick={onOpen} style={resStyles.thumb}>
        {dest ? <FallbackImage src={dest.image} alt={dest.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : null}
      </button>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 8 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <span className={'pill ' + meta.pillClass}>
                {reservation.status === 'confirmed' && <Icon name="check" size={11} />}
                {reservation.status === 'pending' && <Icon name="clock" size={11} />}
                {reservation.status === 'cancelled' && <Icon name="close" size={11} />}
                {meta.label}
              </span>
              {dest && <span style={{ fontSize: 12, color: 'var(--ink-mute)' }}>{dest.region} · {dest.country}</span>}
            </div>
            <h3 style={{ fontSize: '1.4rem', lineHeight: 1.15, margin: 0 }}>{reservation.destName}</h3>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-mute)' }}>Costo</div>
            <div className="serif" style={{ fontSize: 22 }}>{formatCOP(reservation.cost)}</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', fontSize: 13, color: 'var(--ink-soft)', marginBottom: 12 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Icon name="calendar" size={13} />
            Viaje: {formatDate(reservation.date)}
          </span>
          <span style={{ color: 'var(--border)' }}>·</span>
          <span>Reservada {relativeTime(reservation.createdAt)}</span>
          <span style={{ color: 'var(--border)' }}>·</span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-mute)' }}>#{reservation.id.slice(-8)}</span>
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="btn btn-soft btn-sm" onClick={onOpen}>
            <Icon name="eye" size={13} />
            Ver destino
          </button>
          {canCancel && (
            <button className="btn btn-danger btn-sm" onClick={onCancel}>
              <Icon name="close" size={13} />
              Cancelar reserva
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

// ---------------------- Reservation modal (HU10) ----------------------

function ReservationModal({ open, onClose, dest }) {
  const { state, actions } = useStore();
  const toast = useToast();
  const [step, setStep] = React.useState('form'); // form | review | done
  const today = new Date();
  const defaultDate = (() => { const d = new Date(today); d.setDate(today.getDate() + 21); return d.toISOString().slice(0, 10); })();
  const [date, setDate] = React.useState(defaultDate);
  const [guests, setGuests] = React.useState(2);
  const [confirmed, setConfirmed] = React.useState(null);
  const [accepted, setAccepted] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setStep('form');
      setDate(defaultDate);
      setGuests(2);
      setAccepted(false);
      setConfirmed(null);
    }
  }, [open, defaultDate]);

  if (!dest) return null;

  const totalCost = dest.priceFrom * guests;

  const doReserve = () => {
    // HU10 criterio 1: solo si dest tiene disponibilidad
    if (!dest.available) {
      toast('Este destino no tiene disponibilidad', { type: 'error' });
      return;
    }
    const r = actions.createReservation({ destId: dest.id, name: dest.name, cost: totalCost, date });
    setConfirmed(r);
    setStep('done');
  };

  return (
    <Modal open={open} onClose={onClose}>
      {step === 'form' && (
        <>
          <ModalHeader title={`Reservar ${dest.name}`} subtitle="Selecciona la fecha y el número de viajeros." onClose={onClose} />
          <ModalBody>
            <div style={{ display: 'flex', gap: 16, padding: 16, background: 'var(--card)', borderRadius: 'var(--r-md)', marginBottom: 18 }}>
              <FallbackImage src={dest.image} alt={dest.name} style={{ width: 88, height: 88, borderRadius: 'var(--r-sm)', objectFit: 'cover', flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-mute)' }}>{dest.region} · {dest.country}</div>
                <h4 style={{ fontFamily: 'var(--serif)', fontSize: 22, margin: '2px 0 4px', fontWeight: 400 }}>{dest.name}</h4>
                <div style={{ fontSize: 13, color: 'var(--ink-soft)' }}>{dest.avgDays} días sugeridos · desde {formatCOP(dest.priceFrom)} / persona</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 18 }}>
              <div className="field">
                <label className="field-label">Fecha de inicio</label>
                <input className="input" type="date" value={date} min={today.toISOString().slice(0, 10)} onChange={(e) => setDate(e.target.value)} />
              </div>
              <div className="field">
                <label className="field-label">Viajeros</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button className="btn btn-soft btn-icon" type="button" onClick={() => setGuests((g) => Math.max(1, g - 1))} aria-label="Menos">
                    <Icon name="minus" size={14} />
                  </button>
                  <input className="input" type="number" min="1" max="10" value={guests} onChange={(e) => setGuests(Math.max(1, +e.target.value))} style={{ textAlign: 'center' }} />
                  <button className="btn btn-soft btn-icon" type="button" onClick={() => setGuests((g) => Math.min(10, g + 1))} aria-label="Más">
                    <Icon name="plus" size={14} />
                  </button>
                </div>
              </div>
            </div>

            <div style={resStyles.summaryBox}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--ink-soft)' }}>
                <span>{formatCOP(dest.priceFrom)} × {guests} viajero{guests > 1 ? 's' : ''}</span>
                <span>{formatCOP(dest.priceFrom * guests)}</span>
              </div>
              <div className="divider" style={{ margin: '14px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontFamily: 'var(--serif)', fontSize: 18 }}>Total estimado</span>
                <span className="serif" style={{ fontSize: 28 }}>{formatCOP(totalCost)}</span>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancelar</button>
            <button type="button" className="btn btn-primary" onClick={() => setStep('review')} disabled={!dest.available}>
              {dest.available ? 'Revisar reserva' : 'Sin disponibilidad'}
              <Icon name="arrowRight" size={14} />
            </button>
          </ModalFooter>
        </>
      )}

      {step === 'review' && (
        // HU10 criterio 4: resumen antes de confirmar
        <>
          <ModalHeader title="Confirma tu reserva" subtitle="Revisa los detalles antes de confirmar." onClose={onClose} />
          <ModalBody>
            <div style={resStyles.reviewBlock}>
              <ReviewRow label="Destino" value={dest.name} />
              <ReviewRow label="Fecha" value={formatDate(date)} />
              <ReviewRow label="Viajeros" value={`${guests} persona${guests > 1 ? 's' : ''}`} />
              <ReviewRow label="Duración estimada" value={`${dest.avgDays} días`} />
              <div className="divider" style={{ margin: '4px 0' }} />
              <ReviewRow label="Costo total" value={formatCOP(totalCost)} large />
            </div>
            <label style={{ display: 'flex', gap: 10, marginTop: 18, alignItems: 'flex-start', cursor: 'pointer', fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.45 }}>
              <input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} style={{ marginTop: 4, accentColor: 'var(--ink)' }} />
              <span>Acepto las condiciones de reserva y la política de cancelación. Recibiré confirmación por correo electrónico.</span>
            </label>
          </ModalBody>
          <ModalFooter>
            <button type="button" className="btn btn-ghost" onClick={() => setStep('form')}>
              <Icon name="arrowLeft" size={14} />
              Editar
            </button>
            <button type="button" className="btn btn-accent" onClick={doReserve} disabled={!accepted}>
              Confirmar reserva
              <Icon name="check" size={14} />
            </button>
          </ModalFooter>
        </>
      )}

      {step === 'done' && confirmed && (
        <>
          <ModalBody style={{ padding: '40px 28px 24px', textAlign: 'center' }}>
            <div style={resStyles.successIcon}>
              <Icon name="check" size={32} stroke={2.5} />
            </div>
            <h3 style={{ fontSize: '2rem', marginBottom: 8 }}>Reserva en proceso</h3>
            <p style={{ color: 'var(--ink-soft)', fontSize: 15, lineHeight: 1.5, maxWidth: 380, margin: '0 auto 24px' }}>
              Tu reserva quedó registrada con estado <strong>Pendiente</strong>. Recibirás un correo y una notificación in-app
              en cuanto se confirme.
            </p>
            <div style={{ ...resStyles.summaryBox, textAlign: 'left' }}>
              <ReviewRow label="N° de reserva" value={'#' + confirmed.id.slice(-8).toUpperCase()} mono />
              <ReviewRow label="Destino" value={confirmed.destName} />
              <ReviewRow label="Fecha" value={formatDate(confirmed.date)} />
              <ReviewRow label="Total" value={formatCOP(confirmed.cost)} large />
            </div>
          </ModalBody>
          <ModalFooter>
            <button type="button" className="btn btn-primary" onClick={onClose} style={{ width: '100%', justifyContent: 'center' }}>
              Listo
            </button>
          </ModalFooter>
        </>
      )}
    </Modal>
  );
}

function ReviewRow({ label, value, large = false, mono = false }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '8px 0', gap: 12 }}>
      <span style={{ fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-mute)' }}>{label}</span>
      <span style={{
        fontFamily: large ? 'var(--serif)' : (mono ? 'var(--mono)' : 'var(--sans)'),
        fontSize: large ? 24 : (mono ? 13 : 14),
        fontWeight: large ? 400 : 500,
        textAlign: 'right',
        textWrap: 'balance',
      }}>{value}</span>
    </div>
  );
}

// ---------------------- Styles ----------------------

const resStyles = {
  eyebrow: {
    fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase',
    color: 'var(--ink-soft)', margin: '0 0 14px',
  },
  row: {
    display: 'flex', gap: 20, padding: 20,
    background: 'var(--card)', borderRadius: 'var(--r-lg)',
    border: '1px solid var(--border-soft)',
    transition: 'border-color 0.15s, box-shadow 0.15s',
  },
  thumb: {
    width: 120, height: 120, flexShrink: 0,
    borderRadius: 'var(--r-md)', overflow: 'hidden', cursor: 'pointer',
    border: 'none', padding: 0,
  },
  summaryBox: {
    background: 'var(--card)', border: '1px solid var(--border-soft)',
    borderRadius: 'var(--r-md)', padding: 18,
  },
  reviewBlock: {
    background: 'var(--card)', border: '1px solid var(--border-soft)',
    borderRadius: 'var(--r-md)', padding: '8px 18px',
  },
  successIcon: {
    width: 72, height: 72, borderRadius: 999,
    background: 'var(--forest)', color: '#FBF6EC',
    display: 'grid', placeItems: 'center', margin: '0 auto 20px',
  },
};

// responsive
{
  const id = 'horizeo-res-style';
  if (!document.getElementById(id)) {
    const s = document.createElement('style');
    s.id = id;
    s.textContent = `
      .reservation-row:hover { border-color: var(--border); box-shadow: var(--shadow-sm); }
      @media (max-width: 640px) {
        .reservation-row { flex-direction: column !important; gap: 16px !important; }
        .reservation-row button[style*="120px"] { width: 100% !important; height: 180px !important; }
      }
    `;
    document.head.appendChild(s);
  }
}

Object.assign(window, {
  ReservationsScreen,
  ReservationModal,
  STATUS_META,
});
