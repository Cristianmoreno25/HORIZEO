/* ================================================================
   HORIZEO · Auth
   - AuthScreen: split editorial (hero izquierda, form derecha)
   - Login / Register tabs
   - HU01: registro c/ validación + hash + redirect
   - HU02: login con bloqueo tras 3 intentos + JWT mock
   ================================================================ */

function AuthScreen() {
  const [mode, setMode] = React.useState('login'); // 'login' | 'register'
  return (
    <div style={authStyles.root}>
      {/* Hero side */}
      <div style={authStyles.hero}>
        <div style={authStyles.heroOverlay} />
        <div style={authStyles.heroContent}>
          <div style={authStyles.brandRow}>
            <Logo color="#FBF6EC" />
          </div>
          <div style={{ flex: 1 }} />
          <div style={authStyles.heroTextBlock}>
            <p style={authStyles.heroEyebrow}>Plataforma de viaje · Estética intencional</p>
            <h1 style={authStyles.heroTitle}>
              Viaja con <span className="serif-i" style={{ color: '#E9C4B5' }}>intención</span>,
              <br />
              no con prisa.
            </h1>
            <p style={authStyles.heroBody}>
              Descubre destinos curados, construye itinerarios al detalle y gestiona cada reserva
              en un solo lugar. Diseñado para viajeros que valoran el cómo tanto como el dónde.
            </p>
          </div>
          <div style={authStyles.heroFooter}>
            <div style={authStyles.heroStat}>
              <div style={authStyles.heroStatNum}>120+</div>
              <div style={authStyles.heroStatLabel}>destinos curados</div>
            </div>
            <div style={authStyles.heroStat}>
              <div style={authStyles.heroStatNum}>14k</div>
              <div style={authStyles.heroStatLabel}>itinerarios creados</div>
            </div>
            <div style={authStyles.heroStat}>
              <div style={authStyles.heroStatNum}>4.8</div>
              <div style={authStyles.heroStatLabel}>satisfacción media</div>
            </div>
          </div>
        </div>
      </div>

      {/* Form side */}
      <div style={authStyles.formSide}>
        <div style={authStyles.formInner}>
          <div style={{ marginBottom: 32 }}>
            <Tabs
              tabs={[{ value: 'login', label: 'Iniciar sesión' }, { value: 'register', label: 'Crear cuenta' }]}
              value={mode}
              onChange={setMode}
            />
          </div>
          {mode === 'login' ? <LoginForm onSwap={() => setMode('register')} /> : <RegisterForm onSwap={() => setMode('login')} />}
        </div>
      </div>
    </div>
  );
}

function Logo({ color = 'var(--ink)' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color }}>
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="13" stroke={color} strokeWidth="1.4" />
        <path d="M3 17 Q 14 11, 25 17" stroke={color} strokeWidth="1.4" fill="none" strokeLinecap="round" />
        <circle cx="19" cy="11" r="1.2" fill={color} />
      </svg>
      <span style={{ fontFamily: 'var(--serif)', fontSize: 24, letterSpacing: '-0.02em' }}>Horizeo</span>
    </div>
  );
}

function LoginForm({ onSwap }) {
  const { actions } = useStore();
  const toast = useToast();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPw, setShowPw] = React.useState(false);
  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = React.useState(false);

  const submit = (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    setTimeout(() => {
      const res = actions.login({ email, password });
      setLoading(false);
      if (!res.ok) {
        setErrors(res.errors);
      } else {
        toast('Bienvenido de vuelta', { type: 'success' });
      }
    }, 450);
  };

  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h2 style={{ fontSize: '2.4rem', marginBottom: 6 }}>Hola de nuevo.</h2>
        <p style={{ color: 'var(--ink-soft)', margin: 0 }}>Ingresa para continuar planeando tus viajes.</p>
      </div>

      {errors._ && (
        <div style={authStyles.errorBanner}>
          <Icon name="alert" size={16} />
          <span>{errors._}</span>
        </div>
      )}

      <div className="field">
        <label className="field-label">Correo electrónico</label>
        <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@correo.com" required autoComplete="email" />
      </div>
      <div className="field">
        <label className="field-label">Contraseña</label>
        <div style={{ position: 'relative' }}>
          <input className="input" type={showPw ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required autoComplete="current-password" style={{ paddingRight: 42 }} />
          <button type="button" onClick={() => setShowPw((s) => !s)} style={authStyles.pwToggle} aria-label="Mostrar contraseña">
            <Icon name={showPw ? 'eyeOff' : 'eye'} size={16} />
          </button>
        </div>
      </div>

      <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%', justifyContent: 'center', opacity: loading ? 0.6 : 1 }}>
        {loading ? 'Verificando…' : 'Entrar'}
        {!loading && <Icon name="arrowRight" size={16} />}
      </button>

      <p style={{ fontSize: 14, color: 'var(--ink-soft)', textAlign: 'center', margin: 0 }}>
        ¿Aún no tienes cuenta? <button type="button" onClick={onSwap} style={authStyles.link}>Regístrate</button>
      </p>
    </form>
  );
}

function RegisterForm({ onSwap }) {
  const { actions } = useStore();
  const toast = useToast();
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPw, setShowPw] = React.useState(false);
  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = React.useState(false);

  const submit = (e) => {
    e.preventDefault();
    setErrors({});
    if (!name.trim()) { setErrors({ name: 'Tu nombre es requerido' }); return; }
    setLoading(true);
    setTimeout(() => {
      const res = actions.register({ name, email, password });
      setLoading(false);
      if (!res.ok) setErrors(res.errors);
      else {
        toast('Cuenta creada. Bienvenido a Horizeo.', { type: 'success' });
        // Auto-login
        actions.login({ email, password });
      }
    }, 500);
  };

  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div>
        <h2 style={{ fontSize: '2.4rem', marginBottom: 6 }}>Crea tu cuenta.</h2>
        <p style={{ color: 'var(--ink-soft)', margin: 0 }}>Comienza a curar tus viajes con intención.</p>
      </div>

      <div className="field">
        <label className="field-label">Nombre completo</label>
        <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Cristian Moreno" required />
        {errors.name && <div className="field-error">{errors.name}</div>}
      </div>

      <div className="field">
        <label className="field-label">Correo electrónico</label>
        <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@correo.com" required />
        {errors.email && <div className="field-error">{errors.email}</div>}
      </div>

      <div className="field">
        <label className="field-label">Contraseña</label>
        <div style={{ position: 'relative' }}>
          <input className="input" type={showPw ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mínimo 8 caracteres" required style={{ paddingRight: 42 }} />
          <button type="button" onClick={() => setShowPw((s) => !s)} style={authStyles.pwToggle}>
            <Icon name={showPw ? 'eyeOff' : 'eye'} size={16} />
          </button>
        </div>
        {errors.password && <div className="field-error">{errors.password}</div>}
        <div className="field-help">
          {password.length >= 8 ? (
            <span style={{ color: 'var(--forest)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <Icon name="check" size={12} /> Longitud OK
            </span>
          ) : (
            <span>Mínimo 8 caracteres. La contraseña se almacena cifrada (bcrypt).</span>
          )}
        </div>
      </div>

      <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%', justifyContent: 'center', opacity: loading ? 0.6 : 1 }}>
        {loading ? 'Creando cuenta…' : 'Crear cuenta'}
        {!loading && <Icon name="arrowRight" size={16} />}
      </button>

      <p style={{ fontSize: 12, color: 'var(--ink-mute)', margin: 0, textAlign: 'center', lineHeight: 1.5 }}>
        Al continuar aceptas los términos y la política de privacidad. Tus datos quedan únicamente en este dispositivo (prototipo).
      </p>

      <div className="divider" />
      <p style={{ fontSize: 14, color: 'var(--ink-soft)', textAlign: 'center', margin: 0 }}>
        ¿Ya tienes cuenta? <button type="button" onClick={onSwap} style={authStyles.link}>Inicia sesión</button>
      </p>
    </form>
  );
}

// ---------------------- Profile editor (HU03) ----------------------

function ProfileScreen() {
  const { state, actions } = useStore();
  const toast = useToast();
  const u = state.user;
  const [name, setName] = React.useState(u.name);
  const [email, setEmail] = React.useState(u.email);
  const [budget, setBudget] = React.useState(u.prefs.budget || 2000000);
  const [experiences, setExperiences] = React.useState(u.prefs.experiences || []);
  const [saved, setSaved] = React.useState(false);

  const toggleExp = (v) => {
    setExperiences((prev) => prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]);
  };

  const save = () => {
    actions.updateProfile({ name: name.trim(), email: email.trim(), prefs: { budget, experiences } });
    setSaved(true);
    toast('Perfil actualizado · las recomendaciones reflejan tus preferencias', { type: 'success' });
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="container-narrow" style={{ paddingTop: 48, paddingBottom: 80 }}>
      <div style={{ marginBottom: 40 }}>
        <p style={authStyles.eyebrow}>Tu perfil</p>
        <h1 style={{ fontSize: 'clamp(2.4rem, 5vw, 3.6rem)', marginBottom: 12 }}>
          Hola, <span className="serif-i">{u.name.split(' ')[0]}</span>.
        </h1>
        <p style={{ color: 'var(--ink-soft)', fontSize: 17, margin: 0, maxWidth: 540 }}>
          Ajusta tus preferencias para recibir destinos y experiencias alineadas a tu manera de viajar.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

        <section>
          <h3 style={{ fontSize: '1.4rem', marginBottom: 16 }}>Datos personales</h3>
          <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
            <div className="field">
              <label className="field-label">Nombre</label>
              <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="field">
              <label className="field-label">Correo</label>
              <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>
        </section>

        <div className="divider" />

        <section>
          <h3 style={{ fontSize: '1.4rem', marginBottom: 6 }}>Presupuesto habitual</h3>
          <p style={{ color: 'var(--ink-soft)', margin: '0 0 18px', fontSize: 14 }}>
            Usaremos este valor para sugerirte destinos ajustados a tu rango.
          </p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 8 }}>
            <span className="serif" style={{ fontSize: '2.8rem' }}>{formatCOP(budget)}</span>
            <span style={{ color: 'var(--ink-mute)', fontSize: 14 }}>COP por viaje</span>
          </div>
          <input
            type="range" min="500000" max="10000000" step="100000" value={budget}
            onChange={(e) => setBudget(+e.target.value)}
            style={{ width: '100%', opacity: 1, accentColor: 'var(--ink)' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--ink-mute)', marginTop: 4 }}>
            <span>$500K</span>
            <span>$10M</span>
          </div>
        </section>

        <div className="divider" />

        <section>
          <h3 style={{ fontSize: '1.4rem', marginBottom: 6 }}>Tipo de experiencia</h3>
          <p style={{ color: 'var(--ink-soft)', margin: '0 0 18px', fontSize: 14 }}>
            Selecciona las que más te interesan. Puedes elegir varias.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {EXPERIENCE_OPTIONS.map((opt) => {
              const active = experiences.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  onClick={() => toggleExp(opt.value)}
                  style={{
                    padding: '10px 18px', borderRadius: 999, fontSize: 14, fontWeight: 500,
                    border: '1px solid ' + (active ? 'var(--ink)' : 'var(--border)'),
                    background: active ? 'var(--ink)' : 'transparent',
                    color: active ? 'var(--card)' : 'var(--ink)',
                    transition: 'all 0.15s',
                  }}
                >
                  {active && <Icon name="check" size={13} style={{ marginRight: 6, verticalAlign: '-2px' }} />}
                  {opt.label}
                </button>
              );
            })}
          </div>
        </section>

        <div className="divider" />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <button className="btn btn-danger" onClick={() => {
            if (confirm('¿Cerrar sesión?')) actions.logout();
          }}>
            <Icon name="logout" size={15} />
            Cerrar sesión
          </button>
          <button className="btn btn-primary btn-lg" onClick={save}>
            {saved ? <><Icon name="check" size={16} /> Guardado</> : 'Guardar cambios'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------- Styles ----------------------

const authStyles = {
  root: {
    minHeight: '100vh',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
  },
  hero: {
    position: 'relative',
    background: 'linear-gradient(160deg, #1A1816 0%, #2D2620 60%, #4A2918 100%)',
    color: '#FBF6EC',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  heroOverlay: {
    position: 'absolute', inset: 0,
    backgroundImage: 'url("https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600&q=80")',
    backgroundSize: 'cover', backgroundPosition: 'center',
    opacity: 0.35,
    mixBlendMode: 'luminosity',
  },
  heroContent: {
    position: 'relative',
    padding: '48px 56px',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  brandRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  heroTextBlock: { maxWidth: 520 },
  heroEyebrow: {
    fontSize: 12, letterSpacing: '0.16em', textTransform: 'uppercase',
    color: '#E9C4B5', margin: '0 0 24px',
  },
  heroTitle: {
    fontFamily: 'var(--serif)', fontSize: 'clamp(3rem, 5vw, 4.5rem)',
    fontWeight: 400, lineHeight: 1.0, margin: 0, color: '#FBF6EC',
  },
  heroBody: {
    color: 'rgba(251, 246, 236, 0.75)',
    fontSize: 17, lineHeight: 1.6, marginTop: 24, maxWidth: 440,
  },
  heroFooter: {
    display: 'flex', gap: 40, marginTop: 56, paddingTop: 28,
    borderTop: '1px solid rgba(251, 246, 236, 0.2)',
  },
  heroStat: { flex: 1 },
  heroStatNum: { fontFamily: 'var(--serif)', fontSize: 32, color: '#FBF6EC' },
  heroStatLabel: { fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(251, 246, 236, 0.55)', marginTop: 2 },

  formSide: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '48px 32px',
    background: 'var(--bg)',
    overflowY: 'auto',
  },
  formInner: { width: '100%', maxWidth: 440 },

  errorBanner: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '12px 14px', background: 'rgba(139, 42, 42, 0.08)',
    color: 'var(--crimson)', borderRadius: 'var(--r-md)', fontSize: 14,
    border: '1px solid rgba(139, 42, 42, 0.2)',
  },
  pwToggle: {
    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
    color: 'var(--ink-soft)', padding: 6, borderRadius: 6,
  },
  link: { color: 'var(--ink)', textDecoration: 'underline', textUnderlineOffset: 2, fontWeight: 500 },

  eyebrow: {
    fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase',
    color: 'var(--ink-soft)', margin: '0 0 14px',
  },
};

// Responsive: hide hero on mobile
{
  const id = 'horizeo-auth-style';
  if (!document.getElementById(id)) {
    const s = document.createElement('style');
    s.id = id;
    s.textContent = `
      @media (max-width: 880px) {
        .auth-root { grid-template-columns: 1fr !important; }
        .auth-hero { display: none !important; }
      }
    `;
    document.head.appendChild(s);
  }
}
// patch root
const _AuthOrig = AuthScreen;
function AuthScreenResp() {
  return (
    <div className="auth-root" style={authStyles.root}>
      <div className="auth-hero" style={{ ...authStyles.hero }}>
        <div style={authStyles.heroOverlay} />
        <div style={authStyles.heroContent}>
          <div style={authStyles.brandRow}>
            <Logo color="#FBF6EC" />
          </div>
          <div style={{ flex: 1 }} />
          <div style={authStyles.heroTextBlock}>
            <p style={authStyles.heroEyebrow}>Plataforma de viaje · Estética intencional</p>
            <h1 style={authStyles.heroTitle}>
              Viaja con <span className="serif-i" style={{ color: '#E9C4B5' }}>intención</span>,
              <br />
              no con prisa.
            </h1>
            <p style={authStyles.heroBody}>
              Descubre destinos curados, construye itinerarios al detalle y gestiona cada reserva
              en un solo lugar. Diseñado para viajeros que valoran el cómo tanto como el dónde.
            </p>
          </div>
          <div style={authStyles.heroFooter}>
            <div style={authStyles.heroStat}>
              <div style={authStyles.heroStatNum}>120+</div>
              <div style={authStyles.heroStatLabel}>destinos curados</div>
            </div>
            <div style={authStyles.heroStat}>
              <div style={authStyles.heroStatNum}>14k</div>
              <div style={authStyles.heroStatLabel}>itinerarios creados</div>
            </div>
            <div style={authStyles.heroStat}>
              <div style={authStyles.heroStatNum}>4.8</div>
              <div style={authStyles.heroStatLabel}>satisfacción media</div>
            </div>
          </div>
        </div>
      </div>
      <div style={authStyles.formSide}>
        <div style={authStyles.formInner}>
          <AuthFormSwitcher />
        </div>
      </div>
    </div>
  );
}

function AuthFormSwitcher() {
  const [mode, setMode] = React.useState('login');
  return (
    <>
      <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'center' }}>
        <Tabs
          tabs={[{ value: 'login', label: 'Iniciar sesión' }, { value: 'register', label: 'Crear cuenta' }]}
          value={mode}
          onChange={setMode}
        />
      </div>
      {mode === 'login' ? <LoginForm onSwap={() => setMode('register')} /> : <RegisterForm onSwap={() => setMode('login')} />}
    </>
  );
}

Object.assign(window, {
  AuthScreen: AuthScreenResp,
  ProfileScreen,
  Logo,
});
