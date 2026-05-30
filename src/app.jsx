/* ================================================================
   HORIZEO · App shell (router + navbar)
   Hash-based routing:
     #/explore (default)
     #/destination/:id
     #/itineraries
     #/itinerary/:id
     #/reservations
     #/profile
   ================================================================ */

function useHashRoute() {
  const parse = () => {
    const h = window.location.hash.replace(/^#/, '') || '/explore';
    const parts = h.split('/').filter(Boolean);
    return { name: parts[0] || 'explore', id: parts[1] || null, raw: h };
  };
  const [route, setRoute] = React.useState(parse);
  React.useEffect(() => {
    const handler = () => setRoute(parse());
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  const navigate = React.useCallback((path) => {
    window.location.hash = path;
  }, []);

  return { route, navigate };
}

function LoadingScreen() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
      <Logo />
      <div style={{ color: 'var(--ink-mute)', fontSize: 14 }}>Cargando…</div>
    </div>
  );
}

function App() {
  const { state } = useStore();
  const { route, navigate } = useHashRoute();
  const [reservationDest, setReservationDest] = React.useState(null);

  // Esperar a que Supabase resuelva la sesión inicial
  if (state.loading) {
    return <LoadingScreen />;
  }

  // Ruta de recuperación de contraseña — accesible sin autenticación previa
  if (route.name === 'reset-password') {
    return <ResetPasswordScreen />;
  }

  // Si no hay sesión, mostrar auth screen
  if (!state.user || !state.user.sessionToken) {
    return <AuthScreen />;
  }

  // Render screen by route
  let screen;
  switch (route.name) {
    case 'explore':
      screen = <ExploreScreen onOpenDest={(id) => navigate('/destination/' + id)} />;
      break;
    case 'destination':
      screen = <DestinationScreen
        destId={route.id}
        onBack={() => navigate('/explore')}
        onAddToItinerary={() => navigate('/itineraries')}
        onReserve={(dest) => setReservationDest(dest)}
      />;
      break;
    case 'itineraries':
      screen = <ItineraryListScreen
        onOpenItinerary={(id) => navigate('/itinerary/' + id)}
      />;
      break;
    case 'itinerary':
      screen = <ItineraryDetailScreen
        itineraryId={route.id}
        onBack={() => navigate('/itineraries')}
      />;
      break;
    case 'reservations':
      screen = <ReservationsScreen
        onOpenDest={(id) => navigate('/destination/' + id)}
      />;
      break;
    case 'profile':
      screen = <ProfileScreen />;
      break;
    default:
      screen = <ExploreScreen onOpenDest={(id) => navigate('/destination/' + id)} />;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        currentRoute={route.name}
        user={state.user}
        reservationCount={state.reservations.filter((r) => r.status === 'pending').length}
        onNav={navigate}
      />
      <main style={{ flex: 1 }}>
        {screen}
      </main>
      <Footer />

      <ReservationModal
        open={!!reservationDest}
        dest={reservationDest}
        onClose={() => setReservationDest(null)}
      />
    </div>
  );
}

// ---------------------- Navbar ----------------------

function Navbar({ currentRoute, user, reservationCount, onNav }) {
  const [open, setOpen] = React.useState(false);
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);
  const [loggingOut, setLoggingOut] = React.useState(false);
  const { actions } = useStore();

  const handleLogout = async () => {
    setLoggingOut(true);
    setUserMenuOpen(false);
    setOpen(false);
    await actions.logout();
  };

  const items = [
    { route: 'explore', label: 'Explorar', icon: 'compass' },
    { route: 'itineraries', label: 'Itinerarios', icon: 'map' },
    { route: 'reservations', label: 'Reservas', icon: 'bookmark', badge: reservationCount },
  ];

  const isActive = (r) => currentRoute === r || (r === 'explore' && currentRoute === 'destination') || (r === 'itineraries' && currentRoute === 'itinerary');

  React.useEffect(() => {
    const close = () => setUserMenuOpen(false);
    if (userMenuOpen) {
      const t = setTimeout(() => document.addEventListener('click', close), 0);
      return () => { clearTimeout(t); document.removeEventListener('click', close); };
    }
  }, [userMenuOpen]);

  return (
    <header style={navStyles.header}>
      <div className="container" style={navStyles.inner}>
        <button onClick={() => onNav('/explore')} style={navStyles.brand}>
          <Logo />
        </button>

        <nav style={navStyles.nav} className="nav-desktop">
          {items.map((it) => (
            <button
              key={it.route}
              onClick={() => onNav('/' + it.route)}
              style={{
                ...navStyles.navItem,
                color: isActive(it.route) ? 'var(--ink)' : 'var(--ink-soft)',
              }}
              className={'nav-item ' + (isActive(it.route) ? 'active' : '')}
            >
              {it.label}
              {it.badge > 0 && (
                <span style={navStyles.badge}>{it.badge}</span>
              )}
            </button>
          ))}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ position: 'relative' }} onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setUserMenuOpen((s) => !s)}
              style={navStyles.userBtn}
              aria-label="Menú de usuario"
            >
              <Avatar name={user.name} size={36} />
            </button>
            {userMenuOpen && (
              <div style={navStyles.userMenu} className="fade-in">
                <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border-soft)' }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{user.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--ink-soft)' }}>{user.email}</div>
                </div>
                <button style={navStyles.userMenuItem} onClick={() => { onNav('/profile'); setUserMenuOpen(false); }}>
                  <Icon name="user" size={15} />
                  Mi perfil
                </button>
                <button style={navStyles.userMenuItem} onClick={() => { onNav('/reservations'); setUserMenuOpen(false); }}>
                  <Icon name="bookmark" size={15} />
                  Mis reservas
                </button>
                <div style={{ height: 1, background: 'var(--border-soft)', margin: '4px 0' }} />
                {/* HU02 criterio 4: cerrar sesión desde cualquier pantalla */}
                <button style={{ ...navStyles.userMenuItem, color: 'var(--crimson)', opacity: loggingOut ? 0.6 : 1 }} onClick={handleLogout} disabled={loggingOut}>
                  <Icon name="logout" size={15} />
                  {loggingOut ? 'Cerrando sesión…' : 'Cerrar sesión'}
                </button>
              </div>
            )}
          </div>

          <button onClick={() => setOpen((s) => !s)} className="nav-mobile-toggle" style={navStyles.mobileToggle} aria-label="Menú">
            <Icon name={open ? 'close' : 'menu'} size={20} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="nav-mobile-panel" style={navStyles.mobilePanel}>
          {items.map((it) => (
            <button
              key={it.route}
              onClick={() => { onNav('/' + it.route); setOpen(false); }}
              style={{
                ...navStyles.mobileItem,
                background: isActive(it.route) ? 'var(--bg-soft)' : 'transparent',
              }}
            >
              <Icon name={it.icon} size={18} />
              <span style={{ flex: 1, textAlign: 'left' }}>{it.label}</span>
              {it.badge > 0 && <span style={navStyles.badge}>{it.badge}</span>}
            </button>
          ))}
          <div style={{ height: 1, background: 'var(--border-soft)', margin: '4px 0' }} />
          <button onClick={() => { onNav('/profile'); setOpen(false); }} style={navStyles.mobileItem}>
            <Icon name="user" size={18} />
            <span style={{ flex: 1, textAlign: 'left' }}>Mi perfil</span>
          </button>
          <button onClick={handleLogout} disabled={loggingOut} style={{ ...navStyles.mobileItem, color: 'var(--crimson)', opacity: loggingOut ? 0.6 : 1 }}>
            <Icon name="logout" size={18} />
            <span style={{ flex: 1, textAlign: 'left' }}>{loggingOut ? 'Cerrando sesión…' : 'Cerrar sesión'}</span>
          </button>
        </div>
      )}
    </header>
  );
}

// ---------------------- Footer ----------------------

function Footer() {
  const { actions } = useStore();
  return (
    <footer style={navStyles.footer}>
      <div className="container" style={navStyles.footerInner}>
        <div>
          <Logo />
          <p style={{ color: 'var(--ink-mute)', fontSize: 13, margin: '14px 0 0', maxWidth: 320 }}>
            Plataforma de turismo digital — prototipo basado en TravelSmart, conforme al perfil básico ISO/IEC 29110.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap' }}>
          <div>
            <div style={navStyles.footerHeading}>Producto</div>
            <a href="#/explore" style={navStyles.footerLink}>Explorar</a>
            <a href="#/itineraries" style={navStyles.footerLink}>Itinerarios</a>
            <a href="#/reservations" style={navStyles.footerLink}>Reservas</a>
          </div>
          <div>
            <div style={navStyles.footerHeading}>Demo</div>
            <button onClick={() => {
              if (confirm('Esto reiniciará todos los datos del prototipo. ¿Continuar?')) {
                actions.resetAll();
                window.location.hash = '/explore';
              }
            }} style={{ ...navStyles.footerLink, background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left' }}>
              Reiniciar datos
            </button>
          </div>
        </div>
      </div>
      <div style={navStyles.footerBottom}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <span style={{ fontSize: 12, color: 'var(--ink-mute)' }}>© 2026 Horizeo · Prototipo académico</span>
          <span style={{ fontSize: 12, color: 'var(--ink-mute)', fontStyle: 'italic', fontFamily: 'var(--serif)' }}>
            Diseñado con intención.
          </span>
        </div>
      </div>
    </footer>
  );
}

// ---------------------- Styles ----------------------

const navStyles = {
  header: {
    position: 'sticky', top: 0, zIndex: 100,
    background: 'rgba(241, 234, 221, 0.86)',
    backdropFilter: 'blur(12px) saturate(140%)',
    borderBottom: '1px solid var(--border-soft)',
  },
  inner: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    height: 72, gap: 24,
  },
  brand: { background: 'none', border: 'none', cursor: 'pointer', padding: 0 },
  nav: { display: 'flex', gap: 4, alignItems: 'center' },
  navItem: {
    padding: '8px 16px', borderRadius: 999, fontSize: 14, fontWeight: 500,
    transition: 'color 0.15s, background 0.15s',
    display: 'inline-flex', alignItems: 'center', gap: 6,
    cursor: 'pointer',
  },
  badge: {
    background: 'var(--accent)', color: '#fff',
    borderRadius: 999, padding: '1px 7px', fontSize: 11, fontWeight: 600,
  },
  userBtn: { padding: 0, borderRadius: 999, cursor: 'pointer' },
  userMenu: {
    position: 'absolute', top: 'calc(100% + 8px)', right: 0,
    width: 220, background: 'var(--card-elev)', border: '1px solid var(--border)',
    borderRadius: 'var(--r-md)', boxShadow: 'var(--shadow-md)',
    overflow: 'hidden', zIndex: 50,
  },
  userMenuItem: {
    width: '100%', padding: '11px 18px', textAlign: 'left',
    display: 'flex', alignItems: 'center', gap: 10, fontSize: 14,
    color: 'var(--ink)', cursor: 'pointer',
    transition: 'background 0.1s',
  },

  mobileToggle: { display: 'none', padding: 8, borderRadius: 8, cursor: 'pointer', color: 'var(--ink)' },
  mobilePanel: {
    display: 'none', padding: 12,
    flexDirection: 'column', gap: 4,
    borderTop: '1px solid var(--border-soft)',
    background: 'var(--bg)',
  },
  mobileItem: {
    width: '100%', padding: '14px 18px', textAlign: 'left',
    display: 'flex', alignItems: 'center', gap: 12, fontSize: 15,
    color: 'var(--ink)', cursor: 'pointer', borderRadius: 'var(--r-md)',
    transition: 'background 0.1s',
  },

  footer: {
    background: 'var(--bg-soft)',
    borderTop: '1px solid var(--border-soft)',
    marginTop: 'auto',
  },
  footerInner: {
    padding: '56px 24px 32px',
    display: 'grid', gridTemplateColumns: '1fr auto', gap: 40,
    alignItems: 'flex-start',
  },
  footerHeading: {
    fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase',
    color: 'var(--ink-soft)', marginBottom: 12,
  },
  footerLink: {
    display: 'block', fontSize: 14, color: 'var(--ink)',
    padding: '4px 0', textDecoration: 'none',
  },
  footerBottom: {
    borderTop: '1px solid var(--border)',
    padding: '20px 0',
  },
};

// Hover + responsive
{
  const id = 'horizeo-nav-style';
  if (!document.getElementById(id)) {
    const s = document.createElement('style');
    s.id = id;
    s.textContent = `
      .nav-item:hover { background: var(--bg-soft); }
      .nav-item.active { background: var(--card-elev); border: 1px solid var(--border-soft); }
      .nav-mobile-toggle { display: none !important; }
      .nav-mobile-panel { display: flex !important; }
      [style*="userMenuItem"]:hover { background: var(--bg-soft); }

      @media (max-width: 768px) {
        .nav-desktop { display: none !important; }
        .nav-mobile-toggle { display: grid !important; place-items: center; }
        footer div[style*="grid-template-columns: 1fr auto"],
        footer div[style*="gridTemplateColumns"] { grid-template-columns: 1fr !important; gap: 32px !important; }
      }
    `;
    document.head.appendChild(s);
  }
}

// ---------------------- Mount ----------------------

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <StoreProvider>
    <ToastProvider>
      <App />
    </ToastProvider>
  </StoreProvider>
);
