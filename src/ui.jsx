/* ================================================================
   HORIZEO · UI primitives compartidos
   - Icon (Lucide-style SVG)
   - Modal, Toast (con ToastProvider)
   - Stars rating + StarRater (interactivo)
   - EmptyState
   - PriceRange (slider doble)
   - Avatar
   ================================================================ */

// ---------------------- Icons (inline SVG, stroke based) ----------------------

const ICONS = {
  search: 'M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm10 2l-4.35-4.35',
  close: 'M18 6 6 18M6 6l18 12',
  user: 'M16 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 20a8 8 0 0 1 16 0',
  logout: 'M16 17l5-5-5-5M21 12H9M13 21H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  check: 'M5 12l5 5L20 7',
  chevronRight: 'M9 6l6 6-6 6',
  chevronLeft: 'M15 6l-6 6 6 6',
  chevronDown: 'M6 9l6 6 6-6',
  arrowRight: 'M5 12h14M12 5l7 7-7 7',
  arrowLeft: 'M19 12H5M12 19l-7-7 7-7',
  star: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  heart: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z',
  map: 'M9 20l-5.41-1.84A1 1 0 0 1 3 17.21V4.79a1 1 0 0 1 1.32-.95L9 5m0 15l6-2m-6 2V5m6 13l5.41 1.84A1 1 0 0 0 21 18.95V6.53a1 1 0 0 0-.65-.94L15 3.5M15 18V3.5m0 0L9 5',
  calendar: 'M3 9h18M5 5h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zM8 3v4M16 3v4',
  clock: 'M12 6v6l4 2M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20z',
  location: 'M12 21s-7-7.58-7-12a7 7 0 0 1 14 0c0 4.42-7 12-7 12zM12 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
  edit: 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z',
  trash: 'M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6',
  filter: 'M3 6h18M6 12h12M10 18h4',
  sliders: 'M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6',
  briefcase: 'M20 7H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16',
  bed: 'M2 4v16M22 12v8M2 12h20M2 16h20M6 8h6a4 4 0 0 1 4 4',
  car: 'M5 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM19 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM3 9l2-5h14l2 5M3 9v6h2M21 9v6h-2M5 15h14',
  airplane: 'M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.2.6-.6.5-1.1z',
  compass: 'M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20zM16.24 7.76L14.12 14.12 7.76 16.24l2.12-6.36L16.24 7.76z',
  eye: 'M2 12s4-8 10-8 10 8 10 8-4 8-10 8-10-8-10-8zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  eyeOff: 'M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-10-8-10-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 10 8 10 8a18.5 18.5 0 0 1-2.16 3.19M14.12 14.12a3 3 0 1 1-4.24-4.24M1 1l22 22',
  info: 'M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20zM12 16v-4M12 8h.01',
  alert: 'M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01',
  menu: 'M3 12h18M3 6h18M3 18h18',
  settings: 'M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  bookmark: 'M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z',
  bell: 'M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0',
  mail: 'M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM22 6l-10 7L2 6',
  globe: 'M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20zM2 12h20M12 2c2.5 3 4 6.5 4 10s-1.5 7-4 10c-2.5-3-4-6.5-4-10s1.5-7 4-10z',
};

function Icon({ name, size = 18, stroke = 2, className = '', style = {} }) {
  const path = ICONS[name];
  if (!path) return null;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ flexShrink: 0, ...style }}
    >
      <path d={path} />
    </svg>
  );
}

// ---------------------- Modal ----------------------

function Modal({ open, onClose, children, size = 'md', closeOnBackdrop = true }) {
  React.useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === 'Escape') onClose && onClose(); };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget && closeOnBackdrop) onClose && onClose();
      }}
    >
      <div className={'modal ' + (size === 'lg' ? 'modal-lg' : '')} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

function ModalHeader({ title, subtitle, onClose }) {
  return (
    <div style={{ padding: '24px 28px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <h3 style={{ fontSize: '1.6rem', marginBottom: subtitle ? 4 : 0 }}>{title}</h3>
        {subtitle && <p style={{ margin: 0, color: 'var(--ink-soft)', fontSize: 14 }}>{subtitle}</p>}
      </div>
      {onClose && (
        <button className="btn btn-icon btn-ghost" onClick={onClose} aria-label="Cerrar">
          <Icon name="close" size={18} />
        </button>
      )}
    </div>
  );
}

function ModalBody({ children, style = {} }) {
  return <div style={{ padding: '8px 28px 16px', ...style }}>{children}</div>;
}

function ModalFooter({ children }) {
  return (
    <div style={{ padding: '16px 28px 24px', display: 'flex', gap: 10, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
      {children}
    </div>
  );
}

// ---------------------- Toast ----------------------

const ToastContext = React.createContext(null);

function ToastProvider({ children }) {
  const [toasts, setToasts] = React.useState([]);
  const push = React.useCallback((message, opts = {}) => {
    const id = 't-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6);
    const t = { id, message, type: opts.type || 'default', duration: opts.duration || 3000 };
    setToasts((prev) => [...prev, t]);
    setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), t.duration);
  }, []);

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div className="toast-wrap">
        {toasts.map((t) => (
          <div key={t.id} className={'toast ' + (t.type === 'success' ? 'toast-success' : t.type === 'error' ? 'toast-error' : '')}>
            {t.type === 'success' && <Icon name="check" size={16} />}
            {t.type === 'error' && <Icon name="alert" size={16} />}
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) return () => {};
  return ctx;
}

// ---------------------- Stars ----------------------

function Stars({ value = 0, size = 14, max = 5, showNumber = false }) {
  const rounded = Math.round(value * 2) / 2; // half-step
  return (
    <span className="stars" style={{ alignItems: 'center', display: 'inline-flex', gap: 4 }}>
      <span style={{ display: 'inline-flex', gap: 2 }}>
        {[...Array(max)].map((_, i) => {
          const filled = i + 1 <= rounded;
          const half = !filled && i + 0.5 <= rounded;
          return (
            <svg key={i} width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block' }}>
              <defs>
                <linearGradient id={`star-half-${i}-${size}`}>
                  <stop offset="50%" stopColor="var(--amber)" />
                  <stop offset="50%" stopColor="var(--border)" />
                </linearGradient>
              </defs>
              <path
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                fill={filled ? 'var(--amber)' : half ? `url(#star-half-${i}-${size})` : 'var(--border)'}
              />
            </svg>
          );
        })}
      </span>
      {showNumber && <span style={{ fontSize: size - 2, color: 'var(--ink-soft)', fontFamily: 'var(--sans)', fontWeight: 500 }}>{value.toFixed(1)}</span>}
    </span>
  );
}

function StarRater({ value, onChange, size = 28 }) {
  const [hover, setHover] = React.useState(0);
  const display = hover || value || 0;
  return (
    <div style={{ display: 'inline-flex', gap: 4 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(n)}
          style={{ padding: 4, lineHeight: 0, borderRadius: 6 }}
          aria-label={`${n} estrella${n > 1 ? 's' : ''}`}
        >
          <svg width={size} height={size} viewBox="0 0 24 24">
            <path
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              fill={n <= display ? 'var(--amber)' : 'var(--border)'}
              style={{ transition: 'fill 0.1s' }}
            />
          </svg>
        </button>
      ))}
    </div>
  );
}

// ---------------------- EmptyState ----------------------

function EmptyState({ icon = 'compass', title, description, action }) {
  return (
    <div style={{
      padding: '64px 24px', textAlign: 'center', maxWidth: 480, margin: '0 auto',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
    }}>
      <div style={{
        width: 64, height: 64, borderRadius: 999, background: 'var(--bg-soft)',
        display: 'grid', placeItems: 'center', color: 'var(--ink-soft)',
      }}>
        <Icon name={icon} size={28} stroke={1.5} />
      </div>
      <h3 style={{ fontSize: '1.5rem' }}>{title}</h3>
      {description && <p style={{ color: 'var(--ink-soft)', margin: 0, fontSize: 14, lineHeight: 1.5 }}>{description}</p>}
      {action}
    </div>
  );
}

// ---------------------- Confirm dialog ----------------------

function ConfirmDialog({ open, onConfirm, onCancel, title, description, confirmLabel = 'Confirmar', cancelLabel = 'Cancelar', destructive = false }) {
  return (
    <Modal open={open} onClose={onCancel}>
      <ModalHeader title={title} subtitle={description} />
      <ModalFooter>
        <button className="btn btn-ghost" onClick={onCancel}>{cancelLabel}</button>
        <button className={'btn ' + (destructive ? 'btn-danger' : 'btn-primary')} onClick={onConfirm}>
          {confirmLabel}
        </button>
      </ModalFooter>
    </Modal>
  );
}

// ---------------------- Range slider (presupuesto) ----------------------

function PriceRange({ min, max, value, onChange, step = 100000 }) {
  // value: [lo, hi]
  const [lo, hi] = value;
  const range = max - min;
  const loPct = ((lo - min) / range) * 100;
  const hiPct = ((hi - min) / range) * 100;

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--ink-soft)', marginBottom: 8 }}>
        <span>{formatCOP(lo)}</span>
        <span>{formatCOP(hi)}</span>
      </div>
      <div style={{ position: 'relative', height: 24 }}>
        <div style={{ position: 'absolute', top: 11, left: 0, right: 0, height: 3, background: 'var(--border)', borderRadius: 999 }} />
        <div style={{
          position: 'absolute', top: 11, left: `${loPct}%`, width: `${hiPct - loPct}%`, height: 3,
          background: 'var(--ink)', borderRadius: 999,
        }} />
        <input
          type="range" min={min} max={max} step={step} value={lo}
          onChange={(e) => onChange([Math.min(+e.target.value, hi - step), hi])}
          style={rangeInputStyle}
        />
        <input
          type="range" min={min} max={max} step={step} value={hi}
          onChange={(e) => onChange([lo, Math.max(+e.target.value, lo + step)])}
          style={rangeInputStyle}
        />
      </div>
    </div>
  );
}
const rangeInputStyle = {
  position: 'absolute', inset: 0, width: '100%', height: '100%',
  appearance: 'none', background: 'none', pointerEvents: 'none', opacity: 0,
  // We rely on default thumb to be clickable via pointerEvents handling below
};
// inject styles for the dual-range thumbs
{
  const id = 'horizeo-range-style';
  if (!document.getElementById(id)) {
    const s = document.createElement('style');
    s.id = id;
    s.textContent = `
      input[type=range] { pointer-events: none; }
      input[type=range]::-webkit-slider-thumb { pointer-events: auto; appearance: none; -webkit-appearance: none; width: 22px; height: 22px; border-radius: 999px; background: var(--card-elev); border: 2px solid var(--ink); cursor: grab; box-shadow: var(--shadow-sm); position: relative; z-index: 2; opacity: 1; }
      input[type=range]::-moz-range-thumb { pointer-events: auto; width: 22px; height: 22px; border-radius: 999px; background: var(--card-elev); border: 2px solid var(--ink); cursor: grab; box-shadow: var(--shadow-sm); opacity: 1; }
      input[type=range]::-webkit-slider-runnable-track { background: transparent; }
      .price-range-wrap input[type=range] { opacity: 1; }
    `;
    document.head.appendChild(s);
  }
}
// Wrap PriceRange to enable opacity
function PriceRangeFixed(props) {
  return <div className="price-range-wrap" style={{ width: '100%' }}><PriceRange {...props} /></div>;
}

// ---------------------- Avatar ----------------------

function Avatar({ name = '', size = 36 }) {
  const initials = name.split(/\s+/).filter(Boolean).map((p) => p[0]).slice(0, 2).join('').toUpperCase() || '?';
  return (
    <div style={{
      width: size, height: size, borderRadius: 999, background: 'var(--ink)', color: 'var(--card)',
      display: 'grid', placeItems: 'center', fontFamily: 'var(--serif)', fontSize: size * 0.42,
      flexShrink: 0,
    }}>
      {initials}
    </div>
  );
}

// ---------------------- Image with fallback ----------------------

function FallbackImage({ src, alt = '', style = {}, className = '' }) {
  const [errored, setErrored] = React.useState(false);
  if (errored || !src) {
    return (
      <div className={className} style={{
        background: 'linear-gradient(135deg, var(--bg-soft) 0%, #D4C7AC 100%)',
        display: 'grid', placeItems: 'center', color: 'var(--ink-soft)',
        fontFamily: 'var(--serif)', fontStyle: 'italic',
        ...style,
      }}>
        <Icon name="compass" size={32} stroke={1.5} />
      </div>
    );
  }
  return <img src={src} alt={alt} className={className} style={style} onError={() => setErrored(true)} loading="lazy" />;
}

// ---------------------- Tabs ----------------------

function Tabs({ tabs, value, onChange, style = {} }) {
  return (
    <div style={{
      display: 'inline-flex', gap: 4, padding: 4, background: 'var(--bg-soft)',
      borderRadius: 999, ...style,
    }}>
      {tabs.map((t) => (
        <button
          key={t.value}
          onClick={() => onChange(t.value)}
          style={{
            padding: '7px 16px', borderRadius: 999, fontSize: 13, fontWeight: 500,
            background: value === t.value ? 'var(--card-elev)' : 'transparent',
            color: value === t.value ? 'var(--ink)' : 'var(--ink-soft)',
            boxShadow: value === t.value ? 'var(--shadow-sm)' : 'none',
            transition: 'all 0.15s',
          }}
        >
          {t.label}
          {t.count != null && (
            <span style={{ marginLeft: 6, fontSize: 11, color: 'var(--ink-mute)' }}>{t.count}</span>
          )}
        </button>
      ))}
    </div>
  );
}

// ---------------------- Export ----------------------

Object.assign(window, {
  Icon, ICONS,
  Modal, ModalHeader, ModalBody, ModalFooter,
  ToastContext, ToastProvider, useToast,
  Stars, StarRater,
  EmptyState,
  ConfirmDialog,
  PriceRange: PriceRangeFixed,
  Avatar,
  FallbackImage,
  Tabs,
});
